import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useState, useEffect, useContext } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { UserContext } from "@/contexts/UserContext"
import { PatientContext } from "@/contexts/PatientContext"
import { MedicalRecordContext } from "@/contexts/MedicalRecordContext"
import Loading from "./Loading"

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  type?: string;
  MedicalRecordId?: string;
}

type typeMedicalRecord = {
  patientId: string
  doctorId: string
  visitDate: string
  diagnosis: string
  symptoms: string
  treatment: string
  notes: string
  status: string
}

type typeFreePatient = {
  id: string
  name: string
}
const API_URL = "https://69c6a792f272266f3eacee2b.mockapi.io";

export function DialogMedicalRecord({ open, setOpen, type, MedicalRecordId }: Props) {
  const user = (() => {
    try {
      const dataFromLocal = localStorage.getItem("user")
      if (!dataFromLocal) return { id: "", name: "", role: "" }

      const dataParsed = JSON.parse(dataFromLocal)

      return {
        id: dataParsed?.id ?? "",
        name: dataParsed?.name ?? "",
        role: dataParsed?.role ?? ""
      }
    } catch {
      return { id: "", name: "", role: "" }
    }
  })()

  const [form, setForm] = useState<typeMedicalRecord>({
    patientId: "",
    doctorId: user.id,
    visitDate: "",
    diagnosis: "",
    symptoms: "",
    treatment: "",
    notes: "",
    status: "active",
  })
  const { users } = useContext(UserContext)!;
  const { patients } = useContext(PatientContext)!;
  const { records } = useContext(MedicalRecordContext)!;
  const [freePatients, setFreePatients] = useState<typeFreePatient[]>([])
  const [loadingSubmit, setLoadingSubmit] = useState(false);




  useEffect(() => {
    if (type === "edit" && MedicalRecordId) {
      const filterRecord = records.find((r) => r.id === MedicalRecordId)
      const filterPatient = patients.find((p) => p.id == filterRecord?.patientId)
      setForm({
        doctorId: user.id,
        patientId: filterPatient?.id || "",
        visitDate: filterRecord?.visitDate || "",
        diagnosis: filterRecord?.diagnosis || "",
        symptoms: filterRecord?.symptoms || "",
        treatment: filterRecord?.treatment || "",
        notes: filterRecord?.notes || "",
        status: filterPatient?.status || ""
      })
    }
    else {
      setForm({
        doctorId: user.id,
        patientId: "",
        visitDate: "",
        diagnosis: "",
        symptoms: "",
        treatment: "",
        notes: "",
        status: ""
      });
    }
  }, [type, MedicalRecordId])


  useEffect(() => {
    const availablePatients = patients.filter(patient => {
      const hasRecord = records.some(record =>
        record.patientId === patient.id && record.doctorId === user.id
      )
      return !hasRecord
    })

    const result = availablePatients.map(patient => {
      const userData = users.find(u => u.id === patient.userId)
      return {
        id: patient.id,
        name: userData?.name || patient.name,
      }
    })

    setFreePatients(result)
  }, [patients, records, users, user.id])

  const patientOptions = form.patientId
    ? [{ id: form.patientId, name: patients.find(p => p.id === form.patientId)?.name || "" }, ...freePatients]
    : freePatients
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoadingSubmit(true);

    e.preventDefault()

    try {
      if (type === "add") {
        await axios.post(`${API_URL}/medicalRecords`, form)
        toast.success("The medical record has been successfully added.");
      }
      else {
        await axios.put(`${API_URL}/medicalRecords/${MedicalRecordId}`, form);
        toast.success("The medical record has been successfully updated.");
      }
      setOpen(false)
    } catch (error) {
      console.error(error)
      toast.error("There was an error. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  }

  const isFormValid = () => {
    return (
      form.patientId &&
      form.doctorId &&
      form.diagnosis &&
      form.symptoms &&
      form.treatment &&
      form.visitDate &&
      form.notes

    )
  }



  return (

    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent className="sm:max-w-lg bg-white/90 rounded-2xl p-6">

        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl mb-4 font-semibold">
              {type === "edit" ? "Edit" : "Add"} Medical Record
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="grid grid-cols-1  gap-6">

            <Field className="col-span-1">
              <Label>Patient</Label>
              <Select
                required
                disabled={patientOptions.length === 0}
                value={form.patientId}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, patientId: value }))
                }
              >
                <SelectTrigger className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-teal-500">
                  <SelectValue placeholder="Select Patient" />
                </SelectTrigger>

                <SelectContent side="bottom" position="popper">
                  <SelectGroup>
                    {patientOptions.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field className="col-span-1 sm:col-span-2">
              <Label>Visit Date</Label>
              <Input
                type="date"
                name="visitDate"
                value={form.visitDate}
                onChange={handleChange}
                className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-teal-500"
              />
            </Field>

            <Field className="col-span-1 sm:col-span-2">
              <Label>Diagnosis</Label>
              <Input
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-teal-500"
              />
            </Field>

            <Field className="col-span-1 sm:col-span-2">
              <Label>Symptoms</Label>
              <Input
                name="symptoms"
                value={form.symptoms}
                onChange={handleChange}
                className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-teal-500"
              />
            </Field>

            <Field className="col-span-1 sm:col-span-2">
              <Label>Treatment</Label>
              <Input
                name="treatment"
                value={form.treatment}
                onChange={handleChange}
                className="pl-10 bg-gray-100 ring-2 ring-gray-300 p-3 rounded-lg shadow-lg border-none outline-none focus:ring-2 focus:ring-teal-500"
              />
            </Field>

            <Field className="col-span-1 ">
              <Label>Notes</Label>
              <Input
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="bg-gray-100 ring-2 ring-gray-300 px-3 py-2 rounded-lg focus:ring-teal-500"
              />
            </Field>

          </FieldGroup>

          <DialogFooter>
            <Button
              disabled={!isFormValid() || loadingSubmit}
              type="submit"
              className="bg-[#3ea194] mt-5 text-gray-50 w-full rounded-lg hover:bg-[#1a7f72] duration-300 transition"
            >
              {loadingSubmit ? (
                <span className="flex items-center gap-2">
                  <Loading /> Saving...
                </span>
              ) : (
                type === "edit" ? "Edit Medical Record" : "Add Medical Record"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}