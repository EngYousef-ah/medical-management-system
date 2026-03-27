import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,} from "recharts";

// import { useState, useEffect } from "react";
// import axios from "axios";

interface WeeklyData {
  id: string;
  day: string;
  count: number;
}

const weeklyAppointmentData: WeeklyData[] = [
  {
    id: "cf62",
    day: "Mon",
    count: 12
  },
  {
    id: "305a",
    day: "Tue",
    count: 9
  },
  {
    id: "8862",
    day: "Wed",
    count: 15
  },
  {
    id: "2897",
    day: "Thu",
    count: 11
  },
  {
    id: "8ac4",
    day: "Fri",
    count: 8
  },
  {
    id: "e094",
    day: "Sat",
    count: 4
  }
];


export default function ChartTinyBar({ color = "" }) {
  // const [weeklyAppointment, setWeeklyAppointment] = useState([]);
  // useEffect(() => {
  //   axios.get("http://localhost:3000/weeklyAppointmentData")
  //     .then((response) => setWeeklyAppointment(response.data))
  // }, [])

  return (
    <div className="w-full h-100 bg-gray-100 rounded-3xl p-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weeklyAppointmentData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>

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
