'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useToast } from '../ui/use-toast'
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card'

export function InstitutionRequestForm() {
  const [formData, setFormData] = useState({
    institutionName: '',
    institutionType: '',
    state: '',
    city: '',
    website: '',
    contactPersonName: '',
    contactEmail: '',
    contactPhone: '',
    position: '',
    additionalInfo: '',
    documents: [], // For document uploads
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Submit request to admin panel
    // Send confirmation email
    // Add to pending institutions queue
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Institution Registration</CardTitle>
        <p className='text-sm text-muted-foreground'>
          Can't find your institution? Submit a request for registration.
        </p>
      </CardHeader>
      <CardContent>
        <form className='space-y-4'>
          {/* Institution Details */}
          <div className='space-y-2'>
            <Input
              placeholder='Institution Name'
              value={formData.institutionName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  institutionName: e.target.value,
                }))
              }
            />
            {/* Other fields */}
          </div>

          {/* Contact Person Details */}
          <div className='space-y-2'>
            <Input
              placeholder='Your Name'
              value={formData.contactPersonName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactPersonName: e.target.value,
                }))
              }
            />
            {/* Other contact fields */}
          </div>

          <Button type='submit'>Submit Request</Button>
        </form>
      </CardContent>
    </Card>
  )
}
