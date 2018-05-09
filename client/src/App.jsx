import React from 'react';
import Prism from 'prismjs';

import example1Variables from './example1-variables.txt';
import example1Query from './example1-query.txt';
import example1Output from './example1-output.txt';
import example2Variables from './example2-variables.txt';
import example2Query from './example2-query.txt';
import example2Output from './example2-output.txt';

const App = () => (
  <div className="container">
    <div className="api-header">
      <h1>JSON of Exile</h1>
      <p>A GraphQL API for Path of Exile unique item information</p>

      <h5>
        Make GraphQL queries to <a href="/api">/api</a> or use{' '}
        <a href="/graphiql">/graphiql</a> to test queries immediately
      </h5>
    </div>
    <br />
    <br />
    <div className="api-examples">
      <h2>Example 1</h2>
      <div className="example">
        <div className="variables">
          <h3>Variables</h3>
          <pre>
            <br />
            <code
              className="lang-graphql"
              dangerouslySetInnerHTML={{
                __html: Prism.highlight(
                  example1Variables,
                  Prism.languages.json,
                  'json',
                ),
              }}
            />
          </pre>
        </div>
        <div className="code">
          <h3>Query</h3>
          <pre>
            <br />
            <code
              className="lang-graphql"
              dangerouslySetInnerHTML={{
                __html: Prism.highlight(
                  example1Query,
                  Prism.languages.graphql,
                  'graphql',
                ),
              }}
            />
          </pre>
        </div>
        <div className="output">
          <h3>Output</h3>
          <pre>
            <br />
            <code
              className="lang-json"
              dangerouslySetInnerHTML={{
                __html: Prism.highlight(
                  example1Output,
                  Prism.languages.json,
                  'json',
                ),
              }}
            />
          </pre>
        </div>
      </div>
      <h2>Example 2</h2>
      <div className="example">
        <div className="variables">
          <h3>Variables</h3>
          <pre>
            <br />
            <code
              className="lang-graphql"
              dangerouslySetInnerHTML={{
                __html: Prism.highlight(
                  example2Variables,
                  Prism.languages.json,
                  'json',
                ),
              }}
            />
          </pre>
        </div>
        <div className="code">
          <h3>Query</h3>
          <pre>
            <br />
            <code
              className="lang-graphql"
              dangerouslySetInnerHTML={{
                __html: Prism.highlight(
                  example2Query,
                  Prism.languages.graphql,
                  'graphql',
                ),
              }}
            />
          </pre>
        </div>
        <div className="output">
          <h3>Output</h3>
          <pre>
            <br />
            <code
              className="lang-json"
              dangerouslySetInnerHTML={{
                __html: Prism.highlight(
                  example2Output,
                  Prism.languages.json,
                  'json',
                ),
              }}
            />
          </pre>
        </div>
      </div>
    </div>
  </div>
);

export default App;
