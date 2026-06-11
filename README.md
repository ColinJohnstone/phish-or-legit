# Phish or Legit? — a device-bound passkey demo

A small web game that shows, viscerally, why **device-bound passkeys** beat phishing.

You're shown two **full brand homepages** for a company you know, each with a "Sign in"
button. The set has **39 look-alike scenarios** spanning a dozen distinct phishing
techniques. On the title screen you choose the **game length** (5 or 10 rounds) and a
**difficulty** — *Mixed*, *Easy–Med*, *Med–Hard*, or *All Hard* — and each game draws a
fresh set ordered **easy → hard**, with **no technique appearing more than twice** (and no
brand repeats).

The two pages in a round look identical — the difference is in the address bar — and each
scenario shows a **difficulty pill**:

- **Typosquatting — omission / transposition / substitution** *(easy–medium)* — a dropped,
  swapped, doubled, or digit-for-letter character: `gogle.com`, `amzon.com`, `facebok.com`,
  `yuotube.com` (ou→uo), `instargam.com` (ra→ar), `twitterr.com`, `yaho0.com`.
- **Subdomain stuffing** *(hard)* — the real brand appears as a *subdomain* of the attacker's
  domain: `chase.com.login.verify-identity.net`, `fedex.com…shipment-delivery.top`,
  `ups.com…reschedule-portal.biz`. The true owner is the **last two labels**.
- **Look-alike TLDs** *(medium)* — right name, wrong ending: `zoom.download` (real `zoom.us`),
  `discord.support`, `steampowered.gl`, `roblox.login`, `uber.help`, `airbnb.rentals`.
- **Comb-glyphs / blended letters** *(hard)* — `walrnart.com` and `rnicrosoft.com` (`rn`→`m`),
  `disneypIus.com` and `saIesforce.com` (capital `I`→`l`), `twltch.tv` (`l`→`i`), `ebav.com`
  (`v`→`y`).
- **IDN homoglyphs** *(hard)* — `cоinbase.com` (Cyrillic `о`), `spotıfy.com` (dotless `ı`).
- **The `@` trick** *(hard)* — `accounts.binance.com@secure-wallet.io` actually loads
  `secure-wallet.io` (everything before `@` is ignored).
- **Brand hidden in the path** *(hard)* — `account-billing.net/netflix/login` — the real
  domain is `account-billing.net`; the brand after the first `/` is meaningless.
- **Combosquat** *(medium)* — `apple-id-verify.com` (real brand + extra words).
- **Run-together "www"** *(medium)* — `wwwpinterest.com` (no dot after `www`).
- **TLD typo** *(medium)* — `whatsapp.cm` instead of `.com`.
- **Not secure (http)** *(easy)* — `http://paypal-account.com`, no padlock.

After each round the result **boxes the exact difference** in red — the swapped character, the
appended root domain, or the invisible homoglyph — names the technique + difficulty, and for
IDN homoglyphs shows the real **`xn--…` (punycode)** address your browser would actually
display. The end-of-game summary breaks **accuracy down by difficulty**, so the "easy 2/2,
hard 0/2 by eye vs. all-green with a passkey" story is unmissable. Lifetime accuracy
(by eye vs. with a passkey) persists across sessions.

Every URL carries a realistic login subdomain + path (real banks and carriers genuinely use
long URLs), and the address bar **clips both sides to the same width with no ellipsis** — so
you can't win by "pick the shorter URL," and the path is muted just like a real browser.
**Hover any address** to reveal the full URL — the discriminating part of a subdomain-stuffing
or `@`-trick attack is at the *end*, where you have to look.

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
