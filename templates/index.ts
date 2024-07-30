import { useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { Sunmao } from '@asany/sunmao';

import type { Application, ApplicationModule } from '@/types';

export { default as AppManager, useRouteSelector } from './AppManager';
export { default as RouteComponent } from './components/RouteComponent';
export { useLoading, useLoadingControls } from './contexts/LoadingContext';

export const sunmao = new Sunmao();

/**
 * 获取当前应用ID
 * @returns 当前应用ID
 */
export const useAppClientId = function (): string {
  return useSelector((state: any) => state.global.application.clientId);
};

/**
 * 获取应用模块信息
 * @param type 模块类型
 * @returns 
 */
export const useAppModule = function (type: string): [
  ApplicationModule,
  (moduleValues: {
    [key: string]: any;
  }) => void
] {
  const dispatch = useDispatch();
  const module = useSelector((state: any) => state.global.application.modules.find((item: any) => item.type === type));

  const setModuleValues = useCallback((moduleValues: {
    [key: string]: any;
  }) => {
    dispatch({ type: 'saveApplicationModule', payload: { type, values: moduleValues } });
  }, [])

  return [module || {}, setModuleValues];
};

/**
 * 获取当前应用信息
 * @returns 当前应用信息
 */
export const useApp = function (): Application {
  return useSelector((state: any) => state.global.application);
};
