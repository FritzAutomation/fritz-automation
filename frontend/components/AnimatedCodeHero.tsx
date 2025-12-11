'use client';

import { useEffect, useState } from 'react';

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
  // Escape HTML entities first
  line = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Comments (must be first to avoid highlighting inside comments)
  if (line.includes('#')) {
    const commentIndex = line.indexOf('#');
    const beforeComment = line.slice(0, commentIndex);
    const comment = line.slice(commentIndex);
    line = highlightCode(beforeComment) + `<span style="color:#6a9955">${comment}</span>`;
    return line;
  }

  return highlightCode(line);
}

function highlightCode(line: string): string {
  // Strings (single and double quotes)
  line = line.replace(/(&apos;[^&apos;]*&apos;|'[^']*'|"[^"]*")/g, '<span style="color:#ce9178">$1</span>');

  // Keywords
  line = line.replace(/\b(def|class|import|from|return|for|in|if|else|elif|with|as|and|or|not|True|False|None)\b/g, '<span style="color:#c586c0">$1</span>');

  // Function calls
  line = line.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\(/g, '<span style="color:#dcdcaa">$1</span>(');

  // Numbers
  line = line.replace(/\b(\d+)\b/g, '<span style="color:#b5cea8">$1</span>');

  return line;
}
