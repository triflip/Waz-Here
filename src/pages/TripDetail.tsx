import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTrip } from "../lib/trips.api";
import { getProfile } from "../lib/profile.api";
import { isIdeaSaved, toggleIdea } from "../lib/ideas.api";
import { Lightbulb } from "lucide-react";
import Avatar from "../components/ui/Avatar";
import type { Trip, Profile, TripImage } from "../types";

const TripDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [author, setAuthor] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [saved, setSaved] = useState(false);
  const [lightbox, setLightbox] = useState<{
    photos: TripImage[];
    index: number;
  } | null>(null);

  const isOwnTrip = user?.id === trip?.user_id;

  useEffect(() => {
    if (!id) return;
    const loadTrip = async () => {
      try {
        const tripData = await getTrip(id);
        const authorData = await getProfile(tripData.user_id);
        setTrip(tripData);
        setAuthor(authorData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading trip");
      } finally {
        setLoading(false);
      }
    };
    loadTrip();
  }, [id]);

  useEffect(() => {
    if (!user || !trip || isOwnTrip) return;
    isIdeaSaved(user.id, trip.id).then(setSaved);
  }, [user, trip, isOwnTrip]);

  const handleBulb = async () => {
    if (!user || !trip || isOwnTrip) return;
    const newState = await toggleIdea(user.id, trip.id);
    setSaved(newState);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-primary tracking-widest animate-pulse">Loading...</p>
      </div>
    );

  if (error || !trip || !author)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-500">{error || "Trip not found"}</p>
      </div>
    );

  const allPhotos: TripImage[] = [
    { url: trip.cover_image_url, caption: "" },
    ...(trip.images || []),
  ].filter((photo) => photo.url);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.toLocaleString("en", { month: "long" });
    const day = date.getDate();
    if (date.getMonth() === 0 && day === 1) return `${year}`;
    if (day === 1) return `${month} ${year}`;
    return `${month} ${day}, ${year}`;
  };

  const flagCount = 1 + (trip.stages?.length ?? 0);

  const LightboxModal = () => {
    if (!lightbox) return null;
    const photo = lightbox.photos[lightbox.index];

    return (
      <div
        className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center px-4"
        onClick={() => setLightbox(null)}
      >
        <button
          className="absolute top-4 right-4 w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white text-xl"
          onClick={() => setLightbox(null)}
        >
          ×
        </button>

        <img
          src={photo.url}
          alt={photo.caption || ""}
          className="max-w-[90vw] max-h-[85vh] w-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />

        {photo.caption && (
          <p className="text-gray-400 text-sm mt-4 text-center">
            {photo.caption}
          </p>
        )}

        {lightbox.photos.length > 1 && (
          <div className="flex items-center gap-6 mt-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((prev) =>
                  prev ? { ...prev, index: Math.max(0, prev.index - 1) } : null,
                );
              }}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white text-xl"
            >
              ‹
            </button>
            <span className="text-gray-500 text-xs">
              {lightbox.index + 1} / {lightbox.photos.length}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((prev) =>
                  prev
                    ? {
                        ...prev,
                        index: Math.min(
                          lightbox.photos.length - 1,
                          prev.index + 1,
                        ),
                      }
                    : null,
                );
              }}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white text-xl"
            >
              ›
            </button>
          </div>
        )}

        {lightbox.photos.length > 1 && (
          <div className="flex gap-1.5 mt-4">
            {lightbox.photos.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === lightbox.index ? "bg-primary w-3" : "bg-white/30 w-1.5"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-white pb-24">
      <div
        onClick={() => navigate(`/profile/${author.id}`)}
        className="flex items-center gap-3 mt-6 bg-card border border-primary/20 rounded-xl p-3 cursor-pointer hover:border-primary transition-colors"
      >
        <Avatar url={author.avatar_url} name={author.full_name} size="sm" />
        <div className="flex-1">
          <p className="text-white text-sm font-black">{author.full_name}</p>
          <p className="text-primary text-xs">📍 {author.city}</p>
        </div>
        <span className="text-gray-600 text-sm">→</span>
      </div>

      <div className="relative w-full aspect-square bg-card md:w-187.5 md:aspect-auto md:h-137.5 md:mx-auto">
        {allPhotos.length > 0 ? (
          <>
            <img
              src={allPhotos[activePhoto].url}
              alt={allPhotos[activePhoto].caption || trip.title}
              className="w-full h-full object-cover"
            />
            {allPhotos[activePhoto].caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent px-4 py-3">
                <p className="text-white text-sm">
                  {allPhotos[activePhoto].caption}
                </p>
              </div>
            )}
            {allPhotos.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {allPhotos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActivePhoto(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === activePhoto ? "bg-primary w-3" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
            {allPhotos.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActivePhoto((prev) => Math.max(0, prev - 1))
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setActivePhoto((prev) =>
                      Math.min(allPhotos.length - 1, prev + 1),
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white"
                >
                  ›
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">Flags</span>
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
        >
          ←
        </button>

        {!isOwnTrip && (
          <button
            onClick={handleBulb}
            className="absolute top-4 right-4 w-9 h-9 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform active:scale-125"
          >
            <Lightbulb
              size={20}
              fill={saved ? "#facc15" : "none"}
              stroke={saved ? "#facc15" : "white"}
              strokeWidth={1.5}
            />
          </button>
        )}
      </div>

      <div className="px-6 pt-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-black uppercase italic leading-tight flex-1">
            {trip.title}
          </h1>
          <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5 shrink-0">
            <span className="text-primary text-xs"></span>
            <span className="text-primary text-xs font-black">{flagCount}</span>
          </div>
        </div>

        {trip.date && (
          <span className="text-gray-500 text-xs font-bold mt-2 block">
            📅 {formatDate(trip.date)}
          </span>
        )}

        {trip.description && (
          <p className="text-gray-400 text-sm leading-relaxed mt-4">
            {trip.description}
          </p>
        )}

        {isOwnTrip && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate(`/edit-trip/${trip.id}`)}
              className="flex-1 border border-primary/30 text-primary text-sm font-black py-2 rounded-xl hover:bg-primary/10 transition-colors"
            >
              Edit trip
            </button>
            <button className="flex-1 border border-red-500/30 text-red-500 text-sm font-black py-2 rounded-xl hover:bg-red-500/10 transition-colors">
              Delete trip
            </button>
          </div>
        )}
      </div>

      {trip.stages && trip.stages.length > 0 && (
        <div className="px-6 mt-8">
          <h2 className="text-xs font-black text-primary uppercase tracking-widest mb-4">
            Stages
          </h2>
          <div className="flex flex-col gap-4">
            {trip.stages.map((stage, index) => (
              <div
                key={index}
                className="bg-card border border-primary/20 rounded-xl overflow-hidden"
              >
                {stage.images && stage.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto p-3 pb-0">
                    {stage.images.map((img, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="shrink-0 cursor-pointer"
                        onClick={() =>
                          setLightbox({
                            photos: stage.images,
                            index: imgIndex,
                          })
                        }
                      >
                        <img
                          src={img.url}
                          alt={img.caption || stage.title}
                          className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-lg hover:opacity-80 transition-opacity"
                        />
                        {img.caption && (
                          <p className="text-gray-600 text-xs mt-1 w-32 truncate">
                            {img.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-black"></span>
                    <p className="text-white font-black text-sm">
                      {stage.title}
                    </p>
                  </div>
                  {stage.description && (
                    <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                      {stage.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <LightboxModal />
    </div>
  );
};

export default TripDetail;
