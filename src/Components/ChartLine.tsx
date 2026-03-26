import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { RechartsDevtools } from '@recharts/devtools';
import { useState,useEffect } from 'react';
import axios from 'axios';
// const data = [
//   {
//     name: 'Sep',
//     Appointments: 155,
//     Patients: 42
//   },
//   {
//     name: 'Oct',
//     Appointments: 172,
//     Patients: 48
//   },
//   {
//     name: 'Nov',
//     Appointments: 168,
//     Patients: 51
//   },
//   {
//     name: 'Dec',
//     Appointments: 145,
//     Patients: 39
//   },
//   {
//     name: 'Jan',
//     Appointments: 189,
//     Patients: 55
//   },
//   {
//     name: 'Feb',
//     Appointments: 162,
//     Patients: 47
//   }
// ];
type typeMonthlyPatientData ={
  id:string;
  month:string;
  patients:string;
  appointments:string;
}
export default function ChartLine() {
  const[data,setData] = useState<typeMonthlyPatientData[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/monthlyPatientData")
    .then((response) => setData(response.data))
    .catch(() => {
      console.log("There is error in fetching monthly patients data from Mock Api");
      
    })
  },[])
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
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