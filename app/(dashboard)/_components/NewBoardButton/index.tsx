"use client";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useRouter } from "next/navigation";

interface NewBoardButtonProps {
    orgId: string;
    disabled?: boolean;
}

const NewBoardButton = ({ orgId, disabled }:NewBoardButtonProps) => {
    const router = useRouter();
    const { mutate, pending } = useApiMutation(api.board.create);
    
    const onClick = async () => {
        await mutate({
            orgId,
            title: "Untitled",
        })
        .then((id) => {
            toast.success("Board created");
            router.push(`/board/${id}`);
        })
        .catch(() => toast.error("Failed to create board"));
    };
    
    return <button
        disabled={disabled}
        onClick={onClick}
        className={cn(
            "col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6",
            (pending || disabled) && "opacity-75 cursor-not-allowed"
        )}
        >
        <Plus className="h-12 w-12 text-white stroke-1"/>
        <p className="text-xs text-white font-light">New Board</p>
    </button>
}

export default NewBoardButton;