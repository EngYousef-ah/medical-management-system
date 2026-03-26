import type { ReactNode } from "react";
interface Props {
    icon?: ReactNode;
    title: string;
    subTitle: string;
    status: ReactNode;

}
export default function InfoCard({ icon, title, subTitle, status }: Props) {
    return (
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded-2xl">
            <div className="flex items-center gap-x-4" >
                {icon}
                <div className="flex flex-col">
                    <p>{title}</p>
                    <p>{subTitle}</p>
                </div>
            </div>
            <div>
                {status}
            </div>

        </div>
    );
}