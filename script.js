(() => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const overlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body');
    const themeBtn = document.getElementById('toggle-theme');
  
    // Theme Toggle
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    });
    document.documentElement.setAttribute('data-theme', 'light');
  
    // Modal controls
    const openModal = () => overlay.classList.add('active');
    const closeModal = () => overlay.classList.remove('active');
    modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => e.target === overlay && closeModal());
  
    // Smooth scroll for nav links
    document.querySelectorAll('.main-nav a').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
      });
    });
  
    // Fetch & display
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const query = input.value.trim(); if (!query) return;
      modalBody.innerHTML = '<p>Loading...</p>';
      openModal();
      try {
        const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error();
        const [c] = await res.json();
        const { name:{common}, capital=['N/A'], region, population, flags:{png}, languages={}, currencies={} } = c;
        const lang = Object.values(languages).join(', ')||'N/A';
        const curr = Object.values(currencies).map(c=>`${c.name} (${c.symbol})`).join(', ')||'N/A';
        modalBody.innerHTML = `
          <img src="${png}" alt="Flag of ${common}">
          <h2>${common}</h2>
          <p><strong>Capital:</strong> ${capital.join(', ')}</p>
          <p><strong>Region:</strong> ${region}</p>
          <p><strong>Population:</strong> ${population.toLocaleString()}</p>
          <p><strong>Languages:</strong> ${lang}</p>
          <p><strong>Currencies:</strong> ${curr}</p>
        `;
      } catch {
        modalBody.innerHTML = '<p class="error">Country not found.</p>';
      }
    });
  })();