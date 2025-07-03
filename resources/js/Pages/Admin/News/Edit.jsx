import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from '@/Components/Card';

export default function EditNews({ news }) {
    const { data, setData, put, processing, errors } = useForm({
        news_title: news.news_title,
        news_subtitle: news.news_subtitle,
        news_canonical: news.news_canonical,
        news_state: news.news_state,
        news_img1: news.news_img1 || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.news.update', news.id));
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
                                    Image URL
                                </label>
                                <input
                                    type="text"
                                    id="news_img1"
                                    value={data.news_img1}
                                    onChange={(e) => setData('news_img1', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
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