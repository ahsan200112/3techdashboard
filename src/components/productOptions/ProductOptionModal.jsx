// ✅ ProductOptionModal with React Hook Form + Yup validation
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import {
  X,
  Loader2,
  Save,
  Plus,
  Trash2,
  Type,
  Palette,
  AlertCircle
} from 'lucide-react';
import productOptionService from '../../services/productOptionService';
import { errorToast } from '../../core/core-index';

const schema = yup.object().shape({
  name: yup.string().required('Option name is required'),
  type: yup.string().oneOf(['text', 'color'], 'Invalid option type').required('Option type is required'),
  isActive: yup.boolean(),
  values: yup.array().of(
    yup.object().shape({
      value: yup.string().required('Value is required'),
      colorCode: yup.string().when('$type', {
        is: 'color',
        then: (schema) => schema.required('Color code is required for color type'),
        otherwise: (schema) => schema.nullable()
      })
    })
  ).min(1, 'At least one value is required')
});

const ProductOptionModal = ({
  isOpen,
  onClose,
  productOption = null,
  onDone,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const isEditing = !!productOption;

  const [loading, setLoading] = useState(false);

  const { createProductOption, updateProductOption } = productOptionService();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      type: 'text',
      isActive: true,
      values: [{ value: '', colorCode: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'values'
  });

  const watchType = watch('type');

  useEffect(() => {
    if (isEditing && productOption) {
      reset({
        name: productOption.name || '',
        type: productOption.type || 'text',
        isActive: productOption.isActive !== undefined ? productOption.isActive : true,
        values: productOption.values && productOption.values.length > 0 
          ? productOption.values.map(val => ({
              _id: val._id,
              value: val.value || '',
              colorCode: val.colorCode || ''
            }))
          : [{ value: '', colorCode: '' }]
      });
    } else {
      console.log('Setting up form for new option');
      reset({
        name: '',
        type: 'text',
        isActive: true,
        values: [{ value: '', colorCode: '' }]
      });
    }
  }, [productOption, isEditing, isOpen, reset]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      let response;
      if (isEditing) {
        // For editing, we need to handle removeIds for deleted values
        const existingValueIds = productOption.values?.map(v => v._id) || [];
        const currentValueIds = data.values.filter(v => v._id).map(v => v._id);
        const removeIds = existingValueIds.filter(id => !currentValueIds.includes(id));
        
        const updateData = {
          ...data,
          removeIds
        };
        
        response = await updateProductOption(productOption._id, updateData);
      } else {
        response = await createProductOption(data);
      }
      
      // ✅ Check if response is actually successful
      if (response?.status === "Success" || response?.code === 200) {
        onDone && onDone();
        onClose();
      } else {
        errorToast(response?.data?.message);
        throw new Error(response?.data?.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addValue = () => {
    append({ value: '', colorCode: '' });
  };

  const removeValue = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-3xl border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-slate-100 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isEditing ? 'Edit Product Option' : 'Add New Product Option'}
              </h2>
              <p className="text-slate-600 mt-1">
                {isEditing ? 'Update product option information' : 'Create a new product option with values'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Option Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Option Name *
            </label>
            <input
              type="text"
              {...register('name')}
              className={`w-full px-4 py-3 border rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 focus:bg-white transition-all duration-200 ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              placeholder="Enter option name (e.g., Size, Color)"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Option Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Option Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  {...register('type')}
                  value="text"
                  className="sr-only peer"
                />
                <div className="flex items-center p-4 border-2 border-slate-200 rounded-2xl peer-checked:border-purple-400 peer-checked:bg-purple-50 transition-all duration-200">
                  <Type className="w-5 h-5 text-slate-600 peer-checked:text-purple-600 mr-3" />
                  <div>
                    <div className="font-semibold text-slate-900">Text</div>
                    <div className="text-xs text-slate-500">Simple text values</div>
                  </div>
                </div>
              </label>
              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  {...register('type')}
                  value="color"
                  className="sr-only peer"
                />
                <div className="flex items-center p-4 border-2 border-slate-200 rounded-2xl peer-checked:border-purple-400 peer-checked:bg-purple-50 transition-all duration-200">
                  <Palette className="w-5 h-5 text-slate-600 peer-checked:text-purple-600 mr-3" />
                  <div>
                    <div className="font-semibold text-slate-900">Color</div>
                    <div className="text-xs text-slate-500">Color with hex codes</div>
                  </div>
                </div>
              </label>
            </div>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
          </div>

          {/* Option Values */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-slate-700">
                Option Values *
              </label>
              <button
                type="button"
                onClick={addValue}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Value
              </button>
            </div>
            
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      {...register(`values.${index}.value`)}
                      className={`w-full px-4 py-3 border rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 focus:bg-white transition-all duration-200 ${errors.values?.[index]?.value ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                      placeholder={watchType === 'color' ? 'Color name (e.g., Red)' : 'Value (e.g., Small)'}
                    />
                    {errors.values?.[index]?.value && (
                      <p className="text-red-500 text-xs mt-1">{errors.values[index].value.message}</p>
                    )}
                  </div>
                  
                  {watchType === 'color' && (
                    <div className="w-32">
                      <div className="relative">
                        <input
                          type="color"
                          {...register(`values.${index}.colorCode`)}
                          className="w-full h-12 border border-slate-200 rounded-2xl cursor-pointer"
                        />
                      </div>
                      {errors.values?.[index]?.colorCode && (
                        <p className="text-red-500 text-xs mt-1">{errors.values[index].colorCode.message}</p>
                      )}
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => removeValue(index)}
                    disabled={fields.length === 1}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {errors.values && <p className="text-red-500 text-xs mt-1">{errors.values.message}</p>}
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Option Status</h3>
              <p className="text-xs text-slate-600">Enable or disable this product option</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...register('isActive')} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-6 py-3 text-slate-700 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all duration-200 font-medium">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Update Option' : 'Create Option'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductOptionModal;