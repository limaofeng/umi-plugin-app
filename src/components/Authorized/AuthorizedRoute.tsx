import React from 'react';

import { Redirect, Route } from 'react-router-dom';

import Authorized from './Authorized';
import { IAuthorityType } from './CheckPermissions';

interface AuthorizedRouteProps {
  currentAuthority: string;
  component: React.ComponentClass<any, any>;
  render: (props: any) => React.ReactNode;
  redirectPath: string;
  authority: IAuthorityType;
}

const AuthorizedRoute: React.ComponentType<AuthorizedRouteProps> = ({
  component: Component,
  render,
  authority,
  redirectPath,
  ...rest
}) => {
  const handleNoMatchRedirect = () => {
    return <Redirect to={{ pathname: redirectPath }} />;
  };
  const handleRender = (props: any) => {
    return Component ? <Component {...props} /> : render(props);
  };
  return (
    <Authorized authority={authority} noMatch={<Route {...rest} render={handleNoMatchRedirect} />}>
      <Route {...rest} render={handleRender} />
    </Authorized>
  );
};

export default AuthorizedRoute;
