'use strict';

const autoprefixer = {
  browsers: [
    '>1%',
    'last 4 versions',
    'Firefox ESR',
    'not ie < 9', // React doesn't support IE8 anyway
  ],
  flexbox: 'no-2009',
}

const vendor = [
  'axios',
  'classnames',
  'es6-error',
  'github-api',
  'lodash.debounce',
  'moment',
  'query-string',
  'ramda',
  'react',
  'react-dom',
  'react-infinite-calendar',
  'react-redux',
  'react-router-dom',
  'redux',
  'semantic-ui-react',
  'whatwg-fetch'
]

module.exports = {
  autoprefixer,
  vendor
}

