import {PieChart,Pie,Cell,ResponsiveContainer,Tooltip,} from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";

type typeAppointment = {
    id:string;
    name: string;
    value: number;
    color: string;
};



export default function ChartDonut() {
    const[data,setData] = useState<typeAppointment[]>([]);
    useEffect(() => {
        axios.get("http://localhost:3000/appointmentTypeData")
        .then((response) => setData(response.data));
    },[])
    return (
        <div className="w-full max-w-xl bg-[#f5f5f5] p-5 rounded-xl">

            <div className="flex flex-col items-center">
                <div className="w-62.5 h-62.5">
                    <ResponsiveContainer>
                        <PieChart>
                            <Tooltip
                                formatter={(value) => `${value ?? 0}%`}
                            />
                            <Pie
                                data={data}
                                dataKey="value"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={3}
                                cornerRadius={5}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-5 w-full">
                    {data.map((item) => (
                        <div className="flex justify-between items-center mb-3" key={item.name}>
                            <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-3 `}
                                    style={{ backgroundColor: item.color }} />
                                <span>{item.name}</span>
                            </div>
                            <span>{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}