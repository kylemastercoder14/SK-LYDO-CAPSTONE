"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const MissionVisionSection = () => {
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <section id='mission-vision' className="bg-card-custom">
      <div className="grid lg:grid-cols-2 grid-cols-1">
        {/* Left Column - Description */}
        <div className="px-6 py-10 md:px-12 lg:px-20 lg:py-20">
          <h4 className="font-black tracking-tighter text-3xl md:text-4xl lg:text-5xl mb-4">
            SK Web Portal
          </h4>
          <p className='text-base md:text-lg text-zinc-800 dark:text-zinc-200'>
            The Sangguniang Kabataan Web Portal is exclusively tailored for SK,
            LYDO, and LYDC members, providing easy access to essential
            information, templates, and forms and allowing them to submit
            reports. It offers opportunities for continuing training and skill
            development through various courses, ensuring continuous growth and
            improvement. Additionally, it serves as a seamless channel for the
            National Youth Commission to transmit vital information from the
            national level down to the barangays, facilitating efficient
            communication and collaboration.
          </p>
        </div>

        {/* Right Column - Tabs */}
        <div className="flex flex-col">
          {/* Logo Image */}
          <div className="relative w-full h-[200px] md:h-[250px] bg-[#4a93dc] flex items-center justify-center">
            <Image
              src="/main-logo.png"
              alt="Logo"
              className="object-contain p-8"
              fill
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium text-lg transition-colors ${
                activeTab === 'mission'
                  ? 'text-[#409af3] border-b-2 border-[#409af3]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('mission')}
            >
              MISSION
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium text-lg transition-colors ${
                activeTab === 'vision'
                  ? 'text-[#409af3] border-b-2 border-[#409af3]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('vision')}
            >
              VISION
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8 lg:p-10">
            {activeTab === 'mission' ? (
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-[#409af3]">OUR MISSION</h3>
                <p className="text-base md:text-lg text-zinc-800 dark:text-zinc-200">
                  To empower Sangguniang Kabataan officials and youth leaders with
                  innovative digital tools that enhance transparency, streamline
                  administrative processes, and foster effective governance at the
                  grassroots level.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-[#409af3]">OUR VISION</h3>
                <p className="text-base md:text-lg text-zinc-800 dark:text-zinc-200">
                  A dynamic and digitally-empowered youth leadership that drives
                  positive change in every barangay, connected through a unified
                  platform that bridges communication gaps and amplifies youth
                  participation in nation-building.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
