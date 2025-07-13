import React from "react";
import { ChevronRight } from "lucide-react";
import { FaFacebook, FaMap } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="dark:bg-[#41456b] bg-[#e7e7e781] pt-10 dark:text-white overflow-hidden relative z-1 text-black">
      <div className="size-[800px] absolute rounded-full opacity-20 -bottom-80 -z-1 right-10">
        <Image
          src="/lydo-logo.jpg"
          alt="LYDO"
          fill
          className="size-full rounded-full"
        />
      </div>
      {/* Main Footer Content */}
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* NYC Logo and Description */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-2">
                <div className="w-48 h-24 relative">
                  <Image
                    src="/main-logo.png"
                    alt="Logo"
                    fill
                    className="size-full object-contain"
                  />
                </div>
                <span className="ml-2 text-sm uppercase font-medium">
                  Local Youth Development Office
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Local Youth Development Office serves as the advocate of the
                youth, championing policies and programs that prioritize their
                needs and empower their voices in the community.
              </p>
            </div>

            {/* About GOVPH */}
            <div>
              <h3 className="dark:text-white text-black font-semibold mb-4">
                About GOVPH
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Learn more about the Philippine government, its structure, how
                government works and the people behind it
              </p>
            </div>

            {/* Executive */}
            <div>
              <h3 className="dark:text-white text-black font-semibold mb-4">
                Executive
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-4 text-[#666cff]" />
                  <a
                    href="https://op-proper.gov.ph/"
                    className="text-sm hover:text-[#666cff] transition-colors"
                  >
                    Office of the President
                  </a>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-4 text-[#666cff]" />
                  <a
                    href="https://www.ovp.gov.ph/"
                    className="text-sm hover:text-[#666cff] transition-colors"
                  >
                    Office of the Vice President
                  </a>
                </li>
              </ul>
            </div>

            {/* Judiciary */}
            <div>
              <h3 className="dark:text-white text-black font-semibold mb-4">
                Judiciary
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-4 text-[#666cff]" />
                  <a
                    href="https://sc.judiciary.gov.ph/"
                    className="text-sm hover:text-[#666cff] transition-colors"
                  >
                    Supreme Court
                  </a>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-4 text-[#666cff]" />
                  <a
                    href="https://ca.judiciary.gov.ph/"
                    className="text-sm hover:text-[#666cff] transition-colors"
                  >
                    Court of Appeals
                  </a>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-4 text-[#666cff]" />
                  <a
                    href="https://sb.judiciary.gov.ph/"
                    className="text-sm hover:text-[#666cff] transition-colors"
                  >
                    Sandiganbayan
                  </a>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-4 text-[#666cff]" />
                  <a
                    href="https://cta.judiciary.gov.ph/"
                    className="text-sm hover:text-[#666cff] transition-colors"
                  >
                    Court of Tax Appeals
                  </a>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-4 text-[#666cff]" />
                  <a
                    href="https://jbc.judiciary.gov.ph/"
                    className="text-sm hover:text-[#666cff] transition-colors"
                  >
                    Judicial Bar and Council
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mt-8">
            {/* Philippine Seal and Republic */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="size-40 relative mr-2">
                  <Image
                    src="https://nyc-sk.com/assets/img/img-pages/rop.png"
                    alt="Philippine Seal"
                    fill
                    className="size-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium">
                  REPUBLIC OF THE PHILIPPINES
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                All contents is in the public domain unless otherwise stated
              </p>
            </div>

            {/* Judiciary Links */}
            <div>
              <h3 className="dark:text-white text-black font-semibold mb-4">
                Judiciary
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-4 text-[#666cff]" />
                  <a
                    href="https://data.gov.ph/index/home"
                    className="text-sm hover:text-[#666cff] transition-colors"
                  >
                    Open Data Portal
                  </a>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-4 text-[#666cff]" />
                  <a
                    href="https://www.officialgazette.gov.ph/"
                    className="text-sm hover:text-[#666cff] transition-colors"
                  >
                    Official Gazette
                  </a>
                </li>
              </ul>
            </div>

            {/* Legislative */}
            <div>
              <h3 className="dark:text-white text-black font-semibold mb-4">
                Legislative
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-4 text-[#666cff]" />
                  <a
                    href="https://legacy.senate.gov.ph/"
                    className="text-sm hover:text-[#666cff] transition-colors"
                  >
                    Senate of the Philippines
                  </a>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-4 text-[#666cff]" />
                  <a
                    href="https://www.congress.gov.ph/"
                    className="text-sm hover:text-[#666cff] transition-colors"
                  >
                    House of Representatives
                  </a>
                </li>
              </ul>
            </div>

            {/* Other Agencies */}
            <div>
              <h3 className="dark:text-white text-black font-semibold mb-4">
                Other Agencies
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-4 text-[#666cff]" />
                  <a
                    href="https://www.bir.gov.ph/home"
                    className="text-sm hover:text-[#666cff] transition-colors"
                  >
                    Bureau of Internal Revenue
                  </a>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-4 text-[#666cff]" />
                  <a
                    href="https://customs.gov.ph/"
                    className="text-sm hover:text-[#666cff] transition-colors"
                  >
                    Bureau of Customs
                  </a>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-4 text-[#666cff]" />
                  <a
                    href="https://www.treasury.gov.ph/"
                    className="text-sm hover:text-[#666cff] transition-colors"
                  >
                    Bureau of Treasury
                  </a>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-4 text-[#666cff]" />
                  <a
                    href="https://www.dof.gov.ph/"
                    className="text-sm hover:text-[#666cff] transition-colors"
                  >
                    Bureau of Local Government Finance
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#251910] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="w-18 h-12 relative">
              <Image
                src="/main-logo.png"
                alt="Logo"
                fill
                className="size-full object-contain"
              />
            </div>
            <span>
              ©2025 Copyright 2025 Local Youth Development Office - City of
              Dasmariñas | All Rights Reserved
            </span>
          </div>

          <div className="flex items-center space-x-4 text-white mt-4 md:mt-0">
            <a
              href="https://www.facebook.com/dasma.lydo/"
              target="_blank" title='Facebook'
              className="transition-colors"
            >
              <FaFacebook className="w-5 h-5" />
            </a>
            <a
              href="mailto:dasma.lydo@gmail.com"
              target="_blank"
              title='Email'
              className="transition-colors"
            >
              <SiGmail className="w-5 h-5" />
            </a>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=14.32377573234%2C120.96195407063&fbclid=IwY2xjawLdX5xleHRuA2FlbQIxMABicmlkETE3bDJnZWpSc082QURjQWM1AR5Xox0jtlq75cWC1sFIkQyll_egUSTb4VdC76WbqqzrZ8PIuCQ5G_8U3HHRxQ_aem_Mm5hxmf-MtuscemVng_4IA"
              className="transition-colors"
              title='Location'
              target="_blank"
            >
              <FaMap className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
