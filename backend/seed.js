// ============================================================
//  LearnFlow – MongoDB Seed Script
//  Run once:  node seed.js
// ============================================================
require('dotenv').config();
const mongoose    = require('mongoose');
const Course      = require('./models/Course');
const LiveSession = require('./models/LiveSession');
const Domain      = require('./models/Domain');
const User        = require('./models/User');

// ── Raw data (mirrors js/data.js) ─────────────────────────
const DOMAINS = [
  { domainId: 'webdev',      name: 'Web Dev',         emoji: '🌐', count: 248 },
  { domainId: 'datascience', name: 'Data Science',    emoji: '📊', count: 186 },
  { domainId: 'design',      name: 'UI/UX Design',    emoji: '🎨', count: 134 },
  { domainId: 'mobile',      name: 'Mobile Dev',      emoji: '📱', count: 112 },
  { domainId: 'devops',      name: 'DevOps & Cloud',  emoji: '☁️',  count: 98  },
  { domainId: 'ai',          name: 'AI & ML',         emoji: '🤖', count: 164 },
  { domainId: 'business',    name: 'Business',        emoji: '💼', count: 89  },
  { domainId: 'cybersec',    name: 'Cyber Security',  emoji: '🔐', count: 76  },
];

const COURSES = [
  { title: 'React 19 & Next.js 15 — The Complete Guide',            instructor: 'Priya Sharma',   domain: 'webdev',      domainLabel: 'Web Dev',        emoji: '⚛️',  level: 'intermediate', rating: 4.9, reviews: 12480, students: '84K',  duration: '42h', price: 1299, originalPrice: 4999, badge: 'bestseller', tags: ['React','Next.js','TypeScript'] },
  { title: 'Python for Data Science & Machine Learning Bootcamp',    instructor: 'Arjun Mehta',    domain: 'datascience', domainLabel: 'Data Science',   emoji: '🐍',  level: 'beginner',     rating: 4.8, reviews: 9210,  students: '120K', duration: '55h', price: 999,  originalPrice: 3999, badge: 'bestseller', tags: ['Python','Pandas','scikit-learn'] },
  { title: 'Figma Mastery: UI/UX Design from Zero to Hero',          instructor: 'Sneha Iyer',     domain: 'design',      domainLabel: 'UI/UX Design',   emoji: '🎨',  level: 'beginner',     rating: 4.7, reviews: 6340,  students: '48K',  duration: '28h', price: 799,  originalPrice: 2999, badge: 'hot',        tags: ['Figma','Design Systems','Prototyping'] },
  { title: 'Generative AI & LLMs: Engineering Prompt-First Apps',    instructor: 'Rahul Kapoor',   domain: 'ai',          domainLabel: 'AI & ML',        emoji: '🤖',  level: 'advanced',     rating: 4.9, reviews: 3820,  students: '28K',  duration: '38h', price: 1499, originalPrice: 5999, badge: 'new',        tags: ['LLMs','LangChain','RAG','GPT-4'] },
  { title: 'Kubernetes & Docker: Deploy at Scale on AWS',            instructor: 'Vikram Nair',    domain: 'devops',      domainLabel: 'DevOps & Cloud', emoji: '☁️',  level: 'intermediate', rating: 4.8, reviews: 5100,  students: '36K',  duration: '46h', price: 1199, originalPrice: 4499, badge: null,         tags: ['Kubernetes','Docker','AWS','CI/CD'] },
  { title: 'Flutter & Dart: Build Cross-Platform Apps',              instructor: 'Divya Reddy',    domain: 'mobile',      domainLabel: 'Mobile Dev',     emoji: '📱',  level: 'intermediate', rating: 4.6, reviews: 4230,  students: '32K',  duration: '34h', price: 999,  originalPrice: 3499, badge: 'hot',        tags: ['Flutter','Dart','Firebase'] },
  { title: 'System Design Interview: In-Depth Mastery',              instructor: 'Kiran Bose',     domain: 'webdev',      domainLabel: 'Web Dev',        emoji: '🏗️',  level: 'advanced',     rating: 4.9, reviews: 8950,  students: '64K',  duration: '22h', price: 1599, originalPrice: 5999, badge: 'bestseller', tags: ['System Design','Microservices','Scalability'] },
  { title: 'SQL + NoSQL Databases: A Complete Developer Guide',      instructor: 'Ananya Das',     domain: 'datascience', domainLabel: 'Data Science',   emoji: '🗄️',  level: 'beginner',     rating: 4.7, reviews: 3670,  students: '41K',  duration: '30h', price: 0,    originalPrice: null, badge: 'free',       tags: ['SQL','PostgreSQL','MongoDB'] },
  { title: 'Ethical Hacking & Penetration Testing Bootcamp',         instructor: 'Suresh Kumar',   domain: 'cybersec',    domainLabel: 'Cyber Security', emoji: '🔐',  level: 'intermediate', rating: 4.8, reviews: 4900,  students: '38K',  duration: '52h', price: 1399, originalPrice: 5499, badge: 'hot',        tags: ['Kali Linux','Metasploit','OWASP'] },
  { title: 'Product Management: From Idea to Launch',                instructor: 'Meera Joshi',    domain: 'business',    domainLabel: 'Business',       emoji: '🚀',  level: 'beginner',     rating: 4.6, reviews: 2890,  students: '22K',  duration: '18h', price: 699,  originalPrice: 2499, badge: 'new',        tags: ['Product Strategy','Agile','Roadmapping'] },
  { title: 'TypeScript Deep Dive: Advanced Patterns & Architecture', instructor: 'Priya Sharma',   domain: 'webdev',      domainLabel: 'Web Dev',        emoji: '🔷',  level: 'advanced',     rating: 4.8, reviews: 5640,  students: '44K',  duration: '24h', price: 1099, originalPrice: 3999, badge: null,         tags: ['TypeScript','Design Patterns','Architecture'] },
  { title: 'Deep Learning with PyTorch & TensorFlow',                instructor: 'Rahul Kapoor',   domain: 'ai',          domainLabel: 'AI & ML',        emoji: '🧠',  level: 'advanced',     rating: 4.9, reviews: 7210,  students: '52K',  duration: '60h', price: 1799, originalPrice: 6999, badge: 'bestseller', tags: ['PyTorch','TensorFlow','CNNs','Transformers'] },
];

const LIVE_SESSIONS = [
  {
    title: 'System Design: Designing Twitter/X at Scale', instructor: 'Kiran Bose', instructorInitial: 'KB',
    topic: 'webdev', topicLabel: 'System Design', level: 'advanced', status: 'live',
    startTime: 'Live now', duration: '90 min', viewers: 342, enrolled: 1240,
    tags: ['System Design','Microservices','CAP Theorem'],
    overview: 'In this session, Kiran breaks down how Twitter handles 500M+ tweets per day. We will cover timeline generation with fanout, sharding strategies for the tweet database, real-time event streaming with Kafka, and CDN strategies for media delivery.',
    topics: ['Fanout-on-write vs fanout-on-read for timelines','Database sharding & consistent hashing','Redis cache layer for hot timelines','Kafka event streaming for notifications','Global CDN for media at scale'],
    insights: ['Twitter uses a hybrid fanout model — precomputed for celebrities, on-demand for regular users.','Read replicas and write-ahead logging are critical for consistency guarantees.','The tweet ID itself encodes a timestamp, shard ID, and sequence number.'],
  },
  {
    title: 'LangChain + RAG: Build a Production PDF QnA Bot', instructor: 'Rahul Kapoor', instructorInitial: 'RK',
    topic: 'ai', topicLabel: 'Generative AI', level: 'intermediate', status: 'live',
    startTime: 'Live now', duration: '120 min', viewers: 218, enrolled: 890,
    tags: ['LangChain','RAG','ChromaDB','OpenAI'],
    overview: 'Rahul demonstrates how to build a production-grade RAG pipeline that can answer questions from a collection of uploaded PDFs. The session covers chunking strategies, vector embeddings, retrieval ranking, and deploying with FastAPI.',
    topics: ['Document ingestion & text chunking strategies','Generating embeddings with OpenAI Ada-002','Vector store with ChromaDB','Chain-of-thought retrieval prompting','Deploying the API with FastAPI + Docker'],
    insights: ['Chunk size significantly affects retrieval quality — 512 tokens with 50-token overlap is a solid baseline.','HyDE can improve retrieval recall by 30%.','Always add a re-ranker step to combine BM25 sparse retrieval with dense embeddings.'],
  },
  {
    title: 'React 19 Deep Dive: Server Components & Actions', instructor: 'Priya Sharma', instructorInitial: 'PS',
    topic: 'webdev', topicLabel: 'Frontend', level: 'intermediate', status: 'upcoming',
    startTime: 'Today 7:00 PM', duration: '75 min', viewers: 0, enrolled: 1640,
    tags: ['React 19','Server Components','Next.js 15'],
    overview: 'Priya walks through the new mental model introduced in React 19 — server components, server actions, and the transition from client-centric to server-centric rendering.',
    topics: ['Server Components vs Client Components','Server Actions: form mutations without API routes','Streaming and Suspense for progressive rendering','Caching strategies in Next.js 15','Migration path from React 18 apps'],
    insights: ['Server components run only on the server — they can never be interactive.','Forms can call server actions directly with the `action` prop.','The new `use` hook unlocks reading promises and context in a unified API.'],
  },
  {
    title: 'Flutter Animations: Lottie, Hero & Custom Painters', instructor: 'Divya Reddy', instructorInitial: 'DR',
    topic: 'mobile', topicLabel: 'Mobile Dev', level: 'intermediate', status: 'upcoming',
    startTime: 'Today 9:00 PM', duration: '60 min', viewers: 0, enrolled: 520,
    tags: ['Flutter','Animations','CustomPainter','Lottie'],
    overview: 'Divya demonstrates three levels of Flutter animations — declarative Hero transitions, the Lottie JSON ecosystem, and low-level CustomPainter for pixel-perfect effects.',
    topics: ['Implicit vs explicit animations in Flutter','Hero & page route transitions','Integrating Lottie for JSON-based animations','CustomPainter & Canvas API deep dive','Performance profiling: jank detection'],
    insights: ['Use RepaintBoundary to isolate heavy animation widgets.','Lottie files can be 95% smaller than equivalent GIFs.','The Ticker class is the heartbeat of all Flutter animations.'],
  },
  {
    title: 'Kubernetes Troubleshooting Workshop: Real Production Incidents', instructor: 'Vikram Nair', instructorInitial: 'VN',
    topic: 'devops', topicLabel: 'DevOps & Cloud', level: 'advanced', status: 'upcoming',
    startTime: 'Tomorrow 11:00 AM', duration: '90 min', viewers: 0, enrolled: 740,
    tags: ['Kubernetes','Debugging','Observability','Helm'],
    overview: 'Vikram replays five real Kubernetes production incidents and walks through the exact kubectl commands, log analysis, and Prometheus queries used to diagnose and resolve each.',
    topics: ['CrashLoopBackOff: common causes & remedies','OOMKilled: tuning memory limits with VPA','Pod pending: taints, tolerations & node affinity','DNS resolution failures in multi-namespace setups','Prometheus + Grafana dashboards for incident response'],
    insights: ['80% of K8s production issues trace back to misconfigured resource requests/limits.','Always set liveness and readiness probes.','Use kubectl debug for distroless images you cannot exec into.'],
  },
  {
    title: 'Data Visualization with Plotly & Dash: Interactive Dashboards', instructor: 'Ananya Das', instructorInitial: 'AD',
    topic: 'datascience', topicLabel: 'Data Science', level: 'beginner', status: 'upcoming',
    startTime: 'Tomorrow 6:00 PM', duration: '75 min', viewers: 0, enrolled: 680,
    tags: ['Plotly','Dash','Python','Data Viz'],
    overview: 'Ananya builds a complete real-time analytics dashboard from scratch using Plotly Express and Dash, covering layout composition, callbacks, live data updates, and deploying to Heroku.',
    topics: ['Plotly Express vs Graph Objects','Dash layout: HTML & core components','Callbacks: linking inputs to chart outputs','Interval component for live polling','One-click deploy to Heroku'],
    insights: ['Plotly is the only Python viz library that outputs interactive HTML natively.','Use dcc.Store to share state between callbacks.','Reduce data on the server side via Pandas aggregation before sending to the browser.'],
  },
];

const USERS = [
  {
    name: 'Hari Ramachandran',
    email: 'hari.r@example.com',
    plan: 'pro',
    avatarSeed: 'learnflow',
    overallProgress: 68,
    inProgress: [
      { courseId: 'c1', emoji: '⚛️', title: 'React 19 & Next.js 15',       instructor: 'Priya Sharma', progress: 68 },
      { courseId: 'c4', emoji: '🤖', title: 'Generative AI & LLMs',         instructor: 'Rahul Kapoor', progress: 32 },
      { courseId: 'c5', emoji: '☁️',  title: 'Kubernetes & Docker on AWS',   instructor: 'Vikram Nair',  progress: 15 },
    ],
    certificates: [
      { emoji: '⚛️', title: 'React Advanced Patterns & Architecture',    instructor: 'Priya Sharma · LearnFlow', date: 'Issued 14 March 2026',   credentialId: 'LF-REACT-2026-84921' },
      { emoji: '📊', title: 'Python for Data Science — Complete Bootcamp', instructor: 'Arjun Mehta · LearnFlow',  date: 'Issued 2 January 2026', credentialId: 'LF-PDS-2026-31077' },
    ],
  },
];

// ── Seed function ────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Drop existing
    await Promise.all([
      Course.deleteMany({}),
      LiveSession.deleteMany({}),
      Domain.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log('🗑  Cleared existing collections');

    // Insert
    await Domain.insertMany(DOMAINS);
    console.log(`✅ Seeded ${DOMAINS.length} domains`);

    await Course.insertMany(COURSES);
    console.log(`✅ Seeded ${COURSES.length} courses`);

    await LiveSession.insertMany(LIVE_SESSIONS);
    console.log(`✅ Seeded ${LIVE_SESSIONS.length} live sessions`);

    await User.insertMany(USERS);
    console.log(`✅ Seeded ${USERS.length} user(s)`);

    console.log('\n🌱 Database seeded successfully!');
    console.log('   Open MongoDB Compass → mongodb://localhost:27017 → learnflow DB');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
