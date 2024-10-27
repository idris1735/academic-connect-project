import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Beaker,
  Dna,
  Satellite,
  Microscope,
  Atom,
  Stethoscope,
  Waves,
  Flask,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <header className='flex justify-between items-center p-4 border-b'>
        <h1 className='text-2xl font-bold text-primary'>AcademicConnect</h1>
        <div>
          <Button variant='ghost' className='mr-2'>
            Log in
          </Button>
          <Button variant='default'>Join for free</Button>
        </div>
      </header>

      <main>
        <section className='flex justify-between items-center p-8 bg-muted'>
          <div className='max-w-md'>
            <h2 className='text-4xl font-bold mb-4'>
              Discover scientific knowledge and stay connected to the world of
              science
            </h2>
            <Button size='lg' className='bg-primary text-primary-foreground'>
              Join for free
            </Button>
          </div>
          <Image
            src='/placeholder.svg?height=300&width=400'
            alt='Scientist in lab'
            width={400}
            height={300}
            className='rounded-lg'
          />
        </section>

        <section className='p-8'>
          <div className='flex justify-between items-center mb-8'>
            <div className='flex items-center space-x-4'>
              <div className='bg-muted p-4 rounded-full'>
                <Beaker className='w-8 h-8 text-primary' />
              </div>
              <div>
                <h3 className='text-2xl font-bold'>Discover research</h3>
                <p className='text-muted-foreground'>
                  Access over 100 million publication pages and stay up to date
                  with what&apos;s happening in your field
                </p>
              </div>
            </div>
            <div className='w-1/3'>
              <Input
                type='search'
                placeholder='Search publications'
                className='w-full'
              />
            </div>
          </div>
        </section>

        <section className='p-8 bg-muted'>
          <h3 className='text-2xl font-bold mb-4'>
            Connect with your scientific community
          </h3>
          <p className='mb-4'>
            Share your research, collaborate with your peers, and get the
            support you need to advance your career.
          </p>
          <div className='flex flex-wrap gap-2'>
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
            ].map((topic) => (
              <Button key={topic} variant='outline' size='sm'>
                {topic}
              </Button>
            ))}
          </div>
        </section>

        <section className='p-8'>
          <div className='flex items-center space-x-4 mb-4'>
            <div className='bg-muted p-4 rounded-full'>
              <Microscope className='w-8 h-8 text-primary' />
            </div>
            <h3 className='text-2xl font-bold'>Measure your impact</h3>
          </div>
          <p className='mb-4'>
            Get in-depth stats on who&apos;s been reading your work and keep
            track of your citations.
          </p>
        </section>

        <section className='p-8 text-center bg-muted'>
          <h2 className='text-3xl font-bold mb-4'>
            Advance your research and join a community of 25 million scientists
          </h2>
          <Button size='lg' className='bg-primary text-primary-foreground'>
            Join for free
          </Button>
        </section>
      </main>

      <footer className='p-8 border-t'>
        <h4 className='text-xl font-bold mb-4'>
          AcademicConnect Business Solutions
        </h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Card>
            <CardContent className='flex items-center space-x-4 p-4'>
              <div className='bg-muted p-4 rounded-full'>
                <Dna className='w-8 h-8 text-primary' />
              </div>
              <div>
                <h5 className='font-bold'>Scientific Recruitment</h5>
                <p className='text-sm text-muted-foreground'>
                  Find qualified researchers and build the best teams in science
                </p>
                <Button variant='link' className='p-0'>
                  Find out more
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='flex items-center space-x-4 p-4'>
              <div className='bg-muted p-4 rounded-full'>
                <Satellite className='w-8 h-8 text-primary' />
              </div>
              <div>
                <h5 className='font-bold'>Marketing Solutions</h5>
                <p className='text-sm text-muted-foreground'>
                  Grow your brand&apos;s impact in the scientific community
                </p>

                <Button variant='link' className='p-0'>
                  Find out more
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </footer>
    </div>
  )
}
