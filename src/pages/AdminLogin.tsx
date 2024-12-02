import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const navigate = useNavigate();

    // const handleAdminLogin = async () => {
    //     // Implement your admin login logic here
    //     const { data, error } = await supabase
    //         .from('admins')
    //         .select('id')
    //         .eq('username', adminUsername)
    //         .eq('password', adminPassword) // Adjust this according to your authentication method
    //         .single();

    //     if (error || !data) {
    //         alert('Invalid admin username or password');
    //         return;
    //     }

    //     // Navigate to the admin dashboard or another page upon successful login
    //     navigate('/admin-dashboard');
    // };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pos-background to-pos-surface">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
                <div className="mb-4">
                    <Input
                        type="text"
                        placeholder="Admin Username"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="mb-6">
                    <Input
                        type="password"
                        placeholder="Password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full"
                    />
                </div>
                <Button className="w-full">
                    Login
                </Button>
            </div>
        </div>
    );
};

export default AdminLogin; 