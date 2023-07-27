import {createHash} from 'crypto';




export interface IQuery<T>{
    Filter:T
    Page:number,
    Size:number
}

const getMD5Hash = (...args) => 
    createHash('md5')
    .update(args.join('|'))
    .digest("hex");


const wait = (delay:number) => new Promise(r=> setTimeout(r, delay));

const hour = 1000*60*60;
const day  = hour * 24;
const addDays = (d:Date, v:number)  => new Date( d.valueOf() + (day*v) )
const addHours = (d:Date, v:number) => new Date( d.valueOf() + (hour*v) )
const addYears = (d:Date, v:number) => {
    const day = new Date(d);    
    return new Date(day.setFullYear(day.getFullYear()+v))}
const addMonths = (d:Date, v:number) => {
    const day = new Date(d);
    const months = v % 12;
    const years  = (v-months)/12;
    return years == 0 ? new Date(day.setMonth(day.getMonth()+v)) : addMonths(addYears(d, years), months); 
}

const getAge = (born:Date, reference:Date) : {anos:number, meses: number} => {
    const aux = (d:Date) => [ d.getFullYear(), d.getMonth(), d.getDate() ];
    const b = aux(born);
    const r = aux(reference);

    const d = r[2] - b[2];
    const m = r[1] - b[1] - (d<0?1:0);
    const y = r[0] - b[0] - (m<0?1:0);
    
    return {
        anos: y, 
        meses :  m<0 ? m+12 : m 
    }    
}

const flatDate = (d:Date)           => new Date(Math.floor( d.valueOf()/(day))*(day))

const invalids = Array.from({length:10}).map((_,idx)=>Array.from({length:14}).map(()=>`${idx}`).join(''));
const rule = (dg:number) => dg < 2 ? 0 : 11 - dg; 
    
const validateCPF = (v:string) : boolean =>{
        
    if(invalids.find(f=> f.substring( 0,11 ) === v))
    { return false }

    const rdc = (values: number[]): number => values.reduce((prev: number, curr: number, idx: number) => prev + (curr * ((values.length + 1) - idx)), 0) % 11;

    const body = v.substring(0, 9).split('').map((m: string) => Number.parseInt(m));
    const dg1 = rule(rdc(body));
    const dg2 = rule(rdc([...body, dg1]));

    return v.substring(9) === `${dg1}${dg2}`;
}


const randomCNPJ = (v=1) => {
    const rdm = (n) => Math.round(Math.random() * n)
    const parts: number[] = Array.from({ length: 8 }).map(() => rdm(9));
    parts.push(...[0, 0, 0, v])

    const mults: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];

    let d1 = mults.reduce((prev: number, curr: number, idx: number) => parts[11 - idx] * curr + prev, 0)// n12*2+n11*3+n10*4+n9*5+n8*6+n7*7+n6*8+n5*9+n4*2+n3*3+n2*4+n1*5;
    d1 = 11 - (d1 % 11);

    if (d1 >= 10) 
    { d1 = 0; }
    
    mults.splice(0,1)
    mults.push(6);
    
    let d2 = d1 * 2 + mults.reduce((prev: number, curr: number, idx: number) => parts[11 - idx] * curr + prev, 0) //n12 * 3 + n11 * 4 + n10 * 5 + n9 * 6 + n8 * 7 + n7 * 8 + n6 * 9 + n5 * 2 + n4 * 3 + n3 * 4 + n2 * 5 + n1 * 6;

    d2 = 11 - (d2 % 11);
    if (d2 >= 10) 
    { d2 = 0; }
    
    return `${parts.slice(0,2).join('')}.${ parts.slice(2, 5).join('')}.${ parts.slice(5, 8).join('')}.${ parts.slice(8, 13).join('')}-${d1}${d2}`;
}
const validateCNPJ = (v:string) =>{
    if(invalids.find(f=> f === v))
    { return false }

    const rdc = (values: number[]): number => values.reduce((prev: number, curr: number, idx: number) => prev + (curr * iv[iv.length - values.length + idx]), 0) % 11;
    const iv = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

    const body = v.substring(0, 12).split('').map((m: string) => Number.parseInt(m));
    const dg1 = rule(rdc(body));
    const dg2 = rule(rdc([...body, dg1]));

    return v.substring(12) === `${dg1}${dg2}`;
}


export { getMD5Hash, wait, addDays, addHours, addMonths, addYears, getAge, flatDate, randomCNPJ, validateCNPJ, validateCPF }

