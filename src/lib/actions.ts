
'use server';

import { z } from 'zod';
import { generateUniqueCode } from '@/ai/flows/generate-unique-code';
import type { Profile } from './types';
import { ancestorQAndA } from '@/ai/flows/ai-powered-ancestor-q-and-a';

const profileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  birthDate: z.string().min(1, 'Birth date is required'),
  deathDate: z.string().min(1, 'Death date is required'),
  familyDetails: z.string().min(1, 'Family details are required'),
  burialInfo: z.string().min(1, 'Burial information is required'),
  imageUrl: z.string().optional().or(z.literal('')),
  religion: z.string().optional(),
  education: z.string().optional(),
  occupation: z.string().optional(),
  country: z.string().optional(),
});

export async function submitProfile(userId: string, values: z.infer<typeof profileSchema>) {
  try {
    const validatedData = profileSchema.parse(values);
    const { id, ...profileData } = validatedData;
    const isUpdate = !!id;

    let profileId = id;

    if (!isUpdate) {
      // Generate a new unique code only for new profiles
      const profileDataString = `Name: ${profileData.name}, Birth: ${profileData.birthDate}, Death: ${profileData.deathDate}`;
      const { uniqueCode } = await generateUniqueCode({ profileData: profileDataString });
      profileId = uniqueCode;
    }

    if (!profileId) {
       throw new Error("Profile ID is missing for an update.");
    }

    const finalProfile: Profile = {
      ...profileData,
      id: profileId,
      submittedBy: userId,
    };
    
    // In a real app, save finalProfile to a database here.
    console.log(`Profile ${isUpdate ? 'updated' : 'submitted'} (server action):`, finalProfile);

    return { success: true, profile: finalProfile };
  } catch (error) {
    if (error instanceof z.ZodError) {
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
