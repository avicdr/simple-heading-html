import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
} from '@/components/ui/context-menu';
import { ChevronRight } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface ChannelContextMenuProps {
  children: ReactNode;
  onCreateSection?: () => void;
  onEditSidebar?: () => void;
  onFilterSidebar?: () => void;
}

export const ChannelContextMenu = ({
  children,
  onCreateSection,
  onEditSidebar,
  onFilterSidebar,
}: ChannelContextMenuProps) => {
  const [showType, setShowType] = useState<'all' | 'unread' | 'mentions'>('all');
  const [sortType, setSortType] = useState<'alphabetically' | 'recent' | 'priority'>('alphabetically');

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          <span>Create</span>
          <ChevronRight className="ml-auto h-4 w-4" />
        </ContextMenuItem>
        
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <span>Manage</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={onEditSidebar}>
              Browse channels
            </ContextMenuItem>
            <ContextMenuItem onClick={onCreateSection}>
              Edit all sections
            </ContextMenuItem>
            <ContextMenuItem>
              Leave inactive channels
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <span>Show and sort</span>
            <span className="ml-auto text-xs text-muted-foreground">All</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-56">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              Show in this section
            </div>
            <ContextMenuCheckboxItem
              checked={showType === 'all'}
              onCheckedChange={() => setShowType('all')}
            >
              All
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              checked={showType === 'unread'}
              onCheckedChange={() => setShowType('unread')}
            >
              Unread messages only
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              checked={showType === 'mentions'}
              onCheckedChange={() => setShowType('mentions')}
            >
              Mentions only
            </ContextMenuCheckboxItem>
            
            <ContextMenuSeparator />
            
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              Sort this section
            </div>
            <ContextMenuCheckboxItem
              checked={sortType === 'alphabetically'}
              onCheckedChange={() => setSortType('alphabetically')}
            >
              Alphabetically
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              checked={sortType === 'recent'}
              onCheckedChange={() => setSortType('recent')}
            >
              By most recent
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              checked={sortType === 'priority'}
              onCheckedChange={() => setSortType('priority')}
            >
              Priority
            </ContextMenuCheckboxItem>
            
            <ContextMenuSeparator />
            
            <ContextMenuItem className="text-primary">
              Change these settings for all sections in Preferences
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
};
