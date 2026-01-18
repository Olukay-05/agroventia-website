
"use client";
import { useState, useEffect } from 'react';
import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';

// Initialize Wix Client using Public ID for retrieving blog posts (Read-Only usually fine for this context)
// For writing back status, we rely on the API routes which have server-side secrets
const wixClient = createClient({
    modules: { items },
    auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID || 'your-client-id' }),
});

interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: string;
    linkedInStatus?: string; // Custom field in Wix
    publishedDate?: string;
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState<boolean | null>(null);

    // Simple MVP Auth Check (In real app, use Middleware or NextAuth)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    // 1. Fetch Posts & Connection Status
    useEffect(() => {
        if (!isAuthenticated) return;

        wixClient.items.query('BlogPosts')
            .descending('publishedDate')
            .find()
            .then(res => {
                // Map Wix items to our interface
                setPosts(res.items.map(item => ({
                    _id: item._id as string,
                    title: item.title as string,
                    slug: item.slug as string,
                    excerpt: item.excerpt as string,
                    coverImage: item.coverImage as string,
                    linkedInStatus: item.linkedInStatus as string,
                    publishedDate: item.publishedDate as string
                })));
                setLoading(false);
            });

        // Check if connected (hacky way: try to call a lightweight protected route or check a flag)
        // For MVP, we can assume if the key exists in our DB, we are connected.
        // Ideally, we'd have an API route /api/auth/linkedin/status
    }, [isAuthenticated]);


    const handleShare = async (post: BlogPost) => {
        const confirm = window.confirm(`Share "${post.title}" to LinkedIn?`);
        if (!confirm) return;

        try {
            const res = await fetch('/api/linkedin/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug: post.slug,
                    title: post.title,
                    excerpt: post.excerpt,
                    coverImage: post.coverImage
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Shared successfully!');
                // Optimistically update UI
                setPosts(prev => prev.map(p => p._id === post._id ? { ...p, linkedInStatus: 'Posted' } : p));
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (e) {
            alert('Network error occurred.');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                    <h1 className="text-xl font-bold mb-4">Admin Login</h1>
                    <input
                        type="password"
                        placeholder="Enter Admin Password"
                        className="w-full border p-2 rounded mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={() => {
                            if (password === 'admin123') setIsAuthenticated(true); // HARDCODED MVP PASSWORD
                            else alert('Incorrect');
                        }}
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Blog Automation Dashboard</h1>
                    <div className="space-x-4">
                        <a
                            href="/api/auth/linkedin/login"
                            className="bg-[#0077b5] text-white px-4 py-2 rounded hover:bg-[#005c8d] transition"
                        >
                            {connected === true ? 'Refresh Connection' : 'Connect LinkedIn'}
                        </a>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={4} className="text-center py-4">Loading posts...</td></tr>
                            ) : posts.map(post => (
                                <tr key={post._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{post.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.linkedInStatus === 'Posted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {post.linkedInStatus || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleShare(post)}
                                            disabled={post.linkedInStatus === 'Posted'}
                                            className={`text-white px-3 py-1 rounded ${post.linkedInStatus === 'Posted'
                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                                }`}
                                        >
                                            {post.linkedInStatus === 'Posted' ? 'Posted' : 'Share to LinkedIn'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
