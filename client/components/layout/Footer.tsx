'use client';

import Link from 'next/link';
import Container from 'client/components/layout/Container';
import { BRAND, FOOTER_LINKS, ICONS } from '@/shared/constants';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-16">
      <Container>
        <div className="flex flex-col gap-12">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between gap-10">
            {/* Brand */}
            <div className="flex flex-col gap-4 max-w-[300px]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center text-white">
                  <span>
                    <Image
                      src="/images/logo-icon.png"
                      alt="Logo"
                      width={24}
                      height={24}
                    />
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-900">{BRAND.name}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                The ultimate study companion for your IELTS journey.
                Personalized, effective, and AI-powered.
              </p>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-20">
              {/* Platform */}
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-gray-900">Platform</h4>
                <ul className="flex flex-col gap-2 text-sm text-gray-600">
                  {FOOTER_LINKS.platform.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-blue-600 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-gray-900">Legal</h4>
                <ul className="flex flex-col gap-2 text-sm text-gray-600">
                  {FOOTER_LINKS.legal.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-blue-600 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social */}
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-gray-900">Social</h4>
                <div className="flex gap-4">
                  <Link
                    href="#"
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-600"
                  >
                    <ICONS.youtube fontSize='small'/>
                  </Link>
                  <Link
                    href="#"
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-600"
                  >
                    <ICONS.public fontSize='small'/>
                  </Link>
                  <Link
                    href="#"
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-600"
                  >
                    <ICONS.x fontSize="small" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2024 {BRAND.name}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <ICONS.language fontSize="small" className="mr-1" />
                English (US)
              </button>
              <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <ICONS.lightMode fontSize="small" className="mr-1" />
                Light Mode
              </button>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
