"use client";

import { useState, useEffect } from "react";
import { listParkingReservations, listUsers } from "../data/api";
import type {
  ParkingReservations,
  ParkingReservationData,
  Users,
  Friendships,
} from "../data/types";

export type DashboardView = "users" | "reservations" | "friends";

export function useDashboard() {
  const [activeView, setActiveView] = useState<DashboardView>("users");
  const [search, setSearch] = useState("");

  // Users
  const [users, setUsers] = useState<Users[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Parking reservations
  const [parkingReservations, setParkingReservations] = useState<ParkingReservations[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [reservationsError, setReservationsError] = useState<string | null>(null);

  // Modal — amistades del usuario seleccionado
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [friendships, setFriendships] = useState<Friendships[]>([]);
  const [friendshipsLoading, setFriendshipsLoading] = useState(false);

  // Friends view
  const [friends, setFriends] = useState<Friendships[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [friendsError, setFriendsError] = useState<string | null>(null);

  const handleSetActiveView = (view: DashboardView) => {
    setSearch("");
    setActiveView(view);
  };

  useEffect(() => {
    if (activeView !== "users") return;
    setUsersLoading(true);
    setUsersError(null);
    listUsers
      .getUsers()
      .then((data: any) => {
        const list = Array.isArray(data) ? data : (data?.items ?? []);
        setUsers(list);
      })
      .catch(() => setUsersError("Error al cargar usuarios"))
      .finally(() => setUsersLoading(false));
  }, [activeView]);

  useEffect(() => {
    if (activeView !== "reservations") return;
    setReservationsLoading(true);
    setReservationsError(null);
    listParkingReservations
      .getparkingReservations()
      .then((data: any) => {
        const list = Array.isArray(data) ? data : (data?.items ?? []);
        setParkingReservations(list);
      })
      .catch(() => setReservationsError("Error al cargar reservaciones"))
      .finally(() => setReservationsLoading(false));
  }, [activeView]);

  const openUserModal = async (user: Users) => {
    setSelectedUser(user);
    setFriendshipsLoading(true);
    setFriendships([]);
    try {
      const data: any = await listUsers.getUsersFriendships(user.eId);
      const list = Array.isArray(data) ? data : (data?.items ?? []);
      setFriendships(list);
    } catch {
      setFriendships([]);
    } finally {
      setFriendshipsLoading(false);
    }
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setFriendships([]);
  };

  return {
    activeView,
    setActiveView: handleSetActiveView,
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
    friends,
    friendsLoading,
    friendsError,
  };
}