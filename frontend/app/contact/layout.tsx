import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Fritz Automation | Get a Free Consultation',
  description: 'Contact Fritz Automation for custom automation solutions, process automation, and software development. We respond within 24 hours.',
  keywords: 'Contact Fritz Automation, Automation Consultation, Custom Software Quote, Process Automation Services',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
