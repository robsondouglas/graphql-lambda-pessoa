import { addDays, addMonths, addYears, flatDate, getAge, randomCNPJ, validateCNPJ, validateCPF } from "./utils"

describe('UTILS', ()=>{

    describe('addDays', ()=> {
        const day     = new Date(2023, 0 ,1);
        
        it('yesterday', ()=>expect(addDays(day, -1)).toStrictEqual( new Date(2022, 11, 31)));
        it('tomorrow', ()=>expect(addDays(day, 1)).toStrictEqual( new Date(2023, 0, 2)));
        it('next-month', ()=>expect(addDays(day, 31)).toStrictEqual( new Date(2023, 1, 1)));

    })

    describe('addMonths', ()=> {
        const day     = new Date(2023, 0 ,1);
        
        it('current',           () => expect(addMonths(day, 0)).toStrictEqual( new Date(2023, 0, 1)));
        it('next month',        () => expect(addMonths(day, 1)).toStrictEqual( new Date(2023, 1, 1)));
        it('previous month',    () => expect(addMonths(day, -1)).toStrictEqual( new Date(2022, 11, 1)));
        
        it('next year',        () => expect(addMonths(day, 12)).toStrictEqual( new Date(2024, 0, 1)));
        it('previous year',    () => expect(addMonths(day, -12)).toStrictEqual( new Date(2022, 0, 1)));        
        
    })

    describe('addYears', ()=> {
        const day     = new Date(2023, 0 ,1);
        
        it('current',          () => expect(addYears(day, 0)).toStrictEqual( new Date(2023, 0, 1)));
        it('next year',        () => expect(addYears(day, 1)).toStrictEqual( new Date(2024, 0, 1)));
        it('previous year',    () => expect(addYears(day, -1)).toStrictEqual( new Date(2022, 0, 1)));        
    })

    describe('getAge', ()=>{
        it('6 meses', ()=>expect( getAge(new Date(2023, 0, 1), new Date(2023, 6, 1))).toMatchObject({anos:0, meses: 6}) )
        it('7 meses incompletos', ()=>expect( getAge(new Date(2023, 0, 10), new Date(2023, 7, 5))).toMatchObject({anos:0, meses: 6}) )

        it('6 meses', ()=>expect( getAge(new Date(2022, 11, 1), new Date(2023, 5, 1))).toMatchObject({anos:0, meses: 6}) )
        it('7 meses incompletos', ()=>expect( getAge(new Date(2022, 11, 10), new Date(2023, 6, 5))).toMatchObject({anos:0, meses: 6}) )

        it('10 anos', ()=> expect( getAge(new Date(2012, 11, 1), new Date(2022, 11, 1))).toMatchObject({anos:10, meses: 0}) )
        it('10 anos', ()=> expect( getAge(new Date(2012, 11, 1), new Date(2022, 11, 10))).toMatchObject({anos:10, meses: 0}) )

        it('10 anos e 11 meses', ()=>expect( getAge(new Date(2012, 11, 10), new Date(2023, 11, 9))).toMatchObject({anos:10, meses: 11}) )
        it('11 anos e 5 meses', ()=>expect( getAge(new Date(2011, 11, 10), new Date(2023, 5, 9))).toMatchObject({anos:11, meses: 5}) )
        it('11 anos e 6 meses', ()=>expect( getAge(new Date(2011, 11, 10), new Date(2023, 5, 10))).toMatchObject({anos:11, meses: 6}) )

        console.log( getAge(new Date(2010,0,1), new Date()) )
    })    
    
    describe('flatDate', ()=> {
        const day     = new Date();

        it('now->today', ()=>expect(flatDate(day)).toEqual( new Date(day.getFullYear(), day.getMonth(), day.getDate())));

    })
    
    describe('validateCPF', ()=>{

        it('INVALID', ()=> expect(validateCPF('xxxx')).toBeFalsy())
        it('VALID', ()=> expect(validateCPF('05486369743')).toBeTruthy())
    })

    
    describe('validateCNPJ', ()=>{

        it('INVALID', ()=> expect(validateCNPJ('xxxx')).toBeFalsy())
        it('VALID', ()=> expect(validateCNPJ('37555481000101')).toBeTruthy())

    })

    describe('randomCNPJ', ()=>{
        const cnpjs = Array.from({length:10}).map( ()=> randomCNPJ( Math.round(Math.random()*8)+1 ));
        cnpjs.map( c=> it(c, ()=>expect(validateCNPJ(c.replace(/\D/ig, ''))).toBeTruthy()) );
    })

})