# Phish or Legit? — a device-bound passkey demo

A small web game that shows, viscerally, why **device-bound passkeys** beat phishing.

You're shown two **full brand homepages** for a company you know, each with a "Sign in"
button. The set has **25 look-alike scenarios** (Apple, Google, Microsoft, PayPal, Amazon,
Netflix, Chase, Coinbase, Facebook, Instagram, LinkedIn, Twitter, Spotify, Dropbox, Slack,
GitHub, Discord, Steam, Reddit, Twitch, Adobe, Binance, Wells Fargo, Bank of America, eBay).
Each game randomly draws **5 or 10** of them (your choice on the title screen) — no repeats
within a game.

The two pages in a round look identical — the difference is in the address bar. Each
scenario carries a **difficulty** (shown as a pill), and a game ramps **easy → hard**:

- **Easy** — catchable if you look: misspellings/digit swaps (`amaz0n.com`, `gooogle.com`,
  `netflx.com`, `faceb00k.com`) and an **http / "Not secure"** page (no padlock).
- **Medium** — correctly spelled, wrong domain: combosquats (`apple-id.com`,
  `chase-secure.com`, `spotify-premium.com`) and wrong TLDs (`twitch.com` vs `twitch.tv`,
  `steampowered.co`).
- **Hard** — invisible or structural: **homoglyphs** (Cyrillic `о`/`і`, e.g. `cоinbase.com`),
  **subdomain tricks** (`linkedin.com.secure-signin.net` — the real domain is the part before
  the first `/`), and the **`@` trick** (`accounts.binance.com@secure-wallet.io` actually goes
  to `secure-wallet.io`).

After each round the result **boxes the exact difference** in red — even the single invisible
homoglyph character — names the technique + difficulty, and for homoglyphs shows the real
**`xn--…` (punycode)** address your browser would actually display (the one tell that survives
in eyes-mode). The end-of-game summary breaks your **accuracy down by difficulty**, so the
"easy: 2/2, hard: 0/2 by eye vs. all-green with a passkey" story is unmissable.

The hard rounds are a coin-flip even for experts — you'll *feel* yourself guessing. Then play
with a passkey and catch every one.

## Passkey registration

Click **Register a passkey on this device** to create a real platform passkey via Touch ID /
Windows Hello (stored in this computer's secure hardware). Then play passkey mode — the
passkey only works on the genuine domain, so the look-alike is instantly exposed.

Two ways to play:

- **👀 Eyes mode** — guess the real site by sight. It's punishing on purpose: this is
  how real phishing wins.
- **🔑 Passkey mode** — register a passkey, then "sign in" with it. On the fake site the
  game pops the **real browser passkey dialog coming up empty** — *"No passkeys available
  for `<domain>` — make sure you're on the right website"* — exactly what a phishing page
  hits in real life. You win every time.

## The point

A passkey's private key is bound to the site's **domain** (the WebAuthn "Relying Party
ID") and stored in your device's secure hardware. The browser will only offer a passkey
whose domain matches the page you're on. A look-alike domain is a *different* domain, so
the phishing page gets nothing — there's no password to steal and nothing to type.

## Run it

Passkeys (WebAuthn) require a **secure context**: `https://…` or `localhost`. They will
*not* work from a `file://` path.

### Locally (localhost)

```bash
cd phishGame
python3 -m http.server 8765
# then open http://localhost:8765
```

### Deploy (Vercel / any static host)

This is a static site — no build step, no dependencies. A passkey is always bound to
**the domain that serves the page**, and any HTTPS host gives a secure context, so the
demo "just works" once deployed.

**Vercel:** import this repo at [vercel.com/new](https://vercel.com/new) and deploy with
the default settings (Framework Preset: **Other**, no build command, output = repo root).
Or with the CLI:

```bash
npm i -g vercel
vercel        # preview deploy
vercel --prod # production
```

The passkey will then be bound to your `*.vercel.app` domain (or a custom domain). The
code leaves the WebAuthn Relying Party ID unset, so it auto-binds to whatever origin
serves it — no edits needed. Netlify, Cloudflare Pages, and GitHub Pages work the same way.

On a device with Touch ID / Windows Hello, "Register a passkey" triggers a real platform
passkey ceremony. If no authenticator is available (or you open it as a plain file), the
game falls back to a simulated passkey so the demo still runs — but the *real* Touch ID
prompt is the part worth showing off.

## Files

- `index.html` — screens and markup
- `styles.css` — theme, mock browser windows
- `app.js` — game flow, WebAuthn registration/assertion, brand data, inline brand logos

Brand names and logos are real and shown only to illustrate genuine look-alike domains.
This is an educational anti-phishing simulation; all trademarks belong to their owners.
The logos are simplified, stylized approximations drawn inline as SVG — not official
artwork — so no external assets are loaded.
