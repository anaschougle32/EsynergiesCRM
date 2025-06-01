import { create } from 'zustand';

interface Client {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
  planId?: string;
  planName?: string;
}

interface ClientState {
  clients: Client[];
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  fetchClient: (id: string) => Promise<void>;
  createClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

// Mock data
const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    businessName: 'The Coffee House',
    email: 'john@coffeehouse.com',
    phone: '555-123-4567',
    businessType: 'Cafe',
    status: 'active',
    createdAt: '2023-05-15T10:30:00Z',
    lastLogin: '2023-06-01T08:15:00Z',
    planId: '1',
    planName: 'Pro Plan',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    businessName: 'Style Studio Salon',
    email: 'sarah@stylestudio.com',
    phone: '555-987-6543',
    businessType: 'Salon',
    status: 'active',
    createdAt: '2023-04-20T14:45:00Z',
    lastLogin: '2023-05-28T16:20:00Z',
    planId: '2',
    planName: 'Basic Plan',
  },
  {
    id: '3',
    name: 'Mike Peterson',
    businessName: 'Fitness First Gym',
    email: 'mike@fitnessfirst.com',
    phone: '555-456-7890',
    businessType: 'Gym',
    status: 'pending',
    createdAt: '2023-06-05T09:15:00Z',
  },
  {
    id: '4',
    name: 'Lisa Wong',
    businessName: 'Tasty Thai Restaurant',
    email: 'lisa@tastythai.com',
    phone: '555-789-0123',
    businessType: 'Restaurant',
    status: 'active',
    createdAt: '2023-03-10T11:00:00Z',
    lastLogin: '2023-06-02T12:30:00Z',
    planId: '1',
    planName: 'Pro Plan',
  },
  {
    id: '5',
    name: 'David Clark',
    businessName: 'Downtown Dental Care',
    email: 'david@downtowndental.com',
    phone: '555-234-5678',
    businessType: 'Healthcare',
    status: 'inactive',
    createdAt: '2023-02-18T16:30:00Z',
    lastLogin: '2023-04-15T10:45:00Z',
  },
];

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,

  fetchClients: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ clients: mockClients, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch clients', 
        isLoading: false 
      });
    }
  },

  fetchClient: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      const client = mockClients.find(c => c.id === id);
      if (!client) {
        throw new Error('Client not found');
      }
      set({ selectedClient: client, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch client', 
        isLoading: false 
      });
    }
  },

  createClient: async (client) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const newClient: Client = {
        ...client,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
      };
      set(state => ({ 
        clients: [...state.clients, newClient], 
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create client', 
        isLoading: false 
      });
    }
  },

  updateClient: async (id, clientUpdate) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      set(state => ({
        clients: state.clients.map(c => 
          c.id === id ? { ...c, ...clientUpdate } : c
        ),
        selectedClient: state.selectedClient?.id === id 
          ? { ...state.selectedClient, ...clientUpdate } 
          : state.selectedClient,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update client', 
        isLoading: false 
      });
    }
  },

  deleteClient: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({
        clients: state.clients.filter(c => c.id !== id),
        selectedClient: state.selectedClient?.id === id ? null : state.selectedClient,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete client', 
        isLoading: false 
      });
    }
  },
}));