import { Reducer } from '@umijs/max';
import { IRoute } from '../typings';

export interface Dingtalk {
  corpId: string;
}

interface DingtalkConfiguration {
  corpId: string;
}

interface ApplicationConfiguration {
  dingtalk: DingtalkConfiguration;
}

export interface Application {
  id: string;
  name: string;
  dingtalkIntegration: string;
  configuration: ApplicationConfiguration;
  loginRoute: IRoute;
}

interface Organization {
  id: string;
  name: string;
}

export interface GlobalState {
  application?: Application;
  organization?: Organization;
}

let currentApplication: any;

export const setCurrentApplication = (app: any) => {
  currentApplication = app;
};

interface GlobalModelType {
  namespace: 'global';
  state: GlobalState;
  reducers: {
    saveCurrentApplication: Reducer<GlobalState>;
  };
  subscriptions: {
    setup: any;
  };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',
  state: {
    application: undefined,
    organization: undefined,
  },
  reducers: {
    saveCurrentApplication(state: any, { payload: app }: any) {
      return { ...state, application: app, organization: app.organization };
    },
  },
  subscriptions: {
    async setup({ dispatch }) {
      dispatch({ type: 'saveCurrentApplication', payload: currentApplication });
    },
  },
};

export default GlobalModel;
