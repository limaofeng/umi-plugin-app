import { useSelector } from 'react-redux';

export { default as AppManager, useRouteSelector } from './AppManager';
export { default as RouteComponent } from './components/RouteComponent';

export const useApp = function() {
  return useSelector((app: any) => app.global.application);
};
