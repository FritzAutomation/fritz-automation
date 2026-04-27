'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type FsNode =
  | { type: 'dir'; open?: string; children: Record<string, FsNode> }
  | { type: 'file'; open?: string; external?: boolean }

const FS: Record<string, FsNode> = {
  'about.md':   { type: 'file', open: '/about' },
  'contact.md': { type: 'file', open: '/contact' },
  'work': {
    type: 'dir', open: '/work',
    children: {
      'iowan-foodie.tsx':  { type: 'file', open: 'https://www.iowanfoodie.com', external: true },
      'two-makers-co.tsx': { type: 'file', open: 'https://www.twomakers.co',    external: true },
    },
  },
  'services': {
    type: 'dir', open: '/services',
    children: {
      'websites.tsx':   { type: 'file', open: '/services#websites' },
      'automation.py':  { type: 'file', open: '/services#automation' },
      'pricing.toml':   { type: 'file' },
    },
  },
  'demos': {
    type: 'dir', open: '/demos',
    children: {
      'csv-dashboard.app':  { type: 'file', open: '/demos/csv-dashboard' },
      'client-portal.app':  { type: 'file', open: '/demos/client-portal' },
    },
  },
}

const TEXT_FILES: Record<string, string> = {
  'about.md':
    `<span class="b">// about.md</span>
I'm Josh Fritzjunker. I build software in Burlington, Iowa.
15 years writing code · self-taught · software dev degree.

<span class="dim">$</span> <a class="lnk" href="/about">open about.md</a> <span class="dim">for the long version.</span>`,

  'contact.md':
    `<span class="b">// contact.md</span>
Tell me about your project. I read every inquiry myself.
<span class="dim">avg reply: &lt; 1 hr on workdays.</span>

<span class="dim">$</span> <a class="lnk" href="/contact">open contact.md</a>`,

  'pricing.toml':
    `<span class="b"># pricing.toml</span>

<span class="dim">[</span><span class="h">websites</span><span class="dim">]</span>
range = "<span class="h">$3,500 — $15,000</span>"
timeline = "2–6 weeks"
discovery = "<span class="h">free 30-min call</span>"

<span class="dim">[</span><span class="h">automation</span><span class="dim">]</span>
range = "<span class="h">$6,000 — $40,000</span>"
timeline = "4–12 weeks"
includes = ["dashboards", "integrations", "pipelines"]`,
}

const COMMANDS = ['help', 'ls', 'cd', 'tree', 'cat', 'open', 'pwd', 'whoami', 'clear', 'exit']

const HELP = `<span class="b">Available commands</span>
  <span class="h">ls</span>           list current directory
  <span class="h">cd</span> &lt;dir&gt;     change directory <span class="dim">(cd .. to go up)</span>
  <span class="h">tree</span>         show entire filesystem
  <span class="h">cat</span> &lt;file&gt;   read a file
  <span class="h">open</span> &lt;name&gt;  open a page in normal-site mode
  <span class="h">pwd</span>          print working directory
  <span class="h">whoami</span>       about josh
  <span class="h">clear</span>        clear screen <span class="dim">(Ctrl+L)</span>
  <span class="h">exit</span>         leave shell mode <span class="dim">(go to home)</span>`

function escapeHTML(s: string) {
  return s.replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]!))
}

type Row = { kind: 'user' | 'out'; html: string }

export function ShellTerminal() {
  const router = useRouter()
  const [rows, setRows] = useState<Row[]>([
    { kind: 'out', html: 'Welcome. The whole site is here as a filesystem.<br/>Try <span class="h">tree</span>, then <span class="h">cd services</span>, then <span class="h">open websites</span>.' },
  ])
  const [cwd, setCwd] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [uptime, setUptime] = useState('0s')
  const inputRef = useRef<HTMLInputElement>(null)
  const promptRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<string[]>([])
  const histIdxRef = useRef(-1)

  useEffect(() => {
    inputRef.current?.focus()
    let t = 0
    const interval = window.setInterval(() => {
      t++
      if (t < 60) setUptime(`${t}s`)
      else if (t < 3600) setUptime(`${Math.floor(t/60)}m ${t%60}s`)
      else setUptime(`${Math.floor(t/3600)}h ${Math.floor((t%3600)/60)}m`)
    }, 1000)
    return () => window.clearInterval(interval)
  }, [])

  function cwdNode(): FsNode {
    let n: FsNode = { type: 'dir', children: FS } as FsNode
    for (const seg of cwd) {
      if (n.type !== 'dir') break
      n = n.children[seg]
    }
    return n
  }

  function cwdLabel() {
    return ':~' + (cwd.length ? '/' + cwd.join('/') : '') + '$'
  }

  function pushOut(html: string) { setRows(r => [...r, { kind: 'out', html }]) }
  function pushUser(cmd: string) { setRows(r => [...r, { kind: 'user', html: escapeHTML(cmd) }]) }

  function findChild(name: string): FsNode | undefined {
    const n = cwdNode()
    if (n.type !== 'dir') return undefined
    return n.children[name]
  }

  function findGlobal(name: string): FsNode | undefined {
    function walk(node: FsNode): FsNode | undefined {
      if (node.type !== 'dir') return undefined
      for (const [k, v] of Object.entries(node.children)) {
        if (k === name || k.replace(/\.[^.]+$/, '') === name) return v
        const f = walk(v)
        if (f) return f
      }
      return undefined
    }
    return walk({ type: 'dir', children: FS })
  }

  function tree(node: FsNode = { type: 'dir', children: FS }, prefix = '', isRoot = true): string {
    if (node.type !== 'dir') return ''
    const items = Object.entries(node.children)
    let out = isRoot ? '<span class="dir">~/fritz-automation/</span>\n' : ''
    items.forEach(([name, child], i) => {
      const last = i === items.length - 1
      const branch = last ? '└── ' : '├── '
      const continuation = last ? '    ' : '│   '
      if (child.type === 'dir') {
        out += `<span class="branch">${prefix}${branch}</span><span class="dir">${name}/</span>\n`
        out += tree(child, prefix + continuation, false)
      } else {
        out += `<span class="branch">${prefix}${branch}</span><span class="file" data-open="${child.open || ''}" data-external="${child.external ? '1' : ''}">${name}</span>\n`
      }
    })
    return out
  }

  function listCwd(): string {
    const n = cwdNode()
    if (n.type !== 'dir') return '<span class="dim">(empty)</span>'
    const entries = Object.entries(n.children)
    if (!entries.length) return '<span class="dim">(empty)</span>'
    let out = ''
    entries.forEach(([name, child]) => {
      const perms = child.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--'
      const size = child.type === 'dir' ? '—' : '4K'
      const display = child.type === 'dir'
        ? `<span class="dir">${name}/</span>`
        : `<span class="file" data-open="${child.open || ''}" data-external="${child.external ? '1' : ''}">${name}</span>`
      out += `<div class="stat-grid"><span class="perms">${perms}</span><span class="size">${size}</span>${display}</div>`
    })
    return out
  }

  function execute(rawCmd: string) {
    const cmd = rawCmd.trim()
    if (!cmd) return
    historyRef.current.push(cmd)
    histIdxRef.current = historyRef.current.length
    pushUser(cmd)
    const [op, ...args] = cmd.split(/\s+/)
    const arg = args.join(' ')
    switch (op.toLowerCase()) {
      case 'help':
        pushOut(`<pre>${HELP}</pre>`)
        break
      case 'ls':
        pushOut(listCwd())
        break
      case 'tree':
        pushOut(`<pre class="tree-pre">${tree()}</pre>`)
        break
      case 'pwd':
        pushOut(`/home/josh${cwd.length ? '/' + cwd.join('/') : ''}`)
        break
      case 'cd': {
        if (!arg || arg === '~' || arg === '/') { setCwd([]); break }
        if (arg === '..') { setCwd(c => c.slice(0, -1)); break }
        const child = findChild(arg.replace(/\/$/, ''))
        if (!child) pushOut(`<span class="dim">cd: no such directory:</span> <span class="h">${escapeHTML(arg)}</span>`)
        else if (child.type !== 'dir') pushOut(`<span class="dim">cd:</span> <span class="h">${escapeHTML(arg)}</span> <span class="dim">is not a directory — try </span><span class="h">cat ${escapeHTML(arg)}</span>`)
        else setCwd(c => [...c, arg.replace(/\/$/, '')])
        break
      }
      case 'cat': {
        if (!arg) { pushOut('<span class="dim">cat: no file specified</span>'); break }
        const child = findChild(arg)
        if (TEXT_FILES[arg]) pushOut(`<pre>${TEXT_FILES[arg]}</pre>`)
        else if (child?.type === 'file') pushOut(`<span class="dim">→ binary file. </span><span class="h">open ${escapeHTML(arg)}</span><span class="dim"> to view.</span>`)
        else pushOut(`<span class="dim">cat: no such file:</span> <span class="h">${escapeHTML(arg)}</span>`)
        break
      }
      case 'open': {
        if (!arg) { pushOut('<span class="dim">open: no target specified</span>'); break }
        const child = findChild(arg) || findGlobal(arg)
        if (child && 'open' in child && child.open) {
          const target = child.open
          const isExternal = child.type === 'file' && child.external === true
          pushOut(`<span class="dim">→ opening</span> <span class="lnk">${target}</span><span class="dim">...</span>`)
          setTimeout(() => {
            if (isExternal) window.open(target, '_blank')
            else router.push(target)
          }, 400)
        } else {
          pushOut(`<span class="dim">open: not found:</span> <span class="h">${escapeHTML(arg)}</span>`)
        }
        break
      }
      case 'whoami':
        pushOut(`<pre><span class="b">josh fritzjunker</span>
  <span class="dim">role     </span> developer · sole proprietor
  <span class="dim">located  </span> burlington, iowa
  <span class="dim">since    </span> 2024
  <span class="dim">stack    </span> next.js · react · typescript · postgres · python</pre>`)
        break
      case 'clear':
        setRows([])
        break
      case 'exit':
        pushOut('<span class="dim">→ exiting shell mode...</span>')
        setTimeout(() => router.push('/'), 400)
        break
      default:
        pushOut(`<span class="dim">command not found:</span> <span class="h">${escapeHTML(op)}</span> <span class="dim">— try </span><span class="h">help</span>`)
    }
    setTimeout(() => promptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 30)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const v = input
      setInput('')
      execute(v)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const parts = input.split(/\s+/)
      if (parts.length === 1) {
        const m = COMMANDS.find(c => c.startsWith(parts[0].toLowerCase()))
        if (m) setInput(m)
      } else {
        const last = parts[parts.length - 1]
        const n = cwdNode()
        if (n.type === 'dir') {
          const names = Object.keys(n.children).concat(Object.keys(TEXT_FILES))
          const m = names.find(name => name.toLowerCase().startsWith(last.toLowerCase()))
          if (m) {
            parts[parts.length - 1] = m
            setInput(parts.join(' '))
          }
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (histIdxRef.current > 0) {
        histIdxRef.current--
        setInput(historyRef.current[histIdxRef.current])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdxRef.current < historyRef.current.length - 1) {
        histIdxRef.current++
        setInput(historyRef.current[histIdxRef.current])
      } else {
        histIdxRef.current = historyRef.current.length
        setInput('')
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault()
      setRows([])
    }
  }

  function onTermClick(e: React.MouseEvent) {
    const t = e.target as HTMLElement
    const f = t.closest<HTMLElement>('.file[data-open]')
    if (f) {
      const target = f.dataset.open
      const external = f.dataset.external === '1'
      if (target) {
        if (external) window.open(target, '_blank')
        else router.push(target)
      }
    }
  }

  function chipClick(cmd: string) {
    setInput(cmd)
    execute(cmd)
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <div className="max-w-[920px] mx-auto px-6 sm:px-8 font-mono">
      <pre className="text-[11px] leading-tight text-[var(--accent)] opacity-85 whitespace-pre mb-4">{`  ┌─┐┬─┐┬┌┬┐┌─┐  ┌─┐┬ ┬┌─┐┬  ┬
  ├┤ ├┬┘│ │ │┌─┘  └─┐├─┤├┤ │  │
  └  ┴└─┴ ┴ └─┘  └─┘┴ ┴└─┘┴─┘┴─┘ `}<span className="text-[var(--ink-dim)]">v3.0.0</span></pre>

      <div className="text-[var(--ink-soft)] text-[13px] leading-7 mb-4">
        <span className="text-[var(--accent)] font-semibold">josh@fritz-automation</span>
        <span> · burlington, iowa · uptime </span>
        <span>{uptime}</span>
        <br />
        <span className="text-[var(--ink-dim)]">browse the entire site as a filesystem. type</span>{' '}
        <span className="text-[var(--accent)]">help</span>
        <span className="text-[var(--ink-dim)]">,</span>{' '}
        <span className="text-[var(--accent)]">ls</span>
        <span className="text-[var(--ink-dim)]">, or</span>{' '}
        <span className="text-[var(--accent)]">tree</span>
        <span className="text-[var(--ink-dim)]">.</span>
      </div>

      <div className="text-[var(--ink-soft)] text-[13px] mb-5">
        Press <kbd className="kbd">Tab</kbd> to autocomplete · <kbd className="kbd">↑/↓</kbd> for history · <kbd className="kbd">Ctrl+L</kbd> to clear
      </div>

      <div className="text-[14px] leading-[1.65]" onClick={onTermClick}>
        {rows.map((r, i) => (
          r.kind === 'user' ? (
            <div key={i} className="flex gap-2.5 items-baseline flex-wrap py-1">
              <span className="text-[var(--accent)]">josh</span>
              <span className="text-[var(--ink-dim)]">@</span>
              <span className="text-[var(--blue)]">fritz-automation</span>
              <span className="text-[var(--ink-dim)]">{cwdLabel()}</span>
              <span className="text-[var(--ink)]" dangerouslySetInnerHTML={{ __html: r.html }} />
            </div>
          ) : (
            <div key={i} className="text-[var(--ink)] py-1 shell-out" dangerouslySetInnerHTML={{ __html: r.html }} />
          )
        ))}
      </div>

      <div ref={promptRef} className="flex gap-2.5 items-baseline flex-wrap relative py-1">
        <span className="text-[var(--accent)]">josh</span>
        <span className="text-[var(--ink-dim)]">@</span>
        <span className="text-[var(--blue)]">fritz-automation</span>
        <span className="text-[var(--ink-dim)]">{cwdLabel()}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="flex-1 min-w-[160px] bg-transparent border-0 outline-none text-[var(--ink)] font-mono text-[14px]"
          style={{ caretColor: 'var(--accent)' }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 pb-2">
        {[
          ['help', 'help'],
          ['tree', 'tree'],
          ['ls', 'ls'],
          ['whoami', 'whoami'],
          ['cat about.md', 'cat about.md'],
          ['cat pricing.toml', 'cat pricing.toml'],
          ['open contact', 'open contact'],
        ].map(([cmd, label]) => (
          <button
            key={cmd}
            onClick={() => chipClick(cmd)}
            className="font-mono text-xs px-2.5 py-1 border border-[var(--line)] rounded-full text-[var(--ink-soft)] bg-[var(--surface-overlay)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors min-h-[28px]"
          >
            <span className="text-[var(--accent)] mr-1">$</span>{label}
          </button>
        ))}
      </div>

      <style jsx>{`
        .kbd { background: var(--bg-soft); border: 1px solid var(--line); border-bottom-width: 2px; border-radius: 4px; padding: 1px 6px; font-size: 11px; color: var(--accent); margin: 0 2px; }
        :global(.shell-out .h) { color: var(--accent); }
        :global(.shell-out .b) { color: var(--heading); font-weight: 600; }
        :global(.shell-out .dim) { color: var(--ink-dim); }
        :global(.shell-out pre) { font-family: inherit; white-space: pre-wrap; }
        :global(.shell-out .tree-pre) { line-height: 1.7; }
        :global(.shell-out .branch) { color: var(--ink-dim); }
        :global(.shell-out .dir) { color: var(--ink); }
        :global(.shell-out .file) { color: var(--ink-soft); cursor: pointer; }
        :global(.shell-out .file:hover) { color: var(--accent); }
        :global(.shell-out .lnk) { color: var(--accent); text-decoration: none; border-bottom: 1px dashed var(--accent-glow); }
        :global(.shell-out .lnk:hover) { color: var(--accent-bright); }
        :global(.shell-out .stat-grid) { display: grid; grid-template-columns: 90px 60px 1fr; gap: 10px; padding: 1px 0; color: var(--ink-soft); }
        :global(.shell-out .stat-grid .perms) { color: var(--ink-dim); }
        :global(.shell-out .stat-grid .size) { color: var(--ink-dim); text-align: right; }
      `}</style>
    </div>
  )
}
