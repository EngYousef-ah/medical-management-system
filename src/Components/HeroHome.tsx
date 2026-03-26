import { Link } from "react-router-dom";
import Heading from "./Heading";
import patientImage1 from '../assets/imgs/img1.jpg';
export default function HeroHome() {
    return (
        <section className="pt-32 pb-24 bg-linear-to-br from-[#104c44] to-[#1a7f72] text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-16">

                <div className="max-w-xl text-center lg:text-left space-y-8">

                    <Heading title="Modern Healthcare" />

                    <p className="text-lg text-gray-200">
                        Manage patients, appointments, prescriptions and analytics
                        with an intelligent and secure medical system.
                    </p>

                    <div className="flex justify-center lg:justify-start gap-5 pt-4">

                        <Link to="/register">
                            <p className="px-8 py-4 bg-white text-[#104c44] font-semibold rounded-xl hover:scale-105 smooth">
                                Get Started
                            </p>
                        </Link>

                        <Link to="/login">
                            <p className="px-8 py-4 border-2 border-white rounded-xl hover:bg-white hover:text-[#104c44] smooth">
                                Login
                            </p>
                        </Link>

                    </div>
                </div>

                <img
                    src={patientImage1}
                    className="w-105 lg:w-130 rounded-3xl shadow-2xl hover:scale-105 smooth"
                />

            </div>
        </section>
    );
}