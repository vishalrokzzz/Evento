import React from 'react';
import Link from "next/link";
import Image from "next/image";
interface Props{
    title:string,
    image:string,
    location:string,
    date:string,
    time:string,
    slug:string,
}
const EventCard = ({title,image,location,date,time,slug}:Props) => {
    return (
        <Link href={`/events/${slug}`} id={"event-card"}>
            <div className={"event-card"}>
                <Image src={image} alt={title} width={300} height={250} className={"poster"}/>
                <div className={"event-details"}>
                    <div className={"ribbon-container flex items-center justify gap-2"}>
                        <Image src={"/icons/pin.svg"} alt={location} width={15} height={15} className={"ribbon-icon"}/>
                        <p className={"ribbon py-0.5"}>{location}</p>
                    </div>
                    <p className={"title"}>{title}</p>
                    <div className={"ribbon-container flex items-center"} style={{gap:"10px"}}>
                        <div className={"ribbon-container flex items-center justify gap-2"}>
                            <Image src={"/icons/calendar.svg"} alt={date} width={15} height={15} className={"ribbon-icon"}/>
                            <p className={"ribbon"}>{date}</p>
                        </div>
                        <div className={"ribbon-container flex items-center justify gap-2"}>
                            <Image src={"/icons/clock.svg"} alt={time} width={15} height={15} className={"ribbon-icon"}/>
                            <p className={"ribbon"}>{time}</p>
                        </div>
                    </div>




                </div>
            </div>
        </Link>
    );
};

export default EventCard;