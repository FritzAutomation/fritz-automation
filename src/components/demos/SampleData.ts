// Realistic sales data — 30 rows with Date, Product, Category, Region, Units, Revenue
export const sampleCsvString = `Date,Product,Category,Region,Units,Revenue
2026-01-05,Widget A,Hardware,Midwest,120,4800
2026-01-08,Service Plan,Services,Northeast,45,6750
2026-01-12,Widget B,Hardware,Southeast,85,5100
2026-01-15,Gadget Pro,Electronics,Midwest,30,8700
2026-01-19,Widget A,Hardware,West,200,8000
2026-01-22,Consulting,Services,Northeast,12,9600
2026-01-26,Gadget Lite,Electronics,Southeast,65,3250
2026-02-02,Widget B,Hardware,Midwest,150,9000
2026-02-06,Service Plan,Services,West,38,5700
2026-02-10,Widget A,Hardware,Northeast,90,3600
2026-02-14,Gadget Pro,Electronics,Midwest,55,15950
2026-02-18,Consulting,Services,Southeast,8,6400
2026-02-22,Widget B,Hardware,West,110,6600
2026-02-25,Gadget Lite,Electronics,Northeast,72,3600
2026-03-01,Widget A,Hardware,Midwest,180,7200
2026-03-05,Service Plan,Services,Southeast,50,7500
2026-03-08,Gadget Pro,Electronics,West,40,11600
2026-03-12,Consulting,Services,Midwest,15,12000
2026-03-15,Widget B,Hardware,Northeast,95,5700
2026-03-19,Widget A,Hardware,Southeast,140,5600
2026-03-22,Gadget Lite,Electronics,Midwest,88,4400
2026-03-26,Service Plan,Services,West,42,6300
2026-03-29,Gadget Pro,Electronics,Northeast,35,10150
2026-04-02,Widget A,Hardware,Midwest,160,6400
2026-04-05,Widget B,Hardware,Southeast,105,6300
2026-04-08,Consulting,Services,West,10,8000
2026-04-12,Gadget Lite,Electronics,Midwest,60,3000
2026-04-15,Widget A,Hardware,Northeast,175,7000
2026-04-18,Service Plan,Services,Midwest,55,8250
2026-04-22,Gadget Pro,Electronics,Southeast,48,13920`

export interface Project {
  id: string
  title: string
  client: string
  status: 'submitted' | 'in-progress' | 'under-review' | 'completed'
  timeline: { date: string; note: string }[]
  files: { name: string; size: string }[]
  messages: { from: string; text: string; date: string }[]
}

export const sampleProjects: Project[] = [
  {
    id: 'proj-001',
    title: 'Company Website Redesign',
    client: 'Sarah Chen',
    status: 'in-progress',
    timeline: [
      { date: '2026-03-15', note: 'Project submitted' },
      { date: '2026-03-17', note: 'Proposal sent and approved' },
      { date: '2026-03-24', note: 'Design mockups delivered' },
      { date: '2026-04-01', note: 'Development started' },
      { date: '2026-04-10', note: 'Homepage and About page complete' },
    ],
    files: [
      { name: 'brand-guidelines.pdf', size: '2.4 MB' },
      { name: 'logo-files.zip', size: '8.1 MB' },
      { name: 'content-draft.docx', size: '340 KB' },
    ],
    messages: [
      { from: 'Sarah', text: 'Excited to get started! Here are our brand files.', date: '2026-03-15' },
      { from: 'Josh', text: 'Got them — I\'ll have mockups for you by end of next week.', date: '2026-03-16' },
      { from: 'Sarah', text: 'The mockups look great. Let\'s move forward with option B.', date: '2026-03-25' },
    ],
  },
  {
    id: 'proj-002',
    title: 'Inventory Tracking Dashboard',
    client: 'Mike Torres',
    status: 'under-review',
    timeline: [
      { date: '2026-02-20', note: 'Project submitted' },
      { date: '2026-02-22', note: 'Discovery call completed' },
      { date: '2026-03-01', note: 'Proposal approved — development started' },
      { date: '2026-03-28', note: 'v1 delivered for review' },
    ],
    files: [
      { name: 'current-inventory.xlsx', size: '1.2 MB' },
      { name: 'requirements.pdf', size: '156 KB' },
    ],
    messages: [
      { from: 'Mike', text: 'We\'re tracking everything in a spreadsheet right now. It\'s a mess.', date: '2026-02-20' },
      { from: 'Josh', text: 'I see this a lot. Let\'s talk through what you actually need to see at a glance.', date: '2026-02-21' },
      { from: 'Mike', text: 'The dashboard looks solid. Reviewing with my team this week.', date: '2026-03-29' },
    ],
  },
  {
    id: 'proj-003',
    title: 'Online Store Setup',
    client: 'Lisa Park',
    status: 'completed',
    timeline: [
      { date: '2026-01-10', note: 'Project submitted' },
      { date: '2026-01-12', note: 'Proposal sent and approved' },
      { date: '2026-01-20', note: 'Design phase complete' },
      { date: '2026-02-15', note: 'Store launched' },
      { date: '2026-02-28', note: 'Post-launch support completed' },
    ],
    files: [
      { name: 'product-photos.zip', size: '45 MB' },
      { name: 'product-descriptions.csv', size: '28 KB' },
      { name: 'final-invoice.pdf', size: '89 KB' },
    ],
    messages: [
      { from: 'Lisa', text: 'I need an online store for my candle business. Nothing too complex.', date: '2026-01-10' },
      { from: 'Josh', text: 'Perfect — I\'ll build something clean that you can manage yourself.', date: '2026-01-11' },
      { from: 'Lisa', text: 'The store is live and I already got my first order! Thank you!', date: '2026-02-16' },
    ],
  },
]
