import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import type { ReactNode } from "react"

type Props = {
    trigger: ReactNode;
    icon: ReactNode;
    title: string;
    description: string;
    confirmText?: string;
    onConfirm: () => void;
    variant?: "default" | "destructive"
}
export function Alert({ trigger, icon, title, description, confirmText, onConfirm, variant }: Props) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild className={
                variant === "destructive"
                    ? "p-1 rounded-md bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"
                    : "p-1 rounded-md bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
            }>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className={
                        variant === "destructive"
                            ? "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"
                            : "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                    }>
                        {icon}
                    </AlertDialogMedia>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} variant={variant}>{confirmText}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
