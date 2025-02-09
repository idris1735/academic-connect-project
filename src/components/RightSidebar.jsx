import { MessageCircle, Users, Plus, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function RightSidebar() {
  const discussionRooms = [
    {
      id: 1,
      name: 'Quantum Computing Research',
      participants: 24,
      active: true,
    },
    {
      id: 2,
      name: 'AI in Healthcare',
      participants: 15,
      active: true,
    },
    {
      id: 3,
      name: 'Climate Science Data',
      participants: 18,
      active: false,
    },
  ]

  return (
    <aside className='hidden xl:block xl:col-span-1'>
      <div className='bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-2xl p-6'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-2'>
            <Sparkles className='w-5 h-5 text-white' />
            <h2 className='text-xl font-bold text-white'>Research Hubs</h2>
          </div>
          <Button
            size='sm'
            className='bg-white text-[#6366F1] hover:bg-white/90'
          >
            <Plus className='h-4 w-[12px] ' />
            New Hub
          </Button>
        </div>
        <div className='space-y-3'>
          {discussionRooms.map((room) => (
            <div
              key={room.id}
              className='bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 rounded-xl p-4'
            >
              <div className='flex items-center justify-between mb-2'>
                <h4 className='font-medium text-white'>{room.name}</h4>
                {room.active ? (
                  <Badge className='bg-white text-[#6366F1] hover:bg-white/90'>
                    Live
                  </Badge>
                ) : (
                  <Badge variant='outline' className='text-white border-white'>
                    Scheduled
                  </Badge>
                )}
              </div>
              <div className='flex items-center text-sm text-white/80 gap-2 mb-3'>
                <Users className='w-4 h-4' />
                <span>{room.participants} researchers</span>
              </div>
              <Button className='w-full bg-white text-[#6366F1] hover:bg-white/90'>
                <MessageCircle className='w-4 h-4 mr-2' />
                Join Discussion
              </Button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
