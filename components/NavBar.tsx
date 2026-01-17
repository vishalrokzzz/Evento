import React from 'react';
import Link from "next/link";
import Image from "next/image";
import GooeyNav from "@/components/GooeyNav";

const NavBar = () => {
    const items = [
        { label: "Home", href: "/" },
        { label: "Events", href: "/events" },
        { label: "Create Event", href: "#" },
    ];
    return (
        <nav className={"flex justify-between items-center py-4 px-8"} style={{maxHeight:"70px"}}>

            <Link href={"/"} className={"logo"}>
                <Image src={"/icons/logo.png"} width={25} height={25} alt={"logo"}/>
                <p>Evento</p>
            </Link>


            <GooeyNav
                items={items}
                particleCount={15}
                particleDistances={[90, 10]}
                particleR={100}
                initialActiveIndex={0}
                animationTime={200}
                timeVariance={300}
                colors={[1, 2, 3, 1, 2, 3, 1, 4]}

            />
        </nav>
    );
};

export default NavBar;