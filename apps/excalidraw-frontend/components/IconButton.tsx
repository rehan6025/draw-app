import { ReactNode } from "react";

export default function IconButton({
  icon,
  onClick,
  activated,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
}) {
  return (
    <div
      className={`rounded-full pointer border p-2 bg-black hover:bg-gray-600 ${activated ? "text-red-400" : "text-white"}`}
      onClick={onClick}
    >
      {icon}
    </div>
  );
}
