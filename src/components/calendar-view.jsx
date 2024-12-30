'use client'

import { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Clock, CalendarIcon } from 'lucide-react'

export function CalendarView() {
  const [date, setDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    time: '09:00',
    type: 'meeting'
  })

  const handleAddEvent = () => {
    const event = {
      id: Math.random().toString(),
      ...newEvent
    }
    setEvents([...events, event])
    setNewEvent({
      title: '',
      date: new Date(),
      time: '09:00',
      type: 'meeting'
    })
  }

  const getEventsForDate = (date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <Card className="flex-1">
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>
      
      <Card className="flex-1">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Events for {date?.toLocaleDateString()}
            </h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>
                    Create a new event for your calendar
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Event Type</Label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(value) => 
                        setNewEvent({ ...newEvent, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddEvent}>Add Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <ScrollArea className="h-[300px]">
            {getEventsForDate(date || new Date()).length > 0 ? (
              <div className="space-y-4">
                {getEventsForDate(date || new Date()).map((event) => (
                  <Card key={event.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{event.title}</span>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" />
                            {event.time}
                          </div>
                        </div>
                      </div>
                      <Badge variant={
                        event.type === 'meeting' ? 'default' :
                        event.type === 'deadline' ? 'destructive' : 'secondary'
                      }>
                        {event.type}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <CalendarIcon className="h-8 w-8 mb-2" />
                <p>No events scheduled for this day</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

