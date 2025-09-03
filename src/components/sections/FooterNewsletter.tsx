'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const FooterNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      if (email.includes('@')) {
        setStatus('success');
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage('Please enter a valid email address.');
      }

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-[#FDF8F0]/30 to-[#F6F2E7]/20 backdrop-blur-sm rounded-2xl border-2 border-[#281909] p-8 hover:border-[#225217] transition-all duration-300">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-[#281909] rounded-full flex items-center justify-center">
              <Mail size={20} className="text-[#FDF8F0]" />
            </div>
            <h4 className="text-xl font-semibold text-[#281909]">
              Stay Updated
            </h4>
          </div>
          <p className="text-[#281909] leading-relaxed">
            Get the latest news about agricultural innovations, product updates,
            and industry insights delivered to your inbox.
          </p>
        </div>

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="
                flex-1 bg-[#FDF8F0]
                border-2 border-[#281909] text-[#281909]
                placeholder-[#281909]/50
                focus:border-[#225217] focus:ring-[#225217]/20
                transition-all duration-200
              "
              disabled={status === 'loading'}
            />
            <Button
              type="submit"
              disabled={status === 'loading' || !email}
              className="
                bg-[#281909]
                hover:bg-[#225217]
                text-[#FDF8F0] border-0 px-6
                hover:scale-105 hover:shadow-lg hover:shadow-[#225217]/25
                transition-all duration-300 ease-out
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              "
            >
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-[#FDF8F0]/30 border-t-[#FDF8F0] rounded-full animate-spin" />
              ) : (
                'Subscribe'
              )}
            </Button>
          </form>

          {message && (
            <div
              className={`flex items-center space-x-2 text-sm transition-all duration-300 ${
                status === 'success' ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {status === 'success' ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FooterNewsletter;
