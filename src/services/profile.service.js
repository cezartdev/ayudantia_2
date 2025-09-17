import { AppDataSource } from "../config/configDB.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export async function updateProfile(userId, data) {
    try {
        const { email, password } = data || {};

        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        if (email) user.email = email.trim();
        if (password) user.password = await bcrypt.hash(password, 10);


        const saved = await userRepository.save(user);
        delete saved.password;
        return saved;
    } catch (err) {
        if (err.code === '23505') {
            throw new Error("El email ya está registrado");
        }
        throw err;
    }
}


export async function deleteProfile(userId) {
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    await userRepository.remove(user);
}