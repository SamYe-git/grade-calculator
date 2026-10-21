# Design

The look comes from `option-a.html`: an editorial direction that looks like a printed page. It uses heavy type, thick black rules, square corners, and no cards or shadows.

## Why it fits a GPA calculator

- **The numbers are the point.** Students open the tool to see their cumulative GPA first and this semester's GPA second. Editorial layouts make one figure huge and everything else quiet, so the cumulative GPA reads first, from across a room.
- **It looks like a record.** A transcript is a printed document with rules and columns. A paper background and black rules make the course list read like a transcript, which helps students trust the numbers.
- **Few colors make errors stand out.** The page is black on paper, so the one accent color only ever means "fix this". A student can't miss a bad credit value.
- **Nothing to learn.** Fields are plain underlines, buttons are black blocks, and the sections run in order from top to bottom. There are no tabs, cards or menus.

## The `:root` values

These live in `css/styles.css`. Every other value in the CSS is built from them. The first six are the base; the rest were added for round 1.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#f6f3ec` | Neutral 1. Page background, and the text color on black buttons. |
| `--ink` | `#111111` | Neutral 2. All text, rules, field underlines and buttons. Lighter text and thin row lines use `--ink` at lower opacity instead of new colors. |
| `--accent` | `#c8102e` | The only color. Used for errors only: the message text and the underline of the field it is about. |
| `--font` | `"Helvetica Neue", Helvetica, Arial, sans-serif` | One font family. Hierarchy comes from size, weight (400 to 900) and all caps, not from a second font. |
| `--space` | `8px` | The spacing step. Every margin, padding and gap is a multiple of it: 8, 16, 24, 32, 48, 96. |
| `--radius` | `0` | Square corners on everything: inputs, buttons and the page itself. |
| `--ink-muted` | `--ink` at 60% | Secondary text: table headings, GPA notes, the "not in GPA" mark. |
| `--ink-faded` | `--ink` at 20% | The empty-state "—" and the thin line under each table row and between GPA rows. |
| `--rule-thick` | `6px` | The rule under the masthead. |
| `--rule` | `2px` | Field underlines, the rule under table headings, and the rule above each section heading. |
| `--rule-thin` | `1px` | Row lines, and the underline on Delete text buttons. |
| `--text-xs` | `12px` | All-caps labels: masthead, field labels, table headings, section headings, buttons. |
| `--text-s` | `15px` | GPA notes, error messages, the "not in GPA" mark. |
| `--text-m` | `18px` | Body text, field input text, course names on a phone. |
| `--text-l` | `22px` | Course names, the empty-state message. |
| `--text-xl` | `28px` | Grades in the course list, the Semester GPA label. |
| `--text-title` | `clamp(48px, 11vw, 132px)` | The page title. Shrinks with the screen width. |
| `--text-figure` | `clamp(48px, 12vw, 88px)` | The Semester GPA number and the empty-state "—" (about half the planned cumulative number). |
| `--weight-regular` | `400` | Body text, course names. |
| `--weight-bold` | `700` | Labels, notes in caps, text buttons. |
| `--weight-black` | `900` | Title, GPA labels and numbers, grades, black buttons. |
| `--leading` | `1.5` | Line height for body text. |
| `--leading-tight` | `0.9` | Line height for the title and big numbers. |
| `--tracking-caps` | `0.12em` | Letter spacing for all-caps labels. |
| `--tracking-tight` | `-0.04em` | Letter spacing for the title and big numbers. |
| `--page-width` | `960px` | Maximum width of the page content. |
| `--touch` | `44px` | Minimum height of every button and field. |
| `--breakpoint` | `640px` | Phone layout at this width and below. CSS can't read a custom property inside `@media`, so the media query repeats `640px` with a comment pointing to this token. |

## Top of the page

- **Masthead:** a small all-caps "Babson GPA" with a thick black rule below it.
- **Page title:** the term and year being worked on, such as "Fall 2026", in very large, heavy type. The term is always Winter, Spring, Summer or Fall, followed by a four-digit year. Until the student has picked both a term and a year, the title says "New semester". It changes as soon as both are picked.
- **Term and year:** a Term dropdown and a Year dropdown sit side by side right under the title and above the GPA figures, styled like the Add a course fields (all-caps label, plain underline). They are the only Term and Year fields on the page; Add to cumulative uses them.
- **GPA figures:** the two numbers are not the same size and do not sit side by side.
  - **Cumulative GPA** comes first, on one line: the words "Cumulative GPA" in large, heavy letters on the left, and the number on the right, larger still. A short note sits below, such as "Projected, 40 credits incl. this term".
  - **Semester GPA** sits below it, on its own line, in the same left-label, right-number layout but clearly smaller, about half the size of the cumulative. Its note reads, for example, "10 letter-graded credits".
  - A thin line separates the two rows.

## States

### Empty (first visit, or after Clear all data)

- The masthead, the title ("New semester"), the Term and Year dropdowns on "Choose…" and the Add a course form appear as usual.
- Where the course list would be, a large "—" in faded `--ink` sits above the message "No courses yet. Add your first course to see your semester GPA."
- Both GPA rows show "—" in place of the number, at their usual sizes, so the layout does not jump when the first course is added.
- My record shows the same "—" with "No saved semesters yet. Add courses, pick a term and year, then press Add to cumulative." Total credits show 0.

### Invalid input

- The message appears directly under the field it is about, in `--accent`, starting with "— ". Example: "— Credits must be a number greater than 0 and no more than 8."
- The field's underline turns `--accent`. No other part of the page changes color.
- The field gets `aria-invalid="true"` and `aria-describedby` pointing to the message, so screen readers read it.
- Nothing is saved, and the rest of the page keeps working. The message clears once the field is fixed.

### In use

- The cumulative GPA row leads in very large, heavy type (the number up to about 168px), with the smaller semester GPA row below it, as described in Top of the page.
- The course list is a table with a thick rule under the header and a thin line under each row. Course names are regular weight, grades are large and heavy, and each row ends with an underlined Delete text button.
- My record lists the saved semesters, newest first, in the same table style.

### After a reset

- The course list, the form fields and any error messages are cleared.
- This semester returns to its empty look: the "—" and the empty message. The semester GPA row shows "—". The cumulative GPA row shows "—" too, or the saved cumulative GPA if My record has semesters.
- The term-and-year title and the Term and Year dropdowns stay as they were.
- My record does not change.

## On a phone

- At 640px wide and below, the page padding drops to 16px on the sides, so nothing scrolls sideways.
- The term-and-year title shrinks with the screen width so "Summer 2026", the longest title, fits on one line.
- The GPA rows keep their label-left, number-right layout. Both labels and numbers shrink with the screen width, and the cumulative row stays clearly larger than the semester row. If "Cumulative GPA" can't fit beside the number, the label wraps onto two lines rather than pushing the number off the screen.
- The Add a course form goes from four columns to two: the course name takes a full row, credits and grade share a row, and the Add course button takes a full row.
- Course names drop to a smaller size so long names wrap cleanly. The table keeps its columns.
- Buttons and fields are at least 44px tall so they are easy to tap.
