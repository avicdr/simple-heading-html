import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Channel {
  id: string;
  name: string;
  type: string;
  description: string | null;
  section: string | null;
  created_at: string;
  dm_users?: string[] | null;
  other_user?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export const useChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChannels = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        // For DM channels, fetch the other user's profile
        const channelsWithProfiles = await Promise.all(
          data.map(async (channel: any) => {
            if (channel.type === 'dm' && channel.dm_users) {
              const otherUserId = channel.dm_users.find((id: string) => id !== user.id);
              if (otherUserId) {
                const { data: profileData } = await supabase
                  .from('profiles')
                  .select('id, username, display_name, avatar_url')
                  .eq('id', otherUserId)
                  .single();
                
                if (profileData) {
                  return {
                    ...channel,
                    name: profileData.display_name || profileData.username,
                    other_user: profileData,
                  };
                }
              }
            }
            return channel;
          })
        );
        setChannels(channelsWithProfiles);
      }
      setLoading(false);
    };

    fetchChannels();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('channels-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'channels',
        },
        () => {
          fetchChannels();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { channels, loading };
};
