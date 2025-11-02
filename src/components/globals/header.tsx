"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "./toggle-theme";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { href: "#mission-vision", label: "Mission & Vision" },
    { href: "#committee", label: "Committee" },
    { href: "#officials", label: "Officials" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 bg-white dark:bg-[#30334e] shadow-lg">
      <div className="px-4 sm:px-6 md:px-20 lg:px-40 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-28 sm:w-32 md:w-40 lg:w-60 h-12 sm:h-16 md:h-20 lg:h-30">
            <Image alt="Logo" src="/main-logo.png" fill className="object-contain" />
          </div>
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-black dark:text-white">
            SK Web Portal
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 text-lg text-black dark:text-white">
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

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex items-center space-x-4">
          <ModeToggle />
          <button
            onClick={toggleMenu}
            className="text-black dark:text-white cursor-pointer focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 bg-white dark:bg-[#30334e] shadow-md">
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
