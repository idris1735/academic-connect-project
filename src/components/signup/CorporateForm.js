'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2,
  Building2,
  Users,
  Factory,
  Briefcase,
  MapPin,
  Mail,
  Lock,
  ArrowLeft,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const CorporateForm = ({ onComplete, onBack, subOption }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    industry: '',
    adminName: '',
    officialEmail: '',
    password: '',
    logo: null,
    address: '',
    website: '',
    accessCode: '',
    employeeName: '',
    employeeEmail: '',
    jobTitle: '',
    department: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name) => (value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, logo: e.target.files[0] }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate progress
    for (let i = 0; i <= 100; i += 20) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    onComplete(formData)
    setIsLoading(false)
  }

  const isFormValid = () => {
    // Base validation for fields required for both Admin and Employee
    const baseFieldsValid =
      formData.organizationName?.trim() &&
      formData.organizationType?.trim() &&
      formData.industry?.trim()

    // Additional validation for Admin-specific fields
    if (subOption === 'Admin') {
      return (
        baseFieldsValid &&
        formData.adminName?.trim() &&
        formData.officialEmail?.trim() &&
        formData.password?.trim()
      )
    }

    // Additional validation for Employee-specific fields
    if (subOption === 'Employee') {
      return (
        baseFieldsValid &&
        formData.employeeName?.trim() &&
        formData.employeeEmail?.trim() &&
        formData.jobTitle?.trim()
      )
    }

    return false
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

        <CardHeader>
          <Button
            variant='ghost'
            className='absolute left-2 top-2'
            onClick={onBack}
          >
            <ArrowLeft className='h-4 w-4' />
            <span className='sr-only'>Go back</span>
          </Button>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='space-y-2'
          >
            <h2 className='text-2xl font-bold tracking-tight'>
              {subOption === 'Admin'
                ? 'Corporate/Government Admin Registration'
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
                value={formData.organizationName}
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
                onValueChange={handleSelectChange('organizationType')}
                value={formData.organizationType}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select organization type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='corporate'>Corporate</SelectItem>
                  <SelectItem value='government'>Government</SelectItem>
                  <SelectItem value='non_profit'>Non-Profit</SelectItem>
                  <SelectItem value='other'>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Industry */}
            <div className='space-y-2'>
              <Label htmlFor='industry'>Industry</Label>
              <Input
                id='industry'
                name='industry'
                value={formData.industry}
                onChange={handleInputChange}
                placeholder='Enter industry or sector'
                required
                disabled={isLoading}
              />
            </div>

            {/* Admin-Specific Fields */}
            {subOption === 'Admin' && (
              <>
                <Input
                  id='adminName'
                  name='adminName'
                  value={formData.adminName}
                  onChange={handleInputChange}
                  placeholder='Admin Name'
                  required
                  disabled={isLoading}
                />
                <Input
                  id='officialEmail'
                  name='officialEmail'
                  type='email'
                  value={formData.officialEmail}
                  onChange={handleInputChange}
                  placeholder='Admin Email'
                  required
                  disabled={isLoading}
                />
                <Input
                  id='password'
                  name='password'
                  type='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder='Password'
                  required
                  disabled={isLoading}
                />
                <Input
                  id='logo'
                  name='logo'
                  type='file'
                  onChange={handleFileChange}
                  accept='image/*'
                />
                <Textarea
                  id='address'
                  name='address'
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder='Enter organization address'
                  rows={3}
                />
                <Input
                  id='website'
                  name='website'
                  type='url'
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder='Website'
                />
              </>
            )}

            {/* Employee-Specific Fields */}
            {subOption === 'Employee' && (
              <>
                <Input
                  id='employeeName'
                  name='employeeName'
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  placeholder='Employee Name'
                  required
                  disabled={isLoading}
                />
                <Input
                  id='employeeEmail'
                  name='employeeEmail'
                  type='email'
                  value={formData.employeeEmail}
                  onChange={handleInputChange}
                  placeholder='Employee Email'
                  required
                  disabled={isLoading}
                />
                <Input
                  id='jobTitle'
                  name='jobTitle'
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder='Job Title'
                  required
                  disabled={isLoading}
                />
                <Input
                  id='department'
                  name='department'
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder='Department'
                  required
                  disabled={isLoading}
                />
                <Input
                  id='accessCode'
                  name='accessCode'
                  value={formData.accessCode}
                  onChange={handleInputChange}
                  placeholder='Access Code'
                  required
                  disabled={isLoading}
                />
              </>
            )}
          </form>
        </CardContent>

        <CardFooter className='flex flex-col gap-4'>
          <Button
            onClick={handleSubmit}
            type='submit'
            className='w-full'
            disabled={!isFormValid() || isLoading}
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
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default CorporateForm
