import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '@/redux/features/profileSlice'
import { Button } from './ui/button'
import { Input } from './ui/input'

export function ProfileEditForm() {
  const dispatch = useDispatch()
  const profileData = useSelector((state) => state.profile.profileData)
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    department: '',
    location: '',
  })

  // Update form data when profileData changes
  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        institution: profileData.institution || '',
        department: profileData.department || '',
        location: profileData.location || '',
      })
    }
  }, [profileData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(updateProfile(formData))
  }

  if (!profileData) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Institution</label>
        <Input
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Department</label>
        <Input
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Location</label>
        <Input
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div className="flex space-x-4">
        <Button type="submit" className="bg-[#6366F1] hover:bg-[#5355CC]">
          Save Changes
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => dispatch(toggleEditMode())}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
} 