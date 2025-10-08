import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import { usuarioRegisterLogin } from "../validations/usuario.validation.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export async function createUser(data) {

  const { error, value } = usuarioRegisterLogin.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }


  const existingUser = await userRepository.findOneBy({ email: value.email });
  if (existingUser) {
    throw new Error("El email ya está registrado");
  }

  const hashedPassword = await bcrypt.hash(value.password, 10);

  const newUser = userRepository.create({
    email: value.email,
    password: hashedPassword,
  });

  return await userRepository.save(newUser);
}

export async function findUserByEmail(email) {
  return await userRepository.findOneBy({ email });
}
