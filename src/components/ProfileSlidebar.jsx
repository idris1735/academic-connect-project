'use client'

import { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast'

export default function ProfileSidebar() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    views: 0,
    connections: 0,
  })
  const [showToast, setShowToast] = useState(false)
  const [toastDetails, setToastDetails] = useState({
    title: '',
    description: '',
    variant: 'default',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/profile')
      const data = await response.json()

      if (response.ok) {
        setProfile(data.profile)
      } else {
        setShowToast(true)
        setToastDetails({
          title: 'Error',
          description: data.message || 'Failed to fetch profile',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setShowToast(true)
      setToastDetails({
        title: 'Error',
        description: 'Failed to fetch profile',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          title: profile.title,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsEditing(false)
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        })
      } else {
        setShowToast(true)
        setToastDetails({
          title: 'Error',
          description: data.message || 'Failed to update profile',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setShowToast(true)
      setToastDetails({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      })
    }
  }

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleCancel = () => {
    setIsEditing(false)
    fetchProfile() // Reset to original data
  }

  if (isLoading) {
    return (
      <aside className="md:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-t-lg" />
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto -mt-8" />
            <div className="space-y-3 mt-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="md:col-span-1">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <div className="h-20 w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 rounded-full bg-white border-4 border-white">
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-xl font-medium">
            <Avatar>
          <AvatarImage src={`/${profile.photoURL}`} />
            <AvatarFallback className="text-4xl font-semibold bg-[#6366F1] text-white">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
            </div>
          </div>
        </div>
        <ToastProvider>

        {showToast && (
          <Toast
            variant={toastDetails.variant}
            onOpenChange={(open) => setShowToast(open)}
          >
            <ToastTitle>{toastDetails.title}</ToastTitle>
            <ToastDescription>{toastDetails.description}</ToastDescription>
            <ToastClose />
          </Toast>
        )}

        <ToastViewport />
        </ToastProvider>
        <div className="pt-12 pb-6 px-4 text-center">
          {isEditing
            ? (
            <div className="space-y-2">
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />
              <input
                name="title"
                value={profile.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#6366F1] text-white rounded-md hover:bg-[#5457E5]"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
              )
            : (
            <>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.title}</p>
              <button
                onClick={handleEdit}
                className="mt-2 flex items-center gap-2 px-4 py-2 text-[#6366F1] hover:bg-gray-100 rounded-md mx-auto"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </button>
            </>
              )}
          <div className="mt-4 border-t pt-4">
            <p className="text-sm">
              <span className="font-bold">{profile.views}</span> profile views
            </p>
            <p className="text-sm mt-2">
              <span className="font-bold">{profile.connections}</span> connections
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
