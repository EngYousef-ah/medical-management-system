import "../index.css";
import { registerUser } from "../api/userApi"
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation/registerSchema";
import type { RegisterFormValues } from "../validation/registerSchema";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {

  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit"
  });

  const onSubmit = async (data: RegisterFormValues) => {

    const userData = {
      ...data,
      id: crypto.randomUUID()
    };

    await registerUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));

    if (data.role === "doctor") {
      navigate("/doctor-dashboard");
    } else {
      navigate("/patient-dashboard");
    }

    reset();
  };


  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      <div className="hidden md:flex flex-col items-center justify-center bg-hero gap-y-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.2"
          stroke="currentColor"
          className="h-14 w-14 text-white bg-white/10 rounded-2xl"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>

        <h1 className="text-4xl font-bold text-white">MedPractice</h1>

        <p className="text-xl text-gray-300 w-3/5 text-center">
          Complete practice management for modern healthcare professionals.
        </p>
      </div>

      <div className="flex items-center justify-center p-8">
        <form className="w-full max-w-md space-y-8" onSubmit={handleSubmit(onSubmit)}>

          <div className="flex gap-x-4 items-center md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.2"
              stroke="currentColor"
              className="h-14 w-14 text-black rounded-2xl"
              style={{ backgroundColor: "rgb(35, 169, 151)" }}
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>

            <h1 className="text-2xl font-bold text-black">MedPractice</h1>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Create Account</h3>
            <p className="text-gray-500">Set up your practice account</p>
          </div>


          <div className="space-y-1">
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Dr.Yousef"
              className="w-full p-3 border rounded-2xl"
              {...register("name")}
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          </div>

          <div className="space-y-1">
            <label className="block font-medium">Email</label>
            <input
              type="email"
              placeholder="user@gmail.com"
              className="w-full p-3 border rounded-2xl"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          </div>

          <div className="space-y-1">
            <label className="block font-medium">Password</label>
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="pointer-events-none absolute right-3 top-1/2 h-6 w-6 transform -translate-y-1/2 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>

              <input
                type="password"
                placeholder="************"
                className="w-full p-3 border rounded-2xl"
                {...register("password")}
              />
            </div>
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}


            <label >Role</label>
            <select id="" className="input w-full p-2 border  rounded-2xl" {...register("role")}>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-hero text-white p-3 rounded-2xl"
            style={{ height: "45px" }}>
            Create Account
          </button>

          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-600 font-medium hover:underline">Sign in</Link>

          </p>

        </form>
      </div>
    </div>
  );
}

