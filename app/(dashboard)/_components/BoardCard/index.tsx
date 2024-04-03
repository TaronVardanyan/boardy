"use client";

import Link from "next/link";
import Image from "next/image";
import Overlay from "./overlay";
import Footer from "./footer";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import Actions from "@/components/actions";
import { MoreHorizontal } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";

interface BoardCardProps {
    id: string;
    title: string;
    orgId: string;
    isFavorite: boolean;
    imageUrl: string;
    authorId: string;
    authorName: string;
    createdAt: number;
}

const BoardCard = ({
    id,
    orgId,
    authorId,
    title,
    authorName,
    imageUrl,
    createdAt,
    isFavorite
}:BoardCardProps) => {
    const { mutate: onFavorite, pending: pendingFavorite } = useApiMutation(api.board.favorite);
    const { mutate: onUnfavorite, pending: pendingUnfavorite } = useApiMutation(api.board.unfavorite);
    const { userId } = useAuth();
    const authorLabel = userId === authorId ? "You" : authorName;
    const createdAtLabel = formatDistanceToNow(createdAt, {
        addSuffix: true,
    });

    const toggleFavorite = async () => {
        if(isFavorite) {
            await onUnfavorite({ id })
            .catch(() => toast.error("Failed to unfavorite"));
        } else {
            await onFavorite({
                id,
                orgId,
            })
            .catch(() => toast.error("Failed to favorite"));
        }
    }

    return <Link href={`/board/${id}`}>
        <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between align-center overflow-hidden">
            <div className="relative flex-1 bg-amber-50">
                <Image
                    fill
                    src={imageUrl}
                    alt={title}
                    className="object-fit"
                />
                <Overlay />
                <Actions
                  id={id}
                  title={title}
                  side="right"
                >
                    <button
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none"
                    >
                        <MoreHorizontal
                           className="text-white opacity-75 hover:opacity-100 transition-opacity"
                        />
                    </button>
                </Actions>
            </div>
            <Footer
                isFavorite={isFavorite}
                title={title}
                authorLabel={authorLabel}
                createdAtLabel={createdAtLabel}
                onClick={toggleFavorite}
                disabled={pendingFavorite || pendingUnfavorite}
            />
        </div>
    </Link>
};

BoardCard.Skeleton = function BoardCardSkeleton () {
    return <div className="group aspect-[100/127] rounded-lg">
        <Skeleton className="h-full w-full"/>
    </div>
}

export default BoardCard;