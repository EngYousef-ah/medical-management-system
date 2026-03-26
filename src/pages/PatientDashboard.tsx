import SidebarFooter from "../Components/SidebarFooter";
import SidebarHeader from "../Components/SidebarHeader";
import SidebarItem from "../Components/SidebarItem";
import Header from "../Components/Header";
import Heading from "../Components/Heading";
import Paragraph from "../Components/Paragraph";
import Card from "../Components/Card";
import HeadinInfoCard from "../Components/HeadingInfoCard";
import InfoCard from "../Components/InfoCard";


import { useState, useMemo, useContext } from "react";

import { LayoutDashboard, CalendarDays, Paperclip, Pill, Clock, LogOut } from "lucide-react"
import { Link } from "react-router-dom";


import type { TypePatient } from "@/types/TypePatient";
import type { TypeAppointment } from "@/types/TypeAppointment";
import type { TypePrescription } from "@/types/TypePrescription";
import type { TypeMedicalRecord } from "@/types/TypeMedicalRecord";
import { CancelledAppointmentItem, CompletedAppointmentItem, ScheduledAppointmentItem } from "@/Components/AppointmentItem";



import { UserContext } from "../contexts/UserContext";
import { PatientContext } from "@/contexts/PatientContext";
import { AppointmentContext } from "@/contexts/AppointmentContext";
import { PrescriptionContext } from "@/contexts/PrescriptionContext";
import { MedicalRecordContext } from "@/contexts/MedicalRecordContext";

export function PatinetDashboard() {
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const user = (() => {
        try {
            const dataFromLocal = localStorage.getItem("user");
            if (!dataFromLocal) return { id: "", name: "", role: "" };

            const dataParsed = JSON.parse(dataFromLocal);

            return {
                id: dataParsed?.id ?? "",
                name: dataParsed?.name ?? "",
                role: dataParsed?.role ?? ""
            };
        } catch {
            return { id: "", name: "", role: "" };
        }
    })();
    const { users } = useContext(UserContext)!;
    const { patients } = useContext(PatientContext)!;
    const { appointments } = useContext(AppointmentContext)!;
    const { prescriptions } = useContext(PrescriptionContext)!;
    const { records } = useContext(MedicalRecordContext)!;

    const filteredPatient = useMemo(() => {
        return patients.find((patient: TypePatient) =>
            patient.userId === user.id
        )
    }, [patients, user])

    const patientAppointment = useMemo(() => {
        return appointments.filter((item: TypeAppointment) =>
            item.patientId === filteredPatient?.id
        )
    }, [appointments, filteredPatient])

    const recordsPatient = useMemo(() => {
        const patient = patients.find((p: TypePatient) =>
            p.userId === user.id
        )
        return records.filter((r: TypeMedicalRecord) => {
            return patient?.id === r.patientId
        })
    }, [records,patients, user])


    const totalPrescription = useMemo(() => {
        return prescriptions.filter((item: TypePrescription) =>
            item.patientId === filteredPatient?.id
        )
    }, [prescriptions, filteredPatient])


    const getUserName = (userId: string) => {
        const user = users.find(u => u.id === userId);
        return user ? user.name : "";
    }

    return (
        <div className={`flex h-screen relative `}>
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
                        bg-linear-to-br from-[#104c44] to-[#1a7f72]`}>




                <div className="mb-8">
                    <SidebarHeader title="MedPractice" subTitle="Management System" cancle={() => setOpenMenu(false)} />

                    <ul className="space-y-2 mt-8">
                        <Link to="">
                            <SidebarItem icon={<LayoutDashboard color="#828282" />} title="Dashboard" />
                        </Link>
                        <Link to="appointments">
                            <SidebarItem icon={<CalendarDays color="#828282" />} title="Appointments" />
                        </Link>
                        <Link to="medical-records">
                            <SidebarItem icon={<Paperclip color="#828282" />} title="Medical Records" />
                        </Link>
                        <Link to="prescription">
                            <SidebarItem icon={<Pill color="#828282" />} title="Prescriptions" />
                        </Link>

                    </ul>
                </div>

                <div className="flex justify-between items-center">
                    <SidebarFooter role="" username={user.name} job="patinet" />

                    <Link to="/">
                        <LogOut color="#104c44" size={26} strokeWidth={2.75} onClick={() => localStorage.clear()} />
                    </Link>
                </div>

            </aside>


            <div className="flex-1 flex flex-col pb-10">


                <Header name={user.name} click={() => setOpenMenu(true)} />


                <main className="flex-1  p-4 md:p-6 overflow-y-auto">

                    <Heading title={`Good morning, Patient. ${user.name}`} />
                    <Paragraph title="Here's an overview of your practice today." />

                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 ">
                        <Card title="Appointments" num={patientAppointment.length} icon={<CalendarDays color="#0b8f51" size={35} />} colorChange="text-[#0b8f51]" change="+3 this month" />
                        <Card title="Total Medical Records" num={recordsPatient.length} icon={<Paperclip color="#0b8f51" size={35} />} colorChange="text-[#0b8f51]" change="+12% this month" />
                        <Card title="Prescriptions" num={totalPrescription.length} icon={<Pill color="#0b8f51" size={35} />} colorChange="text-[#0b8f51]" change="+5% this month" />
                    </div>

                    <div className="mt-8 gap-y-6">

                        <div className="flex flex-col gap-6 shadow-lg   p-4 rounded-xl bg-white overflow-auto " >
                            <Link to={"appointments"}>
                                <HeadinInfoCard title={`Appointments For Patient: ${user.name}`} />
                            </Link>
                            {patientAppointment.map((item: TypeAppointment) => (
                                <InfoCard
                                    key={item.id}
                                    icon={<Clock size={30} color="#0b8f51" strokeWidth={2} />}
                                    title={user.name}
                                    subTitle={`${item.time} · ${item.type} · Dr. ${getUserName(item.doctorId)}`}
                                    status={item.status === "scheduled" ?
                                        <ScheduledAppointmentItem /> :
                                        item.status === "completed" ?
                                            <CompletedAppointmentItem /> :
                                            <CancelledAppointmentItem />}
                                />
                            ))}

                            {patientAppointment.length === 0 ? <div className="text-gray-500 text-lg font-semibold p-20 text-center">No  Appointments Found For Patient: {user.name}.</div> : ""}


                        </div>

                    </div>
                </main>

            </div>
        </div >

    );
}