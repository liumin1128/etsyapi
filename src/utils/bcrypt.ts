import bcrypt from 'bcrypt';

export async function getHash(str: string) {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(str, salt);
}

export async function isMatch(str, hash) {
  return await bcrypt.compare(str, hash);
}
