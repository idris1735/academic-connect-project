class CalendarService {
    constructor() {
      this.events = [
        {
          id: '1',
          title: 'Research Discussion',
          start: new Date('2024-11-30T10:00:00'),
          end: new Date('2024-11-30T11:00:00'),
          description: 'Discussion about recent findings',
          attendees: ['diana.souza@example.com', 'john.doe@example.com']
        },
        {
          id: '2',
          title: 'Project Review',
          start: new Date('2024-12-01T14:00:00'),
          end: new Date('2024-12-01T15:00:00'),
          description: 'Monthly project progress review',
          attendees: ['maria.rodriguez@example.com']
        }
      ]
    }
  
    getEvents() {
      return this.events
    }
  
    addEvent(event) {
      const newEvent = {
        ...event,
        id: Math.random().toString(36).substr(2, 9)
      }
      this.events.push(newEvent)
      return newEvent
    }
  
    deleteEvent(id) {
      const initialLength = this.events.length
      this.events = this.events.filter(event => event.id !== id)
      return this.events.length !== initialLength
    }
  }
  
  export default new CalendarService()
  
  