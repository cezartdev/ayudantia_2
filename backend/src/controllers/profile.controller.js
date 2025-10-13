import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { updateProfile, deleteProfile, } from "../services/profile.service.js";

export function getPublicProfile(req, res) {
  handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export function getPrivateProfile(req, res) {
  const user = req.user;

  handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
    message: `¡Hola, ${user.email}! Este es tu perfil privado. Solo tú puedes verlo.`,
    userData: user,
  });
}

export async function updatePrivateProfile(req, res) {
  try {
    const { sub } = req.user; // id del usuario autenticado
    const { email, password } = req.body || {};

    if (!email && !password) {
      return handleErrorClient(res, 400, "Debe proporcionar email y/o password para actualizar");
    }

    const updatedUser = await updateProfile(sub, { email, password });

    handleSuccess(res, 200, "Perfil actualizado exitosamente", { user: updatedUser });
  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      return handleErrorClient(res, 404, error.message);
    }
    if (error.message === "El email ya está registrado" || error.code === "23505") {
      return handleErrorClient(res, 409, "El email ya está registrado");
    }
    handleErrorServer(res, 500, "Error al actualizar el perfil", error.message);
  }
}

export async function deletePrivateProfile(req, res) {
  try {
    const { sub } = req.user; // id del usuario autenticado
    const deleted = await deleteProfile(sub);
    handleSuccess(res, 200, "Perfil eliminado exitosamente", { message: "La cuenta ha sido eliminada definitivamente" });
  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      return handleErrorClient(res, 404, error.message);
    }
    handleErrorServer(res, 500, "Error al eliminar el perfil", error.message);
  }
}