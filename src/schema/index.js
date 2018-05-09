import Root from './root.graphql';
import Item from './item.graphql';
import Dev from './dev.graphql';

const schema = [Root, Item];

if (process.env.NODE_ENV !== 'production') {
  schema.push(Dev);
}

export default schema;
