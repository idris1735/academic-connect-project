'use client'

import { LegalPageWrapper } from '@/components/legal/LegalPageWrapper'

export default function PrivacyPage() {
  return (
    <LegalPageWrapper title='Privacy Policy' lastUpdated='November 11, 2024'>
      <section className='prose max-w-none'>
        <div className='bg-blue-50 border-l-4 border-blue-500 p-4 mb-8'>
          <p className='text-blue-700'>
            This Privacy Policy provides information about the collection, use,
            and sharing of personal data by Academic Connect. We are committed
            to protecting your privacy and handling your data responsibly.
          </p>
        </div>

        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            1. Definitions
          </h2>
          <div className='grid gap-4 pl-4'>
            <div className='flex gap-3'>
              <span className='font-semibold text-gray-700'>1.1</span>
              <p>
                <span className='font-semibold'>"Academic Connect"</span> - The
                platform operated by Academic Connect Inc.
              </p>
            </div>
            <div className='flex gap-3'>
              <span className='font-semibold text-gray-700'>1.2</span>
              <p>
                <span className='font-semibold'>"Member"</span> - A registered
                user with an Academic Connect account.
              </p>
            </div>
            <div className='flex gap-3'>
              <span className='font-semibold text-gray-700'>1.3</span>
              <p>
                <span className='font-semibold'>"User"</span> - Anyone who
                accesses Academic Connect, whether registered or not.
              </p>
            </div>
            <div className='flex gap-3'>
              <span className='font-semibold text-gray-700'>1.4</span>
              <p>
                <span className='font-semibold'>"Visitor"</span> - A
                non-registered individual who accesses public sections of the
                platform.
              </p>
            </div>
            <div className='flex gap-3'>
              <span className='font-semibold text-gray-700'>1.5</span>
              <p>
                <span className='font-semibold'>"Service"</span> - The services
                available on the Academic Connect platform.
              </p>
            </div>
          </div>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            2. Data We Collect
          </h2>
          <p className='mb-4'>
            We collect various types of personal data to provide and improve the
            Service:
          </p>
          <div className='space-y-4 pl-4'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                2.1 Basic Information
              </h3>
              <p>
                IP addresses, device type, operating system, and browser type,
                collected for basic system functionality.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                2.2 Account Data
              </h3>
              <p>
                Information provided during registration, including name, email
                address, and password.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                2.3 Activity Data
              </h3>
              <p>
                Interactions with other Members, published research, and
                activities on the platform.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                2.4 Communications Data
              </h3>
              <p>
                Messages sent to or received from Academic Connect, including
                responses and notifications.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                2.5 Third-Party Integrations
              </h3>
              <p>
                Information received from integrated third-party services if you
                connect your account with Academic Connect.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            3. How We Use Your Information
          </h2>
          <p>We use the collected information to:</p>
          <ul className='list-disc pl-5 space-y-2'>
            <li>Provide and improve our services</li>
            <li>Personalize your experience</li>
            <li>Facilitate connections with other researchers</li>
            <li>Send important updates and notifications</li>
            <li>Ensure platform security</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            3. How We Use Your Data
          </h2>
          <div className='space-y-4 pl-4'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                3.1 Account Management
              </h3>
              <p>
                We use personal data to create and manage your account and
                facilitate user interactions.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                3.2 Personalization
              </h3>
              <p>
                Data is used to tailor your experience on the platform and
                recommend content or connections based on your interests.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                3.3 Communication
              </h3>
              <p>
                We may use your contact information to send you platform
                updates, account notifications, and responses to your inquiries.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                3.4 Advertising
              </h3>
              <p>
                Sponsored content may be shown based on non-personally
                identifiable information to help maintain a free service.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                3.5 Analytics
              </h3>
              <p>
                We analyze usage data to improve the platform, troubleshoot
                issues, and optimize content and functionality.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            4. Information Sharing
          </h2>
          <p>We may share your information with:</p>
          <ul className='list-disc pl-5 space-y-2'>
            <li>Other users (based on your privacy settings)</li>
            <li>Service providers and partners</li>
            <li>Legal authorities when required</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            4. Data Sharing and Disclosure
          </h2>
          <div className='space-y-4 pl-4'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                4.1 With Service Providers
              </h3>
              <p>
                To improve functionality and ensure seamless service delivery.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                4.2 Compliance and Legal Obligations
              </h3>
              <p>
                To comply with applicable laws or respond to legal requests.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                4.3 Advertising Partners
              </h3>
              <p>
                For targeted and general advertising purposes, including
                sponsored content based on usage patterns.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                4.4 Aggregated Data
              </h3>
              <p>
                De-identified and aggregated data may be shared with partners
                for research or marketing purposes.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            5. Data Security
          </h2>
          <p>We implement security measures including:</p>
          <ul className='list-disc pl-5 space-y-2'>
            <li>Encryption of sensitive data</li>
            <li>Regular security audits</li>
            <li>Access controls and monitoring</li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            6. Your Rights
          </h2>
          <p>You have the right to:</p>
          <ul className='list-disc pl-5 space-y-2'>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request data deletion</li>
            <li>Object to data processing</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            7. Data Retention
          </h2>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <p className='mb-4'>
              Your data is stored as long as necessary for account maintenance
              and compliance with legal obligations. Upon account deletion, we
              retain data for a limited period to fulfill obligations or defend
              against claims.
            </p>
            <p>
              Inactive accounts may be deactivated after one year of inactivity.
            </p>
          </div>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            8. Your Data Rights
          </h2>
          <div className='space-y-4 pl-4'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                8.1 Right to Access
              </h3>
              <p>
                You have the right to request access to your personal data
                stored by Academic Connect.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                8.2 Right to Rectify
              </h3>
              <p>You may update inaccurate or incomplete data.</p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                8.3 Right to Delete
              </h3>
              <p>
                You can request the deletion of your data, subject to legal or
                contractual retention requirements.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                8.4 Right to Restrict Processing
              </h3>
              <p>
                Under certain conditions, you may request restricted processing
                of your data.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                8.5 Right to Portability
              </h3>
              <p>
                You may request a machine-readable copy of your data or transfer
                it to another provider.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            9. Cookies and Tracking
          </h2>
          <p>We use cookies and similar technologies to:</p>
          <ul className='list-disc pl-5 space-y-2'>
            <li>Remember your preferences</li>
            <li>Analyze platform usage</li>
            <li>Improve user experience</li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            10. Updates to Privacy Policy
          </h2>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <p>
              This Privacy Policy may be revised periodically. Users will be
              notified of significant updates, and continued use of the platform
              constitutes acceptance of the updated policy.
            </p>
          </div>
        </section>

        <section>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            11. Contact Information
          </h2>
          <div className='bg-gray-50 p-6 rounded-lg'>
            <p className='mb-4'>
              For any questions or concerns regarding this Privacy Policy,
              please contact our Privacy Officer at:
            </p>
            <a
              href='mailto:privacy@academicconnect.com'
              className='text-blue-600 hover:text-blue-800 font-medium'
            >
              privacy@academicconnect.com
            </a>
          </div>
        </section>
      </section>
    </LegalPageWrapper>
  )
}
