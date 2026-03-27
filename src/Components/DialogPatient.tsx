import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { useState, useEffect, useContext } from "react"
import axios from "axios"

import { PatientContext } from "@/contexts/PatientContext";
import { UserContext } from "@/contexts/UserContext"

import type { TypePatient } from "@/types/TypePatient"
import type { TypeUser } from "@/types/TypeUser"
import toast from "react-hot-toast"
import Loading from "./Loading"

type Props = {
    type: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    patientId?: string;
}

const defaultPatient = {
    userId: "",
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    address: "",
    status: ""
};
const API_URL = "https://69c59dee8a5b6e2dec2cb4d4.mockapi.io";

export function DialogPatient({ type, open, setOpen, patientId }: Props) {
    const { patients, refreshPatients } = useContext(PatientContext)!;
    const { users } = useContext(UserContext)!;
    const [loadingSubmit, setLoadingSubmit] = useState(false);


    const [freePatients, setFreePatients] = useState<TypeUser[]>([]);
    const [form, setForm] = useState({
        userId: "",
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        bloodType: "",
        address: "",
        status: ""
    })

    useEffect(() => {
        if (open) {
            if (type === "edit" && patientId) {
                const filterPatient = patients.find((p: TypePatient) => p.id === patientId);
                if (filterPatient) setForm(filterPatient);
            } else {
                setForm(defaultPatient);
            }
        }
    }, [patientId, patients, open, type]);


    useEffect(() => {
        const patientUserIds = new Set(patients.map((p: TypePatient) => p.userId));
        const free = users.filter((u: TypeUser) =>
            u.role === "patient" && (!patientUserIds.has(u.id) || u.id === form.userId)
        );
        setFreePatients(free);
    }, [users, patients, form.userId]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoadingSubmit(true);
        e.preventDefault()
        try {
            if (type == "edit") {
                await axios.put(`${API_URL}/patients/${patientId}`, form)
                refreshPatients();
                toast.success("The patient was successfully updated.");

            } else {
                await axios.post(`${API_URL}/patients`, form)
                refreshPatients();
                toast.success("The patient has been successfully added.");
            }
            setOpen(false)
        } catch (error) {
            console.error("Error:", error)
            toast.error("There was an error. Please try again.");
        } finally {
            setLoadingSubmit(false);
        }
    }

    const isFormValid = () => {
        return (
            form.userId &&
            form.name &&
            form.email &&
            form.phone &&
            form.dateOfBirth &&
            form.gender &&
            form.bloodType &&
            form.address &&
            form.status
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="sm:max-w-lg bg-white/90 rounded-2xl p-6">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl mb-4 font-semibold">{type == "edit" ? "Edit" : "Add"} Patient</DialogTitle>
                    </DialogHeader>

                    <FieldGroup className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                        <Field className="col-span-2 sm:col-span-1">
                            <Label>Name</Label>
                            <Select
                                value={form.userId}
                                onValueChange={(value) => {
                                    const selectedPatient = freePatients.find((p) => p.id === value)
                                    setForm({
                                        ...form,
                                        userId: value,
                                        name: selectedPatient?.name || "",
                                        email: selectedPatient?.email || ""
                                    })
                                }}

                            >
                                <SelectTrigger className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-teal-500">
                                    <SelectValue placeholder="Select Patient Name" />
                                </SelectTrigger>

                                <SelectContent side="bottom" position="popper" >
                                    <SelectGroup >
                                        {freePatients.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field className="col-span-2 sm:col-span-1">
                            <Label>Email</Label>
                            <Input name="email" type="email" placeholder="Your Email" value={form.email} readOnly className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-teal-500" />
                        </Field>

                        <Field className="col-span-2 sm:col-span-1">
                            <Label>Phone</Label>
                            <Input name="phone" placeholder="Your Number Phone" value={form.phone} onChange={handleChange} required className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-teal-500" />
                        </Field>

                        <Field className="col-span-2 sm:col-span-1">
                            <Label>Date Of Birth</Label>
                            <Input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-teal-500" />
                        </Field>

                        <Field className="col-span-2 sm:col-span-1">
                            <Label>Gender</Label>
                            <Select
                                value={form.gender}
                                onValueChange={(value) =>
                                    setForm({ ...form, gender: value })
                                }
                            >
                                <SelectTrigger className="pl-10 mb-2 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-teal-500">
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent side="bottom" position="popper">
                                    <SelectGroup className=" bg-gray-100">
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field className="col-span-2 sm:col-span-1">
                            <Label>Blood Type</Label>
                            <Input name="bloodType" placeholder="Your Blood Type" value={form.bloodType} onChange={handleChange} required className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-teal-500" />
                        </Field>

                        <Field className="col-span-2">
                            <Label>Address</Label>
                            <Input name="address" placeholder="Your Address" value={form.address} onChange={handleChange} required className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-teal-500" />
                        </Field>
                        <Field className="col-span-2">
                            <Label>Status</Label>

                            <RadioGroup
                                value={form.status}
                                onValueChange={(value) =>
                                    setForm({ ...form, status: value })
                                }
                                className="flex gap-6 mt-2 not-"
                            >
                                <div className="flex items-center space-x-2 ">
                                    <RadioGroupItem value="active" id="active" className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-1 rounded shadow-lg border-none outline-none focus:ring-2 focus:ring-teal-500" />
                                    <Label htmlFor="active" >Active</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="inactive" id="inactive" className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-1 rounded shadow-lg border-none outline-none focus:ring-2 focus:ring-teal-500" />
                                    <Label htmlFor="inactive">Inactive</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="critical" id="critical" className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-1 rounded shadow-lg border-none outline-none focus:ring-2 focus:ring-teal-500" />
                                    <Label htmlFor="critical">Critical</Label>
                                </div>
                            </RadioGroup>
                        </Field>



                    </FieldGroup>

                    <DialogFooter>
                        <Button disabled={!isFormValid() || loadingSubmit} type="submit" className="bg-[#3ea194] mt-5 text-gray-50 w-full rounded-lg hover:bg-[#1a7f72] duration-300 transition">
                            {loadingSubmit ? (
                                <span className="flex items-center gap-2">
                                    <Loading /> Saving...
                                </span>
                            ) : (
                                type === "edit" ? "Edit Patient" : "Add Patient"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}