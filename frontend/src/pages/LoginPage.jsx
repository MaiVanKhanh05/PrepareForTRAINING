import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();
    console.log("Email gửi đi:", email);
    console.log("Password gửi đi:", password);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login',
        {
          email: email,
          password: password
        })

      const token = response.data?.token;

      if (!token) {
        alert("Login not successful");
        return; // stop the function
      }

      localStorage.setItem('token', token);

      navigate('/home');
    } catch (error) {
      error.response && error.response.data && error.response.data.message
        ? alert(error.response.data.message)
        : alert('Passowrd and Email is incorrect');
    }

  }


  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-zinc-200/60 p-8">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Welcome back
          </h1>

          <p className="text-sm text-zinc-500 mt-2">
            Enter your credentials to access your account.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin} >

          {/* EMAIL */}
          <div className="space-y-1.5">
            <label
              className="text-sm font-medium text-zinc-700"
              htmlFor="email"
            >
              Email Address
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Mail className="h-4 w-4" />
              </div>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                className="text-sm font-medium text-zinc-700"
                htmlFor="password"
              >
                Password
              </label>

              <a
                href="#"
                className="text-xs font-medium text-zinc-500"
              >
                Forgot password?
              </a>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Lock className="h-4 w-4" />
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-2.5 rounded-lg text-sm font-medium"
          >
            Sign In
            <ArrowRight className="h-4 w-4" />
          </button>

        </form>

        <div className="mt-8 pt-6 border-t border-zinc-100">
          <p className="text-center text-sm text-zinc-500">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-zinc-900 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}