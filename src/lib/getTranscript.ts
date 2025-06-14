import { Innertube } from 'youtubei.js';
import { extractVideoId } from "./extractVideoid";

export async function getTranscript(videoUrl: string) {
  const id = extractVideoId(videoUrl);
  
  // Create YouTube client
  const youtube = await Innertube.create({
    lang: "en",
    location: "US",
    retrieve_player: false,
  });

  try {
    // Get video info
    const info = await youtube.getInfo(id);
    
    // Get transcript data
    const transcriptData = await info.getTranscript();
    
    if (!transcriptData?.transcript?.content?.body?.initial_segments) {
      throw new Error("No transcript available for this video");
    }

    // Map to match your existing format: {id, text, start, duration}
    const segments = transcriptData.transcript.content.body.initial_segments;
    
    return segments.map((segment: any, idx: number) => ({
      id: idx,
      text: segment.snippet.text,
      start: segment.start_ms / 1000, // Convert milliseconds to seconds
      duration: segment.end_ms / 1000 - segment.start_ms / 1000 // Calculate duration in seconds
    }));
    
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw new Error(`Failed to fetch transcript: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
