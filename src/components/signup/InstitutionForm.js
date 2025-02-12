'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2,
  Building2,
  Upload,
  School,
  Info,
  HelpCircle,
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
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
import { institutionTypes, nigerianInstitutions } from '../../data/institutions'
import { getUniqueStates } from '../../lib/utils/formHelpers'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

const commonDepartments = [
  // Faculty of Engineering
  { id: 'CSE', code: 'CSE', name: 'Computer Science & Engineering' },
  { id: 'EEE', code: 'EEE', name: 'Electrical & Electronic Engineering' },
  { id: 'MCE', code: 'MCE', name: 'Mechanical Engineering' },
  { id: 'CVE', code: 'CVE', name: 'Civil Engineering' },
  { id: 'CHE', code: 'CHE', name: 'Chemical Engineering' },
  { id: 'PME', code: 'PME', name: 'Petroleum Engineering' },
  { id: 'BME', code: 'BME', name: 'Biomedical Engineering' },
  { id: 'AEE', code: 'AEE', name: 'Agricultural Engineering' },

  // Faculty of Sciences
  { id: 'PHY_SCI', code: 'PHY', name: 'Physics' },
  { id: 'CHM', code: 'CHM', name: 'Chemistry' },
  { id: 'MTH', code: 'MTH', name: 'Mathematics' },
  { id: 'BIO', code: 'BIO', name: 'Biological Sciences' },
  { id: 'BCH', code: 'BCH', name: 'Biochemistry' },
  { id: 'MCB', code: 'MCB', name: 'Microbiology' },
  { id: 'STA', code: 'STA', name: 'Statistics' },
  { id: 'GEO_SCI', code: 'GEO', name: 'Geology' },

  // Faculty of Medicine
  { id: 'MED', code: 'MED', name: 'Medicine & Surgery' },
  { id: 'DNS', code: 'DNS', name: 'Dentistry' },
  { id: 'PHA', code: 'PHA', name: 'Pharmacy' },
  { id: 'NUR', code: 'NUR', name: 'Nursing Science' },
  { id: 'PHY_MED', code: 'PHY', name: 'Physiotherapy' },
  { id: 'RAD', code: 'RAD', name: 'Radiography' },

  // Faculty of Arts
  { id: 'ENG_ART', code: 'ENG', name: 'English Language & Literature' },
  { id: 'HIS', code: 'HIS', name: 'History & International Studies' },
  { id: 'LIN', code: 'LIN', name: 'Linguistics & African Languages' },
  { id: 'PHL', code: 'PHL', name: 'Philosophy' },
  { id: 'REL', code: 'REL', name: 'Religious Studies' },
  { id: 'THR', code: 'THR', name: 'Theatre Arts' },

  // Faculty of Social Sciences
  { id: 'ECO', code: 'ECO', name: 'Economics' },
  { id: 'SOC', code: 'SOC', name: 'Sociology' },
  { id: 'PSY', code: 'PSY', name: 'Psychology' },
  { id: 'POS', code: 'POS', name: 'Political Science' },
  { id: 'MAS', code: 'MAS', name: 'Mass Communication' },
  { id: 'GEO_SOC', code: 'GEO', name: 'Geography' },

  // Faculty of Management Sciences
  { id: 'ACC', code: 'ACC', name: 'Accounting' },
  { id: 'BUS', code: 'BUS', name: 'Business Administration' },
  { id: 'BNF', code: 'BNF', name: 'Banking & Finance' },
  { id: 'MKT', code: 'MKT', name: 'Marketing' },
  { id: 'HRM', code: 'HRM', name: 'Human Resource Management' },

  // Faculty of Education
  { id: 'EDU', code: 'EDU', name: 'Education Administration' },
  { id: 'GES', code: 'GES', name: 'Guidance & Counselling' },
  { id: 'EDE', code: 'EDE', name: 'Early Childhood Education' },
  { id: 'SED', code: 'SED', name: 'Special Education' },

  // Faculty of Environmental Sciences
  { id: 'ARC', code: 'ARC', name: 'Architecture' },
  { id: 'BLD', code: 'BLD', name: 'Building Technology' },
  { id: 'QSV', code: 'QSV', name: 'Quantity Surveying' },
  { id: 'URP', code: 'URP', name: 'Urban & Regional Planning' },

  // Faculty of Agriculture
  { id: 'AGR', code: 'AGR', name: 'Agricultural Science' },
  { id: 'AGE', code: 'AGE', name: 'Agricultural Economics' },
  { id: 'FST', code: 'FST', name: 'Food Science & Technology' },
  { id: 'AGX', code: 'AGX', name: 'Agricultural Extension' },
]

const validateInstitutionalEmail = (email, institution) => {
  if (!email) return false

  // Get institution domain from selected institution
  const selectedInstitution = nigerianInstitutions.find(
    (inst) => inst.abbreviation === institution
  )

  if (!selectedInstitution?.emailDomain) return false

  // Check if email ends with the institution's domain
  const emailDomain = email.split('@')[1]
  return (
    emailDomain?.toLowerCase() === selectedInstitution.emailDomain.toLowerCase()
  )
}

export function InstitutionForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const { setStep, updateFormData, subOption } = useSignupStore()

  const [formData, setFormData] = useState({
    institutionType: '',
    state: '',
    institution: '',
    staffName: '',
    staffEmail: '',
    department: '',
    position: '',
    staffId: '',
    accessCode: '',
    adminName: '',
    officialEmail: '',
    institutionLogo: null,
    address: '',
    website: '',
    adminAccessCode: '',
  })

  const [emailError, setEmailError] = useState('')

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (subOption === 'Staff' && emailError) {
      toast({
        title: 'Invalid Email',
        description: 'Please use your institutional email address',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate form submission with progress
      for (let i = 0; i <= 100; i += 20) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      updateFormData(formData)
      setStep(4)

      toast({
        title: 'Success',
        description: 'Your information has been saved successfully',
      })
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, institutionLogo: file }))
    }
  }

  const handleEmailChange = (e) => {
    const email = e.target.value
    setFormData((prev) => ({
      ...prev,
      staffEmail: email,
    }))

    // Clear error when empty
    if (!email) {
      setEmailError('')
      return
    }

    // Get selected institution's domain
    const selectedInstitution = nigerianInstitutions.find(
      (inst) => inst.abbreviation === formData.institution
    )

    if (!selectedInstitution?.emailDomain) {
      setEmailError('Please select an institution first')
      return
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    // Get domain from email
    const emailDomain = email.split('@')[1]?.toLowerCase()
    const institutionDomain = selectedInstitution.emailDomain.toLowerCase()

    // Check if email matches institution domain
    if (!emailDomain?.endsWith(institutionDomain)) {
      setEmailError(`Email must be from ${institutionDomain}`)
      return
    }

    // Clear error if all validations pass
    setEmailError('')
  }

  const InfoModal = ({ title, children, trigger }) => (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant='ghost'
            size='sm'
            className='group flex items-center gap-1 px-2 py-1 hover:bg-indigo-50 rounded-md transition-colors'
          >
            <Info className='h-4 w-4 text-indigo-600' />
            <span className='text-xs text-indigo-600 group-hover:underline'>
              Help
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-indigo-600'>
            <Info className='h-5 w-5' />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className='bg-indigo-50/50 rounded-lg'>{children}</div>
      </DialogContent>
    </Dialog>
  )

  // Add this new component for field tooltips
  const FieldTooltip = ({ content }) => (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='h-5 w-5 p-0 hover:bg-indigo-50 rounded-full'
          >
            <HelpCircle className='h-4 w-4 text-indigo-400 hover:text-indigo-600' />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side='right'
          className='bg-indigo-600 text-white border-indigo-600'
        >
          <p className='text-sm'>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='w-full max-w-md mx-auto p-6'
    >
      <Card className='relative overflow-hidden border-none shadow-lg'>
        {isLoading && (
          <Progress
            value={progress}
            className='absolute top-0 left-0 right-0 h-1 rounded-none bg-indigo-100'
          />
        )}

        <CardHeader className='space-y-6 pb-2 pt-8'>
          <BackButton onClick={() => setStep(2)} disabled={isLoading} />

          <div className='mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center transition-transform hover:scale-105'>
            {subOption === 'Admin' ? (
              <Building2 className='h-8 w-8 text-indigo-600' />
            ) : (
              <School className='h-8 w-8 text-indigo-600' />
            )}
          </div>

          <div className='space-y-2 text-center'>
            <h2 className='text-2xl font-bold tracking-tight text-gray-900'>
              {subOption === 'Admin'
                ? 'Institution Setup'
                : 'Staff Registration'}
            </h2>
            <p className='text-sm text-gray-500'>
              {subOption === 'Admin'
                ? 'Set up your institution profile'
                : 'Complete your staff registration'}
            </p>
          </div>
        </CardHeader>

        <CardContent className='px-8 pb-8 pt-4'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Institution Selection Section */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-semibold text-gray-900'>
                  Institution Details
                </h3>
                <InfoModal title='Institution Selection Guide'>
                  <div className='space-y-4 p-6 text-sm text-gray-600'>
                    <p className='font-medium text-indigo-600'>
                      Follow these steps to find your institution:
                    </p>
                    <ol className='list-decimal pl-4 space-y-3'>
                      <li className='pl-2'>
                        <span className='font-medium'>
                          Select institution type
                        </span>
                        <p className='text-gray-500 mt-1'>
                          Choose from University, College, or other categories
                        </p>
                      </li>
                      <li className='pl-2'>
                        <span className='font-medium'>Choose your state</span>
                        <p className='text-gray-500 mt-1'>
                          Select your state or view all institutions
                        </p>
                      </li>
                      <li className='pl-2'>
                        <span className='font-medium'>
                          Find your institution
                        </span>
                        <p className='text-gray-500 mt-1'>
                          Select from the filtered list of institutions
                        </p>
                      </li>
                    </ol>
                    <div className='mt-6 p-3 bg-amber-50 rounded-md border border-amber-200'>
                      <p className='text-amber-700 text-xs'>
                        Can't find your institution? Use the "Request
                        Institution Registration" option below.
                      </p>
                    </div>
                  </div>
                </InfoModal>
              </div>

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='institutionType'>Institution Type</Label>
                    <FieldTooltip content='Select the category that best describes your institution' />
                  </div>
                  <Select
                    value={formData.institutionType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        institutionType: value,
                        institution: '',
                        department: '',
                      }))
                    }
                  >
                    <SelectTrigger className='h-12 border-2 focus:border-indigo-600'>
                      <SelectValue placeholder='Select Institution Type' />
                    </SelectTrigger>
                    <SelectContent className='max-h-[300px] overflow-y-auto'>
                      {institutionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='state'>State</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        state: value,
                        institution: '',
                        department: '',
                      }))
                    }
                  >
                    <SelectTrigger className='h-12 border-2 focus:border-indigo-600'>
                      <SelectValue placeholder='Select State' />
                    </SelectTrigger>
                    <SelectContent className='max-h-[300px] overflow-y-auto'>
                      <SelectItem value='all'>All States</SelectItem>
                      {getUniqueStates().map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='institution'>Institution</Label>
                  <Select
                    value={formData.institution}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        institution: value,
                        department: '',
                      }))
                    }
                  >
                    <SelectTrigger className='h-12 border-2 focus:border-indigo-600'>
                      <SelectValue placeholder='Select an Institution' />
                    </SelectTrigger>
                    <SelectContent className='max-h-[300px] overflow-y-auto'>
                      {filteredInstitutions.map((inst) => (
                        <SelectItem
                          key={inst.abbreviation}
                          value={inst.abbreviation}
                        >
                          {inst.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {formData.institution && (
              <div className='space-y-6'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-sm font-semibold text-gray-900'>
                    {subOption === 'Admin'
                      ? 'Administrator Details'
                      : 'Staff Details'}
                  </h3>
                  <InfoModal
                    title={`${
                      subOption === 'Admin' ? 'Administrator' : 'Staff'
                    } Registration Guide`}
                    trigger={
                      <Button
                        variant='ghost'
                        size='sm'
                        className='group flex items-center gap-1 px-2 py-1 hover:bg-indigo-50 rounded-md transition-colors'
                      >
                        <Info className='h-4 w-4 text-indigo-600' />
                        <span className='text-xs text-indigo-600 group-hover:underline'>
                          View Requirements
                        </span>
                      </Button>
                    }
                  >
                    <div className='space-y-4 p-4 text-sm text-gray-600'>
                      {subOption === 'Admin' ? (
                        <>
                          <p>As an administrator, you will:</p>
                          <ul className='list-disc pl-4 space-y-2'>
                            <li>Manage your institution's profile</li>
                            <li>Add and verify staff members</li>
                            <li>Control access permissions</li>
                            <li>Manage institutional resources</li>
                          </ul>
                          <p className='mt-4 text-xs text-gray-500'>
                            Make sure you have the administrator access code
                            from your institution.
                          </p>
                        </>
                      ) : (
                        <>
                          <p>As a staff member, you will need:</p>
                          <ul className='list-disc pl-4 space-y-2'>
                            <li>Your institutional email address</li>
                            <li>Valid staff ID</li>
                            <li>Department information</li>
                            <li>Staff access code from your administrator</li>
                          </ul>
                          <p className='mt-4 text-xs text-gray-500'>
                            Contact your institution's administrator if you need
                            an access code.
                          </p>
                        </>
                      )}
                    </div>
                  </InfoModal>
                </div>

                {subOption === 'Admin' ? (
                  // Admin Fields with tooltips
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
                        placeholder='e.g., Prof. John A. Smith'
                        className='h-12 text-base border-2 focus:border-indigo-600 transition-colors'
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
                        placeholder='e.g., john.smith@unilag.edu.ng'
                        className='h-12 text-base border-2 focus:border-indigo-600 transition-colors'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='institutionLogo'>Institution Logo</Label>
                      <div className='relative'>
                        <Input
                          id='institutionLogo'
                          type='file'
                          onChange={handleFileChange}
                          accept='image/*'
                          className='h-12 text-base border-2 border-dashed focus:border-indigo-600 transition-colors'
                        />
                        <Upload className='absolute right-3 top-3 h-5 w-5 text-gray-400' />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='adminAccessCode'>Access Code</Label>
                        <FieldTooltip content='Enter the administrator verification code provided by the system' />
                      </div>
                      <Input
                        id='adminAccessCode'
                        value={formData.adminAccessCode}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            adminAccessCode: e.target.value,
                          }))
                        }
                        placeholder='e.g., ADMIN-2024-XXXX'
                        className='h-12 text-base border-2 focus:border-indigo-600 transition-colors'
                      />
                    </div>
                  </>
                ) : (
                  // Staff Fields with tooltips
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
                        placeholder='e.g., Dr. Sarah Johnson'
                        className='h-12 text-base border-2 focus:border-indigo-600 transition-colors'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='staffEmail'>
                        Institutional Email
                        {emailError && (
                          <span className='text-xs text-red-500 ml-2'>
                            {emailError}
                          </span>
                        )}
                      </Label>
                      <Input
                        id='staffEmail'
                        type='email'
                        value={formData.staffEmail}
                        onChange={handleEmailChange}
                        placeholder={`e.g., staff@${formData.institution?.toLowerCase()}.edu.ng`}
                        className={`h-12 text-base border-2 transition-colors ${
                          emailError
                            ? 'border-red-300 focus:border-red-500'
                            : 'focus:border-indigo-600'
                        }`}
                      />
                      {emailError && (
                        <p className='text-xs text-red-500 mt-1'>
                          {emailError}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='department'>Department</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            department: value,
                          }))
                        }
                      >
                        <SelectTrigger className='h-12 border-2 focus:border-indigo-600'>
                          <SelectValue placeholder='Select your department' />
                        </SelectTrigger>
                        <SelectContent
                          className='max-h-[280px] overflow-y-auto'
                          position='popper'
                          sideOffset={5}
                        >
                          <div className='p-2'>
                            <div className='grid grid-cols-1 gap-1'>
                              {commonDepartments.map((dept) => (
                                <SelectItem
                                  key={dept.id}
                                  value={dept.code}
                                  className='py-2.5 px-3 rounded-md cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 transition-colors'
                                >
                                  <div className='flex flex-col'>
                                    <span className='font-medium text-gray-900'>
                                      {dept.name}
                                    </span>
                                    <span className='text-xs text-gray-500'>
                                      {dept.code}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </div>
                          </div>
                        </SelectContent>
                      </Select>
                    </div>

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
                        placeholder='e.g., Associate Professor of Computer Science'
                        className='h-12 text-base border-2 focus:border-indigo-600 transition-colors'
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
                        placeholder='e.g., UNILAG/STAFF/2023/001'
                        className='h-12 text-base border-2 focus:border-indigo-600 transition-colors'
                      />
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='accessCode'>Access Code</Label>
                        <FieldTooltip content='Enter the staff access code provided by your administrator' />
                      </div>
                      <Input
                        id='accessCode'
                        value={formData.accessCode}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            accessCode: e.target.value,
                          }))
                        }
                        placeholder='e.g., STAFF-2024-XXXX'
                        className='h-12 text-base border-2 focus:border-indigo-600 transition-colors'
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className='flex flex-col gap-4 px-8 pb-8'>
          <Button
            onClick={handleSubmit}
            className='w-full h-12 bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-100'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                Processing...
              </>
            ) : (
              'Continue'
            )}
          </Button>
          <p className='text-xs text-center text-gray-500'>
            Your information helps us verify your institutional affiliation
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default InstitutionForm
