import {MoveRight} from "lucide-react"
export default function HeadinInfoCard({title=""}){
    return(
        <>
            <div className="flex justify-between items-center">
                <p className="text-lg font-bold">{title}</p>
                <div className="flex items-center">
                  <p className="text-[#23a997] font-semibold mr-2 cursor-pointer">View all </p>
                  <MoveRight size={30} color="#0b8f51" strokeWidth={2}  className="cursor-pointer"/>
                </div>
            </div>
        </>
    );
}