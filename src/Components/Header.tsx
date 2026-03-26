import { Menu } from "lucide-react";

type Props = {
    name?: string;
    click: () => void;

}
export default function Header({ name = "", click }: Props) {
    return (
        <header className="flex justify-between items-center bg-white px-4 md:px-6 py-4 shadow-md ">
            <Menu color="#104c24" onClick={click} className="block md:hidden cursor-pointer" />
            <p className="font-semibold "><span className="text-gray-400">Welcome,</span> {name}</p>
        </header>
    );
}