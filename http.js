import axios from 'axios';

const PREFIX = process.env.PREFIX;

class RESTFUL {

  API;

  constructor(api) {
    this.API = api;
  }

  processUrl(options, api) {

    if (!api) return '';

    if (typeof api !== 'string') throw new TypeError('url not is string');

    options = options || {};

    return api.split('/').reduce((url, key) => {

      let uri = key.startsWith(':') ? options[key.replace(/^:/, '')] : key;
      uri = uri ?  `/${uri}` : '';

      return `${url}${uri}`;
    }, '').replace(/^\//, '');
  }

  action(config, urlParams) {
    return axios.request({ ...config, url: this.processUrl(urlParams, this.API) });
  }

}

class Resource extends RESTFUL {

  constructor(api) {
    super(PREFIX + api);
  }

  get(urlParams, params, config) {
    return super.action({ method: 'get', params, ...config }, urlParams);
  }

  save(urlParams, data, config) {
    return super.action({ method: 'post', data, ...config }, urlParams);
  }

  delete(urlParams, data, config) {
    return super.action({ method: 'delete', data, ...config }, urlParams);
  }

  update(urlParams, data, config) {
    return super.action({ method: 'put', data, ...config }, urlParams);
  }

}

axios.interceptors.response.use(function(response) {
  return response.data ? response.data : response;
}, function(error) {
  console.error(error);
});


export default Resource;
