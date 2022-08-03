import { useSelector } from 'react-redux';
import { Sunmao } from '@asany/sunmao';

import { IApplication } from './typings';

export { default as AppManager, useRouteSelector } from './AppManager';
export { default as RouteComponent } from './components/RouteComponent';

export const sunmao = new Sunmao();

export const clientId = '{{id}}';

export const useApp = function(): IApplication {
  return useSelector((state: any) => state.global.application);
};
