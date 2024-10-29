'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Beaker, Dna, Satellite, Microscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

const HomePage = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 to-white text-gray-800'>
      {/* Enhanced Header with Blur Effect */}
      <header className='fixed top-0 left-0 w-full p-4 bg-white/80 backdrop-blur-xl border-b border-gray-200/20 shadow-sm z-50'>
        <div className='flex justify-between items-center max-w-6xl mx-auto px-4'>
          <h1 className='text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800'>
            AcademicConnect
          </h1>
          <div className='space-x-4'>
            <Link href='/login'>
              <Button variant='ghost' className='hover:bg-indigo-50'>
                Log in
              </Button>
            </Link>
            <Link href='/signup'>
              <Button className='bg-indigo-600 hover:bg-indigo-700 text-white'>
                Join for free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Enhanced Video Hero Section */}
      <section className='relative min-h-screen flex items-center justify-center pt-16'>
        <div className='absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 z-10' />
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className='w-full h-full object-cover'
          >
            <source src='/research.mp4' type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Loading state */}
        {!isVideoLoaded && (
          <div className='absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 animate-pulse' />
        )}

        <div className='relative z-20 text-center px-4 max-w-4xl mx-auto'>
          <h1 className='text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight'>
            Welcome to
            <span className='block bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white'>
              AcademicConnect
            </span>
          </h1>
          <p className='text-xl md:text-2xl text-gray-200 mb-8'>
            Your gateway to the world of science and research.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              size='lg'
              className='bg-white text-indigo-600 hover:bg-gray-100 transform hover:scale-105 transition-all'
            >
              Get Started
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='text-white border-white hover:bg-white/10'
            >
              Learn More
            </Button>
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
      <section className='py-24 bg-white'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-4xl font-bold text-center mb-12'>
            Discover scientific knowledge and stay connected
          </h2>
          <div className='grid md:grid-cols-3 gap-8'>
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
                description: 'Collaborate with peers worldwide',
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
                  <h3 className='text-xl font-bold mb-2'>{item.title}</h3>
                  <p className='text-gray-600'>{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Topic Section with animation */}
      <section className='py-24 bg-gradient-to-br from-indigo-50 to-white'>
        <div className='max-w-6xl mx-auto px-4 text-center'>
          <h3 className='text-3xl font-bold mb-12'>Popular Topics</h3>
          <div className='flex flex-wrap justify-center gap-3'>
            {[
              'Engineering',
              'Mathematics',
              'Biology',
              'Computer Science',
              'Climate Change',
              'Medicine',
              'Physics',
              'Social Science',
              'Astrophysics',
              'Chemistry',
            ].map((topic, index) => (
              <button
                key={topic}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.5s ease-out forwards',
                }}
                className='px-6 py-2 text-sm font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-full hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all duration-300 transform hover:scale-105 hover:shadow-md'
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className='py-24 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden'>
        <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]" />
        <div className='max-w-4xl mx-auto text-center px-4 relative z-10'>
          <h2 className='text-4xl md:text-5xl font-extrabold text-white mb-8 leading-tight'>
            Join 25 million scientists advancing research together
          </h2>
          <Button
            size='lg'
            className='bg-white text-indigo-600 hover:bg-gray-100 transform hover:scale-105 transition-all'
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-12'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='grid md:grid-cols-2 gap-8'>
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
                    <a href='#' className='hover:text-white'>
                      For Researchers
                    </a>
                  </li>
                  <li>
                    <a href='#' className='hover:text-white'>
                      For Institutions
                    </a>
                  </li>
                  <li>
                    <a href='#' className='hover:text-white'>
                      For Industry
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className='font-semibold mb-4'>Company</h5>
                <ul className='space-y-2 text-gray-400'>
                  <li>
                    <a href='#' className='hover:text-white'>
                      About
                    </a>
                  </li>
                  <li>
                    <a href='#' className='hover:text-white'>
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href='#' className='hover:text-white'>
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
      `}</style>
    </div>
  )
}

export default HomePage
