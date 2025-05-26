import { useEffect, useState } from "react";

const Program = () => {
    const [fileName, setFileName] = useState("");

    useEffect(() => {
        // Extract the filename from import.meta.url
        const path = window.location.pathname;
        const name = path.split("/").pop().split(".")[0]; // Get the filename without extension
        setFileName(name);
    }, []);

    return (
        <>
            <h1 className="flex items-center justify-center text-6xl font-bold text-center">{fileName} page</h1>
        </>
    );
}

export default Program;
