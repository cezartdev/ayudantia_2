import { useState } from 'react';
import { getProfile, updateProfile, deleteProfile } from '@services/profile.service';
import { useAuth } from '@context/AuthContext';
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert.js';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [profileData, setProfileData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ email: '', password: '' });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleGetProfile = async () => {
    try {
      const result = await getProfile();

      if (result?.data?.userData) {
        setProfileData(result.data.userData);
      } else if (result?.data) {
        setProfileData(result.data);
      } else if (result?.message) {
        showErrorAlert('Error', result.message);
      } else {
        showErrorAlert('Error', 'Respuesta inesperada del servidor');
      }
    } catch(error){
        showErrorAlert('Error', error.response?.data?.message || error.message || 'Ocurrió un error inesperado' );
    }
  };

  const handleEditProfile = () => {
    setEditFormData({ email: profileData?.email || user?.email || '', password: '' });
    setShowEditModal(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Validar que al menos un campo esté lleno
    if (!editFormData.email && !editFormData.password) {
      showErrorAlert('Error', 'Debe proporcionar al menos un campo para actualizar');
      return;
    }

    // Preparar datos a enviar (solo los que no estén vacíos)
    const dataToUpdate = {};
    if (editFormData.email) dataToUpdate.email = editFormData.email;
    if (editFormData.password) dataToUpdate.password = editFormData.password;

    try {
      const result = await updateProfile(dataToUpdate);

      if (result?.status === 'Success') {
        showSuccessAlert('¡Éxito!', result.message || 'Perfil actualizado exitosamente');
        setShowEditModal(false);
        setEditFormData({ email: '', password: '' });
        // Actualizar los datos del perfil
        handleGetProfile();
      } else if (result?.message) {
        showErrorAlert('Error', result.message);
      } else {
        showErrorAlert('Error', 'Respuesta inesperada del servidor');
      }
    } catch (error) {
      showErrorAlert('Error', error.response?.data?.message || error.message || 'Ocurrió un error inesperado');
    }
  };

  const handleDeleteProfile = () => {
    deleteDataAlert(async () => {
      try {
        const result = await deleteProfile();

        if (result?.status === 'Success') {
          showSuccessAlert('¡Perfil eliminado!', result.message || 'Tu cuenta ha sido eliminada exitosamente');
          // Cerrar sesión y redirigir al login
          setTimeout(() => {
            logout();
            navigate('/auth');
          }, 2000);
        } else if (result?.message) {
          showErrorAlert('Error', result.message);
        } else {
          showErrorAlert('Error', 'Respuesta inesperada del servidor');
        }
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || error.message || 'Ocurrió un error inesperado');
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-2xl transform transition-all hover:scale-105">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Página de Inicio
        </h1>
        
        <button 
          onClick={handleGetProfile} 
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Obtener Perfil
        </button>

        {profileData && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Datos del usuario autenticado</h2>
            <div className="text-sm text-gray-700">
              <p><strong>Email:</strong> {profileData.email ?? user?.email ?? '—'}</p>
              <p><strong>Password:</strong> {profileData.password ?? '— (Contraseña oculta)'}</p>
            </div>
            <pre className="text-xs text-gray-500 mt-4 overflow-auto">(token){JSON.stringify(profileData, null, 2)}</pre>
            
            {/* Botones de Editar y Eliminar */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleEditProfile}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                ✏️ Editar Perfil
              </button>
              <button
                onClick={handleDeleteProfile}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300"
              >
                🗑️ Eliminar Perfil
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Editar Perfil
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nuevo Email (opcional)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nueva Contraseña (opcional)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={editFormData.password}
                  onChange={handleInputChange}
                  placeholder="********"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                />
                <p className="text-xs text-gray-500 mt-1">Deja los campos en blanco si no deseas cambiarlos</p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditFormData({ email: '', password: '' });
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
