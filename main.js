// main.js
const lijst = document.getElementById('meldingenLijst');
const regioSelector = document.getElementById('regioSelector');
const zoekInput = document.getElementById('zoekInput');
const darkToggle = document.getElementById('darkToggle');

function extractCodeTag(title) {
  // Bijvoorbeeld: "[A1] Brand in woning" → A1
  const match = title.match(/\[(.*?)\]/);
  if (match) {
    return match[1];
  }
  return '';
}

function laadMeldingen() {
  lijst.setAttribute('aria-busy', 'true');
  lijst.innerHTML = '<li>Laden van meldingen...</li>';

  const feedUrl = encodeURIComponent(regioSelector.value);
  const proxyUrl = `/.netlify/functions/proxy?feed=${feedUrl}`;

  fetch(proxyUrl)
    .then(res => {
      if (!res.ok) throw new Error('Fout bij ophalen feed');
      return res.text();
    })
    .then(str => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(str, "application/xml");

      const items = xml.querySelectorAll('item');
      if (items.length === 0) {
        lijst.innerHTML = '<li>Geen meldingen gevonden.</li>';
        lijst.removeAttribute('aria-busy');
        return;
      }

      const filterTerm = zoekInput.value.toLowerCase();

      let html = '';
      items.forEach(item => {
        const title = item.querySelector('title')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const codeTag = extractCodeTag(title);

        if (filterTerm && !title.toLowerCase().includes(filterTerm)) return;

        const isPrio1 = codeTag.toLowerCase() === 'prio 1' || codeTag.toLowerCase() === 'prio1';

        html += `
          <li class="${isPrio1 ? 'prio1' : ''}">
            <strong>${codeTag ? `[${codeTag}] ` : ''}</strong> 
            <a href="${link}" target="_blank" rel="noopener noreferrer">${title.replace(/\[.*?\]\s*/, '')}</a>
            <br />
            <small>${new Date(pubDate).toLocaleString('nl-NL')}</small>
          </li>
        `;
      });

      lijst.innerHTML = html || '<li>Geen meldingen gevonden.</li>';
      lijst.removeAttribute('aria-busy');
    })
    .catch(err => {
      lijst.innerHTML = `<li class="prio1">Fout bij het laden van meldingen: ${err.message}</li>`;
      lijst.removeAttribute('aria-busy');
    });
}

// Event listeners
regioSelector.addEventListener('change', () => {
  laadMeldingen();
});

zoekInput.addEventListener('input', () => {
  laadMeldingen();
});

darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark', darkToggle.checked);
});

// Initial load
window.addEventListener('load', () => {
  laadMeldingen();
});
