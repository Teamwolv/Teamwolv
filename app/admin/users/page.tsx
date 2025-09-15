"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-provider"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    role?: string
    phone?: string
    department?: string
  }
  created_at: string
  last_sign_in_at?: string
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user',
    phone: '',
    department: ''
  })
  const [inviteData, setInviteData] = useState({ email: '', password: '', full_name: '', role: 'admin' })
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data: { users }, error } = await supabase.auth.admin.listUsers()
      if (error) { setMessage({ type: 'error', text: 'Failed to fetch users' }); return }
      setUsers(users || [])
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch users' })
    } finally { setLoading(false) }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteData)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Invite failed')
      setMessage({ type: 'success', text: 'Invitation created. User can sign in now.' })
      setInviteData({ email: '', password: '', full_name: '', role: 'admin' })
      await fetchUsers()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Invite failed' })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        user_metadata: { full_name: formData.full_name, role: formData.role, phone: formData.phone, department: formData.department },
        email_confirm: true
      })
      if (error) { setMessage({ type: 'error', text: error.message }); return }
      if (data.user) {
        setMessage({ type: 'success', text: 'User created successfully!' })
        setFormData({ email: '', password: '', full_name: '', role: 'user', phone: '', department: '' })
        fetchUsers()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create user' })
    } finally { setLoading(false) }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    try {
      setLoading(true)
      const { error } = await supabase.auth.admin.updateUserById(editingUser.id, {
        user_metadata: { full_name: formData.full_name, role: formData.role, phone: formData.phone, department: formData.department }
      })
      if (error) { setMessage({ type: 'error', text: error.message }); return }
      setMessage({ type: 'success', text: 'User updated successfully!' })
      setEditingUser(null)
      setFormData({ email: '', password: '', full_name: '', role: 'user', phone: '', department: '' })
      fetchUsers()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update user' })
    } finally { setLoading(false) }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      setLoading(true)
      const { error } = await supabase.auth.admin.deleteUser(userId)
      if (error) { setMessage({ type: 'error', text: error.message }); return }
      setMessage({ type: 'success', text: 'User deleted successfully!' })
      fetchUsers()
    } finally { setLoading(false) }
  }

  const startEdit = (user: User) => {
    setEditingUser(user)
    setFormData({ 
      email: user.email || '', 
      password: '', 
      full_name: user.user_metadata?.full_name || '', 
      role: user.user_metadata?.role || 'user', 
      phone: user.user_metadata?.phone || '', 
      department: user.user_metadata?.department || '' 
    })
  }

  const cancelEdit = () => {
    setEditingUser(null)
    setFormData({ email: '', password: '', full_name: '', role: 'user', phone: '', department: '' })
  }

  if (!currentUser) return <div className="p-8 text-center">Please sign in to access this page.</div>

  return (
    <div className="grid gap-8 md:grid-cols-[400px_1fr]">
      {/* Invite Section */}
      <div className="rounded-xl border border-border/40 bg-muted/40 p-6">
        <h3 className="mb-4 text-lg font-semibold">Invite User (temp password)</h3>
        <form onSubmit={handleInvite} className="space-y-3">
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" placeholder="Email" value={inviteData.email} onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })} required />
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" placeholder="Full name" value={inviteData.full_name} onChange={(e) => setInviteData({ ...inviteData, full_name: e.target.value })} />
          <select className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" value={inviteData.role} onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" placeholder="Temp password" value={inviteData.password} onChange={(e) => setInviteData({ ...inviteData, password: e.target.value })} required />
          <button type="submit" className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50">Invite</button>
        </form>
      </div>

      {/* Create/Edit Section */}
      <div className="rounded-xl border border-border/40 bg-muted/40 p-6">
        <h3 className="mb-6 text-lg font-semibold">{editingUser ? 'Edit User' : 'Create New User'}</h3>
        {message && (
          <div className={`mb-4 p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>{message.text}</div>
        )}
        <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={!!editingUser}
            />
          </div>

          {!editingUser && (
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              Role
            </label>
            <select
              className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              Phone
            </label>
            <input
              type="tel"
              className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              Department
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
            </button>
            
            {editingUser && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 rounded-md border border-border/50 bg-muted text-sm hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Users list remains unchanged below (existing code) */}
      <div className="space-y-4 col-span-2">
        <h3 className="text-lg font-semibold mb-4">Current Users ({users.length})</h3>
        
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No users found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="grid gap-4 rounded-xl border border-border/40 bg-muted/40 p-4 md:grid-cols-[1fr_200px]"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-semibold">
                      {user.user_metadata?.full_name || 'No Name'}
                    </strong>
                    <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                      user.user_metadata?.role === 'admin' 
                        ? 'bg-red-100 text-red-700' 
                        : user.user_metadata?.role === 'moderator'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.user_metadata?.role?.toUpperCase() || 'USER'}
                    </span>
                  </div>
                  
                  <div className="text-xs text-foreground/60 space-y-1">
                    <div>📧 {user.email}</div>
                    {user.user_metadata?.phone && <div>📱 {user.user_metadata.phone}</div>}
                    {user.user_metadata?.department && <div>🏢 {user.user_metadata.department}</div>}
                    <div>📅 Created: {new Date(user.created_at).toLocaleDateString()}</div>
                    {user.last_sign_in_at && (
                      <div>🕒 Last Sign In: {new Date(user.last_sign_in_at).toLocaleDateString()}</div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(user)}
                      className="rounded-md border border-border/50 bg-muted px-3 py-1.5 text-xs hover:border-primary/40 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.id === currentUser.id}
                      className="rounded-md border border-border/50 bg-muted px-3 py-1.5 text-xs text-red-500 hover:border-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
