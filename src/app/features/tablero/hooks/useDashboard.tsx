"use client";

import { useState, useEffect } from "react";
import { listParkingReservations, listOfficeReservations, listUsers } from "../data/api";
import type {
  ParkingReservations,
  OfficeReservations,
  Users,
  Friendships,
} from "../data/types";

export type DashboardView = "users" | "reservations" | "stats";

export function useDashboard() {
  const [activeView, setActiveView] = useState<DashboardView>("users");
  const [search, setSearch] = useState("");

  // Users
  const [users, setUsers] = useState<Users[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Reservations
  const [parkingReservations, setParkingReservations] = useState<ParkingReservations[]>([]);
  const [officeReservations, setOfficeReservations] = useState<OfficeReservations[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [reservationsError, setReservationsError] = useState<string | null>(null);

  // Modal amistades
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
      .then((data: any) => setUsers(Array.isArray(data) ? data : (data?.items ?? [])))
      .catch(() => setUsersError("Error al cargar usuarios"))
      .finally(() => setUsersLoading(false));
  }, [activeView]);

  useEffect(() => {
    if (activeView !== "reservations") return;
    setReservationsLoading(true);
    setReservationsError(null);

    Promise.all([
      listParkingReservations
        .getparkingReservations()
        .then((data: any) => Array.isArray(data) ? data : (data?.items ?? [])),
      listOfficeReservations
        .getOfficeReservations()
        .then((data: any) => {
            console.log("OFFICE RAW:", data);
            return Array.isArray(data) ? data : (data?.items ?? [])}),
    ])
      .then(([parking, office]) => {
        setParkingReservations(parking);
        setOfficeReservations(office);
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
      setFriendships(Array.isArray(data) ? data : (data?.items ?? []));
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
    officeReservations,
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