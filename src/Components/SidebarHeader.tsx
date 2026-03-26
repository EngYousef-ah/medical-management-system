import { Activity, X } from "lucide-react"
type Props = {
    title?: string;
    subTitle?: string;
    cancle: () => void;
}
export default function SidebarHeader({ title, subTitle, cancle }: Props) {

    return (
        <div className="flex justify-around items-center gap-4 text-xl font-bold text-white md:flex md:justify-center">
            <div className='bg-[#23a997] p-2 inline-block rounded-xl'>
                <Activity size={30} color="oklch(96.7% 0.001 286.375)" strokeWidth={2.25} />
            </div>

            <div >
                <p className="text-xl" >{title}</p>
                <p className="text-sm" >{subTitle}</p>
            </div>

            <X color="#828282" size={30} onClick={cancle} className="block md:hidden" />

        </div>
    );
}