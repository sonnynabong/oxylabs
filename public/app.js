document.addEventListener('DOMContentLoaded', () => {
  const queryInput = document.getElementById('query');
  const countrySelect = document.getElementById('country');
  const searchBtn = document.getElementById('searchBtn');
  const btnText = searchBtn.querySelector('.btn-text');
  const spinner = searchBtn.querySelector('.spinner');
  const errorDiv = document.getElementById('error');
  const resultsDiv = document.getElementById('results');
  
  // Results sections
  const aiOverviewSection = document.getElementById('aiOverviewSection');
  const aiOverviewContent = document.getElementById('aiOverviewContent');
  const organicSection = document.getElementById('organicSection');
  const organicResults = document.getElementById('organicResults');
  const relatedSection = document.getElementById('relatedSection');
  const relatedSearches = document.getElementById('relatedSearches');
  const rawJson = document.getElementById('rawJson');

  // Search button click handler
  searchBtn.addEventListener('click', performSearch);
  
  // Enter key handler
  queryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  async function performSearch() {
    const query = queryInput.value.trim();
    const country = countrySelect.value;
    
    if (!query) {
      showError('Please enter a search query');
      return;
    }

    // Show loading state
    setLoading(true);
    hideError();
    hideResults();

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, country })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to fetch data');
      }

      displayResults(data);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function displayResults(data) {
    // Show results container
    resultsDiv.classList.remove('hidden');
    
    // Display raw JSON
    rawJson.textContent = JSON.stringify(data, null, 2);

    const results = data.results || {};

    // Display AI Overview
    if (results.ai_overviews && results.ai_overviews.length > 0) {
      displayAiOverview(results.ai_overviews[0]);
      aiOverviewSection.classList.remove('hidden');
    } else {
      aiOverviewSection.classList.add('hidden');
    }

    // Display Organic Results
    if (results.organic && results.organic.length > 0) {
      displayOrganicResults(results.organic);
      organicSection.classList.remove('hidden');
    } else {
      organicSection.classList.add('hidden');
    }

    // Display Related Searches
    if (results.related_searches && results.related_searches.length > 0) {
      displayRelatedSearches(results.related_searches);
      relatedSection.classList.remove('hidden');
    } else {
      relatedSection.classList.add('hidden');
    }
  }

  function displayAiOverview(aiOverview) {
    let html = '';

    // Display answer text sections
    if (aiOverview.answer_text && aiOverview.answer_text.length > 0) {
      aiOverview.answer_text.forEach((answer, index) => {
        html += '<div class="ai-answer">';
        html += `<div class="ai-answer-header">Answer ${index + 1}</div>`;
        
        if (answer.text && answer.text.length > 0) {
          answer.text.forEach(text => {
            html += `<div class="ai-answer-text">${escapeHtml(text)}</div>`;
          });
        }
        
        html += '</div>';
      });
    }

    // Display source panel
    if (aiOverview.source_panel && aiOverview.source_panel.items && aiOverview.source_panel.items.length > 0) {
      html += '<div class="ai-sources">';
      html += '<h3>Sources</h3>';
      
      aiOverview.source_panel.items.forEach((source, index) => {
        html += '<div class="source-item">';
        html += `<div class="source-number">${source.pos || index + 1}</div>`;
        html += '<div class="source-content">';
        html += `<div class="source-title">${escapeHtml(source.title || 'No title')}</div>`;
        html += `<div class="source-url">${escapeHtml(source.source || 'Unknown source')}</div>`;
        if (source.description) {
          html += `<div class="source-desc">${escapeHtml(source.description)}</div>`;
        }
        html += '</div>';
        html += '</div>';
      });
      
      html += '</div>';
    }

    if (html === '') {
      html = '<div class="no-results"><div class="no-results-icon">🤔</div><p>No AI Overview content available</p></div>';
    }

    aiOverviewContent.innerHTML = html;
  }

  function displayOrganicResults(organic) {
    let html = '';

    organic.forEach(result => {
      html += '<div class="organic-result">';
      html += '<div class="result-header">';
      html += `<div class="favicon">${getFaviconLetter(result.favicon_text)}</div>`;
      html += '<div class="result-meta">';
      html += `<div class="result-url-shown">${escapeHtml(result.url_shown || result.url || '')}</div>`;
      html += '</div>';
      html += `<span class="result-pos">#${result.pos}</span>`;
      html += '</div>';
      html += `<a href="${escapeHtml(result.url)}" target="_blank" class="result-title">${escapeHtml(result.title)}</a>`;
      html += `<div class="result-desc">${escapeHtml(result.desc || '')}</div>`;
      html += '</div>';
    });

    organicResults.innerHTML = html;
  }

  function displayRelatedSearches(related) {
    let html = '';
    const seen = new Set();

    related.forEach(item => {
      if (item.related_searches && item.related_searches.length > 0) {
        item.related_searches.forEach(search => {
          if (!seen.has(search)) {
            seen.add(search);
            html += `<button class="related-tag" data-query="${escapeHtml(search)}">${escapeHtml(search)}</button>`;
          }
        });
      }
    });

    relatedSearches.innerHTML = html;

    // Add click handlers for related searches
    relatedSearches.querySelectorAll('.related-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        queryInput.value = tag.dataset.query;
        performSearch();
      });
    });
  }

  function setLoading(loading) {
    searchBtn.disabled = loading;
    btnText.textContent = loading ? 'Searching...' : 'Search';
    spinner.classList.toggle('hidden', !loading);
  }

  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
  }

  function hideError() {
    errorDiv.classList.add('hidden');
  }

  function hideResults() {
    resultsDiv.classList.add('hidden');
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function getFaviconLetter(text) {
    if (!text) return '?';
    return text.charAt(0).toUpperCase();
  }
});
