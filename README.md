# StudySnap Better

A polished, conversion-focused front-end concept for an AI study companion. It is deliberately built as a fast, dependency-free prototype so it can be previewed anywhere and later connected to a real AI/database backend.

## Product strategy

StudySnap is positioned around a clear emotional benefit: moving students from study stress to confidence. The experience uses a free, immediate first win and a transparent paid tier rather than dark patterns. Retention comes from genuine utility: adaptive review, a clear next action, and visible progress.

## Run locally

Open `index.html` in a browser, or serve the folder with any static server:

```bash
python3 -m http.server 3000
```

## Production next steps

1. Connect the generator to a secure server-side AI endpoint (never expose an API key in browser JavaScript).
2. Add authentication and a database for study packs, review history, and streaks.
3. Replace the preview pricing buttons with Stripe Checkout and a customer portal.
4. Add PDF/image extraction and structured JSON validation.
5. Add event analytics with privacy-respecting consent: first pack created, second session, review completed, and trial conversion.
6. Deploy to Vercel, Netlify, Cloudflare Pages, or a stable Replit deployment with a custom domain.

## Ethical conversion principles

- Let users experience real value before asking for payment.
- Keep pricing and cancellation clear.
- Do not use fake scarcity, guilt, or manipulative notifications.
- Earn re-installs by making study history and the next review genuinely useful.
