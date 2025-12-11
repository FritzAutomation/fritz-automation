import DragonRepellerGame from '@/components/DragonRepellerGame';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dragon Repeller Game - Fritz Automation',
  description: 'Play the Dragon Repeller RPG game. A text-based adventure where you must defeat monsters and save the town!',
  keywords: 'Dragon Repeller, RPG Game, Browser Game, JavaScript Game, Fritz Automation',
};

export default function GamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                FA
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Fritz Automation
              </span>
            </Link>
            <Link
              href="/"
              className="px-6 py-2 text-gray-300 hover:text-primary transition-colors font-medium"
            >
              ← Back to Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Game Content */}
      <main className="py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/20 rounded-full text-primary text-sm font-semibold">
              🎮 Interactive Game
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
                Dragon Repeller
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              A text-based RPG adventure. Battle monsters, collect weapons, and defeat the mighty dragon to save the town!
            </p>

            {/* Game Instructions */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">📖 How to Play</h2>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-yellow-400 font-semibold mb-2">⚔️ Combat</div>
                    <p className="text-gray-300 text-sm">Fight monsters in the cave to gain XP and gold. Attack, dodge, or run!</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-green-400 font-semibold mb-2">🏪 Store</div>
                    <p className="text-gray-300 text-sm">Buy health potions and upgrade your weapons with gold.</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-red-400 font-semibold mb-2">🐉 Boss Fight</div>
                    <p className="text-gray-300 text-sm">When ready, challenge the dragon for the ultimate victory!</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-purple-400 font-semibold mb-2">🎯 Strategy</div>
                    <p className="text-gray-300 text-sm">Manage your health, gold, and weapons wisely to survive!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Component */}
          <DragonRepellerGame />

          {/* About Section */}
          <div className="mt-12 text-center">
            <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">About This Game</h3>
              <p className="text-gray-300 mb-4">
                Dragon Repeller is a classic text-based RPG built with vanilla JavaScript and converted to React/Next.js.
                It demonstrates interactive game mechanics, state management, and dynamic UI updates.
              </p>
              <p className="text-gray-400 text-sm">
                Built to showcase front-end development skills and game logic implementation.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">React</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">TypeScript</span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">Next.js</span>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-medium">Game Logic</span>
              </div>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-800">
        <div className="text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Fritz Automation. Built with Next.js & React.</p>
        </div>
      </footer>
    </div>
  );
}
