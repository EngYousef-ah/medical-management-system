export default function MessageError({ message }: { message: string }) {
    return (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            ❌ {message}
        </div>
    );
}