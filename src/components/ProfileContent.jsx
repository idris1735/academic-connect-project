import { Briefcase, Book, Award } from 'lucide-react'

export default function ProfileContent() {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">About</h2>
        <p className="text-gray-600">
          Passionate Full Stack Developer with 5+ years of experience in building scalable web applications.
          Specializing in React, Node.js, and cloud technologies. Always eager to learn and explore new
          technologies, particularly in the field of Artificial Intelligence and Machine Learning.
        </p>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Experience</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Briefcase className="h-10 w-10 text-gray-400" />
            <div>
              <h3 className="font-semibold">Senior Full Stack Developer</h3>
              <p className="text-gray-600">TechCorp Inc. · Full-time</p>
              <p className="text-sm text-gray-500">Jan 2020 - Present · 3 yrs 5 mos</p>
              <p className="text-sm text-gray-500">San Francisco Bay Area</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Briefcase className="h-10 w-10 text-gray-400" />
            <div>
              <h3 className="font-semibold">Full Stack Developer</h3>
              <p className="text-gray-600">InnovateTech · Full-time</p>
              <p className="text-sm text-gray-500">Jun 2017 - Dec 2019 · 2 yrs 7 mos</p>
              <p className="text-sm text-gray-500">New York, NY</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Education</h2>
        <div className="flex gap-4">
          <Book className="h-10 w-10 text-gray-400" />
          <div>
            <h3 className="font-semibold">Stanford University</h3>
            <p className="text-gray-600">Master of Science - MS, Computer Science</p>
            <p className="text-sm text-gray-500">2015 - 2017</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'MongoDB', 'TypeScript', 'Machine Learning'].map((skill) => (
            <span key={skill} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}