import Image from "next/image";
import React from "react";

const PhilippineYouthDevelopmentPlan = () => {
  // Data for each committee (replace with actual data)
  const committeeData = {
    active_citizenship: 75,
    economic_empowerment: 75,
    education: 75,
    environment: 75,
    global_mobility: 75,
    governance: 75,
    health: 75,
    peace_building_and_security: 75,
    social_inclusion_and_equity: 75,
    agriculture: 75,
  };

  return (
    <section  className="pt-[7rem] pb-[7.5rem] dark:bg-[#282a42] bg-white">
      <div id="committee" className="container mx-auto px-6 grid space-y-16">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left: PYDP Title */}
          <div className="flex items-center gap-2">
            <div className="relative size-52">
              <Image
                src="https://nyc-sk.com/assets/img/pydp-logos/pydp_logo.png"
                alt="PYDP logo"
                fill
                className="size-full"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-4xl font-black leading-tight mb-2">
                Philippine
                <br />
                Youth
                <br />
                Development
                <br />
                Plan
              </h2>
              <p className="text-muted-foreground text-lg font-medium">
                Programs, Projects, and Activities
              </p>
            </div>
          </div>

          {/* Right: First 4 Hexagons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="relative size-60 group">
              <Image
                src="https://nyc-sk.com/assets/img/pydp-logos/active_citizenship.png"
                alt="active_citizenship"
                className="size-full object-contain"
                fill
              />
              <span className="absolute inset-0 flex items-center justify-center text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#282a42] to-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs rounded-lg cursor-pointer">
                {committeeData.active_citizenship}
              </span>
            </div>
            <div className="relative size-60 group">
              <Image
                src="https://nyc-sk.com/assets/img/pydp-logos/economic_empowerment.png"
                alt="economic_empowerment"
                className="size-full object-contain"
                fill
              />
              <span className="absolute inset-0 flex items-center justify-center text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#282a42] to-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs rounded-lg cursor-pointer">
                {committeeData.economic_empowerment}
              </span>
            </div>
            <div className="relative size-60 group">
              <Image
                src="https://nyc-sk.com/assets/img/pydp-logos/education.png"
                alt="education"
                className="size-full object-contain"
                fill
              />
              <span className="absolute inset-0 flex items-center justify-center text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#282a42] to-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs rounded-lg cursor-pointer">
                {committeeData.education}
              </span>
            </div>
            <div className="relative size-60 group">
              <Image
                src="https://nyc-sk.com/assets/img/pydp-logos/environment.png"
                alt="environment"
                className="size-full object-contain"
                fill
              />
              <span className="absolute inset-0 flex items-center justify-center text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#282a42] to-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs rounded-lg cursor-pointer">
                {committeeData.environment}
              </span>
            </div>
          </div>
        </div>
        {/* Bottom Section: Remaining 6 Icons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-center">
          <div className="relative size-60 group">
            <Image
              src="https://nyc-sk.com/assets/img/pydp-logos/global_mobility.png"
              alt="global_mobility"
              className="size-full object-contain"
              fill
            />
            <span className="absolute inset-0 flex items-center justify-center text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#282a42] to-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs rounded-lg cursor-pointer">
              {committeeData.global_mobility}
            </span>
          </div>
          <div className="relative size-60 group">
            <Image
              src="https://nyc-sk.com/assets/img/pydp-logos/governance.png"
              alt="governance"
              className="size-full object-contain"
              fill
            />
            <span className="absolute inset-0 flex items-center justify-center text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#282a42] to-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs rounded-lg cursor-pointer">
              {committeeData.governance}
            </span>
          </div>
          <div className="relative size-60 group">
            <Image
              src="https://nyc-sk.com/assets/img/pydp-logos/health.png"
              alt="health"
              className="size-full object-contain"
              fill
            />
            <span className="absolute inset-0 flex items-center justify-center text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#282a42] to-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs rounded-lg cursor-pointer">
              {committeeData.health}
            </span>
          </div>
          <div className="relative size-60 group">
            <Image
              src="https://nyc-sk.com/assets/img/pydp-logos/peace_building_and_security.png"
              alt="peace_building_and_security"
              className="size-full object-contain"
              fill
            />
            <span className="absolute inset-0 flex items-center justify-center text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#282a42] to-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs rounded-lg cursor-pointer">
              {committeeData.peace_building_and_security}
            </span>
          </div>
          <div className="relative size-60 group">
            <Image
              src="https://nyc-sk.com/assets/img/pydp-logos/social_inclusion_and_equity.png"
              alt="social_inclusion_and_equity"
              className="size-full object-contain"
              fill
            />
            <span className="absolute inset-0 flex items-center justify-center text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#282a42] to-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs rounded-lg cursor-pointer">
              {committeeData.social_inclusion_and_equity}
            </span>
          </div>
          <div className="relative size-60 group">
            <Image
              src="https://nyc-sk.com/assets/img/pydp-logos/agriculture.png"
              alt="agriculture"
              className="size-full object-contain"
              fill
            />
            <span className="absolute inset-0 flex items-center justify-center text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#282a42] to-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs rounded-lg cursor-pointer">
              {committeeData.agriculture}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilippineYouthDevelopmentPlan;
