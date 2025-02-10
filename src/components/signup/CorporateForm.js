'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card'
import { Progress } from '../ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useToast } from '../ui/use-toast'
import { useSignupStore } from '../../lib/store/signupStore'
import { BackButton } from '../ui/back-button'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.jpg', '.png']

// Add organization types
const organizationTypes = [
  { id: 'government', label: 'Government Agency' },
  { id: 'private', label: 'Private Company' },
  { id: 'ngo', label: 'Non-Governmental Organization' },
  { id: 'research', label: 'Research Institute' },
  { id: 'other', label: 'Other' },
]

// Add industry types
const industryTypes = [
  { id: 'technology', label: 'Technology' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'education', label: 'Education' },
  { id: 'finance', label: 'Finance' },
  { id: 'manufacturing', label: 'Manufacturing' },
  { id: 'energy', label: 'Energy' },
  { id: 'agriculture', label: 'Agriculture' },
  { id: 'other', label: 'Other' },
]

export function CorporateForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const { setStep, updateFormData, formData, subOption } = useSignupStore(
    (state) => ({
      setStep: state.setStep,
      updateFormData: state.updateFormData,
      formData: state.formData,
      subOption: state.subOption,
    })
  )

  const [form, setForm] = useState({
    organizationName: formData?.organizationName || '',
    organizationType: formData?.organizationType || '',
    industry: formData?.industry || '',
    adminName: formData?.adminName || '',
    officialEmail: formData?.officialEmail || '',
    password: formData?.password || '',
    logo: formData?.logo || null,
    address: formData?.address || '',
    website: formData?.website || '',
    accessCode: formData?.accessCode || '',
    employeeName: formData?.employeeName || '',
    employeeEmail: formData?.employeeEmail || '',
    jobTitle: formData?.jobTitle || '',
    department: formData?.department || '',
  })

  const validateForm = () => {
    // Base validation for fields required for both Admin and Employee
    if (!form.organizationName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter organization name',
        variant: 'destructive',
      })
      return false
    }

    if (!form.organizationType) {
      toast({
        title: 'Error',
        description: 'Please select organization type',
        variant: 'destructive',
      })
      return false
    }

    if (!form.industry.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter industry',
        variant: 'destructive',
      })
      return false
    }

    // Additional validation for Admin-specific fields
    if (subOption === 'Admin') {
      if (!form.adminName.trim()) {
        toast({
          title: 'Error',
          description: 'Please enter admin name',
          variant: 'destructive',
        })
        return false
      }

      if (!form.officialEmail.trim()) {
        toast({
          title: 'Error',
          description: 'Please enter official email',
          variant: 'destructive',
        })
        return false
      }

      if (form.password.length < 8) {
        toast({
          title: 'Error',
          description: 'Password must be at least 8 characters long',
          variant: 'destructive',
        })
        return false
      }
    }

    // Additional validation for Employee-specific fields
    if (subOption === 'Employee') {
      if (!form.employeeName.trim()) {
        toast({
          title: 'Error',
          description: 'Please enter employee name',
          variant: 'destructive',
        })
        return false
      }

      if (!form.employeeEmail.trim()) {
        toast({
          title: 'Error',
          description: 'Please enter employee email',
          variant: 'destructive',
        })
        return false
      }

      if (!form.jobTitle.trim()) {
        toast({
          title: 'Error',
          description: 'Please enter job title',
          variant: 'destructive',
        })
        return false
      }

      if (!form.accessCode.trim()) {
        toast({
          title: 'Error',
          description: 'Please enter access code',
          variant: 'destructive',
        })
        return false
      }
    }

    return true
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name) => (value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'Error',
        description: `File size should not exceed ${
          MAX_FILE_SIZE / 1024 / 1024
        }MB`,
        variant: 'destructive',
      })
      return false
    }

    const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`
    if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
      toast({
        title: 'Error',
        description: `Only ${ALLOWED_FILE_TYPES.join(', ')} files are allowed`,
        variant: 'destructive',
      })
      return false
    }

    return true
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) {
      setForm((prev) => ({ ...prev, logo: file }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // Simulate form submission with progress
      for (let i = 0; i <= 100; i += 20) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Update global state
      updateFormData(form)

      toast({
        title: 'Success',
        description: 'Your information has been saved successfully',
      })

      // Move to next step
      setStep(4)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save your information. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='w-full max-w-md mx-auto'
    >
      <Card className='relative overflow-hidden'>
        {isLoading && (
          <Progress
            value={progress}
            className='absolute top-0 left-0 right-0 h-1 rounded-none'
          />
        )}

        <CardHeader className='space-y-6'>
          <BackButton onClick={() => setStep(2)} disabled={isLoading} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='space-y-2 pt-4'
          >
            <h2 className='text-2xl font-bold tracking-tight'>
              {subOption === 'Admin'
                ? 'Corporate Setup'
                : 'Employee Registration'}
            </h2>
            <p className='text-sm text-muted-foreground'>
              Please provide details to complete your registration
            </p>
          </motion.div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Organization Name */}
            <div className='space-y-2'>
              <Label htmlFor='organizationName'>Organization Name</Label>
              <Input
                id='organizationName'
                name='organizationName'
                value={form.organizationName}
                onChange={handleInputChange}
                placeholder='Enter organization name'
                required
                disabled={isLoading}
              />
            </div>

            {/* Organization Type */}
            <div className='space-y-2'>
              <Label htmlFor='organizationType'>Organization Type</Label>
              <Select
                value={form.organizationType}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, organizationType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select organization type' />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Industry */}
            <div className='space-y-2'>
              <Label htmlFor='industry'>Industry</Label>
              <Select
                value={form.industry}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, industry: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select industry' />
                </SelectTrigger>
                <SelectContent>
                  {industryTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Admin-Specific Fields */}
            {subOption === 'Admin' && (
              <>
                <div className='space-y-2'>
                  <Label htmlFor='adminName'>Admin Name</Label>
                  <Input
                    id='adminName'
                    name='adminName'
                    value={form.adminName}
                    onChange={handleInputChange}
                    placeholder='Enter admin name'
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='officialEmail'>Official Email</Label>
                  <Input
                    id='officialEmail'
                    name='officialEmail'
                    type='email'
                    value={form.officialEmail}
                    onChange={handleInputChange}
                    placeholder='Enter official email'
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    id='password'
                    name='password'
                    type='password'
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder='Create password'
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='logo'>Organization Logo</Label>
                  <Input
                    id='logo'
                    name='logo'
                    type='file'
                    onChange={handleFileChange}
                    accept='image/*'
                    disabled={isLoading}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='address'>Address</Label>
                  <Textarea
                    id='address'
                    name='address'
                    value={form.address}
                    onChange={handleInputChange}
                    placeholder='Enter organization address'
                    rows={3}
                    disabled={isLoading}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='website'>Website</Label>
                  <Input
                    id='website'
                    name='website'
                    type='url'
                    value={form.website}
                    onChange={handleInputChange}
                    placeholder='Enter website URL'
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {/* Employee-Specific Fields */}
            {subOption === 'Employee' && (
              <>
                <div className='space-y-2'>
                  <Label htmlFor='employeeName'>Employee Name</Label>
                  <Input
                    id='employeeName'
                    name='employeeName'
                    value={form.employeeName}
                    onChange={handleInputChange}
                    placeholder='Enter your full name'
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='employeeEmail'>Employee Email</Label>
                  <Input
                    id='employeeEmail'
                    name='employeeEmail'
                    type='email'
                    value={form.employeeEmail}
                    onChange={handleInputChange}
                    placeholder='Enter your work email'
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='jobTitle'>Job Title</Label>
                  <Input
                    id='jobTitle'
                    name='jobTitle'
                    value={form.jobTitle}
                    onChange={handleInputChange}
                    placeholder='Enter your job title'
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='department'>Department</Label>
                  <Input
                    id='department'
                    name='department'
                    value={form.department}
                    onChange={handleInputChange}
                    placeholder='Enter your department'
                    disabled={isLoading}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='accessCode'>Access Code</Label>
                  <Input
                    id='accessCode'
                    name='accessCode'
                    value={form.accessCode}
                    onChange={handleInputChange}
                    placeholder='Enter organization access code'
                    required
                    disabled={isLoading}
                  />
                </div>
              </>
            )}
          </form>
        </CardContent>

        <CardFooter className='flex flex-col gap-4'>
          <Button
            onClick={handleSubmit}
            className='w-full'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              'Continue'
            )}
          </Button>
          <p className='text-xs text-center text-muted-foreground'>
            Your information helps us personalize your research experience
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default CorporateForm
