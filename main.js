const lijst = document.getElementById('meldingenLijst');
const regioSelector = document.getElementById('regioSelector');
const zoekInput = document.getElementById('zoekInput');
const darkToggle = document.getElementById('darkToggle');

function getFeedUrl(regio) {
  return `https://feeds.p2000-online.net/${regio}.xml`;
}

function extractCodeTag(title) {
  const tags = ['A1', 'A2', 'B1', 'B2', 'PRIO 1'];
  for (let tag of tags) {
    if (title.toUpperCase().includes(tag)) {
      return `<span class="tag ${tag.toLowerCase().replace(' ', '')}">${tag}</span>`;
    }
  }
  return '';
}

async function laadMeldingen() {
  const regio = regioSelector.value;
  const zoekterm = zoekInput.value.toLowerCase();
  lijst.innerHTML = '<li>Meldingen worden geladen...</li>';
  try {
    const response = await fetch(`proxy.php?feed=${getFeedUrl(regio)}`);
    const data = await response.json();
    lijst.innerHTML = '';

    const meldingen = data.items.filter(item =>
      item.title.toLowerCase().includes(zoekterm)
    ).slice(0, 20);

    if (meldingen.length === 0) {
      lijst.innerHTML = '<li>Geen meldingen gevonden.</li>';
      return;
    }

    meldingen.forEach(item => {
      const li = document.createElement('li');
      const tag = extractCodeTag(item.title);
      const time = new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      li.innerHTML = `<strong>[${time}]</strong> ${item.title} ${tag}`;
      lijst.appendChild(li);
    });
  } catch (e) {
    lijst.innerHTML = '<li>Fout bij laden van meldingen.</li>';
    console.error(e);
  }
}

regioSelector.addEventListener('change', laadMeldingen);
zoekInput.addEventListener('input', laadMeldingen);
darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
});

laadMeldingen();
setInterval(laadMeldingen, 20000);
