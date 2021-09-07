import React from 'react';

import { stringify } from 'qs';
import { useReactComponent } from 'sunmao';
import { useSelector as useReduxSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { AuthComponentProps, UseRouteSelectorFunc } from '../../types';

import Authorized from './Authorized';

function DefaultLoadingComponent() {
  return <></>;
}

export const AuthComponent: React.ComponentType<AuthComponentProps> = ({
  ROUTEID: id,
  useRouteSelector,
  loading: LoadingComponent = DefaultLoadingComponent,
  children,
}: AuthComponentProps) => {
  const authority = useRouteSelector(id, state => state.routes.get(id)?.authority || []);
  const isLogin = useReduxSelector((state: any) => state.auth.status === 'ok');
  if (window.location.pathname === '/login') {
    return children;
  }
  const redirect = window.location.pathname + window.location.search;
  return (
    <Authorized
      authority={authority.length ? authority : ['ROLE_USER']}
      noMatch={isLogin ? <Redirect to="/exception/403" /> : <Redirect to={`/login?${stringify({ redirect })}`} />}
    >
      {isLogin ? children : <LoadingComponent />}
    </Authorized>
  );
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
