
'use server';
/**
 * @fileOverview An AI flow to suggest a genre for a song.
 *
 * - suggestGenre - A function that suggests a genre based on song audio data.
 * - SuggestGenreInput - The input type for the suggestGenre function.
 * - SuggestGenreOutput - The return type for the suggestGenre function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestGenreInputSchema = z.object({
  songDataUri: z
    .string()
    .describe(
      "The song's audio data, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestGenreInput = z.infer<typeof SuggestGenreInputSchema>;

const SuggestGenreOutputSchema = z.object({
  genre: z.string().describe('The suggested genre for the song. Should be a common music genre, e.g., Rock, Pop, Jazz, Hip Hop, Electronic.'),
});
export type SuggestGenreOutput = z.infer<typeof SuggestGenreOutputSchema>;

export async function suggestGenre(
  input: SuggestGenreInput
): Promise<SuggestGenreOutput> {
  return suggestGenreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestGenrePrompt',
  input: {schema: SuggestGenreInputSchema},
  output: {schema: SuggestGenreOutputSchema},
  prompt: `You are a music expert. Analyze the following song and suggest a primary genre for it. Examples: Rock, Pop, Jazz, Hip Hop, Electronic, Classical, Ambient.

Song: {{media url=songDataUri}}`,
});

const suggestGenreFlow = ai.defineFlow(
  {
    name: 'suggestGenreFlow',
    inputSchema: SuggestGenreInputSchema,
    outputSchema: SuggestGenreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
