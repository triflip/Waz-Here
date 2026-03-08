// src/pages/Profile.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, getTripsByUser } from "../lib/profile.api";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import type { Profile as ProfileType, Trip } from "../types";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = user?.id === id;

  useEffect(() => {
    if (!id) return;

    const loadProfile = async () => {
      try {
        const [profileData, tripsData] = await Promise.all([
          getProfile(id),
          getTripsByUser(id),
        ]);
        setProfile(profileData);
        setTrips(tripsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className=" tracking-widest animate-pulse">Loading...</p>
      </div>
    );

  if (error || !profile)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">{error || "Profile not found"}</p>
      </div>
    );

  // Càlcul de flags — suma total de stages de tots els viatges
  // TODO: implementar correctament quan la lògica de stages estigui feta
  const totalFlags = trips.reduce(
    (acc, trip) => acc + (trip.stages?.length ?? 0),
    0,
  );

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Capçalera */}
      <div className="flex flex-col items-center pt-12 pb-6 px-6">
        {/* Avatar */}
        <Avatar url={profile.avatar_url} name={profile.full_name} size="lg" />

        {/* Nom */}
        <h1 className="text-xl font-bold tracking-wide mt-4">
          {profile.full_name}
        </h1>

        {/* Ciutat */}
        <p className="text-primary text-sm mt-1 flex items-center gap-1">
          <span>📍</span>
          <span>{profile.city}</span>
        </p>

        {/* Descripció */}
        {profile.description && (
          <p className="text-gray-400 text-sm text-center mt-3 max-w-xs leading-relaxed">
            {profile.description}
          </p>
        )}

        {/* Comptadors */}
        <div className="flex gap-4 mt-6 w-full ">
          <div className="flex-1 flex flex-col items-center border border-primary/30 rounded-xl px-5 py-3 bg-card shadow-[0_0_15px_rgba(19,236,73,0.1)]">
            <span className="text-white text-xl font-bold">{trips.length}</span>
            <span className="text-gray-500 text-xs mt-1">Trips</span>
          </div>

          <div className="flex-1 flex flex-col items-center border border-primary/30 rounded-xl px-5 py-3 bg-card shadow-[0_0_15px_rgba(19,236,73,0.1)]">
            <span className="text-white text-xl font-bold">{totalFlags}</span>
            <span className="text-gray-500 text-xs mt-1">Flags</span>
          </div>

          <div className="flex-1 flex flex-col items-center border border-primary/30 rounded-xl px-5 py-3 bg-card shadow-[0_0_15px_rgba(19,236,73,0.1)]">
            <span className="text-white text-xl font-bold">0</span>
            <span className="text-gray-500 text-xs mt-1">Inspired</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-900 mx-6 mb-6" />

      <div className="px-6 pb-24">
        {trips.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-sm">No trips yet</p>
            {isOwnProfile && (
              <div className="mt-4">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/add-flag")}
                >
                  Add your first flag 🚩
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {trips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => navigate(`/trip/${trip.id}`)}
                className="flex items-center gap-4 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-primary transition-colors cursor-pointer p-2"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-black">
                  {trip.cover_image_url ? (
                    <img
                      src={trip.cover_image_url}
                      alt={trip.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl">🚩</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold truncate">{trip.title}</p>
                  <p className="text-gray-600 text-xs mt-1">
                    {trip.stages?.length ?? 0}{" "}
                    {trip.stages?.length === 1 ? "flag" : "flags"}
                  </p>
                </div>

                {/* Bombeta dreta */}
                {/* TODO: lògica real de guardat al Dia 10 */}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="text-2xl px-2 shrink-0"
                >
                  💡
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
