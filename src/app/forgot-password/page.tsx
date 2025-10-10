'use client';

import ForgotPasswordForm from '@/components/auth/forgot-password-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-6">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              <ArrowLeft size={16} className="mr-1" />
              Back to Login
            </Button>
          </Link>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
