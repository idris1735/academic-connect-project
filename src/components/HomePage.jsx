'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Beaker,
  Dna,
  Satellite,
  Microscope,
  Search,
  X,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ExternalLink } from 'lucide-react'

const HomePage = () => {
  const [showLearnMore, setShowLearnMore] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isJoinLoading, setIsJoinLoading] = useState(false)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Handle search with debounce
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await fetch(
          `https://api.crossref.org/works?query=${searchQuery}&rows=5`
        )
        const data = await response.json()
        setSearchResults(data.message.items || [])
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const LearnMoreModal = () => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-8 rounded-lg max-w-2xl w-full mx-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold text-indigo-800'>
            Learn More About AcademicConnect
          </h2>
          <Button variant='ghost' onClick={() => setShowLearnMore(false)}>
            <X className='h-6 w-6' />
          </Button>
        </div>
        <p className='text-gray-600 mb-4'>
          AcademicConnect is a cutting-edge platform designed to revolutionize
          the way researchers collaborate and share knowledge. Our mission is to
          accelerate research access by providing powerful tools and a global
          network for academics.
        </p>
        <h3 className='text-xl font-semibold text-indigo-700 mb-2'>
          Key Features:
        </h3>
        <ul className='list-disc list-inside text-gray-600 mb-4'>
          <li>Access to over 100 million research publications</li>
          <li>Advanced collaboration tools for global teamwork</li>
          <li>Real-time impact tracking and analytics</li>
          <li>Networking opportunities with leading researchers</li>
          <li>Integrated funding and grant information</li>
        </ul>
        <p className='text-gray-600 mb-4'>
          Join AcademicConnect today and be part of the future of research and
          innovation.
        </p>
        <Button
          className='bg-indigo-600 hover:bg-indigo-700 text-white'
          onClick={() => setShowLearnMore(false)}
        >
          Close
        </Button>
      </div>
    </div>
  )

  const handleJoinClick = () => {
    setIsJoinLoading(true)
    // Simulate an async operation
    setTimeout(() => {
      setIsJoinLoading(false)
      // Add your join logic here
    }, 2000)
  }

  const handleLoginClick = () => {
    setIsLoginLoading(true)
    // Simulate an async operation
    setTimeout(() => {
      setIsLoginLoading(false)
      // Add your login logic here
    }, 2000)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 to-white text-gray-800'>
      {/* Enhanced Header with Blur Effect and Hamburger Menu */}
      <header className='fixed top-0 left-0 w-full p-4 bg-white/80 backdrop-blur-xl border-b border-gray-200/20 shadow-sm z-50'>
        <div className='flex justify-between items-center max-w-6xl mx-auto px-4'>
          <h1 className='text-xl sm:text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800'>
            AcademicConnect
          </h1>
          <div className='hidden sm:flex space-x-4'>
            <Link href='/login'>
              <Button
                variant='outline'
                className='text-indigo-600 border-indigo-600 hover:bg-indigo-100 hover:text-indigo-700'
                onClick={handleLoginClick}
                disabled={isLoginLoading}
              >
                {isLoginLoading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  'Log in'
                )}
              </Button>
            </Link>
            <Link href='/signup'>
              <Button
                className='bg-indigo-600 hover:bg-indigo-700 text-white'
                onClick={handleJoinClick}
                disabled={isJoinLoading}
              >
                {isJoinLoading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  'Join for free'
                )}
              </Button>
            </Link>
          </div>
          <div className='sm:hidden'>
            <Button variant='ghost' onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className='h-6 w-6' />
            </Button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='sm:hidden absolute top-full left-0 right-0 bg-white shadow-md'>
            <div className='flex flex-col p-4 space-y-2'>
              <Link href='/login'>
                <Button
                  variant='outline'
                  className='w-full text-indigo-600 border-indigo-600 hover:bg-indigo-100 hover:text-indigo-700'
                >
                  Log in
                </Button>
              </Link>
              <Link href='/signup'>
                <Button className='w-full bg-indigo-600 hover:bg-indigo-700 text-white'>
                  Join for free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section with Background Image */}
      <section className='relative min-h-screen flex items-center justify-center pt-16'>
        <Image
          src='/homebanner.jpg'
          alt='Research background'
          layout='fill'
          objectFit='cover'
          quality={100}
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 z-10' />

        {/* Dark Transparent Card Overlay */}
        <div className='relative z-20 bg-black bg-opacity-50 p-8 rounded-lg max-w-2xl mx-4'>
          <div className='text-center'>
            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight'>
              Welcome to
              <span className='block bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white'>
                AcademicConnect
              </span>
            </h1>
            <p className='text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8'>
              Your gateway to the world of science and research.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                size='lg'
                className='bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transform hover:scale-105 transition-all text-sm sm:text-base'
              >
                Get Started
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='text-white border-white hover:bg-white/20 hover:text-white text-sm sm:text-base'
                onClick={() => setShowLearnMore(true)}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20'>
          <div className='w-6 h-10 border-2 border-white/60 rounded-full p-1'>
            <div className='w-1.5 h-1.5 bg-white rounded-full animate-bounce mx-auto' />
          </div>
        </div>
      </section>

      {/* Rest of the sections with enhanced styling */}
      <section className='py-16 sm:py-24 bg-white'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-indigo-800'>
            Discover Research knowledge and stay connected
          </h2>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[
              {
                icon: <Beaker className='w-8 h-8' />,
                title: 'Access Research',
                description: 'Over 100 million publications at your fingertips',
              },
              {
                icon: <Microscope className='w-8 h-8' />,
                title: 'Track Impact',
                description: 'Monitor citations and research influence',
              },
              {
                icon: <Satellite className='w-8 h-8' />,
                title: 'Connect',
                description: 'Collaborate with Researchers worldwide',
              },
            ].map((item, index) => (
              <Card
                key={index}
                className='p-6 hover:shadow-lg transition-shadow'
              >
                <CardContent className='text-center'>
                  <div className='w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600'>
                    {item.icon}
                  </div>
                  <h3 className='text-xl font-bold mb-2 text-indigo-700'>
                    {item.title}
                  </h3>
                  <p className='text-gray-600'>{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Topic Section with animation */}
      <section className='py-16 sm:py-24 bg-gradient-to-br from-indigo-50 to-white'>
        <div className='max-w-6xl mx-auto px-4 text-center'>
          <h3 className='text-2xl sm:text-3xl font-bold mb-12 text-indigo-800'>
            Popular Topics
          </h3>
          <div className='flex flex-wrap justify-center gap-3'>
            {[
              'Business & Management',
              'Computer Science and Technology',
              'Education',
              'Life Sciences',
              'Government and Law',
              'Library and Information Science',
              'Media and Communications',
              'Medicine and Healthcare',
              'Physical Sciences & Engineering',
              'Security and forensics',
              'Social Science and Humanities',
              'Chemistry',
            ].map((topic, index) => (
              <button
                key={topic}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
                className='px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-full hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all duration-300 transform hover:scale-105 hover:shadow-md animate-fadeInUp'
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action with Background Image */}
      {/* <section className='py-16 sm:py-24 relative overflow-hidden'>
        <Image
          src='/researchbanner.jpg'
          alt='Researchers collaborating'
          layout='fill'
          objectFit='cover'
          objectPosition='top center'
          quality={100}
        />
        <div className='absolute inset-0 bg-indigo-600/70 z-10' />
        <div className='max-w-4xl mx-auto text-center px-4 relative z-20'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-8 leading-tight'>
            Join 25 million researchers across the globe!
          </h2>
          <Button
            size='lg'
            className='bg-white text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transform hover:scale-105 transition-all text-sm sm:text-base'
          >
            Get Started Now
          </Button>
        </div>
      </section> */}

      <section className='py-16 sm:py-24 relative overflow-hidden'>
        <Image
          src='/researchbanner.jpg'
          alt='Researchers collaborating'
          layout='fill'
          objectFit='cover'
          objectPosition='top center'
          quality={100}
          priority
        />
        <div className='absolute inset-0 bg-indigo-600/70 z-10' />
        <div className='max-w-4xl mx-auto text-center px-4 relative z-20 space-y-8'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-8 leading-tight'
          >
            Join 25 million researchers across the globe!
          </motion.h2>

          <div className='max-w-2xl mx-auto space-y-4'>
            <div className='relative'>
              <Input
                type='search'
                placeholder='Search for publications, researchers, or topics...'
                className='w-full pl-10 pr-4 py-3 bg-white/95 backdrop-blur-sm border-0 focus-visible:ring-2 focus-visible:ring-white'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className='absolute left-3 top-1/2 -translate-y-1/2'>
                {isSearching ? (
                  <Loader2 className='h-4 w-4 animate-spin text-gray-500' />
                ) : (
                  <Search className='h-4 w-4 text-gray-500' />
                )}
              </div>
            </div>

            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className='bg-white/95 backdrop-blur-sm shadow-xl'>
                    <CardContent className='p-2'>
                      {searchResults.map((result, index) => (
                        <motion.div
                          key={result.DOI || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className='p-3 hover:bg-gray-100 rounded-lg transition-colors'
                        >
                          <a
                            href={result.URL}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-start gap-2 group'
                          >
                            <div className='flex-1'>
                              <h3 className='font-medium text-sm group-hover:text-indigo-600 transition-colors'>
                                {result.title?.[0] || 'Untitled'}
                              </h3>
                              <p className='text-xs text-gray-500 mt-1'>
                                {result.author?.[0]?.family
                                  ? `${result.author[0].family}, ${result.author[0].given}`
                                  : 'Unknown Author'}
                                {result.published &&
                                  ` • ${new Date(
                                    result.published['date-parts'][0]
                                  ).getFullYear()}`}
                              </p>
                            </div>
                            <ExternalLink className='h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors' />
                          </a>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {searchQuery && isSearching && (
              <Card className='p-4 text-center bg-white/95 backdrop-blur-sm'>
                <Loader2 className='h-6 w-6 animate-spin mx-auto text-indigo-600' />
                <p className='text-sm text-gray-500 mt-2'>
                  Searching publications...
                </p>
              </Card>
            )}
          </div>

          <Button
            size='lg'
            className='bg-white text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transform hover:scale-105 transition-all text-sm sm:text-base'
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-12'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='grid sm:grid-cols-2 gap-8'>
            <div>
              <h4 className='text-xl font-bold mb-4'>AcademicConnect</h4>
              <p className='text-gray-400 mb-4'>
                Connecting researchers worldwide to advance scientific
                discovery.
              </p>
            </div>
            <div className='grid grid-cols-2 gap-8'>
              <div>
                <h5 className='font-semibold mb-4'>Solutions</h5>
                <ul className='space-y-2 text-gray-400'>
                  <li>
                    <a href='#' className='hover:text-white transition-colors'>
                      For Researchers
                    </a>
                  </li>
                  <li>
                    <a href='#' className='hover:text-white transition-colors'>
                      For Institutions
                    </a>
                  </li>
                  <li>
                    <a href='#' className='hover:text-white transition-colors'>
                      For Industry
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className='font-semibold mb-4'>Company</h5>
                <ul className='space-y-2 text-gray-400'>
                  <li>
                    <a href='#' className='hover:text-white transition-colors'>
                      About
                    </a>
                  </li>
                  <li>
                    <a href='#' className='hover:text-white transition-colors'>
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href='#' className='hover:text-white transition-colors'>
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
            <p>&copy; 2024 AcademicConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {showLearnMore && <LearnMoreModal />}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default HomePage
