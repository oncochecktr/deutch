import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import {
  GERMAN_TTS_RATE,
  GERMAN_TTS_VOICE,
  GERMAN_TTS_VOICE_ALT,
} from "@/lib/ttsConfig";

async function streamToBuffer(stream: AsyncIterable<Uint8Array>): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function synthesizeWithVoice(voice: string, text: string): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = await tts.toStream(text, { rate: GERMAN_TTS_RATE });
  return streamToBuffer(audioStream);
}

/** Edge TTS ile Almanca MP3 */
export async function synthesizeGermanMp3(text: string): Promise<Buffer> {
  try {
    return await synthesizeWithVoice(GERMAN_TTS_VOICE, text);
  } catch {
    return synthesizeWithVoice(GERMAN_TTS_VOICE_ALT, text);
  }
}
