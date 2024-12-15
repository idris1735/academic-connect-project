import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Edit2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

// Dummy data for testing
const dummyReview = {
  id: 1,
  author: {
    name: "John Doe",
    avatar: "https://picsum.photos/seed/johndoe/200",
    title: "Senior Researcher",
  },
  relationship: "Colleague",
  date: new Date().toISOString(),
  content: "This is a sample peer review content. It provides feedback on the research paper.",
  visibility: true,
};

export function PeerReview({ review = dummyReview, onToggleVisibility, onEdit }) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-gray-100">
            <AvatarImage src={review.author.avatar} alt={review.author.name} />
            <AvatarFallback>{review.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{review.author.name}</h3>
                  <span className="text-sm text-gray-500">{review.relationship}</span>
                </div>
                <p className="text-gray-600">{review.author.title}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-900"
                onClick={() => onEdit(review.id)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 text-gray-700 whitespace-pre-wrap">{review.content}</div>
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">All LinkedIn members</span>
              </div>
              <Switch
                checked={review.visibility}
                onCheckedChange={() => onToggleVisibility(review.id)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Example usage (for testing purposes)
// <PeerReview onToggleVisibility={(id) => console.log(`Toggled visibility for review ${id}`)} onEdit={(id) => console.log(`Edit review ${id}`)} />

