import React, { ComponentType, useCallback, useEffect, useReducer, useRef } from 'react';

import { EventEmitter } from 'events';

import isEqual from 'lodash/isEqual';

import { EqualityFn, IRoute, IRouteComponent, Selector, SubscribeCallback, UseRouteSelectorFunc } from '../types';

import * as utils from './utils';
import RouteComponent, { AuthComponent, RouteWrapperComponent } from './components/RouteComponent';

const EVENT_ROUTE_RELOAD = 'EVENT_ROUTE_RELOAD';
const EVENT_SINGLE_ROUTE_UPDATE_PREFIX = 'EVENT_SINGLE_ROUTE_UPDATE_';

const defaultEqualityFn = isEqual;

export class AppManager {
  private routes = new Map<string, IRoute>();

  private cache = new Map<string, ComponentType<any>>();

  private emitter = new EventEmitter();

  reload() {}

  updateRoute(route: IRoute) {
    this.routes.set(route.id, route);
    this.emitter.emit(EVENT_SINGLE_ROUTE_UPDATE_PREFIX + route.id);
  }

  transform(routes: IRoute[]) {
    this.routes.clear();
    try {
      const routeTree = utils.tree<IRoute>(
        routes.map((item: IRoute) => ({
          ...item,
          routes: [],
        })),
        {
          idKey: 'id',
          childrenKey: 'routes',
          pidKey: 'parent.id',
          sort: (left: any, right: any) => left.index - right.index,
        }
      );
      return routeTree.map(this.transformRoute);
    } finally {
      this.dispatch();
    }
  }

  transformRoute = (route: IRoute) => {
    // 保存数据
    this.routes.set(route.id, route);

    const isParent = route.routes && route.routes.length;
    // 构造组件
    const component: ComponentType<any> = route.component && this.renderRouteComponent(route.id);
    const wrappers: ComponentType<any>[] = [];

    // 转换子组件
    route.routes = isParent ? route.routes!.map(this.transformRoute) : undefined;

    // 包装器
    if (route.authorized) {
      wrappers.unshift(this.renderAuthorized(route.id));
    }

    // 去除 header / divider 上的关键信息
    if (route.type === 'header' || route.type === 'divider') {
      route.path = '/';
      route.name = route.type === 'header' ? route.name : '--*--';
    }

    if (!route.routes || route.routes.length === 0) {
      route.exact = true;
    }
    return { ...route, component, wrappers };
  };

  private renderRouteComponent(id: string): ComponentType<any> {
    const CACHE_COMPONENT_KEY = `COMPONENT_${id}`;
    let component = this.cache.get(CACHE_COMPONENT_KEY);
    if (!component) {
      this.cache.set(
        CACHE_COMPONENT_KEY,
        (component = (props: any) => (
          <RouteComponent useRouteSelector={this.useRouteSelector} ROUTEID={id} {...props} />
        ))
      );
    }
    return component;
  }

  // private renderComponentWrappers(
  //   id: string,
  //   wrapperDatas: any[]
  // ): ComponentType<any>[] {
  //   const wrappers = [];
  //   if (routeWrapper && routeWrapper.template) {
  //     const CACHE_ROUTEWRAPPER_KEY = `ROUTEWRAPPER_${id}`;
  //     let wrapper = this.cache.get(CACHE_ROUTEWRAPPER_KEY);
  //     if (!wrapper) {
  //       this.cache.set(
  //         CACHE_ROUTEWRAPPER_KEY,
  //         (wrapper = (props: any) => (
  //           <RouteWrapperComponent useRouteSelector={this.useRouteSelector} ROUTEID={id} {...props} />
  //         ))
  //       );
  //     }
  //     wrappers.push(wrapper);
  //   }
  //   return wrappers;
  // }

  private renderAuthorized = (id: string): ComponentType<any> => {
    const CACHE_AUTHCOMPONENT_KEY = `AUTHCOMPONENT_${id}`;
    let authorized = this.cache.get(CACHE_AUTHCOMPONENT_KEY);
    if (!authorized) {
      this.cache.set(
        CACHE_AUTHCOMPONENT_KEY,
        (authorized = (props: any) => (
          <AuthComponent ROUTEID={id} useRouteSelector={this.useRouteSelector} {...props} />
        ))
      );
    }
    return authorized;
  };

  private dispatch() {
    this.emitter.emit(EVENT_ROUTE_RELOAD);
  }

  private unsubscribe = (callback: SubscribeCallback, id?: string) => () => {
    this.emitter.removeListener(EVENT_ROUTE_RELOAD, callback);
    id && this.emitter.removeListener(EVENT_SINGLE_ROUTE_UPDATE_PREFIX + id, callback);
  };

  subscribe = (callback: SubscribeCallback, id?: string) => {
    this.emitter.addListener(EVENT_ROUTE_RELOAD, callback);
    id && this.emitter.addListener(EVENT_SINGLE_ROUTE_UPDATE_PREFIX + id, callback);
    return this.unsubscribe(callback, id);
  };

  getState = () => ({
    routes: this.routes,
  });

  useRouteSelector: UseRouteSelectorFunc = (
    id: string,
    selector: Selector<any>,
    equalityFn: EqualityFn<any> = defaultEqualityFn
  ) => {
    const state = this.getState();
    const [, forceRender] = useReducer(s => s + 1, 0);
    const latestSelectedState = useRef<any>();
    const selectedState = selector(state);
    const checkForUpdates = useCallback(function() {
      const newSelectedState = selector(state);
      if (equalityFn(newSelectedState, latestSelectedState.current!)) {
        return;
      }
      latestSelectedState.current = newSelectedState;
      forceRender();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
      return this.subscribe(checkForUpdates, id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return selectedState;
  };
}

const manager = new AppManager();

export default manager;

export const useRouteSelector: UseRouteSelectorFunc = manager.useRouteSelector;
