'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DepartmentForm } from './DepartmentForm'

export function InstitutionDetails({ institution, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [editMode, setEditMode] = useState(false)
  const [editedData, setEditedData] = useState(institution)

  return (
    <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
      <DialogHeader>
        <DialogTitle className='flex justify-between items-center'>
          <div>
            <span className='text-xl'>{institution.name}</span>
            <Badge variant='outline' className='ml-2'>
              {institution.category}
            </Badge>
          </div>
          {!editMode && (
            <Button variant='outline' onClick={() => setEditMode(true)}>
              Edit Institution
            </Button>
          )}
        </DialogTitle>
      </DialogHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='departments'>Departments</TabsTrigger>
          <TabsTrigger value='access'>Access Codes</TabsTrigger>
          <TabsTrigger value='activity'>Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium'>Abbreviation</label>
                <p>{institution.abbreviation}</p>
              </div>
              <div>
                <label className='text-sm font-medium'>Type</label>
                <p>{institution.institutionType}</p>
              </div>
              <div>
                <label className='text-sm font-medium'>Location</label>
                <p>{`${institution.city}, ${institution.state}`}</p>
              </div>
              <div>
                <label className='text-sm font-medium'>Website</label>
                <p>{institution.website}</p>
              </div>
              <div>
                <label className='text-sm font-medium'>Email Domains</label>
                <div className='flex flex-wrap gap-2'>
                  {institution.domains.map((domain) => (
                    <Badge key={domain} variant='secondary'>
                      {domain}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='departments' className='space-y-4'>
          {institution.departments.map((dept, index) => (
            <DepartmentForm
              key={index}
              department={dept}
              onChange={(updatedDept) => {
                const updatedDepts = [...editedData.departments]
                updatedDepts[index] = updatedDept
                setEditedData({ ...editedData, departments: updatedDepts })
              }}
              onRemove={() => {
                const updatedDepts = editedData.departments.filter(
                  (_, i) => i !== index
                )
                setEditedData({ ...editedData, departments: updatedDepts })
              }}
              readOnly={!editMode}
            />
          ))}
          {editMode && (
            <Button
              variant='outline'
              onClick={() =>
                setEditedData({
                  ...editedData,
                  departments: [
                    ...editedData.departments,
                    {
                      name: '',
                      code: '',
                      programs: [{ name: '', type: '', duration: '' }],
                    },
                  ],
                })
              }
            >
              Add Department
            </Button>
          )}
        </TabsContent>

        <TabsContent value='access' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Access Codes</CardTitle>
            </CardHeader>
            <CardContent>{/* Access code management UI */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='activity' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>{/* Activity log UI */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {editMode && (
        <div className='flex justify-end gap-2 mt-4'>
          <Button variant='outline' onClick={() => setEditMode(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onUpdate(editedData)
              setEditMode(false)
            }}
          >
            Save Changes
          </Button>
        </div>
      )}
    </DialogContent>
  )
}
