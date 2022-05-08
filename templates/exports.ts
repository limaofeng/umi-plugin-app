import { useSelector } from 'react-redux';
import Sunmao from 'sunmao';

import { CurrentUser, IApplication } from './typings';

export { default as AppManager, useRouteSelector } from './AppManager';
export { default as RouteComponent } from './components/RouteComponent';
export { loadCurrentuser, loginWithUsername } from './utils';

export const sunmao = new Sunmao();

export const clientId = '{{id}}';

export const useApp = function(): IApplication {
  return useSelector((state: any) => state.global.application);
};
