import { useState } from 'react'
import { Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function MessageView({ conversation }) {
  const [message, setMessage] = useState('')

  const handleSend = (e) => {
    e.preventDefault()
    if (message.trim()) {
      // Here you would typically send the message to an API
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a conversation to start messaging</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {conversation.type === 'discussion' && '#'}
          {conversation.name}
        </h2>
      </div>
      <ScrollArea className="flex-1 p-6">
        {/* Message history would go here */}
      </ScrollArea>
      <form onSubmit={handleSend} className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" className="bg-[#6366F1] hover:bg-[#5457E5]">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}