import React from 'react';
import { Settings } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 arabic-text">
            الإعدادات
          </h1>
          <p className="text-gray-600 arabic-text">
            إعدادات النظام والنادي
          </p>
        </div>
      </div>

      <div className="card-ar">
        <div className="text-center py-12">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 arabic-text">
            قريباً
          </h3>
          <p className="text-gray-600 arabic-text">
            صفحة الإعدادات قيد التطوير
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;