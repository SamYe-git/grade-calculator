# Babson GPA Calculator

Live: https://samye-git.github.io/grade-calculator/

## What it does

A one-page tool for Babson undergraduates to log their courses and track their GPA the way the Babson undergraduate catalog describes it.

- Works out this semester's GPA as you add or delete courses, using the Babson grade scale (A 4.00 down to F 0.00, no A+).
- Leaves pass/fail courses (P and Fail) out of the GPA and out of total credits.
- Shows what your cumulative GPA would become if you added this semester, before you add it.
- Keeps a record of saved semesters, newest first, with your cumulative GPA and total credits.
- Saves everything in your browser's `localStorage`, so your courses and record survive a refresh. Nothing is sent to a server.

Built with plain HTML, CSS and JavaScript, and hosted on GitHub Pages.

## How to use it

1. **Pick a term.** Under "1 Pick a term", choose the Term (Winter, Spring, Summer or Fall) and the Year. The page title changes to match, such as "Fall 2026".
2. **Add your courses.** Under "2 Add your courses", enter the course name, credits (more than 0, up to 8) and grade, then press **Add course**. Repeat for each course. The semester GPA updates every time. To remove a course, press **Delete** on its row.
3. **Check your GPAs.** Under "3 Save to your record", read your semester GPA and the line showing what your cumulative GPA would become.
4. **Save the semester.** Press **Add to cumulative**. The semester moves into My record, and the course list clears for the next one. Enter past semesters the same way.
5. **Fix a saved semester.** In My record, press **Edit** on a semester to move it back into This semester. Change its courses, then press **Add to cumulative** again. Edit only works while This semester has no courses.
6. **Start over.** Use **Reset** to clear the current course list, **Delete semester** to remove one saved semester, or **Clear all data** to erase everything. Deleting and clearing ask you to confirm on the page first.

## Where the agent differed from what I expected

**1. Where the cumulative GPA lives** ([db304ac](https://github.com/SamYe-git/grade-calculator/commit/db304ac))

When the agent built the preview, it put a big "Cumulative GPA" figure right under Semester GPA in the This semester section, the same size and with the same name as the real cumulative GPA. I changed it so the real cumulative GPA appears only in My record, and the preview became one small line above the Add to cumulative button ("If you add this semester, your cumulative GPA becomes 3.50"). I knew it needed changing when I tested the page: I could not tell which number was already saved and which was only a guess. My proposal asked for a preview before confirming, not a second cumulative GPA.

**2. The layout was hard to scan** ([29f151b](https://github.com/SamYe-git/grade-calculator/commit/29f151b))

The first styled version had about ten horizontal rules of the same weight and very small section labels, so every block looked the same. When I opened the live site, it felt confusing to use and I could not see where one part ended and the next began. I asked the agent to turn the labels into numbered steps (1 Pick a term, 2 Add your courses, 3 Save to your record), keep only the thick rule between the two main sections, group the semester GPA, the preview and the buttons together, and give My record its own background. I checked the new version on a phone-sized screen before committing it.

**How I checked the math:** I worked out the GPAs by hand and compared them with the page, for example A (4 credits) and B+ (3 credits) should give 3.71.

## AI output I did not accept

I did not accept that agent put a very big Cumulative GPA inder the this Semester. I move it to my record with a smaller word. 
