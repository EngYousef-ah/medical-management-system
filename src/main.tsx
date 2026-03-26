import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

import { UserProvider } from "./contexts/UserProvide";
import { AppointmentProvider } from "./contexts/AppointmentProvider";
import { PatientProvider } from './contexts/PatientProvider.tsx';
import { PrescriptionProvider } from './contexts/PrescriptionProvider.tsx';
import { MedicalRecordProvider } from './contexts/MedicalRecordProvider.tsx';
import './index.css'
import App from './App.tsx'
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <UserProvider>
        <AppointmentProvider>
          <PatientProvider>
            <PrescriptionProvider>
              <MedicalRecordProvider>
                <App />
              </MedicalRecordProvider>
            </PrescriptionProvider>
          </PatientProvider>
        </AppointmentProvider>
      </UserProvider>
    </BrowserRouter>

    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 5000,
        style: { zIndex: 99999 }, 
      }}
    />
  </>

)
