'use client';

import type { Profile } from '@/lib/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { askAncestorQuestion } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MessageSquareDashed, Sparkles, Send } from 'lucide-react';

interface AncestorQASectionProps {
  profile: Profile;
}

const qaSchema = z.object({
  question: z.string().min(5, { message: 'Question must be at least 5 characters.' }),
});
type QAFormValues = z.infer<typeof qaSchema>;

export default function AncestorQASection({ profile }: AncestorQASectionProps) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<QAFormValues>({
    resolver: zodResolver(qaSchema),
    defaultValues: { question: '' },
  });

  const onSubmit = async (data: QAFormValues) => {
    setIsLoading(true);
    setAnswer(null);

    // Construct profileData string for the AI
    const profileDataString = `
      Name: ${profile.name}
      Birth Date: ${profile.birthDate}
      Death Date: ${profile.deathDate}
      Family Details: ${profile.familyDetails}
      Religion: ${profile.religion || 'Not specified'}
      Education: ${profile.education || 'Not specified'}
      Occupation: ${profile.occupation || 'Not specified'}
      Burial Information: ${profile.burialInfo}
      Image URL: ${profile.imageUrl || 'Not available'}
    `.trim();

    const result = await askAncestorQuestion({ profileData: profileDataString, question: data.question });

    if (result.success && result.answer) {
      setAnswer(result.answer);
    } else {
      toast({
        title: 'Error',
        description: result.message || 'Could not get an answer. Please try again.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg mt-8 bg-gradient-to-br from-primary/5 via-background to-background no-print">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary flex items-center gap-2">
          <Sparkles size={24} className="text-accent" /> AI-Powered Ancestor Q&amp;A
        </CardTitle>
        <CardDescription>
          Ask questions about {profile.name} and get AI-generated answers based on their profile.
          For example: &quot;What was {profile.name}&apos;s occupation?&quot; or &quot;Tell me about their family.&quot;
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Your Question</FormLabel>
                  <FormControl>
                    <div className="relative">
                       <MessageSquareDashed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                       <Input {...field} placeholder="Ask a question..." className="pl-10 pr-[100px]" />
                       <Button 
                          type="submit" 
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 bg-accent hover:bg-accent/90 text-accent-foreground" 
                          disabled={isLoading}
                          aria-label="Submit question"
                        >
                         <Send size={16} /> <span className="sr-only sm:not-sr-only sm:ml-2">Ask</span>
                       </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        {isLoading && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <Sparkles size={20} className="animate-pulse text-accent" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        {answer && !isLoading && (
          <Card className="mt-6 bg-background/80 shadow-inner">
            <CardHeader>
              <CardTitle className="text-lg font-headline flex items-center gap-2"><Sparkles size={18} className="text-primary"/> AI&apos;s Response:</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">{answer}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
