'use client';

import ProtectedRoute from '@/components/layout/protected-route';
import type { Profile } from '@/lib/types';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarDays, Users, Church, BookOpen, Briefcase, Landmark, MapPin, Printer, Edit, Trash2, Home, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import AncestorQASection from '@/components/profiles/ancestor-qa-section';
import { useAuth } from '@/contexts/auth-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function ProfileDetailPage() {
  const params = useParams();
  const { code } = params;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (code && typeof code === 'string') {
      setIsLoading(true);
      if (typeof window !== 'undefined') {
        const storedProfiles = localStorage.getItem('mygene-profiles');
        if (storedProfiles) {
          const profiles: Profile[] = JSON.parse(storedProfiles);
          const foundProfile = profiles.find(p => p.id === code);
          setProfile(foundProfile || null);
        }
      }
      setIsLoading(false);
    }
  }, [code]);

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteProfile = () => {
    if (!profile || !user || user.id !== profile.submittedBy) return;

    setIsDeleting(true);
    // Simulate deletion from localStorage
    const profilesString = localStorage.getItem('mygene-profiles');
    if (profilesString) {
      let profiles: Profile[] = JSON.parse(profilesString);
      profiles = profiles.filter(p => p.id !== profile.id);
      localStorage.setItem('mygene-profiles', JSON.stringify(profiles));
      toast({ title: "Profile Deleted", description: `${profile.name}'s profile has been removed.` });
      // Redirect to profiles list or dashboard
      // For now, user will need to navigate manually or we can use router.push after a delay.
      // To keep it simple, we'll let user navigate. The profile will disappear from lists.
      // To fully remove from current view, we'd setProfile(null) but that leads to notFound.
      // Better to redirect:
      window.location.href = '/profiles'; 
    }
    setIsDeleting(false);
  };


  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="py-8 max-w-4xl mx-auto space-y-6 printable-area">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    notFound();
  }
  
  const canEditOrDelete = user && user.id === profile.submittedBy;

  return (
    <ProtectedRoute>
      <div className="py-8 max-w-4xl mx-auto">
        <Card className="shadow-xl printable-area">
          <CardHeader className="border-b">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <CardTitle className="text-4xl font-headline text-primary">{profile.name}</CardTitle>
                <div className="flex items-center text-lg text-muted-foreground mt-2">
                  <CalendarDays size={20} className="mr-2 text-accent" />
                  <span>{format(new Date(profile.birthDate), 'MMMM d, yyyy')} - {format(new Date(profile.deathDate), 'MMMM d, yyyy')}</span>
                </div>
                 {profile.country && (
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin size={16} className="mr-2 text-accent" />
                    <span>{profile.country}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-start no-print">
                <Button variant="outline" onClick={handlePrint} aria-label="Print profile">
                  <Printer size={18} className="mr-2"/> Print
                </Button>
                {/* Add Share button functionality later */}
                {/* <Button variant="outline" aria-label="Share profile">
                  <Share2 size={18} className="mr-2"/> Share
                </Button> */}
                 {canEditOrDelete && (
                  <>
                    {/* Edit functionality would require navigating to ProfileForm with pre-filled data, not implemented here */}
                    {/* <Link href={`/submit-profile?edit=${profile.id}`} passHref>
                      <Button variant="outline" aria-label="Edit profile">
                        <Edit size={18} className="mr-2" /> Edit
                      </Button>
                    </Link> */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" aria-label="Delete profile">
                          <Trash2 size={18} className="mr-2" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the profile for {profile.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteProfile} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                            {isDeleting ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md bg-muted">
                 <Image
                  src={profile.imageUrl || `https://placehold.co/300x400.png?text=${encodeURIComponent(profile.name.substring(0,1))}`}
                  alt={profile.name}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="portrait person vintage"
                  priority
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-6">
              <ProfileSection icon={<Users className="text-accent"/>} title="Family Details">
                <p className="whitespace-pre-wrap">{profile.familyDetails}</p>
              </ProfileSection>

              <ProfileSection icon={<Landmark className="text-accent"/>} title="Burial Information">
                <p className="whitespace-pre-wrap">{profile.burialInfo}</p>
              </ProfileSection>

              {profile.religion && (
                <ProfileSection icon={<Church className="text-accent"/>} title="Religion">
                  <p>{profile.religion}</p>
                </ProfileSection>
              )}
              {profile.education && (
                <ProfileSection icon={<BookOpen className="text-accent"/>} title="Education">
                   <p className="whitespace-pre-wrap">{profile.education}</p>
                </ProfileSection>
              )}
              {profile.occupation && (
                <ProfileSection icon={<Briefcase className="text-accent"/>} title="Occupation">
                  <p className="whitespace-pre-wrap">{profile.occupation}</p>
                </ProfileSection>
              )}
            </div>
          </CardContent>
           <CardFooter className="border-t pt-6 no-print">
            <Link href="/profiles" passHref>
              <Button variant="outline"><Home size={18} className="mr-2"/> Back to Profiles</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <AncestorQASection profile={profile} />

      </div>
    </ProtectedRoute>
  );
}

interface ProfileSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function ProfileSection({ icon, title, children }: ProfileSectionProps) {
  return (
    <div>
      <h3 className="text-xl font-headline text-primary mb-2 flex items-center gap-2">
        {icon} {title}
      </h3>
      <div className="text-foreground/90 pl-8">{children}</div>
    </div>
  );
}
