// 1. DATA INITIALIZATION
// Attempt to load quotes from Local Storage; fallback to defaults if empty.
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
    { text: "Stay hungry, stay foolish.", category: "Tech" }
  ];
  
  /**
   * Saves the current 'quotes' array to Local Storage.
   */
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  /**
   * Displays a random quote and saves it to Session Storage as the "last viewed".
   */
  function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (quotes.length === 0) {
      quoteDisplay.innerHTML = "<p>No quotes available. Add some below!</p>";
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
  
    // Update DOM
    quoteDisplay.innerHTML = `
      <p>"${quote.text}"</p>
      <small><strong>Category:</strong> ${quote.category}</small>
    `;
  
    // Save to Session Storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
  }
  
  /**
   * Dynamically creates the form for adding new quotes.
   */
  function createAddQuoteForm() {
    const container = document.getElementById('formContainer');
    
    const formDiv = document.createElement('div');
    formDiv.innerHTML = `
      <h3>Add a New Quote</h3>
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" style="width: 70%" />
      <input id="newQuoteCategory" type="text" placeholder="Enter category" />
      <button id="addQuoteBtn">Add Quote</button>
    `;
  
    container.appendChild(formDiv);
  
    // Event listener for the new button
    document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
  }
  
  /**
   * Adds a new quote to the array, saves to Local Storage, and clears inputs.
   */
  function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();
  
    if (text && category) {
      quotes.push({ text, category });
      saveQuotes();
      
      textInput.value = '';
      categoryInput.value = '';
      alert("Quote added successfully!");
    } else {
      alert("Please enter both a quote and a category.");
    }
  }
  
  /**
   * Exports quotes array to a JSON file using a Blob.
   */
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    link.click();
    
    URL.revokeObjectURL(url);
  }
  
  /**
   * Imports quotes from a selected JSON file.
   */
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      try {
        const importedQuotes = JSON.parse(event.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          alert('Quotes imported successfully!');
          showRandomQuote();
        } else {
          throw new Error("Format not supported.");
        }
      } catch (e) {
        alert("Error: Failed to parse JSON file.");
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // INITIALIZATION ON PAGE LOAD
  window.onload = function() {
    // Check Session Storage for the last viewed quote
    const lastQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastQuote) {
      const quote = JSON.parse(lastQuote);
      document.getElementById('quoteDisplay').innerHTML = `
        <em>Welcome back! Here was your last quote:</em>
        <p>"${quote.text}"</p>
        <small>Category: ${quote.category}</small>
      `;
    } else {
      showRandomQuote();
    }
  
    createAddQuoteForm();
  };
  
  // Event Listeners
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);