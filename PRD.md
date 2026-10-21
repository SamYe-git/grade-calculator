# PRD: Babson GPA Calculator

## Goal

A one-page web tool where a Babson undergraduate logs their courses and sees their semester GPA, a preview of what their cumulative GPA would become, and their cumulative GPA across saved semesters. GPAs are worked out the way the Babson undergraduate catalog describes. Built with plain HTML, CSS and JavaScript, deployed on GitHub Pages, with data kept in `localStorage`. Due Thursday 10/22, 3:00 PM.

## Audience and key action

- **Who:** me, a Babson undergraduate tracking my GPA for grad school applications. Other Babson undergraduates are a secondary audience.
- **Key action:** log this semester's courses and see my semester GPA update right away.

## Features

Version 1 is a single page with two sections stacked top to bottom. On a phone they stack in the same order.

### 1. This semester

- **Term and year (top of the section):**
  - a Term dropdown (Winter, Spring, Summer, Fall) and a Year dropdown, both starting on "Choose…", right under the section title and above the semester GPA
  - the year range runs from 4 years before the current year to 1 year after it (2022 to 2027 in 2026)
  - the section title shows the chosen term and year, such as "Fall 2026", as soon as both are picked; until then it says "New semester"
  - these are the only Term and Year fields; Add to cumulative uses them
- **Add a course form:**
  - course name (text)
  - credits (number)
  - grade (dropdown starting on "Choose…")
  - an Add course button
- **Grade options:**
  - the 12 Babson undergraduate letter grades
  - two pass/fail options: "P (pass)" and "Fail (pass/fail course)"
- **Course list:**
  - each course shows its name, credits and grade, with a Delete button
  - P and Fail courses are marked "not in GPA"
  - Delete removes a course right away, with no confirmation
- **Semester GPA:** worked out again every time a course is added or deleted.
- **Cumulative preview line:** a small line right above the Add to cumulative button, such as "If you add this semester, your cumulative GPA becomes 3.67 (24 credits)." The GPA and credits are what My record would show if this semester were added. It is worked out again on every change, never saved, and hidden while this semester has no letter-graded courses. The cumulative GPA figure itself appears only in My record.
- **Adding the semester to the record:**
  - an **Add to cumulative** button saves the current courses as a semester under the term and year chosen at the top, then clears the course list
  - past semesters are entered the same way
- **Reset button:** clears the current course list, the form fields and any error messages. Saved semesters are not touched.

### 2. My record

- **Totals:** cumulative GPA and total credits.
- **Saved semesters:** listed newest first, by year and then by term (Fall is later than Summer, Summer is later than Spring, and Spring is later than Winter). Each shows:
  - its name, such as "Fall 2025"
  - its semester GPA and credits
  - its courses
  - a Delete semester button
- **Delete semester:** asks for confirmation on the page, with no pop-up. The button area turns into "Delete Fall 2025? **Yes, delete** / Cancel."
- **Clear all data:** confirmed the same way ("Delete all courses and semesters? **Yes, clear all** / Cancel"). It empties `localStorage` and returns the page to the first-visit state.

### GPA rules (from the Babson undergraduate catalog)

- GPA = sum of (credits × grade points) ÷ sum of letter-graded credits.
- The grade scale is A 4.00, A- 3.67, B+ 3.33, B 3.00, B- 2.67, C+ 2.33, C 2.00, C- 1.67, D+ 1.33, D 1.00, D- 0.67 and F 0.00. There is no A+.
- P and Fail courses are left out of the GPA, and their credits are left out of total credits.
- GPAs are rounded to the hundredths place and always shown with two decimals, such as 3.40. Rounding happens only for display, and the math uses the full numbers.
- A failed course that was retaken counts twice, the F and the new grade. This works without special handling, because they are entered as two separate courses.
- If there are no letter-graded credits yet, the GPA shows "—", not 0.00.

## Content and data

| Data | Where it lives | Status |
|---|---|---|
| Grade scale: letter, points, and whether it counts toward the GPA | An array of objects in the JavaScript file | Have, from the Babson undergraduate catalog |
| Current semester's courses: name, credits, grade | A JavaScript array, saved to `localStorage` | Created by the user |
| Saved semesters: term, year, courses | A JavaScript array, saved to `localStorage` | Created by the user |
| How Babson records a failed pass/fail course, and whether it counts toward the GPA | Not in the catalog | **Missing.** I will ask the Babson registrar |
| Whether P credits count toward total credits | Not in the catalog | **Missing.** I will ask the Babson registrar |

The current semester and the saved semesters are both saved, so courses I have entered but not yet added to the cumulative also survive a refresh.

## Look

The look is defined in `DESIGN.md`.

## States

- **Ideal (in use):**
  - This semester shows the course list, the semester GPA and the cumulative preview line.
  - My record shows the cumulative GPA, total credits and the saved semesters, newest first.
- **Empty (first visit, or after Clear all data):**
  - This semester shows the form and "No courses yet. Add your first course to see your semester GPA." The semester GPA shows "—", and the cumulative preview line is hidden.
  - My record shows "No saved semesters yet. Add courses, pick a term and year, then press Add to cumulative." The cumulative GPA shows "—" and total credits show 0.
- **Error (invalid input):** the message appears next to the field it is about, in the error style from `DESIGN.md`. The rest of the page keeps working, and nothing is saved.
  - Course name is empty: "Enter a course name."
  - Credits are empty, not a number, 0 or less, or more than 8: "Credits must be a number greater than 0 and no more than 8."
  - No grade chosen: "Choose a grade."
  - Add to cumulative with no courses: "Add at least one course before adding this semester."
  - Add to cumulative without a term or year: "Choose a term and a year."
  - Add to cumulative with a name already saved: "Fall 2025 is already in your record."
  - Saved data in `localStorage` cannot be read: the page starts in the empty state, with no message.
  - Error messages clear once the field is fixed or the action succeeds.
- **Partial:** some data exists but not all of it.
  - Courses this semester but no saved semesters: the preview line shows the semester GPA and credits, and My record shows its empty message.
  - Saved semesters but no current courses: the semester GPA shows "—", and the preview line is hidden.
  - Only P or Fail courses: the course list shows them, the GPA shows "—", and the preview line is hidden.
- **After a reset:** the course list, form fields and errors are cleared, and This semester shows its empty message. My record is unchanged.
- **Loading:** not reachable. Everything is local and loads instantly.

## Checks

1. Add three courses with different credits and grades. The semester GPA matches a credit-weighted average done by hand, rounded to two decimals.
2. Enter an empty name, 0 credits, or no grade. A message appears next to that field, no course is added, and the page keeps working.
3. Add the semester as Fall 2025. It appears in My record, the cumulative GPA and total credits update, and the course list clears. Trying to add Fall 2025 again is refused.
4. Delete a saved semester (after confirming), refresh the page, and the remaining data is still there with the cumulative GPA recalculated.
5. Clear all data (after confirming). The page returns to the first-visit empty state, and it stays that way after a refresh.

## Out of scope

- Editing a course or semester in place. Delete it and add it again.
- Accounts, logins, a server, a database or any outside API.
- Sharing data across browsers or devices.
- Transfer credit, withdrawals (W) and incompletes (I).
- Any framework, library or CDN.

## Later

- Edit a course without deleting it.
- Update the pass/fail rules once the registrar answers the two missing questions.
- Export or import my record as a file.
- Undo the last delete.
- A "what grade do I need" planner for a target GPA.
