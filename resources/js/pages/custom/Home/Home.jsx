import {useEffect, useState} from "react";
import HeroSection from "./components/HeroSection/HeroSection.jsx";
import ExperienceSection from "./components/ExperienceSection.jsx";
import InfoSection from "./components/InfoSection.jsx";
import NewsSection from "./components/NewsSection.jsx";
import NetworkSection from "./components/NetworkSection.jsx";

const Home = () => {
    const [message, setMessage] = useState('Loading...')

    useEffect(() => {
        const apiUrl = process.env.NODE_ENV === 'development'
            ? '/api/example'  // Proxy in development
            : `${import.meta.env.VITE_API_BASE_URL}/example`;  // Production URL

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                console.log('Received message from backend:', data.message)
                setMessage(data.message)
            })
            .catch(err => {
                console.error('Error fetching from backend:', err)
                setMessage('Failed to fetch data from backend.')
            })
    }, [])

  return (
      <div className={`pb-16`}>
          {/*<div className="bottom-0 text-sm w-full uppercase text-right fixed select-none z-50 mix-blend-exclusion">{message}</div>*/}
          <HeroSection/>
          <InfoSection/>
          <NetworkSection/>
          <ExperienceSection/>
          <NewsSection/>
      </div>
  )
}

export default Home;