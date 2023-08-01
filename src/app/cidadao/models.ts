export type Sexo = 'M' | 'F';

export interface IStatus
{Status?: 'A' | 'I' | 'C'};


export interface IPK{
    IdCidadao:string
}



export interface IRequestAdd extends IStatus {
    IdUsuario?:string
    Email:string,
    Nome:string,
    Nascimento: Date,
    CNH: string
    Sexo: Sexo,
    Telefones?: string[]  
}

export interface IMulta{
    Id:string
}

export interface IResponseGet extends IPK, IRequestAdd {    
    Multas: IMulta[]
}

export interface IFilter {
    Nome?: string
    Page:number  
}