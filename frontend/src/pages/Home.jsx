import { useState } from 'react';
import { getProfile } from '@services/profile.service';
import { useAuth } from '@context/AuthContext';
import { showErrorAlert } from '@helpers/sweetAlert.js';

const Home = () => {
  const [profileData, setProfileData] = useState(null);
  const { user } = useAuth();

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
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
