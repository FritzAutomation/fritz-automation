'use client'

import Image from 'next/image'

/**
 * Photo card framed as `cat ~/josh.png` with mono header + meta rows.
 * Used in About + home Whoami section. Theme-aware.
 */
export function PhotoCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="v3-photo-real">
      <div className="head"><span className="b">$</span> cat ~/josh.png</div>
      <div className="img">
        <Image
          src="/portfolio/josh.png"
          alt="Josh Fritzjunker, Fritz Automation"
          width={400}
          height={500}
          className="object-cover w-full h-full"
        />
        <div className="stamp">burlington · iowa</div>
      </div>
      <div className="meta">
        <div className="row"><span className="k">name</span><span className="v">josh fritzjunker</span></div>
        <div className="row"><span className="k">role</span><span className="v"><span className="h">developer</span> · sole proprietor</span></div>
        {!compact && (
          <>
            <div className="row"><span className="k">located</span><span className="v"><span className="h">burlington, ia</span></span></div>
            <div className="row"><span className="k">since</span><span className="v">2024</span></div>
          </>
        )}
      </div>

      <style jsx>{`
        .v3-photo-real {
          border: 1px solid var(--line);
          border-radius: 10px;
          overflow: hidden;
          background: var(--bg-card);
        }
        .head {
          padding: 9px 14px;
          border-bottom: 1px solid var(--line);
          background: var(--surface-strong);
          font-family: var(--font-mono), monospace;
          font-size: 11.5px;
          color: var(--ink-dim);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .head .b { color: var(--accent); }
        .img {
          aspect-ratio: 4/5;
          background: var(--bg);
          position: relative;
          overflow: hidden;
        }
        .img :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .img::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--surface-strong), transparent 30%);
          pointer-events: none;
        }
        .stamp {
          position: absolute;
          bottom: 10px;
          left: 0;
          right: 0;
          text-align: center;
          font-family: var(--font-mono), monospace;
          font-size: 10.5px;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          z-index: 2;
        }
        .meta {
          padding: 12px 14px;
          font-family: var(--font-mono), monospace;
          font-size: 11.5px;
          color: var(--ink-soft);
          border-top: 1px solid var(--line);
        }
        .row {
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 8px;
          padding: 2px 0;
        }
        .row .k { color: var(--ink-dim); }
        .row .v { color: var(--ink); }
        .row .v .h { color: var(--accent); }
      `}</style>
    </div>
  )
}
