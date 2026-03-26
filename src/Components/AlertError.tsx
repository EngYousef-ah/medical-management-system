import { AlertCircleIcon } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

export function AlertError() {
    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <Alert variant="destructive" className="max-w-md" >
                <AlertCircleIcon />
                <AlertTitle>Payment failed</AlertTitle>
                <AlertDescription>
                    Your payment could not be processed. Please check your payment method
                    and try again.
                </AlertDescription>
            </Alert>
        </div>
    )
}
