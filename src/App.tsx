import './App.css'

import { Routes, Route } from "react-router-dom";

import HomePage from './pages/HomePage'
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Appointments from './pages/Appointments';
import { Prescriptions } from './pages/Prescription';
import { Analytics } from './pages/Analytics';
import NotFound from './pages/NotFound';
import Patients from './pages/Patients';
import PatientDetails from './pages/PatientDetails';
// import Scheduler from './pages/Scheduler';
import ProtectedRoute from './pages/ProtectedRoute';
import { PatinetDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { MedicalRecords } from './pages/MedicalRecords';
import MedicalRecordDetails from './pages/MedicalRecordDetails';


import '@schedule-x/theme-default/dist/index.css'
export default function App() {

  return (
    <main className="App bg-gray-100" >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute allowedRole={"doctor"} />}>
          <Route path="/doctor-dashboard" >
            <Route path="" element={<DoctorDashboard />} />
            <Route path="patient" element={<Patients />} />
            <Route path="patients/:id/view" element={<PatientDetails />} />
            <Route path="medical-records" element={<MedicalRecords />} />
            <Route path="medical-records/:id" element={<MedicalRecordDetails />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="prescription" element={<Prescriptions />} />
            <Route path="analytics" element={<Analytics />} />

            {/* medical-records */}
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRole={"patient"} />}>
          <Route path="/patient-dashboard" >
            <Route path="" element={<PatinetDashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="prescription" element={<Prescriptions />} />
            <Route path="medical-records" element={<MedicalRecords />} />

            <Route path="medical-records/:id" element={<MedicalRecordDetails />} />

          </Route>
        </Route>


        <Route path="*" element={<NotFound />} />
      </Routes>

    </main>
  )
}

