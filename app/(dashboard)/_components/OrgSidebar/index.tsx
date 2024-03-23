"use client";

import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { LayoutDashboard, Star } from "lucide-react";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { rootBox, organizationSwitcherTrigger } from "@/constants/styles";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

export const OrgSidebar = () => {
    const searchParams = useSearchParams();
    const favorites = searchParams.get("favorites");

    return (
        <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
            <Link href="/">
                <div className="flex items-center gap-x-2">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        height={60}
                        width={60}
                    />
                    <span className={cn(
                        "font-semibold text-2xl",
                        font.className,
                        )}>
                        Boardy
                    </span>
                </div>
            </Link>
            <OrganizationSwitcher
                hidePersonal
                appearance={{
                elements: {
                    rootBox,
                    organizationSwitcherTrigger,
                }
            }}
            />
            <div className="space-y-1 w-full">
                <Button
                    variant={favorites ? "ghost" : "secondary"}
                    asChild
                    size="lg"
                    className="font-normal justify-start px-4 w-full"
                    >
                    <Link href="/">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Team Boards
                    </Link>
                </Button>
                <Button
                    variant={favorites ? "secondary" : "ghost"}
                    asChild
                    size="lg"
                    className="font-normal justify-start px-4 w-full"
                    >
                    <Link href={{
                        pathname: "/",
                        query: { favorites: true }
                    }}>
                        <Star className="h-4 w-4 mr-2" />
                        Favorite Boards
                    </Link>
                </Button>
            </div>
        </div>
        );
};