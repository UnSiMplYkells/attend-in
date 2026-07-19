/* eslint-disable no-unused-vars */
"use client";

import {
  createGeneralEvent,
  getGeneralEvents,
  getGeneralRecords,
  toggleEventStatus,
  getEventDetails,
  getEventAttendees,
  registerGeneralAttendee,
} from "@/lib/server/generalEvents";

import { useUser } from "./useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export function useCreateGeneralEvent() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: (eventName) => createGeneralEvent(eventName, user.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["generalEvents", user.id]);
      queryClient.invalidateQueries(["generalRecords", user.id]);
    },
  });
}

export function useToggleEventStatus() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: ({ eventId, isActive }) => toggleEventStatus(eventId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries(["generalEvents", user.id]);
      queryClient.invalidateQueries(["generalRecords", user.id]);
    },
  });
}

export function useGetGeneralEvents() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["generalEvents", user?.id],
    queryFn: () => getGeneralEvents(user.id),
    enabled: !!user,
  });
}

export function useGetGeneralRecords() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["generalRecords", user?.id],
    queryFn: () => getGeneralRecords(user.id),
    enabled: !!user,
  });
}

export function useGetEventDetails(eventId) {
  return useQuery({
    queryKey: ["eventDetails", eventId],
    queryFn: () => getEventDetails(eventId),
    enabled: !!eventId,
  });
}

export function useGetEventAttendees(eventId) {
  return useQuery({
    queryKey: ["eventAttendees", eventId],
    queryFn: () => getEventAttendees(eventId),
    enabled: !!eventId,
  });
}

export function useRegisterGeneralAttendee() {
  return useMutation({
    mutationFn: (data) => registerGeneralAttendee(data.eventId, data.name, data.deviceId),
  });
}
