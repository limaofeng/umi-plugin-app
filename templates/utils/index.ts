import { client } from '../../apollo';
import tokenHelper from '../../apollo/TokenHelper';

import {
  viewer as LOAD_CURRENTUSER,
  loginByUsername as LOGIN_BY_USERNAME,
  logout as LOGOUT
} from '../gql/auth.gql';

import type { CurrentUser } from '../typings';

export interface TreeOptions<T> {
  idKey: string;
  pidKey: string;
  childrenKey?: string;
  getParentKey?: (data: T) => string;
  converter?: (data: T) => T;
  sort?: (l: T, r: T) => number;
}

export const sleep = (time: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(0);
    }, time);
  });

export const delay = async (call: Promise<any>, time: number) => {
  const [data] = await Promise.allSettled([call, sleep(time)]);
  if (data.status === 'rejected') {
    throw data.reason;
  } else if (data.status === 'fulfilled') {
    return data.value;
  }
  throw new Error(`Promise 状态错误:${JSON.stringify(data)}`);
};

export function getFieldValue(root: any, path: string) {
  let value = root;
  for (const key of path.split('.')) {
    if (!value) {
      return;
    }
    value = value[key];
  }
  return value;
}

export function tree<T = any>(
  list: T[],
  {
    idKey = 'id',
    pidKey = 'parent_id',
    childrenKey = 'children',
    getParentKey = (data: any) => getFieldValue(data, pidKey),
    converter = undefined,
    sort = undefined,
  }: TreeOptions<T>
) {
  const start = new Date().getTime();
  try {
    let roots = list.filter((item: any) => {
      if (getParentKey(item)) {
        const parent = list.find(parent => (parent as any)[idKey].toString() === getParentKey(item).toString());
        if (!parent) {
          return true;
        }
        if (!(parent as any)[childrenKey]) {
          (parent as any)[childrenKey] = [];
        }
        const children = (parent as any)[childrenKey];
        // TODO 逻辑漏洞
        item['parent'] = parent;
        children.push(item);
        if (sort) {
          (parent as any)[childrenKey] = children.sort(sort);
        }
        return false;
      }
      return true;
    });

    const converterFunc = (item: any) => {
      if (item[childrenKey]) {
        item[childrenKey] = item[childrenKey].map(converterFunc);
      }
      return converter ? converter(item) : item;
    };
    roots = sort ? roots.sort(sort) : roots;
    return converter ? roots.map(converterFunc) : roots;
  } finally {
    console.log('list -> tree 耗时', new Date().getTime() - start, 'ms');
  }
}

export async function loadCurrentuser(): Promise<CurrentUser> {
  const token = localStorage.getItem('credentials');
  if (!tokenHelper.withToken() && token) {
    tokenHelper.setToken(token);
  }
  const {
    data: { viewer },
  } = await client.query({
    query: LOAD_CURRENTUSER,
    fetchPolicy: 'no-cache',
  });
  return viewer;
}

export async function loginWithUsername(username: string, password: string) {
  const {
    data: { login },
  } = await delay(
    client.mutate({
      mutation: LOGIN_BY_USERNAME,
      variables: {
        clientId: '{{id}}',
        username,
        password,
      },
      fetchPolicy: 'no-cache',
    }),
    1000
  );
  localStorage.setItem('credentials', login.token);
  tokenHelper.setToken(login.token);
  return login;
}

export async function logout() {
  try {
    await Promise.race([
      client.mutate({
        mutation: LOGOUT,
        fetchPolicy: 'no-cache',
      }),
      sleep(300)
    ]);
  } finally {
    localStorage.removeItem('credentials');
    tokenHelper.resetToken();
  }
}