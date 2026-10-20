# Proposal

> I wish I had a tool that remembers every course and letter grade I have earned at Babson and tells me my semester GPA and my cumulative GPA.

## What I am building
I am building a GPA calculator for Babson undergrad students that works out this semester's GPA from the courses I log and keeps my past semesters so it can also show my cumulative GPA.

## Who it is for
It is for myself primarily because I care about my GPA for my grad school application. 
And I think lots of students at Babson have a similar issue calculating their GPA.

## What it remembers
It remembers two things: the current semester's course list (each course's name, credits and letter grade), and the list of confirmed past semesters. Each confirmed semester has a name made of a term (Fall, Spring or Summer) and a year, such as Fall 2025, plus its own courses.

## Where the data lives
The Babson undergraduate grade scale (A 4.00, A- 3.67, B+ 3.33, B 3.00, B- 2.67, C+ 2.33, C 2.00, C- 1.67, D+ 1.33, D 1.00, D- 0.67, F 0.00, and no A+) is fixed data I write once, so it lives in an array of objects in my JavaScript file. The courses and semesters are data the user creates. Each person's grades are their own and nobody else needs to see them, so they are kept in JavaScript variables and saved to localStorage, which keeps them in that one browser after a refresh.

## What each action changes
- Add a course: a new course joins the current semester's list, and the semester GPA is worked out again from all the courses in that list. The projected cumulative GPA, which shows what my cumulative GPA would become if this semester were added, updates at the same time.
- Delete a course: that course leaves the current semester's list, and the semester GPA and projected cumulative GPA update without it.
- Add to cumulative: I pick the term (Fall, Spring or Summer) and the year, and the current semester with all its courses joins the list of confirmed semesters under that name. The cumulative GPA and total credits are worked out again, the current semester's list is cleared, and everything is saved to localStorage. Past semesters are entered the same way, with a letter grade for each course.
- Delete a semester: that semester and its courses leave the confirmed list, and the cumulative GPA and total credits go down accordingly.
- Reset: the current semester's course list is cleared and its GPA goes back to empty. The confirmed semesters and the cumulative GPA stay as they are.
- Clear all data: after I confirm on the page (not in a pop-up), every course and every confirmed semester is removed, localStorage is emptied, and the page goes back to the empty state of a first visit.

## Features
- Semester GPA calculator: add courses with their credits and a letter grade picked from the Babson grading scale, and see this semester's GPA update right away. A reset button clears this semester's courses without touching my saved semesters.
- Input checks: the tool shows what is wrong next to the field and keeps working, with no pop-up boxes, when a course name is empty, the credits are not a positive number or are more than 8, I try to add a semester with no courses to the cumulative, or I do not pick a term and year.
- Projected cumulative GPA: while I enter this semester, the page always shows what my cumulative GPA would become if this semester were added, before I confirm it.
- Cumulative GPA and history: confirm a semester to add it to my record, see my credit-weighted cumulative GPA and total credits, and see every confirmed semester by name with its courses. I can delete a course or a semester if I entered something wrong, or clear all my data to start over.
- Saved between visits: my semesters and courses are saved in localStorage, so they are still there after a refresh.

## What I do not know yet
- How to save an array of semesters to localStorage and read it back when the page opens.
- How to calculate a credit-weighted average in JavaScript.
- How to make the page redraw the lists and GPAs every time the data changes.
- How to design the interface to make it more user friendly.
- Whether people should be allowed to edit a course after adding it, without deleting it. For now, to fix a mistake I delete the course and add it again.
