
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, FileText, Landmark, BookOpen, Briefcase, MapPin, Church, Users, Image as ImageIconLucide } from 'lucide-react';
import { submitProfile } from '@/lib/actions';
import type { Profile } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const profileFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  imageUrl: z.string().optional().or(z.literal('')),
  birthDate: z.date({ required_error: 'Date of birth is required.' }),
  deathDate: z.date({ required_error: 'Date of death is required.' }),
  familyDetails: z.string().min(10, { message: 'Family details must be at least 10 characters.' }),
  religion: z.string().optional(),
  education: z.string().optional(),
  occupation: z.string().optional(),
  burialInfo: z.string().min(10, { message: 'Burial information must be at least 10 characters.' }),
  country: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(true);

  const editProfileId = searchParams.get('edit');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
      familyDetails: '',
      religion: '',
      education: '',
      occupation: '',
      burialInfo: '',
      country: '',
    },
  });

  useEffect(() => {
    const profileId = searchParams.get('edit');
    if (profileId && user) {
      setIsEditMode(true);
      setIsLoadingForm(true);
      
      const fetchProfileForEdit = async () => {
        const docRef = doc(db, 'profiles', profileId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profileToEdit = docSnap.data() as Profile;
          if (profileToEdit.submittedBy !== user.id) {
            toast({ variant: 'destructive', title: 'Unauthorized', description: "You cannot edit this profile."});
            router.push('/profiles');
            return;
          }

          form.reset({
            ...profileToEdit,
            id: profileId,
            birthDate: new Date(profileToEdit.birthDate),
            deathDate: new Date(profileToEdit.deathDate),
          });
          if (profileToEdit.imageUrl) {
            setImagePreview(profileToEdit.imageUrl);
          }
        } else {
            toast({ variant: 'destructive', title: 'Not Found', description: "Profile not found."});
            router.push('/profiles');
        }
        setIsLoadingForm(false);
      }
      fetchProfileForEdit();
    } else {
        setIsLoadingForm(false);
    }
  }, [searchParams, form, router, toast, user]);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Image too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        setImagePreview(null);
        form.setValue('imageUrl', '');
        event.target.value = ''; // Reset file input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue('imageUrl', reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      form.setValue('imageUrl', '', { shouldValidate: true });
    }
  };

  async function onSubmit(data: ProfileFormValues) {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to submit a profile.', variant: 'destructive'});
      return;
    }

    const serverData = {
      ...data,
      birthDate: data.birthDate.toISOString(),
      deathDate: data.deathDate.toISOString(),
      id: isEditMode ? editProfileId ?? undefined : undefined,
    };
    
    const result = await submitProfile(user.id, serverData);

    if (result.success && result.profileId) {
      toast({
        title: isEditMode ? 'Profile Updated' : 'Profile Submitted',
        description: `${data.name}'s profile has been successfully ${isEditMode ? 'updated' : 'created'}.`,
      });
      router.push(`/profiles/${result.profileId}`);
    } else {
      toast({
        title: 'Submission Failed',
        description: result.message || 'Please check the form for errors.',
        variant: 'destructive',
      });
    }
  }
  
  if (isLoadingForm) {
      return (
          <Card className="w-full max-w-2xl mx-auto shadow-xl">
              <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                   <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-8">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
              </CardContent>
          </Card>
      );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary flex items-center gap-2">
          <FileText size={28}/> {isEditMode ? 'Edit Profile' : 'Submit Deceased Profile'}
        </CardTitle>
        <CardDescription>
          {isEditMode ? `You are editing the profile for ${form.getValues('name')}.` : 'Fill in the details to create a memorial profile.'} All fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">Full Name *</FormLabel>
                <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormItem>
              <FormLabel className="flex items-center gap-1"><ImageIconLucide size={16}/> Profile Image (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </FormControl>
              <FormDescription>Upload an image of the deceased (max 5MB). PNG, JPG, GIF, WEBP accepted.</FormDescription>
              {imagePreview && (
                <div className="mt-4 relative w-40 h-40 rounded-md overflow-hidden border shadow-sm">
                  <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="cover" />
                </div>
              )}
              <FormMessage>{form.formState.errors.imageUrl?.message}</FormMessage> 
            </FormItem>
            
            <div className="grid md:grid-cols-2 gap-8">
              <FormField control={form.control} name="birthDate" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1800-01-01")}
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={1800}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="deathDate" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Death *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1800-01-01") || (form.getValues("birthDate") && date < form.getValues("birthDate"))}
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={1800}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="familyDetails" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1"><Users size={16}/> Family Details *</FormLabel>
                <FormControl><Textarea placeholder="Information about spouse, children, parents, siblings, etc." className="min-h-[100px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="religion" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1"><Church size={16}/> Religion (Optional)</FormLabel>
                <FormControl><Input placeholder="e.g., Christianity, Islam, Traditional" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="education" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1"><BookOpen size={16}/> Education (Optional)</FormLabel>
                <FormControl><Textarea placeholder="Schools attended, degrees earned, etc." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="occupation" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1"><Briefcase size={16}/> Occupation (Optional)</FormLabel>
                <FormControl><Textarea placeholder="Career, significant work achievements, etc." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="burialInfo" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1"><Landmark size={16}/> Burial Information *</FormLabel>
                <FormControl><Textarea placeholder="Location of burial, date, specific details." className="min-h-[100px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="country" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1"><MapPin size={16}/> Country of Significance (Optional)</FormLabel>
                <FormControl><Input placeholder="e.g., Ghana, USA" {...field} /></FormControl>
                <FormDescription>The country most associated with the deceased, for categorization.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Submitting...' : isEditMode ? 'Update Profile' : 'Submit Profile'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
