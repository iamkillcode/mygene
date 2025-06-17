'use client';

import ProtectedRoute from '@/components/layout/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusSquare, Users, BarChart3, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Profile } from '@/lib/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [profileCount, setProfileCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const storedProfiles = localStorage.getItem('mygene-profiles');
      if (storedProfiles) {
        const profiles: Profile[] = JSON.parse(storedProfiles);
        const userProfiles = profiles.filter(p => p.submittedBy === user.id);
        setProfileCount(userProfiles.length);
      }
    }
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary">Welcome, {user?.name || user?.email}!</CardTitle>
            <CardDescription>This is your MyGene dashboard. Manage your profiles and explore your family history.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You have submitted <span className="font-bold text-primary">{profileCount}</span> profile(s).</p>
            {user?.countryPreference && (
               <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={18} /> You are viewing the MyGene {user.countryPreference} section.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardActionCard
            title="Submit New Profile"
            description="Add a new deceased profile to your collection."
            href="/submit-profile"
            icon={<PlusSquare className="h-8 w-8 text-primary" />}
          />
          <DashboardActionCard
            title="View My Profiles"
            description="Browse and manage the profiles you've submitted."
            href="/profiles" // This will show all, could be filtered to user's later
            icon={<Users className="h-8 w-8 text-primary" />}
          />
          <DashboardActionCard
            title="Analytics (Coming Soon)"
            description="Explore insights about your family tree."
            href="#"
            icon={<BarChart3 className="h-8 w-8 text-gray-400" />}
            disabled
          />
        </div>

        <Card className="shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Ensure all information is accurate before submitting.</li>
              <li>Use high-quality images for better profile presentation.</li>
              <li>Regularly backup any important information you gather.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}

interface DashboardActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

function DashboardActionCard({ title, description, href, icon, disabled }: DashboardActionCardProps) {
  const content = (
    <Card className={`shadow-md hover:shadow-lg transition-shadow h-full flex flex-col ${disabled ? 'bg-muted/50' : ''}`}>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        {icon}
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      {!disabled && (
        <CardContent className="pt-0">
           <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Go to {title}</Button>
        </CardContent>
      )}
    </Card>
  );
  
  if (disabled) {
    return content;
  }

  return <Link href={href} className="focus:outline-none focus:ring-2 focus:ring-primary rounded-lg">{content}</Link>;
}

