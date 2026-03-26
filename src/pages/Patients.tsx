import { CalendarDays, ChartColumn, FunnelPlus, LayoutDashboard, LogOut, Paperclip, Pill, Search, User } from "lucide-react";
import AddBtn from "../Components/AddBtn";
import Header from "../Components/Header";
import Heading from "../Components/Heading";
import Paragraph from "../Components/Paragraph";
import SidebarFooter from "../Components/SidebarFooter";
import SidebarItem from "../Components/SidebarItem";
import SidebarHeader from "../Components/SidebarHeader";
import { Link } from "react-router-dom";
import { useState, useMemo, useContext, useEffect, useReducer } from "react";

import { useNavigate } from "react-router-dom";
import SearchInput from "../Components/SearchInput";
import { DialogPatient } from "@/Components/DialogPatient";
import PaginationPage from "@/Components/PaginationPage";

import { UserContext } from "../contexts/UserContext";
import { PatientContext } from "@/contexts/PatientContext";

import type { TypeUser } from "@/types/TypeUser";
import type { TypePatient } from "@/types/TypePatient";
import Loading from "@/Components/Loading";


type typeState = {
    ActiveTab: string;
    Menu: boolean;
    Dialog: boolean;
    Query: string;
};
type typeAction = { type: "ActiveTab"; payload: string } |
{ type: "Menu"; } |
{ type: "Dialog" } |
{ type: "Query"; payload: string };

function reducer(state: typeState, action: typeAction) {
    if (action.type === "ActiveTab") {
        return { ...state, ActiveTab: action.payload }
    }
    else if (action.type === "Menu") {
        return { ...state, Menu: !state.Menu }
    }
    else if (action.type === "Dialog") {
        return { ...state, Dialog: !state.Dialog }
    }
    else if (action.type === "Query") {
        return { ...state, Query: action.payload }
    }
    else return state;
}
export default function Patients() {

    const [state, disPatch] = useReducer(reducer, {
        ActiveTab: "all",
        Menu: false,
        Dialog: false,
        Query: "",
    })


    const { users } = useContext(UserContext)!;
    const { patients, refreshPatients, loading } = useContext(PatientContext)!;



    /* pagination */
    const [currentPage, setCurrentPage] = useState<number>(1);
    const rowsPerPage = 4;

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

    const navigate = useNavigate();


    const filterPatientsStatus = useMemo(() => {
        if (state.ActiveTab === "all") {
            return patients;
        }
        return patients.filter((p) => p.status === state.ActiveTab);
    }, [patients, state.ActiveTab])


    const search = state.Query.toLowerCase();

    const patientsData = filterPatientsStatus.filter((item: TypePatient) =>
        item.name.toLowerCase().includes(search)
    );



    function getEmail(patientId: string) {
        const userData = users.find((u: TypeUser) => u.id === patientId)
        return userData ? userData?.email : "";
    }

    /* pagination calculations */

    const lastIndex = currentPage * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;
    const currentPatients = patientsData.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(patientsData.length / rowsPerPage);

    const change = (value: string) => {
        disPatch({ type: "Query", payload: value })
        setCurrentPage(1);
    }
    useEffect(() => {
        if (state.Dialog) {
            refreshPatients();
        }
    }, [state.Dialog])

    return (

        <div className="flex h-screen relative overflow-hidden">

            {loading && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
                    <Loading />
                </div>
            )}

            {/* Dialogs */}
            <DialogPatient type="add" open={state.Dialog} setOpen={() => disPatch({ type: "Dialog" })} />
            {/* ====Dialogs==== */}

            {state.Menu && (
                <div
                    onClick={() => disPatch({ type: "Menu" })}
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

                    <SidebarHeader title="MedPractice" subTitle="Management System" cancle={() => disPatch({ type: "Menu" })} />

                    <ul className="space-y-2 mt-8">

                        <Link to="../">
                            <SidebarItem icon={<LayoutDashboard color="#828282" />} title="Dashboard" />
                        </Link>

                        <Link to="">
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

                    <SidebarFooter role="Dr. " username={`${user.name}`} job="Doctor" />

                    <Link to="/">
                        <LogOut color="#104c44" size={26} strokeWidth={2.75} onClick={() => localStorage.clear()} />
                    </Link>

                </div>

            </aside>

            <div className="flex-1 flex flex-col pb-10">

                <Header name={user.name} click={() => disPatch({ type: "Menu" })} />

                <main className="flex-1 p-4 md:p-6 overflow-y-auto">

                    <div className="flex justify-between items-center">

                        <div className="flex flex-col gap-2">
                            <Heading title="Patients" />
                            <Paragraph title={`${patientsData.length} patients registered`} />
                        </div>

                        <div>
                            <AddBtn title="Add Patient" onClick={() => disPatch({ type: "Dialog" })} />
                        </div>

                    </div>

                    <div className="flex flex-col gap-4">

                        <div className="relative">

                            <Search color="#ababab" size={22} className="absolute top-3 left-2" />

                            <SearchInput onChang={change} placeHolder="Patient" />

                            {state.Query && patientsData.length > 0 && (
                                <ul className="absolute z-50 mt-2 w-full bg-gray-100 ring-2 ring-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                    {patientsData.slice(0, 5).map((patient) => (
                                        <li
                                            key={patient.id}
                                            onClick={() => {
                                                // setQuery(patient.name);  
                                                disPatch({ type: "Query", payload: patient.name })
                                                navigate(`/doctor-dashboard/patients/${patient.id}/view`);
                                            }}
                                            className="px-4 py-3 cursor-pointer text-sm hover:bg-[#23a997] hover:text-white transition rounded-lg"
                                        >
                                            {patient.name}
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </div>

                        <div className="flex gap-4 items-center">

                            <FunnelPlus color="#23a997" />

                            <div className="flex gap-2">

                                <button className={`px-3 py-2 rounded-2xl text-sm border ${state.ActiveTab == "all" ? "bg-[#23a997] text-white" : "bg-gray-200"}`} onClick={() => { disPatch({ type: "ActiveTab", payload: "all" }); setCurrentPage(1); }}>All</button>

                                <button className={`px-3 py-2 rounded-2xl text-sm border ${state.ActiveTab == "active" ? "bg-[#23a997] text-white" : "bg-gray-200"}`} onClick={() => { disPatch({ type: "ActiveTab", payload: "active" }); setCurrentPage(1); }}>Active</button>

                                <button className={`px-3 py-2 rounded-2xl text-sm border ${state.ActiveTab == "inactive" ? "bg-[#23a997] text-white" : "bg-gray-200"}`} onClick={() => { disPatch({ type: "ActiveTab", payload: "inactive" }); setCurrentPage(1); }}>Inactive</button>

                                <button className={`px-3 py-2 rounded-2xl text-sm border ${state.ActiveTab == "critical" ? "bg-[#23a997] text-white" : "bg-gray-200"}`} onClick={() => { disPatch({ type: "ActiveTab", payload: "critical" }); setCurrentPage(1); }}>Critical</button>

                            </div>

                        </div>

                    </div>

                    <table className="mt-8 w-full border-collapse bg-white rounded-xl overflow-hidden shadow-lg">

                        <thead className="bg-gray-50 border-b border-gray-400">
                            <tr className="text-gray-400 text-xs uppercase">
                                <th className="px-6 py-4 text-left">Name</th>
                                <th className="px-6 py-4 text-left hidden md:table-cell">Contact</th>
                                <th className="px-6 py-4 text-left hidden xl:table-cell">Blood Type</th>
                                <th className="px-6 py-4 text-left">Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {currentPatients.map((item) => (

                                <tr
                                    key={item.id}
                                    className="cursor-pointer border-b border-gray-300 hover:bg-gray-100 transition"
                                    onClick={() => navigate(`/doctor-dashboard/patients/${item.id}/view`)}
                                >

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">

                                            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-teal-100 text-teal-600 font-semibold">
                                                {item.name[0].toUpperCase() + item.name[1].toUpperCase()}
                                            </span>

                                            <div>
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">{item.gender} {item.bloodType}</p>
                                            </div>

                                        </div>
                                    </td>

                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <p className="text-gray-900">{getEmail(item.userId)}</p>
                                        <p className="text-sm text-gray-500">{item.phone}</p>
                                    </td>

                                    <td className="px-6 py-4 text-gray-800 hidden xl:table-cell">{item.bloodType}</td>


                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 text-sm font-medium rounded-full 
                                            ${item.status.toLowerCase() == "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : item.status.toLowerCase() == "inactive"
                                                        ? "bg-gray-200 text-gray-500"
                                                        : "bg-red-100 text-red-600"}`}
                                        >
                                            {item.status[0].toUpperCase() + item.status.slice(1)}
                                        </span>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    {patientsData.length === 0 && (
                        <h1 className="text-xl text-gray-500 text-center mt-10">
                            No patients found.
                        </h1>
                    )}

                    {/* pagination */}
                    {patientsData.length !== 0 &&

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