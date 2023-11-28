"use server";

export const getTrackLyrics = async (trackId: string) => {
  try {
    const res = await fetch(
      `https://spotify-lyric-api-984e7b4face0.herokuapp.com/?trackid=${trackId}&format=lrc`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const lyrics = await res.json();

    const finalLyrics = [];
    if (lyrics.error === true) finalLyrics.push("null");
    else
      lyrics.lines.forEach((line: any) => {
        finalLyrics.push(line.words);
      });
    return {
      error: lyrics.error,
      lyrics: finalLyrics,
    } as Lyrics;
  } catch (err) {
    return {
      lyrics: ["null"],
      error: true,
    } as Lyrics;
  }
};

interface Lyrics {
  lyrics: string[];
  error: boolean;
}
