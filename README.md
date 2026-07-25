# WinIt Media

The official website for [WinIt Media](https://winitmedia.com) — a brand storytelling and influencer marketing agency based in New Delhi, India.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS 4
- **Backend:** Firebase (Firestore)
- **Media:** Cloudinary
- **Animations:** Framer Motion, Lenis (smooth scroll)
- **Rich Text:** Tiptap Editor
- **Email:** Nodemailer (cPanel SMTP)

## Features

- **Blog System** — Create, edit, and publish blogs via admin panel with Tiptap rich text editor
- **Admin Panel** — Firebase-authenticated dashboard for managing content and blogs
- **Contact Form** — Server-side validated form with rate limiting and email notifications
- **Brand Showcase** — Animated brand marquee and portfolio carousel
- **Testimonials** — Client testimonial slider
- **Video Section** — Embedded video showcase
- **SEO** — Sitemap, robots.txt, OpenGraph, JSON-LD structured data
- **Blog Subdomain** — Rewrites `blog.acaditya10.tech` to `/admin/blogs`
- **Dark Mode** — System-preference-based dark mode support
- **Responsive** — Mobile-first design with iOS-specific handling
- **PWA** — Web manifest with Apple Web App support

## Project Structure

```
├── app/
│   ├── admin/          # Admin panel
│   ├── api/            # API routes (admin, cloudinary, contact)
│   ├── blogs/          # Blog pages
│   └── components/     # App-level components
├── components/         # Shared UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities, Firebase config, helpers
├── fonts/              # Local fonts (Clash Display)
└── public/             # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Firestore enabled
- Cloudinary account
- SMTP server (cPanel or similar)

### Installation

```bash
git clone https://github.com/winit-media/winit.git
cd winit
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase (Admin)
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# SMTP
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# Contact Form
ADMIN_EMAIL=

# Blog Subdomain (optional)
BLOG_DOMAIN=
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production

```bash
npm run build
npm start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## License

Private — WinIt Media
