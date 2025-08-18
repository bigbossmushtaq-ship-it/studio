'use server';

/**
 * @fileOverview A theme-based song recommendation AI agent.
 *
 * - recommendSongs - A function that recommends songs based on user preferences and song metadata.
 * - RecommendSongsInput - The input type for the recommendSongs function.
 * - RecommendSongsOutput - The return type for the recommendSongs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendSongsInputSchema = z.object({
  listeningHistory: z
    .array(z.string())
    .describe('An array of song titles the user has listened to.'),
  songMetadata: z
    .array(
      z.object({
        title: z.string(),
        artist: z.string(),
        genre: z.string(),
        theme: z.string(),
      })
    )
    .describe('An array of song metadata objects from the community.'),
});
export type RecommendSongsInput = z.infer<typeof RecommendSongsInputSchema>;

const RecommendSongsOutputSchema = z.object({
  recommendedSongs: z
    .array(z.string())
    .describe('An array of recommended song titles.'),
});
export type RecommendSongsOutput = z.infer<typeof RecommendSongsOutputSchema>;

export async function recommendSongs(
  input: RecommendSongsInput
): Promise<RecommendSongsOutput> {
  return recommendSongsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendSongsPrompt',
  input: {schema: RecommendSongsInputSchema},
  output: {schema: RecommendSongsOutputSchema},
  prompt: `You are a music recommendation expert. Based on the user's listening history and the available song metadata, recommend songs that the user might enjoy.

User Listening History:
{{#each listeningHistory}}- {{this}}\n{{/each}}

Available Songs:
{{#each songMetadata}}- Title: {{this.title}}, Artist: {{this.artist}}, Genre: {{this.genre}}, Theme: {{this.theme}}\n{{/each}}

Recommended Songs:`,
});

const recommendSongsFlow = ai.defineFlow(
  {
    name: 'recommendSongsFlow',
    inputSchema: RecommendSongsInputSchema,
    outputSchema: RecommendSongsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
