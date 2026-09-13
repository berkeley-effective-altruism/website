# CLAUDE.md

Shared instructions for anyone (human or AI) working on this codebase. This is
**living documentation** — when something below goes stale (deployment setup
changes, new pages get added, tech stack changes), update this file as part of
that same piece of work. Don't let it drift.

## What this is

The website for the **Berkeley Effective Altruism (EA)** club, replacing an
old Squarespace site. Audience is primarily:

- **Prospective members** — UC Berkeley students discovering EA for the first
  time, looking for what the club does, how to get involved, and what
  fellowships/programs are running.
- **Current members** — looking for event info, fellowship details, and
  contact/logistics.
- **Club organizers** — who need to keep content (events, fellowship cohorts,
  officer contacts) up to date with minimal friction.

The site is maintained by student officers, and by design **ownership rotates
as people graduate**. See "Ownership & access" below — this shapes several
of the decisions in this file (e.g. hosting under the org, not a personal
account).

## Tech stack

Plain **static HTML/CSS/JS**. No framework, no build step, no bundler, no
package.json — deliberately.

Why: the people maintaining this site turn over every 1-2 years as officers
graduate, and not every future maintainer will be a web developer. A framework
or build pipeline adds a learning curve and a maintenance burden (dependency
updates, breaking changes, someone needs to know how to run `npm install`)
that isn't worth it for a small club site that's mostly static content pages.
Anyone who can edit HTML/CSS can maintain this site.

If a real need comes up for something dynamic (see "Planned features" below),
evaluate it at that point — don't add tooling preemptively.

## Folder structure

```
/
├── CLAUDE.md          # this file
├── README.md
├── index.html         # home page
├── about.html         # about the club
├── fellowship.html    # fellowship program info
├── events.html        # events page
├── favicon.png        # browser tab icon (from the club logo)
├── css/
│   └── style.css       # shared site styles
├── js/
│   └── main.js          # shared site behavior (nav toggle, etc.)
└── assets/
    └── images/          # logos, photos, icons
        ├── logo.png       # header logo (optimized/resized from source art)
        ├── ea-og-image-1200x650.png  # social share preview image
        └── events/        # past-event photos shown on events.html
```

Images should be resized/compressed for web before committing (nothing multi-megabyte) —
source/original art files don't need to live in this repo.

**Where content/copy lives:** directly inside each page's HTML file, in the
main content area (look for `<main>`). There is currently no CMS or separate
content/data layer — copy is edited in place in the HTML. If the amount of
content or the frequency of edits ever makes that painful, consider a simple
data-driven approach (e.g. a JSON/YAML file of events rendered via a small
script) rather than jumping straight to a framework.

## Previewing locally

No build step is required — you can open the HTML files directly in a
browser. For a more accurate preview (relative paths, etc.), serve the
directory locally instead of using `file://`:

```bash
# from the repo root, using Python (usually preinstalled)
python -m http.server 8000
# then visit http://localhost:8000
```

Or with Node, if installed:

```bash
npx serve .
```

Always preview changes locally before pushing, especially layout/nav changes
that touch multiple pages.

## Deployment

Deployed via **GitHub Pages**, building from the `main` branch. Pushing to
`main` publishes directly — there is no staging environment, so preview
locally first.

**Live at https://eaberkeley.com.** The custom domain is connected via the
`CNAME` file in the repo root (contents: `eaberkeley.com`), which GitHub Pages
reads on each build. Don't delete or rename that file — removing it drops the
custom domain and the site reverts to the default `github.io` address.

Note that absolute URLs elsewhere in the repo (the Open Graph `og:image` and
`og:url` tags in each page's `<head>`) hardcode `https://eaberkeley.com`. If the
domain ever changes, those need updating too — social link previews break
silently otherwise, with no visible error on the site itself.

**Still undocumented:** which DNS provider the domain is registered with, and
who holds the account. A future maintainer will need this if the domain has to
be moved or renewed. Whoever knows: please add it here.

## Planned features (roadmap, not yet built)

- **Coffee chat scheduler** — ~~a way for prospective/current members to
  book time with organizers~~ resolved without custom build-out: each
  organizer links their own external scheduler (Calendly / Notion Calendar)
  from the Organizers section on `about.html`. Not every organizer has
  provided a link yet — see the placeholder note there. If this ever needs
  to become more uniform (one shared booking flow, a single link to share),
  revisit as a real feature; for now the per-person external links are
  sufficient and require no backend.

- **Organizer tabling availability calendar** — lets organizers indicate
  availability to table for the club, with simple login (officers only, not
  public signup). Still not built — don't be surprised if you're asked to
  build toward this.

This involves dynamic/stateful behavior (auth, scheduling, storage) that
plain static HTML can't provide alone. When picked up, evaluate the
lightest-weight approach that fits (e.g. an external scheduling tool embed,
or a small backend/serverless function) rather than defaulting to a full
framework rewrite of the whole site.

## Fellowship interest capture & reminder automation

When a fellowship cohort's application deadline passes, `fellowship.html`
switches from soliciting applications to capturing lightweight "interest"
from people who missed the deadline, via a **dedicated Google Form** (kept
separate from the sitewide "Interest Form" used elsewhere, so people who
missed a deadline don't get mixed into the general interest list — otherwise
there'd be no clean way to tell who actually applied to a cohort apart from
who just found out too late).

Two reminder emails run off that Form's response Sheet, and **both go to the
organizer only** — this is not a mass-emailer. The Form/Sheet is just a
holding pen; nothing here emails the people on the list automatically. The
organizer reaches out to them personally, in their own words, using the list
these reminders point to:

1. **Review-the-list reminder** — once, at the start of spring semester:
   how many people are on the interest list, with a link to go look.
2. **Crash Course nudge** — once, one week before the club's "Crash Course"
   event: a reminder plus the current list (names + emails), so the
   organizer can personally invite them as a lower-commitment alternative to
   the fellowship they missed.

Runs on **Google Sheets + a Sheet-bound Apps Script** (not custom code in
this repo, not Mailchimp) — no new account or tool for a future
non-developer maintainer to learn:

- The Form lives in the club's Google Drive; its Responses > "Create
  Spreadsheet" creates the linked response Sheet (currently titled "EA
  Berkeley Fellowship Interest (Responses)").
- The Apps Script ("Fellowship Interest Reminders") is **bound to that
  Sheet** (Extensions > Apps Script from the Sheet), so it travels with it.
- Two time-driven triggers (installed once via a `createTriggers()`
  function in the script) fire the two emails above. **Both trigger dates
  are named constants at the top of the script and need updating every
  year** — spring start date changes annually, and the crash-course date
  needs to match whatever date that event is actually scheduled each
  semester. Nothing reminds you to update these.
- The organizer's recipient address is also a named constant
  (`ORGANIZER_EMAIL`) at the top of the script, next to the two dates — easy
  to swap without touching the rest of the logic.
- First run of the script requires a one-time Google OAuth consent click
  from whoever has access to the organizing account.

**Status as of this writing:** the Form, Sheet, and Script are all built,
both reminder functions have been manually tested (each sends a working
email to the organizer), the Form is **published and live**, and its real
URL is wired into `fellowship.html`'s "Missed the deadline?" card. The
`SPRING_REMINDER_DATE` constant in the script is still a placeholder —
confirm the real UC Berkeley spring 2027 start date and update it before
that trigger matters.

None of this lives in this git repo — the Form, Sheet, and Script live in
Google Drive under the club's account. `fellowship.html` only links out to
the Form and mentions the Crash Course date in copy.

## Ownership & access

This site is a club asset, not any one person's project. Concretely:

- The GitHub repo lives under the **EA Berkeley club org**, not a personal
  account.
- Maintainers (current officers) should be added as **GitHub org Owners**,
  not given shared/shared-personal logins. This keeps access auditable and
  makes it easy to remove access when someone graduates or steps down,
  without needing to rotate a shared password.
- When officers rotate: update org membership, and skim this file for
  anything that's gone stale (deployment status, roadmap items that got
  built, folder structure changes).
