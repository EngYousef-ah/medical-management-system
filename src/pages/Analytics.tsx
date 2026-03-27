import SidebarFooter from "../components/SidebarFooter";
import SidebarHeader from "../components/SidebarHeader";
import SidebarItem from "../components/SidebarItem";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Paragraph from "../components/Paragraph";
import ChartLine from "../components/ChartLine";
import ChartDonut from "../components/ChartDonut";
import { Link } from "react-router-dom";
import { LayoutDashboard, User, CalendarDays, Paperclip, Pill, ChartColumn, LogOut } from "lucide-react"
import ChartTinyBar from "../components/ChartTinyBar";

import { useState } from "react";
export function Analytics() {

    const username = (() => {
        try {
            const dataFromLocal = localStorage.getItem("user");
            if (!dataFromLocal) return "";

            const dataParsed = JSON.parse(dataFromLocal);
            return dataParsed?.name ?? "";
        } catch {
            return "";
        }
    })();
    const [openMenu, setOpenMenu] = useState<boolean>(false);


    return (
        <div className="flex h-screen relative overflow-hidden">
            {openMenu && (
                <div
                    onClick={() => setOpenMenu(false)}
                    className="fixed inset-0 bg-black/30 z-20 md:hidden transition-opacity duration-300"
                />
            )}
            <aside
                id="sidebar"
                className={`fixed md:static z-30 top-0 left-0 h-full w-64 
                        flex flex-col justify-between not-only:text-[#9799ab] p-4 space-y-6
                        transform ${openMenu ? "translate-x-0" : "-translate-x-full"}
                          md:translate-x-0
                        transition-transform duration-300 ease-in-out
                        bg-linear-to-br from-[#104c44] to-[rgb(26,127,114)]`}>


                <div className="mb-8">
                    <SidebarHeader title="MedPractice" subTitle="Management System" cancle={() => setOpenMenu(false)} />

                    <ul className="space-y-2 mt-8">
                        <Link to="../">
                            <SidebarItem icon={<LayoutDashboard color="#828282" />} title="Dashboard" />
                        </Link>
                        <Link to="../patient">
                            <SidebarItem icon={<User color="#828282" />} title="Patients" />
                        </Link>
                        <Link to="../appointments">
                            <SidebarItem icon={<CalendarDays color="#828282" />} title="Appointments" />
                        </Link>
                        <Link to="../medical-records">
                            <SidebarItem icon={<Paperclip color="#828282" />} title="Medical Records" />
                        </Link>
                        <Link to="../prescription">
                            <SidebarItem icon={<Pill color="#828282" />} title="Prescriptions" />
                        </Link>
                        <Link to="../analytics">
                            <SidebarItem icon={<ChartColumn color="#828282" />} title="Analytics" />
                        </Link>
                    </ul>
                </div>

                <div className="flex justify-between items-center">
                    <SidebarFooter role="Dr. " username={`${username}`} job="Doctor" />

                    <Link to="/">
                        <LogOut color="#104c44" size={26} strokeWidth={2.75} onClick={() => localStorage.clear()} />
                    </Link>
                </div>
            </aside>


            <div className="flex-1 flex flex-col pb-10">

                <Header name={username} click={() => setOpenMenu(true)} />

                <main className="flex-1  p-4 md:p-6 overflow-y-auto">

                    <Heading title="Analytics" />
                    <Paragraph title="Practice performance overview" />


                    {/* CHARTS */}
                    <div className="grid gap-x-8 grid-cols-1 mt-8 gap-y-6 lg:grid-cols-3 ">
                        <div className=" bg-white rounded-2xl shadow-lg p-8 col-span-1  lg:col-span-2">
                            <h2 className="text-2xl font-bold mb-6">Patient Overview</h2>
                            <ChartLine />
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg  col-span-1  lg:col-span-1">
                            <h2 className="text-2xl font-bold mb-6">Appointment Types</h2>
                            <ChartDonut />
                        </div>
                    </div>
                    <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">Weekly Appointment Volume</h2>
                        <ChartTinyBar color="#1fa2ff" />
                    </div>
                    {/* =====CHARTS===== */}


                </main>

            </div>
        </div>
    );
}