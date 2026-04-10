# LearnFlow 🚀

India's premier live & on-demand learning platform — built with **zero dependencies**, pure HTML, CSS, and vanilla JavaScript.

---

## 📁 Folder Structure

```
learnflow/
├── index.html          ← entry point (open this)
├── css/
│   ├── style.css       ← design system, tokens, global utilities
│   ├── header.css      ← header, search bar, profile dropdown
│   └── pages.css       ← all page layouts & components
├── js/
│   ├── data.js         ← all mock course/user/session data
│   └── app.js          ← all page logic & interactions
└── README.md           ← this file
```

---

## ⚡ Running Locally (VS Code — Recommended)

1. **Open the `learnflow/` folder** in VS Code  
   `File → Open Folder → select learnflow/`

2. **Install Live Server** (if not already installed)  
   `Ctrl+Shift+X` → search **"Live Server"** → Install

3. **Right-click `index.html`** in the Explorer panel  
   → **"Open with Live Server"**

4. The app opens at `http://127.0.0.1:5500` and **auto-reloads** on every save.

> **No npm, no build step, no dependencies.** It just works.

---

## ✨ Features

### 🏠 Home Page
| Feature | Details |
|---|---|
| **Hero section** | Animated gradient, floating cards, stats counter |
| **Trending Ticker** | Auto-scrolling marquee, pauses on hover |
| **Domain Selector** | 8 domains — click to filter recommended courses |
| **Recommended Courses** | 6 cards with ratings, pricing, discount badges |
| **Continue Learning** | 3 in-progress courses with progress bars |

### 📚 All Courses Page
| Feature | Details |
|---|---|
| **Expandable tree sidebar** | 8 domains × 3–4 subcategories with course counts |
| **Sidebar live search** | Filter tree nodes in real time |
| **Grid / List toggle** | Switch between card grid and horizontal list |
| **Sort options** | Popular · Newest · Highest Rated · Price Low–High |
| **12 mock courses** | With level pills, star ratings, badge labels |

### 🔴 Live Sessions Page
| Feature | Details |
|---|---|
| **Left filter panel** | Topic, level, and time-slot checkboxes |
| **Session cards** | Live / Upcoming status, viewers, tags, join button |
| **AI Summary sidebar** | Select any session → AI Overview + Key Topics + Instructor Insights |
| **6 mock sessions** | Covering Web Dev, AI/ML, Mobile, DevOps, Data Science |

### 🔍 Header Search
- Real-time dropdown across courses, live sessions, and domains
- Keyboard shortcut **⌘K / Ctrl+K** to focus
- **Esc** to dismiss

### 👤 Profile Dropdown
- User info, Pro plan badge, online indicator
- **Course progress bar** (68%)
- Links: My Learning · Certificates · Download Certificate · Settings · Log Out

### ⚙️ Settings Modal
| Setting | Options |
|---|---|
| **Theme** | 🌙 Dark · ☀️ Light |
| **Accent Colour** | Violet · Cyan · Rose · Amber |
| **Notifications** | Live reminders · New course alerts · Weekly digest |

### 🏅 Certificate Modal
- Lists earned certificates with credential IDs and issue dates
- **Download PDF** button (with toast confirmation)

### 🔔 Toast Notifications
- Success / Info / Error variants
- Auto-dismiss after 3.5 s with slide-out animation

---

## 🎨 Design System

### Themes
The app ships with a **dark theme** by default. Switch to light in Settings. The preference is saved to `localStorage`.

### Accent Colours
Four curated palettes — applied via `data-accent` on `<html>`:

| Accent | Primary | Gradient |
|---|---|---|
| **Violet** (default) | `hsl(263, 90%, 68%)` | Violet → Rose |
| **Cyan** | `hsl(186, 90%, 55%)` | Cyan → Blue |
| **Rose** | `hsl(349, 90%, 64%)` | Rose → Magenta |
| **Amber** | `hsl(43, 96%, 58%)` | Amber → Orange |

All accent colours are driven by CSS custom properties — changing `data-accent` instantly re-skins the entire UI.

### CSS Custom Properties (key tokens)

```css
--bg-base          /* page background   */
--bg-surface       /* card background   */
--bg-elevated      /* raised elements   */
--text-primary     /* headings & body   */
--text-secondary   /* subtitles & meta  */
--accent-1         /* primary colour    */
--accent-glow      /* glow / shadow     */
--gradient-hero    /* gradient string   */
```

---

## 🗂 Data Layer (`js/data.js`)

All data is plain JavaScript arrays — no API calls required.

| Export | Contents |
|---|---|
| `DOMAINS` | 8 learning domains with emoji & course count |
| `COURSES` | 12 courses with full metadata |
| `COURSE_TREE` | 8 categories × 3–4 subcategories for the sidebar |
| `LIVE_SESSIONS` | 6 sessions with AI overview, topics & insights |
| `TICKER_ITEMS` | 10 trending/news ticker items |
| `CONTINUE_COURSES` | 3 in-progress courses with progress % |
| `SEARCH_INDEX` | Pre-built flat index across courses + sessions + domains |
| `CERTIFICATES` | 2 earned certificates with credential IDs |

To add more courses, append an object to the `COURSES` array following the existing schema.

---

## 🧩 Extending the Project

### Add a new page
1. Add a `<section id="page-yourpage" class="page">` in `index.html`
2. Add a `<a data-page="yourpage">` nav link
3. `navigateTo('yourpage')` is handled automatically by `app.js`

### Add a new accent colour
1. In `style.css`, add a `[data-accent="yourname"] { ... }` block with the 6 token variables
2. In `index.html`, add an `.accent-swatch` button with `data-accent="yourname"`
3. Add the corresponding `.swatch-yourname` circle style

### Add a real backend
Replace the `COURSES` / `LIVE_SESSIONS` arrays with `fetch()` calls to your API. The render functions (`buildCoursesDisplay`, `buildLiveSessions`, etc.) accept any array matching the schema.

---

## 🌐 Browser Support

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 15+ | ✅ Full |
| Edge 90+ | ✅ Full |
| IE 11 | ❌ Not supported |

---

## 📄 License

MIT — free to use, modify, and distribute.

---

*Made with ❤️ in Bengaluru, India · LearnFlow Technologies Pvt. Ltd. © 2026*
