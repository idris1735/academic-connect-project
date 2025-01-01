'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Trash2, Plus } from 'lucide-react'

export function DepartmentForm({ department, onChange, onRemove }) {
  const addProgram = () => {
    const updatedPrograms = [
      ...department.programs,
      { name: '', type: '', duration: '' },
    ]
    onChange({ ...department, programs: updatedPrograms })
  }

  const removeProgram = (index) => {
    const updatedPrograms = department.programs.filter((_, i) => i !== index)
    onChange({ ...department, programs: updatedPrograms })
  }

  return (
    <Card className='p-4 space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='font-medium'>Department Details</h3>
        <Button
          variant='ghost'
          size='sm'
          onClick={onRemove}
          className='text-destructive'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <Input
          placeholder='Department Name'
          value={department.name}
          onChange={(e) => onChange({ ...department, name: e.target.value })}
        />
        <Input
          placeholder='Department Code'
          value={department.code}
          onChange={(e) => onChange({ ...department, code: e.target.value })}
        />
      </div>

      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h4 className='text-sm font-medium'>Programs</h4>
          <Button variant='outline' size='sm' onClick={addProgram}>
            <Plus className='h-4 w-4 mr-2' />
            Add Program
          </Button>
        </div>

        {department.programs.map((program, index) => (
          <div key={index} className='grid grid-cols-3 gap-4'>
            <Input
              placeholder='Program Name'
              value={program.name}
              onChange={(e) => {
                const updatedPrograms = [...department.programs]
                updatedPrograms[index] = {
                  ...program,
                  name: e.target.value,
                }
                onChange({ ...department, programs: updatedPrograms })
              }}
            />
            <Input
              placeholder='Type'
              value={program.type}
              onChange={(e) => {
                const updatedPrograms = [...department.programs]
                updatedPrograms[index] = {
                  ...program,
                  type: e.target.value,
                }
                onChange({ ...department, programs: updatedPrograms })
              }}
            />
            <div className='flex gap-2'>
              <Input
                placeholder='Duration'
                value={program.duration}
                onChange={(e) => {
                  const updatedPrograms = [...department.programs]
                  updatedPrograms[index] = {
                    ...program,
                    duration: e.target.value,
                  }
                  onChange({ ...department, programs: updatedPrograms })
                }}
              />
              <Button
                variant='ghost'
                size='sm'
                onClick={() => removeProgram(index)}
                className='text-destructive'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
