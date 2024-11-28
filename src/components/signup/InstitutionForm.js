'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2,
  Building,
  GraduationCap,
  Microscope,
  CheckCircle2,
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

const InstitutionForm = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    institutionName: '',
    institutionType: '',
    researchFocus: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission with progress
    for (let i = 0; i <= 100; i += 20) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    onComplete(formData)
    setIsLoading(false)
  }

  const isFormValid =
    formData.institutionName &&
    formData.institutionType &&
    formData.researchFocus

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='space-y-2'
          >
            <div className='flex items-center space-x-2'>
              <GraduationCap className='h-6 w-6 text-primary' />
              <h2 className='text-2xl font-bold tracking-tight'>
                Educational Institution
              </h2>
            </div>
            <p className='text-sm text-muted-foreground'>
              Please provide details about your institution to help us customize
              your experience
            </p>
          </motion.div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className='space-y-2'
            >
              <Label htmlFor='institutionName' className='text-sm font-medium'>
                Institution Name
              </Label>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                  <Building className='h-4 w-4' />
                </div>
                <Input
                  type='text'
                  id='institutionName'
                  placeholder='Enter your institution name'
                  className='pl-9'
                  value={formData.institutionName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      institutionName: e.target.value,
                    })
                  }
                  disabled={isLoading}
                  required
                />
                {formData.institutionName && (
                  <CheckCircle2 className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500' />
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className='space-y-2'
            >
              <Label htmlFor='institutionType' className='text-sm font-medium'>
                Institution Type
              </Label>
              <TooltipProvider>
                <Select
                  disabled={isLoading}
                  value={formData.institutionType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, institutionType: value })
                  }
                >
                  <SelectTrigger id='institutionType' className='w-full'>
                    <div className='flex items-center'>
                      <GraduationCap className='mr-2 h-4 w-4 text-muted-foreground' />
                      <SelectValue placeholder='Select institution type' />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {institutionTypes.map((type) => (
                      <Tooltip key={type.value}>
                        <TooltipTrigger asChild>
                          <SelectItem
                            value={type.value}
                            className='cursor-pointer'
                          >
                            {type.label}
                          </SelectItem>
                        </TooltipTrigger>
                        <TooltipContent side='right' className='max-w-[200px]'>
                          <p>{type.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </SelectContent>
                </Select>
              </TooltipProvider>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className='space-y-2'
            >
              <Label htmlFor='researchFocus' className='text-sm font-medium'>
                Primary Research Focus
              </Label>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                  <Microscope className='h-4 w-4' />
                </div>
                <Input
                  type='text'
                  id='researchFocus'
                  placeholder='e.g., Computer Science, Biology, Engineering'
                  className='pl-9'
                  value={formData.researchFocus}
                  onChange={(e) =>
                    setFormData({ ...formData, researchFocus: e.target.value })
                  }
                  disabled={isLoading}
                  required
                />
                {formData.researchFocus && (
                  <CheckCircle2 className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500' />
                )}
              </div>
            </motion.div>
          </form>
        </CardContent>

        <CardFooter className='flex flex-col gap-4'>
          <Button
            onClick={handleSubmit}
            className='w-full relative overflow-hidden group'
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              <>
                Continue
                <motion.div
                  className='absolute inset-0 bg-primary/10'
                  initial={false}
                  animate={{
                    x: isFormValid ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.5 }}
                />
              </>
            )}
          </Button>
          <div className='text-xs text-center space-y-2'>
            <p className='text-muted-foreground'>
              Your institution will be verified to ensure data quality
            </p>
            <motion.div
              className='flex items-center justify-center space-x-1 text-primary'
              animate={{ opacity: isFormValid ? 1 : 0.5 }}
            >
              <CheckCircle2 className='h-3 w-3' />
              <span>
                {isFormValid
                  ? 'All fields completed'
                  : 'Please complete all fields'}
              </span>
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default InstitutionForm
