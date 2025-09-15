"use client"

import type React from "react"
import { useState } from "react"
import { useSiteData } from "@/providers/site-data-provider"
import { ImageUpload } from "@/components/ui/image-upload"
import { uploadFile } from "@/lib/upload"
import { SaveButton } from "@/components/save-button"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-foreground/60">{label}</span>
      {children}
    </label>
  )
}

export default function SiteSettingsPage() {
  const { siteSettings, updateSettings } = useSiteData()
  const settings = siteSettings[0] || {}
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [localSettings, setLocalSettings] = useState(settings)
  const [logoUploadStatus, setLogoUploadStatus] = useState<'idle' | 'uploading' | 'uploaded' | 'error'>('idle')
  const [bannerUploadStatus, setBannerUploadStatus] = useState<'idle' | 'uploading' | 'uploaded' | 'error'>('idle')

  const handleLogoUpload = async (file: File) => {
    try {
      setUploading(true)
      setUploadError(null)
      setLogoUploadStatus('uploading')
      
      // Upload to Supabase storage
      const { url, error } = await uploadFile(file, 'logos', `logo-${Date.now()}-${file.name}`)
      
      if (error) {
        setUploadError('Failed to upload image. Please try again.')
        setLogoUploadStatus('error')
        return
      }
      
      // Update local settings
      setLocalSettings(prev => ({ ...prev, logo_url: url }))
      setHasChanges(true)
      setLogoUploadStatus('uploaded')
      
      // Reset status after 2 seconds
      setTimeout(() => setLogoUploadStatus('idle'), 2000)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('Failed to upload image. Please try again.')
      setLogoUploadStatus('error')
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    try {
      // Update settings without waiting for completion
      updateSettings(localSettings)
      setHasChanges(false)
    } catch (error) {
      console.error('Save error:', error)
      // Re-enable save button on error
      setHasChanges(true)
    }
  }
  
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Site Settings</h2>
        <SaveButton onSave={handleSave} disabled={!hasChanges} />
      </div>
      <div className="grid gap-4">
        <Field label="Site Name">
          <input
            className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
            value={localSettings.site_name || ''}
            onChange={(e) => handleInputChange('site_name', e.target.value)}
            placeholder="Enter site name..."
          />
        </Field>
        <Field label="Site Description">
          <textarea
            className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
            rows={3}
            value={localSettings.site_description || ''}
            onChange={(e) => handleInputChange('site_description', e.target.value)}
            placeholder="Enter site description..."
          />
        </Field>
        <Field label="Primary Color">
          <input
            type="color"
            className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm h-12"
            value={localSettings.primary_color || '#000000'}
            onChange={(e) => handleInputChange('primary_color', e.target.value)}
          />
        </Field>
        <Field label="Logo Upload">
          <div className="space-y-2">
            <ImageUpload 
              onImageUpload={handleLogoUpload}
              className="w-full"
            />
                {logoUploadStatus === 'uploading' && (
                  <p className="text-sm text-blue-600 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    Uploading image...
                  </p>
                )}
                {logoUploadStatus === 'uploaded' && (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Uploaded successfully!
                  </p>
                )}
                {logoUploadStatus === 'error' && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {uploadError}
                  </p>
                )}
            {settings.logo_url && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-2">Current logo:</p>
                <img 
                  src={settings.logo_url} 
                  alt="Current logo" 
                  className="w-20 h-20 object-cover rounded border border-border/40"
                />
                <button
                  onClick={() => updateSettings({ logo_url: null })}
                  className="mt-2 text-xs text-red-600 hover:text-red-700"
                >
                  Remove logo
                </button>
              </div>
            )}
          </div>
        </Field>
        <Field label="Site Banner Image (Optional)">
          <div className="space-y-2">
                <ImageUpload 
                  onImageUpload={async (file) => {
                    try {
                      setBannerUploadStatus('uploading')
                      setUploadError(null)
                      
                      const { url, error } = await uploadFile(file, 'logos', `banner-${Date.now()}-${file.name}`)
                      
                      if (error) {
                        setUploadError('Failed to upload banner image. Please try again.')
                        setBannerUploadStatus('error')
                        return
                      }
                      
                      setLocalSettings(prev => ({ ...prev, banner_url: url }))
                      setHasChanges(true)
                      setBannerUploadStatus('uploaded')
                      
                      // Reset status after 2 seconds
                      setTimeout(() => setBannerUploadStatus('idle'), 2000)
                    } catch (error) {
                      console.error('Upload error:', error)
                      setUploadError('Failed to upload banner image. Please try again.')
                      setBannerUploadStatus('error')
                    }
                  }}
                  className="w-full"
                />
                {bannerUploadStatus === 'uploading' && (
                  <p className="text-sm text-blue-600 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    Uploading banner...
                  </p>
                )}
                {bannerUploadStatus === 'uploaded' && (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Banner uploaded successfully!
                  </p>
                )}
                {bannerUploadStatus === 'error' && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {uploadError}
                  </p>
                )}
            {settings.banner_url && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-2">Current banner:</p>
                <img 
                  src={settings.banner_url} 
                  alt="Current banner" 
                  className="w-full h-32 object-cover rounded border border-border/40"
                />
                <button
                  onClick={() => updateSettings({ banner_url: null })}
                  className="mt-2 text-xs text-red-600 hover:text-red-700"
                >
                  Remove banner
                </button>
              </div>
            )}
          </div>
        </Field>
      </div>

      <h3 className="mt-10 mb-3 text-sm font-semibold text-foreground/80">Contact</h3>
      <div className="grid gap-4">
        <Field label="Email">
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" value={localSettings.contact_email || ''} onChange={(e) => handleInputChange('contact_email', e.target.value)} />
        </Field>
        <Field label="Phone">
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" value={localSettings.contact_phone || ''} onChange={(e) => handleInputChange('contact_phone', e.target.value)} />
        </Field>
        <Field label="Location">
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" value={localSettings.contact_location || ''} onChange={(e) => handleInputChange('contact_location', e.target.value)} />
        </Field>
      </div>

      <h3 className="mt-10 mb-3 text-sm font-semibold text-foreground/80">Social Links</h3>
      <div className="grid gap-4">
        <Field label="Facebook">
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" value={localSettings.social_facebook || ''} onChange={(e) => handleInputChange('social_facebook', e.target.value)} />
        </Field>
        <Field label="Twitter/X">
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" value={localSettings.social_twitter || ''} onChange={(e) => handleInputChange('social_twitter', e.target.value)} />
        </Field>
        <Field label="Instagram">
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" value={localSettings.social_instagram || ''} onChange={(e) => handleInputChange('social_instagram', e.target.value)} />
        </Field>
        <Field label="LinkedIn">
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" value={localSettings.social_linkedin || ''} onChange={(e) => handleInputChange('social_linkedin', e.target.value)} />
        </Field>
      </div>

      <div className="mt-8 p-4 bg-muted/40 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Current Settings</h3>
        <div className="text-xs text-muted-foreground space-y-1">
          <div><strong>Site Name:</strong> {localSettings.site_name || 'Not set'}</div>
          <div><strong>Description:</strong> {localSettings.site_description || 'Not set'}</div>
          <div><strong>Primary Color:</strong> {localSettings.primary_color || 'Not set'}</div>
          <div><strong>Logo:</strong> {localSettings.logo_url ? 'Uploaded' : 'Not set'}</div>
          <div><strong>Banner:</strong> {localSettings.banner_url ? 'Uploaded' : 'Not set'}</div>
          <div><strong>Email:</strong> {localSettings.contact_email || 'Not set'}</div>
          <div><strong>Phone:</strong> {localSettings.contact_phone || 'Not set'}</div>
          <div><strong>Location:</strong> {localSettings.contact_location || 'Not set'}</div>
          <div><strong>Facebook:</strong> {localSettings.social_facebook || 'Not set'}</div>
          <div><strong>Twitter:</strong> {localSettings.social_twitter || 'Not set'}</div>
          <div><strong>Instagram:</strong> {localSettings.social_instagram || 'Not set'}</div>
          <div><strong>LinkedIn:</strong> {localSettings.social_linkedin || 'Not set'}</div>
        </div>
      </div>
    </div>
  )
}
