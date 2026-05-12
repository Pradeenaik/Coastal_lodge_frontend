import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import api from "../lib/api";
import toast from "react-hot-toast";
import { Room, DaySummary, ApiRoom } from "../types/room";

const NUM_ROOMS = 16;

export function createDefaultRooms(): Room[] {
  return Array.from({ length: NUM_ROOMS }, (_, i) => ({
    roomNumber: i + 1,
    amount: 0,
    commission: 0,
    commissionType: "" as const,
  }));
}

export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function useDashboard() {
  const [date, setDate] = useState<string>(getToday());
  const [rooms, setRooms] = useState<Room[]>(createDefaultRooms());
  const [days, setDays] = useState<DaySummary[]>([]);
  const [overallTotal, setOverallTotal] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loadingDay, setLoadingDay] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isExistingDay, setIsExistingDay] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const totalAmount = useMemo(
    () => rooms.reduce((sum, r) => sum + (r.amount || 0), 0),
    [rooms]
  );
  const totalCommission = useMemo(
    () => rooms.reduce((sum, r) => sum + (r.commission || 0), 0),
    [rooms]
  );
  const netTotal = useMemo(
    () => totalAmount - totalCommission,
    [totalAmount, totalCommission]
  );

  const fetchSummary = useCallback(async (): Promise<DaySummary[]> => {
    setLoadingHistory(true);
    try {
      const { data } = await api.get<{ days: DaySummary[]; overallTotal: number }>(
        "/summary"
      );
      const fetchedDays = data.days || [];
      setDays(fetchedDays);
      setOverallTotal(data.overallTotal || 0);
      return fetchedDays;
    } catch {
      return [];
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const loadDayData = useCallback(async (selectedDate: string) => {
    setLoadingDay(true);
    setIsEditMode(false);
    try {
      const { data } = await api.get<{ days: DaySummary[]; overallTotal: number }>(
        "/summary"
      );
      const fetchedDays = data.days || [];
      setDays(fetchedDays);
      setOverallTotal(data.overallTotal || 0);

      const matched = fetchedDays.find((d) => d.date === selectedDate);

      if (matched && matched.rooms && matched.rooms.length > 0) {
        const merged = createDefaultRooms().map((defaultRoom) => {
          const backendRoom = matched.rooms.find(
            (r: ApiRoom) => r.roomNumber === defaultRoom.roomNumber
          );
          if (backendRoom) {
            // const commissionType =
            //   backendRoom.commission === 200
            //     ? "Driver"
            //     : backendRoom.commission > 0
            //     ? "Custom"
            //     : "";
            return {
              roomNumber: backendRoom.roomNumber,
              amount: backendRoom.amount,
              commission: backendRoom.commission,
              commissionType: backendRoom.commissionType as Room["commissionType"],
            };
          }
          return defaultRoom;
        });
        setRooms(merged);
        setIsExistingDay(true);
      } else {
        setRooms(createDefaultRooms());
        setIsExistingDay(false);
      }
    } catch {
      setRooms(createDefaultRooms());
      setIsExistingDay(false);
    } finally {
      setLoadingDay(false);
    }
  }, []);

  // On mount load today
  useEffect(() => {
    loadDayData(getToday());
  }, [loadDayData]);

  const handleDateChange = useCallback(
    (newDate: string) => {
      setDate(newDate);
      loadDayData(newDate);
    },
    [loadDayData]
  );

  const handleRoomChange = useCallback((updated: Room) => {
    setRooms((prev) =>
      prev.map((r) => (r.roomNumber === updated.roomNumber ? updated : r))
    );
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const toastId = toast.loading("Saving day data…");
    try {
      await api.post("/day", { date, rooms });
      toast.success("Day saved successfully!", { id: toastId });
      setIsExistingDay(true);
      setIsEditMode(false);
      await fetchSummary();
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to save. Please try again.";
      toast.error(msg, { id: toastId });
    } finally {
      setSaving(false);
    }
  }, [date, rooms, fetchSummary]);

  const handleClearHistory = useCallback(async () => {
    const toastId = toast.loading("Clearing history…");
    try {
      await api.delete("/history");
      toast.success("History cleared successfully!", { id: toastId });
      setDays([]);
      setOverallTotal(0);
      setIsExistingDay(false);
      setRooms(createDefaultRooms());
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to clear history.";
      toast.error(msg, { id: toastId });
    }
  }, []);

  const handleCancelEdit = useCallback(() => {
    loadDayData(date);
  }, [date, loadDayData]);

  return {
    // state
    date, rooms, days, overallTotal,
    saving, loadingDay, loadingHistory,
    isExistingDay, isEditMode,
    // derived
    totalAmount, totalCommission, netTotal,
    occupiedCount: rooms.filter((r) => r.amount > 0).length,
    isReadOnly: isExistingDay && !isEditMode,
    // actions
    handleDateChange,
    handleRoomChange,
    handleSave,
    handleClearHistory,
    handleCancelEdit,
    setIsEditMode,
    fetchSummary,
    loadDayData,
    setDate,
  };
}