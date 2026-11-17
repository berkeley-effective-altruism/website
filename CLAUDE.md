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
├── 404.html           # shown by GitHub Pages for any URL that doesn't exist
│                      #   (its local links start with "/" since it can
│                      #   appear at any path depth)
├── CNAME              # custom domain for GitHub Pages; see "Deployment"
├── robots.txt         # points search engines at sitemap.xml
├── sitemap.xml        # list of the real pages; add an entry per new page
├── slack/index.html   # redirect -> Slack invite (see "Redirects" below)
├── <old-path>/index.html  # 14 more one-file redirect folders for legacy
│                      #   Squarespace URLs (fellowships/, contact/, board/, ...);
│                      #   full list + rationale in "Redirects" below
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

## Redirects

**If you're wondering why the repo root is full of tiny folders like
`fellowships/`, `contact/`, `board/`: they're redirects, not pages. Don't
delete them as clutter, and don't "fix" them into real pages.**

**Why they exist.** This site replaced an old Squarespace site. The old URLs
stopped working, but links to them are likely still out on the internet (old
emails, flyers, Slack messages, other sites) and would land on a GitHub Pages
404. In October 2026, using Claude Code, we found which old
`eaberkeley.com/<path>` URLs existed by querying the Internet Archive's
Wayback Machine CDX index (`https://web.archive.org/cdx/search/cdx?url=eaberkeley.com/*&output=txt&fl=original,statuscode&collapse=urlkey`),
checked which of those 404'd on the live site, and added a redirect for each
one that has an obvious home on the new site. (Plain web search can't do this —
it ignores `site:` operators and doesn't expose inbound links; the Wayback CDX
index is what worked.)

**How they work.** GitHub Pages can't send real HTTP redirects, so each
redirect is `<path>/index.html` containing a meta-refresh, a JS
`location.replace` fallback, a `canonical` link, and `noindex`. Every file has a
header comment explaining all of this. `eaberkeley.com/<path>` (no trailing
slash) gets a 301 to `/<path>/` from Pages, then the page forwards.

| Old path(s) | Goes to |
|---|---|
| `/slack` | the club's Slack invite (**external** URL; if the invite expires, update `slack/index.html` *and* the page footers — grep `join.slack.com`) |
| `/fellowships`, `/readinggroups`, `/get-involved`, `/take-action` | `/fellowship.html` |
| `/home` | `/index.html` |
| `/what-we-do`, `/about-1`, `/board`, `/faqs`, `/contact`, `/feedback` | `/about.html` |
| `/calendar-1`, `/fun-photos`, `/projects` | `/events.html` |

The target for each is a judgment call based on the old page's name (we only
had URLs, not the old content) — retarget freely if a better home exists.

**Intentionally NOT redirected** (existed on the old site, no equivalent on the
new one, so they still 404): the contest/AIMS pages (`/aims-directory`,
`/aims-distillation`, `/aims-mini-elk`, `/aims-contest-series`, `/contests`,
`/distillation-contest-winners`, `/past-winners`, `/global-warning-contest`,
`/good-futures-initiative`, `/workflows`, `/edit-your-own-source-code`) and
`/decal`. These appear to have been a separate project that shared the domain.
If one of them turns out to matter, add a redirect folder the same way, or
build a real page.

**Adding or removing one.** Copy any redirect folder (e.g. `board/`), rename the
folder to the old path, change the target in all four places in the file, and
add a row above. To retire one, delete the folder and its row. Remember to
preview locally and push — new folders are published on push to `main` like
everything else.

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

**Domain registration and DNS: Squarespace.** `eaberkeley.com` is registered
with Squarespace Domains (left over from the old Squarespace site), and its
DNS records are managed there too. The domain belongs to whichever Squarespace
account it sits in, and the club officers share that login. To change DNS or
check renewal: log in to Squarespace > Domains > `eaberkeley.com`.

- **Renewal:** the registration runs to **July 16, 2027** and has renewed
  each July so far (public registry record, checked November 2026). If it
  lapses, the whole site goes down. Each year, confirm that auto-renew is on
  and that the payment card on the Squarespace account still works; a
  graduated officer's expired card is the likely way this breaks.
- **Handover:** the Squarespace login is the one piece of this site that is
  not covered by GitHub org membership. When officers rotate, pass it on
  deliberately and make sure the account's email address is one the club
  still controls (password resets and renewal warnings go there).
- **Still undocumented:** which email address the Squarespace account is
  under, and whose card pays for the domain. Whoever knows: please add it
  here (not the password).
- The DNS records point the domain at GitHub Pages (four `185.199.x.153`
  A records). They only need touching if the site moves off GitHub Pages.

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

## Mailing list signup (Mailchimp)

The site's main call to action is a **mailing list signup** that posts
straight to the club's **Mailchimp** audience. It replaced the old sitewide
Google "Interest Form" in November 2026 (that Form is no longer linked from
any page).

- The form is a small hand-written `<form class="signup">` (email field +
  Subscribe button), styled in `css/style.css`. We deliberately did **not**
  paste Mailchimp's full embed code, which pulls in its own stylesheet,
  jQuery, and a large script we don't need.
- It appears in four places and they must be kept identical: `index.html`
  (hero and the "Get connected" card), `about.html` ("Get involved" card),
  and `events.html` ("Stay in the loop"). Grep `class="signup"` to find them.
- Two values come from Mailchimp and are specific to the club's audience: the
  form's `action` URL and the `name` of the hidden spam-trap input
  (`b_<u>_<id>`). If the club ever switches Mailchimp audience or account,
  get the new embed code from Mailchimp (Forms > Embedded form; the menu
  location changes from time to time, so search Mailchimp for "embedded
  form"), copy those two values out of it, and update all four forms.
- Submitting opens Mailchimp's own confirmation page in a new tab. There is
  no JavaScript on our side.
- Only the email address is collected. To collect a name too, enable the
  field in Mailchimp and add a matching input (e.g. `name="FNAME"`).

## Fellowship interest capture & reminder automation

When a fellowship cohort's application deadline passes, `fellowship.html`
switches from soliciting applications to capturing lightweight "interest"
from people who missed the deadline, via a **dedicated Google Form** (kept
separate from the general mailing list signup, so people who
missed a deadline don't get mixed into the general interest list — otherwise
there'd be no clean way to tell who actually applied to a cohort apart from
who just found out too late).

Two reminder emails run off that Form's response Sheet, and **both go to the
organizer only, CC'd to two other officers** (the `CC_EMAILS` constant in the
script) — this is not a mass-emailer. The Form/Sheet is just a
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
- The organizer's recipient address (`ORGANIZER_EMAIL`) and the CC list
  (`CC_EMAILS`, comma-separated) are also named constants at the top of the
  script, next to the dates — easy to swap without touching the rest of the
  logic.
- First run of the script requires a one-time Google OAuth consent click
  from whoever has access to the organizing account.

**Status as of this writing:** the Form, Sheet, and Script are all built,
both reminder functions have been manually tested (each sends a working
email to the organizer), and the Form is **published and live**. During
October 2026 the "Missed the deadline?" button on `fellowship.html` (and a
homepage callout) pointed to the Crash Course Luma page instead, so the Sheet
has a gap for that period. In November 2026, after the Crash Course (October
24th) had passed, the Crash Course mentions were removed from the site and
the button was pointed back at the Form. The Crash Course nudge email in the
script still exists; its date constant needs a new date (or the trigger
removing) if the event isn't run again. The
`SPRING_REMINDER_DATE` constant in the script is still a placeholder —
confirm the real UC Berkeley spring 2027 start date and update it before
that trigger matters.

None of this lives in this git repo — the Form, Sheet, and Script live in
Google Drive under the club's account. `fellowship.html` only links out to
the Form.

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
