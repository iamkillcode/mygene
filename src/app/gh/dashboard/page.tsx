'use client';

import ProtectedRoute from '@/components/layout/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GhanaDashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <Card className="shadow-lg bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 p-1">
          <Card className="bg-background">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <span className="text-4xl">🇬🇭</span>
                    <CardTitle className="text-3xl font-headline text-primary">
                        Welcome to MyGene Ghana, {user?.name || user?.email}!
                    </CardTitle>
                </div>
              <CardDescription>This is your personalized dashboard for Ghanaian heritage and profiles.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="flex items-center gap-2">
                <MapPin size={18} className="text-red-600" /> You are currently in the Ghana-specific section of MyGene.
              </p>
              <p className="mt-4">Here you might find Ghana-specific resources, featured Ghanaian profiles, or cultural heritage information.</p>
              {/* Add Ghana-specific content here */}

              <Link href="/dashboard" className="mt-6 inline-block">
                <Button variant="outline">Go to Main Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </Card>
        
        {/* Placeholder for Ghana-specific content */}
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader><CardTitle>Featured Ghanaian Profiles</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Coming soon...</p></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Ghanaian Heritage Resources</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Coming soon...</p></CardContent>
            </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
