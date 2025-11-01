import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NewMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewMessageDialog = ({ open, onOpenChange }: NewMessageDialogProps) => {
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { user } = useAuth();

  const handleCreateChannel = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one person');
      return;
    }

    try {
      // Create a direct message channel
      const channelName = selectedUsers.join(', ');
      const { data, error } = await supabase
        .from('channels')
        .insert({
          name: channelName,
          type: 'dm',
          section: 'Direct messages',
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Direct message created');
      onOpenChange(false);
      setSearch('');
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error creating DM:', error);
      toast.error('Failed to create direct message');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="#a-channel, @somebody or somebody@example.com"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          {selectedUsers.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {selectedUsers.map((user) => (
                <div
                  key={user}
                  className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md text-sm"
                >
                  <span>{user}</span>
                  <button
                    onClick={() =>
                      setSelectedUsers(selectedUsers.filter((u) => u !== user))
                    }
                    className="hover:bg-primary/20 rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button onClick={handleCreateChannel} className="w-full">
            Start conversation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
