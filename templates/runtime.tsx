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
  let appId = '{{id}}' || window.APP_CONFIG.APPID;
  delete (window.APP_CONFIG as any).APPID;
  let fetchAppType = 'CLIENT_ID';
  // 获取当前请求的 domain
  const currentDomain = window.location.hostname;
  if (!appId) {
    appId = currentDomain;
    fetchAppType = 'DOMAIN';
  }
  const {
    data: { app },
  } = await apolloClient.query({
    query: GET_APPLICATION,
    variables: {
      id: appId,
      idType: fetchAppType,
    },
    fetchPolicy: 'no-cache',
  });

  setCurrentApplication(app);
  extraRoutes = AppManager.setApp(app).getRoutes();
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


let previousRoute: Location;

export function onRouteChange({ isFirst, location }: RouteChangeParams) {
  const loadingControls = useLoadingControls();
  if(previousRoute && previousRoute.pathname === location.pathname) {
    return;
  }
  !isFirst && loadingControls.start();
  previousRoute = location;
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
