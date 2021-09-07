// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string[] {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const loginCredentials = typeof str === 'undefined' ? localStorage.getItem('loginCredentials') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(loginCredentials!).authority;
  } catch (e) {
    authority = loginCredentials;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['admin'];
}

export function setAuthority({ token, authority }: any) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('loginCredentials', JSON.stringify({ token, authority: proAuthority }));
}
