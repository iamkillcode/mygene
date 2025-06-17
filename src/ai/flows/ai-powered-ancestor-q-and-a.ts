// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview AI-Powered Ancestor Q&A flow. Allows users to ask questions about the deceased and receive contextual responses based on profile data.
 *
 * - ancestorQAndA - A function that answers questions about a deceased person using their profile data.
 * - AncestorQAndAInput - The input type for the ancestorQAndA function.
 * - AncestorQAndAOutput - The return type for the ancestorQAndA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AncestorQAndAInputSchema = z.object({
  profileData: z.string().describe('The profile data of the deceased person, including image, name, dates of birth/death, family details, religion, education, occupation, and burial information.'),
  question: z.string().describe('The question about the deceased person.'),
});
export type AncestorQAndAInput = z.infer<typeof AncestorQAndAInputSchema>;

const AncestorQAndAOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the deceased person, based on the profile data.'),
});
export type AncestorQAndAOutput = z.infer<typeof AncestorQAndAOutputSchema>;

export async function ancestorQAndA(input: AncestorQAndAInput): Promise<AncestorQAndAOutput> {
  return ancestorQAndAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ancestorQAndAPrompt',
  input: {schema: AncestorQAndAInputSchema},
  output: {schema: AncestorQAndAOutputSchema},
  prompt: `You are an AI assistant that answers questions about deceased persons based on their profile data.

  Profile Data: {{{profileData}}}

  Question: {{{question}}}

  Answer:`,
});

const ancestorQAndAFlow = ai.defineFlow(
  {
    name: 'ancestorQAndAFlow',
    inputSchema: AncestorQAndAInputSchema,
    outputSchema: AncestorQAndAOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
