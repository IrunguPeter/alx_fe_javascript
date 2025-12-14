// ===============================
// Quotes Data
// ===============================
const quotes = [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Technology" },
  { text: "First, solve the problem. Then, write the code.", category: "Programming" }
];

// ===============================
// DOM Elements
// ===============================
const quoteContainer = document.getElementById("quoteContainer");
const quoteText = document.getElementById("quoteText");
const quoteCategory = document.getElementById("quoteCategory");

// ===============================
// Show Random Quote
// ===============================
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteText.textContent = "No quotes available.";
    quoteCategory.textContent = "";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteText.textContent = `"${randomQuote.text}"`;
  quoteCategory.textContent = `Category: ${randomQuote.category}`;
}

// ===============================
// Create Add Quote Form Dynamically
// ===============================
function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  document.body.appendChild(formDiv);
}

// ===============================
// Add Quote Function
// ===============================
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = {
    text: newText,
    category: newCategory
  };

  quotes.push(newQuote);

  textInput.value = "";
  categoryInput.value = "";

  showRandomQuote();
}

// ===============================
// Initialize App
// ===============================
createAddQuoteForm();
showRandomQuote();
