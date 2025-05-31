import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'

const experienceItems = [
    {
        img: "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "ACADEMIC ACTIVITIES",
        subtitle: "(TRAINING AND SEMINARS)",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    },
    {
        img: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "INTER-SCHOOL ACTIVITIES",
        subtitle: "",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    },
    {
        img: "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "CAMPUS ORGANIZATION SUPPORT",
        subtitle: "",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    },
    {
        img: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "SCHOOLS’ EVENTS PARTNERSHIPS",
        subtitle: "",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    },
    {
        img: "https://images.unsplash.com/photo-1504006833117-8886a355efbf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "ON-SITE ESPORTS EXPERIENCE",
        subtitle: "",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    },
];

const ExperienceSection = () => {
    return (
        <section className="py-10 bg-[#FFBD30] text-black">
            <div className="container mx-auto w-[90vw] md:px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                        LEAD TO EXPERIENCE!
                    </h2>
                    <p className="max-w-2xl mx-auto mt-4 text-sm md:text-base">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                <div className="overflow-x-auto scrollbar-hide xl:overflow-visible">
                    <div className="flex gap-4 snap-x snap-mandatory px-1 md:px-0 xl:flex-wrap xl:justify-between">
                        {experienceItems.map((item, index) => (
                            <div
                                key={index}
                                className="snap-start shrink-0 w-[80%] sm:w-[50%] md:w-[33.3333%] lg:w-[25%] xl:w-[calc(20%-1rem)]"
                            >
                                <article className="bg-black text-white rounded-xl flex flex-col min-h-[300px] h-full overflow-hidden">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-full aspect-[1/1] object-cover"
                                        loading="lazy"
                                    />
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <header className="text-center">
                                            <h3 className="font-bold text-md uppercase leading-tight">
                                                {item.title}
                                            </h3>
                                            {item.subtitle && (
                                                <p className="text-xs font-semibold">{item.subtitle}</p>
                                            )}
                                        </header>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ExperienceSection
