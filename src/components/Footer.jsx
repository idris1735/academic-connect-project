import React from 'react'
import Link from 'next/link'
import { Linkedin, Mail, Phone, MapPin, Globe } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='bg-primary text-primary-foreground'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold'>Academic Connect</h2>
            <p className='text-primary-foreground/80'>
              A project by Oasis Premium Limited
            </p>
            <div className='flex space-x-4'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-accent'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
                </svg>
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-accent'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' />
                </svg>
              </a>
              <a
                href='https://linkedin.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-accent'
              >
                <Linkedin size={24} />
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-accent'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <rect x='2' y='2' width='20' height='20' rx='5' ry='5' />
                  <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
                  <line x1='17.5' y1='6.5' x2='17.51' y2='6.5' />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/' className='hover:text-accent'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/signup' className='hover:text-accent'>
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href='/login' className='hover:text-accent'>
                  Log In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-4'>Contact Information</h3>
            <ul className='space-y-2'>
              <li className='flex items-center'>
                <MapPin size={18} className='mr-2' />
                <span>123 Academic Ave, Research City, 12345</span>
              </li>
              <li className='flex items-center'>
                <Phone size={18} className='mr-2' />
                <a href='tel:+1234567890' className='hover:text-accent'>
                  +1 (234) 567-890
                </a>
              </li>
              <li className='flex items-center'>
                <Mail size={18} className='mr-2' />
                <a
                  href='mailto:info@academicconnect.com'
                  className='hover:text-accent'
                >
                  info@academicconnect.com
                </a>
              </li>
              <li className='flex items-center'>
                <Globe size={18} className='mr-2' />
                <a
                  href='https://www.academicconnect.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-accent'
                >
                  www.academicconnect.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-12 pt-8 border-t border-primary-foreground/20'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p className='text-sm text-primary-foreground/60'>
              © {new Date().getFullYear()} Academic Connect, a project of Oasis
              Premium Limited. All rights reserved.
            </p>
            <div className='mt-4 md:mt-0'>
              <ul className='flex space-x-4 text-sm text-primary-foreground/60'>
                <li>
                  <Link href='/privacy-policy' className='hover:text-accent'>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href='/terms-of-service' className='hover:text-accent'>
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
