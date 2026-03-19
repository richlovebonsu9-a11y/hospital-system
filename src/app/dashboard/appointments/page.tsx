"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { supabase } from "@/lib/supabase";

export default function AppointmentCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*");

    if (!error && data) {
      const formattedEvents = data.map((appt: any) => ({
        id: appt.id,
        title: `Appointment: ${appt.doctor_id}`,
        start: appt.slot,
        allDay: false,
        backgroundColor: "#E53E3E",
        borderColor: "#C53030",
      }));
      setEvents(formattedEvents);
    }
    setLoading(false);
  };

  const handleDateClick = async (arg: any) => {
    const title = prompt("Enter Doctor Name/Specialty for this slot:");
    if (title) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("Please sign in to book appointments.");
            return;
        }

        const { error } = await supabase.from("appointments").insert({
            patient_id: user.id,
            doctor_id: title,
            slot: arg.dateStr,
            status: 'confirmed'
        });

        if (error) {
            alert("Error booking appointment: " + error.message);
        } else {
            fetchAppointments();
        }
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tight">Medical Appointments</h1>
                <p className="text-slate-400 text-sm mt-1 font-bold">Manage your doctor visits and specialist consultations.</p>
            </div>
            <div className="hidden md:flex gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    <span className="text-xs font-bold">Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    <span className="text-xs font-bold">Pending</span>
                </div>
            </div>
        </div>

        <div className="p-8">
          {loading ? (
             <div className="text-center py-20 font-bold text-gray-400">Loading Schedule...</div>
          ) : (
            <div className="premium-calendar">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={events}
                dateClick={handleDateClick}
                height="auto"
                editable={true}
                selectable={true}
                eventColor="#E53E3E"
              />
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .premium-calendar .fc {
          font-family: inherit;
        }
        .premium-calendar .fc-toolbar-title {
          font-weight: 900;
          text-transform: uppercase;
          font-size: 1.25rem !important;
          color: #1e293b;
        }
        .premium-calendar .fc-button {
          background-color: #f8fafc !important;
          border-color: #e2e8f0 !important;
          color: #1e293b !important;
          text-transform: uppercase;
          font-weight: 700;
          font-size: 0.75rem;
          transition: all 0.2s;
        }
        .premium-calendar .fc-button-primary:not(:disabled).fc-button-active,
        .premium-calendar .fc-button-primary:not(:disabled):active {
          background-color: #ef4444 !important;
          color: white !important;
          border-color: #ef4444 !important;
        }
      `}</style>
    </div>
  );
}
