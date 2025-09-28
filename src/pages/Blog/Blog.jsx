import React from "react";
import Navbar from "../../components/Navbar/navbar";
import TopBanner from "../../components/TopBanner/TopBanner";

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <TopBanner />
      <main className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">
          From the Blog
        </h1>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <article
              key={n}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="h-40 bg-gradient-to-r from-amber-200 to-amber-100 flex items-end">
                <img
                  src={`/assets/blg ${n % 3 === 0 ? 3 : n % 3}.png`}
                  alt={`post-${n}`}
                  className="w-full h-40 object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-2">
                  Aug 20, 2025 · 4 min read
                </div>
                <h2 className="text-lg font-semibold mb-2">
                  Healthy Snack Hacks {n}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Quick tips to make your snacks healthier and tastier. Learn
                  how to mix flavours and textures for a balanced bite.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                      Nutrition
                    </span>
                    <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                      Recipes
                    </span>
                  </div>
                  <button className="text-amber-700 text-sm font-medium hover:underline">
                    Read more
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
