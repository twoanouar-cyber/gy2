import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Lock, Dumbbell } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (!success) {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch (err) {
      setError('حدث خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleDebug = async () => {
    try {
      const result = await window.electronAPI.debugUsers();
      console.log('Database debug:', result);
      alert(`Users: ${JSON.stringify(result.users, null, 2)}\nGyms: ${JSON.stringify(result.gyms, null, 2)}`);
    } catch (err) {
      console.error('Debug error:', err);
      alert('Debug error: ' + err);
    }
  };

  const handleDebugPasswords = async () => {
    try {
      const result = await window.electronAPI.debugPasswords();
      console.log('Password debug:', result);
      alert(`Password hashes: ${JSON.stringify(result.users, null, 2)}`);
    } catch (err) {
      console.error('Debug passwords error:', err);
      alert('Debug passwords error: ' + err);
    }
  };

  const handleDebugLogin = async () => {
    try {
      const result = await window.electronAPI.debugLogin('admin_male', 'admin123');
      console.log('Debug login result:', result);
      alert(`Debug login result: ${JSON.stringify(result, null, 2)}`);
    } catch (err) {
      console.error('Debug login error:', err);
      alert('Debug login error: ' + err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 arabic-text">
              نظام إدارة النادي الرياضي
            </h1>
            <p className="text-gray-600 mt-2 arabic-text">
              مرحباً بك، يرجى تسجيل الدخول للمتابعة
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center arabic-text">
                {error}
              </div>
            )}

            <div className="form-group-ar">
              <label className="form-label-ar arabic-text">
                اسم المستخدم
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input-ar pl-10"
                  placeholder="أدخل اسم المستخدم"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group-ar">
              <label className="form-label-ar arabic-text">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input-ar pl-10"
                  placeholder="أدخل كلمة المرور"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary-ar arabic-text"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>

            <button
              type="button"
              onClick={handleDebug}
              className="w-full btn-secondary-ar arabic-text mt-2"
            >
              فحص قاعدة البيانات
            </button>

            <button
              type="button"
              onClick={handleDebugPasswords}
              className="w-full btn-secondary-ar arabic-text mt-2"
            >
              فحص كلمات المرور المشفرة
            </button>

            <button
              type="button"
              onClick={handleDebugLogin}
              className="w-full btn-secondary-ar arabic-text mt-2"
            >
              تجربة تسجيل الدخول
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 arabic-text">
              بيانات تجريبية:
            </h3>
            <div className="text-xs text-gray-600 space-y-1 arabic-text">
              <div>نادي الرجال: admin_male / admin123</div>
              <div>نادي السيدات: admin_female / admin123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;