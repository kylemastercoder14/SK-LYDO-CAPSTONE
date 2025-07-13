"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const HeroSection = () => {
  const { theme } = useTheme();

  return (
    <section className="py-10 md:py-20 dark:bg-[#30334e] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card-custom rounded-lg shadow-lg border">
          <div className="relative z-1 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center px-4 md:px-8 py-5 gap-6 md:gap-10">
              {/* Text Content */}
              <div className="w-full md:w-[60%] order-2 md:order-1 text-center md:text-left">
                <h4 className="font-black text-zinc-700 dark:text-white text-3xl sm:text-4xl tracking-tighter">
                  Welcome to{" "}
                  <span className="text-[#409af3]">SK Web Portal</span>
                </h4>
                <p className="mt-2 text-base sm:text-xl">
                  Your journey to good governance starts here! We&apos;re dedicated
                  to empowering SK officials and youth leaders with a
                  seamless, transparent, and effective platform for
                  administration and reporting.
                </p>
                <Button variant="primary" size="lg" className="mt-4">
                  Join Us &rarr;
                </Button>
              </div>

              {/* Image Content */}
              <div className="w-full md:w-[40%] order-1 md:order-2 relative h-[200px] sm:h-[250px] md:h-[300px]">
                <Image
                  src={
                    theme === "dark" ? "/login-light.png" : "/login-dark.png"
                  }
                  alt="Login page"
                  fill
                  className="size-full blop-image object-contain"
                  priority
                />
              </div>
            </div>

            <div className="blop"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
