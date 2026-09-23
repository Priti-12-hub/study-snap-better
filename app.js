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

document.querySelectorAll('.button').forEach((button) => button.addEventListener('click', () => {
  if (button.textContent.includes('Start')) {
    button.textContent = 'You’re on the list ✓';
    button.classList.add('button-primary');
  }
}));

document.querySelector('.menu').addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
  links.style.position = 'absolute'; links.style.top = '80px'; links.style.right = '20px'; links.style.background = '#fff'; links.style.padding = '18px'; links.style.flexDirection = 'column'; links.style.zIndex = '9';
});
