import React from "react";
import { Head } from "@inertiajs/react";
import { Header, Footer } from "@/Components";
import Highlights from "./Highlights";
import Articles from "./Articles";

export default function NewsPage() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Mobile Legends: Bang Bang Campus Championship - News</title>
        <meta name="description" content="Latest news and updates about the Mobile Legends Campus Championship" />
      </Head>

      <div className="relative z-10">
        <Header />
      </div>

      <main className="relative z-0 py-16">
        <div className="w-full min-h-screen"
          style={{
            background: "#000",
            backgroundImage: "url('/images/MCC/VoteBG.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
          }}
        >
          {/* MSL Highlights Section */}
          <section className="mb-16">
            <Highlights />
          </section>

          {/* News and Articles Section */}
          <section>
            <Articles />
          </section>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
