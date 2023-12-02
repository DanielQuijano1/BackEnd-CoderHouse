import bcrypt from "bcrypt";
import { SALT } from "../config/config.js";

export const createHashValue = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(SALT)))

export const validatePassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword)