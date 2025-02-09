'use client'

import { LegalPageWrapper } from '@/components/legal/LegalPageWrapper'

export default function TermsPage() {
  return (
    <LegalPageWrapper title='Terms of Service' lastUpdated='November 11, 2024'>
      <section className='prose max-w-none'>
        <div className='bg-blue-50 border-l-4 border-blue-500 p-4 mb-8'>
          <p className='text-blue-700'>
            Welcome to Academic Connect, a platform designed for the global
            academic community to foster collaboration, networking, and
            knowledge sharing. These Terms of Service ("Terms") govern your use
            of Academic Connect. By accessing or using Academic Connect, you
            agree to these Terms. If you do not agree, please refrain from using
            the platform.
          </p>
        </div>

        {/* Definitions Section */}
        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            1. Definitions
          </h2>
          <div className='grid gap-4 pl-4'>
            {[
              {
                id: '1.1',
                term: 'Member',
                def: 'A registered user who successfully creates an account on Academic Connect.',
              },
              {
                id: '1.2',
                term: 'Content',
                def: 'Any text, images, data, or other material posted by users on the platform.',
              },
              {
                id: '1.3',
                term: 'Service',
                def: 'The Academic Connect platform, including its web application, associated services, and tools.',
              },
              {
                id: '1.4',
                term: 'User',
                def: 'Any person who accesses or uses the platform, whether registered or unregistered.',
              },
              {
                id: '1.5',
                term: 'Visitor',
                def: 'An unregistered individual who accesses publicly available sections of Academic Connect.',
              },
            ].map((item) => (
              <div key={item.id} className='bg-gray-50 p-4 rounded-lg'>
                <div className='flex gap-3'>
                  <span className='font-semibold text-gray-700'>{item.id}</span>
                  <div>
                    <span className='font-semibold'>"{item.term}"</span> -{' '}
                    {item.def}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* User Eligibility Section */}
        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            2. User Eligibility
          </h2>
          <div className='bg-gray-50 p-6 rounded-lg'>
            <p className='mb-4'>
              The Academic Connect platform is exclusively available to academic
              professionals and researchers who are at least 18 years of age. By
              using this platform, you confirm that you meet these eligibility
              requirements.
            </p>
            <p>
              Academic Connect reserves the right to verify user eligibility and
              suspend or terminate accounts that do not comply with these
              requirements.
            </p>
          </div>
        </section>

        {/* Account Registration Section */}
        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            3. Account Registration and Security
          </h2>
          <div className='space-y-4'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                3.1 Account Creation
              </h3>
              <p>
                Users are required to provide accurate and current information
                when registering for an account on Academic Connect. Academic
                Connect reserves the right to suspend or terminate any account
                with inaccurate or incomplete information.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                3.2 Account Security
              </h3>
              <p>
                You are responsible for maintaining the confidentiality of your
                account login credentials. Any actions taken through your
                account are your responsibility. Please notify us immediately if
                you suspect unauthorized access or misuse of your account.
              </p>
            </div>
          </div>
        </section>

        {/* Platform Use Section */}
        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            4. Use of Platform and User Conduct
          </h2>
          <div className='space-y-4'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                4.1 Acceptable Use
              </h3>
              <p>
                Academic Connect provides a space for academic professionals to
                connect, collaborate, and share knowledge. You agree to use the
                platform in compliance with its intended purpose and applicable
                laws.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                4.2 Prohibited Activities
              </h3>
              <p className='mb-2'>Users are prohibited from:</p>
              <ul className='list-disc pl-5 space-y-2'>
                <li>Posting defamatory, harmful, or misleading content</li>
                <li>
                  Engaging in harassment, spamming, or abusive conduct towards
                  other users
                </li>
                <li>
                  Uploading viruses, malicious code, or any harmful content
                </li>
                <li>
                  Using automated scripts, bots, or other unauthorized
                  mechanisms to access the platform
                </li>
              </ul>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                4.3 Compliance
              </h3>
              <p>
                Academic Connect reserves the right to monitor and take action
                on accounts found in violation of these Terms, including
                suspension or termination of services.
              </p>
            </div>
          </div>
        </section>

        {/* Content Ownership Section */}
        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            5. Content Ownership and Licensing
          </h2>
          <div className='space-y-4'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                5.1 User Content Ownership
              </h3>
              <p>
                Users retain ownership of content they upload or post to
                Academic Connect. However, by submitting content, you grant
                Academic Connect a worldwide, non-exclusive, royalty-free
                license to use, display, reproduce, and distribute the content
                as necessary to provide and enhance the platform.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                5.2 Platform Content
              </h3>
              <p>
                All content, features, and software on the platform, other than
                user-generated content, is the intellectual property of Academic
                Connect or its licensors. Unauthorized use, duplication, or
                distribution of this content is strictly prohibited.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            6. Privacy Policy and Data Usage
          </h2>
          <div className='space-y-4'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                6.1 Data Collection and Use
              </h3>
              <p>
                Academic Connect collects and processes personal data as
                outlined in its Privacy Policy. By using the platform, you
                consent to our data collection and handling practices, which
                comply with applicable data protection regulations.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                6.2 User Rights
              </h3>
              <p>
                Users have rights to access, update, or delete their personal
                data as specified in the Privacy Policy.
              </p>
            </div>
          </div>
        </section>

        {/* Termination Section */}
        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            7. Termination of Services
          </h2>
          <div className='space-y-4'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                7.1 Voluntary Termination
              </h3>
              <p>
                Users may terminate their accounts at any time by contacting
                support. Upon termination, certain content may remain accessible
                if shared with other users as part of the collaborative nature
                of the platform.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                7.2 Termination by Academic Connect
              </h3>
              <p>
                Academic Connect reserves the right to suspend or terminate user
                access for any violations of these Terms, harm to other users,
                or actions detrimental to platform integrity.
              </p>
            </div>
          </div>
        </section>

        {/* Liability Section */}
        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            8. Liability and Disclaimer
          </h2>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <p>
              The platform and services are provided on an "as is" basis without
              warranties of any kind, either express or implied. Academic
              Connect disclaims all warranties, including warranties of
              merchantability, fitness for a particular purpose, and
              non-infringement. Academic Connect is not liable for any damages
              arising from your use of the platform.
            </p>
          </div>
        </section>

        {/* Dispute Resolution Section */}
        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            9. Dispute Resolution and Arbitration
          </h2>
          <div className='space-y-4'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                9.1 Informal Resolution
              </h3>
              <p>
                If you have a dispute with Academic Connect, you agree to first
                contact us to seek informal resolution.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                9.2 Binding Arbitration
              </h3>
              <p>
                For unresolved disputes, both parties agree to resolve any
                claims through binding arbitration, conducted in accordance with
                the applicable arbitration rules and regulations.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                9.3 Waiver of Class Actions
              </h3>
              <p>
                By agreeing to arbitration, users waive the right to participate
                in a class action or representative claims.
              </p>
            </div>
          </div>
        </section>

        {/* Modifications Section */}
        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            10. Modifications to Terms
          </h2>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <p>
              Academic Connect may periodically update these Terms. Users will
              be notified of significant changes, and continued use of the
              platform following any updates constitutes acceptance of the
              revised Terms.
            </p>
          </div>
        </section>

        {/* Governing Law Section */}
        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            11. Governing Law and Jurisdiction
          </h2>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <p>
              These Terms are governed by the laws of [Jurisdiction]. Any legal
              disputes arising from these Terms will be subject to the exclusive
              jurisdiction of the courts in [Location].
            </p>
          </div>
        </section>

        {/* Intellectual Property Section */}
        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            12. Intellectual Property Policy
          </h2>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <p>
              Academic Connect respects intellectual property rights and expects
              users to do the same. Any unauthorized use of intellectual
              property, including posting copyrighted content without
              permission, will be subject to immediate removal and possible
              account suspension.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className='mt-12 border-t pt-8'>
          <div className='bg-gray-50 p-6 rounded-lg'>
            <p className='text-sm text-gray-500'>
              For any questions about these Terms of Service, please contact us
              at:{' '}
              <a
                href='mailto:legal@academicconnect.com'
                className='text-blue-600 hover:text-blue-800'
              >
                legal@academicconnect.com
              </a>
            </p>
          </div>
        </section>
      </section>
    </LegalPageWrapper>
  )
}
