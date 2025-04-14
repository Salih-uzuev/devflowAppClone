"use client"

import React, {useEffect, useState} from 'react'
import {Input} from "@/components/ui/input";
import Image from "next/image";
import {useSearchParams, useRouter, usePathname} from "next/navigation";
import {formUrlQuery, removeKeysFromUrl} from "@/lib/url";


interface Props {
    route:string,
    imgSrc:string,
    placeholder:string,
    otherClasses?:string,
    iconPosition?: "left" | "right";
}

const LocalSearch = ({route, imgSrc, placeholder, otherClasses, iconPosition = "left"}:Props) => {
    const pathname = usePathname()
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || "";
    const [searchQuery, setSearchQuery] = useState(query)

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if(searchQuery){
                const newUrl = formUrlQuery({
                    params:searchParams.toString(),
                    key:'query',
                    value:searchQuery

                });
                router.push(newUrl, {scroll:false});
            }else {
                if(pathname === route){
                    const newUrl = removeKeysFromUrl({
                        params:searchParams.toString(),
                        keysToRemove:['query']


                    })
                    router.push(newUrl, {scroll:false});
                }
            }

        },300);

        return () => clearTimeout(delayDebounceFn);



    }, [searchQuery,router,route,searchParams,pathname]);

    return <div className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>

        {iconPosition === "left" && <Image src={imgSrc} alt="search" width={20} height={20} className="cursor-pointer"/>}


        <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e)=> setSearchQuery(e.target.value || "")}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"

        />

        {iconPosition === "right" && <Image src={imgSrc} alt="search" width={15} height={15} className="cursor-pointer"/>}
    </div>

}
export default LocalSearch
