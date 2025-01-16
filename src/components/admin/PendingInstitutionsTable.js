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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { institutionVerificationService } from '@/lib/services/institutionVerificationService'

export function PendingInstitutionsTable() {
  const [pendingRequests, setPendingRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)

  const handleVerify = async (requestId) => {
    // Implement verification logic
  }

  const handleReject = async (requestId) => {
    // Implement rejection logic
  }

  return (
    <div className='space-y-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Institution Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.institutionName}</TableCell>
              <TableCell>{request.institutionType}</TableCell>
              <TableCell>{request.state}</TableCell>
              <TableCell>{request.contactPersonName}</TableCell>
              <TableCell>
                <Badge
                  variant={request.status === 'pending' ? 'default' : 'success'}
                >
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell className='space-x-2'>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='outline' size='sm'>
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Institution Request Details</DialogTitle>
                    </DialogHeader>
                    {/* Request details form */}
                  </DialogContent>
                </Dialog>
                <Button
                  variant='default'
                  size='sm'
                  onClick={() => handleVerify(request.id)}
                >
                  Verify
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => handleReject(request.id)}
                >
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
