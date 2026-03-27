import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, } from "recharts";

interface AppointmentType {
    id: string;
    name: string;
    value: number;
    color: string;
}
const appointmentData: AppointmentType[] = [
    {
        id: "5cd7",
        name: "Checkup",
        value: 35,
        color: "#2CA58D"
    },
    {
        id: "1461",
        name: "Follow-up",
        value: 28,
        color: "#2E9CCA"
    },
    {
        id: "dcb9",
        name: "Consultation",
        value: 20,
        color: "#3A86FF"
    },
    {
        id: "6290",
        name: "Procedure",
        value: 12,
        color: "#E63946"
    },
    {
        id: "93e1",
        name: "Emergency",
        value: 5,
        color: "#F4A261"
    }
];


export default function ChartDonut() {
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
                                data={appointmentData}
                                dataKey="value"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={3}
                                cornerRadius={5}
                            >
                                {appointmentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-5 w-full">
                    {appointmentData.map((item) => (
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