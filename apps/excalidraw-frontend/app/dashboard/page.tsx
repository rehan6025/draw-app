import { Navbar } from "@/components/NavBar";
import RoomList from "@/components/RoomList";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { cookies } from "next/headers";

export type Room = {
  id: number;
  slug: string;
  createdAt: string;
  adminId: string;
  admin: {
    name: string;
  };
  _count: {
    chats: number;
  };
};

export default async function Dashboard() {
  const rooms: Room[] = await getUserRooms();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 ">
      <Navbar />
      <RoomList initialRooms={rooms} />
    </div>
  );
}

//@ts-ignore
async function getUserRooms(): Promise<Room[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    console.log(token);
    if (!token) return [];

    const res = await axios.get(`${HTTP_BACKEND}/userRooms`, {
      headers: {
        Authorization: token,
      },
    });
    return res.data as Room[];
  } catch (error) {
    console.log("dashboard ::", error);
  }
}

// "use client";

// import React, { useState } from "react";
// import {
//   Plus,
//   Search,
//   Filter,
//   Grid3X3,
//   List,
//   MoreVertical,
//   Users,
//   Clock,
//   Palette,
//   Settings,
//   LogOut,
//   Bell,
//   User,
//   Trash2,
//   Edit3,
//   Share2,
//   Eye,
// } from "lucide-react";

// interface Room {
//   id: string;
//   name: string;
//   thumbnail: string;
//   collaborators: number;
//   lastModified: string;
//   isOwner: boolean;
//   status: "active" | "archived";
// }

// interface DashboardProps {
//   onBack: () => void;
// }

// const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterStatus, setFilterStatus] = useState<
//     "all" | "active" | "archived"
//   >("all");

//   // Mock data - replace with actual API call
//   const [rooms] = useState<Room[]>([
//     {
//       id: "1",
//       name: "Team Brainstorm Session",
//       thumbnail:
//         "https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=400",
//       collaborators: 5,
//       lastModified: "2 hours ago",
//       isOwner: true,
//       status: "active",
//     },
//     {
//       id: "2",
//       name: "Logo Design Workshop",
//       thumbnail:
//         "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=400",
//       collaborators: 3,
//       lastModified: "1 day ago",
//       isOwner: true,
//       status: "active",
//     },
//     {
//       id: "3",
//       name: "Character Sketches",
//       thumbnail:
//         "https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400",
//       collaborators: 2,
//       lastModified: "3 days ago",
//       isOwner: false,
//       status: "active",
//     },
//     {
//       id: "4",
//       name: "UI Wireframes",
//       thumbnail:
//         "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
//       collaborators: 4,
//       lastModified: "1 week ago",
//       isOwner: true,
//       status: "archived",
//     },
//     {
//       id: "5",
//       name: "Marketing Illustrations",
//       thumbnail:
//         "https://images.pexels.com/photos/1070527/pexels-photo-1070527.jpeg?auto=compress&cs=tinysrgb&w=400",
//       collaborators: 6,
//       lastModified: "2 weeks ago",
//       isOwner: false,
//       status: "active",
//     },
//     {
//       id: "6",
//       name: "Product Mockups",
//       thumbnail:
//         "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400",
//       collaborators: 3,
//       lastModified: "3 weeks ago",
//       isOwner: true,
//       status: "archived",
//     },
//   ]);

//   const filteredRooms = rooms.filter((room) => {
//     const matchesSearch = room.name
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     const matchesFilter =
//       filterStatus === "all" || room.status === filterStatus;
//     return matchesSearch && matchesFilter;
//   });

//   const handleCreateRoom = () => {
//     // Handle room creation
//     console.log("Create new room");
//   };

//   const handleRoomAction = (action: string, roomId: string) => {
//     console.log(`${action} room:`, roomId);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
//                 <Palette className="w-5 h-5 text-white" />
//               </div>
//               <span className="text-xl font-bold text-gray-900">
//                 DrawTogether
//               </span>
//             </div>
//
//             {/* User Menu */}
//             <div className="flex items-center space-x-4">
//               <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
//                 <Bell className="w-5 h-5" />
//               </button>
//               <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
//                 <Settings className="w-5 h-5" />
//               </button>
//               <div className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
//                   <User className="w-4 h-4 text-white" />
//                 </div>
//                 <span className="text-sm font-medium text-gray-700">
//                   John Doe
//                 </span>
//               </div>
//               <button
//                 onClick={onBack}
//                 className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <LogOut className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>
//
//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Page Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             My Drawing Rooms
//           </h1>
//           <p className="text-gray-600">
//             Manage and access all your collaborative drawing spaces
//           </p>
//         </div>
//
//         {/* Controls Bar */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-8">
//           {/* Search */}
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search rooms..."
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//
//           {/* Filter */}
//           <div className="relative">
//             <select
//               className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               value={filterStatus}
//               onChange={(e) =>
//                 setFilterStatus(e.target.value as "all" | "active" | "archived")
//               }
//             >
//               <option value="all">All Rooms</option>
//               <option value="active">Active</option>
//               <option value="archived">Archived</option>
//             </select>
//             <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//           </div>
//
//           {/* View Toggle */}
//           <div className="flex bg-gray-100 rounded-lg p-1">
//             <button
//               onClick={() => setViewMode("grid")}
//               className={`p-2 rounded-md transition-colors ${
//                 viewMode === "grid"
//                   ? "bg-white text-purple-600 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <Grid3X3 className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => setViewMode("list")}
//               className={`p-2 rounded-md transition-colors ${
//                 viewMode === "list"
//                   ? "bg-white text-purple-600 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <List className="w-4 h-4" />
//             </button>
//           </div>
//
//           {/* Create Room Button */}
//           <button
//             onClick={handleCreateRoom}
//             className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
//           >
//             <Plus className="w-5 h-5" />
//             <span>New Room</span>
//           </button>
//         </div>
//
//         {/* Rooms Grid/List */}
//         {filteredRooms.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Palette className="w-12 h-12 text-gray-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">
//               No rooms found
//             </h3>
//             <p className="text-gray-600 mb-6">
//               {searchQuery
//                 ? "Try adjusting your search terms"
//                 : "Create your first drawing room to get started"}
//             </p>
//             <button
//               onClick={handleCreateRoom}
//               className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
//             >
//               Create Your First Room
//             </button>
//           </div>
//         ) : (
//           <div
//             className={
//               viewMode === "grid"
//                 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//                 : "space-y-4"
//             }
//           >
//             {filteredRooms.map((room) => (
//               <div
//                 key={room.id}
//                 className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 group ${
//                   viewMode === "list"
//                     ? "flex items-center p-4"
//                     : "overflow-hidden"
//                 }`}
//               >
//                 {viewMode === "grid" ? (
//                   <>
//                     {/* Thumbnail */}
//                     <div className="relative h-48 bg-gray-100">
//                       <img
//                         src={room.thumbnail}
//                         alt={room.name}
//                         className="w-full h-full object-cover"
//                       />
//                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
//                       <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                         <div className="relative">
//                           <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
//                             <MoreVertical className="w-4 h-4 text-gray-700" />
//                           </button>
//                         </div>
//                       </div>
//                       {room.status === "archived" && (
//                         <div className="absolute top-3 left-3">
//                           <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
//                             Archived
//                           </span>
//                         </div>
//                       )}
//                     </div>
//
//                     {/* Content */}
//                     <div className="p-4">
//                       <h3 className="font-semibold text-gray-900 mb-2 truncate">
//                         {room.name}
//                       </h3>
//                       <div className="flex items-center justify-between text-sm text-gray-600">
//                         <div className="flex items-center space-x-1">
//                           <Users className="w-4 h-4" />
//                           <span>{room.collaborators}</span>
//                         </div>
//                         <div className="flex items-center space-x-1">
//                           <Clock className="w-4 h-4" />
//                           <span>{room.lastModified}</span>
//                         </div>
//                       </div>
//                       <div className="mt-3 flex items-center justify-between">
//                         <span
//                           className={`text-xs px-2 py-1 rounded-full ${
//                             room.isOwner
//                               ? "bg-purple-100 text-purple-700"
//                               : "bg-blue-100 text-blue-700"
//                           }`}
//                         >
//                           {room.isOwner ? "Owner" : "Collaborator"}
//                         </span>
//                         <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
//                           Open →
//                         </button>
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     {/* List View */}
//                     <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mr-4">
//                       <img
//                         src={room.thumbnail}
//                         alt={room.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between">
//                         <h3 className="font-semibold text-gray-900 truncate">
//                           {room.name}
//                         </h3>
//                         <div className="flex items-center space-x-2 ml-4">
//                           <button
//                             onClick={() => handleRoomAction("view", room.id)}
//                             className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleRoomAction("edit", room.id)}
//                             className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
//                           >
//                             <Edit3 className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleRoomAction("share", room.id)}
//                             className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                           >
//                             <Share2 className="w-4 h-4" />
//                           </button>
//                           {room.isOwner && (
//                             <button
//                               onClick={() =>
//                                 handleRoomAction("delete", room.id)
//                               }
//                               className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
//                         <div className="flex items-center space-x-1">
//                           <Users className="w-4 h-4" />
//                           <span>{room.collaborators} collaborators</span>
//                         </div>
//                         <div className="flex items-center space-x-1">
//                           <Clock className="w-4 h-4" />
//                           <span>{room.lastModified}</span>
//                         </div>
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs ${
//                             room.isOwner
//                               ? "bg-purple-100 text-purple-700"
//                               : "bg-blue-100 text-blue-700"
//                           }`}
//                         >
//                           {room.isOwner ? "Owner" : "Collaborator"}
//                         </span>
//                         {room.status === "archived" && (
//                           <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
//                             Archived
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Dashboard;
