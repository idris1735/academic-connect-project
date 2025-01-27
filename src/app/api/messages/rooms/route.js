import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

const serverClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_KEY,
  process.env.STREAM_SECRET
);

export async function GET() {
  try {
    // Get all channels for the current user
    const filter = { type: { $in: ["messaging", "research"] } };
    const sort = [{ last_message_at: -1 }];

    const channels = await serverClient.queryChannels(filter, sort, {
      limit: 30,
      state: true,
      watch: true,
      presence: true,
    });

    // Transform channels into rooms
    const rooms = {
      DM: channels
        .filter((channel) => channel.type === "messaging")
        .map((channel) => ({
          id: channel.id,
          name: channel.data.name || "Direct Message",
          type: "DM",
          avatar: channel.data.image,
          lastMessage: channel.state.messages[0]
            ? {
                content: channel.state.messages[0].text,
                timestamp: channel.state.messages[0].created_at,
              }
            : null,
        })),
      RR: channels
        .filter((channel) => channel.type === "research")
        .map((channel) => ({
          id: channel.id,
          name: channel.data.name || "Research Room",
          type: "RR",
          avatar: channel.data.image,
          lastMessage: channel.state.messages[0]
            ? {
                content: channel.state.messages[0].text,
                timestamp: channel.state.messages[0].created_at,
              }
            : null,
        })),
    };

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { roomData } = await request.json();
    const { name, roomType, participants = [] } = roomData;

    // Create a new channel
    const channel = serverClient.channel(
      roomType === "RR" ? "research" : "messaging",
      null,
      {
        name,
        members: ["current_user", ...participants], // Replace current_user with actual user ID
        created_by: "current_user",
      }
    );

    await channel.create();

    const room = {
      id: channel.id,
      name: channel.data.name,
      type: roomType,
      avatar: channel.data.image,
      lastMessage: null,
    };

    return NextResponse.json({ room });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
