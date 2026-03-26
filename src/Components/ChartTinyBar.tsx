import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useState, useEffect } from "react";
import axios from "axios";




export default function ChartTinyBar({color=""}) {
  const [weeklyAppointment, setWeeklyAppointment] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3000/weeklyAppointmentData")
      .then((response) => setWeeklyAppointment(response.data))
  }, [])

  return (
    <div className="w-full h-[400px] bg-gray-100 rounded-3xl p-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weeklyAppointment} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>

          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />

          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            width={30}
          />

          <Tooltip />

          <Bar
            dataKey="count"
            fill={color}
            radius={[6, 6, 0, 0]}
            barSize={400}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
