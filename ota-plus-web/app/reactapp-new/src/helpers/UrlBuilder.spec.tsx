import buildUrl from './UrlBuilder';

const baseUrl: string = 'www.mockapi.com';

describe('buildUrl', () => {

  it('should return combined url from base and path given in string', () => {
    const endpoint = 'mockendpoint';
    const expectedUrl = 'www.mockapi.com/mockendpoint';
    expect(buildUrl(endpoint, {}, baseUrl)).toEqual(expectedUrl);
  });

  it('should return combined url from base and path given in array', () => {
    const endpoint = ['mockendpoint1', 'mockendpoint2'];
    const expectedUrl = 'www.mockapi.com/mockendpoint1/mockendpoint2';
    expect(buildUrl(endpoint, {}, baseUrl)).toEqual(expectedUrl);
  });

  it('should return combined url from base and path and query params', () => {
    const endpoint = 'mockendpoint';
    const queryParams = { mockParam1: 'mockValue1', mockParam2: 'mockValue2' };
    const expectedUrl = 'www.mockapi.com/mockendpoint?mockParam1=mockValue1&mockParam2=mockValue2';
    expect(buildUrl(endpoint, queryParams, baseUrl)).toEqual(expectedUrl);
  });
});
