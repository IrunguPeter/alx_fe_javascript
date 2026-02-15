// 1. DATA INITIALIZATION
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" }
  ];
  
  const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
  
  // 2. SERVER SYNC FUNCTIONS
  /**
   * Periodically fetches quotes from the server and merges them with local data.
   * Conflict Resolution Strategy: Server data is merged into local storage.
   */
  async function syncQuotes() {
    const statusEl = document.getElementById('syncStatus');
    statusEl.innerText = "Sync Status: Checking server...";
  
    try {
      const response = await fetch(SERVER_URL);
      const serverData = await response.json();
      
      // Simulate mapping server 'posts' to our 'quote' format
      const serverQuotes = serverData.slice(0, 5).map(post => ({
        text: post.title,
        category: "Server"
      }));
  
      // Conflict Resolution: Find quotes that exist on server but NOT in local list
      const newQuotes = serverQuotes.filter(sQuote => 
        !quotes.some(lQuote => lQuote.text === sQuote.text)
      );
  
      if (newQuotes.length > 0) {
        quotes.push(...newQuotes);
        saveQuotes();
        populateCategories();
        showNotification(`${newQuotes.length} new quotes synced from server!`, "#28a745");
      }
      
      statusEl.innerText = "Sync Status: Quotes up to date";
    } catch (error) {
      statusEl.innerText = "Sync Status: Connection Error";
      console.error("Sync failed:", error);
    }
  }
  
  /**
   * Posts a new quote to the server (Simulation)
   */
  async function postQuoteToServer(quote) {
    try {
      await fetch(SERVER_URL, {
        method: 'POST',
        body: JSON.stringify(quote),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
      });
    } catch (error) {
      console.error("Server update failed:", error);
    }
  }
  
  // 3. UI & DOM MANIPULATION
  function showNotification(msg, color) {
    const note = document.getElementById('notification');
    note.innerText = msg;
    note.style.backgroundColor = color;
    note.style.display = 'block';
    setTimeout(() => note.style.display = 'none', 4000);
  }
  
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  function populateCategories() {
    const filter = document.getElementById('categoryFilter');
    const selected = localStorage.getItem('lastCategoryFilter') || 'all';
    const categories = [...new Set(quotes.map(q => q.category))];
    
    filter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      filter.appendChild(opt);
    });
    filter.value = selected;
  }
  
  function showRandomQuote() {
    const display = document.getElementById('quoteDisplay');
    const filterVal = document.getElementById('categoryFilter').value;
    const filtered = filterVal === 'all' ? quotes : quotes.filter(q => q.category === filterVal);
  
    if (filtered.length === 0) {
      display.innerHTML = "<p>No quotes found.</p>";
      return;
    }
  
    const quote = filtered[Math.floor(Math.random() * filtered.length)];
    display.innerHTML = `<p>"${quote.text}"</p><small>Category: ${quote.category}</small>`;
  }
  
  function filterQuotes() {
    localStorage.setItem('lastCategoryFilter', document.getElementById('categoryFilter').value);
    showRandomQuote();
  }
  
  // 4. ADDING DATA
  async function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const catInput = document.getElementById('newQuoteCategory');
    const text = textInput.value.trim();
    const category = catInput.value.trim();
  
    if (text && category) {
      const newQuote = { text, category };
      quotes.push(newQuote);
      saveQuotes();
      
      // UI Update
      populateCategories();
      textInput.value = '';
      catInput.value = '';
      
      // Immediate Sync Post
      await postQuoteToServer(newQuote);
      showNotification("Quote saved locally and pushed to server!", "#1877f2");
    }
  }
  
  function createAddQuoteForm() {
    const container = document.getElementById('formContainer');
    container.innerHTML = `
      <h3>Contribute a Quote</h3>
      <input id="newQuoteText" type="text" placeholder="Quote Text" style="width: 100%; margin-bottom: 10px;">
      <input id="newQuoteCategory" type="text" placeholder="Category" style="width: 100%; margin-bottom: 10px;">
      <button onclick="addQuote()">Submit Quote</button>
    `;
  }
  
  // 5. IMPORT/EXPORT
  function exportToJsonFile() {
    const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes_export.json';
    a.click();
  }
  
  function importFromJsonFile(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imported = JSON.parse(e.target.result);
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      showNotification("Quotes Imported!", "#28a745");
    };
    reader.readAsText(event.target.files[0]);
  }
  
  // INITIALIZE
  window.onload = () => {
    populateCategories();
    createAddQuoteForm();
    showRandomQuote();
    // Start periodic sync (every 60 seconds)
    setInterval(syncQuotes, 60000);
    // Initial sync
    syncQuotes();
  };
  
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);