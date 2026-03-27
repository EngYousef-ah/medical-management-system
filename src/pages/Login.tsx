import "../index.css";
import { loginUser } from "../api/userApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidation } from "../validation/loginValidation";
import type { LoginFormValues } from "../validation/loginValidation";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";



export default function LoginPage() {

  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginValidation),
    mode: "onChange"
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedUser && token) {
      const parsedData = JSON.parse(atob(token));
      // const parsedUser = JSON.parse(storedUser);
      console.log(`if i have token in local storage:  ${token}`);

      reset({
        email: parsedData.email || "",
        password: parsedData.password || "",
      });
    }
  }, [reset]);



  const onSubmit = async (data: LoginFormValues) => {
    try {
      setServerError("");
      const user = await loginUser(data.email, data.password);

      if (!user) {
        throw new Error("Invalid email or password");
      }
      const token = btoa(JSON.stringify(user));

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log(`token Login page:  ${token}`);

      if (user.role === "doctor") {
        navigate("/doctor-dashboard");
      }
      else {
        navigate("/patient-dashboard");
      }
      reset();
    } catch (error) {
      console.log(error);

      setServerError("Invalid email or password")
    }
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
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Welcome back</h3>
            <p className="text-gray-500">Sign in to your dashboard</p>
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
            <input
              type="password"
              placeholder="************"
              className="w-full p-3 border rounded-2xl"

              {...register("password")}
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          </div>

          {serverError && (
            <p className="text-red-500 text-sm text-center">
              {serverError}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-hero text-white p-3 rounded-2xl"
            style={{ height: "45px" }}
          >
            Sign In
          </button>


          <p className="text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-teal-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
