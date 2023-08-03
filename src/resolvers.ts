const resolvers = ({
    Query: {
        cidadaos: async(_, { Page, Nome }, { dataSources }) => await dataSources.app.listCidadaos({ Page, Nome }).then(res => res.map(({ Nascimento, DateAdd, ...m }) => ({ ...m, Nascimento: Nascimento.valueOf(), DateAdd: DateAdd.valueOf() }))),
        cidadao: async(_, { IdCidadao }, { dataSources }) => await dataSources.app.getCidadao({ IdCidadao }),
    },

    Mutation: {
        addCidadao: async (_, { itm }, { dataSources }) => (await dataSources.app.addCidadao({...itm, Nascimento: new Date(itm.Nascimento)})) != null,
        toggleCidadao: async (_, { IdCidadao }, { dataSources }) => await dataSources.app.toggleCidadao({ IdCidadao })
    },

    Cidadao: {
        __resolveReference: async({IdCidadao}, {dataSources}) => await dataSources.app.findCidadao({ IdUsuario: IdCidadao }) 
    },

})

export default resolvers;