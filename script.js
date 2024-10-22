// ==UserScript==
// @name         Add Search and Google Search Shortcuts
// @namespace    http://tampermonkey.net/
// @version      2024-10-08
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function add_search_and_google_shortcuts() {
  "use strict";

  // Your code here...
  let search_input;
  let search_value;
  // Function to find a search input and focus it
  function focus_search_input() {
    // Select search input fields by common search field attributes
    let search_input = document.querySelector(`
            textarea[aria-label*="Search"], \
            input[type="search"], \
            input[type="text"][name*="search"], \
            input[type="text"][id*="search"], \
            input[type="text"][placeholder*="Search"]`);

    // If found, focus the input field
    if (search_input) {
      search_input.scrollIntoView({
        behavior: "smooth", // Optional: Adds smooth scrolling animation
        block: "center", // Optional: Aligns the element in the center of the viewport
        inline: "nearest", // Optional: Inline alignment (left, right, or nearest)
      });
      search_input.focus();
      // Save value for restore later if needed
      search_value = search_input.value;
      search_input.value = "";
      console.log("Search input focused:", search_input);
    } else {
      console.log("No search input found on this page.");
    }

    return search_input;
  }

  function get_highlighted_text() {
    let selected_text = window.getSelection().toString().trim(); // Get the highlighted text and trim any extra spaces
    return selected_text;
  }

  // Function to search Google with the highlighted text
  function go_to({ query, google = false }) {
    if (query) {
      if (google) {
        let googleSearchURL =
          "https://www.google.com/search?q=" + encodeURIComponent(query);
        window.open(googleSearchURL, "_blank"); // Open the search in a new tab
      } else {
        window.open(query, "_blank"); // Open the search in a new tab
      }
    } else {
      console.log("No text highlighted for Google search.");
    }
  }

  // Add a keydown event listener for the hotkey (Ctrl + Shift + F)
  window.addEventListener("keydown", function (e) {
    // Check if Ctrl + Shift + F is pressed
    if (e.ctrlKey && e.shiftKey && e.key === "F") {
      e.preventDefault(); // Prevent default action if necessary
      // If focused and hotkey re-triggered, we restore the text
      if (search_input === document.activeElement) {
        search_input.value = search_value;
      } else {
        search_input = focus_search_input();
      }
    }
    // Check if Ctrl + G is pressed
    else if (e.ctrlKey && e.key === "g") {
      e.preventDefault(); // Prevent the default action of Ctrl + G
      let highlighted_text = get_highlighted_text(); // Get the currently selected text
      go_to({ query: highlighted_text, google: true }); // Search Google with the highlighted text
    } else if (e.ctrlKey && e.shiftKey && e.key === "g") {
      e.preventDefault(); // Prevent the default action of Ctrl + G
      let highlighted_text = get_highlighted_text(); // Get the currently selected text
      go_to({ query: highlighted_text }); // Search Google with the highlighted text
    }
  });
})();
