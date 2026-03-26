import { useState, useMemo, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import SidebarFooter from "../Components/SidebarFooter";
import SidebarHeader from "../Components/SidebarHeader";
import SidebarItem from "../Components/SidebarItem";
import Header from "../Components/Header";
import Heading from "../Components/Heading";
import Paragraph from "../Components/Paragraph";
import AddBtn from "../Components/AddBtn";
import { AppointmentItem, ScheduledAppointmentItem, CompletedAppointmentItem, CancelledAppointmentItem } from "../Components/AppointmentItem";
import { LayoutDashboard, User, CalendarDays, Paperclip, Pill, ChartColumn, CircleX, CircleCheckBig, LogOut, Search, Trash2Icon, Pencil } from "lucide-react"

import { Link } from "react-router-dom";
import SearchInput from "../Components/SearchInput";
import { DialogAppointment } from "@/Components/DialogAppointment";
import { Alert } from "@/Components/Alert";
import PaginationPage from "@/Components/PaginationPage";
import SchedulePage from "./SchedulePage ";
import '@schedule-x/theme-default/dist/index.css'
import "../index.css"
import type { TypeAppointment } from "@/types/TypeAppointment";


import { UserContext } from "@/contexts/UserContext";
import { PatientContext } from "@/contexts/PatientContext";
import { AppointmentContext } from "@/contexts/AppointmentContext";
import toast from "react-hot-toast"
import Loading from "@/Components/Loading";

const intialValues = {
    Menu: false,
    Dailog: false,
    TypeDailog: "add",
    Dropdown: false,
    ActiveTab: "scheduled",
    TypeTab: "List",
    Query: "",
    Id: "",
}
type TypeState = {
    Menu: boolean;
    Dailog: boolean;
    TypeDailog: string;
    Dropdown: boolean;
    ActiveTab: string;
    TypeTab: string;
    Query: string;
    Id: string;
}
type TypeAction =
    { type: "Menu" } |
    { type: "Dailog" } |
    { type: "TypeDailog", payload: string } |
    { type: "Dropdown" } |
    { type: "ActiveTab", payload: string } |
    { type: "TypeTab", payload: string } |
    { type: "Query"; payload: string } |
    { type: "Id", payload: string };

function reducer(state: TypeState, action: TypeAction) {
    const typeAction = action.type;
    if (typeAction === "Menu") {
        return { ...state, Menu: !state.Menu }
    }
    else if (typeAction === "Dailog") {
        return { ...state, Dailog: !state.Dailog }
    }
    else if (typeAction === "TypeDailog") {
        return { ...state, TypeDailog: action.payload }
    }
    else if (typeAction === "Dropdown") {
        return { ...state, Dropdown: !state.Dropdown }
    }
    else if (typeAction === "ActiveTab") {
        return { ...state, ActiveTab: action.payload }
    }
    else if (typeAction === "TypeTab") {
        return { ...state, TypeTab: action.payload }
    }
    else if (typeAction === "Query") {
        return { ...state, Query: action.payload }
    }
    else if (typeAction === "Id") {
        return { ...state, Id: action.payload }
    }
    else {
        return state
    }
}


export default function Appointments() {

    const [state, dispatch] = useReducer(reducer, intialValues)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const rowsPerPage = 4;



    // Context API
    const { users } = useContext(UserContext)!;
    const { patients } = useContext(PatientContext)!;
    const { appointments, refreshAppointments, loading, error } = useContext(AppointmentContext)!;

    useEffect(() => {
        if (error) {
            toast.error("Failed to update appointment status");
        }
    }, [error])

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
    const filteredAppointmentsByRole = useMemo(() => {
        if (!user || !appointments || !patients) return [];
        if (user.role === "patient") {
            const patient = patients.find((p) => p.userId === user.id);
            if (patient) {
                return appointments.filter((item: TypeAppointment) => item.patientId === patient.id);
            }
            return [];

        }
        return appointments.filter((item: TypeAppointment) => item.doctorId === user.id);
    }, [appointments, patients, user])


    const filteredByStatus = useMemo(() => {
        return filteredAppointmentsByRole.filter((a) => a.status === state.ActiveTab);
    }, [state.ActiveTab, filteredAppointmentsByRole]);

    const filteredAppointments = filteredByStatus.filter((a) => {
        if (user.role === "doctor") {
            return (
                getPatientName(a.patientId).toLowerCase().includes(state.Query.toLowerCase())
            );
        } else {
            return true;
        }
    })

    const scheduledCount = filteredAppointmentsByRole.filter(a => a.status === "scheduled").length;
    const completedCount = filteredAppointmentsByRole.filter(a => a.status === "completed").length;
    const cancelledCount = filteredAppointmentsByRole.filter(a => a.status === "cancelled").length;

    const handleUpdateStatus = async (id: string, newStatus: TypeAppointment["status"]) => {
        try {

            await axios.patch(`http://localhost:3000/appointment/${id}`, {
                status: newStatus,
            });
            await refreshAppointments();
            toast.success("The appointment status has been successfully updated.");

        } catch {
            toast.error("Failed to update appointment status");
        }
    };

    function getUserName(id: string) {
        const user = users.find(u => u.id === id);
        return user ? `Dr. ${user.name}` : "";
    }
    function getPatientName(patientId: string) {
        const patient = patients.find(p => p.id === patientId);
        return patient ? patient.name : "";
    }


    const change = (value: string) => {
        dispatch({ type: "Query", payload: value })
        dispatch({ type: "Dropdown" })
    }

    const lastIndex = currentPage * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;
    const currentAppointments = filteredAppointments.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);


    useEffect(() => {
        if (!state.Dailog) {
            refreshAppointments();
        }
    }, [state.Dailog])



    return (
        <div className="flex h-screen relative ">
            {loading ? <Loading /> : ""}

            <DialogAppointment
                type={state.TypeDailog}
                open={state.Dailog}
                setOpen={() => dispatch({ type: "Dailog" })}
                appointmentId={state.TypeDailog === "edit" ? state.Id : undefined}
            />
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
                    {user.role === "doctor" ? <SidebarFooter role="Dr. " username={`${user.name}`} job="Doctor" /> :
                        <SidebarFooter role="" username={`${user.name}`} job="Patient" />}

                    <Link to="/">
                        <LogOut color="#104c44" size={26} strokeWidth={2.75} onClick={() => localStorage.clear()} />
                    </Link>
                </div>

            </aside>


            <div className="flex-1 flex flex-col pb-10">

                <Header name={user.name} click={() => dispatch({ type: "Menu" })} />


                <main className="flex-1  p-4 md:p-6 overflow-y-auto">

                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-2">
                            <Heading title="Appointments" />
                            <Paragraph title={`${filteredAppointments.length} Appointment`} />
                        </div>
                        {user.role === "doctor" &&
                            <AddBtn title="New Appointment" onClick={() => {
                                dispatch({ type: "TypeDailog", payload: "add" })
                                dispatch({ type: "Dailog" })
                            }}
                            />
                        }
                    </div>
                    <div className="flex flex-col items-start gap-3 ">
                        {state.TypeTab === "List" &&
                            <div className="bg-gray-200 max-w-96 h-14 rounded-lg flex items-center justify-around " >
                                <button className={`p-2    rounded-lg ${state.ActiveTab === "scheduled" ? "bg-white " : ""}`} onClick={() => {
                                    dispatch({ type: "ActiveTab", payload: "scheduled" })
                                    setCurrentPage(1)
                                }}>Scheduled ({scheduledCount})</button>

                                <button className={`p-2  rounded-lg ${state.ActiveTab === "completed" ? "bg-white" : ""}`} onClick={() => {
                                    dispatch({ type: "ActiveTab", payload: "completed" })
                                    setCurrentPage(1)
                                }}>Completed ({completedCount})</button>
                                <button className={`p-2   rounded-lg ${state.ActiveTab === "cancelled" ? "bg-white" : ""}`} onClick={() => {
                                    dispatch({ type: "ActiveTab", payload: "cancelled" })

                                    setCurrentPage(1)
                                }}>Cancelled ({cancelledCount})</button>
                            </div>
                        }

                        <div className="bg-gray-200 w-30 h-12 rounded-lg flex items-center justify-around " >
                            <button className={`p-2  rounded-lg ${state.TypeTab === "List" ? "bg-white " : ""}`} onClick={() => {
                                dispatch({ type: "TypeTab", payload: "List" })


                            }}>List </button>

                            <button className={`p-2  rounded-lg ${state.TypeTab === "Scheduler" ? "bg-white" : ""}`} onClick={() => {
                                dispatch({ type: "TypeTab", payload: "Scheduler" })

                            }}>Schedule </button>

                        </div>
                    </div>
                    {user.role === "doctor" && state.TypeTab === "List" &&
                        <div className="relative mt-5">
                            <Search color="#ababab" size={22} className="absolute top-3 left-2" />
                            <SearchInput onChang={change} placeHolder="Appointment By Patient Name" />
                            {state.Query && state.Dropdown && filteredAppointments.length > 0 && (
                                <ul className="mb-5 absolute z-50 mt-2 w-full bg-gray-100 
                                    ring-2 ring-gray-300 rounded-xl shadow-lg 
                                    max-h-60 overflow-y-auto sm:w-80 md:w-96">

                                    {filteredAppointments.slice(0, 5).map((item) => (
                                        <li key={item.id} className="px-4 py-3 cursor-pointer text-sm 
                                        hover:bg-[#23a997] hover:text-white 
                                        transition rounded-lg"  onClick={() => {
                                                dispatch({ type: "Query", payload: getPatientName(item.patientId) })
                                                dispatch({ type: "Dropdown" })
                                            }}>{getPatientName(item.patientId)}</li>

                                    ))}
                                </ul>
                            )}
                        </div>
                    }

                    {filteredAppointments.length === 0 && state.TypeTab === "List" ? <div className="text-gray-500 text-lg font-semibold p-20 text-center">No {state.ActiveTab[0].toUpperCase()}{state.ActiveTab.slice(1)} Appointments Found</div> : ""}

                    {state.TypeTab === "List" && currentAppointments.map((app) => (

                        <AppointmentItem
                            key={app.id}
                            time={app.time}
                            duration={app.duration.toString()}
                            name={user.role === "doctor" ? getPatientName(app.patientId) : getUserName(app.doctorId)}
                            date={app.date}
                            type={app.type}
                            status={
                                app.status === "scheduled" ? (
                                    <div className="flex gap-x-0 lg:gap-4">
                                        <ScheduledAppointmentItem />
                                        {user.role === "doctor" &&
                                            <CircleCheckBig color="#1a7f72" size={26} className="hover:bg-sky-100 p-1 rounded-lg cursor-pointer"
                                                onClick={() => {
                                                    handleUpdateStatus(app.id, "completed")
                                                }}
                                            />
                                        }
                                        {user.role === "doctor" &&
                                            <CircleX color="#bd0000" size={26} className="hover:bg-sky-100 p-1 rounded-lg cursor-pointer"
                                                onClick={() => {
                                                    handleUpdateStatus(app.id, "cancelled")
                                                }}
                                            />
                                        }
                                    </div>
                                ) : app.status === "completed" ? (
                                    <CompletedAppointmentItem />
                                ) : (
                                    <CancelledAppointmentItem />
                                )
                            }
                        >
                            {user.role === "doctor" &&
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
                                        try {
                                            await axios.delete(`http://localhost:3000/appointment/${app.id}`);
                                            await refreshAppointments();
                                            toast.success("The appointment has been successfully deleted.");
                                        } catch {
                                            toast.error("Delete failed");
                                        }
                                    }}
                                />
                            }
                            {user.role === "doctor" &&
                                <Alert
                                    trigger={
                                        <Pencil />
                                    }
                                    icon={<Pencil />}
                                    title="Edit Appointment?"
                                    description="Are you sure you want to edit this Appointment?"
                                    confirmText="Edit"
                                    variant="default"
                                    onConfirm={async () => {

                                        dispatch({ type: "TypeDailog", payload: "edit" })
                                        dispatch({ type: "Dailog" })
                                        dispatch({ type: "Id", payload: app.id })

                                    }} />
                            }
                        </AppointmentItem>

                    ))}
                    {state.TypeTab == "Scheduler" &&
                        <div className="bg-gray-300 mt-10">
                            <SchedulePage />
                        </div>
                    }

                </main>

                {filteredAppointments.length !== 0 && state.TypeTab === "List" &&
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <PaginationPage totalPages={totalPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage} />
                    </div>
                }

            </div >




        </div >


    );
}