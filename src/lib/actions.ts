
'use server';

import { z } from 'zod';
import type { Profile } from './types';
import { ancestorQAndA } from '@/ai/flows/ai-powered-ancestor-q-and-a';
import { db } from './firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

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

    const finalProfileData: Omit<Profile, 'id'> = {
      ...profileData,
      submittedBy: userId,
    };
    
    let profileId: string;

    if (isUpdate && id) {
      // Update existing document
      const profileRef = doc(db, 'profiles', id);
      await setDoc(profileRef, finalProfileData, { merge: true });
      profileId = id;
      console.log('Profile updated in Firestore with ID:', profileId);
    } else {
      // Add new document
      const docRef = await addDoc(collection(db, 'profiles'), finalProfileData);
      profileId = docRef.id;
      console.log('Profile added to Firestore with ID:', profileId);
    }

    return { success: true, profileId: profileId };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Zod validation error during profile submission:', error.flatten().fieldErrors);
      return { success: false, errors: error.flatten().fieldErrors, message: 'Validation failed. Please check the form.' };
    }
    console.error('Error submitting profile to Firestore:', error);
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
