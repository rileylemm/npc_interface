import { useState } from "react";
import { useSettingsStore } from "@/lib/store/settingsStore";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ModelSelectionSection() {
  const [isExpanded, setIsExpanded] = useState(true);
  const {
    textModel,
    setTextModel,
    imageModel,
    setImageModel,
    ttsModel,
    setTtsModel,
    sttModel,
    setSttModel,
  } = useSettingsStore();

  return (
    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200">Model Selection</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          {!isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="text-model">Text Generation Model</Label>
            <Select value={textModel} onValueChange={setTextModel}>
              <SelectTrigger id="text-model" className="w-full mt-1">
                <SelectValue placeholder="Select text model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4-turbo">GPT-4-Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5-Turbo</SelectItem>
                <SelectItem value="claude-3-opus">Claude-3-Opus</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude-3-Sonnet</SelectItem>
                <SelectItem value="claude-3-haiku">Claude-3-Haiku</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="image-model">Image Generation Model</Label>
            <Select value={imageModel} onValueChange={setImageModel}>
              <SelectTrigger id="image-model" className="w-full mt-1">
                <SelectValue placeholder="Select image model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                <SelectItem value="stable-diffusion-xl">Stable Diffusion XL</SelectItem>
                <SelectItem value="midjourney">Midjourney API</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tts-model">Text-to-Speech Model</Label>
            <Select value={ttsModel} onValueChange={setTtsModel}>
              <SelectTrigger id="tts-model" className="w-full mt-1">
                <SelectValue placeholder="Select TTS model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elevenlabs-multilingual-v2">Elevenlabs Multilingual v2</SelectItem>
                <SelectItem value="openai-tts-1">OpenAI TTS-1</SelectItem>
                <SelectItem value="google-wavenet">Google WaveNet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="stt-model">Speech-to-Text Model</Label>
            <Select value={sttModel} onValueChange={setSttModel}>
              <SelectTrigger id="stt-model" className="w-full mt-1">
                <SelectValue placeholder="Select STT model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whisper-large-v3">Whisper Large v3</SelectItem>
                <SelectItem value="google-speech-to-text">Google Speech-to-Text</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
