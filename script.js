// Select DOM elements
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  // Clear previous results
  resultsContainer.innerHTML = '';

  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Country not found');
    const countries = await res.json();

    countries.forEach(country => {
      const {
        name: { common },
        capital = ['N/A'],
        region,
        population,
        flags: { png },
        languages = {},
        currencies = {}
      } = country;

      const langList = Object.values(languages).join(', ') || 'N/A';
      const currList = Object.values(currencies)
        .map(c => `${c.name} (${c.symbol})`)
        .join(', ') || 'N/A';

      // Create card
      const card = document.createElement('div');
      card.className = 'country-card';
      card.innerHTML = `
        <img src="${png}" alt="Flag of ${common}">
        <div class="card-body">
          <h2>${common}</h2>
          <p><strong>Capital:</strong> ${capital[0]}</p>
          <p><strong>Region:</strong> ${region}</p>
          <p><strong>Population:</strong> ${population.toLocaleString()}</p>
          <p><strong>Languages:</strong> ${langList}</p>
          <p><strong>Currencies:</strong> ${currList}</p>
        </div>
      `;

      resultsContainer.appendChild(card);
    });
  } catch (err) {
    resultsContainer.innerHTML = '<p class="error">No results found. Please try another country.</p>';
    console.error(err);
  }
});