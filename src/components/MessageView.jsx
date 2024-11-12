import { useState } from 'react'
import { Send } from 'lucide-react'

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

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.32))]">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">{conversation.name}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {/* Message history would go here */}
      </div>
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 px-4 py-2 border rounded-full"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  )
}