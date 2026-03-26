import Header from "@/Components/Header";
import Heading from "@/Components/Heading";
import SidebarFooter from "@/Components/SidebarFooter";
import SidebarHeader from "@/Components/SidebarHeader";
import SidebarItem from "@/Components/SidebarItem";
import { CalendarDays, ChartColumn, CircleUser, LayoutDashboard, LogOut, Paperclip, Phone, Pill, Syringe, User } from "lucide-react";
import { Link } from "react-router-dom";

import { useContext, useMemo, useReducer } from "react";
import { useParams } from "react-router-dom";
import { AppointmentItem, CancelledAppointmentItem, CompletedAppointmentItem, ScheduledAppointmentItem } from "@/Components/AppointmentItem";

// IMPORTING CONTEXT
import { UserContext } from "@/contexts/UserContext";
import { PatientContext } from "@/contexts/PatientContext";
import { AppointmentContext } from "@/contexts/AppointmentContext";
import { MedicalRecordContext } from "@/contexts/MedicalRecordContext";
import { PrescriptionContext } from "@/contexts/PrescriptionContext";

// TYPES
import type { TypeAppointment } from "@/types/TypeAppointment";
import type { TypePatient } from "@/types/TypePatient";
import type { TypeMedicalRecord } from "@/types/TypeMedicalRecord";
import type { TypePrescription } from "@/types/TypePrescription";
import Loading from "@/Components/Loading";

type TypeTab = { type: "ActiveTab", payload: string; } | { type: "Menu" };

type TypeState = {
    ActiveTab: string;
    Menu: boolean;
}
function reducer(state: TypeState, action: TypeTab) {
    if (action.type === "ActiveTab") {
        return { ...state, ActiveTab: action.payload }
    }
    else if (action.type === "Menu") {
        return { ...state, Menu: !state.Menu }
    }
    else return state
}

export default function MedicalRecordDetails() {

    const [state, dispatch] = useReducer(reducer, {
        ActiveTab: "Medical Records",
        Menu: false
    })

    // CONTEXT API
    const { users } = useContext(UserContext)!;
    const { patients } = useContext(PatientContext)!;
    const { appointments } = useContext(AppointmentContext)!;
    const { records,loading } = useContext(MedicalRecordContext)!;
    const { prescriptions } = useContext(PrescriptionContext)!;


    const { id } = useParams();

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
    const getIdDoctor = useMemo(() => {
        return records.find((r: TypeMedicalRecord) =>
            id === r.id ? r.doctorId : ""
        )
    }, [id, records])


    // FILTERED DATA
    const filteredRecord = useMemo(() => {
        return records.find((record: TypeMedicalRecord) =>
            record.id === id
        )
    }, [records, id])




    const filteredPatient = useMemo(() => {
        return patients.find((patient: TypePatient) =>
            patient.id === filteredRecord?.patientId
        )
    }, [patients, filteredRecord?.patientId])

    const filteredAppointments = useMemo(() => {
        const data = appointments.filter((appointment: TypeAppointment) =>
            user.role === "doctor" ? appointment.doctorId === user.id && appointment.patientId === filteredPatient?.id
                : getIdDoctor?.doctorId === appointment.doctorId && appointment.patientId === filteredPatient?.id
        )
        return data;
    }, [appointments, filteredPatient, user, getIdDoctor?.doctorId])


    const filteredPrescriptions = useMemo(() => {
        const data = prescriptions.filter((prescription: TypePrescription) =>
            user.role === "doctor" ? prescription.doctorId === user.id && prescription.patientId === filteredPatient?.id
                : prescription.patientId === filteredPatient?.id && getIdDoctor?.doctorId === prescription.doctorId
        );
        return data
    }, [prescriptions, user, filteredPatient?.id, getIdDoctor?.doctorId])


    function getName(userId: string) {
        const userData = users.find((u) => u.id === userId)
        return userData ? userData.name : "";
    }



    return (
        <div className="flex h-screen relative overflow-hidden">
            {loading && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
                    <Loading />
                </div>
            )}
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
                        bg-linear-to-br from-[#104c44] to-[#1a7f72]`}>


                <div className="mb-8">
                    <SidebarHeader title="MedPractice" subTitle="Management System" cancle={() => dispatch({ type: "Menu" })} />

                    <ul className="space-y-2 mt-8">
                        <Link to="../">
                            <SidebarItem icon={<LayoutDashboard color="#828282" />} title="Dashboard" />
                        </Link>
                        {user.role === "doctor" &&
                            <Link to="../patient">
                                <SidebarItem icon={<User color="#828282" />} title="Patients" />
                            </Link>
                        }
                        <Link to="../appointments">
                            <SidebarItem icon={<CalendarDays color="#828282" />} title="Appointments" />
                        </Link>
                        <Link to="../medical-records">
                            <SidebarItem icon={<Paperclip color="#828282" />} title="Medical Records" />
                        </Link>
                        <Link to="../prescription">
                            <SidebarItem icon={<Pill color="#828282" />} title="Prescriptions" />
                        </Link>
                        {user.role === "doctor" &&
                            <Link to="../analytics">
                                <SidebarItem icon={<ChartColumn color="#828282" />} title="Analytics" />
                            </Link>
                        }
                    </ul>
                </div>

                <div className="flex justify-between items-center">
                    <SidebarFooter role={`${user.role === "doctor" ? "Dr. " : ""}`} username={user.name} job={`${user.role === "doctor" ? "Doctor" : "Patient"}`} />

                    <Link to="/">
                        <LogOut color="#104c44" size={26} strokeWidth={2.75} onClick={() => localStorage.clear()} />
                    </Link>
                </div>
            </aside>


            <div className="flex-1 flex flex-col pb-10">



                <Header name={`${user.role === "doctor" ? `Dr. ${user.name}` : `${user.name}`}`} click={() => dispatch({ type: "Menu" })} />

                <main className="flex-1  p-4 md:p-6 overflow-y-auto">
                    <div className="flex justify-between items-center ">
                        <div className="flex flex-col gap-3">
                            <Heading title="Patient Profile" />
                        </div>
                    </div>
                    <div className="mt-6 bg-white rounded-xl shadow-md p-6 max-w-xl
                                    border border-gray-200 
                                    hover:shadow-lg">
                        <ul className="space-y-4">
                            <li className="flex justify-between border-b pb-2">
                                <div className="flex items-center gap-2">
                                    <CircleUser color="#1a7f72" size={18} />
                                    <span className="font-semibold text-gray-600">Name:</span>
                                </div>
                                <span className="text-gray-800">{filteredPatient?.name}</span>
                            </li>

                            <li className="flex justify-between border-b pb-2">
                                <div className="flex items-center gap-2">
                                    <Phone color="#1a7f72" size={18} />
                                    <span className="font-semibold text-gray-600">Phone:</span>
                                </div>
                                <span className="text-gray-800">{filteredPatient?.phone}</span>
                            </li>

                            <li className="flex justify-between">
                                <div className="flex items-center gap-2">
                                    <Syringe color="#1a7f72" size={18} />
                                    <span className="font-semibold text-gray-600">Blood Type:</span>
                                </div>
                                <span className="text-gray-800">{filteredPatient?.bloodType}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-gray-200 max-w-xl h-18 rounded-lg mt-5 flex items-center justify-around sm:h-14" >
                        <button className={`p-2    rounded-lg ${state.ActiveTab === "Medical Records" ? "bg-white " : ""}`} onClick={() => {
                            dispatch({ type: "ActiveTab", payload: "Medical Records" })
                        }}>Medical Records <span className="text-[#1a7f72]">(1)</span></button>

                        <button className={`p-2  rounded-lg ${state.ActiveTab === "Appointments" ? "bg-white" : ""}`} onClick={() => {
                            dispatch({ type: "ActiveTab", payload: "Appointments" })


                        }}>Appointments <span className="text-[#1a7f72]">({filteredAppointments.length})</span></button>
                        <button className={`p-2   rounded-lg ${state.ActiveTab === "Prescriptions" ? "bg-white" : ""}`} onClick={() => {
                            dispatch({ type: "ActiveTab", payload: "Prescriptions" })


                        }}>Prescriptions <span className="text-[#1a7f72]">({filteredPrescriptions.length})</span></button>
                    </div>
                    {state.ActiveTab === "Medical Records" &&
                        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-xl 
                                        hover:shadow-xl transition-all duration-300 space-y-4">

                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 font-medium">Visit Date</span>
                                <span className="text-gray-800">{filteredRecord?.visitDate}</span>
                            </div>

                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 font-medium">Doctor</span>
                                <span className="text-gray-800">{filteredRecord ? getName(filteredRecord.doctorId) : ""}</span>
                            </div>

                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 font-medium">Diagnosis</span>
                                <span className="text-gray-800">{filteredRecord?.diagnosis}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Symptoms</span>
                                <span className="text-gray-800">{filteredRecord?.symptoms}</span>
                            </div>

                        </div>
                    }

                    {state.ActiveTab === "Appointments" &&
                        <div>
                            {filteredAppointments.map((item: TypeAppointment) => (
                                <AppointmentItem
                                    key={item.id}
                                    date={item.date}
                                    time={item.time}
                                    duration={`${item.duration}`}
                                    name={`Dr. ${getName(item.doctorId)}`}
                                    type={item.type}
                                    status={
                                        item.status === "scheduled" ? (
                                            <ScheduledAppointmentItem />
                                        ) : item.status === "completed" ? (
                                            <CompletedAppointmentItem />
                                        ) : (
                                            <CancelledAppointmentItem />
                                        )
                                    }
                                />

                            ))}
                        </div>
                    }

                    {state.ActiveTab === "Prescriptions" &&
                        <div className="mt-6    grid grid-cols-1   lg:grid-cols-2 gap-6">
                            {filteredPrescriptions.map((item) => (
                                <div key={item.id} className="bg-gray-50 py-5 pl-7.5 pr-20 rounded-2xl shadow-xl inline-flex flex-col gap-y-4 relative">
                                    <div className={`absolute top-5 right-7 ${item.status !== "active" ? "bg-gray-600" : " bg-[#1a7f72]"} py-1 px-4 rounded-2xl text-white`}>{item.status}</div>
                                    <div className="flex flex-col ">
                                        <h2 className="text-xl font-semibold">{item.medication}</h2>
                                        <p className="text-gray-500">{item.dosage} · {item.frequency}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Patient:<span className="text-gray-800 font-semibold">{filteredPatient?.name}</span> </p>
                                        <p className="text-gray-500">Prescribed by: Dr. {getName(item.doctorId)}</p>
                                        <p className="text-gray-500"> {item.startDate} → {item.endDate}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }





                </main>

            </div>
        </div>
    );
}