import { useState } from 'react'
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, MessageSquare, Edit, Trash2, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const ProfilePost = ({ post, onEdit, onDelete, onLike, onComment }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(post.content)
  const [isCommenting, setIsCommenting] = useState(false)
  const [comment, setComment] = useState('')

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    onEdit(post.id, editedContent)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedContent(post.content)
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(post.id)
  }

  const handleLike = () => {
    onLike(post.id)
  }

  const handleComment = () => {
    setIsCommenting(!isCommenting)
  }

  const submitComment = (e) => {
    e.preventDefault()
    if (comment.trim()) {
      onComment(post.id, comment)
      setComment('')
      setIsCommenting(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage className="rounded-full" src={`/${post.photoURL}`} alt={post.author} />
          <AvatarFallback>{post.author && post.author.length > 0 ? post.author[0] : '?'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{post.author}</h3>
          <p className="text-sm text-gray-500">{post.authorTitle}</p>
          <p className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save</Button>
            </div>
          </div>
        ) : (
        //   <p>{post.content}</p>
        // )}
        // {post.image && (
        //   <img src={post.image} alt="Post content" className="mt-4 rounded-lg max-h-96 w-full object-cover" />
          <div>
            <p>{post.content}</p>
            {post.attachment && (
              <div className="mt-4">
                {post.attachment.fileType == 'images' ? (
                  <img src={`/${post.attachment.url}`} alt="Post content" className="rounded-lg max-h-96 w-full object-cover" />
                ) : post.attachment.fileType == 'videos' ? (
                  <video controls className="rounded-lg max-h-96 w-full">
                    <source src={`/${post.attachment.url}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <a href={`/${post.attachment.url}`} target="_blank" rel="noopener noreferrer">View Document</a>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={handleLike}>
          <ThumbsUp className="h-4 w-4 mr-2" />
          Like ({post.likesCount})
        </Button>
        <Button variant="ghost" size="sm" onClick={handleComment}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Comment ({post.commentsCount})
        </Button>
      </CardFooter>
      {isCommenting && (
        <CardFooter>
          <form onSubmit={submitComment} className="w-full">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit">Post</Button>
            </div>
          </form>
        </CardFooter>
      )}
    </Card>
  )
}

export default ProfilePost

