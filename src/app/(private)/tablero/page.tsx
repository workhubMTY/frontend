"use client";

import { useDashboard } from "../../features/tablero/hooks/useDashboard";
import { DashboardSelect } from "../../features/tablero/components/DashboardSelect";
import { SearchBar } from "../../features/tablero/components/SearchBar";
import { UserList } from "../../features/tablero/components/UserList";
import { ReservationsList } from "../../features/tablero/components/ReservationsList";
import { FriendshipsModal } from "../../features/tablero/components/FriendshipsModal";

const SEARCH_PLACEHOLDER: Record<string, string> = {
  users: "Buscar por nombre, email o ID...",
  reservations: "Buscar por usuario, ID o estado...",
  friends: "Buscar amigo...",
};

const SUBTITLES: Record<string, string> = {
  users: "Selecciona un usuario para ver sus amistades",
  reservations: "Reservaciones activas en el sistema",
  friends: "Red de conexiones entre usuarios",
};

export default function TableroPage() {
  const {
    activeView,
    setActiveView,
    search,
    setSearch,
    users,
    usersLoading,
    usersError,
    parkingReservations,
    reservationsLoading,
    reservationsError,
    selectedUser,
    friendships,
    friendshipsLoading,
    openUserModal,
    closeUserModal,
  } = useDashboard();

  return (
    <section className="flex h-full w-full flex-col overflow-hidden bg-background-page">
      <div className="max-w-[2000px] mx-auto w-full h-full flex flex-col box-border px-6 pt-4 pb-6 sm:px-6 lg:px-12">
        <header className="space-y-1 py-4">
          <h1 className="text-lg font-semibold tracking-tight text-slate-950 md:text-4xl">
            Tablero
          </h1>
          <p className="text-xs text-slate-500 md:text-base">
            {SUBTITLES[activeView]}
          </p>
        </header>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <DashboardSelect value={activeView} onChange={setActiveView} />
          <div className="sm:max-w-xs w-full">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder={SEARCH_PLACEHOLDER[activeView]}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeView === "users" && (
            <div className="max-w-2xl">
              <UserList
                users={users}
                loading={usersLoading}
                error={usersError}
                search={search}
                onUserClick={openUserModal}
              />
            </div>
          )}

          {activeView === "reservations" && (
            <ReservationsList
              parkingReservations={parkingReservations}
              loading={reservationsLoading}
              error={reservationsError}
              search={search}
            />
          )}
        </div>
      </div>

      {selectedUser && (
        <FriendshipsModal
          user={selectedUser}
          friendships={friendships}
          loading={friendshipsLoading}
          onClose={closeUserModal}
        />
      )}
    </section>
  );
}