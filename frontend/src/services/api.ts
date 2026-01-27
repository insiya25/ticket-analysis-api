const API_BASE_URL = 'http://localhost:8000';

export type FilterParams = {
    start_date?: string;
    end_date?: string;
    client_name?: string;
}

export type CategoryData = {
    'Issue Category': string;
    Count: number;
}

export type ClientData = {
    Client: string;
    'Tickets Raised': number;
}

export type TicketData = {
    No: number;
    Client: string;
    Subject: string;
    'Raised By': string;
    'Raised Date': string;
    'Resolved date': string;
    'Ticket No': number;
    'CCF No': string;
    Status: string;
    Days: number;
    Category?: string;
}

export type CategoryAnalysisResponse = {
    success: boolean;
    total_tickets: number;
    data: CategoryData[];
}

export type ClientAnalysisResponse = {
    success: boolean;
    total_tickets: number;
    total_clients: number;
    data: ClientData[];
}

export type FullAnalysisResponse = {
    success: boolean;
    total_tickets: number;
    category_analysis: {
        total_categories: number;
        data: CategoryData[];
    };
    client_analysis: {
        total_clients: number;
        data: ClientData[];
    };
}

export type TicketsByCategoryResponse = {
    success: boolean;
    category: string;
    total_tickets: number;
    data: TicketData[];
}

export type TicketsByClientResponse = {
    success: boolean;
    client: string;
    total_tickets: number;
    data: TicketData[];
}

const buildUrl = (endpoint: string, params?: FilterParams) => {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value) url.searchParams.append(key, value);
        });
    }
    return url.toString();
};

export const api = {
    async getCategoryAnalysis(filters?: FilterParams): Promise<CategoryAnalysisResponse> {
        const response = await fetch(buildUrl('/api/category-analysis', filters));
        if (!response.ok) throw new Error('Failed to fetch category analysis');
        return response.json();
    },

    async getClientAnalysis(filters?: FilterParams): Promise<ClientAnalysisResponse> {
        const response = await fetch(buildUrl('/api/client-analysis', filters));
        if (!response.ok) throw new Error('Failed to fetch client analysis');
        return response.json();
    },

    async getFullAnalysis(filters?: FilterParams): Promise<FullAnalysisResponse> {
        const response = await fetch(buildUrl('/api/full-analysis', filters));
        if (!response.ok) throw new Error('Failed to fetch full analysis');
        return response.json();
    },

    async getTicketsByCategory(category: string, filters?: FilterParams): Promise<TicketsByCategoryResponse> {
        const response = await fetch(buildUrl(`/api/tickets-by-category/${encodeURIComponent(category)}`, filters));
        if (!response.ok) throw new Error('Failed to fetch tickets by category');
        return response.json();
    },

    async getTicketsByClient(client: string, filters?: FilterParams): Promise<TicketsByClientResponse> {
        const response = await fetch(buildUrl(`/api/tickets-by-client/${encodeURIComponent(client)}`, filters));
        if (!response.ok) throw new Error('Failed to fetch tickets by client');
        return response.json();
    },

    async getClients(): Promise<{ success: boolean; data: string[] }> {
        const response = await fetch(`${API_BASE_URL}/api/clients`);
        if (!response.ok) throw new Error('Failed to fetch clients');
        return response.json();
    },
};
