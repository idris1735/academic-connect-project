'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Building2, Users, Factory } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const CorporateForm = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    organizationName: '',
    industry: '',
    employeeCount: '',
  })

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

  const formFields = [
    {
      id: 'organizationName',
      label: 'Organization Name',
      type: 'text',
      icon: Building2,
      placeholder: 'Enter your organization name',
    },
    {
      id: 'industry',
      label: 'Industry',
      type: 'text',
      icon: Factory,
      placeholder: 'e.g., Technology, Healthcare, Government',
    },
    {
      id: 'employeeCount',
      label: 'Number of Employees',
      type: 'number',
      icon: Users,
      placeholder: 'Enter total employee count',
    },
  ]

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
            <h2 className='text-2xl font-bold tracking-tight'>
              Corporate/Government Information
            </h2>
            <p className='text-sm text-muted-foreground'>
              Please provide details about your organization
            </p>
          </motion.div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {formFields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className='space-y-2'
              >
                <Label htmlFor={field.id} className='text-sm font-medium'>
                  {field.label}
                </Label>
                <div className='relative'>
                  <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                    <field.icon className='h-4 w-4' />
                  </div>
                  <Input
                    type={field.type}
                    id={field.id}
                    placeholder={field.placeholder}
                    className='pl-9'
                    value={formData[field.id]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    disabled={isLoading}
                    required
                  />
                </div>
              </motion.div>
            ))}
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
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default CorporateForm
