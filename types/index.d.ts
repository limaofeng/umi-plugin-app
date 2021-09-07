export type UseRouteSelectorFunc = <Selected>(
  id: string,
  selector: Selector<Selected>,
  equalityFn?: EqualityFn<Selected>
) => Selected;

export interface IApplication {
  path: string;
}

export interface IRouteComponent {
  template: string;
  props: any[];
  routeWrapper?: {
    template: string;
    props: any[];
  };
}

export interface IRoute {
  id: string;
  path?: string;
  name?: string;
  type: 'menu' | 'header' | 'divider' | 'route' | 'portal';
  component?: IRouteComponent;
  configuration: any;
  application: IApplication;
  authorized: boolean;
  authority: string[];
  wrappers: any[];
  routes: any[] | undefined;
  exact: boolean;
  parent: any;
}

type SubscribeCallback = () => void;

export type Selector<Selected> = (state: AppManagerState) => Selected;

export type EqualityFn<Selected> = (a: Selected, b: Selected) => boolean;

interface AppManagerState {
  routes: Map<string, IRoute>;
}

interface LoadingComponentProps {}

interface AuthComponentProps {
  ROUTEID: string;
  useRouteSelector: UseRouteSelectorFunc;
  children: React.ReactElement;
  loading?: React.ComponentType<LoadingComponentProps>;
  route?: any;
  location?: any;
}
