export type UseRouteSelectorFunc = <Selected>(
  id: string,
  selector: Selector<Selected>,
  equalityFn?: EqualityFn<Selected>
) => Selected;

type FileObject = {
  id: string;
  /** 文件 MIME 类型 */
  mimeType?: string;
  /** 文件名 */
  name: string;
  /** 路径 */
  path: string;
  /** 文件大小 单位：bytes */
  size?: number;
};

export type CurrentUser = {
  /** 账号 */
  account: string;
  /** 权限 */
  authorities: string[];
  /** 头像 */
  avatar?: string | FileObject | any;
  /** 自我介绍 */
  bio?: string;
  /** 生日 */
  birthday?: number | string;
  /** 公司 */
  company?: string;
  /** 邮箱 */
  email?: string;
  /** 位置 */
  location?: string;
  /** 名称 */
  name?: string;
  /** 电话 */
  phone?: string;
  /** 性别 */
  sex?: 'female' | 'male';
  /** 称号 */
  title?: string;
  /** 用户类型 */
  type: string;
  /** 用户ID */
  uid: string;
};

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
  hideInMenu: boolean;
  hideInBreadcrumb: boolean;
  hideChildrenInMenu: boolean;
  enabled: boolean;
  parent: {
    id: string;
  };
  component?: NuwaComponent;
  routes?: MenuData[];
}

export interface NuwaComponent {
  template: string;
  blocks: any[];
  wrappers: any[];
}

export interface IRoute {
  id: string;
  key: string;
  path?: string;
  name?: string;
  type: 'route';
  component?: NuwaComponent;
  configuration: any;
  application: IApplication;
  authorized: boolean;
  authority: string[];
  redirect?: string;
  wrappers: any[];
  layout?: { pure: boolean } | boolean;
  routes: any[] | undefined;
  children: IRoute[] | undefined;
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
