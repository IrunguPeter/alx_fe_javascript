// 1. Core Data Initialization
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" }
  ];
  
  const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
  
  // 2. Server Interaction and Syncing Logic
  
  /**
   * Fetches quotes from a mock server API.
   */
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(SERVER_URL);
      const serverPosts = await response.json();
      
      // Convert server data to our quote object format
      return serverPosts.slice(0, 5).map(post => ({
        text: post.title,
        category: "Server"
      }));
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  }
  
  /**
   * Periodically checks for new quotes from the server and updates local storage.
   * Implements conflict resolution where server data is merged with local data.
   */
  async function syncQuotes() {
    const statusEl = document.getElementById('syncStatus');
    statusEl.innerText = "Status: Syncing...";
  
    const serverQuotes = await fetchQuotesFromServer();
    
    // Conflict Resolution: Only add quotes that are unique to the server
    const newQuotes = serverQuotes.filter(sQuote => 
      !quotes.some(lQuote => lQuote.text === sQuote.text)
    );
  
    if (newQuotes.length > 0) {
      quotes.push(...newQuotes);
      saveQuotes();
      populateCategories();
      showNotification(`${newQuotes.length} new quotes synced from server!`, "#28a745");
    }
  
    statusEl.innerText = "Status: Quotes up to date";
  }
  
  /**
   * Simulates posting data to the server with appropriate headers.
   */
  async function postQuoteToServer(quote) {
    try {
      await fetch(SERVER_URL, {
        method: 'POST',
        body: JSON.stringify(quote),
        headers: {
          'Content-Type': 'application/json' // Explicitly using 'Content-Type'
        }
      });
    } catch (error) {
      console.error("Error posting to server:", error);
    }
  }
  
  // 3. UI and DOM Manipulation
  
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
  
  /**
   * Extracts unique categories and populates the dropdown filter.
   */
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
  }
  
  function filterQuotes() {
    localStorage.setItem('lastCategoryFilter', document.getElementById('categoryFilter').value);
    showRandomQuote();
  }
  
  /**
   * Handles adding a new quote and syncing it to the server.
   */
  async function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const catInput = document.getElementById('newQuoteCategory');
    
    if (textInput.value && catInput.value) {
      const newQuote = { text: textInput.value, category: catInput.value };
      quotes.push(newQuote);
      saveQuotes();
      populateCategories();
      
      // Simulate server update
      await postQuoteToServer(newQuote);
      
      textInput.value = '';
      catInput.value = '';
      showNotification("Quote added successfully!", "#007bff");
    }
  }
  
  function createAddQuoteForm() {
    const container = document.getElementById('formContainer');
    container.innerHTML = `
      <h3>Add a New Quote</h3>
      <input id="newQuoteText" type="text" placeholder="Enter quote text" style="width: 100%; margin-bottom: 10px;" />
      <input id="newQuoteCategory" type="text" placeholder="Enter category" style="width: 100%; margin-bottom: 10px;" />
      <button onclick="addQuote()">Add Quote</button>
    `;
  }
  
  // 4. File I/O Logic
  
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
      try {
        const imported = JSON.parse(e.target.result);
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        showNotification("Quotes Imported!", "#28a745");
      } catch (err) {
        showNotification("Error: Invalid file", "#dc3545");
      }
    };
    reader.readAsText(event.target.files[0]);
  }
  
  // 5. Initial Execution
  window.onload = () => {
    populateCategories();
    createAddQuoteForm();
    showRandomQuote();
    
    // Setup periodic synchronization
    setInterval(syncQuotes, 60000); // 1 minute
    syncQuotes(); // Initial fetch
  };
  
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);