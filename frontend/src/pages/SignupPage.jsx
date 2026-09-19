import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Hash, Users, ChevronDown } from 'lucide-react';
import axios from 'axios';

export default function SignupPage() {

  const [id, setId] = React.useState('');
  const [full_name, setFull_name] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {

    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/auth/signup',
        {
          id,
          full_name,
          email,
          role,
          password
        })

      const token = response.data?.token;

      if (!token) {
        alert("Signup not successful");
        return; // stop the function
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        full_name: response.data.full_name,
        email: response.data.email,
        role: response.data.role
      }));

      navigate('/home');
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      }
    }

  }



  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-zinc-200/60 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Create an account</h1>
          <p className="text-sm text-zinc-500 mt-2">Sign up to get started with our platform.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSignup}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700" htmlFor="id">
              Student ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Hash className="h-4 w-4" />
              </div>
              <input
                id="id"
                type="text"
                placeholder="SE123456"
                value={id}
                onChange={(e) => setId(e.target.value.toUpperCase())}
                required
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700" htmlFor="name" >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <User className="h-4 w-4" />
              </div>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={full_name}
                onChange={(e) => setFull_name(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700" htmlFor="email" >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700" htmlFor="role" >
              Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Users className="h-4 w-4" />
              </div>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm appearance-none"
              >
                <option value="" disabled>Select your role</option>
                <option value="USER">User</option>
                <option value="OWNER">Owner</option>
                <option value="ADMIN">Admin</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-400">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            value="signup"
            className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 hover:shadow-md active:scale-[0.98] transition-all"
          >
            Create Account
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-100">
          <p className="text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-zinc-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
