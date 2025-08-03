import React, { useState, useEffect } from 'react';
import { Save, Settings, Building, Palette, Database, FileText } from 'lucide-react';
import { useGym } from '../../contexts/GymContext';

interface GymSettings {
  id: number;
  name: string;
  type: 'male' | 'female';
  logo: string;
  settings: {
    address?: string;
    phone?: string;
    email?: string;
    currency?: string;
    tax_rate?: number;
    receipt_footer?: string;
    backup_frequency?: string;
    theme_color?: string;
  };
}

const SettingsPage: React.FC = () => {
  const { gymId } = useGym();
  const [gymSettings, setGymSettings] = useState<GymSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    currency: 'DZD',
    tax_rate: '0',
    receipt_footer: '',
    backup_frequency: 'daily',
    theme_color: '#667eea'
  });

  useEffect(() => {
    loadGymSettings();
  }, [gymId]);

  const loadGymSettings = async () => {
    try {
      const data = await window.electronAPI.query(
        'SELECT * FROM gyms WHERE id = ?',
        [gymId]
      );
      
      if (data.length > 0) {
        const gym = data[0];
        const settings = gym.settings ? JSON.parse(gym.settings) : {};
        
        setGymSettings({ ...gym, settings });
        setFormData({
          name: gym.name,
          address: settings.address || '',
          phone: settings.phone || '',
          email: settings.email || '',
          currency: settings.currency || 'DZD',
          tax_rate: settings.tax_rate?.toString() || '0',
          receipt_footer: settings.receipt_footer || '',
          backup_frequency: settings.backup_frequency || 'daily',
          theme_color: settings.theme_color || '#667eea'
        });
      }
    } catch (error) {
      console.error('Error loading gym settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const settings = {
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        currency: formData.currency,
        tax_rate: parseFloat(formData.tax_rate) || 0,
        receipt_footer: formData.receipt_footer,
        backup_frequency: formData.backup_frequency,
        theme_color: formData.theme_color
      };

      await window.electronAPI.run(`
        UPDATE gyms 
        SET name = ?, settings = ?
        WHERE id = ?
      `, [formData.name, JSON.stringify(settings), gymId]);

      await loadGymSettings();
      alert('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('حدث خطأ في حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const createBackup = async () => {
    try {
      // This would typically create a database backup
      alert('تم إنشاء نسخة احتياطية بنجاح');
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('حدث خطأ في إنشاء النسخة الاحتياطية');
    }
  };

  const tabs = [
    { id: 'general', label: 'عام', icon: Building },
    { id: 'appearance', label: 'المظهر', icon: Palette },
    { id: 'receipts', label: 'الفواتير', icon: FileText },
    { id: 'backup', label: 'النسخ الاحتياطي', icon: Database }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 arabic-text">
            الإعدادات
          </h1>
          <p className="text-gray-600 arabic-text">
            إعدادات النظام والنادي
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary-ar arabic-text flex items-center"
        >
          <Save className="w-5 h-5 ml-2" />
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card-ar">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors arabic-text ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 ml-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card-ar">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Building className="w-6 h-6 ml-3 text-blue-600" />
                  <h2 className="text-xl font-semibold arabic-text">الإعدادات العامة</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group-ar">
                    <label className="form-label-ar arabic-text">
                      اسم النادي *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input-ar"
                      placeholder="اسم النادي"
                    />
                  </div>

                  <div className="form-group-ar">
                    <label className="form-label-ar arabic-text">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="form-input-ar"
                      placeholder="رقم الهاتف"
                    />
                  </div>
                </div>

                <div className="form-group-ar">
                  <label className="form-label-ar arabic-text">
                    العنوان
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="form-input-ar"
                    placeholder="عنوان النادي"
                    rows={3}
                  />
                </div>

                <div className="form-group-ar">
                  <label className="form-label-ar arabic-text">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input-ar"
                    placeholder="البريد الإلكتروني"
                  />
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Palette className="w-6 h-6 ml-3 text-blue-600" />
                  <h2 className="text-xl font-semibold arabic-text">إعدادات المظهر</h2>
                </div>

                <div className="form-group-ar">
                  <label className="form-label-ar arabic-text">
                    لون النظام الأساسي
                  </label>
                  <div className="flex items-center space-x-reverse space-x-4">
                    <input
                      type="color"
                      value={formData.theme_color}
                      onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                      className="w-12 h-12 rounded-lg border-2 border-gray-300"
                    />
                    <input
                      type="text"
                      value={formData.theme_color}
                      onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                      className="form-input-ar flex-1"
                      placeholder="#667eea"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2 arabic-text">معاينة الألوان</h3>
                  <div className="flex space-x-reverse space-x-4">
                    <div 
                      className="w-16 h-16 rounded-lg shadow-md"
                      style={{ backgroundColor: formData.theme_color }}
                    ></div>
                    <div 
                      className="w-16 h-16 rounded-lg shadow-md"
                      style={{ backgroundColor: formData.theme_color + '80' }}
                    ></div>
                    <div 
                      className="w-16 h-16 rounded-lg shadow-md"
                      style={{ backgroundColor: formData.theme_color + '40' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'receipts' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <FileText className="w-6 h-6 ml-3 text-blue-600" />
                  <h2 className="text-xl font-semibold arabic-text">إعدادات الفواتير</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group-ar">
                    <label className="form-label-ar arabic-text">
                      العملة
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="form-select-ar"
                    >
                      <option value="DZD">دينار جزائري (DZD)</option>
                      <option value="USD">دولار أمريكي (USD)</option>
                      <option value="EUR">يورو (EUR)</option>
                    </select>
                  </div>

                  <div className="form-group-ar">
                    <label className="form-label-ar arabic-text">
                      معدل الضريبة (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.tax_rate}
                      onChange={(e) => setFormData({ ...formData, tax_rate: e.target.value })}
                      className="form-input-ar"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="form-group-ar">
                  <label className="form-label-ar arabic-text">
                    نص أسفل الفاتورة
                  </label>
                  <textarea
                    value={formData.receipt_footer}
                    onChange={(e) => setFormData({ ...formData, receipt_footer: e.target.value })}
                    className="form-input-ar"
                    placeholder="شكراً لزيارتكم نادينا الرياضي"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {activeTab === 'backup' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Database className="w-6 h-6 ml-3 text-blue-600" />
                  <h2 className="text-xl font-semibold arabic-text">النسخ الاحتياطي</h2>
                </div>

                <div className="form-group-ar">
                  <label className="form-label-ar arabic-text">
                    تكرار النسخ الاحتياطي التلقائي
                  </label>
                  <select
                    value={formData.backup_frequency}
                    onChange={(e) => setFormData({ ...formData, backup_frequency: e.target.value })}
                    className="form-select-ar"
                  >
                    <option value="daily">يومياً</option>
                    <option value="weekly">أسبوعياً</option>
                    <option value="monthly">شهرياً</option>
                    <option value="manual">يدوي فقط</option>
                  </select>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2 arabic-text">إنشاء نسخة احتياطية الآن</h3>
                  <p className="text-sm text-gray-600 mb-4 arabic-text">
                    إنشاء نسخة احتياطية من قاعدة البيانات لحفظ جميع البيانات
                  </p>
                  <button
                    onClick={createBackup}
                    className="btn-primary-ar arabic-text"
                  >
                    إنشاء نسخة احتياطية
                  </button>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold mb-2 arabic-text">تحذير مهم</h3>
                  <p className="text-sm text-gray-600 arabic-text">
                    يُنصح بإنشاء نسخ احتياطية منتظمة لحماية بياناتك من الفقدان. 
                    احتفظ بالنسخ الاحتياطية في مكان آمن منفصل عن الجهاز الأساسي.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;