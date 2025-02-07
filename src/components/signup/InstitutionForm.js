'use client'

import { useState, useMemo, useEffect } from 'react'
import { institutionTypes, nigerianInstitutions } from '@/data/institutions'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { getUniqueStates } from '@/lib/utils/formHelpers'
import { useSignupStore } from '@/lib/store/signupStore'
import { Loader2 } from 'lucide-react'
import { accessCodeService } from '@/lib/services/accessCodeService'

export default function InstitutionForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const { setStep, updateFormData, subOption } = useSignupStore((state) => ({
    setStep: state.setStep,
    updateFormData: state.updateFormData,
    subOption: state.subOption,
  }))

  const [formData, setFormData] = useState({
    // Basic Institution Info
    institutionType: '',
    state: '',
    institution: '',

    // Staff Fields
    staffName: '',
    staffEmail: '',
    department: '',
    position: '',
    staffId: '',
    accessCode: '',

    // Admin Fields
    adminName: '',
    officialEmail: '',
    institutionLogo: null,
    address: '',
    website: '',
    adminAccessCode: '',
  })

  // Filter institutions based on type and state
  const filteredInstitutions = useMemo(() => {
    let institutions = nigerianInstitutions.filter(
      (inst) => inst.institutionType === formData.institutionType
    )

    if (formData.state && formData.state !== 'all') {
      institutions = institutions.filter(
        (inst) => inst.state === formData.state
      )
    }

    return institutions
  }, [formData.institutionType, formData.state])

  // Get departments for selected institution
  const departments = useMemo(() => {
    const selectedInstitution = nigerianInstitutions.find(
      (inst) => inst.abbreviation === formData.institution
    )
    return selectedInstitution?.departments || []
  }, [formData.institution])

  const validateEmail = (email, type) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }

    const institution = nigerianInstitutions.find(
      (inst) => inst.abbreviation === formData.institution
    )

    if (!institution?.domains?.some((domain) => email.endsWith(domain))) {
      return `Please use an official ${
        institution?.name || 'institution'
      } email address`
    }

    return null
  }

  const validateAccessCode = async () => {
    const code =
      subOption === 'Admin' ? formData.adminAccessCode : formData.accessCode
    if (!code) return 'Access code is required'

    try {
      const result = await accessCodeService.validateCode(
        code,
        formData.institutionType,
        subOption.toLowerCase(),
        formData.institution
      )

      if (!result.valid) {
        return result.message || 'Invalid access code'
      }

      return null
    } catch (error) {
      return 'Error validating access code'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Basic validation
      if (
        !formData.institutionType ||
        !formData.state ||
        !formData.institution
      ) {
        throw new Error('Please select your institution details')
      }

      // Validate based on subOption
      if (subOption === 'Admin') {
        if (
          !formData.adminName ||
          !formData.officialEmail ||
          !formData.adminAccessCode
        ) {
          throw new Error('Please fill in all administrator details')
        }

        const emailError = validateEmail(formData.officialEmail, 'admin')
        if (emailError) throw new Error(emailError)
      } else {
        if (
          !formData.staffName ||
          !formData.staffEmail ||
          !formData.department ||
          !formData.accessCode
        ) {
          throw new Error('Please fill in all staff details')
        }

        const emailError = validateEmail(formData.staffEmail, 'staff')
        if (emailError) throw new Error(emailError)
      }

      // Validate access code
      const accessCodeError = await validateAccessCode()
      if (accessCodeError) throw new Error(accessCodeError)

      // Update global state
      updateFormData(formData)

      // Move to next step
      setStep(4)
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Add this function to show demo codes
  const showDemoCodes = () => {
    toast({
      title: 'Demo Access Codes 🔑',
      description: (
        <div className='mt-2 space-y-2'>
          <p className='font-semibold'>For Testing Purposes:</p>
          <div className='text-sm space-y-1'>
            <p>🏛️ Universities:</p>
            <p className='pl-2'>
              Admin:{' '}
              <code className='bg-muted px-1 rounded'>INST-ADMIN-2024</code>
            </p>
            <p className='pl-2'>
              Staff:{' '}
              <code className='bg-muted px-1 rounded'>INST-STAFF-2024</code>
            </p>
            <p className='pl-2 text-xs text-muted-foreground'>
              Email format: staff@unilag.edu.ng, admin@ui.edu.ng
            </p>
          </div>
          <div className='text-sm space-y-1'>
            <p>🎓 Institution-Specific:</p>
            <p className='pl-2'>
              UNILAG Admin:{' '}
              <code className='bg-muted px-1 rounded'>UNILAG-ADMIN-24</code>
            </p>
            <p className='pl-2'>
              UI Staff:{' '}
              <code className='bg-muted px-1 rounded'>UI-STAFF-24</code>
            </p>
          </div>
          <p className='text-xs text-muted-foreground mt-2'>
            Click to copy any code
          </p>
        </div>
      ),
      duration: 10000, // Show for 10 seconds
    })
  }

  // Add this useEffect to show the toast when component mounts
  useEffect(() => {
    showDemoCodes()
  }, [])

  return (
    <form className='space-y-6' onSubmit={handleSubmit}>
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>
            {subOption === 'Admin'
              ? 'Institution Administrator Setup'
              : 'Staff Registration'}
          </h2>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={showDemoCodes}
            className='text-muted-foreground hover:text-primary'
          >
            Show Demo Codes
          </Button>
        </div>
        <p className='text-sm text-muted-foreground'>
          {subOption === 'Admin'
            ? 'Set up your institution administrator account'
            : 'Register as a staff member of your institution'}
        </p>
      </div>

      {/* Institution Selection Section */}
      <div className='space-y-4'>
        <h3 className='text-sm font-medium'>Institution Details</h3>

        <Select
          value={formData.institutionType}
          onValueChange={(value) => {
            setFormData((prev) => ({
              ...prev,
              institutionType: value,
              institution: '',
              department: '',
            }))
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select Institution Type' />
          </SelectTrigger>
          <SelectContent className='max-h-[200px] overflow-y-auto'>
            {institutionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={formData.state}
          onValueChange={(value) => {
            setFormData((prev) => ({
              ...prev,
              state: value,
              institution: '',
              department: '',
            }))
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select State' />
          </SelectTrigger>
          <SelectContent className='max-h-[200px] overflow-y-auto'>
            <SelectItem key='all-states' value='all'>
              All States
            </SelectItem>
            {getUniqueStates().map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={formData.institution}
          onValueChange={(value) => {
            setFormData((prev) => ({
              ...prev,
              institution: value,
              department: '',
            }))
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select an Institution' />
          </SelectTrigger>
          <SelectContent className='max-h-[200px] overflow-y-auto'>
            {filteredInstitutions.length > 0 ? (
              filteredInstitutions.map((inst) => (
                <SelectItem key={inst.abbreviation} value={inst.abbreviation}>
                  {inst.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem key='no-institutions' value='none' disabled>
                No institutions found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Admin/Staff Specific Fields */}
      {formData.institution && (
        <div className='space-y-4'>
          <h3 className='text-sm font-medium'>
            {subOption === 'Admin' ? 'Administrator Details' : 'Staff Details'}
          </h3>

          {subOption === 'Admin' ? (
            // Admin Fields
            <>
              <div className='space-y-2'>
                <Label htmlFor='adminName'>Full Name</Label>
                <Input
                  id='adminName'
                  value={formData.adminName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      adminName: e.target.value,
                    }))
                  }
                  placeholder='Enter your full name'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='officialEmail'>Official Email</Label>
                <Input
                  id='officialEmail'
                  type='email'
                  value={formData.officialEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      officialEmail: e.target.value,
                    }))
                  }
                  placeholder='Enter your institutional email'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='adminAccessCode'>
                  Administrator Access Code
                </Label>
                <Input
                  id='adminAccessCode'
                  value={formData.adminAccessCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      adminAccessCode: e.target.value,
                    }))
                  }
                  placeholder='Enter administrator access code'
                />
              </div>
            </>
          ) : (
            // Staff Fields
            <>
              <div className='space-y-2'>
                <Label htmlFor='staffName'>Full Name</Label>
                <Input
                  id='staffName'
                  value={formData.staffName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      staffName: e.target.value,
                    }))
                  }
                  placeholder='Enter your full name'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='staffEmail'>Institutional Email</Label>
                <Input
                  id='staffEmail'
                  type='email'
                  value={formData.staffEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      staffEmail: e.target.value,
                    }))
                  }
                  placeholder='Enter your institutional email'
                />
              </div>

              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, department: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select Department' />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.code} value={dept.code}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className='space-y-2'>
                <Label htmlFor='position'>Position</Label>
                <Input
                  id='position'
                  value={formData.position}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      position: e.target.value,
                    }))
                  }
                  placeholder='Enter your position'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='staffId'>Staff ID</Label>
                <Input
                  id='staffId'
                  value={formData.staffId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      staffId: e.target.value,
                    }))
                  }
                  placeholder='Enter your staff ID'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='accessCode'>Access Code</Label>
                <Input
                  id='accessCode'
                  value={formData.accessCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      accessCode: e.target.value,
                    }))
                  }
                  placeholder='Enter staff access code'
                />
              </div>
            </>
          )}
        </div>
      )}

      <div className='flex gap-4 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={() => setStep((prev) => prev - 1)}
        >
          Back
        </Button>
        <Button type='submit' disabled={loading} className='flex-1'>
          {loading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Submitting...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </form>
  )
}
