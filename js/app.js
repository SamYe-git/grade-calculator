// Babson undergraduate grade scale. P and Fail are pass/fail and do not count toward the GPA.
const GRADES = [
  { letter: "A", label: "A", points: 4.0, inGpa: true },
  { letter: "A-", label: "A-", points: 3.67, inGpa: true },
  { letter: "B+", label: "B+", points: 3.33, inGpa: true },
  { letter: "B", label: "B", points: 3.0, inGpa: true },
  { letter: "B-", label: "B-", points: 2.67, inGpa: true },
  { letter: "C+", label: "C+", points: 2.33, inGpa: true },
  { letter: "C", label: "C", points: 2.0, inGpa: true },
  { letter: "C-", label: "C-", points: 1.67, inGpa: true },
  { letter: "D+", label: "D+", points: 1.33, inGpa: true },
  { letter: "D", label: "D", points: 1.0, inGpa: true },
  { letter: "D-", label: "D-", points: 0.67, inGpa: true },
  { letter: "F", label: "F", points: 0.0, inGpa: true },
  { letter: "P", label: "P (pass)", points: null, inGpa: false },
  { letter: "Fail", label: "Fail (pass/fail course)", points: null, inGpa: false },
];

const MESSAGES = {
  name: "Enter a course name.",
  credits: "Credits must be a number greater than 0 and no more than 8.",
  grade: "Choose a grade.",
};

const TERMS = ["Winter", "Spring", "Summer", "Fall"];

// Year choices: 4 years before the current year to 1 year after it.
const THIS_YEAR = new Date().getFullYear();
const YEARS = [];
for (let y = THIS_YEAR - 4; y <= THIS_YEAR + 1; y++) YEARS.push(y);

// State: the chosen term and year, the current semester's courses, and the error showing next to each form field.
const semester = { term: "", year: "" };
const courses = [];
const errors = { name: "", credits: "", grade: "" };
let nextId = 1;

const form = document.getElementById("course-form");
const fields = {
  name: document.getElementById("course-name"),
  credits: document.getElementById("course-credits"),
  grade: document.getElementById("course-grade"),
};
const errorEls = {
  name: document.getElementById("course-name-error"),
  credits: document.getElementById("course-credits-error"),
  grade: document.getElementById("course-grade-error"),
};
const title = document.getElementById("this-semester-title");
const termSelect = document.getElementById("semester-term");
const yearSelect = document.getElementById("semester-year");
const courseList = document.getElementById("course-list");
const courseTable = document.getElementById("course-table");
const courseEmpty = document.getElementById("course-empty");
const semesterGpa = document.getElementById("semester-gpa");
const semesterNote = document.getElementById("semester-note");

function findGrade(letter) {
  return GRADES.find((g) => g.letter === letter);
}

// Returns the GPA as a full-precision number, or null when there are no letter-graded credits.
function calcGpa(list) {
  let points = 0;
  let credits = 0;
  for (const course of list) {
    const grade = findGrade(course.grade);
    if (!grade.inGpa) continue;
    points += course.credits * grade.points;
    credits += course.credits;
  }
  return { gpa: credits > 0 ? points / credits : null, credits };
}

function formatGpa(gpa) {
  if (gpa === null) return "—";
  return (Math.round(gpa * 100) / 100).toFixed(2);
}

function validate(field) {
  const value = fields[field].value;
  if (field === "name") return value.trim() === "" ? MESSAGES.name : "";
  if (field === "credits") {
    const n = Number(value);
    const ok = value.trim() !== "" && Number.isFinite(n) && n > 0 && n <= 8;
    return ok ? "" : MESSAGES.credits;
  }
  if (field === "grade") return findGrade(value) ? "" : MESSAGES.grade;
  return "";
}

function renderErrors() {
  for (const field of Object.keys(fields)) {
    const message = errors[field];
    const input = fields[field];
    const errorEl = errorEls[field];
    errorEl.textContent = message;
    errorEl.hidden = message === "";
    if (message) {
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", errorEl.id);
    } else {
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    }
    input.closest(".field").classList.toggle("has-error", message !== "");
  }
}

function renderCourses() {
  courseList.replaceChildren();
  courseEmpty.hidden = courses.length > 0;
  courseTable.hidden = courses.length === 0;

  for (const course of courses) {
    const grade = findGrade(course.grade);
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.className = "name";
    nameCell.textContent = course.name;

    const creditsCell = document.createElement("td");
    creditsCell.className = "cr";
    creditsCell.textContent = String(course.credits);

    const gradeCell = document.createElement("td");
    gradeCell.className = "grade";
    gradeCell.textContent = grade.letter;
    if (!grade.inGpa) {
      const note = document.createElement("span");
      note.className = "not-in-gpa";
      note.textContent = "not in GPA";
      gradeCell.append(" ", note);
    }

    const actCell = document.createElement("td");
    actCell.className = "act";
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "link";
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("aria-label", "Delete " + course.name);
    deleteBtn.addEventListener("click", () => deleteCourse(course.id));
    actCell.append(deleteBtn);

    row.append(nameCell, creditsCell, gradeCell, actCell);
    courseList.append(row);
  }
}

function renderGpa() {
  const { gpa, credits } = calcGpa(courses);
  semesterGpa.textContent = formatGpa(gpa);
  semesterNote.textContent = credits + (credits === 1 ? " letter-graded credit" : " letter-graded credits");
}

function renderTitle() {
  const picked = semester.term !== "" && semester.year !== "";
  title.textContent = picked ? semester.term + " " + semester.year : "New semester";
  termSelect.value = semester.term;
  yearSelect.value = semester.year;
}

function render() {
  renderTitle();
  renderCourses();
  renderGpa();
  renderErrors();
}

function addCourse(event) {
  event.preventDefault();
  for (const field of Object.keys(fields)) {
    errors[field] = validate(field);
  }
  const firstBad = Object.keys(fields).find((field) => errors[field]);
  if (firstBad) {
    render();
    fields[firstBad].focus();
    return;
  }

  courses.push({
    id: nextId++,
    name: fields.name.value.trim(),
    credits: Number(fields.credits.value),
    grade: fields.grade.value,
  });
  form.reset();
  render();
  fields.name.focus();
}

function deleteCourse(id) {
  const index = courses.findIndex((course) => course.id === id);
  if (index !== -1) courses.splice(index, 1);
  render();
}

// Clear a field's error as soon as the field is fixed.
function recheck(field) {
  if (!errors[field]) return;
  errors[field] = validate(field);
  renderErrors();
}

for (const grade of GRADES) {
  const option = document.createElement("option");
  option.value = grade.letter;
  option.textContent = grade.label;
  fields.grade.append(option);
}

function addOptions(select, values) {
  for (const value of values) {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = String(value);
    select.append(option);
  }
}

addOptions(termSelect, TERMS);
addOptions(yearSelect, YEARS);

termSelect.addEventListener("change", () => {
  semester.term = termSelect.value;
  render();
});
yearSelect.addEventListener("change", () => {
  semester.year = yearSelect.value;
  render();
});

form.addEventListener("submit", addCourse);
fields.name.addEventListener("input", () => recheck("name"));
fields.credits.addEventListener("input", () => recheck("credits"));
fields.grade.addEventListener("change", () => recheck("grade"));

render();
