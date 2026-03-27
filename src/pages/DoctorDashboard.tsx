import SidebarFooter from "../components/SidebarFooter";
import SidebarHeader from "../components/SidebarHeader";
import SidebarItem from "../components/SidebarItem";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Paragraph from "../components/Paragraph";
import Card from "../components/Card";
import HeadinInfoCard from "../components/HeadingInfoCard";
import InfoCard from "../components/InfoCard";
import ChartLine from "../components/ChartLine";
import ChartDonut from "../components/ChartDonut";

import { useState, useMemo, useContext } from "react";

import { LayoutDashboard, User, CalendarDays, Paperclip, Pill, ChartColumn, Clock, LogOut } from "lucide-react"
import { Link } from "react-router-dom";
import ChartTinyBar from "../components/ChartTinyBar";

import type { TypeUser } from "@/types/TypeUser";
import type { TypePatient } from "@/types/TypePatient";
import type { TypeAppointment } from "@/types/TypeAppointment";
import type { TypePrescription } from "@/types/TypePrescription";
import type { TypeMedicalRecord } from "@/types/TypeMedicalRecord";
import { CancelledAppointmentItem, CompletedAppointmentItem, ScheduledAppointmentItem } from "@/components/AppointmentItem";

import { UserContext } from "../contexts/UserContext";
import { AppointmentContext } from "../contexts/AppointmentContext";
import { PatientContext } from "@/contexts/PatientContext";
import { PrescriptionContext } from "@/contexts/PrescriptionContext";
import { MedicalRecordContext } from "@/contexts/MedicalRecordContext";
// import toast from "react-hot-toast";
import Loading from "@/components/Loading";

export function DoctorDashboard() {
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const { users, loading } = useContext(UserContext)!;
    const { appointments } = useContext(AppointmentContext)!;
    const { patients } = useContext(PatientContext)!;
    const { prescriptions } = useContext(PrescriptionContext)!;
    const { records } = useContext(MedicalRecordContext)!;





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

    const allPatientForDoctor = useMemo(() => {
        const doctorAppointments = appointments.filter((ap: TypeAppointment) =>
            ap.doctorId === user.id
        )

        const uniquePatients = new Set<string>(
            doctorAppointments.map((ap: TypeAppointment) => ap.patientId)
        )
        return patients.filter((patient) =>
            uniquePatients.has(patient.id)
        );
    }, [appointments, patients, user.id])

    // const allPatientForDoctor = useMemo(() => {
    //     const doctorAppointments = appointments.filter((ap: TypeAppointment) =>
    //         ap.doctorId === user.id
    //     )

    //     const uniquePatients = new Set<string>(
    //         doctorAppointments.map((ap: TypeAppointment) => ap.patientId)
    //     )
    //     return patients.filter((patient) =>
    //         uniquePatients.has(patient.id)
    //     );
    // }, [appointments, patients, user.id])


    const allAppointmentsForDoctor = useMemo(() => {
        return appointments.filter((item: TypeAppointment) => {
            return item.doctorId === user.id;
        })
    }, [appointments, user.id])


    const allMedicalRecordsForDoctor = useMemo(() => {
        return records.filter((record: TypeMedicalRecord) =>
            record.doctorId === user.id
        )
    }, [records, user])

    const allPrescriptionForDoctor = useMemo(() => {
        return prescriptions.filter((item: TypePrescription) =>
            item.doctorId === user.id
        )
    }, [prescriptions, user])








    function getPatientName(patientId: string) {
        const patient = patients.find((p: TypePatient) => p.id === patientId);
        return patient ? patient.name : "";
    }

    function getUserName() {
        const userName = users.find((u: TypeUser) => u.id === user?.id)
        return userName ? userName.name : "";
    }

    return (
        <div className={`flex h-screen relative `}>
            {loading ? <Loading /> : ""}

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
                        <Link to="patient">
                            <SidebarItem icon={<User color="#828282" />} title="Patients" />
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
                        <Link to="analytics">
                            <SidebarItem icon={<ChartColumn color="#828282" />} title="Analytics" />
                        </Link>
                    </ul>
                </div>

                <div className="flex justify-between items-center">
                    <SidebarFooter role="Dr. " username={`${user.name}`} job="Doctor" />

                    <Link to="/">
                        <LogOut color="#104c44" size={26} strokeWidth={2.75} onClick={() => localStorage.clear()} />
                    </Link>
                </div>

            </aside>


            <div className="flex-1 flex flex-col pb-10">


                <Header name={user.name} click={() => setOpenMenu(true)} />


                <main className="flex-1  p-4 md:p-6 overflow-y-auto">

                    <Heading title={`Good morning, Dr. ${user.name}`} />
                    <Paragraph title="Here's an overview of your practice today." />

                    <div className="grid gap-4 grid-cols-1  sm:grid-cols-2 :grid-cols-2  lg:grid-cols-4 ">
                        <Card title="Total Patients" num={allPatientForDoctor.length} icon={<User color="#0b8f51" size={35} />} colorChange="text-[#0b8f51]" change="+12% this month" />
                        <Card title="Total Appointments" num={allAppointmentsForDoctor.length} icon={<CalendarDays color="#0b8f51" size={35} />} colorChange="text-[#0b8f51]" change="+3 this month" />
                        <Card title="Total Medical Records" num={allMedicalRecordsForDoctor.length} icon={<Paperclip color="#0b8f51" size={35} />} colorChange="text-[#0b8f51]" change="+12% this month" />
                        <Card title="Total Prescriptions" num={allPrescriptionForDoctor.length} icon={<Pill color="#0b8f51" size={35} />} colorChange="text-[#0b8f51]" change="+5% this month" />
                    </div>

                    {/* CHARTS */}
                    <div className="grid gap-x-8 grid-cols-1  mt-8 gap-y-6 lg:grid-cols-3">
                        <div className=" bg-white rounded-2xl shadow-lg p-8 col-span-1  lg:col-span-2">
                            <h2 className="text-2xl font-bold mb-6">Patient Overview</h2>
                            <ChartLine />
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg  col-span-1  lg:col-span-1">
                            <h2 className="text-2xl font-bold mb-6">Appointment Types</h2>
                            <ChartDonut />
                        </div>
                    </div>
                    {/* =====CHARTS===== */}





                    <div className="grid gap-y-8 grid-cols-1 lg:grid-cols-2 gap-x-4 mt-8">
                        <div className=" flex flex-col gap-6 shadow-lg   p-4 rounded-xl bg-white overflow-auto " >
                            <Link to={"appointments"}>
                                <HeadinInfoCard title="Today's Appointments" />
                            </Link>
                            {allAppointmentsForDoctor.map((item: TypeAppointment) => (
                                <InfoCard
                                    key={item.id}
                                    icon={<Clock size={30} color="#0b8f51" strokeWidth={2} />}
                                    title={getPatientName(item.patientId)}
                                    subTitle={`${item.time} · ${item.type} · Dr. ${getUserName()}`}
                                    status={item.status === "scheduled" ?
                                        <ScheduledAppointmentItem /> :
                                        item.status === "completed" ?
                                            <CompletedAppointmentItem /> :
                                            <CancelledAppointmentItem />}

                                />
                            ))}

                        </div>

                        <div className="flex flex-col gap-6 shadow-lg  p-4 rounded-xl bg-white overflow-auto " >
                            <h1 className="text-lg font-bold">Weekly Appointments</h1>
                            <ChartTinyBar color="#0b8f51" />

                        </div>
                    </div>

                </main>

            </div>
        </div >

    );
}