import { create } from 'zustand';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone: string;
  source: 'facebook' | 'instagram' | 'google' | 'whatsapp' | 'linkedin' | 'meta_ads' | 'other';
  status: 'new' | 'contacted' | 'converted' | 'lost';
  clientId: string;
  clientName: string;
  message?: string;
  createdAt: string;
  lastContactedAt?: string;
  notes?: string;
}

interface LeadState {
  leads: Lead[];
  filteredLeads: Lead[];
  selectedLead: Lead | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    source?: string;
    clientId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  };
  fetchLeads: () => Promise<void>;
  fetchLead: (id: string) => Promise<void>;
  updateLead: (id: string, lead: Partial<Lead>) => Promise<void>;
  deleteLeads: (ids: string[]) => Promise<void>;
  setFilters: (filters: Partial<LeadState['filters']>) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

// Mock data
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Alice Brown',
    email: 'alice@example.com',
    phone: '555-123-4567',
    source: 'facebook',
    status: 'new',
    clientId: '1',
    clientName: 'The Coffee House',
    message: 'I\'m interested in your catering services.',
    createdAt: '2023-06-01T10:30:00Z',
  },
  {
    id: '2',
    name: 'Bob Wilson',
    phone: '555-234-5678',
    source: 'instagram',
    status: 'contacted',
    clientId: '1',
    clientName: 'The Coffee House',
    message: 'Do you offer vegan options?',
    createdAt: '2023-06-02T14:45:00Z',
    lastContactedAt: '2023-06-02T15:30:00Z',
    notes: 'Called back, scheduled meeting for next week',
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    phone: '555-345-6789',
    source: 'google',
    status: 'converted',
    clientId: '2',
    clientName: 'Style Studio Salon',
    message: 'I need a haircut appointment.',
    createdAt: '2023-05-28T09:15:00Z',
    lastContactedAt: '2023-05-30T11:00:00Z',
    notes: 'Booked appointment, became regular customer',
  },
  {
    id: '4',
    name: 'Dave Miller',
    phone: '555-456-7890',
    source: 'whatsapp',
    status: 'new',
    clientId: '3',
    clientName: 'Fitness First Gym',
    message: 'What are your membership options?',
    createdAt: '2023-06-05T08:00:00Z',
  },
  {
    id: '5',
    name: 'Eve Johnson',
    email: 'eve@example.com',
    phone: '555-567-8901',
    source: 'facebook',
    status: 'lost',
    clientId: '4',
    clientName: 'Tasty Thai Restaurant',
    message: 'Looking for catering for 50 people',
    createdAt: '2023-05-20T16:30:00Z',
    lastContactedAt: '2023-05-25T13:45:00Z',
    notes: 'Went with a competitor due to pricing',
  },
  {
    id: '6',
    name: 'Frank Lee',
    email: 'frank@example.com',
    phone: '555-678-9012',
    source: 'linkedin',
    status: 'contacted',
    clientId: '5',
    clientName: 'Downtown Dental Care',
    message: 'Need a dental checkup',
    createdAt: '2023-06-03T11:20:00Z',
    lastContactedAt: '2023-06-04T09:30:00Z',
    notes: 'Called back, waiting for them to confirm appointment time',
  },
  {
    id: '7',
    name: 'Grace Taylor',
    phone: '555-789-0123',
    source: 'instagram',
    status: 'new',
    clientId: '2',
    clientName: 'Style Studio Salon',
    message: 'Interested in hair coloring services',
    createdAt: '2023-06-06T12:15:00Z',
  },
  {
    id: '8',
    name: 'Henry White',
    email: 'henry@example.com',
    phone: '555-890-1234',
    source: 'google',
    status: 'converted',
    clientId: '1',
    clientName: 'The Coffee House',
    message: 'Looking for a place to host a small meeting',
    createdAt: '2023-05-15T13:40:00Z',
    lastContactedAt: '2023-05-16T10:00:00Z',
    notes: 'Booked private room for business meeting, was very satisfied',
  },
];

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  filteredLeads: [],
  selectedLead: null,
  isLoading: false,
  error: null,
  filters: {},

  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      set({ 
        leads: mockLeads, 
        filteredLeads: mockLeads,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch leads', 
        isLoading: false 
      });
    }
  },

  fetchLead: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      const lead = mockLeads.find(l => l.id === id);
      if (!lead) {
        throw new Error('Lead not found');
      }
      set({ selectedLead: lead, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch lead', 
        isLoading: false 
      });
    }
  },

  updateLead: async (id: string, leadUpdate: Partial<Lead>) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedLeads = get().leads.map(lead => 
        lead.id === id ? { ...lead, ...leadUpdate } : lead
      );
      
      set(state => ({
        leads: updatedLeads,
        filteredLeads: state.filters ? get().applyFilters() : updatedLeads,
        selectedLead: state.selectedLead?.id === id 
          ? { ...state.selectedLead, ...leadUpdate } 
          : state.selectedLead,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update lead', 
        isLoading: false 
      });
    }
  },

  deleteLeads: async (ids: string[]) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const updatedLeads = get().leads.filter(lead => !ids.includes(lead.id));
      
      set(state => ({
        leads: updatedLeads,
        filteredLeads: state.filters ? get().applyFilters() : updatedLeads,
        selectedLead: state.selectedLead && ids.includes(state.selectedLead.id) 
          ? null 
          : state.selectedLead,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete leads', 
        isLoading: false 
      });
    }
  },

  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  applyFilters: () => {
    const { leads, filters } = get();
    let result = [...leads];
    
    if (filters.clientId) {
      result = result.filter(lead => lead.clientId === filters.clientId);
    }
    
    if (filters.source) {
      result = result.filter(lead => lead.source === filters.source);
    }
    
    if (filters.status) {
      result = result.filter(lead => lead.status === filters.status);
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(lead => new Date(lead.createdAt) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(lead => new Date(lead.createdAt) <= toDate);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(lead => 
        lead.name.toLowerCase().includes(searchLower) ||
        lead.phone.includes(filters.search!) ||
        (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
        (lead.message && lead.message.toLowerCase().includes(searchLower))
      );
    }
    
    set({ filteredLeads: result });
    return result;
  },

  clearFilters: () => {
    set(state => ({
      filters: {},
      filteredLeads: state.leads
    }));
  },
}));