'use client';

import React, { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import {Link} from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/auth/signin" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="mr-2" /> Back to Sign In
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white">Forgot Password?</h1>
          <p className="text-gray-400 mt-3">Enter your email and we’ll send you a reset link</p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 py-4 text-white placeholder-gray-500 focus:border-indigo-500"
                  placeholder="admin@yourstore.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl font-semibold text-white"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
              ✅
            </div>
            <h3 className="text-2xl font-semibold text-white mt-6">Check Your Email</h3>
            <p className="text-gray-400 mt-3">We’ve sent a password reset link to <span className="text-indigo-400">{email}</span></p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;