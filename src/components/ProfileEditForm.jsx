import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '@/redux/features/profileSlice'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function ProfileEditForm() {
  const dispatch = useDispatch()
  const profileData = useSelector((state) => state.profile.profileData)
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    department: '',
    location: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await dispatch(updateProfile(formData))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!profileData) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='text-sm font-medium'>Name</label>
        <Input
          name='name'
          value={formData.name}
          onChange={handleChange}
          className='mt-1'
        />
      </div>
      <div>
        <label className='text-sm font-medium'>Institution</label>
        <Input
          name='institution'
          value={formData.institution}
          onChange={handleChange}
          className='mt-1'
        />
      </div>
      <div>
        <label className='text-sm font-medium'>Department</label>
        <Input
          name='department'
          value={formData.department}
          onChange={handleChange}
          className='mt-1'
        />
      </div>
      <div>
        <label className='text-sm font-medium'>Location</label>
        <Input
          name='location'
          value={formData.location}
          onChange={handleChange}
          className='mt-1'
        />
      </div>
      <div className='flex space-x-4'>
        <Button
          type='submit'
          className='bg-[#6366F1] hover:bg-[#5355CC]'
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className='flex items-center'>
              <LoadingSpinner size='sm' className='mr-2' />
              <span>Saving...</span>
            </div>
          ) : (
            'Save Changes'
          )}
        </Button>
        <Button
          type='button'
          variant='outline'
          onClick={() => dispatch(toggleEditMode())}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
