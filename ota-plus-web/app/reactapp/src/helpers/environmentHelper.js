/* eslint-disable import/prefer-default-export */
import encodeUrl from 'encodeurl';
import Cookies from 'js-cookie';
import { API_USER_ORGANIZATIONS_SWITCH_NAMESPACE, ORGANIZATION_NAMESPACE_COOKIE } from '../config';

export const changeUserEnvironment = (namespace) => {
  if (namespace) {
    const pathOrigin = window.location.origin;
    const subUrl = API_USER_ORGANIZATIONS_SWITCH_NAMESPACE.replace('$namespace', namespace);
    const redirectUrl = encodeUrl(`${pathOrigin}${subUrl}`);
    Cookies.set(ORGANIZATION_NAMESPACE_COOKIE, namespace);
    window.location.replace(redirectUrl);
  }
};
