import { Link } from "react-router-dom";
export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#104c44] to-[rgb(26,127,114)] px-6">

            <h1 className="text-8xl font-extrabold mb-4 tracking-widest">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Page Not Found
            </h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
                Sorry, the page you are looking for doesn’t exist or has been moved.
            </p>
            <Link to="/" className="inline-block bg-white text-[#104c44] font-semibold px-6 py-3 rounded-2xl
            shadow-lg hover:scale-105 transition-transform duration-300">
                Go Back Home
            </Link>
        </div>
    );
}