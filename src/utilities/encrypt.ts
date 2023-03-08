import bcrypt from "bcrypt";

const saltRounds = 10;

export async function encrypt(password: string) {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

export async function compare(password: string, hash: string) {
  const result = await bcrypt.compare(password, hash);
  return result;
}

export function makeId(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
