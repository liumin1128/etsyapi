export const randomString = (len = 32) => {
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*** */
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i += 1) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

export function removeEmptyValue(obj) {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      delete obj[key];
    }
  }
  return obj;
}

export function parseQueryString(url) {
  const queryString = url.split('?')[1];
  const pairs = queryString.split('&');
  const result = {};
  pairs.forEach((pair) => {
    const keyValue = pair.split('=');
    result[keyValue[0]] = decodeURIComponent(keyValue[1] || '');
  });
  return result;
}

export function serializeObjectToQueryString(obj) {
  const queryString = Object.entries(obj)
    .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(
        value as string,
      )}`;
    })
    .join('&');
  return queryString;
}
