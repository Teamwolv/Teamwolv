"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    let isMounted = true
    
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        }
        if (isMounted) {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    getInitialSession()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (isMounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })
    
    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        console.error('Supabase auth error:', error)
        return { error: error.message || 'Authentication failed' }
      }
      
      setUser(data.user)
      setSession(data.session)
      return { error: null }
    } catch (e) {
      console.error('Sign in error:', e)
      return { error: 'Network error. Please check your connection and try again.' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'user' // Default role, can be changed by admin later
          }
        }
      })
      
      if (error) {
        console.error('Supabase signup error:', error)
        
        // Handle specific error cases
        if (error.message.includes('already registered')) {
          return { error: 'This email is already registered. Please sign in instead.' }
        } else if (error.message.includes('password')) {
          return { error: 'Password must be at least 6 characters long.' }
        } else if (error.message.includes('email')) {
          return { error: 'Please enter a valid email address.' }
        } else {
          return { error: error.message || 'Sign up failed. Please try again.' }
        }
      }
      
      // If user is created but session is null, it means email confirmation is required
      if (data.user && !data.session) {
        return { error: 'Please check your email and click the confirmation link to complete your registration.' }
      }
      
      setUser(data.user)
      setSession(data.session)
      return { error: null }
    } catch (e) {
      console.error('Sign up error:', e)
      return { error: 'Network error. Please check your connection and try again.' }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/reset-password` })
      if (error) return { error }
      return { error: null }
    } finally {
      setLoading(false)
    }
  }

  const value = { user, session, loading, signIn, signUp, signOut, resetPassword }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
