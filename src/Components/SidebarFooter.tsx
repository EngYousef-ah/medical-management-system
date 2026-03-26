type Props = {
    role?: string;
    username?: string;
    job?: string;
};

export default function SidebarFooter({ role, username, job }: Props) {
    const nickName = (username ?? "").slice(0, 2).toUpperCase();
    return (
        <>
            <div className="w-10 h-10 rounded-full bg-[#104C44] flex items-center justify-center text-white font-semibold">{nickName.toUpperCase()}</div>
            <div>
                <p className="text-gray-200">{role}{username}</p>
                <p className="text-gray-400">{job}</p>
            </div>
        </>
    );
}