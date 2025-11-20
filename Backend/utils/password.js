import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  return hashed;
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};
