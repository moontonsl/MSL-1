import React, { useState } from "react";
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsBattleTrips.jsx";
import { Helmet } from 'react-helmet';
import styles from './MPLS16Battletrips.module.scss';

const SCHOOL_AREAS = ["School A", "School B", "School C", "School D"];
const COMMUNITIES = ["Com A", "Com B", "Com C", "Com D"];

const MPL16Battletrips = () => {
    const [form, setForm] = useState({
        fullName: "",
        age: "",
        email: "",
        contactNumber: "",
        fbLink: "",
        mlbbId: "",
        mlbbServer: "",
        schoolName: "",
        schoolArea: "",
        validIdLink: "",
        community: "",
        smartSubscriber: "",
        smartAnswer: ""
    });

    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleNumericChange = (e, field) => {
        const val = e.target.value.replace(/\D/g, "");
        setForm((prev) => ({ ...prev, [field]: val }));
    };

    const handleSmartSubscriber = (answer) => {
        setForm((prev) => ({ ...prev, smartSubscriber: answer }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Form:", form);
        setShowModal(true);
        setForm({
            fullName: "",
            age: "",
            email: "",
            contactNumber: "",
            fbLink: "",
            mlbbId: "",
            mlbbServer: "",
            schoolName: "",
            schoolArea: "",
            validIdLink: "",
            community: "",
            smartSubscriber: "",
            smartAnswer: ""
        });
    };

    return (
        <>
            <Head title="MPLS16 Battle Trips" />
            <Helmet>
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </Helmet>

            <AuthenticatedLayout>
                <div className="flex items-center justify-center min-h-[70vh] md:min-h-screen px-2 md:px-4">
                    <div className="w-full max-w-[365px] md:max-w-2xl text-center relative z-20 -mt-16 mb-10 px-4">
                        <img
                            src="/BTLogo.png"
                            alt="Battle Trips Logo"
                            className="w-[250px] h-[200px] md:w-[400px] md:h-[320px] mt-6 md:mt-5 block mx-auto object-contain"
                        />

                         {/* New text below the BTLogo */}
                        <div className="text-white mt-[-50px] mb-4 text-lg md:text-xl font-medium">
                        Welcome to the ultimate Battle Trips experience!
                        </div>

                        {/* New picture below the text */}
                        <img
                        src="/mcclogo.png"
                        alt="Second Image Description"
                        className="w-[200px] h-auto md:w-[300px] mx-auto mb-6 object-contain"
                        />

                        <div className="rounded-xl pt-4 px-4 pb-10 md:rounded-3xl md:p-10 shadow-lg md:shadow-2xl border border-white bg-black">
                            <div className="text-white font-bold text-3xl mb-6">
                                MPL Battle Trips Mini Game!
                            </div>

                            {/* Registration Form */}
                            <form onSubmit={handleSubmit} className="flex flex-col">
                                <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required className={styles.inputField} />
                                <input type="text" name="age" placeholder="Age" value={form.age} onChange={(e) => handleNumericChange(e, 'age')} required className={styles.inputField} />
                                <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required className={styles.inputField} />
                                <input type="text" name="contactNumber" placeholder="Contact Number" value={form.contactNumber} onChange={(e) => handleNumericChange(e, 'contactNumber')} required className={styles.inputField} />
                                <input type="url" name="fbLink" placeholder="Facebook Link" value={form.fbLink} onChange={handleChange} required className={styles.inputField} />
                                <input type="text" name="mlbbId" placeholder="MLBB ID (ie. 9923103)" value={form.mlbbId} onChange={(e) => handleNumericChange(e, 'mlbbId')} required className={styles.inputField} />
                                <input type="text" name="mlbbServer" placeholder="ML Server (ie. 5932)" value={form.mlbbServer} onChange={(e) => handleNumericChange(e, 'mlbbServer')} required className={styles.inputField} />
                                <input type="text" name="schoolName" placeholder="Your School Name or CH Area" value={form.schoolName} onChange={handleChange} required className={styles.inputField} />

                                <select name="schoolArea" value={form.schoolArea} onChange={handleChange} required className="mb-4 p-3 rounded-lg border border-white bg-black bg-opacity-30 text-white text-base outline-none text-center">
                                    <option value="" disabled>Select School Area</option>
                                    {SCHOOL_AREAS.map((area) => (
                                        <option key={area} value={area} className="bg-gray-800 text-white">{area}</option>
                                    ))}
                                </select>

                                <input type="url" name="validIdLink" placeholder="Drive Link of your valid ID" value={form.validIdLink} onChange={handleChange} required className={styles.inputField} />

                                <select name="community" value={form.community} onChange={handleChange} required className="mb-4 p-3 rounded-lg border border-white bg-black bg-opacity-30 text-white text-base outline-none text-center">
                                    <option value="" disabled>Select Community</option>
                                    {COMMUNITIES.map((com) => (
                                        <option key={com} value={com} className="bg-gray-800 text-white">{com}</option>
                                    ))}
                                </select>
                                {/* What is your Answer */}
                                <div className="text-white font-semibold mb-2">Are you a Smart Subscriber?</div>
                                <div className="flex justify-center gap-4 mb-4">
                                    <button
                                    type="button"
                                    onClick={() => setForm((prev) => ({ ...prev, smartAnswer: "Yes", smartSubscriber: "Yes" }))}
                                    className={`px-6 py-2 rounded-lg border ${
                                        form.smartAnswer === "Yes"
                                        ? "bg-yellow-400 text-black"
                                        : "bg-black text-white border-white"
                                    } hover:bg-yellow-400 hover:text-black`}
                                    >
                                    Yes
                                    </button>
                                    <button
                                    type="button"
                                    onClick={() => setForm((prev) => ({ ...prev, smartAnswer: "No", smartSubscriber: "No" }))}
                                    className={`px-6 py-2 rounded-lg border ${
                                        form.smartAnswer === "No"
                                        ? "bg-yellow-400 text-black"
                                        : "bg-black text-white border-white"
                                    } hover:bg-yellow-400 hover:text-black`}
                                    >
                                    No
                                    </button>
                                </div>

                                <input type="text" name="smartSubscriber" placeholder="What is your answer?" value={form.smartSubscriber} onChange={handleChange} required className={styles.inputField} readOnly />

                                <button
                                    type="submit"
                                    className="w-3/5 mx-auto mt-4 py-3 rounded-lg bg-black bg-opacity-30 text-white font-bold border border-white text-sm md:text-base cursor-pointer transition-all duration-200 hover:bg-white hover:bg-opacity-10 hover:text-yellow-300"
                                >
                                    Submit Answer
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-black text-white p-8 rounded-2xl shadow-xl text-center min-w-64 border border-white">
                            <h2 className="text-xl font-semibold mb-4">Registration Submitted Successfully!</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="mt-4 px-6 py-2 rounded-lg border-none bg-yellow-300 text-gray-800 font-bold cursor-pointer text-base"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </AuthenticatedLayout>
        </>
    );
};

export default MPL16Battletrips;
