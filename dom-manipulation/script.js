// 1. DATA INITIALIZATION
// Load quotes from Local Storage; use defaults if empty.
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
    { text: "Design is not just what it looks like and feels like. Design is how it works.", category: "Design" }
  ];
  
  /**
   * Saves the current 'quotes' array to Local Storage.
   */
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  /**
   * Extracts unique categories from quotes and populates the dropdown menu.
   */
  function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Use map to get categories and Set to ensure uniqueness
    const uniqueCategories = [...new Set(quotes.map(q => q.category))];
    
    // Keep the 'All Categories' option
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Append new options
    uniqueCategories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  
    // Task: Restore the user's last selected filter from Local Storage
    const savedFilter = localStorage.getItem('lastCategoryFilter');
    if (savedFilter) {
      categoryFilter.value = savedFilter;
    }
  }
  
  /**
   * Updates the display based on selected category and picks a random quote from that set.
   */
  function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const selectedCategory = document.getElementById('categoryFilter').value;
  
    // Filter the array based on the dropdown selection
    const filteredQuotes = selectedCategory === 'all' 
      ? quotes 
      : quotes.filter(q => q.category === selectedCategory);
  
    if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = "<p>No quotes available in this category.</p>";
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
  
    quoteDisplay.innerHTML = `
      <p>"${quote.text}"</p>
      <small><strong>Category:</strong> ${quote.category}</small>
    `;
  
    // Update session storage for the last viewed quote
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
  }
  
  /**
   * Function triggered by the dropdown menu's onchange event.
   */
  function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    // Save filter preference to Local Storage
    localStorage.setItem('lastCategoryFilter', selectedCategory);
    showRandomQuote();
  }
  
  /**
   * Dynamically creates the form to add new quotes.
   */
  function createAddQuoteForm() {
    const container = document.getElementById('formContainer');
    container.innerHTML = `
      <h3>Add a New Quote</h3>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <input id="newQuoteText" type="text" placeholder="Enter quote text" />
        <input id="newQuoteCategory" type="text" placeholder="Enter category (e.g. Life, Tech)" />
        <button onclick="addQuote()">Add Quote</button>
      </div>
    `;
  }
  
  /**
   * Adds a new quote, updates storage, and refreshes the category dropdown.
   */
  function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();
  
    if (text && category) {
      quotes.push({ text, category });
      saveQuotes();
      
      // Refresh the category dropdown in case a new category was added
      populateCategories();
      
      textInput.value = '';
      categoryInput.value = '';
      alert("New quote added successfully!");
    } else {
      alert("Please fill in both fields.");
    }
  }
  
  /**
   * JSON Export Functionality
   */
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my_quotes.json';
    link.click();
    URL.revokeObjectURL(url);
  }
  
  /**
   * JSON Import Functionality
   */
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories(); // Update UI with new categories from file
        alert('Quotes imported successfully!');
      } catch (err) {
        alert("Error parsing JSON file.");
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // APP INITIALIZATION
  window.onload = function() {
    populateCategories(); // Set up categories and restore filter
    createAddQuoteForm(); // Generate the form
    showRandomQuote();    // Show initial quote based on filter
  };
  
  // Listeners
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);