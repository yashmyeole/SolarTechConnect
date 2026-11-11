# Solar Tech Connect — web frontend

The professional network for the solar trades: professionals find work and keep in touch with crews, verified employers hire, and training partners list courses. This repository is the React frontend, built from the approved prototype. All data is sample data kept in the browser, so every page works without a backend.

## Requirements

- Node.js 22.22 or newer
- npm 10 or newer

## Getting started

```bash
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).

| Script            | What it does                                 |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Development server with hot reload           |
| `npm run build`   | Production build into `dist/`                |
| `npm run preview` | Serves the production build locally          |
| `npm run lint`    | ESLint (React Hooks and React Refresh rules) |
| `npm run format`  | Prettier over the whole project              |

## Trying the demo

Two sample accounts are ready on the **Sign in** page, each with a one-click button:

| Account                     | Email                      | Password    |
| --------------------------- | -------------------------- | ----------- |
| Maria Alvarez, professional | `maria@example.com`        | `Demo#2026` |
| Aisha Rahman, employer      | `aisha@prairiesun.example` | `Demo#2026` |

- Typing any other email on Sign in opens sign-up with that email filled in.
- **Join** offers one-click demo sign-up for both account types, and every sign-up step has **Fill with demo details**.
- Employer sign-up runs the business check from the work email: a company domain passes, a free email provider (Gmail, Outlook and so on) goes to review.
- Signed in, the **Demo** menu (bottom of the side menu, or **You** on phones) switches between the two accounts, sets the employer's business check to verified or in review, and resets all sample data.

Changes you make (applications, messages, posts, settings, new accounts) are saved in the browser's local storage under `solar-tech-connect-demo`. **Reset demo data** restores the starting state.

To build without the demo tools (no Demo menu, demo account list or fill buttons):

```bash
VITE_DEMO_MODE=false npm run build
```

## Stack

- **React 19** with **Vite**
- **React Router** (data router, lazy-loaded pages)
- **Zustand** for app state, persisted to local storage
- **three.js** for the landing page's 3D solar day, loaded only on that page
- **CSS Modules** with shared design tokens; Source Sans 3 and Instrument Sans via Fontsource
- Native `<dialog>` and the Popover API for dialogs, menus and toasts

## Project structure

```
src/
  main.jsx            App entry: fonts, global styles, router
  router.jsx          Every route, guards and lazy pages
  config.js           Demo mode flag and keyboard shortcut label
  styles/             Design tokens, base reset, layout and text utilities
  components/         Shared UI: buttons, cards, fields, dialogs, menus, lists, split view
  layouts/            Public site layout, signed-in app layout, navigation, route guards
  data/               Sample jobs, companies, people, posts, messages, employer data
  store/              Zustand store, initial state and slices (account, jobs, network, messaging, employer)
  lib/                Formatting, validation, form hook and small helpers
  features/
    landing/          Landing page; scene/ holds the three.js world, shaders and camera keyframes
    auth/             Sign in, Join and the step-by-step sign-up flows
    home/             Professional home
    jobs/             Job search, job detail, apply, saved jobs and applications
    profile/          Own profile, member profiles and their edit dialogs
    people/           Suggestions, contact requests, contacts and following
    messages/         Conversations
    notifications/    Notifications
    community/        Groups, events and courses
    companies/        Company directory and company pages
    employer/         Employer overview, jobs, post a job, candidates and talent search
    settings/         Account, sign-in, privacy, notifications, company and team settings
    feed/             Updates, replies and the update composer
    search/           Site search (Ctrl K or ⌘ K)
    directory/        Lookups and links for members and companies
    demo/             Demo menu actions
    help/, errors/    Help center, not-found and error pages
```

## Routes

| Path                                                                                                     | Who           |
| -------------------------------------------------------------------------------------------------------- | ------------- |
| `/`                                                                                                      | Visitors      |
| `/signin`, `/join`, `/join/professional`, `/join/employer`                                               | Visitors      |
| `/jobs/:jobId?`, `/companies`, `/companies/:companyId/:tab?`, `/community/:tab?`, `/help`                | Everyone      |
| `/home`, `/jobs/saved`, `/jobs/applied`, `/profile`, `/people/:tab?`                                     | Professionals |
| `/members/:memberId`, `/messages/:threadId?`, `/notifications`, `/settings/:section?`                    | Signed in     |
| `/employer`, `/employer/jobs/:status?`, `/employer/jobs/new`, `/employer/candidates`, `/employer/talent` | Employers     |

Signed-out visitors who open a signed-in page go to Sign in and come back to that page afterwards.

## Deploying

The build is a static single-page app. Configure the host to serve `index.html` for every path that isn't a file (for example a `/* /index.html 200` rewrite on Netlify, or `try_files $uri /index.html;` on nginx).

## Landing page footage

The four training shots in the landing page's pathway section are drawn live in 3D. To use real footage instead, set `video` on the matching step in `src/features/landing/landingContent.js` to the video's URL; the scene swaps the shot for the footage when it's set.
