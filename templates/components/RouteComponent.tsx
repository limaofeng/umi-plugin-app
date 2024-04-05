import React, { useEffect, useState } from 'react';

import { useAccess } from 'umi';
import { useReactComponent } from '@asany/sunmao';
import { Navigate } from 'react-router-dom';
import { stringify } from 'qs';

import { AuthComponentProps, UseRouteSelectorFunc } from '../typings';
import { useLoading } from '../contexts/LoadingContext';

function DefaultLoadingComponent() {
  return <></>;
}

export const AuthComponent = ({
  ROUTEID: id,
  loginUrl,
  useRouteSelector,
  loading: LoadingComponent = DefaultLoadingComponent,
  children,
}: AuthComponentProps) => {
  const access = useAccess();
  const authorized = useRouteSelector(id, ({ routes }) => routes.get(id)?.authorized);

  const pathname = window.location.pathname.substring(Math.max(__webpack_public_path__.length - 1, 0))
  const search = window.location.search;
  
  if (pathname.startsWith(loginUrl)){
    return children;
  }

  if (!access.isAuthorized && authorized) {
    if (pathname === '/') {
      return <Navigate to={loginUrl} replace />;
    }
    return <Navigate to={
      {
        pathname: loginUrl,
        search: '?' + stringify({ redirect: pathname + search })
      }
    } replace />;
  }

  return children || <LoadingComponent />;
};

interface RouteComponentProps {
  ROUTEID: string;
  useRouteSelector: UseRouteSelectorFunc;
  [key: string]: any;
}

export default function RouteComponent({ ROUTEID: id, useRouteSelector, ...props }: RouteComponentProps) {
  const component = useRouteSelector(id, (state) => state.routes.get(id)?.component);
  const Component = useReactComponent(component!.template, component!.blocks, {
    id,
  });
  {{#isLoadingAuto}}
  const [first, setFirst] = useState(true);
  const { loading, setLoading } = useLoading();
  useEffect(() => {
    if (!first) {
      return;
    }
    setFirst(false);
    if(!loading) {
      return;
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 120);
    return () => {
      clearTimeout(timer);
    }
  }, [loading]);
  {{/isLoadingAuto}}
  return <Component {...props} />;
}
