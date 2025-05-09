(() => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const overlay = document.getElementById('modal-overlay');
    const body = document.body;
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body');
  
    // Theme Toggle
    const toggle = document.getElementById('toggle-theme');
    toggle.addEventListener('change', () => document.documentElement.setAttribute('data-theme', toggle.checked ? 'dark' : 'light'));
    document.documentElement.setAttribute('data-theme', 'light');
  
    // Open & close modal
    const openModal = () => overlay.classList.add('active');
    const closeModal = () => overlay.classList.remove('active');
    modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const query = input.value.trim(); if (!query) return;
      // Show skeletons in modal
      modalBody.innerHTML = '<p>Loading...</p>';
      openModal();
  
      try {
        const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error();
        const [country] = await res.json();
        const { name:{common}, capital=['N/A'], region, population, flags:{png}, languages={}, currencies={} } = country;
        const lang = Object.values(languages).join(', ')||'N/A';
        const curr = Object.values(currencies).map(c=>`${c.name} (${c.symbol})`).join(', ')||'N/A';
  
        modalBody.innerHTML = `
          <img src="${png}" alt="Flag of ${common}" style="width:100%;border-radius:${'var(--radius)'};margin-bottom:1rem;">
          <h2>${common}</h2>
          <p><strong>Capital:</strong> ${capital.join(', ')}</p>
          <p><strong>Region:</strong> ${region}</p>
          <p><strong>Population:</strong> ${population.toLocaleString()}</p>
          <p><strong>Languages:</strong> ${lang}</p>
          <p><strong>Currencies:</strong> ${curr}</p>
        `;
      } catch {
        modalBody.innerHTML = '<p class="error">Country not found. Please try again.</p>';
      }
    });
  })();