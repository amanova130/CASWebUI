/* Model that contains data about user*/


export interface User { 
    UserName?: string;
    Password?: string;
    LogIn?: Date;
    LogOff?: Date;
    Role?:string;
    Status?:boolean;
    Email?:string;
    ChangePwdDate?:string;
}