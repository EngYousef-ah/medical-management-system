import type { ReactNode } from "react";

interface Props {
    time: string;
    duration: string;
    name: string;
    date: string;
    type: string;
    status: ReactNode;
    children?: ReactNode;
}

export function AppointmentItem({ time, duration, name, date, type, status, children }: Props) {
    return (
        <div className="bg-white w-full h-18 rounded-lg shadow-lg mt-6 flex justify-between items-center p-4" >
            <div className="flex gap-4">
                <div className="hidden lg:block">
                    <p className="font-bold text-lg text-gray-800">{time}</p>
                    <p className="text-sm text-gray-600">{duration}min</p>
                </div>
                <div>
                    <p className="font-semibold text-lg">{name}</p>
                    <p className="text-sm text-gray-600">{date} . {type}</p>
                </div>
            </div>

            <div className="flex items-center gap-1 lg:gap-4">
                {children}
                {status}

            </div>

        </div>
    );

}
export function ScheduledAppointmentItem() {
    return (
        <p className="px-2 py-2 text-white text-xs  font-semibold bg-[#1a7f72] rounded-2xl sm:px-4 sm:text-sm sm:py-1   ">
            Scheduled
        </p>
    );
}
export function CompletedAppointmentItem() {
    return (
        <p className="px-2 py-2 text-black text-xs font-semibold bg-sky-200 rounded-2xl sm:px-4 sm:text-sm sm:py-1">
            Completed
        </p>
    );
}
export function CancelledAppointmentItem() {
    return (
        <p className="px-4 py-1 text-white text-sm font-semibold bg-red-600 rounded-2xl">
            Cancelled
        </p>
    );
}

