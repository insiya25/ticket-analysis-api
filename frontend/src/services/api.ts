const API_BASE_URL = 'https://ticket-analysis-api.vercel.app/';

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

export const api = {
    async getCategoryAnalysis(): Promise<CategoryAnalysisResponse> {
        const response = await fetch(`${API_BASE_URL}/api/category-analysis`);
        if (!response.ok) throw new Error('Failed to fetch category analysis');
        return response.json();
    },

    async getClientAnalysis(): Promise<ClientAnalysisResponse> {
        const response = await fetch(`${API_BASE_URL}/api/client-analysis`);
        if (!response.ok) throw new Error('Failed to fetch client analysis');
        return response.json();
    },

    async getFullAnalysis(): Promise<FullAnalysisResponse> {
        const response = await fetch(`${API_BASE_URL}/api/full-analysis`);
        if (!response.ok) throw new Error('Failed to fetch full analysis');
        return response.json();
    },

    async getTicketsByCategory(category: string): Promise<TicketsByCategoryResponse> {
        const response = await fetch(`${API_BASE_URL}/api/tickets-by-category/${encodeURIComponent(category)}`);
        if (!response.ok) throw new Error('Failed to fetch tickets by category');
        return response.json();
    },

    async getTicketsByClient(client: string): Promise<TicketsByClientResponse> {
        const response = await fetch(`${API_BASE_URL}/api/tickets-by-client/${encodeURIComponent(client)}`);
        if (!response.ok) throw new Error('Failed to fetch tickets by client');
        return response.json();
    },
};
