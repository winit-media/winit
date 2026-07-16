"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Film, Upload, ChevronUp, ChevronDown, ArrowLeftRight } from "lucide-react";
import { useAdmin } from "@/components/AdminProvider";
import { Section, Field } from "../components/FormElements";
import { SaveButton } from "../components/SaveIndicator";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useToast } from "@/components/ui/Toast";
import { uid } from "@/lib/uid";

export default function VideosTab() {
  const { data, updateContent, revertedCount } = useAdmin();
  const [local, setLocal] = useState(data);
  const [prevReverted, setPrevReverted] = useState(revertedCount);

  if (revertedCount !== prevReverted) {
    setPrevReverted(revertedCount);
    setLocal(data);
  }
  const [videoName, setVideoName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ name: string; percent: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const addVideo = () => {
    if (!videoUrl.trim()) return;
    const updated = {
      ...local,
      carouselVideos: [
        ...local.carouselVideos,
        { id: uid(), name: videoName || "Untitled", url: videoUrl.trim() },
      ],
    };
    setLocal(updated);
    updateContent(updated);
    setVideoName("");
    setVideoUrl("");
    toast("Video added", "success");
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadProgress(Array.from(files).map((f) => ({ name: f.name, percent: 0 })));
    const fileArray = Array.from(files);
    const newVideos: { id: string; name: string; url: string }[] = [];
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const name = file.name.replace(/\.[^/.]+$/, "");
      try {
        const url = await uploadToCloudinary(file, "winit/videos", (percent) => {
          setUploadProgress((prev) =>
            prev.map((p, idx) => (idx === i ? { ...p, percent } : p))
          );
        });
        newVideos.push({ id: uid(), name, url });
        setUploadProgress((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, percent: 100 } : p))
        );
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
        setUploadProgress((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, percent: -1 } : p))
        );
      }
    }
    if (newVideos.length > 0) {
      const updated = { ...local, carouselVideos: [...local.carouselVideos, ...newVideos] };
      setLocal(updated);
      updateContent(updated);
      toast(`${newVideos.length} video(s) uploaded`, "success");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeVideo = (id: string) => {
    const updated = {
      ...local,
      carouselVideos: local.carouselVideos.filter((v) => v.id !== id),
    };
    setLocal(updated);
    updateContent(updated);
    toast("Video removed", "success");
  };

  const updateVideoName = (id: string, name: string) => {
    const updated = {
      ...local,
      carouselVideos: local.carouselVideos.map((v) => (v.id === id ? { ...v, name } : v)),
    };
    setLocal(updated);
    updateContent(updated, true);
  };

  const moveVideo = (id: string, direction: "up" | "down") => {
    const videos = [...local.carouselVideos];
    const idx = videos.findIndex((v) => v.id === id);
    if (idx === -1) return;
    const target = direction === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= videos.length) return;
    [videos[idx], videos[target]] = [videos[target], videos[idx]];
    const updated = { ...local, carouselVideos: videos };
    setLocal(updated);
    updateContent(updated);
  };

  const moveToOtherRow = (id: string) => {
    const videos = [...local.carouselVideos];
    const idx = videos.findIndex((v) => v.id === id);
    if (idx === -1) return;
    const mid = Math.ceil(videos.length / 2);
    const [video] = videos.splice(idx, 1);
    if (idx < mid) {
      videos.push(video);
    } else {
      videos.splice(mid, 0, video);
    }
    const updated = { ...local, carouselVideos: videos };
    setLocal(updated);
    updateContent(updated);
  };

  return (
    <div className="space-y-6">
      <Section title="Default Fallback Video">
        <Field
          label="Fallback Video URL"
          value={local.defaultVideoUrl}
          onChange={(v) => setLocal((p) => ({ ...p, defaultVideoUrl: v }))}
        />
        <button
          onClick={() => updateContent({ defaultVideoUrl: local.defaultVideoUrl })}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
        >
          Save
        </button>
      </Section>

      <Section title="Add Video">
        <Field label="Video Name" value={videoName} onChange={setVideoName} placeholder="Campaign name" />
        <Field label="Video URL" value={videoUrl} onChange={setVideoUrl} placeholder="Cloudinary or direct link" />
        <button
          onClick={addVideo}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
        >
          <Plus size={14} /> Add
        </button>
      </Section>

      <Section title="Bulk Upload Videos">
        <p className="text-sm text-gray-500 mb-2">Select multiple video files to upload at once</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleBulkUpload}
          className="hidden"
          id="bulk-video-upload"
        />
        <label
          htmlFor="bulk-video-upload"
          className={`flex items-center justify-center gap-2 w-full px-4 py-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
            uploading
              ? "bg-gray-50 border-gray-300 cursor-not-allowed"
              : "border-brand/40 hover:border-brand hover:bg-brand/5"
          }`}
        >
          {uploading ? (
            <span className="animate-spin text-brand text-lg">...</span>
          ) : (
            <Upload size={20} className="text-brand" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {uploading ? "Uploading..." : "Click or drag to upload videos"}
          </span>
        </label>
        {uploadProgress.length > 0 && (
          <div className="mt-3 space-y-2">
            {uploadProgress.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <Film size={14} className="text-gray-400 shrink-0" />
                <span className="text-xs text-gray-600 truncate flex-1">{p.name}</span>
                {p.percent === -1 ? (
                  <span className="text-xs text-red-500">Failed</span>
                ) : p.percent === 100 ? (
                  <span className="text-xs text-green-600">Done</span>
                ) : (
                  <span className="text-xs text-brand">{p.percent}%</span>
                )}
                {p.percent > 0 && p.percent < 100 && p.percent !== -1 && (
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full transition-all duration-200"
                      style={{ width: `${p.percent}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
            {!uploading && (
              <button
                onClick={() => setUploadProgress([])}
                className="text-xs text-gray-400 hover:text-gray-600 mt-1"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </Section>

      <Section title={`Carousel Videos (${local.carouselVideos.length})`} actions={
        local.carouselVideos.length > 0 ? (
          <SaveButton onClick={() => updateContent({ carouselVideos: local.carouselVideos })} size="sm" label="Save Order" />
        ) : undefined
      }>
        {local.carouselVideos.length === 0 ? (
          <p className="text-gray-400 text-sm">No videos added yet</p>
        ) : (
          (() => {
            const mid = Math.ceil(local.carouselVideos.length / 2);
            const topRow = local.carouselVideos.slice(0, mid);
            const bottomRow = local.carouselVideos.slice(mid);
            const renderRow = (videos: typeof local.carouselVideos, baseIdx: number, rowLabel: string) => (
              <div className="space-y-2">
                {videos.map((v, localIdx) => {
                  const globalIdx = baseIdx + localIdx;
                  const isFirst = globalIdx === 0;
                  const isLast = globalIdx === local.carouselVideos.length - 1;
                  return (
                    <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {v.url ? (
                          <video
                            src={v.url}
                            className="h-12 w-16 object-cover rounded border bg-gray-900"
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <Film size={16} className="text-gray-400" />
                        )}
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={v.name}
                            onChange={(e) => updateVideoName(v.id, e.target.value)}
                            className="font-medium text-sm bg-transparent border-b border-transparent hover:border-gray-300 focus:border-brand focus:outline-none w-full px-1 py-0.5 rounded"
                          />
                          <p className="text-xs text-gray-400 truncate max-w-[300px]">{v.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => moveVideo(v.id, "up")}
                          disabled={isFirst}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-25 disabled:cursor-not-allowed p-1 rounded hover:bg-gray-200 transition-colors"
                          title="Move up"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={() => moveVideo(v.id, "down")}
                          disabled={isLast}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-25 disabled:cursor-not-allowed p-1 rounded hover:bg-gray-200 transition-colors"
                          title="Move down"
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          onClick={() => moveToOtherRow(v.id)}
                          className="text-brand hover:text-brand-dark p-1 rounded hover:bg-brand/10 transition-colors"
                          title={`Move to ${rowLabel === "top" ? "bottom" : "top"} row`}
                        >
                          <ArrowLeftRight size={14} />
                        </button>
                        <button
                          onClick={() => removeVideo(v.id)}
                          className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Top Row ({topRow.length})</p>
                  {renderRow(topRow, 0, "top")}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Bottom Row ({bottomRow.length})</p>
                  {renderRow(bottomRow, mid, "bottom")}
                </div>
              </div>
            );
          })()
        )}
      </Section>
    </div>
  );
}
