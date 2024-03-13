import React from 'react';

import { createLogger } from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apolloClient } from 'umi';

import ExtDvaContainer from './ExtDvaContainer';
import AppManager from './AppManager';
import { setCurrentApplication } from './models/global';
import {
  getApplication as GET_APPLICATION,
  // getRoute as GET_ROUTE,
  // subscibeUpdateRoute as SUBSCIBE_UPDATEROUTE,
} from './gql/application.gql';
import * as libraries from './autoImportLibrary';
import { IRoute } from './typings';
import { useLoading, useLoadingControls } from './contexts/LoadingContext';

const logging = process.env.NODE_ENV === 'development';

let extraRoutes: any[] = [];

async function loadRoutes() {
  const {
    data: { app },
  } = await apolloClient.query({
    query: GET_APPLICATION,
    variables: {
      id: '{{id}}',
    },
    fetchPolicy: 'no-cache',
  });

  setCurrentApplication(app);

  extraRoutes = AppManager.transform(app.routes);
}

export const patchClientRoutes = ({ routes }: any) => {
  const insertIndex = routes.findIndex((item: IRoute) => item.path === '/');
  routes.splice(insertIndex, 0, ...extraRoutes);
};

export function dataflowProvider(container: any) {
  return React.createElement(ExtDvaContainer as any, { client: apolloClient, libraries }, container);
}

export const render = (oldRender: () => void) => {
  loadRoutes().then(oldRender);
};

{{#loading}}
type RouteChangeParams = {
  location: Location;
  routes: any;
  action: any;
  clientRoutes: any[];
  basename:string;
  isFirst: boolean;
}

export function onRouteChange({ location, action }: RouteChangeParams) {
  const loadingControls = useLoadingControls();
  console.log('onRouteChange', location.pathname, action);
  loadingControls.start();
};
{{/loading}}

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
