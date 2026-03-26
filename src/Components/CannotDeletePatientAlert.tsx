import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "@/Components/ui/dialog"
import { CircleAlert } from "lucide-react"

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
}

export function CannotDeletePatientAlert({ open, setOpen }: Props) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent >
                <DialogHeader>
                    <div >
                        <CircleAlert color="#d60000" size={30} />
                    </div>
                    <DialogTitle>Can not delete this Patient</DialogTitle>
                    <DialogDescription>
                        This patient has active records in the system.
                        Please complete or cancel all related appointments, and remove any associated prescriptions and medical records before proceeding with deletion.

                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}