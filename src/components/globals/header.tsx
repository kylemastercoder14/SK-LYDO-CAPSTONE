"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "./toggle-theme";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: "#mission-vision", label: "Mission & Vision" },
    { href: "#committee", label: "Committee" },
    { href: "#officials", label: "Officials" },
    { href: "#contact-us", label: "Contact Us" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 dark:bg-[#30334e] bg-white shadow-lg">
      <div className="px-4 md:px-40 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-40 md:w-60 h-20 md:h-30">
            <Image alt="Logo" src="/main-logo.png" fill className="size-full" />
          </div>
          <div className="text-xl md:text-2xl dark:text-white text-black font-bold">
            SK Web Portal
          </div>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex items-center space-x-6 text-lg dark:text-white text-black">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#98a4ff]"
              >
                {link.label}
              </Link>
            ))}
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
            <ModeToggle />
          </div>
        )}

        {/* Mobile Hamburger Menu */}
        {isMobile && (
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <button
              onClick={toggleMenu}
              className="text-black dark:text-white cursor-pointer focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobile && isMenuOpen && (
        <div className="px-4 pb-4 md:hidden bg-white dark:bg-[#30334e] shadow-md">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg dark:text-white text-black hover:text-[#98a4ff] py-2"
                onClick={toggleMenu}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/sign-in"
              className={buttonVariants({
                variant: "primary",
                size: "lg",
                className: "text-[18px] w-full text-center",
              })}
              onClick={toggleMenu}
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
