import React, {
  createContext,
  useState,
  useContext,
  useRef,
  ReactNode,
} from "react";

interface AudioContextType {
  isPlaying: boolean;
  playAudio: () => void;
  stopAudio: () => void;
}

interface AudioProviderProps {
  children: ReactNode;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, playAudio, stopAudio }}>
      {children}
      <audio ref={audioRef} src="https://streaming.radionomy.com/Radio-XYZ" />
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio debe ser usado dentro de un AudioProvider");
  }
  return context;
};
