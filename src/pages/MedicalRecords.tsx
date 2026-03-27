import SidebarFooter from "../components/SidebarFooter";
import SidebarHeader from "../components/SidebarHeader";
import SidebarItem from "../components/SidebarItem";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Paragraph from "../components/Paragraph";
import { Link } from "react-router-dom";
import { LayoutDashboard, User, CalendarDays, Paperclip, Pill, ChartColumn, LogOut, Trash2Icon, Eye, Pencil } from "lucide-react"

import AddBtn from "@/components/AddBtn";
import Record from "@/components/Record";

import { useState, useContext, useMemo, useReducer, useEffect } from "react";
import axios from "axios";
import { DialogMedicalRecord } from "@/components/DialogMedicalRecord";
import { Alert } from "@/components/Alert";

import { UserContext } from "@/contexts/UserContext";
import { PatientContext } from "@/contexts/PatientContext";
import { MedicalRecordContext } from "@/contexts/MedicalRecordContext";

import type { TypeMedicalRecord } from "@/types/TypeMedicalRecord";
import type { TypeUser } from "@/types/TypeUser";
import type { TypePatient } from "@/types/TypePatient";
import PaginationPage from "@/components/PaginationPage";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
type State = {
    Menu: boolean;
    Dialog: boolean;
    TypeDialog: string;
    IdDialog: string;
};
type Action = { type: "TOGGLE_MENU" } |
{ type: "TOGGLE_DIALOG" } |
{ type: "TypeDialog", payload: string } |
{ type: "IdDialog", payload: string };



function reducer(state: State, action: Action) {

    const typeAction = action.type;
    if (typeAction === "TOGGLE_MENU") {
        return { ...state, Menu: !state.Menu };
    }
    else if (typeAction === "TOGGLE_DIALOG") {
        return { ...state, Dialog: !state.Dialog };
    }
    else if (typeAction === "TypeDialog") {
        return { ...state, TypeDialog: action.payload }
    }
    else if (typeAction === "IdDialog") {
        return { ...state, IdDialog: action.payload }
    }
    else {
        return state
    }
}
export function MedicalRecords() {

    const [state, dispatch] = useReducer(reducer, {
        Menu: false,
        Dialog: false,
        TypeDialog: "add",
        IdDialog: ""
    });

    const [currentPage, setCurrentPage] = useState<number>(1);

    // Context API
    const { users } = useContext(UserContext)!;
    const { patients } = useContext(PatientContext)!;
    const { records, refreshRecords, loading } = useContext(MedicalRecordContext)!;



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

    const filteredMedicalRecordsByRole = useMemo(() => {
        const getUserIdForPatient = (patientId: string) => {
            const patient = patients.find(p => p.id === patientId)
            return patient?.userId
        }

        return records.filter((item: TypeMedicalRecord) =>
            user.role === "doctor" ? item.doctorId === user.id : getUserIdForPatient(item.patientId) === user.id
        )
    }, [patients, records, user])


    function getName(userId: string) {
        const userData = users.find((u: TypeUser) => {
            return u.id === userId;
        })
        return userData ? userData.name : "";
    }


    useEffect(() => {
        refreshRecords();
    }, [state]);

    const rowsPerPage = 4;
    const lastIndex = currentPage * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;
    const currentRecords = filteredMedicalRecordsByRole.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(filteredMedicalRecordsByRole.length / rowsPerPage);


    return (
        <div className="flex h-screen relative overflow-hidden">
            {loading && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
                    <Loading />
                </div>
            )}
            <DialogMedicalRecord
                open={state.Dialog}
                setOpen={() => dispatch({ type: "TOGGLE_DIALOG" })}
                type={state.TypeDialog}
                MedicalRecordId={state.IdDialog}
            />

            {state.Menu && (
                <div
                    onClick={() => dispatch({ type: "TOGGLE_MENU" })}
                    className="fixed inset-0 bg-black/30 z-20 md:hidden"
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
                    <SidebarHeader title="MedPractice" subTitle="Management System" cancle={() => dispatch({ type: "TOGGLE_MENU" })} />

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

                <Header name={user.name} click={() => {

                    dispatch({ type: "TOGGLE_MENU" })
                }
                } />

                <main className="flex-1  p-4 md:p-6 overflow-y-auto">
                    <div className="flex justify-between items-center ">
                        <div className="flex flex-col gap-3">
                            <Heading title="Medical Records" />
                            <Paragraph title="Patient medical documentation" />
                        </div>
                        {user.role === "doctor" &&
                            <AddBtn title="Add Medical Record" onClick={() => {
                                dispatch({ type: "TOGGLE_DIALOG" })
                                dispatch({ type: "TypeDialog", payload: "add" })
                            }
                            } />
                        }    </div>

                    <div className="mt-8 grid grid-cols-1   lg:grid-cols-2 gap-4">
                        {

                            currentRecords.map((item: TypeMedicalRecord) => {
                                const patient = patients.find((p: TypePatient) => p.id === item.patientId)

                                return (

                                    <Record
                                        key={item.id}
                                        doctorName={`${user.role === "doctor" ? user.name : getName(item.doctorId)}`}
                                        patinetName={patient?.name || ""}
                                        phone={patient?.phone || ""}
                                        bloodType={patient?.bloodType || ""}
                                        notes={item.notes}
                                        status={patient?.status || ""}
                                        lastVisit={item.visitDate}
                                    >
                                        <div className="flex justify-between items-center gap-x-2" >
                                            <Link to={`../medical-records/${item.id}`} key={item.id}>

                                                <div className="inline-flex items-center gap-x-2 bg-gray-200 px-3 py-1 rounded-2xl hover:text-[#1a7f72] transition duration-200 ">
                                                    <Eye color="#1a7f72" size={20} />
                                                    <span className="text-sm ">View</span>
                                                </div>
                                            </Link>
                                            {user.role === "doctor" &&
                                                <div className="flex  gap-3 ">
                                                    <Alert
                                                        trigger={
                                                            <Trash2Icon size={28} />
                                                        }
                                                        icon={<Trash2Icon />}
                                                        title="Delete Medical Record?"
                                                        description="Are you sure you want to delete this Medical Record?"
                                                        confirmText="Delete"
                                                        variant="destructive"
                                                        onConfirm={async () => {
                                                            await axios.delete(`https://69c6a792f272266f3eacee2b.mockapi.io/medicalRecords/${item.id}`);
                                                            await refreshRecords();
                                                            toast.success("The medical record has been successfully deleted.");

                                                        }} />
                                                    <Alert
                                                        trigger={
                                                            <Pencil size={28} />
                                                        }
                                                        icon={<Pencil />}
                                                        title="Edit Medical Record??"
                                                        description="Are you sure you want to edit this Medical Record??"
                                                        confirmText="Edit"
                                                        variant="default"
                                                        onConfirm={async () => {
                                                            dispatch({ type: "TypeDialog", payload: "edit" })
                                                            dispatch({ type: "IdDialog", payload: item.id })
                                                            dispatch({ type: "TOGGLE_DIALOG" })

                                                        }}
                                                    />


                                                </div>
                                            }
                                        </div>

                                    </Record>


                                )

                            })

                        }

                    </div>



                    {/* pagination */}
                    {filteredMedicalRecordsByRole?.length != 0 &&
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