import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { MouseGrid } from '@/components/animations/MouseGrid'
import { DataStream } from '@/components/animations/DataStream'
import Link from 'next/link'

export const metadata = {
  title: 'Demos',
  description: 'Small example projects showing internal-tool and automation capabilities.',
}

export default function DemosPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <MouseGrid />
          <DataStream />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'demos' }]} />
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">Demos</h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            Small, self-contained example projects showing what I can build on the internal-tools &amp; automation side.
          </p>
        </div>
      </section>

      <section className="bg-slate-950 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              <span className="font-mono text-xs text-slate-500 ml-2">~/demos</span>
            </div>
            <div className="p-6 font-mono text-sm text-slate-400 leading-relaxed">
              <div className="text-emerald-400">$ ls -la ~/demos</div>
              <div className="mt-2">total 0</div>
              <div>drwxr-xr-x  josh  staff     .</div>
              <div>drwxr-xr-x  josh  staff     ..</div>
              <div className="mt-5 text-slate-500">
                // Working on a few of these. Will live here when they ship.
              </div>
              <div className="text-slate-500 mt-2">
                // In the meantime,&nbsp;
                <Link href="/contact" className="text-emerald-400 hover:text-emerald-300 underline">
                  tell me about your project
                </Link>
                &nbsp;and I&apos;ll walk you through what I&apos;ve built before.
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
