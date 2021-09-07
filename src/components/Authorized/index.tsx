import * as utils from '../../utils';

import InternalAuthorized, { IAuthorizedType } from './Authorized';
import Secured from './Secured';
import check from './CheckPermissions';
import renderAuthorize, { CurrentAuthorityType } from './renderAuthorize';

const { getAuthority } = utils;

type RenderAuthorizeFunc = (currentAuthority: CurrentAuthorityType) => IAuthorizedType;

export const RenderAuthorize: RenderAuthorizeFunc = renderAuthorize(InternalAuthorized);

let Authorized = RenderAuthorize(getAuthority());
Authorized.Secured = Secured;
Authorized.check = check;

export const reloadAuthorized = (): void => {
  Authorized = RenderAuthorize(getAuthority());
  Authorized.Secured = Secured;
  Authorized.check = check;
};

export default Authorized;
