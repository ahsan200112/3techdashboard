import React, { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { errorToast, successToast } from '../../core/core-index';
import {
  X,
  Upload,
  Loader2,
  Save,
  Plus,
  Trash2,
  Package,
  AlertCircle,
  Image as ImageIcon,
  Check,
  Tag,
  DollarSign,
  Calendar,
  Info,
  Percent,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import productService from '../../services/productService';

const schema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  description: yup.string().required('Description is required'),
  sku: yup.string().required('SKU is required'),
  weight: yup.number().positive('Weight must be positive').required('Weight is required'),
  barcode: yup.string().nullable(),
  price: yup.number().positive('Price must be positive').required('Price is required'),
  quantity: yup.number().min(0, 'Quantity cannot be negative').required('Quantity is required'),
  productCost: yup.number().min(0, 'Cost cannot be negative').nullable(),
  discountedPrice: yup.number().min(0, 'Discounted price cannot be negative').nullable(),
  categories: yup.array().min(1, 'At least one category is required'),
  keywords: yup.array().of(yup.string()),
  isPublish: yup.boolean(),
  hasDiscount: yup.boolean(),
  discount: yup.object().when('hasDiscount', {
    is: true,
    then: (schema) => schema.shape({
      disocuntType: yup.string().required('Discount type is required'),
      disocuntValue: yup.number().positive('Discount value must be positive').required('Discount value is required'),
      startDate: yup.date().nullable(),
      endDate: yup.date().nullable().min(yup.ref('startDate'), 'End date must be after start date')
    }),
    otherwise: (schema) => schema.nullable()
  }),
  variants: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Variant name is required'),
      sku: yup.string().required('Variant SKU is required'),
      price: yup.number().positive('Price must be positive').required('Price is required'),
      quantity: yup.number().min(0, 'Quantity cannot be negative').nullable(),
      weight: yup.number().positive('Weight must be positive').required('Weight is required'),
      barcode: yup.string().nullable(),
      isPublish: yup.boolean(),
      valueIds: yup.array().of(yup.string())
    })
  )
});

const AddProductPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [images, setImages] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [variantSelectedOptions, setVariantSelectedOptions] = useState({});
  const [optionDropdownVisibility, setOptionDropdownVisibility] = useState({});

  const { getCategoriesList, getProductOptions, createProduct } = productService();

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
      description: '',
      sku: '',
      barcode: '',
      weight: 0,
      price: 0,
      quantity: 0,
      productCost: 0,
      discountedPrice: 0,
      categories: [],
      keywords: [],
      isPublish: true,
      hasDiscount: false,
      discount: {
        disocuntType: 'percentage',
        disocuntValue: 0,
        startDate: null,
        endDate: null
      },
      variants: [
        {
          name: '',
          sku: '',
          price: 0,
          quantity: 0,
          weight: 0,
          barcode: '',
          isPublish: true,
          valueIds: [],
          disocuntType: 'percentage',
          disocuntValue: 0,
          startDate: null,
          endDate: null,
          discountedPrice: 0
        }
      ]
    }
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants'
  });

  const watchHasDiscount = watch('hasDiscount');
  const watchPrice = watch('price');
  const watchDiscountType = watch('discount.disocuntType');
  const watchDiscountValue = watch('discount.disocuntValue');
  const watchKeywords = watch('keywords');
  const variantPrices = useWatch({ control, name: 'variants' });

  // Load categories and product options when component mounts
  useEffect(() => {
    loadCategories();
    loadProductOptions();
  }, []);


  const handleOptionSelect = (index, selected) => {
    const optionId = selected?.value._id;
    if (optionId) {
      setVariantSelectedOptions(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          [optionId]: ''
        }
      }));

      // Hide the dropdown after selecting
      setOptionDropdownVisibility(prev => ({
        ...prev,
        [index]: false
      }));
    }
  };

  const handleValueChange = (index, optionId, valueId) => {
    setVariantSelectedOptions(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [optionId]: valueId
      }
    }));
  };

  const handleRemoveOption = (index, optionId) => {
    setVariantSelectedOptions(prev => {
      const updated = { ...prev };
      if (updated[index]) {
        delete updated[index][optionId];
        if (Object.keys(updated[index]).length === 0) {
          delete updated[index];
        }
      }
      return updated;
    });
  };

  const handleRemoveVariant = (index) => {
    removeVariant(index);

    // Clean up variantSelectedOptions for this index
    setVariantSelectedOptions((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });

    // Clean up dropdown visibility state if needed
    setOptionDropdownVisibility((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  useEffect(() => {
    Object.entries(variantSelectedOptions).forEach(([index, selected]) => {
      const valueIds = Object.values(selected);
      setValue(`variants.${index}.valueIds`, valueIds);
    });
  }, [variantSelectedOptions, setValue]);

  // Calculate discounted price when relevant values change
  useEffect(() => {
    let finalDiscountedPrice = watchPrice;

    if (watchHasDiscount && watchDiscountValue) {
      if (watchDiscountType === 'percentage') {
        finalDiscountedPrice = watchPrice - (watchPrice * (watchDiscountValue / 100));
      } else if (watchDiscountType === 'fixed') {
        finalDiscountedPrice = watchPrice - watchDiscountValue;
      }
    }

    finalDiscountedPrice = Math.max(0, finalDiscountedPrice);
    setDiscountedPrice(finalDiscountedPrice.toFixed(2));
    setValue('discountedPrice', parseFloat(finalDiscountedPrice.toFixed(2)));
  }, [watchHasDiscount, watchPrice, watchDiscountType, watchDiscountValue, setValue]);

  const watchVariants = watch('variants');

  useEffect(() => {
    variantPrices?.forEach((variant, index) => {
      const { price = 0, disocuntType, disocuntValue } = variant || {};
      let discounted = price;

      if (disocuntType && disocuntValue) {
        if (disocuntType === 'percentage') {
          discounted = price - (price * (disocuntValue / 100));
        } else if (disocuntType === 'fixed') {
          discounted = price - disocuntValue;
        }
      }

      discounted = Math.max(0, discounted);
      const newDiscounted = parseFloat(discounted.toFixed(2));

      const currentValue = variant?.discountedPrice;
      if (currentValue !== newDiscounted) {
        setValue(`variants.${index}.discountedPrice`, newDiscounted);
      }
    });
  }, [variantPrices, setValue]);

  const loadCategories = async () => {
    try {
      const response = await getCategoriesList();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProductOptions = async () => {
    try {
      const response = await getProductOptions();
      setProductOptions(response.data || []);
    } catch (error) {
      console.error('Error loading product options:', error);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            file,
            preview: e.target.result,
            isMain: images.length === 0 // First image is main by default
          };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      // If we removed the main image, make the first remaining image main
      if (filtered.length > 0 && !filtered.some(img => img.isMain)) {
        filtered[0].isMain = true;
      }
      return filtered;
    });
  };

  const setMainImage = (imageId) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isMain: img.id === imageId
    })));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !watchKeywords.includes(keywordInput.trim())) {
      setValue('keywords', [...watchKeywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword) => {
    setValue('keywords', watchKeywords.filter(k => k !== keyword));
  };

  const addVariant = () => {
    appendVariant({
      name: '',
      sku: '',
      price: 0,
      quantity: 0,
      weight: 0,
      barcode: '',
      isPublish: true,
      valueIds: [],
      disocuntType: 'percentage',
      disocuntValue: 0,
      startDate: null,
      endDate: null,
      discountedPrice: 0
    });
  };

  const onSubmit = async (data) => {
    // ✅ Custom validation: sum of variant quantities ≤ product quantity
    const productQty = data.quantity ?? 0;
    const totalVariantQty = data.variants?.reduce((sum, v) => sum + (v.quantity || 0), 0);

    if (totalVariantQty > productQty) {
      if (onError) onError("Total variant quantity must not exceed product quantity");
      errorToast("Total variant quantity must not exceed product quantity");
      return; // ❌ prevent submission
    }

    setLoading(true);

    try {
      // Prepare form data
      const formData = new FormData();

      // Add basic product data
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images' || key === 'hasDiscount' || key === 'variants') return;

        // ✅ Properly handle categories array
        if (key === 'categories' && Array.isArray(value)) {
          value.forEach((catId, i) => {
            formData.append(`categories[${i}]`, catId); // no stringify
          });
        }
        // ✅ Properly handle discount object
        else if (key === 'discount' && data.hasDiscount) {
          Object.entries(value || {}).forEach(([k, v]) => {
            formData.append(`discount[${k}]`, v);
          });
        }
        // ✅ Null discount if not applicable
        else if (key === 'discount' && !data.hasDiscount) {
          return;
        }
        // ✅ Others
        else if (key === 'keywords' && Array.isArray(value)) {
          value.forEach((kw, i) => {
            formData.append(`keywords[${i}]`, kw);
          });
        }
        else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      // Add images
      images.forEach((image, index) => {
        if (image.file) {
          formData.append('images', image.file);
          formData.append(`imageIsMain_${index}`, image.isMain);
        }
      });

      // Add variants
      /*
      if (data.variants && data.variants.length > 0) {
        formData.append('variants', JSON.stringify(data.variants));
      }
     */
      if (data.variants && data.variants.length > 0) {
        data.variants.forEach((variant, index) => {
          Object.entries(variant).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((val, i) => {
                formData.append(`variants[${index}][${key}][${i}]`, val);
              });
            } else {
              formData.append(`variants[${index}][${key}]`, value);
            }
          });
        });
      }

      const response = await createProduct(formData);

      if (response?.status === "Success" || response?.code === 200) {
        successToast("Product Added Successfully");
        navigate('/products/allproducts');
      } else {
        errorToast(response?.data?.message || 'Something went wrong!');
        throw new Error(response?.data?.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
              <p className="text-blue-100 text-lg">
                Create a new product for your store
              </p>
            </div>
            <button
              onClick={() => navigate('/products/allproducts')}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Products</span>
            </button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Product Info (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Upload */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Images</h3>

              {/* Image Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <div
                      className={`w-full h-32 rounded-lg border-2 ${image.isMain ? 'border-blue-500' : 'border-slate-200'
                        } overflow-hidden`}
                    >
                      <img
                        src={image.preview}
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* ✅ Delete Button on Hover */}
                    <div className="absolute top-2 right-2 flex items-center">
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="p-2 bg-red-500 text-white rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>

                    {/* ✅ Main Image Checkbox */}
                    <div className="absolute top-2 left-2 flex items-center">
                      <input
                        type="checkbox"
                        checked={image.isMain}
                        onChange={() => setMainImage(image.id)}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-1 text-xs bg-white/80 px-1 rounded text-slate-700">
                        Main
                      </span>
                    </div>
                  </div>
                ))}

                {/* ✅ Upload Button (Max 5 images) */}
                {images.length < 10 && (
                  <label className="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <Upload className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-600">Upload Image</span>
                    <span className="text-xs text-slate-500 mt-1">Max 10 images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <p className="text-xs text-slate-500">
                Upload up to 10 images. Select one image as the main product image.
              </p>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className={`w-full px-4 py-3 border rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                    placeholder="Enter product name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    {...register('sku')}
                    className={`w-full px-4 py-3 border rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 ${errors.sku ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                    placeholder="Enter SKU"
                  />
                  {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Weight *
                  </label>
                  <input
                    type="text"
                    {...register('weight')}
                    className={`w-full px-4 py-3 border rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 ${errors.sku ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                    placeholder="Enter Weight"
                  />
                  {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      {...register('price')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 ${errors.price ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Discounted Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      value={discountedPrice}
                      readOnly
                      className={`w-full pl-10 pr-4 py-3 border rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 ${errors.price ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                    />
                  </div>
                  {errors.discountedPrice && <p className="text-red-500 text-xs mt-1">{errors.discountedPrice.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    {...register('quantity')}
                    className={`w-full px-4 py-3 border rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 ${errors.quantity ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                    placeholder="0"
                  />
                  {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Barcode
                  </label>
                  <input
                    type="text"
                    {...register('barcode')}
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200"
                    placeholder="Enter barcode"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Product Cost
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      {...register('productCost')}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                  placeholder="Enter product description"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>
            </div>

            {/* Variants Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Product Variants</h3>
                  <p className="text-sm text-slate-500">Add variations of your product</p>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Variant
                </button>
              </div>

              {variantFields.length > 0 ? (
                <div className="space-y-4">
                  {variantFields.map((field, index) => (
                    <div key={field.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-slate-900">Variant {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Name *</label>
                          <input
                            {...register(`variants.${index}.name`)}
                            placeholder="Variant name"
                            className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.variants?.[index]?.name ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                          />
                          {errors.variants?.[index]?.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.variants[index].name.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs text-slate-500 mb-1">SKU *</label>
                          <input
                            {...register(`variants.${index}.sku`)}
                            placeholder="Variant SKU"
                            className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.variants?.[index]?.sku ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                          />
                          {errors.variants?.[index]?.sku && (
                            <p className="text-red-500 text-xs mt-1">{errors.variants[index].sku.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Price *</label>
                          <input
                            type="number"
                            step="0.01"
                            {...register(`variants.${index}.price`)}
                            placeholder="Price"
                            className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.variants?.[index]?.price ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                          />
                          {errors.variants?.[index]?.price && (
                            <p className="text-red-500 text-xs mt-1">{errors.variants[index].price.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Quantity</label>
                          <input
                            type="number"
                            {...register(`variants.${index}.quantity`)}
                            placeholder="Quantity"
                            className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.variants?.[index]?.quantity ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                          />
                          {errors.variants?.[index]?.quantity && (
                            <p className="text-red-500 text-xs mt-1">{errors.variants[index].quantity.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Weight *</label>
                          <input
                            type="number"
                            step="0.01"
                            {...register(`variants.${index}.weight`)}
                            placeholder="Weight"
                            className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.variants?.[index]?.weight ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                          />
                          {errors.variants?.[index]?.weight && (
                            <p className="text-red-500 text-xs mt-1">{errors.variants[index].weight.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Barcode</label>
                          <input
                            {...register(`variants.${index}.barcode`)}
                            placeholder="Barcode"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                          />
                          <input
                            type="hidden"
                            {...register(`variants.${index}.valueIds`)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-4">
                        {/* Discount Type */}
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">
                            Discount Type
                          </label>
                          <select
                            {...register(`variants.${index}.disocuntType`)}
                            className="w-full px-4 py-3 border rounded-2xl bg-slate-50/50 
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white 
              transition-all duration-200 border-slate-200 text-sm text-slate-700"
                          >
                            <option value="">Select Type</option>
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed</option>
                          </select>
                        </div>

                        {/* Discount Value */}
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">
                            Discount Value
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            {...register(`variants.${index}.disocuntValue`)}
                            className="w-full px-4 py-3 border rounded-2xl bg-slate-50/50 
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white 
              transition-all duration-200 border-slate-200 text-sm text-slate-700"
                            placeholder="Enter value"
                          />
                        </div>

                        {/* Discounted Price */}
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">
                            Discounted Price
                          </label>
                          <input
                            type="number"
                            readOnly
                            value={watchVariants?.[index]?.discountedPrice || 0}
                            className="w-full px-4 py-3 border rounded-2xl bg-slate-100 
              text-sm text-slate-700 cursor-not-allowed border-slate-200"
                          />
                        </div>

                        {/* Start Date */}
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            {...register(`variants.${index}.startDate`)}
                            className="w-full px-4 py-3 border rounded-2xl bg-slate-50/50 
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white 
              transition-all duration-200 border-slate-200 text-sm text-slate-700"
                          />
                        </div>

                        {/* End Date */}
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            {...register(`variants.${index}.endDate`)}
                            className="w-full px-4 py-3 border rounded-2xl bg-slate-50/50 
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white 
              transition-all duration-200 border-slate-200 text-sm text-slate-700"
                          />
                        </div>
                      </div>

                      {!optionDropdownVisibility[index] && (
                        <button
                          type="button"
                          onClick={() =>
                            setOptionDropdownVisibility(prev => ({ ...prev, [index]: true }))
                          }
                          className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          + Add Product Option
                        </button>
                      )}

                      {/* Main Product Option Dropdown */}
                      {optionDropdownVisibility[index] && (
                        <Select
                          options={productOptions
                            .filter(opt => !(variantSelectedOptions[index]?.[opt._id]))
                            .map(opt => ({
                              value: opt,
                              label: opt.name
                            }))}
                          onChange={(selected) => handleOptionSelect(index, selected)}
                          placeholder="Select a product option..."
                          className="mb-4"
                        />
                      )}

                      {/* Display Selected Options */}
                      {variantSelectedOptions[index] && Object.keys(variantSelectedOptions[index]).length > 0 && (
                        <div className="space-y-4">
                          {Object.entries(variantSelectedOptions[index]).map(([optionId, valueId]) => {
                            const option = productOptions.find(o => o._id === optionId);
                            if (!option) return null;

                            return (
                              <div key={optionId}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-slate-700">{option.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveOption(index, optionId)}
                                    className="text-sm text-red-500 hover:underline"
                                  >
                                    Remove
                                  </button>
                                </div>
                                <Select
                                  options={option.values.map(v => ({
                                    value: v._id,
                                    label: v.value,
                                    color: option.type === 'color' ? v.colorCode : null
                                  }))}
                                  value={
                                    option.values.find(v => v._id === valueId)
                                      ? {
                                        value: valueId,
                                        label: option.values.find(v => v._id === valueId)?.value,
                                        color: option.type === 'color'
                                          ? option.values.find(v => v._id === valueId)?.colorCode
                                          : null
                                      }
                                      : null
                                  }
                                  onChange={(selected) => handleValueChange(index, optionId, selected?.value)}
                                  placeholder={`Select ${option.name}`}
                                  className="w-full"
                                  formatOptionLabel={(opt) => (
                                    <div className="flex items-center">
                                      {opt.color && (
                                        <div
                                          className="w-4 h-4 rounded-full mr-2"
                                          style={{ backgroundColor: opt.color }}
                                        />
                                      )}
                                      {opt.label}
                                    </div>
                                  )}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            {...register(`variants.${index}.isPublish`)}
                            id={`variant-publish-${index}`}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={`variant-publish-${index}`} className="ml-2 text-sm text-slate-700">
                            Published
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Package className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 mb-3">No variants added yet</p>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Variant
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Settings (1/3) */}
          <div className="space-y-6">
            {/* Publish Status */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Publish Status</h3>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-slate-900">Published</div>
                  <div className="text-sm text-slate-500">Make this product visible to customers</div>
                </div>
                <input type="checkbox" {...register('isPublish')} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Categories</h3>
              <Controller
                name="categories"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={categories.map(cat => ({
                      value: cat._id,
                      label: i18n.language === 'ar' ? cat.nameAr : cat.nameEn
                    }))}
                    value={field.value?.map(id => {
                      const category = categories.find(c => c._id === id);
                      return category ? {
                        value: id,
                        label: i18n.language === 'ar' ? category.nameAr : category.nameEn
                      } : null;
                    }).filter(Boolean)}
                    onChange={(selected) => {
                      field.onChange(selected ? selected.map(item => item.value) : []);
                    }}
                    className="text-sm"
                    placeholder="Select categories..."
                  />
                )}
              />
              {errors.categories && <p className="text-red-500 text-xs mt-2">{errors.categories.message}</p>}
            </div>

            {/* Keywords */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Keywords</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  placeholder="Add keyword"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    <Tag className="w-3 h-3" />
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="hover:bg-blue-200 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Discount</h3>

                {/* Toggle Switch */}
                <label className="flex items-center cursor-pointer relative">
                  <span className="mr-2 text-sm text-slate-600">Enable</span>
                  <input
                    type="checkbox"
                    {...register('hasDiscount')}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-300 relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-4 shadow" />
                  </div>
                </label>
              </div>

              {/* Discount Form Fields with animation */}
              {watchHasDiscount && (
                <div className="space-y-3 animate-fade-in-up">
                  {/* Discount Type */}
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Discount Type</label>
                    <select
                      {...register('discount.disocuntType')}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                    {errors.discount?.disocuntType && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.discount.disocuntType.message}
                      </p>
                    )}
                  </div>

                  {/* Discount Value */}
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      {watchDiscountType === 'percentage'
                        ? 'Discount Percentage (%)'
                        : 'Discount Amount ($)'}
                    </label>
                    <div className="relative">
                      {watchDiscountType === 'percentage' ? (
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      ) : (
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      )}
                      <input
                        type="number"
                        step="0.01"
                        {...register('discount.disocuntValue')}
                        placeholder={watchDiscountType === 'percentage' ? '10' : '5.99'}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    {errors.discount?.disocuntValue && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.discount.disocuntValue.message}
                      </p>
                    )}
                  </div>

                  {/* Discounted Price Preview */}
                  {discountedPrice > 0 && (
                    <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                      <div className="flex items-center text-green-700">
                        <Info className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">
                          Discounted Price: ${discountedPrice}
                        </span>
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        {watchDiscountType === 'percentage'
                          ? `${watchDiscountValue}% off the original price`
                          : `$${watchDiscountValue} off the original price`}
                      </div>
                    </div>
                  )}

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Start Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          {...register('discount.startDate')}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                      {errors.discount?.startDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.discount.startDate.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">End Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          {...register('discount.endDate')}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                      {errors.discount?.endDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.discount.endDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-slate-100 mt-8">
          <button
            type="button"
            onClick={() => navigate('/products/allproducts')}
            className="px-6 py-3 text-slate-700 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Create Product</span>
              </>
            )}
          </button>
        </div>
      </form >
    </div >
  );
};

export default AddProductPage;