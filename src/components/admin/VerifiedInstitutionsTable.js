'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { institutionTypes, getAllInstitutions } from '@/data/institutions'

export function VerifiedInstitutionsTable() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [institutions, setInstitutions] = useState(getAllInstitutions())

  const filteredInstitutions = institutions.filter((inst) => {
    const matchesSearch = searchQuery
      ? inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    const matchesType = typeFilter ? inst.institutionType === typeFilter : true

    return matchesSearch && matchesType
  })

  return (
    <div className='space-y-4'>
      {/* Filters */}
      <div className='flex gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search institutions...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-8'
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className='w-[200px]'>
            <SelectValue placeholder='Filter by type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=''>All Types</SelectItem>
            {institutionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Institution Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Departments</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInstitutions.map((institution) => (
            <TableRow key={institution.abbreviation}>
              <TableCell>
                <div>
                  <div className='font-medium'>{institution.name}</div>
                  <div className='text-sm text-muted-foreground'>
                    {institution.abbreviation}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {
                  institutionTypes.find(
                    (t) => t.value === institution.institutionType
                  )?.label
                }
              </TableCell>
              <TableCell>
                <Badge variant='outline'>{institution.category}</Badge>
              </TableCell>
              <TableCell>{institution.state}</TableCell>
              <TableCell>{institution.departments?.length || 0}</TableCell>
              <TableCell className='space-x-2'>
                <Button variant='outline' size='sm'>
                  Edit
                </Button>
                <Button variant='outline' size='sm'>
                  View Details
                </Button>
                <Button variant='destructive' size='sm'>
                  Deactivate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
