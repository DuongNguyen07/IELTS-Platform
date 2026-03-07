'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Container from 'client/components/layout/Container';
import Button from 'client/components/ui/Button';
import {
  BRAND, 
  AUTH_NAV_LINKS, 
  ICONS 
} from '@/shared/constants';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const isAuthenticated = !!session;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
    setMobileMenuOpen(false);
    setSettingsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSettingsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header className="sticky top-0 z-[100] w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <Container size="large">
        <div className="flex items-center justify-between py-4">
          
          {/* Logo */}
          <Link 
            href={isAuthenticated ? '/dashboard' : '/'} 
            className="flex items-center gap-2 md:gap-3 flex-shrink-0"
          >
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
            <span className="text-lg md:text-xl font-bold text-gray-900 sm:inline">
              {BRAND.name}
            </span>
          </Link>

          {/* Desktop Navigation - ONLY show when authenticated */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {AUTH_NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.Icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <Icon fontSize="small" />
                    <span className="xl:inline">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Side: Auth Buttons OR User Menu */}
          <div className="flex items-center gap-2 md:gap-3">
            {isAuthenticated ? (
              // Authenticated User Menu
              <>
                {/* Notification - Hidden on mobile */}
                <button 
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors hidden lg:block"
                  aria-label="Notifications"
                >
                  <ICONS.notifications fontSize="small" />
                </button>

                {/* Desktop Settings Drop Down - Hidden on mobile */}
                <div className="hidden lg:block relative" ref={dropdownRef}>
                  <button
                    className="flex items-center gap-2 pl-4 border-l border-gray-200 rounded-md hover:opacity-80 transition-opacity"
                    onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
                    aria-label="Settings"
                  >
                    <div className='hidden lg:flex flex-col items-end'>
                        <span className="text-sm font-bold text-gray-900">
                            {session.user?.name || 'Student'}
                        </span>
                        <span 
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: '#14b8a6' }}
                        >
                            Free Plan
                        </span>
                    </div>
                    <div className='w-10 h-10 rounded-full border-2 border-blue-600/20'></div>
                    <ICONS.expandMore fontSize="small" className={`text-gray-600 transition-transform ${settingsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {settingsDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setSettingsDropdownOpen(false)}
                        >
                          <ICONS.profile fontSize="small" className="text-gray-500" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setSettingsDropdownOpen(false)}
                        >
                          <ICONS.settings fontSize="small" className="text-gray-500" />
                          <span>Settings</span>
                        </Link>
                        <Link
                          href="/notifications"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setSettingsDropdownOpen(false)}
                        >
                          <ICONS.notifications fontSize="small" className="text-gray-500" />
                          <span>Notifications</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <ICONS.logout fontSize="small" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Mobile: Avatar + Hamburger */}
                <div className="flex md:hidden items-center gap-2">
                  <button
                    className="text-gray-900 p-1"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle Menu"
                  >
                    {mobileMenuOpen ? <ICONS.close fontSize="medium" /> : <ICONS.menu fontSize="medium" />}
                  </button>
                </div>

                {/* Desktop: Hamburger (md to lg screens) */}
                <button
                  className="hidden md:block lg:hidden text-gray-900 ml-2"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle Menu"
                >
                  {mobileMenuOpen ? <ICONS.close fontSize="small" /> : <ICONS.menu fontSize="small" />}
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="secondary" size="small" fullWidth={false}>
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="small" fullWidth={false}>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu - ONLY show when authenticated */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            {/* User Profile Section */}
            <div className="pb-4 mb-4 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full border-2 border-blue-600/20"></div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {session.user?.name || 'Student'}
                  </p>
                  <p className="text-xs text-teal-500 font-bold uppercase tracking-wider">
                    Free Plan
                  </p>
                </div>
              </div>
            </div>
            <nav className="flex flex-col gap-1 mb-4">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.Icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg font-semibold transition-colors flex items-center gap-3 ${
                      isActive 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon fontSize="small" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col gap-1 pt-4 border-t border-gray-200">
              <Link
                href="/profile"
                className="px-3 py-2 rounded-lg font-semibold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ICONS.profile fontSize="small" />
                <span>Profile</span>
              </Link>
              <Link
                href="/notifications"
                className="px-3 py-2 rounded-lg font-semibold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ICONS.notifications fontSize="small" />
                <span>Notifications</span>
              </Link>
              <Link
                href="/settings"
                className="px-3 py-2 rounded-lg font-semibold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ICONS.settings fontSize="small" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 text-left"
              >
                <ICONS.logout fontSize="small" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}