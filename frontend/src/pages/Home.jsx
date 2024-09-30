"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Mic2Icon, Play, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { BACKEND_URL } from "@/config";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function ParallelWordStreaming() {
  const [paragraph, setParagraph] = useState("");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState("");
  const [currIndex, setCurrIndex] = useState(0);
  const audioContext = useRef(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const gainNode = useRef(null);
  const audioSource = useRef(null);

  useEffect(() => {
    gainNode.current = audioContext.current.createGain();
    gainNode.current.connect(audioContext.current.destination);
  }, []);

  useEffect(() => {
    if (gainNode.current) {
      gainNode.current.gain.setValueAtTime(
        isMuted ? 0 : volume,
        audioContext.current.currentTime
      );
    }
  }, [volume, isMuted]);

  const convertTextToSpeech = async (para, index = 0) => {
    if(index == 0) {
      setIsLoading(true);
      setCurrentLine("");
    }

    if (paragraph.length > 300) {
      toast.error("Paragraph Length Should be Less than 300 characters");
      setIsLoading(false);
      return;
    }
  
    try {
      const res = await axios.post(`${BACKEND_URL}/read-paragraph`, {
        paragraph: para,
      });
      const { audioBuffer: base64Audio, paragraph: returnedText } = res.data;
  
      setText(returnedText);
  
      const audioBuffer = Uint8Array.from(atob(base64Audio), (c) =>
        c.charCodeAt(0)
      ).buffer;
  
      audioContext.current.decodeAudioData(audioBuffer).then((decodedAudio) => {
        audioSource.current = audioContext.current.createBufferSource();
        audioSource.current.buffer = decodedAudio;
        audioSource.current.connect(gainNode.current);
  
        const words = returnedText.split(" ");
        let currentWordIndex = 0;
  
        const printNextWord = () => {
          if (currentWordIndex < words.length) {
            setCurrentLine((prev) => prev + " " + words[currentWordIndex++]);
            setTimeout(printNextWord, 300);
          }
        };
  
        printNextWord();
  
        audioSource.current.start(0);
        setIsPlaying(true);
  
        audioSource.current.onended = () => {
          const nextIndex = index + 1;
          const sentences = paragraph.split(".");
          if (nextIndex < sentences.length - 1) {
            setCurrIndex(nextIndex); 
            convertTextToSpeech(sentences[nextIndex].trim(), nextIndex);
          } else {
            setIsPlaying(false);
            setIsLoading(false);
            setCurrIndex(0); 
            return;
          }
        };
      }).catch((error) => {
        console.error("Error decoding audio:", error);
        toast.error("Error decoding audio");
      });
    } catch (error) {
      console.error("Error fetching or processing audio:", error.message);
      toast.error("Error fetching or processing audio");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume[0]);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-400 to-purple-500">
      <Link
        to={"/"}
        className="flex items-center gap-1.5 bg-white px-3 h-12 w-screen"
      >
        <Mic2Icon />
        <span className="font-semibold text-lg">ParallelStream</span>
      </Link>
      <div className="mt-32">
        <Card className="w-[370px] md:w-[430px] lg:w-[540px]">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
              Parallel Word Streaming
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Textarea
                className="w-full min-h-[200px] p-4 text-lg"
                placeholder="Enter paragraph here..."
                onChange={(e) => setParagraph(e.target.value)}
              />
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => {
                  convertTextToSpeech(paragraph.split(".")[currIndex]);
                  setCurrIndex(currIndex + 1);
                }}
                disabled={isLoading || !paragraph || isPlaying}
                className="flex-1"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Converting..." : "Convert & Play"}
              </Button>
              <Button onClick={toggleMute} variant="outline">
                {isMuted ? <VolumeX /> : <Volume2 />}
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Volume2 className="h-4 w-4" />
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={1}
                step={0.1}
                className="flex-1"
              />
            </div>
            <div>
              {text && (
                <div className="mt-6 p-4 bg-white rounded-lg shadow-inner overflow-hidden">
                  <p className="text-xl leading-relaxed">
                    <span className="text-primary font-medium">
                      {currentLine}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
