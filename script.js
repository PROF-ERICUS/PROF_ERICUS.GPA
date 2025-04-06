const gradePoints = {
  'A': 4.00,
  'A-': 3.75,
  'B+': 3.50,
  'B': 3.25,
  'B-': 3.00,
  'C+': 2.75,
  'C': 2.50,
  'C-': 2.00,
  'D': 1.50,
  'F': 0.00,
  'X': 0.00,
  'Z': 0.00,
  'IC': 0.00,
  'AD': 0.00
};

const levels = [
  "L100 - 1st Sem", "L100 - 2nd Sem",
  "L200 - 1st Sem", "L200 - 2nd Sem",
  "L300 - 1st Sem", "L300 - 2nd Sem",
  "L400 - 1st Sem", "L400 - 2nd Sem"
];

// Load page content
window.onload = () => {
  const container = document.getElementById("levels");

  levels.forEach((level, index) => {
    const levelDiv = document.createElement("div");
    levelDiv.classList.add("course-set");
    levelDiv.id = `level-${index}`;

    levelDiv.innerHTML = `
      <h3>${level}</h3>
      <div class="courses" id="courses-${index}"></div>
      <button type="button" onclick="addCourse(${index})">Add Course</button>
    `;

    container.appendChild(levelDiv);
    addCourse(index); // Start with one row
  });

  // Show welcome popup
  alert("🎓 Welcome to EricusVault Hub GPA System!\nDeveloped by Prof_Ericus");

  // WhatsApp floating button (in case it's not in HTML already)
  const whatsapp = document.createElement("a");
  whatsapp.href = "https://wa.link/wn9zbf";
  whatsapp.className = "whatsapp-button";
  whatsapp.target = "_blank";
  whatsapp.innerText = "💬 Chat Prof_Ericus";
  document.body.appendChild(whatsapp);
};

// Add a course input row
function addCourse(index) {
  const courseDiv = document.getElementById(`courses-${index}`);
  const entry = document.createElement("div");
  entry.classList.add("course-entry");

  entry.innerHTML = `
    <input type="text" name="grade-${index}[]" placeholder="Grade (A, B+, etc)">
    <input type="number" name="credit-${index}[]" placeholder="Credit Hours">
    <button type="button" onclick="this.parentElement.remove()">❌</button>
  `;

  courseDiv.appendChild(entry);
}

// GPA classification
function getFinalClass(gpa) {
  if (gpa >= 3.60) return "First Class Honours";
  if (gpa >= 3.00) return "Second Class Honours (Upper Division)";
  if (gpa >= 2.50) return "Second Class Honours (Lower Division)";
  if (gpa >= 2.00) return "Third Class Honours";
  return "Not classified / Below Pass";
}

// Calculate GPA
document.getElementById("gpaForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let totalPoints = 0;
  let totalCredits = 0;
  let semesterResults = [];

  levels.forEach((levelName, index) => {
    let semPoints = 0;
    let semCredits = 0;
    const grades = document.getElementsByName(`grade-${index}[]`);
    const credits = document.getElementsByName(`credit-${index}[]`);

    for (let i = 0; i < grades.length; i++) {
      const grade = grades[i].value.toUpperCase().trim();
      const credit = parseFloat(credits[i].value);

      if (!grade && !credits[i].value) continue;

      if (!gradePoints.hasOwnProperty(grade) || isNaN(credit)) {
        alert(`Invalid input at ${levelName}. Grade: ${grade}, Credit: ${credit}`);
        return;
      }

      semPoints += gradePoints[grade] * credit;
      semCredits += credit;
    }

    if (semCredits > 0) {
      const semGPA = (semPoints / semCredits).toFixed(2);
      semesterResults.push(`${levelName}: GPA = <strong>${semGPA}</strong>`);
      totalPoints += semPoints;
      totalCredits += semCredits;
    }
  });

  const finalGPA = (totalCredits > 0) ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  const classification = getFinalClass(finalGPA);
  let gpaColor = "black";
  if (finalGPA >= 3.6) gpaColor = "green";
  else if (finalGPA >= 2.5) gpaColor = "orange";
  else gpaColor = "red";

  document.getElementById("result").innerHTML = `
    <h3>Semester Results:</h3>
    <ul>${semesterResults.map(item => `<li>${item}</li>`).join("")}</ul>
    <h3>Final GPA: <strong style="color:${gpaColor}">${finalGPA}</strong></h3>
    <h3>Classification: <strong>${classification}</strong></h3>
  `;

  document.getElementById("result").scrollIntoView({ behavior: "smooth" });
});

// Reset form completely
function resetForm() {
  levels.forEach((_, index) => {
    const courseDiv = document.getElementById(`courses-${index}`);
    if (courseDiv) {
      courseDiv.innerHTML = ""; // Remove all course rows
      addCourse(index);         // Add one fresh row
    }
  });

  document.getElementById("result").innerHTML = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Dark/Light Mode Toggle
const toggleBtn = document.getElementById("modeToggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggleBtn.textContent = document.body.classList.contains("dark-mode") 
    ? "☀️ Light Mode" 
    : "🌙 Dark Mode";
});
