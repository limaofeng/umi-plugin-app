import { Reducer } from '@umijs/max';
import { Appconfig, IRoute } from '../typings';

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
  appconfig: Appconfig;
}

let currentApplication: any;

export const setCurrentApplication = (app: any) => {
  currentApplication = app;
};

interface GlobalModelType {
  namespace: 'global';
  state: GlobalState;
  reducers: {
    setAppConfig: Reducer<GlobalState>;
    saveCurrentApplication: Reducer<GlobalState>;
    saveApplicationModule: Reducer<GlobalState>;
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
    appconfig: {
      APPID: '',
      GRAPHQL_URL: '',
      GRAPHQL_WS_URL: '',
      WEBSITE_URL: '',
      MOBILE_URL: '',
      SHORT_DOMAIN_NAME: '',
      STORAGE_URL: '',
      OPEN_IM_API_URL: '',
      OPEN_IM_WS_URL: '',
    },
  },
  reducers: {
    setAppConfig(state: any, { payload }: any) {
      return { ...state, appconfig: payload };
    },
    saveApplicationModule(state: any, { payload: { type, values } }: any) {
      const { application } = state;
      const module = application.modules.find((item: any) => item.type === type);
      // 如果没有找到模块，则新增一个模块
      if (!module) {
        application.modules.push({ type, values });
        return { ...state, application };
      }
      // 如果找到模块，则更新模块的值
      module.values = { ...module.values, ...values };
      return { ...state, application };
    },
    saveCurrentApplication(state: any, { payload: app }: any) {
      return { ...state, application: app, organization: app.organization };
    },
  },
  subscriptions: {
    async setup({ dispatch }: any) {
      dispatch({ type: 'saveCurrentApplication', payload: currentApplication });
    },
  },
};

export default GlobalModel;
