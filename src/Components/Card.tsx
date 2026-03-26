import type { ReactNode } from "react";

interface Props {
    title: string,
    num: number,
    icon?: ReactNode,
    colorChange: string,
    change: string
}
export default function Card({ title, num, icon, colorChange, change }: Props) {
    return (
        <div className="flex-col space-y-4 p-4 bg-white shadow-lg rounded-lg hover:shadow-xl  transition">
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <p className="text-md text-gray-500">{title}</p>
                    <p className="text-3xl font-bold">{num}</p>
                </div>
                {icon}
            </div>
            <p className={`${colorChange} text-md`}>{change}</p>
        </div>
    );
}