'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2,
  Building,
  GraduationCap,
  Microscope,
  CheckCircle2,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const InstitutionForm = ({ onComplete, onBack, subOption }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    institutionName: '',
    institutionType: '',
    researchFocus: '',
    adminName: '',
    officialEmail: '',
    password: '',
    logo: null,
    address: '',
    website: '',
    accessCode: '',
    staffName: '',
    staffEmail: '',
    staffRole: '',
  })

  const institutionTypes = [
    {
      value: 'university',
      label: 'University',
      description:
        'Higher education institution offering undergraduate and graduate programs',
    },
    {
      value: 'college',
      label: 'College',
      description:
        'Post-secondary institution focused on specific fields or programs',
    },
    {
      value: 'research_center',
      label: 'Research Center',
      description: 'Dedicated facility for scientific research and development',
    },
    {
      value: 'other',
      label: 'Other',
      description: 'Other types of educational or research institutions',
    },
  ]

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

  const isFormValid =
    formData.institutionName &&
    formData.institutionType &&
    formData.researchFocus &&
    (subOption === 'Admin'
      ? formData.adminName && formData.officialEmail && formData.password
      : formData.staffName && formData.staffEmail && formData.staffRole)

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
            <div className='flex items-center space-x-2'>
              <GraduationCap className='h-6 w-6 text-primary' />
              <h2 className='text-2xl font-bold tracking-tight'>
                {subOption === 'Admin'
                  ? 'Institution Admin Registration'
                  : 'Institution Staff Registration'}
              </h2>
            </div>
            <p className='text-sm text-muted-foreground'>
              {subOption === 'Admin'
                ? 'Provide details for registering your institution as an admin'
                : 'Provide details to join your institution as a staff member'}
            </p>
          </motion.div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Institution Name */}
            <div className='space-y-2'>
              <Label htmlFor='institutionName'>Institution Name</Label>
              <Input
                id='institutionName'
                name='institutionName'
                value={formData.institutionName}
                onChange={handleInputChange}
                placeholder='Enter institution name'
                required
                disabled={isLoading}
              />
            </div>

            {/* Institution Type */}
            <div className='space-y-2'>
              <Label htmlFor='institutionType'>Institution Type</Label>
              <TooltipProvider>
                <Select
                  disabled={isLoading}
                  value={formData.institutionType}
                  onValueChange={handleSelectChange('institutionType')}
                >
                  <SelectTrigger id='institutionType' className='w-full'>
                    <SelectValue placeholder='Select institution type' />
                  </SelectTrigger>
                  <SelectContent>
                    {institutionTypes.map((type) => (
                      <Tooltip key={type.value}>
                        <TooltipTrigger asChild>
                          <SelectItem value={type.value}>
                            {type.label}
                          </SelectItem>
                        </TooltipTrigger>
                        <TooltipContent side='right'>
                          <p>{type.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </SelectContent>
                </Select>
              </TooltipProvider>
            </div>

            {/* Dynamic Fields for Admin/Staff */}
            {subOption === 'Admin' ? (
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
              </>
            ) : (
              <>
                <Input
                  id='staffName'
                  name='staffName'
                  value={formData.staffName}
                  onChange={handleInputChange}
                  placeholder='Staff Name'
                  required
                  disabled={isLoading}
                />
                <Input
                  id='staffEmail'
                  name='staffEmail'
                  type='email'
                  value={formData.staffEmail}
                  onChange={handleInputChange}
                  placeholder='Staff Email'
                  required
                  disabled={isLoading}
                />
                <Input
                  id='staffRole'
                  name='staffRole'
                  value={formData.staffRole}
                  onChange={handleInputChange}
                  placeholder='Staff Role'
                  required
                  disabled={isLoading}
                />
              </>
            )}
          </form>
        </CardContent>

        <CardFooter className='flex flex-col gap-4'>
          <Button type='submit' className='w-full' disabled={!isFormValid}>
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

export default InstitutionForm
