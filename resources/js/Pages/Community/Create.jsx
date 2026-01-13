import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Header, Footer } from "@/Components";
import { ChevronRight, MapPin, Globe, School as SchoolIcon, Plus, Check, ChevronsUpDown } from "lucide-react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import axios from "axios";

export default function Create({ islands, regions, mapLocations = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        island_id: "",
        school_id: "",
        location: "", // Read-only for display, derived from school
        map_code: "",
        school_link: "",
        // New School fields
        is_new_school: false,
        new_school_name: "",
        region_id: "",
        province_id: "",
        municipality_id: "",
    });

    const [availableSchools, setAvailableSchools] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [loadingSchools, setLoadingSchools] = useState(false);
    const [showNewSchoolForm, setShowNewSchoolForm] = useState(false);
    const [query, setQuery] = useState('');

    const filteredLocations =
        query === ''
            ? mapLocations
            : mapLocations.filter((loc) => {
                return (loc.name.toLowerCase().includes(query.toLowerCase()) || loc.code.toLowerCase().includes(query.toLowerCase()))
            })

    // Fetch schools when island changes
    useEffect(() => {
        if (data.island_id) {
            setLoadingSchools(true);
            axios.get(route('community.getSchools', { island_id: data.island_id }))
                .then(res => {
                    setAvailableSchools(res.data);
                    // Reset school selection if not in new list
                    if (!res.data.find(s => s.id == data.school_id)) {
                        setData(d => ({ ...d, school_id: "", location: "" }));
                    }
                })
                .finally(() => setLoadingSchools(false));
        } else {
            setAvailableSchools([]);
        }
    }, [data.island_id]);

    // Handle school selection
    const handleSchoolChange = (e) => {
        const value = e.target.value;
        if (value === "new") {
            setShowNewSchoolForm(true);
            setData(d => ({
                ...d,
                school_id: "",
                location: "",
                is_new_school: true
            }));
        } else {
            setShowNewSchoolForm(false);
            const school = availableSchools.find(s => s.id == value);
            setData(d => ({
                ...d,
                school_id: value,
                location: school ? school.location : "",
                is_new_school: false
            }));
        }
    };

    // Fetch Provinces when Region changes (New School)
    useEffect(() => {
        if (data.region_id) {
            axios.get(route('community.getProvinces', { region_id: data.region_id }))
                .then(res => setProvinces(res.data));
            setData(d => ({ ...d, province_id: "", municipality_id: "" }));
        }
    }, [data.region_id]);

    // Fetch Municipalities when Province changes (New School)
    useEffect(() => {
        if (data.province_id) {
            axios.get(route('community.getMunicipalities', { province_id: data.province_id }))
                .then(res => setMunicipalities(res.data));
            setData(d => ({ ...d, municipality_id: "" }));
        }
    }, [data.province_id]);

    const submit = (e) => {
        e.preventDefault();
        post(route('community.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans">
            <Head title="Add Community School" />
            <div className="relative z-20">
                <Header />
            </div>

            <main className="flex-grow relative z-10 py-12 px-4 flex justify-center items-center"
                style={{
                    backgroundImage: "url('/images/MCC/MCC2_BG.png')", // Reusing bg
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed"
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 z-0"></div>

                <div className="w-full max-w-3xl bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-700 p-8 relative z-10 shadow-2xl">
                    <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Add Community School
                    </h1>
                    <p className="text-gray-400 mb-8">Contribute to the school directory by adding location and map details.</p>

                    <form onSubmit={submit} className="space-y-6">
                        {/* 1. Select Island */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">1. Select Island</label>
                            <select
                                value={data.island_id}
                                onChange={e => setData("island_id", e.target.value)}
                                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-white"
                                required={!showNewSchoolForm}
                            >
                                <option value="">Select an Island...</option>
                                {islands.map(island => (
                                    <option key={island.id} value={island.id}>{island.name}</option>
                                ))}
                            </select>
                            {errors.island_id && <p className="text-red-400 text-sm mt-1">{errors.island_id}</p>}
                        </div>

                        {/* 2. Select School (or Add New) */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">2. Select School</label>
                            <div className="relative">
                                <SchoolIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <select
                                    value={showNewSchoolForm ? "new" : data.school_id}
                                    onChange={handleSchoolChange}
                                    className="w-full pl-10 bg-gray-800 border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-white"
                                    disabled={!data.island_id && !showNewSchoolForm}
                                    required
                                >
                                    <option value="">
                                        {data.island_id ? (loadingSchools ? "Loading schools..." : "Select a School...") : "Please select an island first"}
                                    </option>
                                    {availableSchools.map(school => (
                                        <option key={school.id} value={school.id}>{school.name}</option>
                                    ))}
                                    <option value="new" className="font-bold text-blue-300">+ Add New School</option>
                                </select>
                            </div>
                            {errors.school_id && <p className="text-red-400 text-sm mt-1">{errors.school_id}</p>}
                        </div>

                        {/* NEW SCHOOL FORM */}
                        {showNewSchoolForm && (
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-blue-500/30 space-y-4 animate-in fade-in slide-in-from-top-4">
                                <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                                    <Plus className="w-5 h-5" /> New School Details
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">School Name</label>
                                    <input
                                        type="text"
                                        value={data.new_school_name}
                                        onChange={e => setData("new_school_name", e.target.value)}
                                        className="w-full bg-gray-900 border-gray-700 rounded-lg focus:border-blue-500 text-white"
                                        placeholder="Enter full school name"
                                        required
                                    />
                                    {errors.new_school_name && <p className="text-red-400 text-sm mt-1">{errors.new_school_name}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Region</label>
                                        <select
                                            value={data.region_id}
                                            onChange={e => setData("region_id", e.target.value)}
                                            className="w-full bg-gray-900 border-gray-700 rounded-lg focus:border-blue-500 text-white"
                                            required
                                        >
                                            <option value="">Select Region...</option>
                                            {regions.map(r => (
                                                <option key={r.id} value={r.id}>{r.name}</option>
                                            ))}
                                        </select>
                                        {errors.region_id && <p className="text-red-400 text-sm mt-1">{errors.region_id}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Province</label>
                                        <select
                                            value={data.province_id}
                                            onChange={e => setData("province_id", e.target.value)}
                                            className="w-full bg-gray-900 border-gray-700 rounded-lg focus:border-blue-500 text-white"
                                            disabled={!data.region_id}
                                            required
                                        >
                                            <option value="">Select Province...</option>
                                            {provinces.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Municipality (Location)</label>
                                        <select
                                            value={data.municipality_id}
                                            onChange={e => setData("municipality_id", e.target.value)}
                                            className="w-full bg-gray-900 border-gray-700 rounded-lg focus:border-blue-500 text-white"
                                            disabled={!data.province_id}
                                            required
                                        >
                                            <option value="">Select Municipality...</option>
                                            {municipalities.map(m => (
                                                <option key={m.id} value={m.id}>{m.name}</option>
                                            ))}
                                        </select>
                                        {errors.municipality_id && <p className="text-red-400 text-sm mt-1">{errors.municipality_id}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. Location (Auto-filled or hidden if new school) */}
                        {!showNewSchoolForm && (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">3. Location (Municipality)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        value={data.location}
                                        readOnly
                                        className="w-full pl-10 bg-gray-800/50 border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                                        placeholder="Auto-filled from school selection"
                                    />
                                </div>
                            </div>
                        )}

                        {/* 4. Map Code (Searchable) */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">4. Map Code (Select Location)</label>
                            <Combobox
                                value={data.map_code}
                                onChange={(val) => setData("map_code", val)}
                                onClose={() => setQuery('')}
                            >
                                <div className="relative">
                                    <ComboboxInput
                                        className="w-full bg-gray-800 border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-white py-2 pl-3 pr-10"
                                        placeholder="Search location..."
                                        displayValue={(code) => {
                                            const loc = mapLocations.find(l => l.code === code);
                                            return loc ? `${loc.name} - ${loc.code}` : code;
                                        }}
                                        onChange={(event) => setQuery(event.target.value)}
                                        required
                                    />
                                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronsUpDown className="w-5 h-5 text-gray-400" aria-hidden="true" />
                                    </ComboboxButton>
                                </div>
                                <ComboboxOptions anchor="bottom" className="w-[var(--input-width)] bg-gray-800 border border-gray-700 rounded-lg mt-1 max-h-60 overflow-auto z-50 shadow-xl empty:invisible">
                                    {filteredLocations.length === 0 && query !== '' ? (
                                        <div className="relative cursor-default select-none py-2 px-4 text-gray-400">
                                            Nothing found.
                                        </div>
                                    ) : (
                                        filteredLocations.map((loc) => (
                                            <ComboboxOption
                                                key={loc.code}
                                                value={loc.code}
                                                className={({ focus }) =>
                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${focus ? 'bg-blue-600 text-white' : 'text-gray-300'
                                                    }`
                                                }
                                            >
                                                {({ selected, focus }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                }`}
                                                        >
                                                            {loc.name} - {loc.code}
                                                        </span>
                                                        {selected ? (
                                                            <span
                                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${focus ? 'text-white' : 'text-blue-400'
                                                                    }`}
                                                            >
                                                                <Check className="h-5 w-5" aria-hidden="true" />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </ComboboxOption>
                                        ))
                                    )}
                                </ComboboxOptions>
                            </Combobox>
                            {errors.map_code && <p className="text-red-400 text-sm mt-1">{errors.map_code}</p>}
                        </div>

                        {/* 5. School Link */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">5. School Link (Website/Page)</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="url"
                                    value={data.school_link}
                                    onChange={e => setData("school_link", e.target.value)}
                                    className="w-full pl-10 bg-gray-800 border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-white"
                                    placeholder="https://..."
                                    required
                                />
                            </div>
                            {errors.school_link && <p className="text-red-400 text-sm mt-1">{errors.school_link}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <span className="animate-pulse">Saving...</span>
                            ) : (
                                <>
                                    Submit Community Record <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
