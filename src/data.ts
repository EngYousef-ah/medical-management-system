export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: 'doctor' | 'patient';
}

export interface Patient {
    id: string;
    userId: string;
    name: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female';
    bloodType: string;
    address: string;
    status: 'active' | 'inactive' | 'critical' | '';
    email?: string;
}

export interface Appointment {
    id: string;
    doctorId: string;
    patientId: string;
    date: string;
    time: string;
    duration: string;
    type: string;
    status: 'completed' | 'cancelled' | 'scheduled';
}

export interface Prescription {
    id: string;
    patientId: string;
    doctorId: string;
    medication: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string;
    status: string;
}

export interface MedicalRecord {
    id: string;
    doctorId: string;
    patientId: string | null;
    visitDate: string;
    diagnosis: string;
    symptoms: string;
    treatment: string;
    notes: string;
    status: string;
}


export const users: User[] = [
    { id: "40a7", name: "ahmed", email: "ahmed@gmail.com", password: "asdsdasdasdsad", role: "doctor" },
    { id: "u1p9", name: "Yousef Ahmed", email: "yousef@gmail.com", password: "ذ", role: "patient" },
    { id: "814a", name: "Lele Al Ahmed", password: "1212121212", email: "lele@gmail.com", role: "patient" },
    { id: "70aaa8d7-9e20-42bf-820b-b1e97e5d1d09", name: "James", email: "james@email.com", password: "sadadsdas", role: "doctor" },
    { id: "a0c05986-ce9c-4389-a349-1d49b22ea6b3", name: "ttttt", email: "test@gmail.com", password: "asdsasdasad", role: "patient" },
    { id: "a0c05986-ce9c-43sasd2ea6b3", name: "asdassf", email: "asd@gmail.com", password: "asdsasdasad", role: "patient" },
    { id: "735ae9ac-7df5-4970-860f-30482fa4b8a8", name: "Emily Johnson", email: "emily@email.com", password: "sadasdasdd", role: "doctor" },
    { id: "fd1021de-c10b-4a0b-b2f3-92beac0fdb24", name: "yoyo", email: "yoyo@gmail.cpm", password: "yoyoyoyo", role: "doctor" }
];

export const patients: Patient[] = [
    { id: "p1", userId: "u1p9", name: "Yousef Ahmed", phone: "0982666803", dateOfBirth: "2026-03-09", gender: "male", bloodType: "A+", address: "Homs", status: "critical", email: "yousef@gmail.com" },
    { id: "p2", userId: "814a", name: "Lele Al Ahmed", phone: "78945622", dateOfBirth: "2026-03-09", gender: "male", bloodType: "A+", address: "Homs", status: "active" },
    { id: "623c", userId: "a0c05986-ce9c-43sasd2ea6b3", name: "asdassf", email: "asd@gmail.com", phone: "0982666803", dateOfBirth: "2026-03-03", gender: "female", bloodType: "sdf", address: "homs", status: "inactive" }
];

export const appointments: Appointment[] = [
    { id: "21fd", doctorId: "40a7", patientId: "p2", date: "2026-03-04", time: "10:30", duration: "37", type: "procedure", status: "completed" },
    { id: "9ae3", doctorId: "40a7", patientId: "p2", date: "2026-03-05", time: "13:54", duration: "80", type: "follow-up", status: "cancelled" },
    { id: "f9f3", doctorId: "40a7", patientId: "p1", date: "2026-03-03", time: "06:18", duration: "17", type: "follow-up", status: "scheduled" },
    { id: "b8f7", doctorId: "40a7", patientId: "p1", date: "2026-03-18", time: "12:00", duration: "50", type: "procedure", status: "scheduled" },
    { id: "a004", doctorId: "70aaa8d7-9e20-42bf-820b-b1e97e5d1d09", patientId: "p2", date: "2026-03-04", time: "20:27", duration: "4", type: "consultation", status: "completed" },
    { id: "3f3f", doctorId: "70aaa8d7-9e20-42bf-820b-b1e97e5d1d09", patientId: "p2", date: "2026-03-05", time: "21:29", duration: "2", type: "follow-up", status: "completed" },
    { id: "1080", doctorId: "70aaa8d7-9e20-42bf-820b-b1e97e5d1d09", patientId: "p1", date: "2026-03-04", time: "14:12", duration: "6", type: "follow-up", status: "scheduled" },
    { id: "548d", doctorId: "40a7", patientId: "p1", date: "2026-03-03", time: "19:29", duration: "32", type: "checkup", status: "scheduled" }
];

export const prescriptions: Prescription[] = [
    { id: "7865", patientId: "p1", doctorId: "70aaa8d7-9e20-42bf-820b-b1e97e5d1d09", medication: "Cetirizine", dosage: "500mg", frequency: "Once daily", startDate: "2026-03-23", endDate: "2026-03-26", status: "active" },
    { id: "5ea7", patientId: "p1", doctorId: "70aaa8d7-9e20-42bf-820b-b1e97e5d1d09", medication: "Cetirizine", dosage: "5100mg", frequency: "Once daily", startDate: "2026-03-23", endDate: "2026-03-26", status: "active" },
    { id: "0334", patientId: "p1", doctorId: "70aaa8d7-9e20-42bf-820b-b1e97e5d1d09", medication: "Cetirizine", dosage: "50q0mg", frequency: "Once daily", startDate: "2026-03-23", endDate: "2026-03-26", status: "active" },
    { id: "2766", patientId: "p2", doctorId: "70aaa8d7-9e20-42bf-820b-b1e97e5d1d09", medication: "Amoxicillin", dosage: "500mg", frequency: "Three times daily", startDate: "2026-03-10", endDate: "2026-03-26", status: "active" },
    { id: "785a", patientId: "p2", doctorId: "70aaa8d7-9e20-42bf-820b-b1e97e5d1d09", medication: "Cetirizine", dosage: "500mg", frequency: "Once daily", startDate: "2026-03-23", endDate: "2026-03-26", status: "active" },
    { id: "4efa", patientId: "p1", doctorId: "40a7", medication: "Amoxicillin", dosage: "500mg", frequency: "Three times daily", startDate: "2026-03-09", endDate: "2026-03-26", status: "active" },
    { id: "c1d4", patientId: "p2", doctorId: "40a7", medication: "Cetirizineasd", dosage: "10mg", frequency: "Once daily", startDate: "2026-03-18", endDate: "2026-03-19", status: "active" }
];

export const medicalRecords: MedicalRecord[] = [
    { id: "mas2", doctorId: "40a7", patientId: "p1", visitDate: "2026-03-05", diagnosis: "Seasonal Allergy", symptoms: "Sneezing, itchy eyesq", treatment: "Antihistamines", notes: "Patient advised to avoid pollen exposure", status: "critical" },
    { id: "cdw3", doctorId: "70aaa8d7-9e20-42bf-820b-b1e97e5d1d09", patientId: "p1", visitDate: "2026-03-05", diagnosis: "Seasonal Allergy", symptoms: "Sneezing, itchy eyes", treatment: "Antihistamines", notes: "Patient advised to avoid pozxczxxzcllen exposure51", status: "active" },
    { id: "mr2", patientId: "p2", doctorId: "40a7", visitDate: "2026-03-02", diagnosis: "Hypertension", symptoms: "Headache and dizziness", treatment: "Lisinopril medication", notes: "Monitor blood pressure weekly", status: "active" },
    { id: "0408", doctorId: "70aaa8d7-9e20-42bf-820b-b1e97e5d1d09", patientId: "p2", visitDate: "2026-03-12", diagnosis: "Seasonal Allergy", symptoms: "Sneezing, itchy eyes", treatment: "Antihistamines", notes: "Patient advised to avoid pollen exposure", status: "active" },
    { id: "3ded", doctorId: "70aaa8d7-9e20-42bf-820b-b1e97e5d1d09", patientId: null, visitDate: "2026-03-04", diagnosis: "12", symptoms: "asdasd", treatment: "asdsa", notes: "sadsd", status: "" },
    { id: "5684", doctorId: "40a7", patientId: "623c", visitDate: "2026-03-04", diagnosis: "12", symptoms: "سيبيسب", treatment: "يب", notes: "يسب", status: "" }
];

export const dashboardStats = [
    { id: "9748", totalPatients: 156, todayAppointments: 8, activePrescriptions: 43, monthlyRevenue: 48750 }
];

export const appointmentTypeData = [
    { id: "5cd7", name: "Checkup", value: 35, color: "#2CA58D" },
    { id: "1461", name: "Follow-up", value: 28, color: "#2E9CCA" },
    { id: "dcb9", name: "Consultation", value: 20, color: "#3A86FF" },
    { id: "6290", name: "Procedure", value: 12, color: "#E63946" },
    { id: "93e1", name: "Emergency", value: 5, color: "#F4A261" }
];