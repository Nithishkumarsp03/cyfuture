import React, { useEffect, useState, useMemo } from "react";
import {
  Lock,
  Search,
  Filter,
  Clock,
  Globe,
  ChevronDown,
  Unlock,
} from "lucide-react";
import CreateRoomModal from "./CreateRoomModal";
import JoinRoomModal from "./JoinRoomModal";
import Select from "../select/Select";

import { useToast } from "../Toast/ToastContext";

const RoomLobby = ({ onJoinSuccess, RoomState, setRoomState }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [activeRooms, setActiveRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [privacyFilter, setPrivacyFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const api = import.meta.env.VITE_API_URL;
  const { addToast } = useToast();

  const privacyOptions = [
    { value: "all", label: "All Rooms", icon: Globe },
    { value: "public", label: "Public Only", icon: Unlock },
    { value: "private", label: "Private Only", icon: Lock },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First", icon: Clock },
    { value: "oldest", label: "Oldest First", icon: Clock },
  ];

  const fetchActiveRooms = async () => {
    try {
      const res = await fetch(`${api}/room/active-rooms`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error("Failed to fetch rooms");
      }

      setActiveRooms(data);
    } catch (error) {
      // addToast(error.message || "Failed to fetch rooms");
    }
  };

  useEffect(() => {
    fetchActiveRooms();
  }, []);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("");

  const filteredRooms = useMemo(() => {
    let rooms = [...activeRooms];

    // Search by room name or host name
    if (search.trim()) {
      rooms = rooms.filter(
        (room) =>
          room.room_name?.toLowerCase().includes(search.toLowerCase()) ||
          room.user_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Privacy filter
    if (privacyFilter !== "all") {
      rooms = rooms.filter((room) =>
        privacyFilter === "private" ? room.is_private : !room.is_private
      );
    }

    // Sort by date
    rooms.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return rooms;
  }, [activeRooms, search, privacyFilter, sortOrder]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Live Video Rooms
          </h1>
          <p className="text-sm text-gray-600">
            Create or join an existing room
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2 font-semibold text-white bg-indigo-600 rounded-xl shadow-lg hover:scale-105 hover:bg-indigo-700 transition-all"
          >
            Create Room
          </button>
          {/* <button
            onClick={() => setShowJoinModal(true)}
            className="px-5 py-2 font-semibold text-indigo-700 bg-indigo-100 rounded-xl hover:bg-indigo-200 shadow hover:scale-105 transition-all"
          >
            Join Room
          </button> */}
        </div>
      </div>

      {/* Filters + Search */}
      <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full sm:w-1/3 shadow-inner focus-within:ring-2 focus-within:ring-blue-500 transition">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by room or host name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-sm placeholder-gray-400"
          />
        </div>

        {/* Privacy Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select
            value={privacyFilter}
            onChange={setPrivacyFilter}
            options={privacyOptions}
            placeholder="Sort Privacy"
            className="appearance-none bg-gray-100 px-3 py-2 pr-8 rounded-lg text-sm outline-none hover:bg-gray-200 transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Sort Order */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <Select
            value={sortOrder}
            onChange={setSortOrder}
            options={sortOptions}
            placeholder="Sort order"
            className="appearance-none w-44 flex items-center justify-between bg-gray-100 px-3 py-2 pr-8 rounded-lg text-sm outline-none hover:bg-gray-200 transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Active Rooms */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-500" /> Active Rooms
        </h2>
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="relative bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col gap-3"
              >
                {/* Private Badge */}
                {room.is_private && (
                  <div className="absolute top-3 right-3 bg-gray-800 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Lock size={12} /> Private
                  </div>
                )}

                {/* Host Avatar */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow">
                    {getInitials(room.user_name)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {room.room_name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Host: {room.user_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(room.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Join Button */}
                <button
                  onClick={() => {
                    setShowJoinModal(true);
                    setRoomState((prev) => ({
                      ...prev,
                      roomId: room.id,
                      roomName: room.room_name,
                    }));
                  }}
                  className="mt-auto px-4 py-2 text-sm font-medium text-white bg-[#2563eb] rounded-lg hover:bg-indigo-700 hover:scale-102 transition-all shadow"
                >
                  {room.is_private ? "Request to Join" : "Join Room"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No active rooms available.</p>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={onJoinSuccess}
          RoomState={RoomState}
        />
      )}
      {showJoinModal && (
        <JoinRoomModal
          onClose={() => {
            setShowJoinModal(false);
            // setRoomState((prev) => ({ ...prev, roomId: null }));
          }}
          onSuccess={onJoinSuccess}
          RoomState={RoomState}
        />
      )}
    </div>
  );
};

export default RoomLobby;
