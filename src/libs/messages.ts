const MESSAGES = {
    Errors: {
        defaults: {
            INVALID_CPF: 'O CPF informado é inválido',
            INVALID_CNPJ: 'O CNPJ informado é inválido',            
            ALL_FIELDS_REQUIREDS: 'Todos os campos obrigatórios devem ser preenchidos',
            FIELD_REQUIRED: 'deve ser preenchidos',
            SORT_FIELD_RANGE: 'O campo de ordenação deve ser maior que zero',
            SORT_FIELD_UNIQUE: 'O campo de ordenação deve ser único',
            NOT_FOUND: `Item não encontrado.`,
        },
        Cidadao: {
            AGE_MIN: 'A data de nascimento não pode ser no futuro',
            AGE_MAX: 'Uma pessoa não pode ter mais de 150 anos',
            EMAIL_REQUIRED: 'O email deve ser informado',
            EMAIL_FORMAT: 'O formato do email está incorreto'
        }
    }
}

export default MESSAGES;