import React from 'react';
import ExploreBtn from "@/components/ExploreBtn";
import Image from "next/image";
import {images} from "next/dist/build/webpack/config/blocks/images";
import EventCard from '@/components/EventCard';
import {events} from "@/lib/constants";
const Page = () => {

    return (

            <section>
                <h1 className="text-center">Evento</h1>
                <p className={"text-center py-4"}>Concerts,Standups and Roasts..!! Book your event..!!</p>

                <div className="flex justify-center mt-7">
                    <ExploreBtn/>
                </div>
                <div className="space-y-5 mt-10">
                    <h3>Upcoming Events</h3>
                    <ul className="events list-none">
                        {
                            events.map((item) => (
                                <li key={item.title}>
                                    <EventCard {...item}/>
                                </li>
                            ))
                        }

                    </ul>
                </div>
            </section>









    );
};

export default Page;