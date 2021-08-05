
export interface Message { 
    Id?: string;
    Subject?:string;
    Description?: string;
    Receiver?: String[];
    ReceiverNames?:String[];
    Sender?: string;
    DateTime?: Date;
    Status?: boolean;
}

export interface ReceiverDetails {
  Id?:string;
  Email?:string;
}


  

  
 
  
    
