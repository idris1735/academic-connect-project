'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

export default function ScheduleActivity({ onSchedule }) {
  const [date, setDate] = useState(new Date())
  const [activityName, setActivityName] = useState('')
  const [time, setTime] = useState('')
  const { toast } = useToast()

  const handleSchedule = () => {
    if (!activityName || !time) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      })
      return
    }

    const scheduledActivity = {
      name: activityName,
      date,
      time,
    }

    onSchedule(scheduledActivity)
    toast({
      title: 'Activity Scheduled',
      description: `${activityName} scheduled for ${date.toDateString()} at ${time}.`,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Schedule Activity</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule an Activity</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="activity" className="text-right">
              Activity
            </Label>
            <Input
              id="activity"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="col-span-3"
            />
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        <Button onClick={handleSchedule}>Schedule</Button>
      </DialogContent>
    </Dialog>
  )
}
