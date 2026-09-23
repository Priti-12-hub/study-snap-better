const sampleNotes = 'The mitochondria is the powerhouse of the cell because it produces ATP. Cellular respiration has three main stages: glycolysis, the Krebs cycle, and the electron transport chain. Oxygen is the final electron acceptor.';
const notes = document.querySelector('#notes');
const result = document.querySelector('#result');
const resultContent = document.querySelector('#result-content');
const formatButtons = document.querySelectorAll('.format');
let selectedFormat = 'Focus pack';

function scrollToId(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }
document.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => scrollToId(button.dataset.scroll)));

formatButtons.forEach((button) => button.addEventListener('click', () => {
  formatButtons.forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  selectedFormat = button.dataset.format;
}));

document.querySelector('#generate').addEventListener('click', () => {
  const source = notes.value.trim() || sampleNotes;
  notes.value = source;
  const isQuiz = selectedFormat === 'Quiz';
  const isCards = selectedFormat === 'Flashcards';
  resultContent.innerHTML = isQuiz
    ? '<strong>Quick check</strong> Which stage produces the most ATP? &nbsp; <span>Electron transport chain</span><br /><br /><strong>Why it matters</strong> Retrieval practice makes the concept easier to recall under pressure.'
    : isCards
      ? '<strong>Card 1 · What does the mitochondria produce?</strong> ATP, the usable energy currency of the cell.<br /><br /><strong>Card 2 · Name the three stages.</strong> Glycolysis, Krebs cycle, and electron transport chain.'
      : '<strong>Your focus</strong> Cellular respiration converts food into usable ATP energy.<br /><br /><strong>Remember this</strong> Glycolysis → Krebs cycle → Electron transport chain. Oxygen finishes the process.';
  result.hidden = false;
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Ethical access initiative: sharing is optional, transparent, and never blocks free study tools.
function addAccessForAllCard() {
  const pricing = document.querySelector('#pricing');
  if (!pricing || document.querySelector('#access-for-all')) return;
  const section = document.createElement('section');
  section.id = 'access-for-all';
  section.className = 'access-card shell';
  section.innerHTML = `
    <div class="access-copy">
      <div class="eyebrow">ACCESS FOR ALL</div>
      <h2>Can’t pay yet? <em>That’s okay.</em></h2>
      <p>Share StudySnap with a friend who might benefit. After they join through your personal link, you can both receive 6 months of Focus access. You can also keep using the free plan without sharing.</p>
      <small>No spam. No pressure. One genuine invitation per person. Availability and eligibility are shown before activation.</small>
    </div>
    <div class="access-action">
      <div class="access-badge">6 months <span>Focus access</span></div>
      <button class="button button-primary" id="share-access">Get my invite link <span>↗</span></button>
      <div class="share-status" id="share-status" role="status" aria-live="polite"></div>
    </div>`;
  pricing.parentNode.insertBefore(section, pricing);

  document.querySelector('#share-access').addEventListener('click', async () => {
    const token = 'studysnap-' + Math.random().toString(36).slice(2, 9);
    const invite = `${window.location.origin}${window.location.pathname}?invite=${token}`;
    const message = `I’m using StudySnap to turn notes into useful practice. Join me and we may both receive 6 months of Focus access: ${invite}`;
    const status = document.querySelector('#share-status');
    try {
      if (navigator.share) {
        await navigator.share({ title: 'StudySnap access invite', text: message, url: invite });
        status.textContent = 'Invite ready. Thanks for sharing thoughtfully.';
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(message);
        status.textContent = 'Invite copied. Share it with one person who would genuinely benefit.';
      } else {
        window.prompt('Copy your invite message:', message);
      }
    } catch (error) {
      if (error.name !== 'AbortError') status.textContent = 'You can try again whenever you’re ready.';
    }
  });
}
addAccessForAllCard();

document.querySelectorAll('.button').forEach((button) => button.addEventListener('click', () => {
  if (button.textContent.includes('Start')) {
    button.textContent = 'You’re on the list ✓';
    button.classList.add('button-primary');
  }
}));

document.querySelector('.menu').addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
  links.style.position = 'absolute';
  links.style.top = '80px';
  links.style.right = '20px';
  links.style.background = '#fff';
  links.style.padding = '18px';
  links.style.flexDirection = 'column';
  links.style.zIndex = '9';
});
