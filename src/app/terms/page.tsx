import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { siteConfig, contactInfo, businessInfo } from '@/lib/constants'
import { DataStream } from '@/components/animations/DataStream'
import { MouseGrid } from '@/components/animations/MouseGrid'

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Fritz Automation - Read our terms and conditions for using our website and services.',
}

export default function TermsOfServicePage() {
  const lastUpdated = 'February 25, 2026'

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <MouseGrid />
          <DataStream />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Terms of Service
          </h1>
          <p className="text-slate-400">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 mb-8">
              Welcome to {siteConfig.name}. By accessing or using our website and services, you agree to be bound
              by these Terms of Service. Please read them carefully.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 mb-4">
              By accessing our website at {siteConfig.url} or engaging our services, you acknowledge that you have
              read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do
              not agree to these terms, please do not use our website or services.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">2. Services</h2>
            <p className="text-slate-600 mb-4">
              {siteConfig.name} provides custom automation solutions, software development, system integration,
              and related consulting services. The specific scope, deliverables, timeline, and pricing for any
              project will be outlined in a separate service agreement or statement of work.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">3. Client Responsibilities</h2>
            <p className="text-slate-600 mb-4">
              When engaging our services, you agree to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Provide accurate and complete information as required for the project</li>
              <li>Respond to requests for information, approvals, and feedback in a timely manner</li>
              <li>Ensure you have the necessary rights and permissions to share any data, content, or materials</li>
              <li>Pay all fees and charges as agreed upon in the service agreement</li>
              <li>Use our deliverables only for lawful purposes</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">4. Intellectual Property</h2>

            <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Our Intellectual Property</h3>
            <p className="text-slate-600 mb-4">
              The content, design, graphics, and other materials on our website are owned by {siteConfig.name}
              and are protected by copyright and other intellectual property laws. You may not reproduce, distribute,
              or create derivative works without our express written permission.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Client Deliverables</h3>
            <p className="text-slate-600 mb-4">
              Unless otherwise specified in a service agreement, upon full payment for services, you will own
              the custom code and deliverables created specifically for your project. We retain the right to use
              general knowledge, skills, and experience gained during the project, as well as any pre-existing
              tools, libraries, or frameworks used in the development.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">5. Confidentiality</h2>
            <p className="text-slate-600 mb-4">
              We treat all client information as confidential. We will not disclose your proprietary information,
              business data, or project details to third parties without your consent, except as required by law
              or as necessary to provide our services using trusted subcontractors bound by confidentiality agreements.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">6. Payment Terms</h2>
            <p className="text-slate-600 mb-4">
              Payment terms for services will be specified in the applicable service agreement. Unless otherwise
              agreed, the following general terms apply:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>A deposit may be required before work commences</li>
              <li>Invoices are due upon receipt unless otherwise specified</li>
              <li>Late payments may incur interest charges</li>
              <li>We reserve the right to suspend work for overdue accounts</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">7. Warranties and Disclaimers</h2>

            <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Service Warranty</h3>
            <p className="text-slate-600 mb-4">
              We warrant that our services will be performed in a professional manner consistent with industry
              standards. If you are not satisfied with any deliverable, we will work with you to address your
              concerns as outlined in the applicable service agreement.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Website Disclaimer</h3>
            <p className="text-slate-600 mb-4">
              Our website and its content are provided &quot;as is&quot; without warranties of any kind, either express
              or implied. We do not warrant that the website will be uninterrupted, error-free, or free of
              viruses or other harmful components.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">8. Limitation of Liability</h2>
            <p className="text-slate-600 mb-4">
              To the maximum extent permitted by law, {siteConfig.name} shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
              whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>
            <p className="text-slate-600 mb-4">
              Our total liability for any claims arising from or related to our services shall not exceed the
              amount paid by you for the specific services giving rise to the claim.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">9. Indemnification</h2>
            <p className="text-slate-600 mb-4">
              You agree to indemnify and hold harmless {siteConfig.name} and its officers, directors, employees,
              and agents from any claims, damages, losses, or expenses (including reasonable attorneys&apos; fees)
              arising from your use of our website or services, your violation of these terms, or your violation
              of any rights of a third party.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">10. Termination</h2>
            <p className="text-slate-600 mb-4">
              Either party may terminate a service engagement as specified in the applicable service agreement.
              We reserve the right to suspend or terminate access to our website for any user who violates these
              Terms of Service.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">11. Governing Law</h2>
            <p className="text-slate-600 mb-4">
              These Terms of Service shall be governed by and construed in accordance with the laws of the
              State of {businessInfo.stateOfIncorporation}, without regard to its conflict of law provisions. Any disputes arising from these
              terms or our services shall be resolved through good-faith negotiation, and if necessary, binding
              arbitration.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">12. Changes to Terms</h2>
            <p className="text-slate-600 mb-4">
              We reserve the right to modify these Terms of Service at any time. We will notify users of any
              material changes by posting the updated terms on this page and updating the &quot;Last updated&quot; date.
              Your continued use of our website or services after such changes constitutes acceptance of the
              modified terms.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">13. Severability</h2>
            <p className="text-slate-600 mb-4">
              If any provision of these Terms of Service is found to be unenforceable or invalid, that provision
              shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall
              remain in full force and effect.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">14. Contact Information</h2>
            <p className="text-slate-600 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-slate-50 rounded-xl p-6 mt-4">
              <p className="text-slate-900 font-semibold">{siteConfig.legalName}</p>
              <p className="text-slate-600">{businessInfo.location.city}, {businessInfo.location.state}</p>
              <p className="text-slate-600">
                Email: <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">{contactInfo.email}</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
