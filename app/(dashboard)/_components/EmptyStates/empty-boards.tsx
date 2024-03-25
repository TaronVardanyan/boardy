"use client";

import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@clerk/nextjs";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";

const EmptyBoards = () => {
    const { organization } = useOrganization();
    const { mutate, pending  } = useApiMutation(api.board.create);

    const onClick = async () => {
        if (!organization) return;

        await mutate({
            orgId: organization.id,
            title: "Untitled",
        })
        .then((id) => toast.success("Board created"))
        .catch(() => toast.error("Failed to create board"));
    };

    return <div className="h-full flex flex-col items-center justify-center">
        <Image
            src="/note.svg"
            alt="Empty favorites"
            width={110}
            height={110}
        />
        <h2 className="text-2xl font-semibold mt-6">Create Your first board!</h2>
        <p className="text-muted-foreground text-sm font-semibold mt-2">
            Start by creating a board for Your organization
        </p>
        <div className="mt-6">
            <Button size="lg" disabled={pending} onClick={onClick}>Create board</Button>
        </div>
    </div>
}

export default EmptyBoards;