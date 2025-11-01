import { create } from 'zustand';

interface WorkspaceStore {
  activeChannel: string;
  sidebarCollapsed: boolean;
  channelOrder: Record<string, string[]>;
  setActiveChannel: (channelId: string) => void;
  toggleSidebar: () => void;
  reorderChannels: (section: string, channelIds: string[]) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  activeChannel: '',
  sidebarCollapsed: false,
  channelOrder: {},
  setActiveChannel: (channelId) => set({ activeChannel: channelId }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  reorderChannels: (section, channelIds) =>
    set((state) => ({
      channelOrder: { ...state.channelOrder, [section]: channelIds },
    })),
}));
