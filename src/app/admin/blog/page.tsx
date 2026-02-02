
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

interface NotificationState {
    type: 'success' | 'error' | 'info';
    message: string;
    isOpen: boolean;
}

interface ConfirmationState {
    message: string;
    isOpen: boolean;
    onConfirm: () => void;
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState<boolean | null>(null);

    // Simple MVP Auth Check (In real app, use Middleware or NextAuth)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    // Restore session and Fetch Posts
    useEffect(() => {
        // Check local storage for persistent login
        const storedAuth = localStorage.getItem('adminAuth');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // 1. Fetch Posts & Connection Status
    useEffect(() => {
        if (!isAuthenticated) return;

        // Using 'Import3' as identified in previous conversation for "BlogPosts"
        wixClient.items.query('Import5')
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


        // Check connection status
        fetch('/api/auth/linkedin/status')
            .then(res => res.json())
            .then(data => setConnected(data.connected))
            .catch(() => setConnected(false));
    }, [isAuthenticated]);


    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [shareStatus, setShareStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [postUrl, setPostUrl] = useState('');

    // Notification State
    const [notification, setNotification] = useState<NotificationState>({ type: 'info', message: '', isOpen: false });
    // Confirmation State
    const [confirmation, setConfirmation] = useState<ConfirmationState>({ message: '', isOpen: false, onConfirm: () => { } });

    const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
        setNotification({ type, message, isOpen: true });
    };

    const closeNotification = () => {
        setNotification(prev => ({ ...prev, isOpen: false }));
    };

    const showConfirmation = (message: string, onConfirm: () => void) => {
        setConfirmation({ message, isOpen: true, onConfirm });
    };

    const closeConfirmation = () => {
        setConfirmation(prev => ({ ...prev, isOpen: false }));
    };

    const handleShareClick = (post: BlogPost) => {
        setSelectedPost(post);
        setShareStatus('idle');
        setStatusMessage('');
        setPostUrl('');
        setModalOpen(true);
    };

    const confirmShare = async () => {
        if (!selectedPost) return;

        setShareStatus('loading');
        try {
            const res = await fetch('/api/linkedin/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug: selectedPost.slug,
                    title: selectedPost.title,
                    excerpt: selectedPost.excerpt,
                    coverImage: selectedPost.coverImage
                })
            });

            const data = await res.json();

            if (res.ok) {
                setShareStatus('success');
                setStatusMessage('Shared successfully!');
                if (data.url) setPostUrl(data.url);
                // Optimistically update UI
                setPosts(prev => prev.map(p => p._id === selectedPost._id ? { ...p, linkedInStatus: 'Posted' } : p));
                // Removed auto-close so user can see the link
            } else {
                setShareStatus('error');
                setStatusMessage(`Error: ${data.error}`);
            }
        } catch (e) {
            setShareStatus('error');
            setStatusMessage('Network error occurred.');
        }
    };

    const handleLogin = () => {
        // Simple client-side check for demonstration/internal usage
        if (password === 'admin123' || password === 'agroventia') {
            localStorage.setItem('adminAuth', 'true');
            setIsAuthenticated(true);
        } else {
            showNotification('error', 'Incorrect password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        setIsAuthenticated(false);
    };

    const handleDisconnect = async () => {
        showConfirmation('Are you sure you want to disconnect the LinkedIn account?', async () => {
            try {
                const res = await fetch('/api/auth/linkedin/disconnect', { method: 'POST' });
                if (res.ok) {
                    setConnected(false);
                    showNotification('success', 'LinkedIn disconnected successfully.');
                } else {
                    showNotification('error', 'Failed to disconnect.');
                }
            } catch (e) {
                console.error(e);
                showNotification('error', 'An error occurred.');
            }
            closeConfirmation();
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white rounded shadow-md w-96">
                    <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                    />
                    <button
                        onClick={handleLogin}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="p-10 text-center">Loading posts...</div>;
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold">Blog Administration</h1>
                <div className="flex gap-4">
                    {!connected ? (
                        <a
                            href="/api/auth/linkedin/login"
                            className="bg-[#0077b5] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#005c8d] cursor-pointer"
                        >
                            Connect LinkedIn
                        </a>
                    ) : (
                        <div className="flex gap-2">
                            <span className="text-green-600 font-medium flex items-center border px-4 py-2 rounded bg-green-50 border-green-200 text-sm md:text-base">
                                LinkedIn Connected
                            </span>
                            <button
                                onClick={handleDisconnect}
                                className="text-red-600 px-3 py-2 border border-red-200 rounded hover:bg-red-50 cursor-pointer text-sm"
                            >
                                Disconnect
                            </button>
                        </div>
                    )}
                    <button onClick={handleLogout} className="text-red-500 hover:text-red-700 cursor-pointer text-sm md:text-base">Logout</button>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LinkedIn Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {posts.map((post) => (
                            <tr key={post._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{post.title}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{post.slug}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {post.linkedInStatus === 'Posted' ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Posted
                                        </span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                            Not Shared
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {connected && post.linkedInStatus !== 'Posted' && (
                                        <button
                                            onClick={() => handleShareClick(post)}
                                            className="text-[#0077b5] hover:text-[#005c8d] font-medium cursor-pointer"
                                        >
                                            Share to LinkedIn
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4">
                {posts.map((post) => (
                    <div key={post._id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
                        <div className="mb-3">
                            <h3 className="font-semibold text-lg text-gray-900">{post.title}</h3>
                            <p className="text-xs text-gray-500 truncate">{post.slug}</p>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-500">
                                {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : '-'}
                            </span>
                            {post.linkedInStatus === 'Posted' ? (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    Posted
                                </span>
                            ) : (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                    Not Shared
                                </span>
                            )}
                        </div>

                        {connected && post.linkedInStatus !== 'Posted' && (
                            <button
                                onClick={() => handleShareClick(post)}
                                className="w-full text-center py-2 bg-[#0077b5] text-white rounded hover:bg-[#005c8d] font-medium text-sm transition-colors"
                            >
                                Share to LinkedIn
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Share Modal */}
            {modalOpen && selectedPost && (
                <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Share to LinkedIn</h2>

                        {shareStatus === 'idle' && (
                            <>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to share <strong>"{selectedPost.title}"</strong> to your LinkedIn profile?
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmShare}
                                        className="px-4 py-2 bg-[#0077b5] text-white rounded hover:bg-[#005c8d] cursor-pointer"
                                    >
                                        Share Now
                                    </button>
                                </div>
                            </>
                        )}

                        {shareStatus === 'loading' && (
                            <div className="flex flex-col items-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077b5] mb-2"></div>
                                <p className="text-gray-600">Posting to LinkedIn...</p>
                            </div>
                        )}

                        {(shareStatus === 'success' || shareStatus === 'error') && (
                            <div className="text-center py-2">
                                <div className={`mb-2 text-lg font-semibold ${shareStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {statusMessage}
                                </div>
                                {shareStatus === 'success' && postUrl && (
                                    <a
                                        href={postUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-4 px-4 py-2 bg-[#0077b5] text-white rounded hover:bg-[#005c8d] cursor-pointer"
                                    >
                                        View on LinkedIn
                                    </a>
                                )}
                                <div className="mt-4">
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 cursor-pointer"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Notification Modal */}
            {notification.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl border-l-4 border-l-transparent"
                        style={{ borderLeftColor: notification.type === 'error' ? '#ef4444' : notification.type === 'success' ? '#22c55e' : '#3b82f6' }}>
                        <h3 className={`text-lg font-semibold mb-2 ${notification.type === 'error' ? 'text-red-600' : notification.type === 'success' ? 'text-green-600' : 'text-blue-600'}`}>
                            {notification.type === 'error' ? 'Error' : notification.type === 'success' ? 'Success' : 'Notice'}
                        </h3>
                        <p className="text-gray-700 mb-4">{notification.message}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={closeNotification}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmation.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">Confirm Action</h3>
                        <p className="text-gray-700 mb-6">{confirmation.message}</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeConfirmation}
                                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { confirmation.onConfirm(); }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium cursor-pointer"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

