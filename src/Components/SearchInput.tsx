type Props = {
    onChang: (value: string) => void;
    placeHolder?: string;
};
export default function SearchInput({ onChang, placeHolder = "" }: Props) {
    return (
        <input type="search" placeholder={`Search ${placeHolder}.....`} className="pl-10 bg-gray-100  ring-2 ring-gray-300  p-3 rounded-lg shadow-lg 
                    outline-none focus:ring-2 focus:ring-[#23a997] 
                    w-full text-sm max-w-96"
            onChange={(e) => onChang(e.target.value)}
        />
    );
}