import { useSelector } from 'sunmao/dist/sketch/ReactComponentProvider';

export { default as AppManager, useRouteSelector } from './AppManager';
export { default as RouteComponent } from './components/RouteComponent';

export const useApp = function() {
  return useSelector(app => app.global.application);
};
