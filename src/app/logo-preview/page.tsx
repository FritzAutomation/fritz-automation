'use client'

export default function LogoPreviewPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2">Logo Options Preview</h1>
        <p className="text-center text-slate-600 mb-12">Gear + Code concept variations</p>

        <div className="grid gap-8">

          {/* Option 1: Filled Gear with Code Brackets */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Option 1: Filled Gear with Code Brackets</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Light background */}
              <div className="bg-slate-50 rounded-xl p-8 flex flex-col items-center gap-6">
                <span className="text-xs text-slate-500">Light Background</span>
                <div className="flex items-center gap-3">
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                    <path
                      d="M32 4L36.5 8.5L43 7L46 13L53 13L54 20L60 23.5L57 30L60 36.5L54 40L53 47L46 47L43 53L36.5 51.5L32 56L27.5 51.5L21 53L18 47L11 47L10 40L4 36.5L7 30L4 23.5L10 20L11 13L18 13L21 7L27.5 8.5L32 4Z"
                      fill="url(#grad1a)"
                    />
                    <circle cx="32" cy="30" r="14" fill="#1e293b" />
                    <path d="M26 24L20 30L26 36" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M38 24L44 30L38 36" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <defs>
                      <linearGradient id="grad1a" x1="4" y1="4" x2="60" y2="56">
                        <stop stopColor="#ef4444" />
                        <stop offset="1" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    Fritz Automation
                  </span>
                </div>
              </div>
              {/* Dark background */}
              <div className="bg-slate-900 rounded-xl p-8 flex flex-col items-center gap-6">
                <span className="text-xs text-slate-400">Dark Background</span>
                <div className="flex items-center gap-3">
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                    <path
                      d="M32 4L36.5 8.5L43 7L46 13L53 13L54 20L60 23.5L57 30L60 36.5L54 40L53 47L46 47L43 53L36.5 51.5L32 56L27.5 51.5L21 53L18 47L11 47L10 40L4 36.5L7 30L4 23.5L10 20L11 13L18 13L21 7L27.5 8.5L32 4Z"
                      fill="#ef4444"
                    />
                    <circle cx="32" cy="30" r="14" fill="#0f172a" />
                    <path d="M26 24L20 30L26 36" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M38 24L44 30L38 36" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xl font-bold text-white">Fritz Automation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Option 2: Outline Gear with Slash */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Option 2: Outline Gear with Code Slash</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 rounded-xl p-8 flex flex-col items-center gap-6">
                <span className="text-xs text-slate-500">Light Background</span>
                <div className="flex items-center gap-3">
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                    <path
                      d="M32 6L36 10L42 8L46 14L52 14L54 20L60 24L56 32L60 40L54 44L52 50L46 50L42 56L36 54L32 58L28 54L22 56L18 50L12 50L10 44L4 40L8 32L4 24L10 20L12 14L18 14L22 8L28 10L32 6Z"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3"
                    />
                    <path d="M24 26L18 32L24 38" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M40 26L46 32L40 38" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M35 24L29 40" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    Fritz Automation
                  </span>
                </div>
              </div>
              <div className="bg-slate-900 rounded-xl p-8 flex flex-col items-center gap-6">
                <span className="text-xs text-slate-400">Dark Background</span>
                <div className="flex items-center gap-3">
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                    <path
                      d="M32 6L36 10L42 8L46 14L52 14L54 20L60 24L56 32L60 40L54 44L52 50L46 50L42 56L36 54L32 58L28 54L22 56L18 50L12 50L10 44L4 40L8 32L4 24L10 20L12 14L18 14L22 8L28 10L32 6Z"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3"
                    />
                    <path d="M24 26L18 32L24 38" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M40 26L46 32L40 38" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M35 24L29 40" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <span className="text-xl font-bold text-white">Fritz Automation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Option 3: Circular Gear with Brackets */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Option 3: Circular with Gear Teeth</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 rounded-xl p-8 flex flex-col items-center gap-6">
                <span className="text-xs text-slate-500">Light Background</span>
                <div className="flex items-center gap-3">
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="24" fill="#ef4444" />
                    {/* Gear teeth */}
                    <rect x="29" y="4" width="6" height="8" fill="#ef4444" />
                    <rect x="29" y="52" width="6" height="8" fill="#ef4444" />
                    <rect x="4" y="29" width="8" height="6" fill="#ef4444" />
                    <rect x="52" y="29" width="8" height="6" fill="#ef4444" />
                    <rect x="10" y="10" width="6" height="8" fill="#ef4444" transform="rotate(45 13 14)" />
                    <rect x="48" y="10" width="6" height="8" fill="#ef4444" transform="rotate(-45 51 14)" />
                    <rect x="10" y="46" width="6" height="8" fill="#ef4444" transform="rotate(-45 13 50)" />
                    <rect x="48" y="46" width="6" height="8" fill="#ef4444" transform="rotate(45 51 50)" />
                    <circle cx="32" cy="32" r="16" fill="#1e293b" />
                    <path d="M26 26L20 32L26 38" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M38 26L44 32L38 38" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    Fritz Automation
                  </span>
                </div>
              </div>
              <div className="bg-slate-900 rounded-xl p-8 flex flex-col items-center gap-6">
                <span className="text-xs text-slate-400">Dark Background</span>
                <div className="flex items-center gap-3">
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="24" fill="#ef4444" />
                    <rect x="29" y="4" width="6" height="8" fill="#ef4444" />
                    <rect x="29" y="52" width="6" height="8" fill="#ef4444" />
                    <rect x="4" y="29" width="8" height="6" fill="#ef4444" />
                    <rect x="52" y="29" width="8" height="6" fill="#ef4444" />
                    <circle cx="32" cy="32" r="16" fill="#0f172a" />
                    <path d="M26 26L20 32L26 38" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M38 26L44 32L38 38" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xl font-bold text-white">Fritz Automation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Option 4: Modern Hexagon Gear */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Option 4: Hexagon Gear (Modern)</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 rounded-xl p-8 flex flex-col items-center gap-6">
                <span className="text-xs text-slate-500">Light Background</span>
                <div className="flex items-center gap-3">
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                    {/* Hexagon with gear teeth */}
                    <path
                      d="M32 4L52 16V40L32 52L12 40V16L32 4Z"
                      fill="#ef4444"
                    />
                    {/* Teeth */}
                    <path d="M32 0L36 4L32 4L28 4L32 0Z" fill="#ef4444" />
                    <path d="M32 56L36 52H28L32 56Z" fill="#ef4444" />
                    <path d="M56 18L52 16V22L56 18Z" fill="#ef4444" />
                    <path d="M56 38L52 34V40L56 38Z" fill="#ef4444" />
                    <path d="M8 18L12 22V16L8 18Z" fill="#ef4444" />
                    <path d="M8 38L12 40V34L8 38Z" fill="#ef4444" />
                    <path
                      d="M32 14L44 22V34L32 42L20 34V22L32 14Z"
                      fill="#1e293b"
                    />
                    <path d="M26 24L21 28L26 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M38 24L43 28L38 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    Fritz Automation
                  </span>
                </div>
              </div>
              <div className="bg-slate-900 rounded-xl p-8 flex flex-col items-center gap-6">
                <span className="text-xs text-slate-400">Dark Background</span>
                <div className="flex items-center gap-3">
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                    <path d="M32 4L52 16V40L32 52L12 40V16L32 4Z" fill="#ef4444" />
                    <path d="M32 0L36 4L32 4L28 4L32 0Z" fill="#ef4444" />
                    <path d="M32 56L36 52H28L32 56Z" fill="#ef4444" />
                    <path d="M56 18L52 16V22L56 18Z" fill="#ef4444" />
                    <path d="M56 38L52 34V40L56 38Z" fill="#ef4444" />
                    <path d="M8 18L12 22V16L8 18Z" fill="#ef4444" />
                    <path d="M8 38L12 40V34L8 38Z" fill="#ef4444" />
                    <path d="M32 14L44 22V34L32 42L20 34V22L32 14Z" fill="#0f172a" />
                    <path d="M26 24L21 28L26 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M38 24L43 28L38 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xl font-bold text-white">Fritz Automation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Option 5: Simple & Clean */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Option 5: Simple & Clean</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 rounded-xl p-8 flex flex-col items-center gap-6">
                <span className="text-xs text-slate-500">Light Background</span>
                <div className="flex items-center gap-3">
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                    <rect x="4" y="4" width="56" height="56" rx="12" fill="#ef4444" />
                    <path d="M22 24L14 32L22 40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M42 24L50 32L42 40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M36 18L28 46" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    Fritz Automation
                  </span>
                </div>
              </div>
              <div className="bg-slate-900 rounded-xl p-8 flex flex-col items-center gap-6">
                <span className="text-xs text-slate-400">Dark Background</span>
                <div className="flex items-center gap-3">
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                    <rect x="4" y="4" width="56" height="56" rx="12" fill="#ef4444" />
                    <path d="M22 24L14 32L22 40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M42 24L50 32L42 40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M36 18L28 46" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span className="text-xl font-bold text-white">Fritz Automation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Option 6: Gear with F */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Option 6: Gear with &quot;F&quot; Monogram</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 rounded-xl p-8 flex flex-col items-center gap-6">
                <span className="text-xs text-slate-500">Light Background</span>
                <div className="flex items-center gap-3">
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                    <path
                      d="M32 4L36.5 8.5L43 7L46 13L53 13L54 20L60 23.5L57 30L60 36.5L54 40L53 47L46 47L43 53L36.5 51.5L32 56L27.5 51.5L21 53L18 47L11 47L10 40L4 36.5L7 30L4 23.5L10 20L11 13L18 13L21 7L27.5 8.5L32 4Z"
                      fill="#ef4444"
                    />
                    <circle cx="32" cy="30" r="16" fill="#1e293b" />
                    <text x="32" y="37" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold" fontFamily="system-ui">F</text>
                  </svg>
                  <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    Fritz Automation
                  </span>
                </div>
              </div>
              <div className="bg-slate-900 rounded-xl p-8 flex flex-col items-center gap-6">
                <span className="text-xs text-slate-400">Dark Background</span>
                <div className="flex items-center gap-3">
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                    <path
                      d="M32 4L36.5 8.5L43 7L46 13L53 13L54 20L60 23.5L57 30L60 36.5L54 40L53 47L46 47L43 53L36.5 51.5L32 56L27.5 51.5L21 53L18 47L11 47L10 40L4 36.5L7 30L4 23.5L10 20L11 13L18 13L21 7L27.5 8.5L32 4Z"
                      fill="#ef4444"
                    />
                    <circle cx="32" cy="30" r="16" fill="#0f172a" />
                    <text x="32" y="37" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold" fontFamily="system-ui">F</text>
                  </svg>
                  <span className="text-xl font-bold text-white">Fritz Automation</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 text-center text-slate-500">
          <p>Let me know which option you prefer, or if you&apos;d like me to combine elements from different options!</p>
        </div>
      </div>
    </div>
  )
}
