import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { useChatStore } from '@/stores/chat'
import { cn } from '@/lib/utils'

export default function Chat() {
  const { activeRoomId, roomError, isLoadingRoom } = useChatStore()

  // Always show window on mobile if there's an active room, an error, or it's loading
  const showWindow = activeRoomId || roomError || isLoadingRoom

  return (
    <div className="h-[calc(100dvh-6rem)] md:h-[calc(100dvh-8rem)] -mt-4 -mb-8 -mx-4 md:-mx-8 flex overflow-hidden border rounded-xl shadow-sm bg-background animate-fade-in relative">
      <div
        className={cn(
          'w-full md:w-80 h-full flex flex-col shrink-0 border-r',
          showWindow ? 'hidden md:flex' : 'flex',
        )}
      >
        <ChatSidebar />
      </div>
      <div
        className={cn(
          'flex-1 h-full flex flex-col min-w-0 bg-background',
          showWindow ? 'flex' : 'hidden md:flex',
        )}
      >
        <ChatWindow />
      </div>
    </div>
  )
}
