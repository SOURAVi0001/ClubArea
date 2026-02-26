import { useState, useEffect } from 'react';
import { api } from '@/services/axios';

export function TestingDataPage() {
    const [data, setData] = useState({ users: [], admins: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/testing_data');
                setData(response.data);
            } catch (err) {
                setError(err.message || 'Error fetching data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-white">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text mb-8">
                    {data.title || 'Testing Data Interface'}
                </h1>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-blue-300">Users ({data.users?.length || 0})</h2>
                    <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">
                        <pre className="p-6 overflow-x-auto text-sm text-slate-300 max-h-[400px]">
                            {JSON.stringify(data.users, null, 2)}
                        </pre>
                    </div>
                </div>

                <div className="space-y-4 pt-8">
                    <h2 className="text-2xl font-semibold text-indigo-300">Admins ({data.admins?.length || 0})</h2>
                    <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">
                        <pre className="p-6 overflow-x-auto text-sm text-slate-300 max-h-[400px]">
                            {JSON.stringify(data.admins, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
