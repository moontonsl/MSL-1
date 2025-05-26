import { useEffect, useState } from "react";

const News = () => {
    const [newsList, setNewsList] = useState([]);

    useEffect(() => {
        const apiUrl = import.meta.env.DEV
            ? '/api/data/news'
            : `${import.meta.env.VITE_API_BASE_URL}/data/news`;

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                console.log("News data:", data);
                setNewsList(data);
            })
            .catch(err => {
                console.error("Failed to fetch news", err);
            });
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-5xl font-bold text-center mb-6">News</h1>
            {newsList.length > 0 ? (
                <div className="space-y-6">
                    {newsList.map((news, idx) => (
                        <div
                            key={idx}
                            className="border p-4 rounded shadow-md max-w-xl mx-auto"
                        >
                            <h2 className="text-2xl font-bold mb-2">{news.title}</h2>
                            <p><strong>Description:</strong> {news.description}</p>
                            <p><strong>Date:</strong> {news.date}</p>
                            <p><strong>Author:</strong> {news.author}</p>
                            {news.link && (
                                <p>
                                    <a href={news.link} target="_blank" className="text-blue-500 underline">
                                        Read More
                                    </a>
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">Loading news...</p>
            )}
        </div>
    );
};

export default News;
