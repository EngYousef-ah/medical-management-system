import SidebarFooter from "../components/SidebarFooter";
import SidebarHeader from "../components/SidebarHeader";
import SidebarItem from "../components/SidebarItem";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Paragraph from "../components/Paragraph";
import axios from 'axios';

import { Link } from "react-router-dom";
import { useState, useContext, useMemo, useEffect, useReducer } from "react";

import { LayoutDashboard, User, CalendarDays, Paperclip, Pill, ChartColumn, LogOut, Search, Pencil, Trash2Icon } from "lucide-react"
import SearchInput from "../components/SearchInput";
import { Alert } from "@/components/Alert";
import AddBtn from "@/components/AddBtn";
import { DialogPrescrption } from "@/components/DialogPrescrption";
import PaginationPage from "@/components/PaginationPage";

import type { TypePrescription } from "@/types/TypePrescription";


import { UserContext } from "../contexts/UserContext";
import { PatientContext } from "@/contexts/PatientContext";
import { PrescriptionContext } from "@/contexts/PrescriptionContext";
import toast from "react-hot-toast";
import EmptyState from "@/components/EmptyState";
import Loading from "@/components/Loading";

const intialValues = {
    Menu: false,
    Dialog: false,
    Dropdown: false,
    TypeDialog: "add",
    Query: "",
    Id: "",
};

type typeState = {
    Menu: boolean;
    Dialog: boolean;
    Dropdown: boolean;
    TypeDialog: string;
    Query: string;
    Id: string;
};

type typeAction = { type: "Menu" } |
{ type: "Dialog" } |
{ type: "Dropdown" } |
{ type: "TypeDialog"; payload: string } |
{ type: "Query"; payload: string } |
{ type: "Id", payload: string };

function reducer(state: typeState, action: typeAction) {
    const ActionType = action.type;
    if (ActionType === "Menu") {
        return { ...state, Menu: !state.Menu }
    }
    else if (ActionType === "Dialog") {
        return { ...state, Dialog: !state.Dialog }
    }
    else if (ActionType === "Dropdown") {
        return { ...state, Dropdown: !state.Dropdown }
    }
    else if (ActionType === "TypeDialog") {
        return { ...state, TypeDialog: action.payload }
    }
    else if (ActionType === "Query") {
        return { ...state, Query: action.payload }
    }
    else if (ActionType === "Id") {
        return { ...state, Id: action.payload }
    }

    else return state;

}
export function Prescriptions() {

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [state, dispatch] = useReducer(reducer, intialValues);


    const { users } = useContext(UserContext)!;
    const { patients } = useContext(PatientContext)!;
    const { prescriptions, refreshPrescriptions, loading } = useContext(PrescriptionContext)!;




    const user = (() => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return { id: "", name: "", role: "" };
            }
            const userData = JSON.parse(atob(token));
            return {
                id: userData?.id ?? "",
                name: userData?.name ?? "",
                role: userData?.role ?? ""
            };
        } catch {
            return { id: "", name: "", role: "" };
        }
    })();
    const allPrescription = useMemo(() => {
        if (patients.length === 0) return [];

        if (user.role === "doctor") {

            const data = prescriptions.filter((item: TypePrescription) => {
                return item.doctorId === user.id
            })

            return data;

        }
        else {
            const patient = patients.find(p => p.userId === user.id)

            if (!patient) return

            const data = prescriptions.filter((item: TypePrescription) => {
                return item.patientId === patient.id
            })
            return data;
        }
    }, [patients, prescriptions, user])

    const filterData = allPrescription?.filter((item: TypePrescription) => {
        return item.medication.toLowerCase().includes(state.Query.toLowerCase());
    })


    const change = (value: string) => {
        dispatch({ type: "Query", payload: value })
        dispatch({ type: "Dropdown" })
    }

    const rowsPerPage = 4;
    const lastIndex = currentPage * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;
    const currentPrescriptions = filterData?.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(filterData?.length ? 1 : 0 / rowsPerPage);

    function getPatientName(patientId: string) {
        const patient = patients.find(p => p.id === patientId);
        return patient ? patient.name : "";
    }
    const getUserName = (userId: string) => {
        const user = users.find(u => u.id === userId);
        return user ? user.name : "";
    }
    // UseEffect To Refresh data Prescriptions//
    useEffect(() => {
        if (state.TypeDialog === "edit" && state.Id) {
            refreshPrescriptions();
        }
        else if (state.TypeDialog === "add") {
            refreshPrescriptions();
        }
    }, [state]);
    return (

        <div className="flex h-screen relative overflow-hidden">
            {/* Loading page */}
            {loading ? <Loading /> : ""}

            {/* DIALOGS */}
            <DialogPrescrption open={state.Dialog} setOpen={() => dispatch({ type: "Dialog" })} type={state.TypeDialog} prescriptionId={state.Id} />
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
                    {user.role === "doctor" ? <SidebarFooter role="Dr. " username={user.name} job="Doctor" /> :
                        <SidebarFooter role="" username={user.name} job="Patient" />}


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
                            <Heading title="Prescriptions" />
                            <Paragraph title={`${filterData?.length} prescriptions on file`} />
                        </div>
                        {user.role === "doctor" &&
                            <AddBtn title="Add Prescription" onClick={() => {
                                dispatch({ type: "TypeDialog", payload: "add" })
                                dispatch({ type: "Dialog" })
                            }} />
                        }

                    </div>


                    <div className="relative mb-8">
                        <Search color="#ababab" size={22} className="absolute top-3 left-2" />
                        <SearchInput onChang={change} placeHolder="prescription" />
                        {state.Query && state.Dropdown && (filterData?.length ?? 0) > 0 && (
                            <ul
                                className="mb-5 absolute z-50 mt-2 w-full bg-gray-100 
                                    ring-2 ring-gray-300 rounded-xl shadow-lg 
                                    max-h-60 overflow-y-auto sm:w-80 md:w-96"
                            >
                                {filterData?.slice(0, 5).map((item) => (
                                    <li
                                        key={item.id}
                                        onClick={() => {
                                            dispatch({ type: "Query", payload: item.medication });
                                            dispatch({ type: "Dropdown" })
                                        }}
                                        className="px-4 py-3 cursor-pointer text-sm 
                                            hover:bg-[#23a997] hover:text-white 
                                            transition rounded-lg"
                                    >
                                        {item.medication}
                                    </li>
                                ))}
                            </ul>
                        )}


                    </div>

                    <div className="grid grid-cols-1   lg:grid-cols-2 gap-6">
                        {currentPrescriptions?.map((item) => (
                            <div key={item.id} className="bg-gray-50 py-5 pl-7.5 pr-20 rounded-2xl shadow-xl inline-flex flex-col gap-y-4 relative">
                                <div className={`absolute top-5 right-7 ${item.status !== "active" ? "bg-gray-600" : " bg-[#1a7f72]"} py-1 px-4 rounded-2xl text-white`}>{item.status}</div>
                                <div className="flex flex-col ">
                                    <h2 className="text-xl font-semibold">{item.medication}</h2>
                                    <p className="text-gray-500">{item.dosage} · {item.frequency}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Patient:<span className="text-gray-800 font-semibold">{getPatientName(item.patientId)}</span> </p>
                                    <p className="text-gray-500">Prescribed by: {getUserName(item.doctorId)}</p>
                                    <p className="text-gray-500"> {item.startDate} → {item.endDate}</p>
                                </div>
                                {user.role === "doctor" &&
                                    <div className="inline-flex gap-2 ">
                                        <Alert
                                            trigger={
                                                <Trash2Icon size={32} />
                                            }
                                            icon={<Trash2Icon />}
                                            title="Delete Prescription?"
                                            description="Are you sure you want to delete this Prescription?"
                                            confirmText="Delete"
                                            variant="destructive"
                                            onConfirm={async () => {
                                                await axios.delete(`https://69c68e89f272266f3eacc5b5.mockapi.io/prescription/${item.id}`);
                                                toast.success("The prescription has been successfully deleted.");
                                                await refreshPrescriptions()
                                            }} />


                                        <Alert
                                            trigger={
                                                <Pencil size={32} />
                                            }
                                            icon={<Pencil />}
                                            title="Edit Prescription?"
                                            description="Are you sure you want to edit this Prescription?"
                                            confirmText="Edit"
                                            variant="default"
                                            onConfirm={async () => {
                                                dispatch({ type: "TypeDialog", payload: "edit" })
                                                dispatch({ type: "Dialog" })
                                                dispatch({ type: "Id", payload: item.id })
                                            }}
                                        />
                                    </div>
                                }

                            </div>
                        ))}
                    </div>



                    {filterData?.length === 0 ? <EmptyState text="No Prescriptions Found." /> : ""}

                    {/* pagination */}
                    {filterData?.length != 0 &&
                        <div className="flex justify-center items-center gap-2 mt-6">
                            <PaginationPage totalPages={totalPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage} />
                        </div>
                    }
                </main>

            </div>
        </div>
    );
}