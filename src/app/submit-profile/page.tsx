'use client';

import ProfileForm from '@/components/profiles/profile-form';
import ProtectedRoute from '@/components/layout/protected-route';
import { Suspense } from 'react';

function SubmitProfileContent() {
  return (
    <ProtectedRoute>
      <div className="py-8">
        <ProfileForm />
      </div>
    </ProtectedRoute>
  );
}

export default function SubmitProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubmitProfileContent />
    </Suspense>
  );
}
