import { useSelector } from 'react-redux';
import { Sunmao } from '@asany/sunmao';

import type { Application } from '@/types';

export { default as AppManager, useRouteSelector } from './AppManager';
export { default as RouteComponent } from './components/RouteComponent';
export { useLoading, useLoadingControls } from './contexts/LoadingContext';

export const sunmao = new Sunmao();

export const useAppClientId = function (): string {
  return useSelector((state: any) => state.global.application.clientId);
};

export const useApp = function (): Application {
  return useSelector((state: any) => state.global.application);
};
