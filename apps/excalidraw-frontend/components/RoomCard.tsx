import { Room } from "../app/dashboard/page";
import { useRouter } from "next/navigation";
import { format } from "date-fns"; // For nice date formatting

export default function RoomCard({
  room,
  viewMode,
}: {
  room: Room & { admin: { name: string } }; // Include admin name
  viewMode: "grid" | "list";
}) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/canvas/${room.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all duration-200
        ${viewMode === "grid" ? "p-4" : "p-3 flex items-center justify-between"}`}
    >
      {viewMode === "grid" ? (
        <>
          <div className="mb-2 font-semibold text-lg">{room.slug}</div>
          <div className="text-sm text-gray-500">By {room.admin.name}</div>
          <div className="text-xs text-gray-400 mt-1">
            Created {format(new Date(room.createdAt), "dd MMM yyyy")}
          </div>
          <div className="mt-3 text-xs bg-gray-100 rounded px-2 py-1 inline-block">
            {room._count?.chats ?? 0} messages
          </div>
        </>
      ) : (
        <>
          <div>
            <div className="font-semibold">{room.slug}</div>
            <div className="text-xs text-gray-500">
              {format(new Date(room.createdAt), "dd MMM yyyy")} ·{" "}
              {room.admin.name}
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {room._count?.chats ?? 0} msgs
          </div>
        </>
      )}
    </div>
  );
}
