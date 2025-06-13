import React from "react";
import { Head } from "@inertiajs/react";
import { Header, Footer } from "@/Components";
import Highlights from "./Highlights";
import Articles from "./Articles";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-Background-Default-Default">
      <Head>
        <title>Mobile Legends: Bang Bang Campus Championship - News</title>
        <meta name="description" content="Latest news and updates about the Mobile Legends Campus Championship" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <header className="w-full h-24 px-8 bg-Background-Default-Secondary border-b border-Border-Default-Default flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex justify-center items-center">
              <img className="w-36 h-11" src="/images/MSL/logo.png" alt="MSL Logo" />
            </div>
          </div>
          <div className="px-3 py-2 rounded-lg flex items-center gap-2">
            <div className="w-10 h-10 relative rounded-full overflow-hidden">
              <img className="w-full h-full object-cover" src="/images/default-avatar.png" alt="User Avatar" />
            </div>
          </div>
        </header>
      </div>

      <main className="flex-grow">
        <div className="w-full min-h-screen bg-black"
          style={{
            backgroundImage: "url('/images/MCC/News/NewsBG.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
          }}
        >
          {/* Main Content */}
          <div className="max-w-[1900px] mx-auto px-4 md:px-12">
            <section className="mb-8">
              <Highlights />
            </section>

            <section>
              <Articles />
            </section>
          </div>
        </div>
      </main>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile Footer */}
      <div className="md:hidden">
        <footer className="px-4 pt-8 pb-6 bg-Background-Default-Default border-t border-Border-Default-Default">
          {/* Logo and Description */}
          <div className="mb-12">
            <img className="w-44 h-12 mb-6" src="/images/MSL/logo.png" alt="MSL Logo" />
            <p className="text-sm opacity-50 leading-tight">
              This website is under the use of Moonton Student Leaders Philippines supervised and monitored by the SERP Department. 
              For inquiries and website concerns, send it to us using this link or you may contact us through contact@moontonslph.org
            </p>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <h3 className="text-[10px] font-semibold uppercase opacity-50 mb-4">Catalog</h3>
                <ul className="space-y-1">
                  <li className="text-sm">Events</li>
                  <li className="text-sm">News</li>
                  <li className="text-sm">Program</li>
                  <li className="text-sm">Resources</li>
                </ul>
              </div>
              <div>
                <h3 className="text-[10px] font-semibold uppercase opacity-50 mb-4">Quick Links</h3>
                <ul className="space-y-1">
                  <li className="text-sm">SL Apply</li>
                  <li className="text-sm">MCC Registration</li>
                  <li className="text-sm">Network</li>
                </ul>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <h3 className="text-[10px] font-semibold uppercase opacity-50 mb-4">About</h3>
                <ul className="space-y-1">
                  <li className="text-sm">Our Story</li>
                  <li className="text-sm">Team</li>
                  <li className="text-sm">Partnerships</li>
                  <li className="text-sm">News & Updates</li>
                </ul>
              </div>
              <div>
                <h3 className="text-[10px] font-semibold uppercase opacity-50 mb-4">Legal</h3>
                <ul className="space-y-1">
                  <li className="text-sm">Privacy Policy</li>
                  <li className="text-sm">Terms of Use</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px opacity-30 bg-gradient-to-r from-transparent via-white/30 to-transparent mb-8" />

          {/* Partner Logos */}
          <div className="flex justify-center gap-6 mb-8">
            <img className="w-40 h-12" src="/images/moonton-logo.png" alt="Moonton Logo" />
            <img className="w-32 h-12" src="/images/mlbb-logo.png" alt="MLBB Logo" />
          </div>

          {/* Copyright and Social */}
          <div className="flex justify-between items-center">
            <div className="opacity-50 text-[10px] font-medium">
              © 2025 — Copyright
            </div>
            <div className="flex gap-6">
              {/* Add social media icons here */}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
