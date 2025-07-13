/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from 'react';
import { MessageCircle, Mail, User, FileText } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function ContactPage() {
	const {theme} = useTheme();
	const isDarkMode = theme === 'dark';
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    confirmEmail: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };


  return (
    <div id='contact-us' className={`min-h-screen py-12 px-4 transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className={`text-5xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            We love hearing <span className="text-blue-500">from you</span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${
            isDarkMode ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Feel free to write us your message and we'll respond as fast as we can.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left side - 3D Illustration */}
          <div className="relative size-full lg:col-span-2">
            <Image src="https://nyc-sk.com/assets/img/front-pages/landing-page/sitting-girl-with-laptop.png" alt='Contact' fill className='size-full object-contain' />
          </div>

          {/* Right side - Contact Form */}
          <div className={`rounded-xl lg:col-span-3 p-8 shadow-2xl transition-all duration-300 ${
            isDarkMode
              ? 'bg-slate-800/50 backdrop-blur-sm border border-slate-700'
              : 'bg-white/80 backdrop-blur-sm border border-gray-200'
          }`}>
            <div className="flex items-center gap-3 mb-5">
              <MessageCircle className={`size-6 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-500'
              }`} />
              <h2 className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Contact Form
              </h2>
            </div>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Full Name *
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 size-4 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDarkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Email Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    Your Email *
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 size-4 ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-400'
                    }`} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmEmail" className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    Confirm Email *
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 size-4 ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-400'
                    }`} />
                    <input
                      type="email"
                      id="confirmEmail"
                      name="confirmEmail"
                      value={formData.confirmEmail}
                      onChange={handleInputChange}
                      placeholder="Confirm your email address"
                      className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Subject *
                </label>
                <div className="relative">
                  <FileText className={`absolute left-3 top-1/2 transform -translate-y-1/2 size-4 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Your subject"
                    className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDarkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Type here..."
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                    isDarkMode
                      ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer"
                >
                  Send Message
                </button>
              </div>
            </div>

            {/* Status */}
            {/* <div className="mt-6 text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode
                  ? 'bg-slate-700/30'
                  : 'bg-gray-200/50'
              }`}>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  CURRENTLY UNAVAILABLE
                </span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
