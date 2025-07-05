"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";

const Header = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return (
    <>
      {!isMobile && (
        <nav className="fixed top-0 left-0 right-0 z-20">
          <div className="dark:bg-[#30334e] bg-white shadow-lg px-4">
            <div className="px-40 flex justify-between items-center text-sm">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative w-60 h-30">
                  <Image
                    alt="Logo"
                    src="/main-logo.png"
                    fill
                    className="size-full"
                  />
                </div>
                <div className="text-2xl dark:text-white text-black font-bold">
                  SK Web Portal
                </div>
              </Link>
              <div className="flex items-center space-x-6 text-lg dark:text-white text-black">
                <Link href="#mission-vision" className="hover:text-[#98a4ff]">
                  Mission & Vision
                </Link>
                <Link href="#officials" className="hover:text-[#98a4ff]">
                  Officials
                </Link>
                <Link href="#contact-us" className="hover:text-[#98a4ff]">
                  Contact Us
                </Link>
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    variant: "primary",
                    size: "lg",
                    className: "text-[18px]",
                  })}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Header;
