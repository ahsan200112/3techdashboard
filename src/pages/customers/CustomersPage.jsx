import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';

const CustomersPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('nav.customers')}
        </h1>
        <p className="text-gray-600">
          Manage your customer relationships and data
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Customers page coming soon</h3>
        <p className="text-gray-600">This page will show all your customers and their information</p>
      </div>
    </div>
  );
};

export default CustomersPage;