'use client'
import React from 'react';
import Image from "next/image";

const ExploreBtn = () => {
    return (
        <div className={"justify-center"}>
            <button type={"button"} id="explore-btn" className={"justify-center"} onClick={() => {console.log("clicked")}}>
                <a href={"/events"}>
                    Explore
                    <Image src={"/icons/arrow-down.svg"} width={20} height={20} alt={"arrow-down"}/>
                </a>
            </button>

        </div>
    );
};

export default ExploreBtn;