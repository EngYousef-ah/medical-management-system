import { Link } from "react-router-dom";
import Header from "../components/Header";
import SidebarFooter from "../components/SidebarFooter";
import SidebarItem from "../components/SidebarItem";
import { ArrowLeft, Calendar, CalendarDays, ChartColumn, LayoutDashboard, LogOut, Mail, MapPin, Paperclip, Pencil, Phone, Pill, Syringe, Trash2Icon, User } from "lucide-react";
import SidebarHeader from "../components/SidebarHeader";
import { AppointmentItem, CancelledAppointmentItem, CompletedAppointmentItem, ScheduledAppointmentItem } from "../components/AppointmentItem";
import axios from "axios";
import { useState, useMemo, useContext, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Alert } from "@/components/Alert";
import { DialogAppointment } from "@/components/DialogAppointment";
import { CannotDeletePatientAlert } from "@/components/CannotDeletePatientAlert";
import { DialogPatient } from "@/components/DialogPatient";

import type { TypeUser } from "@/types/TypeUser";
import type { TypeAppointment } from "@/types/TypeAppointment";
import type { TypePrescription } from "@/types/TypePrescription";
import type { TypeMedicalRecord } from "@/types/TypeMedicalRecord";

import { UserContext } from "@/contexts/UserContext";
import { PatientContext } from "@/contexts/PatientContext";
import { AppointmentContext } from "@/contexts/AppointmentContext";
import { PrescriptionContext } from "@/contexts/PrescriptionContext";
import { MedicalRecordContext } from "@/contexts/MedicalRecordContext";
import toast from "react-hot-toast";
type TypeState = {
    Menu: boolean;
    DialogPatient: boolean;
    DialogAppointment: boolean;
    AlertCannotDeletePatient: boolean;
}
type typeAction = { type: "Menu" } | { type: "DialogPatient" } | { type: "DialogAppointment" } | { type: "AlertCannotDeletePatient" }

function reducer(state: TypeState, action: typeAction) {
    if (action.type === "Menu") {
        return { ...state, Menu: !state.Menu }
    }
    else if (action.type === "DialogPatient") {
        return { ...state, DialogPatient: !state.DialogPatient }
    }
    else if (action.type === "DialogAppointment") {
        return { ...state, DialogAppointment: !state.DialogAppointment }
    }
    else if (action.type === "AlertCannotDeletePatient") {
        return { ...state, AlertCannotDeletePatient: !state.AlertCannotDeletePatient }
    }
    else return state
}
export default function PatientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [state, dispatch] = useReducer(reducer, {
        Menu: false,
        DialogPatient: false,
        DialogAppointment: false,
        AlertCannotDeletePatient: false
    })

    const [idAppointment, setIdAppointment] = useState<string>("");

    // Context API
    const { users } = useContext(UserContext)!;
    const { patients, refreshPatients } = useContext(PatientContext)!;
    const { appointments, refreshAppointments } = useContext(AppointmentContext)!;
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


    const patient = useMemo(() => {
        return patients.find(p => p.id === id);
    }, [patients, id])


    const appointmentsData = patient
        ? appointments.filter((a: TypeAppointment) => a.patientId === patient.id && a.doctorId === user.id)
        : [];

    const filteredPrescriptions = useMemo(() => {
        return prescriptions.filter((p: TypePrescription) =>
            p.patientId === id && p.doctorId === user.id
        )
    }, [prescriptions, id, user])

    const filterdRecords = useMemo(() => {
        return records.filter((r: TypeMedicalRecord) =>
            r.patientId === id && r.doctorId === user.id
        )
    }, [records, id, user])


    const scheduledAppointments = appointmentsData ? appointmentsData.filter((item: TypeAppointment) => item.status === "scheduled") : [];

    function getEmail(patientId: string) {
        const userData = users.find((u: TypeUser) => u.id === patientId)
        return userData ? userData?.email : "";
    }

    // UseEffects To Refresh data when we add or edit or delete item from Patients and Appointments
    useEffect(() => {
        const isPatientDialogOpen = state.DialogPatient;
        if (isPatientDialogOpen) {
            refreshPatients()
        }
    }, [state.DialogPatient])

    useEffect(() => {
        const isAppointmentDialogReady = state.DialogAppointment && idAppointment;
        if (isAppointmentDialogReady) {
            refreshAppointments()
        }
    }, [state.DialogAppointment, idAppointment])
    return (
        <div className="flex h-screen relative ">

            {/* DIALOGS */}
            <DialogPatient type="edit" open={state.DialogPatient} setOpen={() => dispatch({ type: "DialogPatient" })} patientId={id} />
            <DialogAppointment open={state.DialogAppointment} setOpen={() => dispatch({ type: "DialogAppointment" })} appointmentId={idAppointment} />
            <CannotDeletePatientAlert open={state.AlertCannotDeletePatient} setOpen={() => dispatch({ type: "AlertCannotDeletePatient" })} />
            {/* ====DIALOGS==== */}




            {state.Menu && (
                <div
                    onClick={() => dispatch({ type: "Menu" })}
                    className="fixed inset-0 bg-black/30 z-20 md:hidden transition-opacity duration-300"
                />
            )}
            <aside
                id="sidebar"
                className={`fixed md:static z-30 top-0 left-0 h-full w-64 
                        flex flex-col justify-between not-only:text-[#9799ab] p-4 space-y-6
                        transform ${state.Menu ? "translate-x-0" : "-translate-x-full"}
                          md:translate-x-0
                        transition-transform duration-300 ease-in-out
                        bg-linear-to-br from-[#104c44] to-[rgb(26,127,114)]`}>


                <div className="mb-8">
                    <SidebarHeader title="MedPractice" subTitle="Management System" cancle={() => dispatch({ type: "Menu" })} />

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
                    <SidebarFooter role="Dr. " username={user.name} job="Doctor" />

                    <Link to="/">
                        <LogOut color="#104c44" size={26} strokeWidth={2.75} onClick={() => localStorage.clear()} />
                    </Link>
                </div>

            </aside>


            <div className="flex-1 flex flex-col pb-10">
                <Header name={user.name} click={() => dispatch({ type: "Menu" })} />
                <Link to="../patient">
                    <div className="flex gap-1 ml-3 mt-5">
                        <ArrowLeft color="#7d7d7d" />
                        <h1 className="text-gray-600 hover:text-gray-800 transition duration-75">Back To Patients Page</h1>
                    </div>
                </Link>
                <main className="flex-1  p-4 md:p-6 overflow-y-auto">
                    <div className="grid gap-4 grid-cols-1 mt-10 lg:grid-cols-3 ">

                        <div className="flex flex-col gap-6 shadow-lg bg-gray-50 p-4 rounded-lg lg:col-span-1 ">
                            {patient && (
                                <div className="flex items-center gap-x-4" >
                                    <p className="text-[#1a7f72] bg-green-100 py-2 px-5 rounded-xl text-3xl font-bold ">{patient.name[0]}</p>
                                    <div className="flex flex-col gap-2 ">
                                        <h1 className=" text-2xl font-bold text-gray-800">{patient.name}</h1>
                                        <div className={`text-center p-1 w-20  text-sm font-medium rounded-full 
                                            ${patient.status.toLowerCase() == "active"
                                                ? "bg-green-100 text-green-700"
                                                : patient.status.toLowerCase() == "inactive"
                                                    ? "bg-gray-200 text-gray-500"
                                                    : "bg-red-100 text-red-600"}`}>{
                                                patient.status[0].toUpperCase() + patient.status.slice(1)
                                            }</div>
                                    </div>

                                </div>
                            )}
                            {patient && (
                                <div className="flex flex-col gap-4" >
                                    <div className="flex items-center gap-2">
                                        <Mail color="#8a8a8a" size={20} />
                                        <p>{getEmail(patient.userId)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone color="#8a8a8a" size={20} />
                                        <p>{patient.phone}</p>

                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin color="#8a8a8a" size={20} />
                                        <p>{patient.address}</p>

                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar color="#8a8a8a" size={20} />
                                        <p>DOB: {patient.dateOfBirth}</p>

                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Syringe color="#8a8a8a" size={20} />
                                        <p>Blood: {patient.bloodType}</p>

                                    </div>



                                    <div className="flex  gap-3 ">
                                        <Alert
                                            trigger={
                                                <Trash2Icon size={32} />
                                            }
                                            icon={<Trash2Icon />}
                                            title="Delete Patient?"
                                            description="Are you sure you want to delete this patient?"
                                            confirmText="Delete"
                                            variant="destructive"
                                            onConfirm={async () => {
                                                if ((scheduledAppointments.length !== 0 ||
                                                    filteredPrescriptions.length !== 0) ||
                                                    filterdRecords.length !== 0) {
                                                    dispatch({ type: "AlertCannotDeletePatient" })
                                                    return;
                                                }
                                                try {
                                                    await axios.delete(`https://69c59dee8a5b6e2dec2cb4d4.mockapi.io/patients/${id}`);
                                                    await refreshPatients();
                                                    navigate("../patient");
                                                    toast.success("The patient has been successfully deleted.");

                                                } catch (error) {
                                                    console.error(error);
                                                }
                                            }} />

                                        <Alert
                                            trigger={
                                                <Pencil size={32} />
                                            }
                                            icon={<Pencil />}
                                            title="Edit Patient?"
                                            description="Are you sure you want to edit this patient?"
                                            confirmText="Edit"
                                            variant="default"
                                            onConfirm={() => dispatch({ type: "DialogPatient" })} />
                                    </div>


                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 shadow-lg rounded-lg lg:col-span-2">

                            <div className="p-4" >
                                <h1 className="text-2xl font-semibold">Appointment History</h1>
                                {appointmentsData.map((item: TypeAppointment) => (
                                    <AppointmentItem
                                        key={item.id}
                                        // id={item.id}
                                        time={item.time}
                                        duration={`${item.duration}`}
                                        name={`Dr. ${user.name}`}
                                        date={item.date}
                                        type={item.type}
                                        status={
                                            item.status === "scheduled" ? (
                                                <div className="flex gap-x-4">
                                                    <ScheduledAppointmentItem />
                                                </div>
                                            ) : item.status === "completed" ? (
                                                <CompletedAppointmentItem />
                                            ) : (
                                                <CancelledAppointmentItem />
                                            )
                                        }
                                    >
                                        <Alert
                                            trigger={
                                                <Trash2Icon size={28} />
                                            }
                                            icon={<Trash2Icon />}
                                            title="Delete Appointment?"
                                            description="Are you sure you want to delete this Appointment?"
                                            confirmText="Delete"
                                            variant="destructive"
                                            onConfirm={async () => {
                                                await axios.delete(`https://69c68e89f272266f3eacc5b5.mockapi.io/appointment/${item.id}`);
                                                await refreshAppointments();
                                            }} />

                                        <Alert
                                            trigger={
                                                <Pencil />
                                            }
                                            icon={<Pencil />}
                                            title="Edit Appointment?"
                                            description="Are you sure you want to edit this Appointment?"
                                            confirmText="Edit"
                                            variant="default"
                                            onConfirm={() => {
                                                dispatch({ type: "DialogAppointment" })
                                                setIdAppointment(item.id)
                                            }
                                            } />

                                    </AppointmentItem>
                                ))}
                                {appointmentsData.length == 0 ? <div className="text-gray-500 text-lg font-semibold p-20 text-center">There are no appointments available for this patient.</div> : ""}

                            </div>

                        </div>
                    </div>

                </main>

            </div>
        </div >

    );
}