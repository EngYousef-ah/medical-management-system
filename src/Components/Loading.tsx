export default function Loading() {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#0b8f51] rounded-full animate-spin"></div>
        </div>
    );
}