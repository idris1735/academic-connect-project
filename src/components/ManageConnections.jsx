import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserMinus, Loader2 } from "lucide-react";

// Dummy data for testing
const dummyConnections = [
  {
    connectionId: "1",
    userId: "user1",
    displayName: "Dr. Sarah Johnson",
    role: "Associate Professor",
    university: "Stanford University",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    connectionId: "2",
    userId: "user2",
    displayName: "Prof. Michael Chen",
    role: "Research Director",
    university: "MIT",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    connectionId: "3",
    userId: "user3",
    displayName: "Dr. Emily Williams",
    role: "Assistant Professor",
    university: "Harvard University",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  {
    connectionId: "4",
    userId: "user4",
    displayName: "Prof. David Brown",
    role: "Department Head",
    university: "UC Berkeley",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
];

export function ManageConnections() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with dummy data
    const fetchConnections = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setConnections(dummyConnections);
      } catch (error) {
        console.error("Error loading connections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const handleRemoveConnection = async (connectionId, userId) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setConnections((prev) =>
        prev.filter((conn) => conn.connectionId !== connectionId)
      );
    } catch (error) {
      console.error("Error removing connection:", error);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
        <CardHeader className="border-b border-indigo-100">
          <CardTitle className="text-2xl font-bold text-indigo-900">
            Your Connections
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="mt-2 text-sm text-indigo-600">
              Loading connections...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
      <CardHeader className="border-b border-indigo-100">
        <CardTitle className="text-2xl font-bold text-indigo-900">
          Your Connections
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {connections.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-indigo-600">No connections yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {connections.map((connection) => (
              <div
                key={connection.connectionId}
                className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <Avatar className="h-16 w-16 border-2 border-indigo-200">
                  <AvatarImage
                    src={connection.photoURL}
                    alt={connection.displayName}
                  />
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl font-bold">
                    {connection.displayName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-indigo-900">
                    {connection.displayName}
                  </h3>
                  <p className="text-sm text-indigo-700">{connection.role}</p>
                  <p className="text-sm text-indigo-600">
                    {connection.university}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  onClick={() =>
                    handleRemoveConnection(
                      connection.connectionId,
                      connection.userId
                    )
                  }
                >
                  <UserMinus className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
