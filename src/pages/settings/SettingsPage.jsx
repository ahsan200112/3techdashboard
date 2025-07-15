import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('nav.settings')}
        </h1>
        <p className="text-gray-600">
          Configure your store settings and preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Settings page coming soon</h3>
        <p className="text-gray-600">This page will contain all your store configuration options</p>
      </div>
    </div>
  );
};

export default SettingsPage;