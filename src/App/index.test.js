import React from 'react';
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import thunk from '~/store/thunk'
import { initialState } from '~/reducers'
import Root from '~/components/Root'
import OAuthCallbackPage from '~/components/OAuthCallbackPage'

const store = configureMockStore([thunk])(initialState)

describe('Application', () => {
  it('renders without crashing', () => {
    renderer.create(
      <Provider store={store}>
        <StaticRouter context={{}}>
          <Root />
        </StaticRouter>
      </Provider>
    );
  });
})

describe('OAuth callback page', () => {
  it('renders without crashing', () => {
    renderer.create(
      <Provider store={store}>
        <StaticRouter context={{}}>
          <OAuthCallbackPage />
        </StaticRouter>
      </Provider>
    );
  });
})
