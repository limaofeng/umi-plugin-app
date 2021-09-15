import { useSelector } from 'react-redux';
import Sunmao from 'sunmao';

import { IApplication } from './typings';

export { default as AppManager, useRouteSelector } from './AppManager';
export { default as RouteComponent } from './components/RouteComponent';
export { loadCurrentuser, loginWithUsername } from './models/auth';

export const sunmao = new Sunmao();

export const clientId = '{{id}}';

export const useApp = function(): IApplication {
  return useSelector((app: any) => app.global.application);
};
