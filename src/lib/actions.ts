
'use server';

import { z } from 'zod';
import { generateUniqueCode } from '@/ai/flows/generate-unique-code';
import type { Profile } from './types';
import { ancestorQAndA } from '@/ai/flows/ai-powered-ancestor-q-and-a';

// Updated schema: imageUrl is now just an optional string, as it will hold a Data URL or be empty.
// The .url() validation might be too strict or unnecessary if we are primarily dealing with Data URLs.
const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  birthDate: z.string().min(1, 'Birth date is required'),
  deathDate: z.string().min(1, 'Death date is required'),
  familyDetails: z.string().min(1, 'Family details are required'),
  burialInfo: z.string().min(1, 'Burial information is required'),
  imageUrl: z.string().optional().or(z.literal('')), // Accepts Data URL or empty string
  religion: z.string().optional(),
  education: z.string().optional(),
  occupation: z.string().optional(),
  country: z.string().optional(),
});

export async function submitProfile(userId: string, values: z.infer<typeof profileSchema>) {
  try {
    const validatedData = profileSchema.parse(values);

    // Prepare data for unique code generation (as a string)
    const profileDataString = `Name: ${validatedData.name}, Birth: ${validatedData.birthDate}, Death: ${validatedData.deathDate}`;
    
    const { uniqueCode } = await generateUniqueCode({ profileData: profileDataString });

    const newProfile: Profile = {
      ...validatedData,
      id: uniqueCode,
      submittedBy: userId,
    };
    
    // In a real app, save newProfile to a database here.
    // For this demo, we'll return it and expect the client to handle storage.
    console.log('Profile submitted (server action):', newProfile);

    return { success: true, profile: newProfile };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Log the specific Zod errors for easier debugging
      console.error('Zod validation error during profile submission:', error.flatten().fieldErrors);
      return { success: false, errors: error.flatten().fieldErrors, message: 'Validation failed. Please check the form.' };
    }
    console.error('Error submitting profile:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

const qandaSchema = z.object({
  profileData: z.string().min(1, 'Profile data is required.'),
  question: z.string().min(1, 'Question is required.'),
});

export async function askAncestorQuestion(values: z.infer<typeof qandaSchema>) {
  try {
    const validatedData = qandaSchema.parse(values);
    const result = await ancestorQAndA({
      profileData: validatedData.profileData,
      question: validatedData.question,
    });
    return { success: true, answer: result.answer };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Zod validation error during Q&A:', error.flatten().fieldErrors);
      return { success: false, errors: error.flatten().fieldErrors, message: 'Validation failed for Q&A.' };
    }
    console.error('Error asking question:', error);
    return { success: false, message: 'An unexpected error occurred while processing your question.' };
  }
}

    