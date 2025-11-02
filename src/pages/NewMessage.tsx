import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WorkspaceSidebar } from '@/components/WorkspaceSidebar';

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

export default function NewMessage() {
  const [search, setSearch] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .neq('id', user?.id || '');
    
    if (data) {
      setProfiles(data);
    }
  };

  const handleCreateDM = async (profileId: string, username: string) => {
    if (!user) return;

    try {
      // Check if DM already exists
      const { data: existingChannels, error: checkError } = await supabase
        .from('channels')
        .select('id')
        .eq('type', 'dm')
        .contains('dm_users', [user.id, profileId]);

      if (checkError) throw checkError;

      if (existingChannels && existingChannels.length > 0) {
        // Navigate to existing DM
        navigate(`/c/${existingChannels[0].id}`);
        return;
      }

      const { data, error } = await supabase.from('channels').insert({
        name: username,
        type: 'dm',
        section: 'Direct messages',
        created_by: user.id,
        dm_users: [user.id, profileId],
      }).select().single();

      if (error) throw error;

      toast.success(`Started conversation with ${username}`);
      navigate(`/c/${data.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create direct message');
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.username.toLowerCase().includes(search.toLowerCase()) ||
    p.display_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <WorkspaceSidebar />
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">New message</h1>
          </div>
          <div className="relative">
            <Input
              placeholder="Search people..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="px-6 py-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-sm font-semibold text-muted-foreground mb-3">People</h2>
              <div className="space-y-1">
                {filteredProfiles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {search ? 'No users found' : 'No other users yet'}
                  </div>
                ) : (
                  filteredProfiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => handleCreateDM(profile.id, profile.display_name || profile.username)}
                      className="w-full flex items-center gap-3 p-3 rounded hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 rounded bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg border border-primary/20 overflow-hidden">
                        {profile.avatar_url ? (
                          <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                        ) : (
                          '👤'
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{profile.display_name || profile.username}</div>
                        {profile.display_name && (
                          <div className="text-sm text-muted-foreground">@{profile.username}</div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
