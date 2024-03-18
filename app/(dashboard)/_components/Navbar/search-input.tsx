"use client";

import { qs } from "query-string";
import { Search } from "lucide-react";
import { useDebounce } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
    useEffect, useState, ChangeEvent
} from "react";

const SearchInput = () => {
    return <div className="w-full relative">
        <Search
            className="
            absolute
            top-1/2
            left-3
            transform
            -translate-y-1/2
            text-muted-foreground
            h-4
            w-4
            "
        />
        <Input
            placeholder="Search boards"
            className="w-full max-w-[560px] pl-9"
        />
    </div>
}


export default SearchInput;