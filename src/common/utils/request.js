import { stringify } from 'qs';
import { message } from 'antd';

const getFormData = (params) => {
  const formData = new window.FormData();
  Object.entries(params).map((item) => {
    if (item[1]) {
      formData.append(
        item[0],
        typeof item[1] === 'object' ? JSON.stringify(item[1]) : item[1],
      );
    }
    return false;
  });
  return formData;
};
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  let newOptions;
  let newUrl = url;
  let responseBody = {};
  const { body, params } = options;
  if (!(typeof body === 'string') && body) {
    newOptions = Object.assign({}, options, { body: getFormData(body) });
    responseBody = {
      credentials: 'same-origin',
      ...newOptions,
    };
  } else {
    newOptions = options;
    responseBody = {
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      ...newOptions,
    };
  }
  // get
  if (params) {
    newUrl += `?${stringify(params)}`;
  }
  const response = await fetch(newUrl, responseBody);

  if (response.status !== 200) {
    message.error('网络或服务器异常！');
    return {
      code: response.status,
    };
  }
  const data = await response.json();
  if (data.code !== '200') {
    message.error(data.msg);
  }
  return data;
}
