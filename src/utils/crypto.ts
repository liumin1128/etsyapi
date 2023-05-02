// import crypto from 'crypto';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';

const iv = randomBytes(16);

export const md5Encode = (str) =>
  createHash('md5').update(str, 'utf8').digest('hex');

export const aesEncode = (data, key = 'react.mobi') => {
  const cipher = createCipheriv('aes192', key, iv);
  let crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

export const aesDecode = (encrypted, key = 'react.mobi') => {
  const decipher = createDecipheriv('aes192', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
