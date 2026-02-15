// Initial array of quote objects
const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
    { text: "Stay hungry, stay foolish.", category: "Tech" }
  ];
  
  /**
   * Displays a random quote from the array.
   */
  function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    // Select a random index
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
  
    // Update the DOM
    quoteDisplay.innerHTML = `
      <p>"${quote.text}"</p>
      <small>Category: ${quote.category}</small>
    `;
  }
  
  /**
   * Creates and appends the form for adding new quotes to the DOM.
   */
  function createAddQuoteForm() {
    const container = document.getElementById('formContainer');
  
    // Create HTML elements dynamically
    const formDiv = document.createElement('div');
    
    formDiv.innerHTML = `
      <h3>Add a New Quote</h3>
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button id="addQuoteBtn">Add Quote</button>
    `;
  
    container.appendChild(formDiv);
  
    // Attach event listener to the dynamically created button
    document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
  }
  
  /**
   * Takes input values, adds a new quote to the array, and clears the form.
   */
  function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
  
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();
  
    if (text && category) {
      // Add to the data array
      quotes.push({ text, category });
  
      // Clear the inputs
      textInput.value = '';
      categoryInput.value = '';
  
      alert("Quote added successfully!");
    } else {
      alert("Please fill out both fields.");
    }
  }
  
  // Event Listeners
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Initialize the form on page load
  createAddQuoteForm();