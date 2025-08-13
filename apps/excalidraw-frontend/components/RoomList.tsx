"use client";
import { useState } from "react";
import { Room } from "../app/dashboard/page";
import RoomCard from "./RoomCard";
import { BadgePlus, Grid3X3, List, Plus, Search } from "lucide-react";
import { Button } from "@repo/ui/button";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";

export default function RoomList({ initialRooms }: { initialRooms: Room[] }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [newRoom, setNewRoom] = useState<string>("");
  const router = useRouter();

  const handleCreateRoom = async (name: string) => {
    if (!name.trimEnd()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${HTTP_BACKEND}/room`,
        {
          name: name.trim(),
        },
        { headers: { Authorization: token } }
      );

      const updatedRooms = await axios.get(`${HTTP_BACKEND}/userRooms`, {
        headers: { Authorization: token },
      });
      setRooms(updatedRooms.data);

      setNewRoom("");
      router.push(`/canvas/${res.data.roomId}`);
    } catch (error) {
      console.log("RoomList :: handleCreateRoom ::", error);
    }
  };

  const handleJoinRoom = async (roomName: string) => {
    try {
      const res = await axios.get(`${HTTP_BACKEND}/room/${roomName}`);
      const room = res.data;

      setRooms((prevRooms) => [...prevRooms, room]);

      setNewRoom("");
      router.push(`/canvas/${room.id}`);
    } catch (error) {
      console.log("Roomlist :: handleJoinRoom ::", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8">
      <div className="mb-8 mt-5">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Drawing Rooms
        </h1>
        <p className="text-gray-600">
          Manage and access all your collaborative drawing spaces
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <BadgePlus className="absolute left-3 top-8 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Create a new room..."
            className="w-full pl-10 pr-4 py-4.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
          />
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            handleCreateRoom(newRoom);
          }}
        >
          Create
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            handleJoinRoom(newRoom);
          }}
        >
          Join
        </Button>
        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "grid"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "list"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
