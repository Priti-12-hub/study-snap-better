const sampleNotes = 'The mitochondria is the powerhouse of the cell because it produces ATP. Cellular respiration has three main stages: glycolysis, the Krebs cycle, and the electron transport chain. Oxygen is the final electron acceptor.';
const notes = document.querySelector('#notes');
const result = document.querySelector('#result');
const resultContent = document.querySelector('#result-content');
const formatButtons = document.querySelectorAll('.format');
let selectedFormat = 'Focus pack';

const accessibilityStyle = document.createElement('style');
accessibilityStyle.textContent = `
  .input-tools{display:grid;gap:.65rem;margin:.75rem 0}.drop-zone{display:flex;align-items:center;justify-content:center;gap:.5rem;min-height:58px;border:1.5px dashed #b8b0a5;border-radius:10px;background:#faf9f7;color:#667085;font-size:.76rem;text-align:center;cursor:pointer;padding:.65rem}.drop-zone:hover,.drop-zone.dragging{border-color:#7467f5;background:#f0eeff;color:#7467f5}.drop-zone input{position:absolute;width:1px;height:1px;opacity:0}.upload-status{min-height:1.1rem;color:#5ca97d;font-size:.7rem}.focus-tools{display:flex;align-items:center;justify-content:space-between;gap:.5rem;flex-wrap:wrap;margin:.75rem 0}.focus-tools label{display:flex;align-items:center;gap:.4rem;margin:0;font-size:.7rem;font-weight:500}.focus-tools input{accent-color:#7467f5}.read-button{border:1px solid #e7e1d8;background:#fff;border-radius:8px;padding:.5rem .7rem;color:#667085;font-size:.68rem;cursor:pointer}.read-button:hover{border-color:#7467f5;color:#7467f5}.adhd-mode body{}.adhd-mode .hero-lede,.adhd-mode .section-heading>p,.adhd-mode .workspace-intro>p{max-width:32rem}.adhd-mode .steps article,.adhd-mode .feature,.adhd-mode .pain-grid article{border-width:2px}.adhd-mode *{scroll-margin-top:1rem}.simple-mode .result-content{font-size:.9rem;line-height:1.75}.simple-mode .result-content strong{font-size:1rem}
`;
document.head.appendChild(accessibilityStyle);

function scrollToId(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }
document.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => scrollToId(button.dataset.scroll)));

formatButtons.forEach((button) => button.addEventListener('click', () => {
  formatButtons.forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  selectedFormat = button.dataset.format;
}));

function addAccessibleInputTools() {
  const textarea = document.querySelector('#notes');
  if (!textarea || document.querySelector('#input-tools')) return;
  const tools = document.createElement('div');
  tools.id = 'input-tools';
  tools.className = 'input-tools';
  tools.innerHTML = `
    <label class="drop-zone" id="drop-zone" for="material-file">
      <span>＋</span><span><strong>Drop or choose material</strong><br />PDF, DOCX, PPTX, image, audio, video, TXT, or pasted text</span>
      <input id="material-file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.csv,.jpg,.jpeg,.png,.webp,.mp3,.wav,.m4a,.mp4" />
    </label>
    <div class="upload-status" id="upload-status" role="status" aria-live="polite"></div>
    <div class="focus-tools">
      <label><input id="simple-mode" type="checkbox" /> Simpler reading mode</label>
      <button class="read-button" id="read-notes" type="button">▶ Read aloud</button>
    </div>`;
  textarea.insertAdjacentElement('afterend', tools);

  const dropZone = document.querySelector('#drop-zone');
  const fileInput = document.querySelector('#material-file');
  const status = document.querySelector('#upload-status');

  const acceptFile = (file) => {
    if (!file) return;
    const textTypes = ['text/plain', 'text/markdown', 'text/csv'];
    if (textTypes.includes(file.type) || /\.(txt|md|csv)$/i.test(file.name)) {
      const reader = new FileReader();
      reader.onload = () => {
        textarea.value = String(reader.result).slice(0, 50000);
        status.textContent = `${file.name} loaded. Review the text, then choose a study format.`;
      };
      reader.onerror = () => { status.textContent = 'We could not read that file. Try copying and pasting the text.'; };
      reader.readAsText(file);
      return;
    }
    status.textContent = `${file.name} is ready for secure document processing. In production, the server will extract text, OCR images, transcribe audio/video, and split long material into small study sections.`;
  };

  fileInput.addEventListener('change', () => acceptFile(fileInput.files[0]));
  ['dragenter', 'dragover'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => {
    event.preventDefault(); dropZone.classList.add('dragging');
  }));
  ['dragleave', 'drop'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => {
    event.preventDefault(); dropZone.classList.remove('dragging');
  }));
  dropZone.addEventListener('drop', (event) => acceptFile(event.dataTransfer.files[0]));

  document.querySelector('#simple-mode').addEventListener('change', (event) => {
    document.body.classList.toggle('simple-mode', event.target.checked);
  });
  document.querySelector('#read-notes').addEventListener('click', () => {
    if (!('speechSynthesis' in window)) { status.textContent = 'Read aloud is not supported in this browser.'; return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textarea.value || sampleNotes);
    utterance.rate = .88;
    window.speechSynthesis.speak(utterance);
    status.textContent = 'Reading aloud. You can stop it from your browser controls.';
  });
}
addAccessibleInputTools();

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

function addAccessForAllCard() {
  const pricing = document.querySelector('#pricing');
  if (!pricing || document.querySelector('#access-for-all')) return;
  const section = document.createElement('section');
  section.id = 'access-for-all';
  section.className = 'access-card shell';
  section.innerHTML = `<div class="access-copy"><div class="eyebrow">ACCESS FOR ALL</div><h2>Can’t pay yet? <em>That’s okay.</em></h2><p>Share StudySnap with a friend who might benefit. After they join through your personal link, you can both receive 6 months of Focus access. You can also keep using the free plan without sharing.</p><small>No spam. No pressure. One genuine invitation per person. Availability and eligibility are shown before activation.</small></div><div class="access-action"><div class="access-badge">6 months <span>Focus access</span></div><button class="button button-primary" id="share-access">Get my invite link <span>↗</span></button><div class="share-status" id="share-status" role="status" aria-live="polite"></div></div>`;
  pricing.parentNode.insertBefore(section, pricing);
  document.querySelector('#share-access').addEventListener('click', async () => {
    const token = 'studysnap-' + Math.random().toString(36).slice(2, 9);
    const invite = `${window.location.origin}${window.location.pathname}?invite=${token}`;
    const message = `I’m using StudySnap to turn notes into useful practice. Join me and we may both receive 6 months of Focus access: ${invite}`;
    const status = document.querySelector('#share-status');
    try {
      if (navigator.share) { await navigator.share({ title: 'StudySnap access invite', text: message, url: invite }); status.textContent = 'Invite ready. Thanks for sharing thoughtfully.'; }
      else if (navigator.clipboard) { await navigator.clipboard.writeText(message); status.textContent = 'Invite copied. Share it with one person who would genuinely benefit.'; }
      else window.prompt('Copy your invite message:', message);
    } catch (error) { if (error.name !== 'AbortError') status.textContent = 'You can try again whenever you’re ready.'; }
  });
}
addAccessForAllCard();

document.querySelectorAll('.button').forEach((button) => button.addEventListener('click', () => {
  if (button.textContent.includes('Start')) { button.textContent = 'You’re on the list ✓'; button.classList.add('button-primary'); }
}));

document.querySelector('.menu').addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
  links.style.position = 'absolute'; links.style.top = '72px'; links.style.right = '16px'; links.style.background = '#fff'; links.style.padding = '18px'; links.style.flexDirection = 'column'; links.style.zIndex = '9';
});
