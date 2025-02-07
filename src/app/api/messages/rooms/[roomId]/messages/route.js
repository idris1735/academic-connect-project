import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

const serverClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_KEY,
  process.env.STREAM_SECRET
);

export async function GET(request, { params }) {
  try {
    const { roomId } = params;

    // Get the channel
    const channel = serverClient.channel("messaging", roomId);

    // Query messages
    const response = await channel.query({
      messages: { limit: 50 }, // Fetch last 50 messages
    });

    // Format messages
    const messages = response.messages.map((message) => ({
      id: message.id,
      text: message.text,
      user: message.user,
      createdAt: message.created_at,
      updatedAt: message.updated_at,
      attachments: message.attachments,
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { roomId } = params;
    const body = await request.json();
    const { text, userId } = body;

    // Get the channel
    const channel = serverClient.channel("messaging", roomId);

    // Send message
    const message = await channel.sendMessage({
      text,
      user_id: userId,
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
