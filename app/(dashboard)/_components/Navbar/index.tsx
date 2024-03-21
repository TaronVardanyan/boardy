"use client";

import { UserButton, OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import SearchInput from "./search-input";
import InviteButton from "./invite-button";
import { rootBox, organizationSwitcherTrigger } from "@/constants/styles";

export const Navbar = () => {
    const { organization } = useOrganization();

    return <div className="flex items-center gap-x-4 p-5">
        <div className="hidden lg:flex lg:flex-1">
            <SearchInput />
        </div>
        <div className="block lg:hidden flex-1">
            <OrganizationSwitcher
                hidePersonal
                appearance={{
                elements: {
                    rootBox: {
                        ...rootBox,
                        maxWidth: "376px",
                    },
                    organizationSwitcherTrigger,
                }
            }}
            />
        </div>
        {organization && <InviteButton/>}
        <UserButton />
    </div>
}