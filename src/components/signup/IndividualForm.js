'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Briefcase, BookOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'

const IndividualForm = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    occupation: '',
    interests: '',
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
              Individual Information
            </h2>
            <p className='text-sm text-muted-foreground'>
              Tell us about yourself and your research interests
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
              <Label htmlFor='occupation' className='text-sm font-medium'>
                Occupation
              </Label>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                  <Briefcase className='h-4 w-4' />
                </div>
                <Input
                  type='text'
                  id='occupation'
                  placeholder='Enter your current occupation'
                  className='pl-9'
                  value={formData.occupation}
                  onChange={(e) =>
                    setFormData({ ...formData, occupation: e.target.value })
                  }
                  disabled={isLoading}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className='space-y-2'
            >
              <Label htmlFor='interests' className='text-sm font-medium'>
                Research Interests
              </Label>
              <div className='relative'>
                <div className='absolute left-3 top-3 text-muted-foreground'>
                  <BookOpen className='h-4 w-4' />
                </div>
                <Textarea
                  id='interests'
                  placeholder='Describe your research interests and areas of focus'
                  className='min-h-[120px] pl-9 resize-none'
                  value={formData.interests}
                  onChange={(e) =>
                    setFormData({ ...formData, interests: e.target.value })
                  }
                  disabled={isLoading}
                  required
                />
              </div>
            </motion.div>
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

export default IndividualForm
