import {
    Sheet, SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link";
import React from "react";
import ROUTES from "@/constans/routes";
import {Button} from "@/components/ui/button";
import NavLinks from "@/components/navigation/navbar/NavLinks";

const MobileNavigation = () => {
    return <Sheet>
        <SheetTrigger asChild>
            <Image
            src="/icons/hamburger.svg"
            width={36}
            height={36}
            alt="hamburger menu"
            className="invert-colors sm:hidden"
            />

            </SheetTrigger>
        <SheetContent className="background-light900_dark200 border-none" side="left">

                <SheetTitle className="hidden">Navigation</SheetTitle>
                <Link className="flex gap-1 items-center" href="/" >
                    <Image src="/images/site-logo.svg" width={23} height={23} className="invert-colors" alt="logo"/>
                    <p className="h2-bold dark:text-light-100 font-space-grotesk text-dark-100 dark:text-light-900">
                        Dev <span className="text-primary-500">Flow</span>
                    </p>

                </Link>
            <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
                <SheetClose asChild>
                    <section className="flex h-full flex-col gap-6 pt-16">
                        <NavLinks isMobileNav/>
                    </section>
                </SheetClose>
                <div className="flex flex-col gap-3">
                    <SheetClose asChild>
                        <Link href={ROUTES.SIGN_IN}>
                            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                                <span className="primary-text-gradient">Log In</span>
                            </Button>
                        </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link href={ROUTES.SIGN_UP}>
                            <Button className="small-medium light-border-2 btn-tertiary min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
                                <span className="text-light-900">Sign Up</span>
                            </Button>
                        </Link>
                    </SheetClose>
                </div>

            </div>

        </SheetContent>
    </Sheet>
}
export default MobileNavigation
