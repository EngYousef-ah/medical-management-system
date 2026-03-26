type Props = {
    title: string;
    onClick?: () => void;
}
export default function AddBtn({ title, onClick }: Props) {
    return (
        <button onClick={onClick} className="p-2  sm:w-50  sm:p-3 bg-[#23a997] rounded-xl text-white text-md hover:bg-[#23a997d5] transition">
            <span className="text-xl mr-2 ">+</span>{title}
        </button>
    );
}