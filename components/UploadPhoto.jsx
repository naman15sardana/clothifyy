"use client";

import { useEffect, useRef, useState } from "react";

export default function UploadPhoto({ onChange, preview }) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => stopStream();
  }, []);

  useEffect(() => {
    if (cameraOpen) {
      startCamera();
    } else {
      stopStream();
    }
  }, [cameraOpen]);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    try {
      setCameraError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setCameraError("Unable to access camera. Please allow permissions.");
      setCameraOpen(false);
    }
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "capture.png", { type: "image/png" });
        const url = URL.createObjectURL(blob);
        onChange(file, url);
        setCameraOpen(false);
      },
      "image/png",
      0.92
    );
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(file, url);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900">Your photo</p>
          <p className="text-sm text-gray-600">
            Upload a clear, front-facing photo.
          </p>
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80">
            Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>
          <button
            type="button"
            onClick={() => setCameraOpen(true)}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            Use Camera
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3">
        {preview ? (
          <div className="flex min-h-[16rem] items-center justify-center">
            <img
              src={preview}
              alt="User preview"
              className="max-h-[22rem] w-full rounded-lg object-contain"
            />
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-gray-500">
            No photo selected
          </div>
        )}
      </div>

      {cameraOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Camera</p>
              <button
                onClick={() => setCameraOpen(false)}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Close
              </button>
            </div>
            <div className="mt-3 overflow-hidden rounded-xl bg-black">
              <video ref={videoRef} className="h-[360px] w-full object-cover" />
            </div>
            {cameraError ? (
              <p className="mt-2 text-sm text-red-600">{cameraError}</p>
            ) : null}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setCameraOpen(false)}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={captureFrame}
                className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80"
              >
                Capture
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
