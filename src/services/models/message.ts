

export interface Message { 
    id?: string;
    description?: string;
    receiver?: string;
    sender?: string;
    dateTime?: Date;
    status?: boolean;
}