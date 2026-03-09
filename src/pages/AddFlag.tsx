// src/pages/AddFlag.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createTrip } from "../lib/trips.api";
import { uploadImage } from "../lib/storage.api";
import { reverseGeocode } from "../lib/map.api";
import LeafletMap from "../components/map/LeafletMap";
import Button from "../components/ui/Button";
import type { Stage } from "../types";
import type { TripImage } from "../types";

interface ImageEntry {
  file: File;
  preview: string;
  caption: string;
}

interface TripFormData {
  title: string;
  description: string;
  datePrecision: "year" | "month" | "full";
  year: string;
  month: string;
  day: string;
  latitude: number | null;
  longitude: number | null;
  locationName: string;
  coverImageFile: File | null;
  coverImagePreview: string | null;
  images: ImageEntry[];
  stages: Stage[];
}

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  new Date(2000, i).toLocaleString("en", { month: "long" }),
);

const STEPS = ["Info", "Location", "Photos", "Stages"];

const AddFlag = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newStage, setNewStage] = useState({
    title: "",
    description: "",
    images: [] as { file: File; preview: string; caption: string }[],
  });

  const [formData, setFormData] = useState<TripFormData>({
    title: "",
    description: "",
    datePrecision: "year",
    year: new Date().getFullYear().toString(),
    month: "",
    day: "",
    latitude: null,
    longitude: null,
    locationName: "",
    coverImageFile: null,
    coverImagePreview: null,
    images: [],
    stages: [],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    try {
      const location = await reverseGeocode(lat, lng);
      setFormData((prev) => ({
        ...prev,
        locationName: `${location.city}, ${location.country}`,
      }));
    } catch {
      setFormData((prev) => ({
        ...prev,
        locationName: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      }));
    }
  };

  const handleCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      coverImageFile: file,
      coverImagePreview: URL.createObjectURL(file),
    }));
  };

  const handleAdditionalImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ImageEntry[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: "",
    }));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleImageCaption = (index: number, caption: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, caption } : img,
      ),
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddStage = async () => {
    if (!newStage.title.trim() || !user) return;

    const uploadedImages: TripImage[] = [];
    for (const image of newStage.images) {
      const url = await uploadImage("trip-images", image.file, user.id);
      uploadedImages.push({ url, caption: image.caption });
    }

    setFormData((prev) => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          title: newStage.title,
          description: newStage.description,
          images: uploadedImages,
        },
      ],
    }));
    setNewStage({ title: "", description: "", images: [] });
  };

  const handleStageImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: "",
    }));
    setNewStage((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleStageImageCaption = (index: number, caption: string) => {
    setNewStage((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, caption } : img,
      ),
    }));
  };

  const handleRemoveStage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index),
    }));
  };

  const buildDate = (): string | null => {
    if (!formData.year) return null;
    if (formData.datePrecision === "year") return `${formData.year}-01-01`;
    if (formData.datePrecision === "month")
      return `${formData.year}-${formData.month.toString().padStart(2, "0")}-01`;
    return `${formData.year}-${formData.month.toString().padStart(2, "0")}-${formData.day.toString().padStart(2, "0")}`;
  };

  const validateStep = (): boolean => {
    setError(null);
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        setError("Title is required");
        return false;
      }
      if (!formData.year) {
        setError("Year is required");
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.latitude) {
        setError("Select a location on the map");
        return false;
      }
    }
    if (currentStep === 3) {
      if (!formData.coverImageFile) {
        setError("Cover photo is required");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      // 1 — Pugem la foto de portada
      let coverUrl = "";
      if (formData.coverImageFile) {
        coverUrl = await uploadImage(
          "trip-images",
          formData.coverImageFile,
          user.id,
        );
      }

      // 2 — Pugem les fotos addicionals amb els seus captions
      const additionalImages: { url: string; caption: string }[] = [];
      for (const image of formData.images) {
        const url = await uploadImage("trip-images", image.file, user.id);
        additionalImages.push({ url, caption: image.caption });
      }

      // 3 — Creem el viatge a Supabase
      await createTrip({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        cover_image_url: coverUrl,
        images: additionalImages,
        stages: formData.stages,
        latitude: formData.latitude!,
        longitude: formData.longitude!,
        date: buildDate(),
      });

      navigate(`/profile/${user.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Capçalera */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-black uppercase italic tracking-tight">
          Add Flag 🚩
        </h1>

        {/* Indicador de passos */}
        <div className="flex items-center gap-2 mt-4">
          {STEPS.map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`
                w-7 h-7 rounded-full flex items-center justify-center text-xs font-black
                ${currentStep > index + 1 ? "bg-primary text-background" : ""}
                ${currentStep === index + 1 ? "border-2 border-primary text-primary" : ""}
                ${currentStep < index + 1 ? "border border-gray-700 text-gray-600" : ""}
              `}
              >
                {currentStep > index + 1 ? "✓" : index + 1}
              </div>
              <span
                className={`text-xs font-bold ${currentStep === index + 1 ? "text-primary" : "text-gray-600"}`}
              >
                {step}
              </span>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-px w-4 ${currentStep > index + 1 ? "bg-primary" : "bg-gray-800"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contingut */}
      <div className="px-6 pb-32">
        {/* PAS 1 — Info */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-black text-primary uppercase tracking-widest">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Japan 2024"
                className="w-full bg-card border border-primary/20 focus:border-primary text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none transition-colors mt-2"
              />
            </div>

            <div>
              <label className="text-xs font-black text-primary uppercase tracking-widest">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about this trip..."
                rows={4}
                className="w-full bg-card border border-primary/20 focus:border-primary text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none transition-colors mt-2 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-black text-primary uppercase tracking-widest">
                Trip date
              </label>
              <div className="flex gap-2 mt-2">
                {(["year", "month", "full"] as const).map((precision) => (
                  <button
                    key={precision}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        datePrecision: precision,
                      }))
                    }
                    className={`flex-1 py-2 rounded-xl text-xs font-black border transition-colors
                      ${
                        formData.datePrecision === precision
                          ? "bg-primary text-background border-primary"
                          : "border-gray-700 text-gray-500"
                      }`}
                  >
                    {precision === "year"
                      ? "Year"
                      : precision === "month"
                        ? "Month"
                        : "Full date"}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Year"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="flex-1 bg-card border border-primary/20 focus:border-primary text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none transition-colors"
                />
                {(formData.datePrecision === "month" ||
                  formData.datePrecision === "full") && (
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className="flex-1 bg-card border border-primary/20 focus:border-primary text-white rounded-xl px-4 py-3 outline-none transition-colors"
                  >
                    <option value="">Month</option>
                    {MONTHS.map((m, i) => (
                      <option key={m} value={String(i + 1).padStart(2, "0")}>
                        {m}
                      </option>
                    ))}
                  </select>
                )}
                {formData.datePrecision === "full" && (
                  <input
                    type="number"
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    placeholder="Day"
                    min="1"
                    max="31"
                    className="w-20 bg-card border border-primary/20 focus:border-primary text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none transition-colors"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* PAS 2 — Location */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-4">
            <p className="text-gray-400 text-sm">
              Tap on the map to mark where your trip took place
            </p>
            <LeafletMap
              onLocationSelect={handleLocationSelect}
              selectedPosition={
                formData.latitude && formData.longitude
                  ? { lat: formData.latitude, lng: formData.longitude }
                  : null
              }
            />
            {formData.locationName && (
              <div className="flex items-center gap-2 bg-card border border-primary/20 rounded-xl px-4 py-3">
                <span className="text-primary">📍</span>
                <span className="text-white text-sm font-bold">
                  {formData.locationName}
                </span>
              </div>
            )}
          </div>
        )}

        {/* PAS 3 — Photos */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <label className="text-xs font-black text-primary uppercase tracking-widest">
                Cover photo *
              </label>
              <p className="text-gray-600 text-xs mt-1">
                This will appear on your trip cards
              </p>
              <label className="mt-3 flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-primary/30 rounded-xl cursor-pointer hover:border-primary/60 transition-colors overflow-hidden">
                {formData.coverImagePreview ? (
                  <img
                    src={formData.coverImagePreview}
                    alt="cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">📷</span>
                    <span className="text-gray-500 text-sm">
                      Tap to add cover photo
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImage}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="text-xs font-black text-primary uppercase tracking-widest">
                Additional photos
              </label>
              <p className="text-gray-600 text-xs mt-1">
                They will appear in the trip detail carousel
              </p>
              <label className="mt-3 flex items-center justify-center w-full h-16 border border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-primary/40 transition-colors">
                <span className="text-gray-500 text-sm">+ Add photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImages}
                  className="hidden"
                />
              </label>

              {formData.images.length > 0 && (
                <div className="flex flex-col gap-3 mt-3">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-start bg-card border border-primary/20 rounded-xl p-3"
                    >
                      <img
                        src={image.preview}
                        alt={`photo ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 flex flex-col gap-2">
                        <input
                          type="text"
                          value={image.caption}
                          onChange={(e) =>
                            handleImageCaption(index, e.target.value)
                          }
                          placeholder="Add a caption... (optional)"
                          className="w-full bg-background border border-gray-800 focus:border-primary text-white placeholder-gray-600 rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="text-gray-600 hover:text-red-500 text-xs self-start transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PAS 4 — Stages */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-4">
            <p className="text-gray-400 text-sm">
              Add the stages of your trip — cities, places, experiences
            </p>

            <div className="bg-card border border-primary/20 rounded-xl p-4 flex flex-col gap-3">
              <input
                type="text"
                value={newStage.title}
                onChange={(e) =>
                  setNewStage((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Stage name (ex: Tokyo)"
                className="w-full bg-background border border-gray-800 focus:border-primary text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none transition-colors"
              />
              <textarea
                value={newStage.description}
                onChange={(e) =>
                  setNewStage((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe this stage..."
                rows={3}
                className="w-full bg-background border border-gray-800 focus:border-primary text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none transition-colors resize-none"
              />
              {/* Dins del div del formulari nova etapa, després del textarea */}
              <div>
                <label className="text-xs font-black text-primary uppercase tracking-widest">
                  Stage photos
                </label>
                <label className="mt-2 flex items-center justify-center w-full h-12 border border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-primary/40 transition-colors">
                  <span className="text-gray-500 text-sm">+ Add photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleStageImages}
                    className="hidden"
                  />
                </label>

                {newStage.images.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    {newStage.images.map((image, index) => (
                      <div
                        key={index}
                        className="flex gap-3 items-start bg-background border border-gray-800 rounded-xl p-3"
                      >
                        <img
                          src={image.preview}
                          alt={`stage photo ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg shrink-0"
                        />
                        <input
                          type="text"
                          value={image.caption}
                          onChange={(e) =>
                            handleStageImageCaption(index, e.target.value)
                          }
                          placeholder="Add a caption... (optional)"
                          className="flex-1 bg-card border border-gray-800 focus:border-primary text-white placeholder-gray-600 rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button variant="secondary" size="sm" onClick={handleAddStage}>
                + Add stage
              </Button>
            </div>

            {formData.stages.length > 0 && (
              <div className="flex flex-col gap-2">
                {formData.stages.map((stage, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between bg-card border border-primary/20 rounded-xl p-4"
                  >
                    <div className="flex-1">
                      <p className="text-white font-black text-sm">
                        {stage.title}
                      </p>
                      {stage.description && (
                        <p className="text-gray-500 text-xs mt-1">
                          {stage.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveStage(index)}
                      className="text-gray-600 hover:text-red-500 transition-colors ml-3 text-xl leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}

        {/* Navegació */}
        <div className="flex gap-3 mt-8">
          {currentStep > 1 && (
            <Button variant="danger" onClick={handleBack}>
              Back
            </Button>
          )}
          {currentStep < 4 ? (
            <Button variant="primary" fullWidth onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Plant the flag 🚩"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFlag;
