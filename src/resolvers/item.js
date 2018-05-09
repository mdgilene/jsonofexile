import Item from '../models/Item';

export const items = (root, { query }) => {
  if (query.name) query.name = new RegExp(query.name, 'i');

  return Item.find(query);
};

export const addItem = (root, { data }) => {
  return Item.create(data);
};

export const updateItem = (root, { _id, fields }) => {
  return Item.findByIdAndUpdate(_id, fields);
};

export const clear = () => {
  return Item.remove({}).then(() => 'Database Cleared');
};
