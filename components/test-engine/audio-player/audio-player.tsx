"use client";

interface AudioPlayerProps {
  src: string;
  onEnded?: () => void;
}

export function AudioPlayer({ src, onEnded }: AudioPlayerProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <audio controls className="w-full">
        <source src={src} />
      </audio>
    </div>
  );
}
