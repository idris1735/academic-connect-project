'use client'

import { useState, useRef } from 'react'
import { MessageSquare, Users2, Briefcase, Image, FileText, Film, X, Paperclip, MessageCircle } from 'lucide-react'

export default function PostCreation({ onPostCreate }) {
  const [content, setContent] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [category, setCategory] = useState('research')
  const [isDiscussionMode, setIsDiscussionMode] = useState(false)
  const [discussionName, setDiscussionName] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (content.trim()) {
      try {
        const discussionData = isDiscussionMode && discussionName.trim() 
          ? {
              name: discussionName.trim(),
              id: Date.now().toString()
            }
          : null;

        console.log('Submitting post with data:', postData);

        // Create FormData object to handle file upload
        const formData = new FormData()
        formData.append('content', content)
        formData.append('category', category)
        formData.append('discussion', discussionData)
       

        // Append file if it exists
        if (attachment) {
          formData.append('attachment', attachment)
        }

        const fetchResponse = await fetch('/api/posts/create_post', {
          method: 'POST',
          // Remove the Content-Type header to let the browser set it with boundary for FormData
          body: formData,
        });
      
        const responseData = await fetchResponse.json()
        if (fetchResponse.status === 200) {
          const completePost = {
            ...responseData.post,
            discussion: discussionData,
            timestamp: new Date().toISOString()
          }
          console.log('Complete post with discussion:', completePost);
          onPostCreate(completePost)
          setContent('')
          setAttachment(null)
          setCategory('research')
          setIsDiscussionMode(false)
          setDiscussionName('')
          setError('')
        } else {
          setError(responseData.message)
        }
      } catch (error) {
        console.error("Error creating post:", error)
        setError('Failed to create post')
      }
    } else {
      setError('Post content cannot be empty.')
    }
  }

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should not exceed 10MB.')
      return
    }

    // Validate file type
    if (type === 'image' && !file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }
    if (type === 'video' && !file.type.startsWith('video/')) {
      setError('Please select a valid video file.')
      return
    }

    setAttachment(file)
    setError('')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const removeAttachment = () => {
    setAttachment(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const renderAttachmentPreview = () => {
    if (!attachment) return null

    const isImage = attachment.type.startsWith('image/')
    const isVideo = attachment.type.startsWith('video/')

    if (isImage) {
      return (
        <div className="relative">
          <img src={URL.createObjectURL(attachment)} alt="Attachment preview" className="max-w-full h-auto rounded-md" />
          <button onClick={removeAttachment} className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1">
            <X className="h-4 w-4" />
          </button>
        </div>
      )
    } else if (isVideo) {
      return (
        <div className="relative">
          <video src={URL.createObjectURL(attachment)} controls className="max-w-full h-auto rounded-md">
            Your browser does not support the video tag.
          </video>
          <button onClick={removeAttachment} className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1">
            <X className="h-4 w-4" />
          </button>
        </div>
      )
    } else {
      return (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-gray-500" />
            <span className="text-sm text-gray-700">{attachment.name}</span>
          </div>
          <button onClick={removeAttachment} className="text-gray-500 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )
    }
  }

  const handleImageClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      handleFileUpload(file, 'image')
    }
    input.click()
  }

  const handleVideoClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'video/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      handleFileUpload(file, 'video')
    }
    input.click()
  }

  const toggleDiscussionMode = () => {
    setIsDiscussionMode(!isDiscussionMode)
    if (!isDiscussionMode) {
      setDiscussionName('')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-medium">
            AC
          </div>
          <textarea
            placeholder="Start a post"
            className="flex-grow px-3 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366F1] min-h-[100px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            aria-label="Post content"
          />
        </div>

        {isDiscussionMode && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter discussion name..."
              value={discussionName}
              onChange={(e) => setDiscussionName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            />
          </div>
        )}

        {renderAttachmentPreview()}

        <div className="flex justify-between items-center mb-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Paperclip className="h-4 w-4" />
            Attach File
          </label>
          <select
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Post category"
          >
            <option value="research">Research</option>
            <option value="publication">Publication</option>
          </select>
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        
        <div className="flex justify-between">
          <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-md hover:bg-[#5457E5]">
            <MessageSquare className="h-4 w-4" />
            Post
          </button>
          <button 
            type="button" 
            onClick={handleImageClick}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Image className="h-4 w-4" />
            Image
          </button>
          <button 
            type="button"
            onClick={handleVideoClick} 
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Film className="h-4 w-4" />
            Video
          </button>
          <button 
            type="button" 
            onClick={toggleDiscussionMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isDiscussionMode 
                ? 'bg-indigo-100 text-indigo-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            Discussion
          </button>
        </div>
      </form>
    </div>
  )
}