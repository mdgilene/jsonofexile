import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import loadLanguages from 'prismjs/components/index';
import 'prismjs/themes/prism-tomorrow.css';

import App from './App';

import './app.css';

loadLanguages(['graphql', 'json']);

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
});

/* eslint-disable */
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
