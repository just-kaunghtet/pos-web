import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';


const MonthlySale = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSalesData = async () => {
            const { data, error } = await supabase
                .from('sales') 
                .select('item_id, item_name, sale_count');

            if (error) {
                console.error('Error fetching sales data:', error);
            } else {
                setSalesData(data);
            }
            setLoading(false);
        };

        fetchSalesData();
    }, []);

    if (loading) {
        return <p>Loading sales data...</p>;
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-pos-background to-pos-surface">
            <div className="max-w-4xl mx-auto">
            <div className="flex mb-8">
                <Link to={`/home/`}>
                    <Button variant="ghost" className="mr-4">
                        <ArrowLeft className="w-5 h-5" />
                        
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-pos-text">Item Sales</h1>
            </div>
            <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
                <h1 className="text-3xl font-bold mb-6 text-center">Sales Report</h1>
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-4">Item ID</th>
                            <th className="border border-gray-300 p-4">Item Name</th>
                            <th className="border border-gray-300 p-4">Sale Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData.map((item) => (
                            <tr key={item.id}>
                                <td className="border border-gray-300 p-4">{item.item_id}</td>
                                <td className="border border-gray-300 p-4">{item.item_name}</td>
                                <td className="border border-gray-300 p-4">{item.sale_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
};

export default MonthlySale; 