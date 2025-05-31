import image1 from "../assets/experience/1.png"
import image2 from "../assets/experience/2.png"
import image3 from "../assets/experience/3.png"
import image4 from "../assets/experience/4.png"
import image5 from "../assets/experience/5.png"
import image6 from "../assets/experience/6.png"

const experienceItems = [
    {
        img: image1,
        title: "MLBB ONLINE/OFFLINE TOURNAMENT",
        subtitle: "Show off your skills in playing with online/offline tournaments where you can compete with your fellow student gamers in your community.",
    },
    {
        img: image2,
        title: "INTER-SCHOOL ACTIVITIES",
        subtitle: "Transcend beyond the borders of your school and connect with fellow student leaders and gamers with inter-school activities waiting for you.\n",
    },
    {
        img: image3,
        title: "ACADEMIC ACTIVITIES (TRAINING AND SEMINARS)",
        subtitle: "Don't just strive to improve your gamer's sense—academic activities await for you to be taught and trained to soar in your studies.",
    },
    {
        img: image4,
        title: "CAMPUS ORGANIZATION SUPPORT",
        subtitle: "Live up the greatest opportunities and experiences in esports with campus organization support offered for you to grab on.",
    },
    {
        img: image5,
        title: "SCHOOL'S EVENTS PARTNERSHIPS",
        subtitle: "From us to you, let's build greater bonds with opportunities to a firmer and stronger connection through the school's event partnerships programs that await you.",
    },
    {
        img: image6,
        title: "ON-SITE ESPORTS EXPERIENCE",
        subtitle: "Virtual realm experience is great—but we're bringing you the thrill and enjoyment of the real world through the best offers in on-site esports experience.",
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
                        Get ready to take on a journey full of opportunities for you to grab and thrive on the esports scene with MSL Philippines!
                    </p>
                </div>

                <div className="overflow-x-auto scrollbar-hide xl:overflow-visible">
                    <div className="grid grid-cols-6 gap-4">
                        {experienceItems.map((item, index) => (
                            <div
                                key={index}
                                className=""
                            >
                                <article className="bg-black text-white rounded-xl flex flex-col min-h-[300px] h-full overflow-hidden">
                                    <div className={`bg-white`}>
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            className="w-full aspect-[1/1] object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <header className="text-center">
                                            <h3 className="font-bold text-md uppercase leading-tight pb-2">
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
