import React from 'react';

import { useAccess } from 'umi';
import { useReactComponent } from '@asany/sunmao';
import { Navigate } from 'react-router-dom';
import { stringify } from 'qs';

import { AuthComponentProps, UseRouteSelectorFunc } from '../typings';

function DefaultLoadingComponent() {
  return <></>;
}

export const AuthComponent = ({
  ROUTEID: id,
  redirectUrl = '/login',
  useRouteSelector,
  loading: LoadingComponent = DefaultLoadingComponent,
  children,
}: AuthComponentProps) => {
  const access = useAccess();
  const authorized = useRouteSelector(id, ({ routes }) => routes.get(id)?.authorized);

  if (window.location.pathname.endsWith('/login')) {
    return children;
  }

  let redirect = window.location.pathname + window.location.search;
  redirect = redirect.substring(Math.max(__webpack_public_path__.length - 1, 0));

  if (!access.isAuthorized && authorized) {
    if (!redirect) {
      return <Navigate to={redirectUrl} replace />;
    }
    return <Navigate to={`${redirectUrl}${redirectUrl.includes('?') ? '&' : '?'}${stringify({ redirect })}`} replace />;
  }

  return children || <LoadingComponent />;
};

interface RouteComponentProps {
  ROUTEID: string;
  useRouteSelector: UseRouteSelectorFunc;
  [key: string]: any;
}

// TODO: 不支持 wrappers
// export function RouteWrapperComponent({ ROUTEID: id, useRouteSelector, ...props }: RouteComponentProps) {
//   const routeWrapper = useRouteSelector(id, state => state.routes.get(id)?.component?.routeWrapper);
//   const Component = useReactComponent(routeWrapper!.template, routeWrapper!.props, { id: `${id}_wrapper` });
//   return <Component {...props} />;
// }

export default function RouteComponent({ ROUTEID: id, useRouteSelector, ...props }: RouteComponentProps) {
  const component = useRouteSelector(id, (state) => state.routes.get(id)?.component);
  const Component = useReactComponent(component!.template, component!.blocks, {
    id,
  });
  return <Component {...props} />;
}
