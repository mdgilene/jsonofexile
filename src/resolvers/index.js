import { items, addItem, updateItem, clear } from './item';

const resolvers = {
  Query: {
    items
  }
};

if (process.env.NODE_ENV !== 'production') {
  resolvers.Mutation = {
    addItem,
    updateItem,
    clear
  };
}

export default resolvers;
