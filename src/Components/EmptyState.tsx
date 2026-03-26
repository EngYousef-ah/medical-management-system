export default function EmptyState({ text }: { text: string }) {
    return (
        <div className="text-gray-500 text-lg font-semibold p-20 text-center">
            {text}
        </div>
    );
}