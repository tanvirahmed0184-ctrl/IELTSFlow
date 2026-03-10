"use client";

import { useEffect, useRef } from "react";

interface WaveVisualizerProps {
  active: boolean;
  className?: string;
}

export function WaveVisualizer({ active, className = "" }: WaveVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!active) {
      rafRef.current && cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      return;
    }

    let mounted = true;

    async function run() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        src.connect(analyser);
        analyserRef.current = analyser;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx2d = canvas.getContext("2d");
        if (!ctx2d) return;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const W = canvas.width;
        const H = canvas.height;
        const barCount = 32;
        const barWidth = W / barCount - 2;

        function draw() {
          if (!mounted || !analyserRef.current || !ctx2d) return;
          rafRef.current = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);
          ctx2d.fillStyle = "rgb(15, 23, 42)";
          ctx2d.fillRect(0, 0, W, H);
          for (let i = 0; i < barCount; i++) {
            const idx = Math.floor((i / barCount) * dataArray.length);
            const v = dataArray[idx] ?? 0;
            const barH = (v / 255) * H * 0.6;
            ctx2d.fillStyle = "rgb(20, 184, 166)";
            ctx2d.fillRect(
              i * (barWidth + 2) + 1,
              H - barH,
              barWidth,
              barH
            );
          }
        }
        draw();
      } catch {
        /* ignore */
      }
    }
    run();
    return () => {
      mounted = false;
      rafRef.current && cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={48}
      className={`rounded-lg bg-slate-900 ${className}`}
    />
  );
}
