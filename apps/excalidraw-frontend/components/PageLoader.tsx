"use client";
import { PropagateLoader } from "react-spinners";

export default function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <PropagateLoader color="#3656c3" loading size={20} />
      </div>
    </div>
  );
}
