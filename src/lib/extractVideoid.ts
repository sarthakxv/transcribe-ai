export const extractVideoId = (url: string) => {
  const match = url.match(/(?:v=|youtu\.be\/)([\w-]+)/);
  if (!match) throw new Error("Invalid YouTube URL");
  return match[1];
};
