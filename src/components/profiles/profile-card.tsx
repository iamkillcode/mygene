'use client';

import type { Profile } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const birthYear = profile.birthDate ? format(new Date(profile.birthDate), 'yyyy') : 'N/A';
  const deathYear = profile.deathDate ? format(new Date(profile.deathDate), 'yyyy') : 'N/A';

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative w-full h-48 bg-muted">
          <Image
            src={profile.imageUrl || `https://placehold.co/400x300.png?text=${encodeURIComponent(profile.name.substring(0,1))}`}
            alt={profile.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint="portrait person"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-6 flex-grow">
        <CardTitle className="text-xl font-headline text-primary mb-1">{profile.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <CalendarDays size={16} className="mr-2" />
          <span>{birthYear} - {deathYear}</span>
        </div>
        <CardDescription className="line-clamp-3 text-sm">
          {profile.familyDetails || profile.burialInfo}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={`/profiles/${profile.id}`} passHref className="w-full">
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
            View Profile <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
