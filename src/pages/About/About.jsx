import React from "react";
import Navbar from "../../components/Navbar/navbar";
import TopBanner from "../../components/TopBanner/TopBanner";

export default function About() {
  return (
    <div className="min-h-screen bg-white text-amber-900">
      <Navbar />
      <TopBanner />

      <main className="max-w-6xl mx-auto py-12 px-4 space-y-16">
        <h1 className="text-3xl font-bold mb-6">About Elino Foods</h1>

        {/* Feature sections: alternate image left/right on wide screens */}
        {[
          {
            title: "Our Mission",
            text: "To make wholesome, delicious snacks that fit into everyday life — crafted from simple, honest ingredients.",
            img: "/assets/slide 1.jpg",
            cta: "Learn more",
          },
          {
            title: "Sourcing",
            text: "We partner with small growers and suppliers to ensure fair practices and high-quality ingredients.",
            img: "/assets/almond.png",
            cta: "Our sourcing",
          },
          {
            title: "Sustainability",
            text: "From packaging to farming, we aim to reduce our footprint and support regenerative practices.",
            img: "/assets/Rectangle.png",
            cta: "Our approach",
          },
        ].map((section, idx) => (
          <section
            key={section.title}
            className="grid items-center gap-6 md:grid-cols-2 md:gap-12"
          >
            {/* on even indexes show image first otherwise text first */}
            <div
              className={`${
                idx % 2 === 0 ? "order-1" : "md:order-2"
              } w-full h-56 md:h-64 rounded-lg overflow-hidden shadow-sm`}
            >
              <img
                src={section.img}
                alt={section.title}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>

            <div className={`${idx % 2 === 0 ? "order-2" : "md:order-1"}`}>
              <h3 className="text-2xl font-semibold text-amber-900 mb-3">
                {section.title}
              </h3>
              <p className="text-gray-700 mb-4">{section.text}</p>
              <button className="inline-block bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition">
                {section.cta}
              </button>
            </div>
          </section>
        ))}

        {/* Team + Values compact section */}
        <section className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-amber-900 mb-4">
              Our Values
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block w-3 h-3 bg-amber-700 rounded-full" />
                <div>
                  <div className="font-semibold">Natural Ingredients</div>
                  <div className="text-sm">
                    Minimal processing, maximum flavour.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block w-3 h-3 bg-amber-700 rounded-full" />
                <div>
                  <div className="font-semibold">Sustainable Sourcing</div>
                  <div className="text-sm">
                    Partnering with growers committed to the land.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block w-3 h-3 bg-amber-700 rounded-full" />
                <div>
                  <div className="font-semibold">Transparent Labels</div>
                  <div className="text-sm">
                    Clear ingredient lists and honest claims.
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-amber-900 mb-4">
              Meet the team
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {["Anjali", "Ravi", "Priya", "Simran"].map((n, i) => (
                <div
                  key={n}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-amber-50 transition"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-800">
                    {n[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{n}</div>
                    <div className="text-sm text-gray-600">
                      {i === 0 ? "Founder" : "Team"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
