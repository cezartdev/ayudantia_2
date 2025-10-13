import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "./user.service.js";
import { usuarioRegisterLogin } from "../validations/usuario.validation.js";

export async function loginUser(email, password) {

  const { error, value } = usuarioRegisterLogin.validate({ email, password });
  if (error) {
    throw new Error(error.details[0].message);
  }

  const user = await findUserByEmail(value.email);
  if (!user) {
    throw new Error("Credenciales incorrectas");
  }

  const isMatch = await bcrypt.compare(value.password, user.password);
  if (!isMatch) {
    throw new Error("Credenciales incorrectas");
  }

  const payload = { sub: user.id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  delete user.password;
  return { user, token };
}
