import React from 'react'
import Link from "next/link";
import ROUTES from "@/constans/routes";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import Image from "next/image";
import {cn} from "@/lib/utils";

interface Props{
    id:string,
    name:string,
    imageUrl?:string | null,
    className?:string,
    fallbackClassName?:string;
}

const UserAvatar = ({id,name,imageUrl, fallbackClassName , className='h-9 w-9'}:Props) => {
    const initials = name
        .split(" ")
        .map((word:string)=>word[0])
        .join("")
        .toUpperCase()
        .slice(0,2)

    return <Link href={ROUTES.PROFILE(id)}>
        <Avatar className={cn('relative', className)}>
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={name}
                    className="object-cover"
                    fill
                    quality={100}
                />
            ):(
                <AvatarFallback className={cn("primary-gradient font-space-grotesque font-bold tracking-wider text-white", fallbackClassName)}>
                    {initials}

                </AvatarFallback>
            )}

        </Avatar>
    </Link>
}
export default UserAvatar
