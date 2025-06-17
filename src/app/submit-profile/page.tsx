'use client';

import ProfileForm from '@/components/profiles/profile-form';
import ProtectedRoute from '@/components/layout/protected-route';

export default function SubmitProfilePage() {
  return (
    <ProtectedRoute>
      <div className="py-8">
        <ProfileForm />
      </div>
    </ProtectedRoute>
  );
}
