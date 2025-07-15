import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Eye, Download } from 'lucide-react';

const OrdersPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('nav.orders')}
        </h1>
        <p className="text-gray-600">
          Manage and track all your store orders
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
        <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Orders page coming soon</h3>
        <p className="text-gray-600">This page will show all your orders and their status</p>
      </div>
    </div>
  );
};

export default OrdersPage;