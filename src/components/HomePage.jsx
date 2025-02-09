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
  Loader2,
  ExternalLink,
  Flask,
  ChartLineUp,
  Network,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { LoadingScreen } from '@/components/ui/loading-spinner'

const HomePage = () => {
  const [showLearnMore, setShowLearnMore] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isJoinLoading, setIsJoinLoading] = useState(false)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const encodedQuery = encodeURIComponent(searchQuery)
        const response = await fetch(
          `https://api.crossref.org/works?query=${encodedQuery}&rows=5`
        )
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        setSearchResults(data.message.items || [])
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
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
    setTimeout(() => {
      setIsJoinLoading(false)
    }, 2000)
  }

  const handleLoginClick = () => {
    setIsLoginLoading(true)
    setTimeout(() => {
      setIsLoginLoading(false)
    }, 2000)
  }

  const features = [
    {
      icon: <Beaker className='w-8 h-8' />,
      title: 'Access Research',
      description: 'Over 100 million publications at your fingertips',
      image: '/feature1.jpg',
      color: 'from-blue-500/10 to-blue-500/5',
      hoverColor: 'group-hover:from-blue-600 group-hover:to-indigo-600',
    },
    {
      icon: <Microscope className='w-8 h-8' />,
      title: 'Track Impact',
      description: 'Monitor citations and research influence',
      image: '/feature2.jpg',
      color: 'from-purple-500/10 to-purple-500/5',
      hoverColor: 'group-hover:from-purple-600 group-hover:to-pink-600',
    },
    {
      icon: <Satellite className='w-8 h-8' />,
      title: 'Connect',
      description: 'Collaborate with Researchers worldwide',
      image: '/feature3.jpg',
      color: 'from-indigo-500/10 to-indigo-500/5',
      hoverColor: 'group-hover:from-indigo-600 group-hover:to-blue-600',
    },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 to-white text-gray-800'>
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

      <section className='relative min-h-screen flex items-center justify-center pt-16'>
        <Image
          src='/homebanner.jpg'
          alt='Research background'
          fill
          sizes='100vw'
          priority
          className='object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 z-10' />

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

        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20'>
          <div className='w-6 h-10 border-2 border-white/60 rounded-full p-1'>
            <div className='w-1.5 h-1.5 bg-white rounded-full animate-bounce mx-auto' />
          </div>
        </div>
      </section>

      <section className='py-24 bg-gradient-to-b from-white to-indigo-50/50'>
        <div className='max-w-6xl mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-center mb-16'
          >
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
              Why Choose AcademicConnect?
            </h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Experience a new era of academic collaboration with our innovative
              features
            </p>
          </motion.div>

          <div className='grid md:grid-cols-3 gap-8 relative'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className='relative group'
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} ${feature.hoverColor} rounded-2xl transform group-hover:scale-[1.02] transition-all duration-500 opacity-50 group-hover:opacity-100`}
                />
                <div className='relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200/50 group-hover:border-transparent'>
                  <div className='flex flex-col items-center text-center'>
                    <div className='mb-4 p-4 bg-gradient-to-br from-indigo-100 to-white rounded-xl text-indigo-600 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:shadow-lg'>
                      {feature.icon}
                    </div>
                    <h3 className='text-xl font-bold text-gray-900 mb-2 transform group-hover:translate-y-1 transition-transform duration-500'>
                      {feature.title}
                    </h3>
                    <p className='text-gray-600 mb-6 transform group-hover:translate-y-1 transition-transform duration-500'>
                      {feature.description}
                    </p>
                    <div className='relative w-full h-48 rounded-lg overflow-hidden'>
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        sizes='(max-width: 768px) 100vw, 33vw'
                        className='object-cover transform group-hover:scale-110 transition-all duration-700'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className='absolute -z-10 top-1/2 left-0 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob' />
          <div className='absolute -z-10 top-1/2 right-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000' />
          <div className='absolute -z-10 bottom-0 left-1/2 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000' />
        </div>
      </section>

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

      <section className='py-16 sm:py-24 relative overflow-hidden'>
        <Image
          src='/researchers.jpg'
          alt='Researchers collaborating'
          fill
          sizes='100vw'
          priority
          className='object-cover object-top'
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
                <LoadingSpinner
                  size='default'
                  className='mx-auto text-primary'
                />
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
