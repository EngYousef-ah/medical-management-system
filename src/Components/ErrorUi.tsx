import toast from "react-hot-toast";

type Props = {
    title: string;
}
export default function ErrorUi({ title }: Props) {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
            {toast.error({ title })}
        </div>
    );
}