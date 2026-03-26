import { CalendarDays, CircleUser, Hospital, NotebookPen, Phone, Syringe } from "lucide-react";

import type { ReactNode } from "react";
type Props = {
    doctorName: string;
    patinetName: string;
    phone: string;
    bloodType: string;
    lastVisit: string;
    notes: string;
    status: string;
    children: ReactNode;

}
export default function Record({ doctorName, patinetName, phone, bloodType, lastVisit, notes, status, children }: Props) {
    return (
        <div className=" bg-white p-4 rounded-xl border shadow-lg relative  hover:shadow-2xl  transition">
            <span className={`absolute right-8 px-3 py-1 text-sm font-medium rounded-full ${status.toLowerCase() == "active"
                ? "bg-green-100 text-green-700" : status.toLowerCase() == "inactive"
                    ? "bg-gray-200 text-gray-500" : "bg-red-100 text-red-600"}`}>{status}</span>


            <div className="space-y-5">
                <div className="flex gap-3 items-center mt-5">
                    <CircleUser color="#1a7f72" />
                    <h1 className="font-semibold  bg-linear-to-r from-[#23a997]  to-[#104c44]
                    text-transparent bg-clip-text text-lg">{patinetName}</h1>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Phone color="#1a7f72" size={16} />
                        <p className="text-gray-500 text-sm"><span className="text-gray-900 font-semibold text-sm">Phone: </span>{phone}</p>

                    </div>
                    <div className="flex items-center gap-2">
                        <Syringe color="#1a7f72" size={16} />
                        <p className="text-gray-500 text-sm"><span className="text-gray-900 font-semibold text-sm">Blood Type:</span> {bloodType}</p>

                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarDays color="#1a7f72" size={16} />
                        <p className="text-gray-500 text-sm"><span className="text-gray-900 font-semibold text-sm">Visit Date:</span> {lastVisit}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Hospital color="#1a7f72" size={16} />
                        <p className="text-gray-500 text-sm"><span className="text-gray-900 font-semibold text-sm">Doctor Name:</span> {doctorName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <NotebookPen color="#1a7f72" size={16} />
                        <p className="text-gray-500 text-sm text-justify"><span className="text-gray-900 font-semibold text-sm">Notes:</span> {notes}</p>
                    </div>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );

}