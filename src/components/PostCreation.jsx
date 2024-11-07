'use client'

import { useState } from 'react'
import { MessageSquare, Users2, Briefcase, Image } from "lucide-react"

export default function PostCreation({ onPostCreate }) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('research')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (content.trim()) {
      onPostCreate(content, image, category)
      setContent('')
      setImage('')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-medium">
            AC
          </div>
          <input
            placeholder="Start a post"
            className="flex-grow px-3 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Image URL"
            className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <select
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="research">Research</option>
            <option value="publication">Publication</option>
            <option value="job">Job</option>
          </select>
        </div>
        <div className="flex justify-between">
          <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-md hover:bg-[#5457E5]">
            <MessageSquare className="h-4 w-4" />
            Post
          </button>
          <button type="button" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <Image className="h-4 w-4" />
            Image
          </button>
          <button type="button" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <Users2 className="h-4 w-4" />
            Research
          </button>
          <button type="button" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <Briefcase className="h-4 w-4" />
            Job
          </button>
        </div>
      </form>
    </div>
  )
}