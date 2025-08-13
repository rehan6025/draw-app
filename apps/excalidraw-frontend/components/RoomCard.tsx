import { Room } from "../app/dashboard/page";

export default function RoomCard({ room }: { room: Room }) {
  return <div>{room.slug}</div>;
}
