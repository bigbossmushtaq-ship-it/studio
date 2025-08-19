
'use server';
/**
 * @fileOverview An AI flow to suggest a theme for a song.
 *
 * - suggestTheme - A function that suggests a theme based on song audio data.
 * - SuggestThemeInput - The input type for the suggestTheme function.
 * - SuggestThemeOutput - The return type for the suggestTheme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestThemeInputSchema = z.object({
  songDataUri: z
    .string()
    .describe(
      "The song's audio data, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestThemeInput = z.infer<typeof SuggestThemeInputSchema>;

const SuggestThemeOutputSchema = z.object({
  theme: z.string().describe('The suggested theme for the song. Should be a single word or a short phrase, e.g., Energetic, Relaxing, Upbeat, Melancholic.'),
});
export type SuggestThemeOutput = z.infer<typeof SuggestThemeOutputSchema>;

export async function suggestTheme(
  input: SuggestThemeInput
): Promise<SuggestThemeOutput> {
  return suggestThemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestThemePrompt',
  input: {schema: SuggestThemeInputSchema},
  output: {schema: SuggestThemeOutputSchema},
  prompt: `You are a music expert. Analyze the following song and suggest a primary theme for it. The theme should be a single word or a short, descriptive phrase. Examples: Energetic, Relaxing, Upbeat, Melancholic, Nostalgic, Hopeful.

Song: {{media url=songDataUri}}`,
});

const suggestThemeFlow = ai.defineFlow(
  {
    name: 'suggestThemeFlow',
    inputSchema: SuggestThemeInputSchema,
    outputSchema: SuggestThemeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
