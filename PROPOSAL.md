# Proposal

## What I am building
I am building a GPA calculator exclusively for Babson Undergrad students, which has two features. The first feature is that by logging every course's letter grade and credits for this semester, the web tool will calculate the semester GPA for you. The second feature is that the web tool can calculate your cumulative GPA after you log every semester, and it can memorize the previous semesters.

## Who it is for
It is for myself primarily because I care about my GPA for my grad school application. 
And I think lots of students at Babson have a similar issue calculating their GPA.

## What it remembers
It remembers two things: the current semester's course list (each course's name, credits and letter grade), and the list of confirmed past semesters, each with its own courses.

## Where the data lives
The grade scale (A = 4.00 to F = 0.00) is fixed data I write once, so it lives in an array of objects in my JavaScript file. The courses and semesters are data the user creates. Each person's grades are their own and nobody else needs to see them, so they are kept in JavaScript variables and saved to localStorage, which keeps them in that one browser after a refresh.

## What each action changes
- Add a course: a new course joins the current semester's list, and the semester GPA is worked out again from all the courses in that list.
- Delete a course: that course leaves the current semester's list, and the semester GPA updates without it.
- Preview: nothing is saved yet. The tool shows what my cumulative GPA would become if this semester were added.
- Add to cumulative: the current semester with all its courses joins the list of confirmed semesters, the cumulative GPA and total credits are worked out again, the current semester's list is cleared, and everything is saved to localStorage. Past semesters are entered the same way, with a letter grade for each course.
- Delete a semester: that semester and its courses leave the confirmed list, and the cumulative GPA and total credits go down accordingly.
- Reset: the current semester's course list is cleared and its GPA goes back to empty. The confirmed semesters and the cumulative GPA stay as they are.

## Features
- Semester GPA calculator: add courses with their credits and a letter grade picked from the Babson grading scale, and see this semester's GPA update right away. A reset button clears this semester's courses without touching my saved semesters.
- Input checks: if a course name is empty or the credits are not a positive number, the tool shows what is wrong next to the field and keeps working, with no pop-up boxes.
- Preview before saving: see what my cumulative GPA would become if this semester were added, before I confirm it.
- Cumulative GPA and history: confirm a semester to add it to my record, see my credit-weighted cumulative GPA and total credits, and see every confirmed semester with its courses. I can delete a course or a semester if I entered something wrong.
- Saved between visits: my semesters and courses are saved in localStorage, so they are still there after a refresh.

## What I do not know yet
- How to save an array of semesters to localStorage and read it back when the page opens.
- How to calculate a credit-weighted average in JavaScript.
- How to make the page redraw the lists and GPAs every time the data changes.
- How to design the interface to make it more user friendly.
