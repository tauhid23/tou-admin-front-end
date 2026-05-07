'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {Link} from 'react-router-dom';

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Verify OTP</h1>
        <p className="text-gray-400 mb-10">Enter the 6-digit code sent to your email</p>

        <div className="flex gap-4 justify-center mb-10">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { if (el) inputRefs.current[index] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-14 text-center text-3xl font-semibold bg-white/10 border border-white/10 rounded-2xl text-white focus:border-indigo-500 focus:outline-none"
            />
          ))}
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl font-semibold text-white">
          Verify OTP
        </button>

        <p className="text-gray-400 text-sm mt-6">
          Didn’t receive code? <span className="text-indigo-400 cursor-pointer hover:underline">Resend</span>
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOTPPage;