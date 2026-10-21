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
  noCourses: "Add at least one course before adding this semester.",
  noTermYear: "Choose a term and a year.",
};

// In calendar order, so a higher index is later in the year.
const TERMS = ["Winter", "Spring", "Summer", "Fall"];

// Year choices: 4 years before the current year to 1 year after it.
const THIS_YEAR = new Date().getFullYear();
const YEARS = [];
for (let y = THIS_YEAR - 4; y <= THIS_YEAR + 1; y++) YEARS.push(y);

// State: the chosen term and year, the current semester's courses, the saved semesters,
// and the error showing next to each field.
const semester = { term: "", year: "" };
const courses = [];
const savedSemesters = [];
const errors = { name: "", credits: "", grade: "", termYear: "", addToCumulative: "" };
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
  termYear: document.getElementById("term-year-error"),
  addToCumulative: document.getElementById("add-to-cumulative-error"),
};
const title = document.getElementById("this-semester-title");
const termSelect = document.getElementById("semester-term");
const yearSelect = document.getElementById("semester-year");
const courseList = document.getElementById("course-list");
const courseTable = document.getElementById("course-table");
const courseEmpty = document.getElementById("course-empty");
const projectedPreview = document.getElementById("projected-preview");
const semesterGpa = document.getElementById("semester-gpa");
const semesterNote = document.getElementById("semester-note");
const addToCumulativeBtn = document.getElementById("add-to-cumulative");
const resetBtn = document.getElementById("reset");
const cumulativeGpa = document.getElementById("cumulative-gpa");
const totalCredits = document.getElementById("total-credits");
const recordEmpty = document.getElementById("record-empty");
const recordList = document.getElementById("record-list");

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

function creditsText(credits, suffix) {
  return credits + (credits === 1 ? " credit" : " credits") + suffix;
}

function semesterName(term, year) {
  return term + " " + year;
}

function savedCourses() {
  return savedSemesters.flatMap((s) => s.courses);
}

// Newest first: by year, then by term.
function sortedSemesters() {
  return [...savedSemesters].sort(
    (a, b) => b.year - a.year || TERMS.indexOf(b.term) - TERMS.indexOf(a.term)
  );
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

function validateTermYear() {
  if (semester.term === "" || semester.year === "") return MESSAGES.noTermYear;
  const year = Number(semester.year);
  const taken = savedSemesters.some((s) => s.term === semester.term && s.year === year);
  return taken ? semesterName(semester.term, year) + " is already in your record." : "";
}

function showError(input, errorEl, message) {
  if (message) {
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", errorEl.id);
  } else {
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
  }
  const field = input.closest(".field");
  if (field) field.classList.toggle("has-error", message !== "");
}

function renderErrors() {
  for (const key of Object.keys(errorEls)) {
    errorEls[key].textContent = errors[key];
    errorEls[key].hidden = errors[key] === "";
  }
  for (const field of Object.keys(fields)) {
    showError(fields[field], errorEls[field], errors[field]);
  }
  // A missing term or year marks only the empty dropdown; a name already saved marks both.
  const missing = errors.termYear === MESSAGES.noTermYear;
  showError(termSelect, errorEls.termYear, errors.termYear && (!missing || semester.term === "") ? errors.termYear : "");
  showError(yearSelect, errorEls.termYear, errors.termYear && (!missing || semester.year === "") ? errors.termYear : "");
  // A button can't be aria-invalid, so it only points to its message.
  if (errors.addToCumulative) {
    addToCumulativeBtn.setAttribute("aria-describedby", errorEls.addToCumulative.id);
  } else {
    addToCumulativeBtn.removeAttribute("aria-describedby");
  }
}

function courseRow(course, onDelete) {
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

  row.append(nameCell, creditsCell, gradeCell);

  if (onDelete) {
    const actCell = document.createElement("td");
    actCell.className = "act";
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "link";
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("aria-label", "Delete " + course.name);
    deleteBtn.addEventListener("click", onDelete);
    actCell.append(deleteBtn);
    row.append(actCell);
  }
  return row;
}

function tableHead(headings) {
  const thead = document.createElement("thead");
  const row = document.createElement("tr");
  for (const [text, className] of headings) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = text;
    if (className) th.className = className;
    row.append(th);
  }
  thead.append(row);
  return thead;
}

function renderTitle() {
  const picked = semester.term !== "" && semester.year !== "";
  title.textContent = picked ? semesterName(semester.term, semester.year) : "New semester";
  termSelect.value = semester.term;
  yearSelect.value = semester.year;
}

function renderCourses() {
  courseList.replaceChildren();
  courseEmpty.hidden = courses.length > 0;
  courseTable.hidden = courses.length === 0;
  for (const course of courses) {
    courseList.append(courseRow(course, () => deleteCourse(course.id)));
  }
}

function renderGpa() {
  const current = calcGpa(courses);
  semesterGpa.textContent = formatGpa(current.gpa);
  semesterNote.textContent = current.credits + (current.credits === 1 ? " letter-graded credit" : " letter-graded credits");

  // Preview only: worked out from state on every render and never saved.
  const projected = calcGpa(savedCourses().concat(courses));
  projectedPreview.hidden = current.credits === 0;
  projectedPreview.textContent =
    "If you add this semester, your cumulative GPA becomes " +
    formatGpa(projected.gpa) + " (" + creditsText(projected.credits, "") + ").";
}

function renderRecord() {
  const record = calcGpa(savedCourses());
  cumulativeGpa.textContent = formatGpa(record.gpa);
  totalCredits.textContent = String(record.credits);

  recordEmpty.hidden = savedSemesters.length > 0;
  recordList.replaceChildren();
  for (const saved of sortedSemesters()) {
    const result = calcGpa(saved.courses);
    const article = document.createElement("article");
    article.className = "saved-semester";

    const header = document.createElement("div");
    header.className = "saved-header";
    const name = document.createElement("h3");
    name.textContent = semesterName(saved.term, saved.year);
    const gpa = document.createElement("p");
    gpa.className = "saved-gpa";
    gpa.textContent = formatGpa(result.gpa);
    const note = document.createElement("p");
    note.className = "note";
    note.textContent = creditsText(result.credits, "");
    header.append(name, gpa, note);

    const table = document.createElement("table");
    table.append(tableHead([["Course"], ["Credits", "cr"], ["Grade"]]));
    const body = document.createElement("tbody");
    for (const course of saved.courses) body.append(courseRow(course, null));
    table.append(body);

    article.append(header, table);
    recordList.append(article);
  }
}

function render() {
  renderTitle();
  renderCourses();
  renderGpa();
  renderRecord();
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
  errors.addToCumulative = "";
  form.reset();
  render();
  fields.name.focus();
}

function deleteCourse(id) {
  const index = courses.findIndex((course) => course.id === id);
  if (index !== -1) courses.splice(index, 1);
  render();
}

function addToCumulative() {
  errors.termYear = validateTermYear();
  errors.addToCumulative = courses.length === 0 ? MESSAGES.noCourses : "";
  if (errors.termYear || errors.addToCumulative) {
    render();
    return;
  }

  savedSemesters.push({
    id: nextId++,
    term: semester.term,
    year: Number(semester.year),
    courses: courses.splice(0),
  });
  semester.term = "";
  semester.year = "";
  render();
}

function reset() {
  courses.length = 0;
  form.reset();
  for (const key of Object.keys(errors)) errors[key] = "";
  render();
}

// Clear a field's error as soon as the field is fixed.
function recheck(field) {
  if (!errors[field]) return;
  errors[field] = validate(field);
  renderErrors();
}

function addOptions(select, values) {
  for (const value of values) {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = String(value);
    select.append(option);
  }
}

for (const grade of GRADES) {
  const option = document.createElement("option");
  option.value = grade.letter;
  option.textContent = grade.label;
  fields.grade.append(option);
}
addOptions(termSelect, TERMS);
addOptions(yearSelect, YEARS);

function pickTermYear() {
  semester.term = termSelect.value;
  semester.year = yearSelect.value;
  if (errors.termYear) errors.termYear = validateTermYear();
  render();
}

termSelect.addEventListener("change", pickTermYear);
yearSelect.addEventListener("change", pickTermYear);
form.addEventListener("submit", addCourse);
fields.name.addEventListener("input", () => recheck("name"));
fields.credits.addEventListener("input", () => recheck("credits"));
fields.grade.addEventListener("change", () => recheck("grade"));
addToCumulativeBtn.addEventListener("click", addToCumulative);
resetBtn.addEventListener("click", reset);

render();
