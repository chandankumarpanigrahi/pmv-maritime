# PMV Maritime Solutions (Pinnacle Marine Ventures)

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.5-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Enabled-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://turbo.build/pack)
[![Production](https://img.shields.io/badge/Live-pmvmaritime.com-007BA7?style=for-the-badge&logo=safari&logoColor=white)](https://pmvmaritime.com)

> Official web platform for **Pinnacle Marine Ventures (PMV)**, operating as **PMV Maritime Solutions**. A modern, full-stack enterprise web application delivering integrated marine & vessel services, technical management, crewing, shipbuilding, port operations, and marine consultancy worldwide.

---
<img width="1439" height="962" alt="image" src="https://github.com/user-attachments/assets/c681e1dd-f39b-4ed6-b51d-3ef6941e6000" />
---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Client-Facing Web Application](#client-facing-web-application)
  - [Executive Admin Suite & CMS](#executive-admin-suite--cms)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [API Architecture](#-api-architecture)
- [Deployment](#-deployment)
- [Security & Performance](#-security--performance)
- [Contact & Support](#-contact--support)

---

## 🌊 Overview

**PMV Maritime Solutions** is a global maritime partner connecting seafaring heritage with digital innovation. The platform provides shipowners, charterers, port operators, and maritime institutions with direct access to comprehensive maritime solutions:

- **Marine Consultancy & Advisory**: Expert technical audits, vessel surveys, condition assessments, and pre-purchase inspections.
- **Vessel & Fleet Management**: Turnkey technical oversight, planned maintenance, dry-docking support, and regulatory compliance (ISM/ISPS/MLC).
- **Crew Management & Manning**: Global seafarer recruitment, STCW certification verification, training, and crew welfare.
- **Offshore & Port Operations**: Dynamic positioning (DP) advisory, marine warranty surveys, vessel chartering, and offshore project support.
- **Maritime Training & Simulation**: Modern learning programs, simulator training, and skill development for future-ready mariners.

The web platform is designed to provide high-speed performance, search engine optimization (SEO), enterprise-grade security, and a fully featured administrative content management system (CMS).

---

## ✨ Key Features

### Client-Facing Web Application

- **Dynamic Homepage**:
  - Interactive hero banner with animated statistics, call-to-action triggers, and fluid typography.
  - Interactive service explorer with animated tabbed views and icon matrices.
  - Infinite client & accreditation logo carousel.
  - Featured projects showcase with instant category filters.
  - Multi-channel contact and inquiry drawer.

- **Executive Team & Leadership Showcase**:
  - Interactive leadership roster with custom studio cutout portrait presentation.
  - Smooth bottom-dissolve gradient integration eliminating torso cutoffs.
  - Responsive executive bio modal featuring direct LinkedIn and email connect buttons, professional background narratives, and structured core competency matrices.
  - Mobile-optimized single-scroll modal interaction.

<!-- ================================================================= -->
<!-- [SCREENSHOT PLACEHOLDER: Paste Team Modal / About Preview Here]   -->
<!-- Example: ![Team Modal Preview](public/assets/images/readme/team-modal.png) -->
<!-- ================================================================= -->

- **Comprehensive Services Hub (`/services`)**:
  - Dynamic routing with dedicated slug pages (`/services/[slug]`) for each maritime vertical.
  - Tabbed overview with automated icon resolution, benefit matrices, and structured inquiry forms.
  - 301 legacy redirect map ensuring zero broken links during routing updates.

- **Project Portfolio & Case Studies (`/projects`)**:
  - Rich project galleries detailing technical challenges, solutions, and operational outcomes.
  - Dynamic single project views (`/projects/[slug]`).

- **Interactive Inquiry & Career Portals (`/contact`, `/careers`)**:
  - Real-time client inquiry forms with instant email dispatch and database persistence.
  - Career application engine with document handling and status workflows.

- **Progressive Web App (PWA) & Accessibility**:
  - Offline capability with custom Service Worker (`/sw.js`) and web app manifest (`/manifest.webmanifest`).
  - Full screen reader compatibility, semantic HTML5 structure, and fluid responsive design across mobile, tablet, and ultra-wide displays.

---

### Executive Admin Suite & CMS

A private, secure administrative interface located at `/admin` that provides complete control over platform content and operations:

<!-- ================================================================= -->
<!-- [SCREENSHOT PLACEHOLDER: Paste Admin Dashboard Image Here]        -->
<!-- Example: ![Admin Dashboard](public/assets/images/readme/admin-dashboard.png) -->
<!-- ================================================================= -->

- **Enterprise Authentication & Access Control**:
  - Bcrypt-based cryptographic password hashing.
  - Role-Based Access Control (RBAC) with granular user permissions.
  - Brute-force protection, failed attempt tracking, and automatic temporary IP/account lockout.
  - Two-step password reset workflow utilizing time-sensitive OTP tokens and automated transactional emails.
  - Active session monitor with one-click remote session termination.

- **Content & Service Management**:
  - Full CRUD operations for published services and engineering projects.
  - Direct Cloudinary integration for instant image optimization, uploads, and media management.
  - Automatic URL slug generation, preview modes, and publication status toggles.

- **Submissions & Leads Hub**:
  - Unified inbox for all contact queries, service quote requests, and job applications.
  - Mark-as-read, archive, and follow-up tracking states.

- **System Health & Maintenance Master**:
  - Real-time system diagnostics and notification drawer.
  - Global Maintenance Mode toggle with secure admin cookie bypass tokens (`maintenance_bypass`).

---

## 🛠 Technology Stack

| Category | Technologies / Libraries |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack Bundler, Server Actions, API Handlers) |
| **Frontend Core** | [React 19](https://react.dev/), JavaScript (ES2024), Node.js (>=20) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/), PostCSS 8, CSS Modules, Modern Typography (Oswald & Nunito Sans via `next/font/google`) |
| **Animations & FX** | [Motion](https://motion.dev/) (Framer Motion), [Lenis](https://lenis.darkroom.engineering/) (Smooth Scroll), [Driver.js](https://driverjs.com/) (Guided Tours) |
| **Database** | [MongoDB](https://www.mongodb.com/) (Native MongoDB Node Driver 7.5) |
| **Media & Storage** | [Cloudinary SDK](https://cloudinary.com/) (Cloud Storage & On-the-Fly Image Optimization) |
| **Email & Comms** | [Nodemailer 10](https://nodemailer.com/) (SMTP Connection Pooling, HTML Templates, Secure OTP Dispatch) |
| **Icons & UI** | [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/), Base UI |
| **Security & Auth** | [bcryptjs](https://www.npmjs.com/package/bcryptjs), Native Web Crypto API, HttpOnly Session Cookies |

---

## 📁 Project Architecture

```plaintext
pmv-maritime/
├── public/                       # Static public assets
│   ├── assets/
│   │   ├── images/               # Banners, backgrounds, and brand imagery
│   │   └── members/              # Executive team cutout portraits
│   ├── icons/                    # PWA launcher icons (192x192, 512x512)
│   ├── favicon.ico
│   └── manifest.webmanifest      # Progressive Web App manifest
├── src/
│   ├── app/                      # Next.js App Router (pages & API endpoints)
│   │   ├── about/                # About Us & Executive Team page
│   │   ├── admin/                # Secure Admin Portal (Dashboard, CMS, Users, Master)
│   │   ├── api/                  # Backend REST endpoints (Auth, CMS, Media, Mail, Users)
│   │   │   ├── auth/             # Login, forgot-password, reset-password handlers
│   │   │   ├── cloudinary/       # Media asset upload endpoint
│   │   │   ├── notifications/    # Admin notification handlers
│   │   │   ├── projects/         # Projects CRUD API
│   │   │   ├── services/         # Services CRUD API
│   │   │   ├── sessions/         # Session monitoring & termination API
│   │   │   ├── settings/         # Maintenance mode toggle API
│   │   │   └── users/            # RBAC user management & credential dispatch
│   │   ├── careers/              # Career recruitment page
│   │   ├── contact/              # Contact us page
│   │   ├── projects/             # Projects directory & [slug] routes
│   │   ├── services/             # Services directory & [slug] routes
│   │   ├── sitemap/              # Visual site directory
│   │   ├── globals.css           # Global stylesheet & Tailwind CSS v4 variables
│   │   ├── layout.js             # Root application shell, fonts, SEO & JSON-LD
│   │   └── page.js               # Homepage composition
│   ├── components/               # Modular UI Components
│   │   ├── About/                # Homepage about preview
│   │   ├── admin/                # Admin drawers, navigation, and modals
│   │   ├── Contact Us/           # Universal contact form & CTA
│   │   ├── CTA/                  # Call-to-action sections
│   │   ├── Footer/               # Global maritime footer with legal links
│   │   ├── Header/               # Navigation bar with responsive drawer
│   │   ├── Hero/                 # Homepage hero banner & animated stats
│   │   ├── Logo Scroll/          # Infinite partner logo ticker
│   │   ├── Maintenance/          # Global maintenance mode splash page
│   │   └── Projects Section/     # Project cards & slider
│   └── lib/                      # Core business logic & utility modules
│       ├── authCrypto.js         # Cryptographic hashing & token verification
│       ├── db.js                 # MongoDB connection manager & connection pooling
│       ├── maintenance.js        # Maintenance status & bypass cookie verification
│       ├── maritimeIcons.js      # Maritime icon registry and helper resolvers
│       ├── nodemailer.js         # SMTP transporter pool & email dispatcher
│       └── permissions.js        # RBAC role matrix and page route authorization
├── next.config.mjs               # Next.js configuration & 301 redirects
├── eslint.config.mjs             # ESLint 9 flat configuration
├── package.json                  # Dependencies & execution scripts
└── README.md                     # Project documentation
```


## 🌐 Deployment

### Deploying to Netlify / Vercel

1. **Push your repository** to GitHub, GitLab, or Bitbucket.
2. **Import the repository** into your hosting dashboard (e.g., Netlify or Vercel).
3. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next` (or default)
4. **Environment Variables**: Add all variables defined in `.env.local` to the hosting provider's Environment Variables console.
5. **Peer Dependencies Configuration**:
   The repository includes a `.npmrc` file with `legacy-peer-deps=true` to guarantee deterministic dependency installs across cloud build containers.

---

## 🔒 Security & Performance

- **Turbopack Build Optimization**: Lightning-fast incremental compilation and optimized client-side hydration.
- **Dynamic Asset Optimization**: Cloudinary CDN and Next.js Image Optimization ensure crisp WebP/AVIF images at minimum payload size.
- **Header Security**: Strict caching headers for PWA service workers (`/sw.js`) and no-store rules for sensitive administration APIs.
- **Rate-Limiting & Cryptography**: Protection against brute-force attacks on admin authentication, password reset requests, and contact form spam.
- **SEO & Structured Data**: Built-in JSON-LD schemas (`Organization`, `WebSite`, `Service`) ensuring maximum indexing visibility across Google and Bing.

---

## 📞 Contact & Support

**Pinnacle Marine Ventures (PMV Maritime Solutions)**  
- 🌐 **Website**: [pmvmaritime.com](https://pmvmaritime.com)  
- ✉️ **Inquiries**: [info@pmvmaritime.com](mailto:info@pmvmaritime.com)  
- 💼 **LinkedIn**: [PMV Maritime Solutions](https://www.linkedin.com/company/pmv-maritime-solutions)

---

*Copyright © 2026 Pinnacle Marine Ventures. All rights reserved.*
