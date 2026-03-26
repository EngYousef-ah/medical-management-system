import type { ReactNode } from "react";

type Props = {
    icon: ReactNode;
    title: string;
};

export default function SidebarItem({ icon, title }: Props) {
    return (
        <li className="flex items-center gap-3 p-4 rounded-lg hover:bg-white/20 cursor-pointer transition">
            {icon}
            <span className="text-gray-400">{title}</span>
        </li>
    );
}