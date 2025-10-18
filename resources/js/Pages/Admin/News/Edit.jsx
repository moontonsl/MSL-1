import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from '@/Components/Card';

export default function EditNews({ news }) {
    const [imagePreview, setImagePreview] = useState(news.news_img1 ? `/images/MCC/IndivNews/${news.news_img1}` : null);
    
    const { data, setData, put, processing, errors } = useForm({
        news_title: news.news_title,
        news_subtitle: news.news_subtitle,
        news_canonical: news.news_canonical,
        news_state: news.news_state,
        news_img1: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.news.update', news.id), {
            forceFormData: true
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('news_img1', file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('news_img1', null);
        setImagePreview(null);
    };

    return (
        <AdminLayout>
            <Head title="Edit News" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit News</h1>

                    <Card>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label htmlFor="news_title" className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="news_title"
                                    value={data.news_title}
                                    onChange={(e) => setData('news_title', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.news_title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.news_title}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="news_subtitle" className="block text-sm font-medium text-gray-700">
                                    Subtitle
                                </label>
                                <input
                                    type="text"
                                    id="news_subtitle"
                                    value={data.news_subtitle}
                                    onChange={(e) => setData('news_subtitle', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.news_subtitle && (
                                    <p className="mt-1 text-sm text-red-600">{errors.news_subtitle}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="news_canonical" className="block text-sm font-medium text-gray-700">
                                    Content
                                </label>
                                <textarea
                                    id="news_canonical"
                                    value={data.news_canonical}
                                    onChange={(e) => setData('news_canonical', e.target.value)}
                                    rows={6}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.news_canonical && (
                                    <p className="mt-1 text-sm text-red-600">{errors.news_canonical}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="news_state" className="block text-sm font-medium text-gray-700">
                                    State
                                </label>
                                <select
                                    id="news_state"
                                    value={data.news_state}
                                    onChange={(e) => setData('news_state', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                                {errors.news_state && (
                                    <p className="mt-1 text-sm text-red-600">{errors.news_state}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="news_img1" className="block text-sm font-medium text-gray-700">
                                    News Image
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="file"
                                        id="news_img1"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    {imagePreview && (
                                        <div className="mt-4 relative inline-block">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-32 w-auto rounded-md border border-gray-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {errors.news_img1 && (
                                    <p className="mt-1 text-sm text-red-600">{errors.news_img1}</p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                                >
                                    Update News
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}