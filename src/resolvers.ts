const resolvers = ({
    Query: {
        cidadaos: (_, { Page, Nome }, { dataSources }) => dataSources.app.listCidadaos({ Page, Nome }).then(res => res.map(({ Nascimento, DateAdd, ...m }) => ({ ...m, Nascimento: Nascimento.valueOf(), DateAdd: DateAdd.valueOf() }))),
        cidadao: (_, { Id }, { dataSources }) => dataSources.app.readCidadao({ IdCidadao: Id }),
    },

    Mutation: {
        addCidadao: async (_, { itm }, { dataSources }) => (await dataSources.app.addCidadao({...itm, Nascimento: new Date(itm.Nascimento)})) != null,
        toggleCidadao: async (_, { IdCidadao }, { dataSources }) => await dataSources.app.toggleCidadao({ IdCidadao })
    },

    Cidadao: {
        __resolveReference: ({ IdCidadao }, { dataSources }) => dataSources.app.get({ IdCidadao }),
    }
})

export default resolvers;