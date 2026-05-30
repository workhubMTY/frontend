// "use client";

// import { useMemo, useState } from "react";
// import { User } from "../../types/profile";
// import { Check, Search, X } from "lucide-react";
// import { Avatar } from "./Avatar";
// import { EmptyUsersState } from "./EmptyUsersState";

// type UserMultiSelectProps = {
//   users: User[];
//   selectedUsers: User[];
//   onSelectedUsersChange: (users: User[]) => void;
//   placeholder?: string;
//   emptyTitle?: string;
//   emptyDescription?: string;
// };

// export function UserMultiSelect({
//   users,
//   selectedUsers,
//   onSelectedUsersChange,
//   placeholder = "Buscar por nombre, correo o rol",
//   emptyTitle = "Busca personas",
//   emptyDescription = "Escribe para encontrar usuarios.",
// }: UserMultiSelectProps) {
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredUsers = useMemo(() => {
//     const normalizedSearch = searchTerm.trim().toLowerCase();

//     if (!normalizedSearch) {
//       return selectedUsers;
//     }

//     return users.filter((user) => {
//       const isAlreadySelected = selectedUsers.some(
//         (selected) => selected.id === user.id,
//       );

//       if (isAlreadySelected) return false;

//       return (
//         user.name.toLowerCase().includes(normalizedSearch) ||
//         user.email.toLowerCase().includes(normalizedSearch) ||
//         user.role.toLowerCase().includes(normalizedSearch)
//       );
//     });
//   }, [users, selectedUsers, searchTerm]);

//   function handleToggleUser(user: User) {
//     const exists = selectedUsers.some((selected) => selected.id === user.id);

//     if (exists) {
//       onSelectedUsersChange(
//         selectedUsers.filter((selected) => selected.id !== user.id),
//       );
//       return;
//     }

//     onSelectedUsersChange([...selectedUsers, user]);
//   }

//   function handleRemoveUser(userId: string) {
//     onSelectedUsersChange(
//       selectedUsers.filter((selected) => selected.id !== userId),
//     );
//   }

//   return (
//     <div className="space-y-5">
//       <div>
//         <label className="text-sm font-semibold text-neutral-950">
//           Buscar personas
//         </label>

//         <div className="relative mt-3">
//           <Search
//             size={18}
//             className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
//           />

//           <input
//             value={searchTerm}
//             onChange={(event) => setSearchTerm(event.target.value)}
//             placeholder={placeholder}
//             className="h-11 w-full border border-neutral-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-purple-700 focus:ring-2 focus:ring-purple-100"
//           />
//         </div>
//       </div>

//       {selectedUsers.length > 0 && (
//         <div>
//           <p className="text-sm font-semibold text-neutral-950">
//             Personas seleccionadas
//           </p>

//           <div className="mt-3 flex flex-wrap gap-2">
//             {selectedUsers.map((user) => (
//               <span
//                 key={user.id}
//                 className="inline-flex h-8 items-center gap-2 bg-neutral-100 px-3 text-sm text-neutral-700"
//               >
//                 {user.name}

//                 <button
//                   type="button"
//                   onClick={() => handleRemoveUser(user.id)}
//                   className="text-neutral-500 transition hover:text-neutral-900"
//                   aria-label={`Quitar ${user.name}`}
//                 >
//                   <X size={14} />
//                 </button>
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       <div>
//         <div className="mb-3 flex items-center justify-between">
//           <p className="text-sm font-semibold text-neutral-950">Resultados</p>

//           <p className="text-xs text-neutral-500">
//             {selectedUsers.length} seleccionados
//           </p>
//         </div>

//         <div className="border border-neutral-200">
//           {filteredUsers.length > 0 ? (
//             <div className="max-h-[360px] overflow-y-auto divide-y divide-neutral-100">
//               {filteredUsers.map((user) => {
//                 const isSelected = selectedUsers.some(
//                   (selected) => selected.id === user.id,
//                 );

//                 return (
//                   <button
//                     key={user.id}
//                     type="button"
//                     onClick={() => handleToggleUser(user)}
//                     className={[
//                       "grid w-full grid-cols-[1fr_auto] items-center gap-4 px-4 py-4 text-left transition hover:bg-neutral-50",
//                       isSelected ? "bg-purple-50" : "",
//                     ].join(" ")}
//                   >
//                     <div className="flex min-w-0 items-center gap-3">
//                       <Avatar name={user.name} avatarUrl={user.avatarUrl} />

//                       <div className="min-w-0">
//                         <p className="truncate text-sm font-semibold text-neutral-950">
//                           {user.name}
//                         </p>

//                         <p className="truncate text-xs text-neutral-500">
//                           {user.email}
//                         </p>

//                         <p className="truncate text-xs text-neutral-400">
//                           {user.role}
//                         </p>
//                       </div>
//                     </div>

//                     {isSelected ? (
//                       <span className="inline-flex items-center gap-1 whitespace-nowrap bg-purple-700 px-3 py-1 text-xs font-medium text-white">
//                         <Check size={13} />
//                         Seleccionado
//                       </span>
//                     ) : (
//                       <span className="whitespace-nowrap border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
//                         Seleccionar
//                       </span>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//           ) : (
//             <EmptyUsersState
//               title={emptyTitle}
//               description={emptyDescription}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
