
'use client';

import ProfileCard from '@/components/profiles/profile-card';
import ProtectedRoute from '@/components/layout/protected-route';
import type { Profile } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusSquare, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const generateDummyProfiles = (): Profile[] => {
  const dummyProfiles: Profile[] = [];
  const countries = ['Ghana', 'USA', 'UK', 'Nigeria', 'Canada'];
  const occupations = ['Farmer', 'Teacher', 'Engineer', 'Artist', 'Doctor', 'Trader', 'Musician', 'Writer', 'Chef', 'Scientist'];
  const religions = ['Christianity', 'Islam', 'Traditional', 'Spiritual', 'None'];

  for (let i = 1; i <= 10; i++) {
    const birthYear = 1900 + Math.floor(Math.random() * 70); // 1900-1969
    const deathYear = birthYear + 50 + Math.floor(Math.random() * 40); // 50-90 years lifespan

    dummyProfiles.push({
      id: `dummy-${i}-${Date.now()}`, // Ensure unique enough for testing
      name: `Ancestor ${i} ${String.fromCharCode(65 + (i % 26))}`, // E.g., Ancestor 1 A
      imageUrl: `https://placehold.co/400x300.png?text=Ancestor%20${i}`,
      birthDate: new Date(birthYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      deathDate: new Date(deathYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      familyDetails: `Ancestor ${i} was part of a large and loving family. Survived by many children and grandchildren. Known for their wisdom and kindness.`,
      religion: religions[i % religions.length],
      education: `Completed ${['Primary School', 'High School', 'Vocational Training', 'University Degree'][i % 4]}`,
      occupation: occupations[i % occupations.length],
      burialInfo: `Buried in the family plot at ${['Hometown Cemetery', 'City Memorial Park', 'Village Grounds'][i % 3]} with full honors.`,
      country: countries[i % countries.length],
      submittedBy: 'dummy-user-id', // Generic ID for seeded data
    });
  }
  return dummyProfiles;
};


export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'name-asc' | 'name-desc' | 'death-asc' | 'death-desc'>('name-asc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      const storedProfiles = localStorage.getItem('mygene-profiles');
      let loadedProfiles = storedProfiles ? JSON.parse(storedProfiles) : [];
      
      if (loadedProfiles.length === 0) {
        console.log('No profiles found in localStorage, generating dummy data...');
        loadedProfiles = generateDummyProfiles();
        localStorage.setItem('mygene-profiles', JSON.stringify(loadedProfiles));
      }
      
      setProfiles(loadedProfiles);
      setFilteredProfiles(loadedProfiles); // Initialize filteredProfiles
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let tempProfiles = [...profiles];

    if (searchTerm) {
      tempProfiles = tempProfiles.filter(profile =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortOrder) {
      case 'name-asc':
        tempProfiles.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        tempProfiles.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'death-asc':
        tempProfiles.sort((a, b) => new Date(a.deathDate).getTime() - new Date(b.deathDate).getTime());
        break;
      case 'death-desc':
        tempProfiles.sort((a, b) => new Date(b.deathDate).getTime() - new Date(a.deathDate).getTime());
        break;
    }
    setFilteredProfiles(tempProfiles);
  }, [searchTerm, sortOrder, profiles]);


  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="py-8">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-1/4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-lg" />)}
          </div>
        </div>
      </ProtectedRoute>
    );
  }


  return (
    <ProtectedRoute>
      <div className="py-8">
        <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-headline text-primary">Browse Profiles</h1>
            <Link href="/submit-profile" passHref>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusSquare size={18} className="mr-2"/> Submit New Profile
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search profiles by name"
              />
            </div>
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
              <SelectTrigger className="w-full md:w-[200px]" aria-label="Sort profiles">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="death-asc">Date of Death (Oldest)</SelectItem>
                <SelectItem value="death-desc">Date of Death (Newest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProfiles.map(profile => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No profiles found.</p>
            {profiles.length > 0 && searchTerm && (
              <p className="text-md text-muted-foreground mt-2">Try adjusting your search or filter criteria.</p>
            )}
            {profiles.length === 0 && (
              <p className="text-md text-muted-foreground mt-2">
                Why not be the first to <Link href="/submit-profile" className="text-primary hover:underline">add one</Link>?
              </p>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
