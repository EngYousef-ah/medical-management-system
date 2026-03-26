import { Link } from "react-router-dom";
export default function NavbarHome() {
    return (
        <nav className="fixed w-full bg-white/80 backdrop-blur-xl shadow-sm z-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-20 py-4 flex justify-between items-center">


                <div>
                    <p className="font-bold text-xl text-[#104c44] md:text-3xl">MedPractice</p>
                    <p className="text-xs text-gray-400 md:text-lg">Healthcare Platform</p>
                </div>

                <div className="flex gap-4">
                    <Link to="/login">
                        <p className="p-3 border-2 border-[#23a997] text-[#23a997] rounded-xl hover:bg-[#23a997] hover:text-white smooth md:px-6 py-2">
                            Login
                        </p>
                    </Link>

                    <Link to="/register">
                        <p className="p-3 bg-[#23a997] text-white rounded-xl hover:bg-[#104c44] shadow-md smooth md:px-6 py-2">
                            Register
                        </p>
                    </Link>

                </div>

            </div>
        </nav >
    );
}