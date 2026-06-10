"use client";

import { useMemo, useState } from "react";

import { useAuth } from "@/app/shared/auth/useAuth";

import { useFriends } from "@/app/shared/data/friendships/hooks";

import { useUserTimeline } from "@/app/features/reservaciones/crear/data/hooks";
import { timelineToScheduleItems } from "@/app/features/reservaciones/crear/data/myScheduleMappers";
import { groupScheduleItemsByDate } from "@/app/features/reservaciones/crear/data/api";

import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";
import type {
  HomeAgendaFilter,
  HomeAgendaOwner,
  HomeAgendaViewMode,
} from "../types/homeAgenda";

import {
  addDays,
  clampDate,
  filterHomeAgendaItems,
  getDaysBetween,
  getHomeAgendaQuery,
  getMondayOfWeek,
  startOfLocalDay,
  toDateId,
} from "../lib/homeAgenda";

  // import { useUpdateAgendaItem } from "../data/hooks/useUpdateAgendaItem";

const VISIBLE_DAYS = 5;
const MAX_DAYS_FROM_TODAY = 21;

export function useHomeAgendaViewModel() {
  const { user } = useAuth();

  const myUserId = user?.eId ? String(user.eId) : null;

  const friendsQuery = useFriends();

  // const updateAgendaItemMutation = useUpdateAgendaItem();

  const today = useMemo(() => startOfLocalDay(new Date()), []);

  const maxAllowedDate = useMemo(
    () => addDays(today, MAX_DAYS_FROM_TODAY),
    [today],
  );

  const firstVisibleWeekStart = useMemo(() => getMondayOfWeek(today), [today]);

  const lastVisibleWeekStart = useMemo(
    () => getMondayOfWeek(maxAllowedDate),
    [maxAllowedDate],
  );

  const [windowStartDate, setWindowStartDate] = useState(firstVisibleWeekStart);
  const [activeFilter, setActiveFilter] = useState<HomeAgendaFilter>("all");
  const [viewMode, setViewMode] = useState<HomeAgendaViewMode>("agenda");

  /**
   * null significa "yo".
   * Lo hacemos así para no depender de que user exista desde el primer render.
   */
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  const friends = useMemo(() => friendsQuery.data ?? [], [friendsQuery.data]);

  const selectedUserId = selectedFriendId ?? myUserId;

  const selectedOwner = useMemo<HomeAgendaOwner | null>(() => {
    if (!selectedUserId) return null;

    if (!selectedFriendId) {
      return {
        kind: "me",
        eId: selectedUserId,
        name: user?.name ?? "Mi agenda",
        raw: user,
      };
    }

    const selectedFriend = friends.find(
      (friend) => String(friend.eId) === selectedFriendId,
    );

    if (!selectedFriend) return null;

    return {
      kind: "friend",
      eId: String(selectedFriend.eId),
      name: selectedFriend.name,
      raw: selectedFriend,
    };
  }, [selectedUserId, selectedFriendId, user, friends]);

  const agendaOwners = useMemo<HomeAgendaOwner[]>(() => {
    const owners: HomeAgendaOwner[] = [];

    if (myUserId) {
      owners.push({
        kind: "me",
        eId: myUserId,
        name: user?.name ?? "Mi agenda",
        raw: user,
      });
    }

    for (const friend of friends) {
      owners.push({
        kind: "friend",
        eId: String(friend.eId),
        name: friend.name,
        raw: friend,
      });
    }

    return owners;
  }, [myUserId, user, friends]);

  const visibleDays = useMemo(
    () => getDaysBetween(windowStartDate, VISIBLE_DAYS),
    [windowStartDate],
  );

  /**
   * La consulta siempre es hoy → hoy + 21 días exactos.
   */
  const queryRange = useMemo(() => {
    return {
      from: today,
      to: maxAllowedDate,
    };
  }, [today, maxAllowedDate]);

  const timelineQuery = useMemo(
    () =>
      getHomeAgendaQuery({
        from: queryRange.from,
        to: queryRange.to,
        filter: activeFilter,
      }),
    [queryRange, activeFilter],
  );

  /**
   * Esta es la parte importante:
   * si seleccionas amigo, el timeline se pide con su eId.
   */
  const timelineQueryResult = useUserTimeline(selectedUserId, timelineQuery, {
    enabled: Boolean(selectedUserId),
  });

  const timeline = timelineQueryResult.data ?? null;

  const rawScheduleItems = useMemo<ScheduleItem[]>(() => {
    if (!timeline) return [];

    return timelineToScheduleItems({
      officeReservations: timeline.user.officeReservations ?? [],
      parkingReservations: timeline.user.parkingReservations ?? [],
      events: timeline.user.events ?? [],
    });
  }, [timeline]);

  const scheduleItems = useMemo(() => {
    return filterHomeAgendaItems(rawScheduleItems, activeFilter).filter(
      (item) =>
        item.dateId >= toDateId(today) &&
        item.dateId <= toDateId(maxAllowedDate),
    );
  }, [rawScheduleItems, activeFilter, today, maxAllowedDate]);

  const scheduleItemsByDate = useMemo(
    () => groupScheduleItemsByDate(scheduleItems),
    [scheduleItems],
  );

  const visibleScheduleItemsByDate = useMemo(() => {
    return visibleDays.reduce<Record<string, ScheduleItem[]>>((acc, day) => {
      const isInsideAllowedRange =
        day.id >= toDateId(today) && day.id <= toDateId(maxAllowedDate);

      acc[day.id] = isInsideAllowedRange
        ? scheduleItemsByDate[day.id] ?? []
        : [];

      return acc;
    }, {});
  }, [visibleDays, scheduleItemsByDate, today, maxAllowedDate]);

  const disabledDateIds = useMemo(() => {
    return visibleDays
      .filter(
        (day) => day.id < toDateId(today) || day.id > toDateId(maxAllowedDate),
      )
      .map((day) => day.id);
  }, [visibleDays, today, maxAllowedDate]);

  const canGoPrevious = windowStartDate > firstVisibleWeekStart;
  const canGoNext = windowStartDate < lastVisibleWeekStart;

  function goPrevious() {
    setWindowStartDate((current) =>
      clampDate(
        addDays(current, -7),
        firstVisibleWeekStart,
        lastVisibleWeekStart,
      ),
    );
  }

  function goNext() {
    setWindowStartDate((current) =>
      clampDate(
        addDays(current, 7),
        firstVisibleWeekStart,
        lastVisibleWeekStart,
      ),
    );
  }

  function goToday() {
    setWindowStartDate(firstVisibleWeekStart);
  }

  function setFilter(filter: HomeAgendaFilter) {
    setActiveFilter(filter);
  }

  function selectMe() {
    setSelectedFriendId(null);
  }

  function selectFriend(friendId: string) {
    setSelectedFriendId(friendId);
  }

  function selectOwner(ownerId: string) {
    if (ownerId === myUserId) {
      selectMe();
      return;
    }

    selectFriend(ownerId);
  }

  // NUEVO
  // async function patchAgendaItem(
  //   item: ScheduleItem,
  //   values: {
  //     start: string;
  //     end: string;
  //   },
  // ) {
  //   await updateAgendaItemMutation.mutateAsync({
  //     item,
  //     start: values.start,
  //     end: values.end,
  //   });
  // }

  return {
    state: {
      user,

      myUserId,
      selectedUserId,
      selectedFriendId,
      selectedOwner,
      agendaOwners,

      friends,
      friendsIsLoading: friendsQuery.isLoading,
      friendsIsFetching: friendsQuery.isFetching,
      friendsError: friendsQuery.error,

      activeFilter,
      viewMode,

      today,
      maxAllowedDate,

      visibleDays,
      queryRange,

      timeline,

      scheduleItems,
      scheduleItemsByDate,
      visibleScheduleItemsByDate,
      disabledDateIds,

      canGoPrevious,
      canGoNext,

      // NUEVO
      // isUpdatingAgendaItem: updateAgendaItemMutation.isPending,

      isLoading: timelineQueryResult.isLoading || friendsQuery.isLoading,
      isFetching: timelineQueryResult.isFetching || friendsQuery.isFetching,
      error: timelineQueryResult.error ?? friendsQuery.error,
    },

    actions: {
      setFilter,
      setViewMode,

      selectMe,
      selectFriend,
      selectOwner,

      goPrevious,
      goNext,
      goToday,

      // NUEVO
      // patchAgendaItem,
    },
  };
}