'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { institutionTypes } from '@/data/institutions'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

export function AddInstitutionForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    city: '',
    abbreviation: '',
    website: '',
    institutionType: '',
    category: '',
    domains: [''],
    departments: [
      {
        name: '',
        code: '',
        programs: [
          {
            name: '',
            type: '',
            duration: '',
          },
        ],
      },
    ],
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Validate and submit
      toast({
        title: 'Success',
        description: 'Institution added successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const addDepartment = () => {
    setFormData((prev) => ({
      ...prev,
      departments: [
        ...prev.departments,
        {
          name: '',
          code: '',
          programs: [{ name: '', type: '', duration: '' }],
        },
      ],
    }))
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <Input
              placeholder='Institution Name'
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <Input
              placeholder='Abbreviation'
              value={formData.abbreviation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  abbreviation: e.target.value,
                }))
              }
            />
          </div>

          <Select
            value={formData.institutionType}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, institutionType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Institution Type' />
            </SelectTrigger>
            <SelectContent>
              {institutionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Add more form fields */}

          <Button type='submit'>Add Institution</Button>
        </form>
      </CardContent>
    </Card>
  )
}
