"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

const HeroImages = () => {
  const [activeImage, setActiveImage] = useState("organize"); // organize, getHired, manageBoards
  return (
    <section className="border-t bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* navigation buttons */}
          <div className="flex gap-2 justify-center mb-8">
            <Button
              onClick={() => setActiveImage("organize")}
              className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeImage === "organize" ? "bg-primary text-white" : "bg-gray-100 text-black hover:bg-gray-200"} `}
            >
              Organize Applications
            </Button>
            <Button
              onClick={() => setActiveImage("getHired")}
              className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeImage === "getHired" ? "bg-primary text-white" : "bg-gray-100 text-black hover:bg-gray-200"} `}
            >
              Get Hired
            </Button>
            <Button
              onClick={() => setActiveImage("manageBoards")}
              className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeImage === "manageBoards" ? "bg-primary text-white" : "bg-gray-100 text-black hover:bg-gray-200"} `}
            >
              Manage Boards
            </Button>
          </div>

          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 shadow-xl">
            {activeImage === "organize" && (
              <Image
                src="/hero-images/hero1.png"
                alt="Organize Applications"
                width={1200}
                height={800}
              />
            )}
            {activeImage === "getHired" && (
              <Image
                src="/hero-images/hero2.png"
                alt="Get Hired"
                width={1200}
                height={800}
              />
            )}
            {activeImage === "manageBoards" && (
              <Image
                src="/hero-images/hero3.png"
                alt="Manage Boards"
                width={1200}
                height={800}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroImages;
