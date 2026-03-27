import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { RechartsDevtools } from '@recharts/devtools';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
interface MonthlyData {
  id: string;
  month: string;
  appointments: number;
  patients: number;
}

const monthlyPatientData: MonthlyData[] = [
  {
    id: "0483",
    month: "Sep",
    appointments: 155,
    patients: 42
  },
  {
    id: "91e0",
    month: "Oct",
    appointments: 172,
    patients: 48
  },
  {
    id: "a10c",
    month: "Nov",
    appointments: 168,
    patients: 51
  },
  {
    id: "19fd",
    month: "Dec",
    appointments: 145,
    patients: 39
  },
  {
    id: "03d4",
    month: "Jan",
    appointments: 189,
    patients: 55
  },
  {
    id: "ce3b",
    month: "Feb",
    appointments: 162,
    patients: 47
  }
];

// type typeMonthlyPatientData = {
//   id: string;
//   month: string;
//   patients: string;
//   appointments: string;
// }
export default function ChartLine() {
  // const [data, setData] = useState<typeMonthlyPatientData[]>([]);

  // useEffect(() => {
  //   axios.get("http://localhost:3000/monthlyPatientData")
  //     .then((response) => setData(response.data))
  //     .catch(() => {
  //       console.log("There is error in fetching monthly patients data from Mock Api");

  //     })
  // }, [])
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={monthlyPatientData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="patients"
            stroke="#6366f1"
            strokeWidth={2.5}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="appointments"
            stroke="#10b981"
            strokeWidth={2.5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}