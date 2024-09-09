export interface User {
    username: string;
    email: string;
    password: string;
    role?: string; // Role is optional
}

export interface Event {
    id: number;
    name: string;
    date: string;
    location: string;
    description: string;
    status: string;
    category?: string;
    guests?: string[]; 
    agenda?: AgendaItem[];
}

export interface AgendaItem {
    startTime: string;
    endTime: string;
    description: string;
}

export  interface Category {
    name: string;
}

export interface UserCredentials {
    email: string;
    password: string;
    role: string;
}

export interface BackupData {
    users: { [key: string]: User };
    events: { [key: string]: any }; 
    guests: { [key: string]: any };
    agendas: { [key: string]: any }; 
    categories: Category[];
}


export interface BackupMetadata {
    date: string;
    fileName: string;
}
