const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { TODO_LIST } = require("./makeData");

/**
 * Gera um número inteiro para utilizar de id
 */
function getRandomInt() {
  return Math.floor(Math.random() * 999);
}

const typeDefs = `#graphql
  type Item {
    id: Int
    name: String
  }

  input ItemInput {
    id: Int
    name: String
  }

  input ItemFilter {
    id: Int
    name: String
  }

  type Query {
    todoList(filter: ItemFilter): [Item]
  }

  type Mutation {
    addItem(values: ItemInput): Boolean
    updateItem(values: ItemInput): Boolean
    deleteItem(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    todoList: (_, { filter }) => {
      // Aqui você irá implementar o filtro dos itens
      console.log(filter);
      return TODO_LIST;
    },
  },
  Mutation: {
    addItem: (_, { values: { name } }) => {
      TODO_LIST.push({
        id: getRandomInt(),
        name,
      });
    },
    updateItem: (_, { values: { id, name } }) => {
      const index = TODO_LIST.findIndex((item) => item.id === Number(id)) // Localiza o índice do item pelo id
      if (index === -1) {
        return false // Retorna false se o item não for encontrado
      }
      TODO_LIST[index].name = name // Atualiza o nome do item
      return true // Retorna true se a atualização for bem-sucedida
    },
    deleteItem: (_, { id }) => {
      const index = TODO_LIST.findIndex((item) => item.id === Number(id) /* Converte o id recebido no parametro para número, assim pode ser encontrado dentro do array de objetos */)
      if (index === -1) {
        return false // Retorna false se o item não for encontrado
      }
      TODO_LIST.splice(index, 1) // Remove o item da lista
      return true // Retorna true se a remoção for bem-sucedida
    },
  },
};

// Configuração para subir o backend
const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

startServer();
