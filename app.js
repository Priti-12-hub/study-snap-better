const notesField = document.getElementById('notes');
const resultBox = document.getElementById('resultBox');
const resultContent = document.getElementById('resultContent');
const formatButtons = document.querySelectorAll('.format-btn');
const startButton = document.getElementById('start-demo');
const pricingButton = document.getElementById('show-pricing');
const shareAccess = document.getElementById('shareAccess');

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

startButton?.addEventListener('click', () => scrollToSection('workspace'));
pricingButton?.addEventListener('click', () => scrollToSection('pricing'));

let currentMode = 'summary';

formatButtons.forEach((button) => {
  button.addEventListener('click', () => {
    formatButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    currentMode = button.dataset.mode;
  });
});

document.getElementById('generate')?.addEventListener('click', () => {
  const noteText = notesField.value.trim();
  const content = noteText || 'The mitochondria is the powerhouse of the cell because it produces ATP. Cellular respiration has three main stages: glycolysis, the Krebs cycle, and the electron transport chain.';

  if (currentMode === 'flashcards') {
    resultContent.innerHTML = `
      <strong>Flashcard 1:</strong> What does the mitochondria produce?<br>
      <strong>Answer:</strong> ATP, the usable energy currency of the cell.<br><br>
      <strong>Flashcard 2:</strong> What are the three stages of cellular respiration?<br>
      <strong>Answer:</strong> Glycolysis, the Krebs cycle, and the electron transport chain.
    `;
  } else if (currentMode === 'quiz') {
    resultContent.innerHTML = `
      <strong>Q1.</strong> Which stage produces the most ATP?<br>
      <strong>A.</strong> Electron transport chain<br><br>
      <strong>Q2.</strong> Why is oxygen important in cellular respiration?<br>
      <strong>A.</strong> It is the final electron acceptor.
    `;
  } else {
    resultContent.innerHTML = `
      <strong>Summary:</strong> Cellular respiration is the process by which cells convert glucose into ATP. The main stages are glycolysis, the Krebs cycle, and the electron transport chain. Oxygen plays a key role as the final electron acceptor, helping generate the energy the cell needs.
    `;
  }

  resultBox.hidden = false;
  resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

shareAccess?.addEventListener('click', async () => {
  const invite = 'https://studysnap.example/invite?ref=demo-user';
  const shareText = 'I’m sharing StudySnap with you. It turns notes into flashcards and quick revision packs: ' + invite;

  try {
    if (navigator.share) {
      await navigator.share({
        title: 'StudySnap invite',
        text: shareText,
        url: invite,
      });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      alert('Invite copied. Share it with a student who would benefit from free access.');
    } else {
      window.prompt('Copy this invite:', shareText);
    }
  } catch (error) {
    console.log('Share canceled or unavailable');
  }
});
