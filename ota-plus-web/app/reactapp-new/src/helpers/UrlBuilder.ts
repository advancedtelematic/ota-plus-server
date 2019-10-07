interface IBuildUrl {
  (queryPath: string | string[], queryParams?: Record<string, string>, url?: string): string;
}

/**
  * Creates an url for given base, path and params
  * @param url
  * @param queryPath as string with slashes or array
  * @param queryParams as object
  * returns url string
  */

const buildUrl: IBuildUrl = (queryPath, queryParams = {}, url): string => {
  const formattedUrl: string = url
    ? url.endsWith('/') ? url : `${url}/`
    : '';
  let path: string = queryPath instanceof Array ? queryPath.join('/') : queryPath;
  if (path && Object.keys(queryParams).length) {
    path = path.concat('?');
  }
  return `${formattedUrl}${path}${
    Object.entries(queryParams)
      .map(
        ([k, v]) => `${k}=${v}`
      ).join('&')
    }`;
};

export default buildUrl;
