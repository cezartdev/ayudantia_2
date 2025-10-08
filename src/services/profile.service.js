import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import { usuarioProfileUpdate } from "../validations/usuario.validation.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export async function updateProfile(userId, data) {
    try {
 
        if (!userId || isNaN(userId)) {
            throw new Error("ID de usuario inválido");
        }


        const { error, value } = usuarioProfileUpdate.validate(data);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const { email, password } = value;

        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error("Usuario no encontrado");
        }


        if (email && email !== user.email) {
            const existingUser = await userRepository.findOneBy({ email: email.trim() });
            if (existingUser && existingUser.id !== userId) {
                throw new Error("El email ya está registrado por otro usuario");
            }
            user.email = email.trim();
        }

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

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
    // Validar que userId sea un número válido
    if (!userId || isNaN(userId)) {
        throw new Error("ID de usuario inválido");
    }

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    await userRepository.remove(user);
    return { message: "Perfil eliminado exitosamente" };
}