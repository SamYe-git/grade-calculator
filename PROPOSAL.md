# Proposal

## What I am building
I am building a GPA calculator exclusively for Babson Undergrad student, which has two feature. The first feature is by logging every courses final grade component of this semester, the web tool will calculate a final grade for you. The second feature is that the web tool can calculate you cumulative GPA after you log every semester gpa. and it can memorize the previous semester gpa. 
## Who it is for
It is for myself primarily because i care about my gpa for my grad school application. And i think lots of student at Babson has similar issue to calculate gpa. 
## What it remembers
it remember each semester's class final grade component and the component of every past semester. 
## Where the data lives
  The grade scale (A = 4.00 to F = 0.00) is fixed data I write once, so it lives in an array of objects in my JavaScript file. The courses and semesters are data the user creates. Each person’s grades are their own and nobody else needs to see them, so they are kept in JavaScript variables and saved to localStorage, which keeps them in that one browser after a refresh.
## What each action changes
- create a new course in the current semester's list, and the semester GPA is worked out again from all the courses in that list.
- when deleting the course, that course leaves the current semester’s list, and the semester GPA updates without it.
- when change every number of the component in the course, the final grade changed with it. 
- Add to cumulative, the current semester with all its courses, joined the list of confirmed semester, the cumulative GPA and total credits are worked out gaian, the current semester's kist is cleared, and everything is saved at localstorage. (the previous semester course doesnt need grade component to generate the final grade, the grade can be log by user manually)
- when that semester and its courses leave the confirmed list, and the cumulative GPA and total credits go down accordingly.
- the current semester’s course list is cleared and its GPA goes back to empty. The confirmed semesters and the cumulative GPA stay as they are.
## Features
- Semester GPA calculator: add courses with their credits and a letter grade picked from the Babson grading scale, and see this semester’s GPA update right away. A reset button clears this semester’s courses without touching my saved semesters.
- Input checks: if a course name is empty or the credits are not a positive number, the tool should stop with a notification
- Preview before saving: see what my cumulative GPA would become if this semester were added, before I confirm it.
- Cumulative GPA and history: confirm a semester to add it to my record, see my credit-weighted cumulative GPA and total credits, and see every confirmed semester with its courses. I can delete a course or a semester if I entered something wrong.
- Saved between visits: my semesters and courses are saved in localStorage, so they are still there after a refresh.
## What I do not know yet
should i allow user to log previous semester's final grade component as well? 
how to design in interface to make it more user friendly.