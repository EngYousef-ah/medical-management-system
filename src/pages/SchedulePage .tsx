import { useState, useContext, useMemo } from "react";

import type { TypeAppointment } from "@/types/TypeAppointment";

import { AppointmentContext } from "@/contexts/AppointmentContext";
import { PatientContext } from "@/contexts/PatientContext";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const hours = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];




export default function SchedulePage() {

  const { appointments } = useContext(AppointmentContext)!;
  const { patients } = useContext(PatientContext)!
  const [selectedDate, setSelectedDate] = useState("2026-03-04");

  const user = (() => {
    try {
      const dataFromLocal = localStorage.getItem("user");
      if (!dataFromLocal) return { id: "", name: "", role: "" };

      const dataParsed = JSON.parse(dataFromLocal);

      return {
        id: dataParsed?.id ?? "",
        name: dataParsed?.name ?? "",
        role: dataParsed?.role ?? ""
      };
    } catch {
      return { id: "", name: "", role: "" };
    }
  })();

  function getName(id: string) {
    const data = patients.find((p) => {
      return p.id === id;
    })
    return data ? data.name : "";
  }





  const filteredAppointments = useMemo(() => {
    if (user.role === "doctor") {
      return appointments.filter((a: TypeAppointment) =>
        a.doctorId === user.id && a.date === selectedDate
      )
        .map((a) => ({ ...a, time24: a.time }));
    }
    else {
      return appointments.filter((a: TypeAppointment) =>
        a.date === selectedDate
      )
        .map((a) => ({ ...a, time24: a.time }));
    }

  }, [appointments, user, selectedDate]);




  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="outline-none"
          />
        </div>


      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {hours.map((hour) => (
          <div key={hour} className="flex border-b last:border-none">
            <div className="w-24 p-4 text-gray-500 border-r">
              {hour}
            </div>

            <div className="flex-1 p-2">
              {filteredAppointments
                .filter((a) => a.time24.startsWith(hour.slice(0, 2)))
                .map((item) => (
                  <div key={item.id} className="mb-2 bg-teal-100 text-gray-800 rounded-xl px-4 py-2" >
                    <span className="font-semibold text-teal-700 mr-2"> {item.time}</span>
                    {user.role === "doctor" ? `Dr.${user.name}` : getName(item.patientId)}
                    <span className="text-gray-500 ml-2"> · {item.type}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
