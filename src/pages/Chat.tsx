import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatWindow } from '@/components/chat/ChatWindow'

export default function Chat() {
  return (
    <div className="h-[calc(100vh-8rem)] -mt-4 -mb-8 -mx-4 md:-mx-8 flex overflow-hidden border rounded-xl shadow-sm bg-background animate-fade-in">
      <ChatSidebar />
      <ChatWindow />
    </div>
  )
}
