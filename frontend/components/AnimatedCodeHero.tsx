'use client';

import { useEffect, useState } from 'react';

const codeSnippets = [
  {
    code: `# Fritz Automation Solutions
def automate_workflow():
    tasks = fetch_pending_tasks()
    for task in tasks:
        process_automatically(task)
    return "✓ All tasks completed!"`,
    output: `$ python automate.py\n> Connecting to system...\n> Processing 127 tasks...\n> ✓ All tasks completed successfully!\n> Runtime: 0.3s`
  },
  {
    code: `# API Integration & Data Processing
import requests

def sync_data():
    response = requests.get(api_url)
    data = response.json()
    transform_and_save(data)
    return f"Synced {len(data)} records"`,
    output: `$ python sync.py\n> Fetching data from API...\n> Transforming 1,547 records...\n> Saving to database...\n> ✓ Synced 1,547 records\n> Status: Success`
  },
  {
    code: `# Custom Django Web Applications
from django.shortcuts import render

def dashboard_view(request):
    analytics = get_analytics()
    return render(request, 'dashboard.html',
                  {'analytics': analytics})`,
    output: `$ python manage.py runserver\n> System check identified no issues.\n> Django version 5.0.1\n> Starting development server...\n> ✓ Server running at http://127.0.0.1:8000/`
  }
];

export default function AnimatedCodeHero() {
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [displayedCode, setDisplayedCode] = useState('');
  const [displayedOutput, setDisplayedOutput] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const snippet = codeSnippets[currentSnippet];
    let codeIndex = 0;
    let outputIndex = 0;

    setDisplayedCode('');
    setDisplayedOutput('');
    setIsTyping(true);

    // Type code
    const codeInterval = setInterval(() => {
      if (codeIndex < snippet.code.length) {
        setDisplayedCode(snippet.code.slice(0, codeIndex + 1));
        codeIndex++;
      } else {
        clearInterval(codeInterval);

        // Start typing output after code is done
        setTimeout(() => {
          const outputInterval = setInterval(() => {
            if (outputIndex < snippet.output.length) {
              setDisplayedOutput(snippet.output.slice(0, outputIndex + 1));
              outputIndex++;
            } else {
              clearInterval(outputInterval);
              setIsTyping(false);

              // Wait before switching to next snippet
              setTimeout(() => {
                setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length);
              }, 3000);
            }
          }, 20);
        }, 500);
      }
    }, 30);

    return () => clearInterval(codeInterval);
  }, [currentSnippet]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Code Editor */}
        <div className="bg-[#1e1e1e] rounded-lg overflow-hidden shadow-2xl border border-gray-800">
          {/* Editor Header */}
          <div className="bg-[#323233] px-4 py-2 flex items-center gap-2 border-b border-gray-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <span className="text-xs text-gray-400 ml-2">automation.py</span>
          </div>

          {/* Code Content */}
          <div className="p-4 font-mono text-sm min-h-[280px]">
            <pre className="text-gray-300 whitespace-pre-wrap">
              {displayedCode.split('\n').map((line, i) => (
                <div key={i} className="leading-6">
                  <span className="text-gray-600 select-none mr-4">{i + 1}</span>
                  <span dangerouslySetInnerHTML={{ __html: highlightSyntax(line) }} />
                </div>
              ))}
              {isTyping && displayedCode && <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-0.5"></span>}
            </pre>
          </div>
        </div>

        {/* Terminal */}
        <div className="bg-[#1e1e1e] rounded-lg overflow-hidden shadow-2xl border border-gray-800">
          {/* Terminal Header */}
          <div className="bg-[#323233] px-4 py-2 flex items-center gap-2 border-b border-gray-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <span className="text-xs text-gray-400 ml-2">terminal</span>
          </div>

          {/* Terminal Content */}
          <div className="p-4 font-mono text-sm min-h-[280px]">
            <pre className="text-green-400 whitespace-pre-wrap">
              {displayedOutput}
              {isTyping && displayedOutput && <span className="inline-block w-2 h-4 bg-green-500 animate-pulse ml-0.5"></span>}
            </pre>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {codeSnippets.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSnippet(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSnippet ? 'bg-blue-500 w-8' : 'bg-gray-600 hover:bg-gray-500'
            }`}
            aria-label={`Go to snippet ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Simple syntax highlighting
function highlightSyntax(line: string): string {
  // Comments
  line = line.replace(/(#.*$)/g, '<span style="color: #6a9955">$1</span>');

  // Keywords
  line = line.replace(/\b(def|class|import|from|return|for|in|if|else|elif)\b/g, '<span style="color: #c586c0">$1</span>');

  // Function names
  line = line.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<span style="color: #dcdcaa">$1</span>(');

  // Strings
  line = line.replace(/(['"`])(?:(?=(\\?))\2.)*?\1/g, '<span style="color: #ce9178">$&</span>');

  return line;
}
