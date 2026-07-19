/* eslint-disable consistent-return */
"use server";

import { createClient } from "@/app/utils/supabase/server";

// C-UD operations

export async function createGeneralEvent(eventName, creatorId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("general_events")
    .insert(
      { 
        event_name: eventName, 
        creator_id: creatorId, 
        is_active: "TRUE" 
      })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating general event:", error);
    throw new Error("Failed to create event.");
  }

  return data.id;
}

export async function toggleEventStatus(eventId, isActive) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("general_events")
    .update({ is_active: isActive })
    .eq("id", eventId);

  if (error) {
    console.error("Error updating event status:", error);
    throw new Error("Failed to update event status.");
  }

  return true;
}


// R operations

export async function getGeneralEvents(creatorId) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("general_events")
      .select("*")
      .eq("creator_id", creatorId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });
  

  if (error) {
    console.error("Error fetching general events:", error);
    throw new Error("Could not fetch active events.");
  }

  return data;
}

export async function getGeneralRecords(creatorId) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("general_events")
      .select("*")
      .eq("creator_id", creatorId)
      .order("created_at", { ascending: false });
  

  if (error) {
    console.error("Error fetching general records:", error);
    throw new Error("Could not fetch records.");
  }

  return data;
}


export async function getEventDetails(eventId) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("general_events")
      .select("*")
      .eq("id", eventId)
      .single();
  

  if (error) {
    console.error("Error fetching event details:", error);
    throw new Error("Could not fetch event details.");
  }

  return data;
}

export async function getEventAttendees(eventId) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("general_attendees")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });
  

  if (error) {
    console.error("Error fetching event attendees:", error);
    throw new Error("Could not fetch event attendees.");
  }

  return data;
}


// to be sorted out later
export async function registerGeneralAttendee(eventId, name, deviceId) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("general_attendees")
      .insert({ event_id: eventId, name, device_id: deviceId });

    if (error) {
      if (error.code === "23505") {
        throw new Error("You have already checked in for this event.");
      }
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error("Error registering general attendee:", error);
    throw error;
  }
}

export async function setGeneralAtdRecord(eventId, userId, name) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('general_attendees')
        .insert({ event_id: eventId, user_id: userId, name: name });

    if (error) {
        console.error('Error setting general attendance record:', error);
        throw new Error('Failed to set general attendance record.');
    }

    return data;
}
