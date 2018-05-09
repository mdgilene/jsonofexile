import express from 'express';
import dotenv from 'dotenv';
import readline from 'readline';
import path from 'path';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import mongoose from 'mongoose';
import cors from 'cors';

import typeDefs from './schema';
import resolvers from './resolvers';

dotenv.config();

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, '../client/build')));

app.use('/api', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/api' }));

connectToDatabase().then(() => startServer());

function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.listen(process.env.PROD_PORT, () => {
      console.log(
        `Go to http://localhost:${
          process.env.PROD_PORT
        }/graphiql to run queries!`
      );
    });
  } else {
    app.listen(process.env.DEV_PORT, () => {
      console.log(
        `Go to http://localhost:${
          process.env.DEV_PORT
        }/graphiql to run queries!`
      );
    });
  }
}

function connectToDatabase() {
  return new Promise(resolve => {
    if (process.env.NODE_ENV === 'production') {
      connectToProductionDatabase().then(resolve);
    } else {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('Use production database? (y/n) ', answer => {
        if (answer === 'y') {
          connectToProductionDatabase().then(resolve);
        } else {
          connectToDevelopmentDatabase().then(resolve);
        }
        rl.close();
      });
    }
  });
}

function connectToProductionDatabase() {
  console.log('Connecting to production database');
  return mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${
        process.env.DB_HOST
      }`
    )
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));
}

function connectToDevelopmentDatabase() {
  console.log('Connecting to development database');
  return mongoose
    .connect('mongodb://localhost/JSONofExile')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));
}
