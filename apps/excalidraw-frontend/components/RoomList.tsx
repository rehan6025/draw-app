"use client";
import { useEffect, useState } from "react";
import { Room } from "../app/dashboard/page";
import RoomCard from "./RoomCard";
import { BadgePlus, Grid3X3, List, Palette, Plus, Search } from "lucide-react";
import { Button } from "@repo/ui/button";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function RoomList({ initialRooms }: { initialRooms: Room[] }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [newRoom, setNewRoom] = useState<string>("");
  const router = useRouter();

  const handleCreateRoom = async (name: string) => {
    if (!name.trim()) return;
    const token = localStorage.getItem("token");
    const toastId = toast.loading("Creating room...");

    try {
      const { data: createdRoom } = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: name.trim() },
        { headers: { Authorization: token } }
      );

      setRooms((prev) => [...prev, createdRoom]); // immediate UI update
      setNewRoom("");
      toast.success("Room created!", { id: toastId });

      router.push(`/canvas/${createdRoom.roomId}`);
    } catch (error) {
      toast.error("Failed to create room", { id: toastId });
    }
  };

  const handleJoinRoom = async (roomName: string) => {
    try {
      const id = toast.loading("Entering...");
      const res = await axios.get(`${HTTP_BACKEND}/room/${roomName}`);
      const room = res.data;

      setRooms((prevRooms) => [...prevRooms, room]);
      toast.dismiss(id);
      setNewRoom("");
      router.push(`/canvas/${room.roomId}`);
    } catch (error) {
      console.log("Roomlist :: handleJoinRoom ::", error);
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    const toastId = toast.loading("Deleting room...");

    try {
      //temp remove ffrom localstorage for better ux
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));

      await axios.get(`${HTTP_BACKEND}/room/${roomId}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      toast.success("Room deleted!", { id: toastId });
    } catch (error) {
      setRooms((prevRooms) => [
        ...prevRooms,
        rooms.find((room) => room.id === roomId)!,
      ]);
      toast.error("Failed to delete room", { id: toastId });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${HTTP_BACKEND}/userRooms`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setRooms(res.data);
      })
      .catch((err) => {
        console.error("Error fetching updated rooms:", err);
      });
  }, []);

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
        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No rooms found
            </h3>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {rooms.map((room, index) => (
              <RoomCard
                key={`${room.id}-${room.slug}-${index}`}
                room={room}
                viewMode={viewMode}
                onDelete={handleDeleteRoom}
              />
            ))}
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}
