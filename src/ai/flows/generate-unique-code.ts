'use server';

/**
 * @fileOverview Generates a unique code for each profile.
 *
 * - generateUniqueCode - A function that generates a unique code for a profile.
 * - GenerateUniqueCodeInput - The input type for the generateUniqueCode function.
 * - GenerateUniqueCodeOutput - The return type for the generateUniqueCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {randomBytes} from 'crypto';

const GenerateUniqueCodeInputSchema = z.object({
  profileData: z.string().describe('The profile data for which to generate a unique code.'),
});
export type GenerateUniqueCodeInput = z.infer<typeof GenerateUniqueCodeInputSchema>;

const GenerateUniqueCodeOutputSchema = z.object({
  uniqueCode: z.string().describe('The unique code generated for the profile.'),
});
export type GenerateUniqueCodeOutput = z.infer<typeof GenerateUniqueCodeOutputSchema>;

export async function generateUniqueCode(input: GenerateUniqueCodeInput): Promise<GenerateUniqueCodeOutput> {
  return generateUniqueCodeFlow(input);
}

const generateUniqueCodeFlow = ai.defineFlow(
  {
    name: 'generateUniqueCodeFlow',
    inputSchema: GenerateUniqueCodeInputSchema,
    outputSchema: GenerateUniqueCodeOutputSchema,
  },
  async input => {
    const uniqueCode = randomBytes(16).toString('hex');
    return {uniqueCode};
  }
);
