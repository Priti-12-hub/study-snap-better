const sampleNotes = `The mitochondria is the powerhouse of the cell because it produces ATP. Cellular respiration has three main stages: glycolysis, the Krebs cycle, and the electron transport chain. Oxygen is the final electron acceptor in the process.`;

const state = {
  mode: 'summary',
  activeScreen: 'dashboard',
  revealAnswer: false,
  cardIndex: 0,
  cards: [
    {
      prompt: 'What does the mitochondria produce?',
      answer: 'ATP, the usable energy currency of the cell.'
    },
    {
      prompt: 'Name the three stages of cellular respiration.',
      answer: 'Glycolysis, the Krebs cycle, and the electron transport chain.'
    },
    {
      prompt: 'Why is oxygen important in cellular respiration?',
      answer: 'It acts as the final electron acceptor.'
    }
  ]
};

const ui = {
  notes: document.querySelector('#notes'),
  resultBox: document.querySelector('#resultBox'),
  resultContent: document.querySelector('#resultContent'),
  formatButtons: [...document.querySelectorAll('.format-btn')],
  generateButton: document.querySelector('#generate'),
  startDemo: document.querySelector('#start-demo'),
  pricingButton: document.querySelector('#show-pricing'),
  shareAccess: document.querySelector('#shareAccess'),
  navItems: [...document.querySelectorAll('.nav-item')],
  screens: [...document.querySelectorAll('.screen')],
  revealButton: document.querySelector('.answer-row .ghost-btn'),
  flashcardText: document.querySelector('.flashcard p'),
  practiceNextButton: document.querySelector('.answer-row .primary-btn')
};

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function toTitleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildStudyPack(source) {
  const notes = (source || sampleNotes).trim();

  if (state.mode === 'flashcards') {
    return `
      <strong>Flashcard 1</strong><br>
      <strong>Q:</strong> What does the mitochondria produce?<br>
      <strong>A:</strong> ATP, the usable energy currency of the cell.<br><br>
      <strong>Flashcard 2</strong><br>
      <strong>Q:</strong> Name the three stages of cellular respiration.<br>
      <strong>A:</strong> Glycolysis, the Krebs cycle, and the electron transport chain.
    `;
  }

  if (state.mode === 'quiz') {
    return `
      <strong>Quick check</strong><br>
      <strong>Q1:</strong> Which stage makes the most ATP?<br>
      <strong>A:</strong> The electron transport chain.<br><br>
      <strong>Q2:</strong> What is the role of oxygen in this process?<br>
      <strong>A:</strong> It accepts electrons at the end of the chain.
    `;
  }

  return `
    <strong>Your focus</strong><br>
    Cellular respiration turns glucose into ATP so the cell has usable energy. The process unfolds in three main stages: glycolysis, the Krebs cycle, and the electron transport chain. Oxygen is essential because it accepts electrons at the end of the chain, helping the cell generate the most ATP.
  `;
}

function renderFlashcard() {
  const card = state.cards[state.cardIndex];
  if (!card) return;

  ui.flashcardText.textContent = state.revealAnswer
    ? `Answer: ${card.answer}`
    : 'Think first, then reveal the answer.';

  if (ui.revealButton) {
    ui.revealButton.textContent = state.revealAnswer ? 'Hide answer' : 'Reveal answer';
  }

  const flashcardTitle = document.querySelector('.flashcard h4');
  if (flashcardTitle) {
    flashcardTitle.textContent = card.prompt;
  }
}

function setActiveScreen(screenName) {
  state.activeScreen = screenName;

  ui.navItems.forEach((button) => {
    const isActive = button.dataset.screen === screenName;
    button.classList.toggle('active', isActive);
  });

  ui.screens.forEach((panel) => {
    const isActive = panel.id === `screen-${screenName}`;
    panel.classList.toggle('active', isActive);
  });
}

ui.startDemo?.addEventListener('click', () => {
  scrollToSection('workspace');
  setActiveScreen('dashboard');
});

ui.pricingButton?.addEventListener('click', () => {
  scrollToSection('pricing');
});

ui.formatButtons.forEach((button) => {
  button.addEventListener('click', () => {
    ui.formatButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    state.mode = button.dataset.mode;
  });
});

ui.generateButton?.addEventListener('click', () => {
  const source = (ui.notes?.value || '').trim() || sampleNotes;
  if (ui.notes) ui.notes.value = source;

  ui.resultContent.innerHTML = buildStudyPack(source);
  ui.resultBox.hidden = false;
  ui.resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  setActiveScreen('study');
});

ui.navItems.forEach((button) => {
  button.addEventListener('click', () => setActiveScreen(button.dataset.screen));
});

ui.revealButton?.addEventListener('click', () => {
  state.revealAnswer = !state.revealAnswer;
  renderFlashcard();
});

ui.practiceNextButton?.addEventListener('click', () => {
  state.cardIndex = (state.cardIndex + 1) % state.cards.length;
  state.revealAnswer = false;
  renderFlashcard();
});

ui.shareAccess?.addEventListener('click', async () => {
  const inviteUrl = 'https://studysnap.example/invite?ref=demo-user';
  const inviteText = `I’m sharing StudySnap with you — it turns notes into study packs, flashcards, and quick recall practice: ${inviteUrl}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: 'StudySnap invite',
        text: inviteText,
        url: inviteUrl
      });
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(inviteText);
      alert('Invite copied. Share it with a student who would benefit from free access.');
      return;
    }

    window.prompt('Copy this invite link:', inviteText);
  } catch (error) {
    console.log('Share cancelled or unavailable', error);
  }
});

if (ui.notes) {
  ui.notes.value = sampleNotes;
}

renderFlashcard();
setActiveScreen('dashboard');
