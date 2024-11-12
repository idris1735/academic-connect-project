import { MessageCircle, Users } from "lucide-react"

export default function RightSidebar() {
  const discussionRooms = [
    {
      id: 1,
      name: "Quantum Computing Research",
      participants: 24,
      active: true
    },
    {
      id: 2,
      name: "AI in Healthcare",
      participants: 15,
      active: true
    },
    {
      id: 3,
      name: "Climate Science Data",
      participants: 18,
      active: false
    }
  ]

  return (
    <aside className="hidden xl:block xl:col-span-1">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Active Discussion Rooms</h3>
          <button className="text-blue-500 text-sm hover:text-blue-600">
            Create Room
          </button>
        </div>
        <div className="space-y-3">
          {discussionRooms.map(room => (
            <div 
              key={room.id}
              className="p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{room.name}</h4>
                {room.active && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500 gap-2">
                <Users className="w-4 h-4" />
                <span>{room.participants} participants</span>
                <button className="ml-auto flex items-center gap-1 text-blue-500 hover:text-blue-600">
                  <MessageCircle className="w-4 h-4" />
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}