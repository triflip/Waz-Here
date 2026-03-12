import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, getTripsByUser, getInspiredCount } from "../lib/profile.api";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import TripCard from '../components/ui/TripCard'
import type { Profile as ProfileType, Trip } from "../types";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inspired, setInspired] = useState(0)
  const isOwnProfile = user?.id === id;

  useEffect(() => {
    if (!id) return;

    const loadProfile = async () => {
      try {
        const [profileData, tripsData, inspiredCount] = await Promise.all([
          getProfile(id),
          getTripsByUser(id),
          getInspiredCount(id),
        ]);
        setProfile(profileData);
        setTrips(tripsData);
        setInspired(inspiredCount);
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


  const totalFlags = trips.reduce(
    (acc, trip) => acc + 1 + (trip.stages?.length ?? 0),
    0,
  );

  return (
    <div className="min-h-screen bg-background text-white">

      <div className="flex flex-col items-center pt-12 pb-6 px-6">
    
        <Avatar url={profile.avatar_url} name={profile.full_name} size="lg" />

        <h1 className="text-xl font-bold tracking-wide mt-4">
          {profile.full_name}
        </h1>

        <p className="text-primary text-sm mt-1 flex items-center gap-1">
          <span>📍</span>
          <span>{profile.city}</span>
        </p>
        {profile.description && (
          <p className="text-gray-400 text-sm text-center mt-3 max-w-xs leading-relaxed">
            {profile.description}
          </p>
        )}
        <div className="flex gap-4 mt-6 w-full ">
          <div className="flex-1 flex flex-col items-center border border-primary/30 rounded-xl px-5 py-3 bg-card shadow-[0_0_15px_rgba(19,236,73,0.1)]">
            <span className="text-primary text-xl font-bold">{trips.length}</span>
            <span className="text-gray-500 text-xs mt-1">Trips</span>
          </div>

          <div className="flex-1 flex flex-col items-center border border-primary/30 rounded-xl px-5 py-3 bg-card shadow-[0_0_15px_rgba(19,236,73,0.1)]">
            <span className="text-primary text-xl font-bold">{totalFlags}</span>
            <span className="text-gray-500 text-xs mt-1">Flags</span>
          </div>

          <div className="flex-1 flex flex-col items-center border border-primary/30 rounded-xl px-5 py-3 bg-card shadow-[0_0_15px_rgba(19,236,73,0.1)]">
            <span className="text-primary text-xl font-bold">{inspired}</span>
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
  <TripCard key={trip.id} trip={trip} />
))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
