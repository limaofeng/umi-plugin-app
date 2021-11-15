import React from 'react';

import { createLogger } from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { client } from 'umi';

import ExtDvaContainer from './ExtDvaContainer';
import AppManager from './AppManager';
import { setCurrentApplication } from './models/global';
import {
  getApplication as GET_APPLICATION,
  // getRoute as GET_ROUTE,
  // subscibeUpdateRoute as SUBSCIBE_UPDATEROUTE,
} from './gql/application.gql';
import * as libraries from './autoImportLibrary';

const logging = process.env.NODE_ENV === 'development';

let extraRoutes: any[] = [];

async function loadRoutes() {
  const {
    data: { app },
  } = await client.query({
    query: GET_APPLICATION,
    variables: {
      id: '{{id}}',
    },
    fetchPolicy: 'no-cache',
  });

  setCurrentApplication(app);

  // const env = EnvironmentManager.currentEnvironment();

  // env.set('layout.navbar.logo', app.logo);
  // env.set('layout.navbar.title', app.name);

  extraRoutes = AppManager.transform(app.routes);
}

export const patchRoutes = ({ routes }: any) => {
  const insertIndex = routes.findIndex(item => item.path === '/');
  routes.splice(insertIndex, 0, ...extraRoutes);
};

export const rootContainer = (container: any) => {
  return React.createElement(ExtDvaContainer as any, { client, libraries }, container);
};

export const render = (oldRender: () => void) => {
  loadRoutes().then(oldRender);
};

export const onRouteChange = () => {};

const persistConfig = {
  timeout: 1000, // you can define your time. But is required.
  key: 'root',
  storage,
};

const persistEnhancer = () => (createStore: any) => (reducer: any, initialState: any, enhancer: any) => {
  const store = createStore(persistReducer(persistConfig, reducer), initialState, enhancer);
  const persistor = persistStore(store, null);
  return {
    persistor,
    ...store,
  };
};

const dvaPlugins = [
  {
    onAction: createLogger(),
  },
];

export const dva = {
  config: {
    extraEnhancers: [persistEnhancer()],
    onError(e: Error) {
      console.error(e.message, e);
    },
  },
  plugins: logging ? dvaPlugins : [],
};
