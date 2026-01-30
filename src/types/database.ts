export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      alumni: {
        Row: {
          id: string;
          email: string;
          name: string;
          auth_user_id: string | null;
          google_access_token: string | null;
          google_refresh_token: string | null;
          google_calendar_id: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          auth_user_id?: string | null;
          google_access_token?: string | null;
          google_refresh_token?: string | null;
          google_calendar_id?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          auth_user_id?: string | null;
          google_access_token?: string | null;
          google_refresh_token?: string | null;
          google_calendar_id?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      availability_slots: {
        Row: {
          id: string;
          alumni_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_recurring: boolean;
          specific_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          alumni_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_recurring?: boolean;
          specific_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          alumni_id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          is_recurring?: boolean;
          specific_date?: string | null;
          created_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          slot_id: string;
          alumni_id: string;
          student_email: string;
          student_name: string | null;
          student_linkedin: string | null;
          student_notes: string | null;
          session_date: string;
          start_time: string;
          end_time: string;
          google_event_id: string | null;
          meeting_link: string | null;
          management_token: string | null;
          verification_token: string | null;
          status: "pending" | "confirmed" | "cancelled" | "completed";
          cancelled_at: string | null;
          cancellation_reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slot_id: string;
          alumni_id: string;
          student_email: string;
          student_name?: string | null;
          student_linkedin?: string | null;
          student_notes?: string | null;
          session_date: string;
          start_time: string;
          end_time: string;
          google_event_id?: string | null;
          meeting_link?: string | null;
          management_token?: string | null;
          verification_token?: string | null;
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slot_id?: string;
          alumni_id?: string;
          student_email?: string;
          student_name?: string | null;
          student_linkedin?: string | null;
          student_notes?: string | null;
          session_date?: string;
          start_time?: string;
          end_time?: string;
          google_event_id?: string | null;
          meeting_link?: string | null;
          management_token?: string | null;
          verification_token?: string | null;
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
        };
      };
      invite_tokens: {
        Row: {
          id: string;
          token: string;
          created_by: string | null;
          used_by: string | null;
          used_at: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          token: string;
          created_by?: string | null;
          used_by?: string | null;
          used_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          token?: string;
          created_by?: string | null;
          used_by?: string | null;
          used_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

export type Alumni = Database["public"]["Tables"]["alumni"]["Row"];
export type AvailabilitySlot = Database["public"]["Tables"]["availability_slots"]["Row"];
export type Session = Database["public"]["Tables"]["sessions"]["Row"];

export interface AvailableSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  slot_id: string;
  alumni_id: string;
}

export interface InviteToken {
  id: string;
  token: string;
  created_by: string | null;
  used_by: string | null;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
}
