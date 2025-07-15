// ✅ CategoryModal with React Hook Form + Yup validation
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import {
  X,
  Upload,
  Loader2,
  Save,
  FolderOpen,
  AlertCircle
} from 'lucide-react';
import categoryService from '../../services/categoryService';
import { errorToast } from '../../core/core-index';

const schema = yup.object().shape({
  nameEn: yup.string().required('English name is required'),
  nameAr: yup.string().required('Arabic name is required'),
  descriptionEn: yup.string().nullable(),
  descriptionAr: yup.string().nullable(),
  parentCategory: yup.string().nullable(),
  isActive: yup.boolean(),
  image: yup.mixed()
});

const CategoryModal = ({
  isOpen,
  onClose,
  category = null,
  parentCategories = [],
  onDone,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const isEditing = !!category;

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const { createCategory, updateCategory } = categoryService();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      parentCategory: '',
      isActive: true,
      image: ''
    }
  });

  useEffect(() => {
    if (isEditing && category) {
      reset({
        nameEn: category.nameEn || '',
        nameAr: category.nameAr || '',
        descriptionEn: category.descriptionEn || '',
        descriptionAr: category.descriptionAr || '',
        parentCategory: category.parentCategory?._id || '',
        isActive: category.isActive !== undefined ? category.isActive : true,
        image: category.image || ''
      });
      if (category.image) setImagePreview(category.image);
    } else {
      reset();
      setImagePreview('');
      setImageFile(null);
    }
  }, [category, isEditing, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) return;

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const categoryData = {
        ...data,
        imageFile: imageFile
      };

      let response;
      if (isEditing) {
        response = await updateCategory(category._id, categoryData);
      } else {
        response = await createCategory(categoryData);
      }
      // ✅ Check if response is actually successful
      if (response?.status === "Success" || response?.code === 200) {
        onDone && onDone();
        onClose();
      } else {
        errorToast(response?.data?.message)
        throw new Error(response?.data?.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-2xl border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-slate-100 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isEditing ? 'Edit Category' : 'Add New Category'}
              </h2>
              <p className="text-slate-600 mt-1">
                {isEditing ? 'Update category information' : 'Create a new product category'}
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
          {/* English & Arabic Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                English Name *
              </label>
              <input
                type="text"
                {...register('nameEn')}
                className={`w-full px-4 py-3 border rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 focus:bg-white transition-all duration-200 ${errors.nameEn ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                placeholder="Enter English name"
              />
              {errors.nameEn && <p className="text-red-500 text-xs mt-1">{errors.nameEn.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Arabic Name *
              </label>
              <input
                type="text"
                {...register('nameAr')}
                className={`w-full px-4 py-3 border rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 focus:bg-white transition-all duration-200 text-right ${errors.nameAr ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                placeholder="أدخل الاسم بالعربية"
                dir="rtl"
              />
              {errors.nameAr && <p className="text-red-500 text-xs mt-1">{errors.nameAr.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                English Description
              </label>
              <textarea {...register('descriptionEn')} rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 focus:bg-white transition-all duration-200 resize-none" placeholder="Enter English description" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Arabic Description
              </label>
              <textarea {...register('descriptionAr')} rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 focus:bg-white transition-all duration-200 resize-none text-right" placeholder="أدخل الوصف بالعربية" dir="rtl" />
            </div>
          </div>

          {/* Parent Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Parent Category
            </label>
            <div className="relative">
              <select {...register('parentCategory')} className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 focus:bg-white transition-all duration-200 appearance-none">
                <option value="">Select parent category (optional)</option>
                {parentCategories
                  .filter(cat => cat.level === 0 || cat.level === 1)
                  .map((cat) => {
                    const name = i18n.language === 'ar' ? cat.nameAr : cat.nameEn;
                    const prefix = cat.level === 1 ? '-- ' : '';
                    return (
                      <option key={cat._id} value={cat._id}>
                        {prefix}{name}
                      </option>
                    );
                  })}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <FolderOpen className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Category Image
            </label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200">
                  <img src={imagePreview} alt="Category preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => {
                    setImagePreview('');
                    setImageFile(null);
                    setValue('image', '');
                  }} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 text-sm">Click to upload or drag and drop</p>
                  <p className="text-slate-400 text-xs mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Category Status</h3>
              <p className="text-xs text-slate-600">Enable or disable this category</p>
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
                  <span>{isEditing ? 'Update Category' : 'Create Category'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
