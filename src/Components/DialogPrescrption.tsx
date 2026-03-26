import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useState, useEffect, useContext } from "react"
import axios from "axios"

import toast from "react-hot-toast"
import { PatientContext } from "@/contexts/PatientContext"
import { PrescriptionContext } from "@/contexts/PrescriptionContext"
import Loading from "./Loading"
type Props = {
    type?: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    prescriptionId: string;
}

const defaultForm = {
    patientId: "",
    doctorId: "",
    medication: "",
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: "",
    status: "active"
};

const API_URL = "https://medicalsystem-api.free.beeceptor.com/";

export function DialogPrescrption({ type, open, setOpen, prescriptionId }: Props) {

    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const { patients } = useContext(PatientContext)!;
    const { prescriptions } = useContext(PrescriptionContext)!;
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
        doctorId: user.id,
        medication: "",
        dosage: "",
        frequency: "",
        startDate: "",
        endDate: "",
        status: "active"
    })



    useEffect(() => {
        if (!open) return;
        if (type === "edit") {
            const filterPrescription = prescriptions.find((p) => p.id === prescriptionId)
            if (filterPrescription) {
                setForm(filterPrescription);
            } else {
                setForm(defaultForm);
            }
        }

        if (type === "add") {
            setForm({ ...defaultForm, doctorId: user.id });
        }

    }, [open, type, prescriptionId, prescriptions]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoadingSubmit(true);
        e.preventDefault();
        try {
            if (type === "edit") {
                await axios.put(`${API_URL}/prescription/${prescriptionId}`, form);
                toast.success("The prescription has been successfully updated.");
            } else {
                await axios.post(`${API_URL}/prescription`, form);
                toast.success("The prescription has been added successfully.");

            }

            setOpen(false)
        } catch (error) {
            console.error("Error:", error)
            toast.error("There was an error. Please try again.");
        }
        finally {
            setLoadingSubmit(false);
        }
    }

    const isFormValid = () => {
        return (
            form.patientId &&
            form.medication &&
            form.dosage &&
            form.frequency &&
            form.startDate &&
            form.endDate
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
                        <DialogTitle className="text-2xl mb-4 font-semibold">{type === "edit" ? "Edit" : "Add"} Prescription</DialogTitle>
                    </DialogHeader>

                    <FieldGroup className="grid grid-cols-1 sm:grid-cols-2  gap-6">


                        <Field className="col-span-1">
                            <Label>Patient Name</Label>
                            <Select value={form.patientId}
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

                        <Field className="col-span-1" >
                            <Label>Medication</Label>
                            <Input name="medication" value={form.medication} onChange={handleChange} required className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-[#23a997]" />
                        </Field>


                        <Field>
                            <Label>Dosage</Label>
                            <Input name="dosage" value={form.dosage} onChange={handleChange} type="text" required className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-[#23a997]" />
                        </Field>
                        <Field>
                            <Label>Frequency</Label>
                            <Input name="frequency" value={form.frequency} onChange={handleChange} type="text" required className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-[#23a997]" />
                        </Field>
                        <Field>
                            <Label>Start date</Label>
                            <Input name="startDate" value={form.startDate} onChange={handleChange} type="date" required className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-[#23a997]" />
                        </Field>
                        <Field>
                            <Label>End date</Label>
                            <Input name="endDate" value={form.endDate} onChange={handleChange} type="date" required className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-[#23a997]" />
                        </Field>


                    </FieldGroup>

                    <DialogFooter>
                        <Button disabled={!isFormValid() || loadingSubmit} type="submit" className="bg-[#3ea194] mt-5 text-gray-50 w-full rounded-lg hover:bg-[#1a7f72] duration-300 transition">
                            {loadingSubmit ? (
                                <span className="flex items-center gap-2">
                                    <Loading /> Saving...
                                </span>
                            ) : (
                                type === "edit" ? "Edit Prescription" : "Add Prescription"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}