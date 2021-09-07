import { useSelector } from 'react-redux';
import Sunmao from 'sunmao';

export { default as AppManager, useRouteSelector } from './AppManager';
export { default as RouteComponent } from './components/RouteComponent';

export const sunmao = new Sunmao();

export const useApp = function() {
  return useSelector((app: any) => app.global.application);
};
