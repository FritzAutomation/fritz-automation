import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { siteConfig, contactInfo, businessInfo } from '@/lib/constants'

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Fritz Automation - Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'February 25, 2026'

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Privacy Policy
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
              At {siteConfig.name}, we take your privacy seriously. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you visit our website or use our services.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Information We Collect</h2>

            <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Personal Information</h3>
            <p className="text-slate-600 mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Fill out our contact form</li>
              <li>Request a consultation or quote</li>
              <li>Subscribe to our communications</li>
              <li>Engage with us through the client portal</li>
            </ul>
            <p className="text-slate-600 mb-4">
              This information may include your name, email address, phone number, company name, and any other
              information you choose to provide.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Automatically Collected Information</h3>
            <p className="text-slate-600 mb-4">
              When you visit our website, we may automatically collect certain information about your device and
              browsing activity, including:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>IP address and general location data</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on those pages</li>
              <li>Referring website addresses</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How We Use Your Information</h2>
            <p className="text-slate-600 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Respond to your inquiries and provide requested services</li>
              <li>Send you project updates and relevant communications</li>
              <li>Improve our website and services</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Protect against fraudulent or unauthorized activity</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Information Sharing</h2>
            <p className="text-slate-600 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your
              information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in
                operating our website and conducting our business, subject to confidentiality agreements</li>
              <li><strong>Legal Requirements:</strong> When required by law or to respond to legal process</li>
              <li><strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property,
                or that of our users or others</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Data Security</h2>
            <p className="text-slate-600 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. However, no method
              of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee
              absolute security.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-slate-600 mb-4">
              Our website may use cookies and similar tracking technologies to enhance your experience. Cookies
              are small files stored on your device that help us remember your preferences and understand how
              you use our website.
            </p>
            <p className="text-slate-600 mb-4">
              You can control cookies through your browser settings. Note that disabling cookies may affect
              some functionality of our website.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Third-Party Links</h2>
            <p className="text-slate-600 mb-4">
              Our website may contain links to third-party websites. We are not responsible for the privacy
              practices or content of these external sites. We encourage you to review the privacy policies
              of any third-party sites you visit.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Your Rights</h2>
            <p className="text-slate-600 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate information</li>
              <li>The right to request deletion of your information</li>
              <li>The right to opt out of certain data processing activities</li>
              <li>The right to data portability</li>
            </ul>
            <p className="text-slate-600 mb-4">
              To exercise any of these rights, please contact us using the information provided below.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Children&apos;s Privacy</h2>
            <p className="text-slate-600 mb-4">
              Our services are not directed to individuals under the age of 18. We do not knowingly collect
              personal information from children. If you believe we have collected information from a child,
              please contact us immediately.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Changes to This Policy</h2>
            <p className="text-slate-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting
              the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to
              review this Privacy Policy periodically.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Contact Us</h2>
            <p className="text-slate-600 mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
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
