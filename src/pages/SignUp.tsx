import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        const { data,error } = await supabase
            .from('users')
            .insert([
                {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    username: formData.username,
                    email: formData.email,
                    password_hash: formData.password // Consider hashing the password before storing
                }
            ]);

        if (error) {
            console.error('Error inserting data:', error);
            alert('Error signing up. Please try again.');
        } else {
            console.log('User signed up successfully');
            navigate('/');
        }
    };

    const navigateToLogin = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-violet-300">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            className="w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className="w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                            className="w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full"
                        />
                    </div>
                    <div className="mb-6">
                        <Input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            className="w-full"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <Button type="submit" className="w-full mr-2">
                            Sign Up
                        </Button>
                        <Button variant="link" onClick={navigateToLogin}>
                            Back to Login
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp; 