import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolver';
import { context, Context } from './context';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Serveur GraphQL démarré à l'adresse : ${url}`);
});
