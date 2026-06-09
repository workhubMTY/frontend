"use client";

import { useDashboard } from "../../features/tablero/hooks/useDashboard";
import { useStats } from "../../features/tablero/hooks/useStats";
import { DashboardSelect } from "../../features/tablero/components/DashboardSelect";
import { SearchBar } from "../../features/tablero/components/SearchBar";
import { UserList } from "../../features/tablero/components/UserList";
import { ReservationsList } from "../../features/tablero/components/ReservationsList";
import { FriendshipsPanel } from "../../features/tablero/components/FriendshipsPanel";
import { StatsView } from "../../features/tablero/components/statsView";

const SEARCH_PLACEHOLDER: Record<string, string> = {
    users: "Buscar por nombre, email o ID...",
    reservations: "Buscar por usuario, cubículo o estado...",
    stats: "",
};

const SUBTITLES: Record<string, string> = {
    users: "Selecciona un usuario para ver sus amistades",
    reservations: "Reservaciones activas en el sistema",
    stats: "Estadísticas globales de asistencia y reservaciones",
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
        officeReservations,
        reservationsLoading,
        reservationsError,
        selectedUser,
        friendships,
        friendshipsLoading,
        openUserModal,
        closeUserModal,
    } = useDashboard();

    const {
        period, setPeriod,
        from, setFrom,
        to, setTo,
        globalAttendance, globalAttendanceLoading, globalAttendanceError,
        globalReservations, globalReservationsLoading, globalReservationsError,
        topUsers, topUsersLoading, topUsersError,
        exporting, handleExport,
        refetch,
    } = useStats();

    return (
        <section className="flex h-full w-full flex-col overflow-hidden bg-background-page">
            <div className="max-w-[2000px] mx-auto w-full h-full flex flex-col box-border px-6 pt-4 pb-6 sm:px-6 lg:px-12">

                {/* Header */}
                <header className="space-y-1 py-4">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                        Tablero
                    </h1>
                    <p className="text-sm text-slate-500 md:text-base">
                        {SUBTITLES[activeView]}
                    </p>
                </header>

                {/* Controles */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                    <DashboardSelect value={activeView} onChange={setActiveView} />
                    {activeView !== "stats" && (
                        <div className="sm:max-w-xs w-full">
                            <SearchBar
                                value={search}
                                onChange={setSearch}
                                placeholder={SEARCH_PLACEHOLDER[activeView]}
                            />
                        </div>
                    )}
                </div>

                {/* Área de contenido */}
                <div className="flex-1 overflow-y-auto min-h-0">

                    {/* Usuarios */}
                    {activeView === "users" && (
                        <div className="flex gap-4 h-full items-start">
                            <div className="flex-[3] min-w-0">
                                <UserList
                                    users={users}
                                    loading={usersLoading}
                                    error={usersError}
                                    search={search}
                                    selectedUser={selectedUser}
                                    onUserClick={openUserModal}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <FriendshipsPanel
                                    user={selectedUser}
                                    friendships={friendships}
                                    loading={friendshipsLoading}
                                    onClose={closeUserModal}
                                />
                            </div>
                        </div>
                    )}

                    {/* Reservaciones */}
                    {activeView === "reservations" && (
                        <ReservationsList
                            parkingReservations={parkingReservations}
                            officeReservations={officeReservations}
                            loading={reservationsLoading}
                            error={reservationsError}
                            search={search}
                        />
                    )}

                    {/* Estadísticas */}
                    {activeView === "stats" && (
                        <StatsView
                            period={period}
                            onPeriodChange={setPeriod}
                            from={from}
                            to={to}
                            onFromChange={setFrom}
                            onToChange={setTo}
                            onApply={refetch}
                            onExport={handleExport}
                            exporting={exporting}
                            globalAttendance={globalAttendance}
                            globalAttendanceLoading={globalAttendanceLoading}
                            globalAttendanceError={globalAttendanceError}
                            globalReservations={globalReservations}
                            globalReservationsLoading={globalReservationsLoading}
                            globalReservationsError={globalReservationsError}
                            topUsers={topUsers}
                            topUsersLoading={topUsersLoading}
                            topUsersError={topUsersError}
                        />
                    )}

                </div>
            </div>
        </section>
    );
}