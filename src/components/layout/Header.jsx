'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Container from '@/components/layout/Container';
import {NAV_LINKS, BRAND} from '@/lib/constants';
import Image from 'next/image';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    return (
        <header className='sticky top-0 z-[100] w-full border-b bg-gray-200 bg-white/80 backdrop-blur-md'>
            <Container size='large'>
                <div className='grid grid-cols-3 items-center py-4'>
                    {/* Logo */}
                    <Link href='/' className='flex items-center gap-3 justify-self-start'>
                        <div className='w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center text-white'>
                            <span>
                                <Image
                                    src='/images/logo-icon.png'
                                    alt='Logo'
                                    width={24}
                                    height={24}
                                />
                            </span>
                        </div>
                        <span className='text-xl font-bold text-gray-900'>{BRAND.name}</span>
                    </Link>
                    {/* Desktop Navigation Links */}
                    <nav className='hidden md:flex items-center justify-center gap-6 lg:gap-8'>
                        {NAV_LINKS.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                            <Link 
                                key={link.href} 
                                href={link.href} 
                                className={`text-gray-600 text-sm font-semibold hover:text-blue-600 transition-colors flex items-center gap-1.5 whitespace-nowrap ${isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                            >
                                {Icon && <Icon fontSize="small" />}
                                {link.label}
                            </Link>
                            );
                        })}
                    </nav>
                    {/* Auth Buttons */}
                    <div className='flex items-center justify-self-end gap-3'>
                        <Link href='/login'>   
                            <Button variant='primary' size='medium'>
                                Login
                            </Button>
                        </Link>
                        <Link href='/signup'>
                            <Button variant='secondary' size='medium'>
                                Sign Up
                            </Button>
                        </Link>
                    </div>
                    {/* Mobile Menu Button */}
                    <button
                        className='md:hidden text-gray-700 ml-2'
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label='Toggle Menu'
                    >
                        {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                    {mobileMenuOpen && (
                        <div className='md:hidden py-4 border-t border-gray-200'>
                            <nav className='flex flex-col gap-4'>
                                {NAV_LINKS.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = pathname === link.href;
                                    return (
                                    <Link 
                                        key={link.href} 
                                        href={link.href}
                                        className={`text-gray-600 font-semibold hover:text-blue-600 transition-colors ${isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {Icon && <Icon fontSize="small" />}
                                        <span>{link.label}</span>
                                    </Link>
                                    );
                                })} 
                            </nav>
                        </div>
                    )}
                </div>
            </Container>
        </header>
    );
}
    