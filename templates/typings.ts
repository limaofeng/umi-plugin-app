export type UseRouteSelectorFunc = <Selected>(
  id: string,
  selector: Selector<Selected>,
  equalityFn?: EqualityFn<Selected>
) => Selected;

export interface CurrentUser {
  /**
   * 用户ID
   */
  uid: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 称号
   */
  title: string;
  /**
   * 头像
   */
  avatar: any;
  /**
   * 邮箱
   */
  email: string;
  /**
   * 签名
   */
  signature: string;
  /**
   * 组名
   */
  group: string;
  /**
   * 电话
   */
  phone: string;
  /**
   * 权限
   */
  authorities: [string];
  /**
   * 令牌
   */
  token: string;
}

export interface IApplication {
  id: string;
  name: string;
  logo: string;
  enabled: boolean;
  description: string;
  clientId: string;
  loginRoute: IRoute;
  layoutRoute: IRoute;
  routes: IRoute[];
  menus: MenuData[];
}

export interface MenuData {
  id: string;
  icon: string;
  name: string;
  path: string;
  type: string;
  index: number;
  authorized: boolean;
  hideInBreadcrumb: boolean;
  enabled: boolean;
  parent: {
    id: string;
  };
  children?: MenuData[];
}

export interface IRouteComponent {
  template: string;
  blocks: any[];
  routeWrapper?: {
    template: string;
    props: any[];
  };
}

export interface IRoute {
  id: string;
  path?: string;
  name?: string;
  type: 'route';
  component?: IRouteComponent;
  configuration: any;
  application: IApplication;
  authorized: boolean;
  authority: string[];
  redirect: string;
  wrappers: any[];
  routes: any[] | undefined;
  exact: boolean;
  parent: any;
}

export type SubscribeCallback = () => void;

export type Selector<Selected> = (state: AppManagerState) => Selected;

export type EqualityFn<Selected> = (a: Selected, b: Selected) => boolean;

interface AppManagerState {
  routes: Map<string, IRoute>;
}

export interface LoadingComponentProps {}

export interface AuthComponentProps {
  ROUTEID: string;
  redirectUrl?: string;
  useRouteSelector: UseRouteSelectorFunc;
  children: React.ReactElement;
  loading?: React.ComponentType<LoadingComponentProps>;
  route?: any;
  location?: any;
}
