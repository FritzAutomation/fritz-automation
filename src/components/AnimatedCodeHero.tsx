'use client'

import { useEffect, useState } from 'react'

const codeSnippets = [
  {
    code: `# Excel Report Automation
import openpyxl
from datetime import datetime

wb = openpyxl.load_workbook('sales.xlsx')
sheet = wb.active
total = sum(row[2].value for row in sheet[2:])
sheet['E1'] = f'Generated: {datetime.now()}'
wb.save('sales_report.xlsx')`,
    output: `$ python generate_report.py\n> Loading sales.xlsx...\n> Processing 2,847 rows...\n> Calculating totals: $847,293.50\n> Adding timestamp...\n> ✓ Saved sales_report.xlsx\n> Runtime: 1.2s`
  },
  {
    code: `# Web Scraping & Data Collection
from bs4 import BeautifulSoup
import requests

resp = requests.get(url, headers=headers)
soup = BeautifulSoup(resp.text, 'html.parser')
prices = [p.text for p in soup.select('.price')]
with open('prices.csv', 'w') as f:
    f.writelines(prices)`,
    output: `$ python scrape_prices.py\n> Fetching product data...\n> Parsing 156 product pages...\n> Extracting price information...\n> ✓ Exported to prices.csv\n> 156 records saved`
  },
  {
    code: `# Automated Email Reports
import smtplib
from email.mime.multipart import MIMEMultipart

msg = MIMEMultipart()
msg['Subject'] = 'Daily Analytics Report'
msg.attach(MIMEText(report_html, 'html'))
msg.attach(MIMEBase('application', 'xlsx'))
server.send_message(msg)`,
    output: `$ python send_report.py\n> Generating analytics report...\n> Attaching spreadsheet...\n> Connecting to SMTP server...\n> ✓ Email sent to 12 recipients\n> Status: Delivered`
  }
]

// Simple syntax highlighting
function highlightSyntax(line: string): string {
  // Escape HTML entities first
  line = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Comments (must be first to avoid highlighting inside comments)
  if (line.includes('#')) {
    const commentIndex = line.indexOf('#')
    const beforeComment = line.slice(0, commentIndex)
    const comment = line.slice(commentIndex)
    return highlightCode(beforeComment) + `<span style="color:#6a9955">${comment}</span>`
  }

  return highlightCode(line)
}

function highlightCode(line: string): string {
  // Strings (single and double quotes)
  line = line.replace(/(&apos;[^&apos;]*&apos;|'[^']*'|"[^"]*")/g, '<span style="color:#ce9178">$1</span>')

  // Keywords
  line = line.replace(/\b(def|class|import|from|return|for|in|if|else|elif|with|as|and|or|not|True|False|None)\b/g, '<span style="color:#c586c0">$1</span>')

  // Function calls
  line = line.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\(/g, '<span style="color:#dcdcaa">$1</span>(')

  // Numbers
  line = line.replace(/\b(\d+)\b/g, '<span style="color:#b5cea8">$1</span>')

  return line
}

export function AnimatedCodeHero() {
  const [currentSnippet, setCurrentSnippet] = useState(0)
  const [displayedCode, setDisplayedCode] = useState('')
  const [displayedOutput, setDisplayedOutput] = useState('')
  const [isTypingCode, setIsTypingCode] = useState(true)
  const [isTypingOutput, setIsTypingOutput] = useState(false)

  useEffect(() => {
    const snippet = codeSnippets[currentSnippet]
    let codeIndex = 0
    let outputIndex = 0

    setDisplayedCode('')
    setDisplayedOutput('')
    setIsTypingCode(true)
    setIsTypingOutput(false)

    // Type code
    const codeInterval = setInterval(() => {
      if (codeIndex < snippet.code.length) {
        setDisplayedCode(snippet.code.slice(0, codeIndex + 1))
        codeIndex++
      } else {
        clearInterval(codeInterval)
        setIsTypingCode(false)

        // Start typing output after code is done
        setTimeout(() => {
          setIsTypingOutput(true)
          const outputInterval = setInterval(() => {
            if (outputIndex < snippet.output.length) {
              setDisplayedOutput(snippet.output.slice(0, outputIndex + 1))
              outputIndex++
            } else {
              clearInterval(outputInterval)
              setIsTypingOutput(false)

              // Wait before switching to next snippet
              setTimeout(() => {
                setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length)
              }, 3000)
            }
          }, 20)

          return () => clearInterval(outputInterval)
        }, 500)
      }
    }, 30)

    return () => clearInterval(codeInterval)
  }, [currentSnippet])

  return (
    <div className="w-full">
      <div className="space-y-3">
        {/* Code Editor */}
        <div className="bg-[#0d1117] rounded-lg overflow-hidden shadow-2xl border border-slate-700/50">
          {/* Editor Header */}
          <div className="bg-[#161b22] px-4 py-2 flex items-center gap-2 border-b border-slate-700/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <span className="text-xs text-slate-400 ml-2">automation.py</span>
          </div>

          {/* Code Content */}
          <div className="p-4 font-mono text-xs sm:text-sm min-h-[200px]">
            <pre className="text-slate-300 whitespace-pre-wrap">
              {displayedCode.split('\n').map((line, i) => (
                <div key={i} className="leading-5">
                  <span className="text-slate-600 select-none mr-3 w-4 inline-block text-right">{i + 1}</span>
                  <span dangerouslySetInnerHTML={{ __html: highlightSyntax(line) }} />
                </div>
              ))}
              {isTypingCode && displayedCode && (
                <span className="inline-block w-2 h-4 bg-red-500 animate-pulse ml-0.5"></span>
              )}
            </pre>
          </div>
        </div>

        {/* Terminal */}
        <div className="bg-[#0d1117] rounded-lg overflow-hidden shadow-2xl border border-slate-700/50">
          {/* Terminal Header */}
          <div className="bg-[#161b22] px-4 py-2 flex items-center gap-2 border-b border-slate-700/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <span className="text-xs text-slate-400 ml-2">terminal</span>
          </div>

          {/* Terminal Content */}
          <div className="p-4 font-mono text-xs sm:text-sm min-h-[140px]">
            <pre className="text-green-400 whitespace-pre-wrap">
              {displayedOutput}
              {isTypingOutput && displayedOutput && (
                <span className="inline-block w-2 h-4 bg-green-500 animate-pulse ml-0.5"></span>
              )}
            </pre>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {codeSnippets.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSnippet(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSnippet ? 'bg-red-500 w-6' : 'bg-slate-600 hover:bg-slate-500 w-2'
            }`}
            aria-label={`Go to snippet ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
