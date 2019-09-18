import axios, { Method, AxiosResponse } from 'axios';
import { Object } from '../utils/types';

type Header = {
  key: string,
  value: string
};

type Error = {
  response?: string;
  request?: string;
  message?: string;
};

interface IAxiosConnector {
  sendRequest: (url: string, method: Method, headers: Object, body: any) => Promise<AxiosResponse>;
  parseResponse: (response: AxiosResponse) => any;
  handleError: (error: { response?: string; request?: string; message?: string; }) => never;
  buildHeaders: (headers: [] | Header[]) => Object;
  getDefaultHeaders: () => Header[];
  request: (url: string, method: Method, headers: Header[], body: any) => any | never;
  get: (url: string, headers: Header[]) => any | never;
  post: (url: string, body: any, headers: Header[]) => any | never;
  put: (url: string, body: any, headers: Header[]) => any | never;
  delete: (url: string, headers: Header[]) => any | never;
}

export class AxiosConnector implements IAxiosConnector {

  sendRequest = (url: string, method: Method, headers: Object, body: any): Promise<AxiosResponse> => {
    return axios.request({
      url, method, headers, data: body
    });
  }

  parseResponse(response: AxiosResponse): any {
    return { ...response.data, url: response.config.url };
  }

  handleError(error: Error): never {
    if (error.response) {
      throw error.response;
    } else if (error.request) {
      throw error.request;
    } else {
      throw error.message;
    }
  }

  buildHeaders(headers: Header[] = []): Object {
    const result: Object = {};
    const parseHeader = (header: Header) => result[header.key] = header.value;

    this.getDefaultHeaders().forEach(parseHeader);

    if (headers) {
      headers.forEach(parseHeader);
    }
    return result;
  }

  getDefaultHeaders(): Header[] {
    return [
      { key: 'Content-Type', value: 'application/json' }
    ];
  }

  request = (url: string, method: Method, headers: Header[] = [], body = '') => {
    return this.sendRequest(url, method, this.buildHeaders(headers), body)
    .then(this.parseResponse).catch(this.handleError);
  }

  get(url: string, headers: Header[] = []) {
    return this.request(url, 'GET', headers);
  }

  post(url: string, body: any, headers: Header[]) {
    return this.request(url, 'POST', headers, body);
  }

  put(url: string, body: any, headers: Header[]) {
    return this.request(url, 'PUT', headers, body);
  }

  delete(url: string, headers: Header[]) {
    return this.request(url, 'DELETE', headers);
  }
}

export default new AxiosConnector();
