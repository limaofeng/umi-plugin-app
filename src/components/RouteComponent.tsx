import React from 'react';

import { useAccess } from 'umi';
import { useReactComponent } from 'sunmao';
import { Redirect } from 'react-router-dom';
import { stringify } from 'qs';

import { AuthComponentProps, UseRouteSelectorFunc } from '../../types';

function DefaultLoadingComponent() {
  return <></>;
}

export const AuthComponent: React.ComponentType<AuthComponentProps> = ({
  ROUTEID: id,
  useRouteSelector,
  loading: LoadingComponent = DefaultLoadingComponent,
  children,
}: AuthComponentProps) => {
  const access = useAccess();
  const authorized = useRouteSelector(id, state => state.routes.get(id)?.authorized || []);
  if (window.location.pathname === '/login') {
    return children;
  }
  const redirect = window.location.pathname + window.location.search;
  if (access.anonymous && authorized) {
    return <Redirect to={`/login?${stringify({ redirect })}`} />;
  }

  return children || LoadingComponent;
};

interface RouteComponentProps {
  ROUTEID: string;
  useRouteSelector: UseRouteSelectorFunc;
  [key: string]: any;
}

export function RouteWrapperComponent({ ROUTEID: id, useRouteSelector, ...props }: RouteComponentProps) {
  const routeWrapper = useRouteSelector(id, state => state.routes.get(id)?.component?.routeWrapper);
  const Component = useReactComponent(routeWrapper!.template, routeWrapper!.props, { id: `${id}_wrapper` });
  return <Component {...props} />;
}

export default function RouteComponent({ ROUTEID: id, useRouteSelector, ...props }: RouteComponentProps) {
  const component = useRouteSelector(id, state => state.routes.get(id)?.component);
  const Component = useReactComponent(component!.template, component!.props, {
    id,
  });
  return <Component {...props} />;
}
