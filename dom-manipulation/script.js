// 1. Core Data
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" }
  ];
  
  const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
  
  // 2. Server Interaction Functions
  
  /**
   * MANDATORY: Fetches quotes from a mock server API.
   */
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(SERVER_URL);
      const data = await response.json();
      // Simulate mapping mock API data to our quote format
      return data.slice(0, 5).map(post => ({
        text: post.title,
        category: "Server"
      }));
    } catch (error) {
      console.error("Error fetching from server:", error);
      return [];
    }
  }
  
  /**
   * Synchronizes local quotes with the server and handles conflict resolution.
   */
  async function syncQuotes() {
    const statusEl = document.getElementById('syncStatus');
    statusEl.innerText = "Status: Syncing...";
  
    const serverQuotes = await fetchQuotesFromServer();
    
    // Conflict Resolution: Check for quotes on server not present locally
    const newQuotes = serverQuotes.filter(sQuote => 
      !quotes.some(lQuote => lQuote.text === sQuote.text)
    );
  
    if (newQuotes.length > 0) {
      quotes.push(...newQuotes);
      saveQuotes();
      populateCategories();
      showNotification(`${newQuotes.length} quotes synced from server!`, "#28a745");
    }
  
    statusEl.innerText = "Status: Quotes up to date";
  }
  
  /**
   * Simulates pushing a new quote to the server.
   */
  async function postQuoteToServer(quote) {
    try {
      await fetch(SERVER_URL, {
        method: 'POST',
        body: JSON.stringify(quote),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
      });
    } catch (error) {
      console.error("Posting error:", error);
    }
  }
  
  // 3. UI & DOM Logic
  
  function showNotification(msg, color) {
    const note = document.getElementById('notification');
    note.innerText = msg;
    note.style.backgroundColor = color;
    note.style.display = 'block';
    setTimeout(() => note.style.display = 'none', 3000);
  }
  
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  function populateCategories() {
    const filter = document.getElementById('categoryFilter');
    const uniqueCategories = [...new Set(quotes.map(q => q.category))];
    const lastFilter = localStorage.getItem('lastCategoryFilter') || 'all';
  
    filter.innerHTML = '<option value="all">All Categories</option>';
    uniqueCategories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      filter.appendChild(opt);
    });
    filter.value = lastFilter;
  }
  
  function showRandomQuote() {
    const display = document.getElementById('quoteDisplay');
    const filterVal = document.getElementById('categoryFilter').value;
    const filtered = filterVal === 'all' ? quotes : quotes.filter(q => q.category === filterVal);
  
    if (filtered.length === 0) {
      display.innerHTML = "<p>No quotes in this category.</p>";
      return;
    }
  
    const quote = filtered[Math.floor(Math.random() * filtered.length)];
    display.innerHTML = `<p>"${quote.text}"</p><small>Category: ${quote.category}</small>`;
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
  }
  
  function filterQuotes() {
    localStorage.setItem('lastCategoryFilter', document.getElementById('categoryFilter').value);
    showRandomQuote();
  }
  
  async function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const catInput = document.getElementById('newQuoteCategory');
    
    if (textInput.value && catInput.value) {
      const newQuote = { text: textInput.value, category: catInput.value };
      quotes.push(newQuote);
      saveQuotes();
      populateCategories();
      
      // Post new quote to server
      await postQuoteToServer(newQuote);
      
      textInput.value = '';
      catInput.value = '';
      showNotification("Quote added and pushed to server!", "#007bff");
    }
  }
  
  function createAddQuoteForm() {
    const container = document.getElementById('formContainer');
    container.innerHTML = `
      <h3>Add a New Quote</h3>
      <input id="newQuoteText" type="text" placeholder="Enter quote text" />
      <input id="newQuoteCategory" type="text" placeholder="Enter category" />
      <button onclick="addQuote()">Add Quote</button>
    `;
  }
  
  // 4. Import/Export Logic
  
  function exportToJsonFile() {
    const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
  }
  
  function importFromJsonFile(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imported = JSON.parse(e.target.result);
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      showNotification("Import Successful!", "#28a745");
    };
    reader.readAsText(event.target.files[0]);
  }
  
  // 5. App Initialization
  window.onload = () => {
    populateCategories();
    createAddQuoteForm();
    showRandomQuote();
    
    // Set up periodic sync
    setInterval(syncQuotes, 60000); // Every 60 seconds
    syncQuotes(); // Immediate sync on load
  };
  
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);