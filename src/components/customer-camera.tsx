import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, RefreshCcw, Upload, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CustomerCamera({ photo, onChange }: { photo: string; onChange: (dataUrl: string) => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [live, setLive] = useState(false);
  const [error, setError] = useState("");

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setLive(false);
  }, []);

  useEffect(() => stop, [stop]);

  const start = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      setLive(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      setError("Camera unavailable or permission denied. You can upload a photo instead.");
      setLive(false);
    }
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 360;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    onChange(canvas.toDataURL("image/jpeg", 0.85));
    stop();
  };

  const upload = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  return <div className="space-y-4">
    <div className="grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-2xl border border-border/70 bg-muted/50">
      {photo ? <img src={photo} alt="Captured customer" className="size-full object-cover"/>
        : live ? <video ref={videoRef} playsInline muted className="size-full object-cover"/>
        : <div className="p-6 text-center text-sm text-muted-foreground"><UserRound className="mx-auto mb-3 size-8 text-primary"/>No photo captured yet</div>}
    </div>
    {error && <p className="rounded-xl bg-warning-soft p-3 text-xs font-semibold text-warning">{error}</p>}
    <div className="flex flex-wrap gap-2">
      {!photo && !live && <Button type="button" onClick={start}><Camera/> Start camera</Button>}
      {live && <Button type="button" onClick={capture}><Camera/> Capture photo</Button>}
      {photo && <Button type="button" variant="outline" onClick={() => { onChange(""); void start(); }}><RefreshCcw/> Retake</Button>}
      <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}><Upload/> Upload instead</Button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(event) => upload(event.target.files?.[0])}/>
    </div>
  </div>;
}
