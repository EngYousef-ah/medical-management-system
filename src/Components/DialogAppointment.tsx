import { Button } from "@/Components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from "@/Components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/Components/ui/select"
import { Field, FieldGroup } from "@/Components/ui/field"
import { Input } from "@/Components/ui/input"
import { Label } from "@/components/ui/label"

import { useState, useEffect, useContext } from "react"
import axios from "axios"

// Importing Library Day.js
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import toast from "react-hot-toast"
import { PatientContext } from "@/contexts/PatientContext"
import { AppointmentContext } from "@/contexts/AppointmentContext"
import Loading from "./Loading"

type Props = {
    type?: string;
    open: boolean;
    setOpen: (open: boolean) => void
    appointmentId?: string;
}

const types = ["checkup", "follow-up", "consultation", "procedure", "Emergency"]

export function DialogAppointment({ type, open, setOpen, appointmentId }: Props) {
    const { patients } = useContext(PatientContext)!;
    const { appointments } = useContext(AppointmentContext)!;
    const [loadingSubmit, setLoadingSubmit] = useState(false);



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

    const [form, setForm] = useState({
        patientId: "",
        date: "",
        time: "5",
        duration: "",
        type: "",
        status: "scheduled"
    })

    const defaultForm = {
        doctorId: user.id,
        patientId: "",
        date: "",
        time: "",
        duration: "",
        type: "",
        status: "scheduled"
    };

    useEffect(() => {
        if (!open) return;
        if (type === "edit" && appointmentId) {
            const found = appointments.find((a) => a.id === appointmentId);

            if (found) {
                setForm(found);
            } else {
                setForm(defaultForm);
            }
        }
        if (type === "add") {
            setForm(defaultForm);
        }

    }, [open, type, appointmentId, appointments])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoadingSubmit(true);
        e.preventDefault();
        try {
            const data = { ...form, doctorId: user.id }

            if (!appointmentId) {
                await axios.post("http://localhost:3000/appointment", data)
                toast.success("The appointment has been added successfully.");
            } else {
                await axios.put(`http://localhost:3000/appointment/${appointmentId}`, data)
                toast.success("The appointment has been successfully updated.");
            }
            setOpen(false)

        } catch (error) {
            console.error(error);
            toast.error("There was an error. Please try again.");
        } finally {
            setLoadingSubmit(false);
        }
    }

    const isFormValid = () => {
        return (
            form.patientId &&
            form.duration &&
            form.date &&
            form.time &&
            form.status &&
            form.type
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {loadingSubmit && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
                    <Loading />
                </div>
            )}

            <DialogContent className="sm:max-w-lg bg-white/90 rounded-2xl p-6">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl mb-4 font-semibold">Schedule Appointment</DialogTitle>
                    </DialogHeader>

                    <FieldGroup className="grid grid-cols-1 sm:grid-cols-2  gap-6">
                        <Field className="col-span-2">
                            <Label>Patient</Label>
                            <Select required value={form.patientId}
                                onValueChange={(value) =>
                                    setForm({ ...form, patientId: value })
                                }>
                                <SelectTrigger className="pl-10 mb-2 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-[#23a997]">
                                    <SelectValue placeholder="Select Patient" />
                                </SelectTrigger>
                                <SelectContent side="bottom" position="popper">
                                    <SelectGroup className=" bg-gray-100" >
                                        {patients
                                            .map(p => (
                                                <SelectItem key={p.id} value={p.id} className="focus:bg-sky-100 focus:text-gray-700">
                                                    {p.name}
                                                </SelectItem>
                                            ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field className="col-span-2 sm:col-span-1">
                            <Label>Date</Label>
                            <Input name="date" value={form.date} onChange={handleChange} type="date" required className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-[#23a997]" />
                        </Field>

                        <Field className="col-span-2 sm:col-span-1">
                            <Label>Time</Label>
                            <Input name="time" value={form.time} onChange={handleChange} type="time" required className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-[#23a997]" />
                        </Field>

                        <Field className="col-span-2 sm:col-span-1">
                            <Label>Duration (min)</Label>
                            <Input name="duration" value={form.duration} onChange={handleChange} type="number" min={0} max={100} required className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-[#23a997]" />
                        </Field>

                        <Field className="col-span-2 sm:col-span-1">
                            <Label>Type</Label>
                            <Select value={form.type}
                                onValueChange={(value) =>
                                    setForm({ ...form, type: value })
                                }>
                                <SelectTrigger className="pl-10 mb-2 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-[#23a997]">
                                    <SelectValue placeholder="Select Patient" />
                                </SelectTrigger>
                                <SelectContent side="bottom" position="popper">
                                    <SelectGroup className=" bg-gray-100" >
                                        {types.map(item => (
                                            <SelectItem key={item} value={item} className="focus:bg-sky-100 focus:text-gray-700">
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>


                    </FieldGroup>

                    <DialogFooter>
                        <Button disabled={!isFormValid() || loadingSubmit} type="submit" className="bg-[#3ea194] mt-5 text-gray-50 w-full rounded-lg hover:bg-[#1a7f72] duration-300 transition">
                            {loadingSubmit ? (
                                <span className="flex items-center gap-2">
                                    <Loading  /> Saving...
                                </span>
                            ) : (
                                type === "edit" ? "Edit Medical Record" : "Add Medical Record"
                            )} Appointment
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}