import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { changePassword } from '@/redux/features/profileSlice'
import { Button } from './ui/button'
import { Input } from './ui/input'

export function PasswordChangeForm() {
  const dispatch = useDispatch()
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    try {
      await dispatch(changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })).unwrap()
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div>
        <label className="text-sm font-medium">Current Password</label>
        <Input
          type="password"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium">New Password</label>
        <Input
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Confirm New Password</label>
        <Input
          type="password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <Button type="submit" className="bg-[#6366F1] hover:bg-[#5355CC]">
        Change Password
      </Button>
    </form>
  )
} 