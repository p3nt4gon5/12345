import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { 
  LogOut, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  MapPin, 
  Calendar, 
  Globe, 
  Phone, 
  Mail,
  User,
  Settings,
  Eye,
  EyeOff,
  Upload,
  Lock
} from 'lucide-react';
import Toast from './Toast';
import AdminPanel from './AdminPanel';

const ADMIN_EMAIL = "kekdanik715@gmail.com";

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile, uploadAvatar, uploadBanner, changePassword } = useProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: '',
    username: '',
    phone: '',
    bio: '',
    website: '',
    location: '',
    birth_date: '',
    is_public: true
  });
  
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [uploading, setUploading] = useState({ avatar: false, banner: false });
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState({ new: false, confirm: false });
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  React.useEffect(() => {
    if (profile) {
      setEditData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        website: profile.website || '',
        location: profile.location || '',
        birth_date: profile.birth_date || '',
        is_public: profile.is_public
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const { error } = await updateProfile(editData);
      if (error) {
        showToast(error, 'error');
        return;
      }
      // Смена пароля, если введён новый
      if (passwords.new) {
        if (passwords.new !== passwords.confirm) {
          showToast('Пароли не совпадают', 'error');
          return;
        }
        setChangingPassword(true);
        const { success, error: passError } = await changePassword(passwords.new);
        setChangingPassword(false);
        if (!success) {
          showToast(passError || 'Ошибка смены пароля', 'error');
          return;
        }
        showToast('Пароль успешно изменён!', 'success');
      } else {
        showToast('Профиль успешно обновлен!', 'success');
      }
      setIsEditing(false);
      setPasswords({ new: '', confirm: '' });
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        website: profile.website || '',
        location: profile.location || '',
        birth_date: profile.birth_date || '',
        is_public: profile.is_public
      });
    }
    setIsEditing(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Размер файла не должен превышать 5MB', 'error');
      return;
    }

    setUploading(prev => ({ ...prev, avatar: true }));
    try {
      const { error } = await uploadAvatar(file);
      if (error) {
        showToast(error, 'error');
      } else {
        showToast('Аватар успешно обновлен!', 'success');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setUploading(prev => ({ ...prev, avatar: false }));
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Размер файла не должен превышать 10MB', 'error');
      return;
    }

    setUploading(prev => ({ ...prev, banner: true }));
    try {
      const { error } = await uploadBanner(file);
      if (error) {
        showToast(error, 'error');
      } else {
        showToast('Баннер успешно обновлен!', 'success');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setUploading(prev => ({ ...prev, banner: false }));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    showToast('Вы успешно вышли из аккаунта', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-3xl font-bold text-gray-600 mb-4">Доступ запрещен</h2>
          <p className="text-gray-500">Пожалуйста, войдите в аккаунт</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Баннер профиля */}
      <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
        {profile.banner_url && (
          <img
            src={profile.banner_url}
            alt="Баннер профиля"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Кнопка загрузки баннера */}
        <button
          onClick={() => bannerInputRef.current?.click()}
          disabled={uploading.banner}
          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all disabled:opacity-50"
        >
          {uploading.banner ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Camera size={20} />
          )}
        </button>
        
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          onChange={handleBannerUpload}
          className="hidden"
        />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Шапка профиля */}
          <div className="p-8 pb-4">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              {/* Аватар */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Аватар"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User size={48} />
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploading.avatar}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-all disabled:opacity-50 shadow-lg"
                >
                  {uploading.avatar ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Camera size={16} />
                  )}
                </button>
                
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              {/* Информация о пользователе */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {profile.full_name || 'Без имени'}
                  </h1>
                  <div className="flex items-center space-x-2">
                    {profile.is_public ? (
                      <span className="flex items-center text-green-600 text-sm">
                        <Eye size={16} className="mr-1" />
                        Public
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-600 text-sm">
                        <EyeOff size={16} className="mr-1" />
                       Private
                      </span>
                    )}
                  </div>
                </div>
                
                {profile.username && (
                  <p className="text-gray-600 mb-2">@{profile.username}</p>
                )}
                
                {profile.bio && (
                  <p className="text-gray-700 mb-4">{profile.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail size={16} className="mr-1" />
                    {user.email}
                  </div>
                  
                  {profile.phone && (
                    <div className="flex items-center">
                      <Phone size={16} className="mr-1" />
                      {profile.phone}
                    </div>
                  )}
                  
                  {profile.location && (
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {profile.location}
                    </div>
                  )}
                  
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Globe size={16} className="mr-1" />
                      Web site
                    </a>
                  )}
                  
                  {profile.birth_date && (
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {new Date(profile.birth_date).toLocaleDateString('ru-RU')}
                    </div>
                  )}
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Save size={16} className="mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <X size={16} className="mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit3 size={16} className="mr-2" />
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Форма редактирования */}
          {isEditing && (
            <div className="border-t border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Settings size={24} className="mr-2" />
                Edit Profile
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name / Nickname
                  </label>
                  <input
                    type="text"
                    value={editData.full_name}
                    onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Введите ваше имя"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                   City / Country
                  </label>
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={editData.website}
                    onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={editData.birth_date}
                    onChange={(e) => setEditData({ ...editData, birth_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About
                  </label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="About you..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editData.is_public}
                      onChange={(e) => setEditData({ ...editData, is_public: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Сделать профиль публичным (другие пользователи смогут видеть ваш профиль)
                    </span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Lock size={16} className="mr-2" />
                    Новый пароль
                  </label>
                  <div className="relative mb-2">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      value={passwords.new}
                      onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      placeholder="Введите новый пароль"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      tabIndex={-1}
                      onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                    >
                      {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      placeholder="Повторите новый пароль"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      tabIndex={-1}
                      onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                    >
                      {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {changingPassword && (
                    <div className="text-blue-500 mt-2">Смена пароля...</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Нижняя панель */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Профиль создан: {new Date(profile.created_at).toLocaleDateString('ru-RU')}
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut size={16} className="mr-2" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast уведомления */}
      {toast && <Toast message={toast.msg} type={toast.type} />}

      {/* Показываем админ-панель только для администратора */}
      {user?.email === ADMIN_EMAIL && <AdminPanel />}
    </div>
  );
};

export default UserProfile;