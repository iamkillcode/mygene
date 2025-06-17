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
import { CalendarIcon, FileText, Landmark, BookOpen, Briefcase, MapPin, Church, Users, Image as ImageIcon } from 'lucide-react';
import { submitProfile } from '@/lib/actions';
import type { Profile } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  birthDate: z.date({ required_error: 'Date of birth is required.' }),
  deathDate: z.date({ required_error: 'Date of death is required.' }),
  familyDetails: z.string().min(10, { message: 'Family details must be at least 10 characters.' }),
  religion: z.string().optional(),
  education: z.string().optional(),
  occupation: z.string().optional(),
  burialInfo: z.string().min(10, { message: 'Burial information must be at least 10 characters.' }),
  country: z.string().optional(), // Could be pre-filled or selected
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
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

  async function onSubmit(data: ProfileFormValues) {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to submit a profile.', variant: 'destructive'});
      return;
    }

    const serverData = {
      ...data,
      birthDate: data.birthDate.toISOString(),
      deathDate: data.deathDate.toISOString(),
    };
    
    const result = await submitProfile(user.id, serverData);

    if (result.success && result.profile) {
      // Save to localStorage (client-side mock)
      const profilesString = localStorage.getItem('mygene-profiles');
      const profiles: Profile[] = profilesString ? JSON.parse(profilesString) : [];
      profiles.push(result.profile);
      localStorage.setItem('mygene-profiles', JSON.stringify(profiles));

      toast({
        title: 'Profile Submitted',
        description: `${result.profile.name}'s profile has been successfully created with ID: ${result.profile.id}`,
      });
      router.push(`/profiles/${result.profile.id}`);
    } else {
      toast({
        title: 'Submission Failed',
        description: result.message || 'Please check the form for errors.',
        variant: 'destructive',
      });
      // Handle field errors if result.errors exists
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary flex items-center gap-2">
          <FileText size={28}/> Submit Deceased Profile
        </CardTitle>
        <CardDescription>Fill in the details to create a memorial profile. All fields marked with * are required.</CardDescription>
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

            <FormField control={form.control} name="imageUrl" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1"><ImageIcon size={16}/> Image URL (Optional)</FormLabel>
                <FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl>
                <FormDescription>Link to a publicly accessible image of the deceased.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            
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
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1700-01-01")} initialFocus />
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
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1700-01-01") || (form.getValues("birthDate") && date < form.getValues("birthDate"))} initialFocus />
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
              {form.formState.isSubmitting ? 'Submitting...' : 'Submit Profile'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
