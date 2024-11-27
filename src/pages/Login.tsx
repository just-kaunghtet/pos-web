import React, { useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
interface user {
  username: string;
}
const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (user:user ) => {
    const { data, error } = await supabase
    .from('users')
    .select('id, password_hash')
    .eq('username', userName)
    .single();
    const isUserValid = data !== null;
    const isPasswordValid = password === data.password_hash;
    if (isUserValid && isPasswordValid) {
      navigate(`/home/${user.username}`);
    } else {
      alert('Invalid username or password');
    }
  };

  const navigateToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-violet-200">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="mb-6">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex justify-between items-center">
          <Button onClick={() => handleLogin({username: userName})} className="w-full mr-2">
            Login
          </Button>
          <Button variant="link" onClick={navigateToSignUp}>
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login; 