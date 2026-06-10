/* ============================================================
   Phish or Legit? — a device-bound passkey demo
   ------------------------------------------------------------
   The point: humans can't reliably tell a phishing login page
   from the real one. A passkey can — because it's bound to the
   site's DOMAIN, and the browser refuses to use it anywhere else.
   ============================================================ */

// ---------- Brands -------------------------------------------------
// Real, well-known brands shown as full homepages (not bare login
// forms). The two homepages in a round are byte-for-byte identical —
// the ONLY difference is the address bar. And it's brutal on purpose:
//   • Most fakes are HOMOGLYPHS — one Latin letter swapped for an
//     identical-looking Cyrillic one. Invisible to the eye.
//   • The rest are "clean fake vs ugly real": the phishing domain
//     looks MORE official than the company's genuine (but unfamiliar)
//     sign-in domain — so intuition actively points the wrong way.
// The honest takeaway: you cannot win this by looking. A passkey can,
// because it's bound to the true, byte-for-byte domain.
//
// Each brand carries its own homepage theme + hero so every scenario
// looks and feels different.
const HOMOGLYPH_NOTE =
  "A real browser would unmask it as a confusing “xn--…” address — but the fake site " +
  "controls what the bar shows, and most people never look that closely. Your eyes can't win this one.";

const BRANDS = [
  {
    name: "Coinbase",
    color: "#1652f0",
    kind: "crypto",
    navBg: "#0a0b0d", navFg: "#ffffff", heroBg: "#0a0b0d", heroFg: "#ffffff",
    legit: "www.coinbase.com",
    // the first "o" in coinbase is a Cyrillic о (U+043E)
    fake: "www.cоinbase.com",
    technique: "Homoglyph (Cyrillic “о”)",
    lesson:
      "The two addresses are pixel-identical, but in the fake the first “o” is a Cyrillic <b>о</b>, not a Latin “o”. " +
      HOMOGLYPH_NOTE,
    mark: logoCoinbase,
    nameHtml: `<span style="color:#fff;font-weight:700">Coinbase</span>`,
    home: () => `
      <p class="eyebrow" style="color:#5b8cff">Coinbase</p>
      <h1>Jumpstart your<br>crypto portfolio.</h1>
      <p class="lede">Coinbase is the easiest place to buy and sell cryptocurrency.</p>
      <div class="cb-ticker">
        <span>BTC <b style="color:#2fd27a">▲ 2.4%</b></span>
        <span>ETH <b style="color:#2fd27a">▲ 1.1%</b></span>
        <span>SOL <b style="color:#ff5d6c">▼ 0.6%</b></span>
      </div>`,
  },
  {
    name: "PayPal",
    color: "#0070ba",
    kind: "wallet",
    navBg: "#ffffff", navFg: "#2c2e2f", heroBg: "linear-gradient(160deg,#f5f7fa,#e8eefc)", heroFg: "#0a1f44",
    legit: "www.paypal.com",
    // the second character is a Cyrillic а (U+0430)
    fake: "www.pаypal.com",
    technique: "Homoglyph (Cyrillic “а”)",
    lesson:
      "Look as hard as you like — the “a” in the fake is a Cyrillic <b>а</b>, not a Latin “a”. " +
      HOMOGLYPH_NOTE,
    mark: logoPaypal,
    nameHtml: `<span style="font-weight:800;font-size:1.15rem"><span style="color:#003087">Pay</span><span style="color:#0070ba">Pal</span></span>`,
    home: () => `
      <h1>Pay it your way.</h1>
      <p class="lede">Send money, get paid, and check out faster across millions of stores.</p>
      <div class="pp-card">
        <div class="pp-row"><span>Balance</span><b>$2,480.19</b></div>
        <div class="pp-row"><span>Send</span><span>Request</span></div>
      </div>`,
  },
  {
    name: "Google",
    color: "#1a73e8",
    kind: "email",
    navBg: "#ffffff", navFg: "#5f6368", heroBg: "#ffffff", heroFg: "#202124",
    legit: "accounts.google.com",
    // both "o"s are Cyrillic о (U+043E)
    fake: "accоunts.gооgle.com",
    technique: "Homoglyph (Cyrillic “о”)",
    lesson:
      "Three of the letters you read as “o” are Cyrillic <b>о</b>. The word looks exactly like “accounts.google.com”. " +
      HOMOGLYPH_NOTE,
    mark: logoGoogle,
    nameHtml: googleWordmark(),
    home: () => `
      <div class="g-center">
        <div class="g-big">${googleWordmark(34)}</div>
        <div class="g-search"><span>🔍</span> Search Google or type a URL</div>
        <div class="g-btns"><span>Google Search</span><span>I'm Feeling Lucky</span></div>
      </div>`,
  },
  {
    name: "Netflix",
    color: "#e50914",
    kind: "streaming",
    navBg: "transparent", navFg: "#ffffff", heroBg: "#000000", heroFg: "#ffffff",
    legit: "www.netflix.com",
    // the "i" is a Cyrillic/Ukrainian і (U+0456)
    fake: "www.netflіx.com",
    technique: "Homoglyph (Cyrillic “і”)",
    lesson:
      "The “i” in the fake is a Cyrillic <b>і</b> (U+0456), identical to a Latin “i” at this size. " +
      HOMOGLYPH_NOTE,
    mark: logoNetflix,
    nameHtml: `<span style="color:#e50914;font-weight:800;letter-spacing:1px;font-size:1.05rem">NETFLIX</span>`,
    home: () => `
      <div class="nf-hero">
        <h1>Unlimited movies, TV shows, and more.</h1>
        <p class="lede">Starts at $6.99. Cancel anytime.</p>
        <div class="nf-row">
          <input placeholder="Email address" />
          <button class="nf-cta">Get Started ›</button>
        </div>
      </div>`,
  },
  {
    name: "Amazon",
    color: "#ff9900",
    kind: "shopping",
    navBg: "#131921", navFg: "#ffffff", heroBg: "#eaeded", heroFg: "#0f1111",
    legit: "www.amazon.com",
    // the "o" is a Cyrillic о (U+043E)
    fake: "www.amazоn.com",
    technique: "Homoglyph (Cyrillic “о”)",
    lesson:
      "The “o” in amazon is a Cyrillic <b>о</b> in the fake. Same width, same shape, different character. " +
      HOMOGLYPH_NOTE,
    mark: logoAmazon,
    nameHtml: `<span style="color:#fff;font-weight:700;font-size:1.05rem">amazon</span>`,
    navExtra: `<div class="az-search"><input placeholder="Search Amazon" /><span class="az-go">🔍</span></div>`,
    home: () => `
      <div class="az-banner">Today's Deals · up to 50% off</div>
      <div class="az-grid">
        <div><div class="az-thumb" style="background:#f0c14b"></div>Electronics</div>
        <div><div class="az-thumb" style="background:#a0d8ef"></div>Home</div>
        <div><div class="az-thumb" style="background:#f7b7c2"></div>Fashion</div>
        <div><div class="az-thumb" style="background:#bfe3c0"></div>Books</div>
      </div>`,
  },
  {
    name: "Apple",
    color: "#0071e3",
    kind: "email",
    navBg: "#161617", navFg: "#f5f5f7", heroBg: "#000000", heroFg: "#f5f5f7",
    legit: "appleid.apple.com",
    // the first "a" of appleid is a Cyrillic а (U+0430)
    fake: "аppleid.apple.com",
    technique: "Homoglyph (Cyrillic “а”)",
    lesson:
      "The very first “a” in the fake is a Cyrillic <b>а</b>, not a Latin “a”. The two addresses are indistinguishable. " +
      HOMOGLYPH_NOTE,
    mark: logoApple,
    nameHtml: ``,
    home: () => `
      <div class="ap-hero">
        <p class="eyebrow" style="color:#f5f5f7;opacity:.7">iPhone 16 Pro</p>
        <h1 style="font-size:2.4rem">Titanium.</h1>
        <p class="lede">So strong. So light. So Pro.</p>
        <p class="ap-links"><span>Learn more ›</span> <span>Buy ›</span></p>
      </div>`,
  },
  {
    name: "Chase",
    color: "#117aca",
    kind: "bank",
    navBg: "#117aca", navFg: "#ffffff", heroBg: "#ffffff", heroFg: "#0a0a0a",
    legit: "secure05ea.chase.com",
    fake: "www.chase-secure.com",
    technique: "Look-alike domain (clean fake, unfamiliar real)",
    lesson:
      "The reassuring <b>chase-secure.com</b> is the phish. Chase's real login lives on ugly subdomains of " +
      "<b>chase.com</b> like secure05ea.chase.com. “Looks official” is not a security signal — clean-but-fake beats ugly-but-real.",
    mark: logoChase,
    nameHtml: `<span style="color:#fff;font-weight:700;letter-spacing:.5px">CHASE</span>`,
    home: () => `
      <h1 style="color:#117aca">Welcome to Chase</h1>
      <p class="lede">Banking, credit cards, and mortgages — all in one place.</p>
      <div class="ch-cards">
        <div>Checking</div><div>Credit&nbsp;Cards</div><div>Mortgage</div>
      </div>`,
  },
  {
    name: "Microsoft",
    color: "#0067b8",
    kind: "work",
    navBg: "#ffffff", navFg: "#3b3b3b", heroBg: "#f3f2f1", heroFg: "#1b1a19",
    legit: "login.microsoftonline.com",
    // the "o" in micro(o)soft is a Cyrillic о (U+043E)
    fake: "login.micrоsoftonline.com",
    technique: "Homoglyph (Cyrillic “о”)",
    lesson:
      "The “o” in “microsoft” is a Cyrillic <b>о</b> in the fake — pixel-identical to the genuine address. " +
      HOMOGLYPH_NOTE,
    mark: logoMicrosoft,
    nameHtml: `<span style="color:#5e5e5e;font-weight:600;font-size:1.02rem">Microsoft</span>`,
    home: () => `
      <h1 style="font-weight:600">Microsoft 365</h1>
      <p class="lede">The apps you know, now with Copilot AI to help you create.</p>
      <div class="ms-tiles">
        <span style="background:#2b579a">W</span>
        <span style="background:#217346">X</span>
        <span style="background:#d24726">P</span>
        <span style="background:#0078d4">O</span>
        <span style="background:#6264a7">T</span>
      </div>`,
  },

  // ── 17 more look-alike scenarios (25 total). These use shared hero +
  //    monogram helpers to stay compact. Most are invisible homoglyphs;
  //    a few use wrong-TLD / combosquat for teaching variety. ──────────
  {
    name: "Facebook", color: "#1877f2", kind: "social",
    navBg: "#ffffff", navFg: "#1c1e21", heroBg: "#f0f2f5", heroFg: "#1c1e21",
    legit: "www.facebook.com", fake: "www.facebоok.com", // Cyrillic о
    technique: "Homoglyph (Cyrillic “о”)", lesson: homoglyphLesson("Cyrillic “о” (U+043E)"),
    mark: () => monogram("f", "#1877f2"),
    home: () => heroCenter({ h1: "Connect with friends and the world around you.", sub: "Log in to see photos and updates from people you know.", cta: "Create new account" }),
  },
  {
    name: "Instagram", color: "#e1306c", kind: "social",
    navBg: "#ffffff", navFg: "#262626", heroBg: "#fafafa", heroFg: "#262626",
    legit: "www.instagram.com", fake: "www.instаgram.com", // Cyrillic а
    technique: "Homoglyph (Cyrillic “а”)", lesson: homoglyphLesson("Cyrillic “а” (U+0430)"),
    mark: () => monogram("Ig", "#e1306c"),
    home: () => heroCenter({ h1: "See photos and videos from your friends.", sub: "Sign up to share your moments with the world.", cta: "Log in" }),
  },
  {
    name: "LinkedIn", color: "#0a66c2", kind: "work",
    navBg: "#ffffff", navFg: "#000000", heroBg: "#f4f2ee", heroFg: "#1d1d1d",
    legit: "www.linkedin.com", fake: "www.linkedіn.com", // Cyrillic і
    technique: "Homoglyph (Cyrillic “і”)", lesson: homoglyphLesson("Cyrillic “і” (U+0456)"),
    mark: () => monogram("in", "#0a66c2"),
    home: () => heroCenter({ h1: "Welcome to your professional community.", sub: "Sign in to your network of 1B+ professionals.", cta: "Sign in with email" }),
  },
  {
    name: "Twitter", color: "#1d9bf0", kind: "social",
    navBg: "#000000", navFg: "#ffffff", heroBg: "#000000", heroFg: "#ffffff",
    legit: "twitter.com", fake: "twіtter.com", // Cyrillic і
    technique: "Homoglyph (Cyrillic “і”)", lesson: homoglyphLesson("Cyrillic “і” (U+0456)"),
    mark: () => monogram("t", "#1d9bf0"),
    home: () => heroCenter({ eyebrow: "Happening now", h1: "Join today.", sub: "Sign in to see what's happening in the world right now.", cta: "Sign in" }),
  },
  {
    name: "Spotify", color: "#1db954", kind: "streaming",
    navBg: "#000000", navFg: "#ffffff", heroBg: "#121212", heroFg: "#ffffff",
    legit: "www.spotify.com", fake: "www.spоtify.com", // Cyrillic о
    technique: "Homoglyph (Cyrillic “о”)", lesson: homoglyphLesson("Cyrillic “о” (U+043E)"),
    mark: () => monogram("S", "#1db954"),
    home: () => heroCenter({ h1: "Music for everyone.", sub: "Millions of songs. No credit card needed.", cta: "Log in" }),
  },
  {
    name: "Dropbox", color: "#0061ff", kind: "work",
    navBg: "#ffffff", navFg: "#1e1919", heroBg: "#f7f5f2", heroFg: "#1e1919",
    legit: "www.dropbox.com", fake: "www.drоpbox.com", // Cyrillic о
    technique: "Homoglyph (Cyrillic “о”)", lesson: homoglyphLesson("Cyrillic “о” (U+043E)"),
    mark: () => monogram("D", "#0061ff"),
    home: () => heroCenter({ h1: "Keep life organised and work moving.", sub: "All your files, safe and synced. Sign in to continue.", cta: "Sign in" }),
  },
  {
    name: "Slack", color: "#611f69", kind: "work",
    navBg: "#ffffff", navFg: "#1d1c1d", heroBg: "#f8f4f9", heroFg: "#1d1c1d",
    legit: "app.slack.com", fake: "www.slаck.com", // Cyrillic а
    technique: "Homoglyph (Cyrillic “а”)", lesson: homoglyphLesson("Cyrillic “а” (U+0430)"),
    mark: () => monogram("S", "#611f69"),
    home: () => heroCenter({ h1: "Where work happens.", sub: "Sign in to your workspace to keep the team moving.", cta: "Sign in" }),
  },
  {
    name: "GitHub", color: "#238636", kind: "dev",
    navBg: "#161b22", navFg: "#ffffff", heroBg: "#0d1117", heroFg: "#e6edf3",
    legit: "github.com", fake: "gіthub.com", // Cyrillic і
    technique: "Homoglyph (Cyrillic “і”)", lesson: homoglyphLesson("Cyrillic “і” (U+0456)"),
    mark: () => monogram("GH", "#238636"),
    home: () => heroCenter({ h1: "Where the world builds software.", sub: "Sign in to access your repositories and pull requests.", cta: "Sign in" }),
  },
  {
    name: "Discord", color: "#5865f2", kind: "social",
    navBg: "#5865f2", navFg: "#ffffff", heroBg: "#404eed", heroFg: "#ffffff",
    legit: "discord.com", fake: "discоrd.com", // Cyrillic о
    technique: "Homoglyph (Cyrillic “о”)", lesson: homoglyphLesson("Cyrillic “о” (U+043E)"),
    mark: () => monogram("D", "#5865f2", "#fff"),
    home: () => heroCenter({ h1: "Imagine a place to hang out.", sub: "Log in to talk, video chat, and stay close with your communities.", cta: "Open Discord" }),
  },
  {
    name: "Steam", color: "#1999ff", kind: "gaming",
    navBg: "#171a21", navFg: "#ffffff", heroBg: "#1b2838", heroFg: "#ffffff",
    legit: "store.steampowered.com", fake: "store.steаmpowered.com", // Cyrillic а
    technique: "Homoglyph (Cyrillic “а”)", lesson: homoglyphLesson("Cyrillic “а” (U+0430)"),
    mark: () => monogram("S", "#1999ff"),
    home: () => heroCenter({ h1: "Welcome to Steam.", sub: "Sign in to your library of over 50,000 games.", cta: "Sign in" }),
  },
  {
    name: "Reddit", color: "#ff4500", kind: "social",
    navBg: "#ffffff", navFg: "#1a1a1b", heroBg: "#dae0e6", heroFg: "#1a1a1b",
    legit: "www.reddit.com", fake: "www.reddіt.com", // Cyrillic і
    technique: "Homoglyph (Cyrillic “і”)", lesson: homoglyphLesson("Cyrillic “і” (U+0456)"),
    mark: () => monogram("R", "#ff4500"),
    home: () => heroCenter({ h1: "Dive into anything.", sub: "Log in to join the communities you care about.", cta: "Log In" }),
  },
  {
    name: "Twitch", color: "#9146ff", kind: "streaming",
    navBg: "#18181b", navFg: "#ffffff", heroBg: "#0e0e10", heroFg: "#efeff1",
    legit: "www.twitch.tv", fake: "www.twitch.com", // wrong TLD
    technique: "Wrong TLD (.com vs .tv)",
    lesson:
      "Same name, different ending: Twitch streams live on <b>twitch.tv</b>, and <b>twitch.com</b> is a different " +
      "registration. The brand name being spelled correctly tells you nothing about who owns the domain.",
    mark: () => monogram("T", "#9146ff"),
    home: () => heroCenter({ h1: "Watch live. Chat live.", sub: "Sign in to follow your favourite streamers.", cta: "Log In" }),
  },
  {
    name: "Adobe", color: "#fa0f00", kind: "work",
    navBg: "#ffffff", navFg: "#2c2c2c", heroBg: "#fafafa", heroFg: "#2c2c2c",
    legit: "account.adobe.com", fake: "account.adоbe.com", // Cyrillic о
    technique: "Homoglyph (Cyrillic “о”)", lesson: homoglyphLesson("Cyrillic “о” (U+043E)"),
    mark: () => monogram("A", "#fa0f00"),
    home: () => heroTiles({ h1: "Creativity for all.", sub: "Sign in to your Adobe account and Creative Cloud apps.", tiles: [
      { label: "Ps", bg: "#31a8ff" }, { label: "Ai", bg: "#ff9a00" }, { label: "Pr", bg: "#9999ff" }, { label: "Ae", bg: "#9999ff" } ] }),
  },
  {
    name: "Binance", color: "#f0b90b", kind: "crypto",
    navBg: "#181a20", navFg: "#ffffff", heroBg: "#0b0e11", heroFg: "#ffffff",
    legit: "accounts.binance.com", fake: "accounts.binаnce.com", // Cyrillic а
    technique: "Homoglyph (Cyrillic “а”)", lesson: homoglyphLesson("Cyrillic “а” (U+0430)"),
    mark: () => monogram("B", "#f0b90b", "#181a20"),
    home: () => heroChips({ h1: "Buy, trade, and hold crypto.", sub: "Sign in to the world's largest exchange.", chips: [
      "BTC <b style='color:#2fd27a'>▲ 1.8%</b>", "ETH <b style='color:#2fd27a'>▲ 0.9%</b>", "BNB <b style='color:#ff5d6c'>▼ 0.4%</b>" ] }),
  },
  {
    name: "Wells Fargo", color: "#d71e28", kind: "bank",
    navBg: "#b31b1b", navFg: "#ffffff", heroBg: "#ffffff", heroFg: "#1a1a1a",
    legit: "connect.secure.wellsfargo.com", fake: "www.wellsfargo-online.com", // combosquat
    technique: "Look-alike domain (combosquat)",
    lesson:
      "Wells Fargo's real banking lives on subdomains of <b>wellsfargo.com</b> (e.g. connect.secure.wellsfargo.com). " +
      "<b>wellsfargo-online.com</b> just borrows the name — it's a separate registration with no typo to give it away.",
    mark: () => monogram("WF", "#d71e28"),
    home: () => heroCards({ h1: "Welcome to Wells Fargo", sub: "Sign on to manage your accounts and cards.", cards: ["Checking", "Savings", "Credit Cards"] }),
  },
  {
    name: "Bank of America", color: "#012169", kind: "bank",
    navBg: "#012169", navFg: "#ffffff", heroBg: "#ffffff", heroFg: "#1a1a1a",
    legit: "secure.bankofamerica.com", fake: "secure.bankofamerіca.com", // Cyrillic і
    technique: "Homoglyph (Cyrillic “і”)", lesson: homoglyphLesson("Cyrillic “і” (U+0456)"),
    mark: () => monogram("B", "#e31837", "#fff"),
    home: () => heroCards({ h1: "Welcome to Bank of America", sub: "Sign in to Online Banking to continue.", cards: ["Accounts", "Transfers", "Bill Pay"] }),
  },
  {
    name: "eBay", color: "#0064d2", kind: "shopping",
    navBg: "#ffffff", navFg: "#1a1a1a", heroBg: "#f7f7f7", heroFg: "#1a1a1a",
    legit: "signin.ebay.com", fake: "www.ebay-signin.com", // combosquat
    technique: "Look-alike domain (combosquat)",
    lesson:
      "eBay's real sign-in is a subdomain of <b>ebay.com</b> (signin.ebay.com). <b>ebay-signin.com</b> is a wholly " +
      "separate domain that just contains the word “ebay” — convincing, correctly spelled, and not eBay.",
    mark: () => monogram("e", "#0064d2"),
    home: () => heroCards({ h1: "Shop by category.", sub: "Sign in to bid, buy, and track your orders.", cards: ["Electronics", "Motors", "Fashion"] }),
  },
];

// ── Phishing technique + difficulty per brand ─────────────────────
// Layered on top of the homepage definitions above so the look-alike
// domains span a real spread of tricks and difficulty levels:
//   easy   — obvious once you look (typos, digits-for-letters, http)
//   medium — correctly spelled but wrong domain (combosquat, wrong TLD)
//   hard   — invisible or structural (homoglyph, subdomain trick, @-trick)
const HG = HOMOGLYPH_NOTE;
const PHISH = {
  // ----- EASY: a careful reader can catch these -----
  PayPal: {
    difficulty: "easy", fakeScheme: "http", fake: "www.paypal-account.com",
    technique: "Not secure (http) + look-alike",
    lesson: "Two red flags: it's <b>http://</b> with no padlock (anything you type is sent unencrypted), and the real domain is <b>paypal-account.com</b> — not paypal.com.",
  },
  Google: {
    difficulty: "easy", fake: "accounts.gooogle.com",
    technique: "Misspelling (extra letter)",
    lesson: "Look closely — <b>gooogle</b> has three o's. A single extra letter is one of the most common and most-missed phishing tricks.",
  },
  Netflix: {
    difficulty: "easy", fake: "www.netflx.com",
    technique: "Misspelling (missing letter)",
    lesson: "<b>netflx</b> is missing the “i”. Dropped letters slip right past you when the page looks correct.",
  },
  Amazon: {
    difficulty: "easy", fake: "www.amaz0n.com",
    technique: "Misspelling (digit for letter)",
    lesson: "The “o” in amazon is the digit <b>0</b> (zero). Numbers swapped for letters are a classic look-alike.",
  },
  Facebook: {
    difficulty: "easy", fake: "www.faceb00k.com",
    technique: "Misspelling (digits for letters)",
    lesson: "Both o's are zeros: <b>faceb00k</b>. Obvious once you look — which is the whole point of looking.",
  },
  Discord: {
    difficulty: "easy", fake: "www.disc0rd.com",
    technique: "Misspelling (digit for letter)",
    lesson: "The “o” is a zero: <b>disc0rd</b>. Quick to catch if you actually read the domain.",
  },

  // ----- MEDIUM: spelled correctly, but the wrong domain -----
  Apple: {
    difficulty: "medium", fake: "www.apple-id.com",
    technique: "Look-alike domain (combosquat)",
    lesson: "<b>apple-id.com</b> is spelled correctly but isn't Apple. Apple ID sign-in only happens on <b>apple.com</b> (e.g. appleid.apple.com). Adding a word makes a brand-new, unrelated domain.",
  },
  Chase: {
    difficulty: "medium", fake: "www.chase-secure.com",
    technique: "Look-alike domain (clean fake)",
    lesson: "The reassuring <b>chase-secure.com</b> is the phish. Chase's real login is on ugly subdomains of <b>chase.com</b> like secure05ea.chase.com. “Looks official” is not a security signal.",
  },
  Microsoft: {
    difficulty: "medium", fake: "www.microsoft365-login.com",
    technique: "Look-alike domain (combosquat)",
    lesson: "Microsoft's genuine sign-in is the unfamiliar <b>login.microsoftonline.com</b>. The cleaner-sounding <b>microsoft365-login.com</b> is unrelated.",
  },
  Instagram: {
    difficulty: "medium", fake: "www.instagram-verify.com",
    technique: "Look-alike domain (combosquat)",
    lesson: "<b>instagram-verify.com</b> tacks a word onto the brand. Real Instagram is just <b>instagram.com</b> — the extra word means a different owner.",
  },
  Spotify: {
    difficulty: "medium", fake: "www.spotify-premium.com",
    technique: "Look-alike domain (combosquat)",
    lesson: "<b>spotify-premium.com</b> sounds like an upgrade page, but it's a separate domain. Spotify lives on <b>spotify.com</b>.",
  },
  Dropbox: {
    difficulty: "medium", fake: "www.dropbox-share.com",
    technique: "Look-alike domain (combosquat)",
    lesson: "A shared-file lure: <b>dropbox-share.com</b> is not Dropbox (<b>dropbox.com</b>). Hyphenated add-ons are fresh registrations.",
  },
  Slack: {
    difficulty: "medium", fake: "www.slack-login.com",
    technique: "Look-alike domain (combosquat)",
    lesson: "Slack workspaces live on <b>slack.com</b> (e.g. app.slack.com). <b>slack-login.com</b> just borrows the name.",
  },
  Steam: {
    difficulty: "medium", fake: "store.steampowered.co",
    technique: "Wrong TLD (.co vs .com)",
    lesson: "One missing letter in the ending: <b>.co</b> instead of <b>.com</b>. A different top-level domain is a different owner entirely.",
  },
  Reddit: {
    difficulty: "medium", fake: "www.reddit-login.com",
    technique: "Look-alike domain (combosquat)",
    lesson: "<b>reddit-login.com</b> is a separate domain. Reddit signs you in on <b>reddit.com</b> — no hyphenated helper domains.",
  },
  Twitch: {
    difficulty: "medium", fake: "www.twitch.com",
    technique: "Wrong TLD (.com vs .tv)",
    lesson: "Twitch streams on <b>twitch.tv</b>. <b>twitch.com</b> is a different registration — a correctly-spelled name says nothing about the TLD.",
  },
  "Wells Fargo": {
    difficulty: "medium", fake: "www.wellsfargo-online.com",
    technique: "Look-alike domain (combosquat)",
    lesson: "Real banking is on subdomains of <b>wellsfargo.com</b>. <b>wellsfargo-online.com</b> borrows the name with no typo to give it away.",
  },
  eBay: {
    difficulty: "medium", fake: "signin.ebay-secure.com",
    technique: "Look-alike domain (combosquat)",
    lesson: "The registrable domain here is <b>ebay-secure.com</b>, not ebay.com — “signin” is just a subdomain label the attacker chose.",
  },

  // ----- HARD: invisible or structural; even experts get fooled -----
  Coinbase: {
    difficulty: "hard", fake: "www.cоinbase.com", // Cyrillic о
    technique: "Homoglyph (Cyrillic “о”)",
    lesson: "The first “o” is a Cyrillic <b>о</b>, not a Latin o — pixel-identical. " + HG,
  },
  Twitter: {
    difficulty: "hard", fake: "twіtter.com", // Cyrillic і
    technique: "Homoglyph (Cyrillic “і”)",
    lesson: "The “i” is a Cyrillic <b>і</b> (U+0456), identical to a Latin i. " + HG,
  },
  GitHub: {
    difficulty: "hard", fake: "gіthub.com", // Cyrillic і
    technique: "Homoglyph (Cyrillic “і”)",
    lesson: "The “i” is a Cyrillic <b>і</b>, not a Latin i. " + HG,
  },
  LinkedIn: {
    difficulty: "hard", fake: "www.linkedin.com.secure-signin.net",
    technique: "Subdomain trick",
    lesson: "Read right-to-left: the real site is the part just before the first “/”. That's <b>secure-signin.net</b> — “linkedin.com” is only a subdomain label placed in front to fool a left-to-right reader.",
  },
  Adobe: {
    difficulty: "hard", fake: "account.adobe.com.id-verify.net",
    technique: "Subdomain trick",
    lesson: "Everything before <b>id-verify.net</b> is attacker-chosen text, including a fake “adobe.com”. The true domain is always the part just before the first slash.",
  },
  "Bank of America": {
    difficulty: "hard", fake: "secure.bankofamerica.com.login-alert.net",
    technique: "Subdomain trick",
    lesson: "The real registrable domain is <b>login-alert.net</b>. Attackers prepend “secure.bankofamerica.com” as subdomains so you see the bank first.",
  },
  Binance: {
    difficulty: "hard", fake: "accounts.binance.com@secure-wallet.io",
    technique: "The “@” trick",
    lesson: "Everything before the <b>@</b> in a URL is just a username and is ignored — the browser actually goes to <b>secure-wallet.io</b>. The “accounts.binance.com” is pure bait.",
  },
};
BRANDS.forEach((b) => { if (PHISH[b.name]) Object.assign(b, PHISH[b.name]); });

// ---------- State --------------------------------------------------
const state = {
  mode: null,        // 'eyes' | 'passkey'
  round: 0,          // 0-based index into deck
  score: 0,
  roundsChoice: 5,   // how many rounds the player picked (5 or 10)
  totalRounds: 5,    // rounds in the current game
  deck: [],          // random subset of BRANDS for this game
  realIsLeft: true,  // which window is the real one this round
  resolved: false,   // round already decided?
  results: [],       // per-round { difficulty, correct } for the summary
  passkey: {
    registered: false,
    credentialId: null,
    boundDomains: [], // legit domains the passkey "works" on
  },
};

const PK_STORE_KEY = "phishgame.passkey";
const STATS_KEY = "phishgame.stats";

// ---------- Element helpers ----------------------------------------
const $ = (sel) => document.querySelector(sel);

// ---------- Lifetime stats (persisted across sessions) -------------
function getStats() {
  let s = {};
  try { s = JSON.parse(localStorage.getItem(STATS_KEY)) || {}; } catch (_) { s = {}; }
  return {
    eyes: { rounds: 0, correct: 0, ...(s.eyes || {}) },
    passkey: { rounds: 0, correct: 0, ...(s.passkey || {}) },
  };
}
function addGameToStats(mode, rounds, correct) {
  const s = getStats();
  s[mode].rounds += rounds;
  s[mode].correct += correct;
  try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (_) { /* ignore */ }
}
function renderLifetime() {
  const s = getStats();
  const el = $("#lifetime-stats");
  if (!el) return;
  const total = s.eyes.rounds + s.passkey.rounds;
  if (!total) { el.innerHTML = ""; return; }
  const parts = [];
  if (s.eyes.rounds) parts.push(`👀 by eye <b>${Math.round((100 * s.eyes.correct) / s.eyes.rounds)}%</b>`);
  if (s.passkey.rounds) parts.push(`🔑 with passkey <b>${Math.round((100 * s.passkey.correct) / s.passkey.rounds)}%</b>`);
  el.innerHTML = `Lifetime — ${parts.join(" &nbsp;·&nbsp; ")} <span class="muted">(${total} round${total === 1 ? "" : "s"})</span>`;
}
function show(screenId) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(screenId).classList.add("active");
}
function openOverlay(id) { $(id).classList.add("active"); }
function closeOverlay(id) { $(id).classList.remove("active"); }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============================================================
//  Passkey registration (real WebAuthn where available)
// ============================================================
function loadStoredPasskey() {
  try {
    const raw = localStorage.getItem(PK_STORE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    state.passkey.registered = true;
    state.passkey.credentialId = data.credentialId || null;
    state.passkey.boundDomains = BRANDS.map((b) => b.legit);
    reflectPasskeyState();
  } catch (_) { /* ignore */ }
}

function reflectPasskeyState() {
  const statusEl = $("#passkey-status");
  const playBtn = $("#btn-play-passkey");
  const subEl = $("#passkey-mode-sub");
  if (state.passkey.registered) {
    statusEl.textContent = "✓ Passkey registered on this device.";
    statusEl.className = "passkey-status ok";
    playBtn.disabled = false;
    subEl.textContent = "You'll spot every phish";
  }
}

async function registerPasskey() {
  const statusEl = $("#passkey-status");
  statusEl.className = "passkey-status info";
  statusEl.textContent = "Waiting for your device (Touch ID / Windows Hello)…";

  // The honest path: a real platform passkey via WebAuthn.
  // Requires a secure context (https or localhost). Falls back
  // to a simulated passkey otherwise so the demo still works.
  const canWebAuthn =
    window.PublicKeyCredential &&
    window.isSecureContext &&
    typeof navigator.credentials?.create === "function";

  if (canWebAuthn) {
    try {
      const cred = await navigator.credentials.create({
        publicKey: {
          challenge: randomBytes(32),
          rp: { name: "Phish or Legit?" }, // RP ID defaults to current origin
          user: {
            id: randomBytes(16),
            name: "player@phishgame.demo",
            displayName: "Phish Game Player",
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },   // ES256
            { type: "public-key", alg: -257 }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            residentKey: "preferred",
            userVerification: "preferred",
          },
          timeout: 60000,
          attestation: "none",
        },
      });
      const id = bufToBase64Url(cred.rawId);
      finalizeRegistration(id, true);
      return;
    } catch (err) {
      if (err && err.name === "NotAllowedError") {
        statusEl.className = "passkey-status err";
        statusEl.textContent = "Passkey prompt was dismissed. Try again when ready.";
        return;
      }
      // Any other failure → fall back to simulated passkey.
      console.warn("WebAuthn unavailable, simulating:", err);
      finalizeRegistration("simulated-" + Date.now(), false);
      return;
    }
  }

  // No secure context (e.g. opened as a file://) → simulate.
  finalizeRegistration("simulated-" + Date.now(), false);
  $("#passkey-status").className = "passkey-status info";
  $("#passkey-status").textContent =
    "✓ Passkey registered (simulated — serve over https or localhost for a real Touch ID prompt).";
}

function finalizeRegistration(credentialId, real) {
  state.passkey.registered = true;
  state.passkey.credentialId = credentialId;
  state.passkey.boundDomains = BRANDS.map((b) => b.legit);
  try {
    localStorage.setItem(
      PK_STORE_KEY,
      JSON.stringify({ credentialId, real, at: Date.now() })
    );
  } catch (_) { /* ignore */ }
  reflectPasskeyState();
  if (real) {
    $("#passkey-status").className = "passkey-status ok";
    $("#passkey-status").textContent = "✓ Device-bound passkey created with Touch ID / Windows Hello.";
  }
}

// Authenticate with the real passkey (best-effort, for UX realism).
async function assertPasskey() {
  const canWebAuthn =
    window.PublicKeyCredential &&
    window.isSecureContext &&
    typeof navigator.credentials?.get === "function" &&
    state.passkey.credentialId &&
    !state.passkey.credentialId.startsWith("simulated");
  if (!canWebAuthn) return true; // simulated success
  try {
    await navigator.credentials.get({
      publicKey: {
        challenge: randomBytes(32),
        timeout: 60000,
        userVerification: "preferred",
        allowCredentials: [
          { type: "public-key", id: base64UrlToBuf(state.passkey.credentialId) },
        ],
      },
    });
    return true;
  } catch (err) {
    if (err && err.name === "NotAllowedError") return false;
    return true; // any other hiccup: don't punish the player
  }
}

// ---------- byte helpers -------------------------------------------
function randomBytes(n) {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return b;
}
function bufToBase64Url(buf) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (const byte of bytes) bin += String.fromCharCode(byte);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function base64UrlToBuf(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

// ============================================================
//  Game flow
// ============================================================
function startGame(mode) {
  state.mode = mode;
  state.round = 0;
  state.score = 0;
  state.results = [];
  state.totalRounds = Math.min(state.roundsChoice, BRANDS.length);
  // Draw a fresh random subset of distinct brands (no repeats), then
  // order them easy → hard so difficulty ramps up over the game.
  const rank = { easy: 0, medium: 1, hard: 2 };
  state.deck = shuffle(BRANDS)
    .slice(0, state.totalRounds)
    .sort((a, b) => (rank[a.difficulty] || 1) - (rank[b.difficulty] || 1));
  show("#screen-round");
  renderRound();
}

function renderRound() {
  state.resolved = false;
  state.realIsLeft = Math.random() < 0.5;
  const brand = state.deck[state.round];

  $("#round-counter").textContent = `Round ${state.round + 1} / ${state.totalRounds}`;
  $("#round-mode").textContent = state.mode === "eyes" ? "👀 Eyes" : "🔑 Passkey";
  $("#score").textContent = state.score;
  const diff = brand.difficulty || "medium";
  const diffEl = $("#round-diff");
  diffEl.textContent = diff[0].toUpperCase() + diff.slice(1);
  diffEl.className = "diff-pill diff-" + diff;

  // Scenario line
  const channel =
    brand.kind === "bank" ? "a text message" :
    brand.kind === "wallet" ? "a payment alert" :
    brand.kind === "crypto" ? "a withdrawal alert" :
    brand.kind === "work" ? "an email from IT" :
    brand.kind === "streaming" ? "a “payment declined” email" :
    brand.kind === "shopping" ? "an order-problem email" :
    brand.kind === "gaming" ? "a “new login” security alert" :
    brand.kind === "dev" ? "a security alert" :
    "an email";
  $("#scenario").innerHTML =
    `You clicked a link in ${channel} about your <strong>${brand.name}</strong> account. ` +
    `Two tabs opened — both look exactly like ${brand.name}'s real homepage. ` +
    (state.mode === "eyes"
      ? `<strong>Hit “Sign in” on the genuine one.</strong>`
      : `<strong>Hit “Sign in” — your passkey only works on the genuine one.</strong>`);

  // Build the two windows (each is a full brand homepage)
  const leftReal = state.realIsLeft;
  $("#windows").innerHTML = "";
  $("#windows").appendChild(buildWindow(brand, leftReal));
  $("#windows").appendChild(buildWindow(brand, !leftReal));

  const eyesHint =
    brand.difficulty === "easy"
      ? "The pages are identical — the address bar is your only clue, and this one's catchable. Sign in on the genuine site."
      : brand.difficulty === "hard"
      ? "The pages are identical and the address bar barely helps on this one. Pick the site you'd trust with your password — good luck."
      : "Both pages look right. Only one address bar actually belongs to " + brand.name + ". Sign in on the genuine one.";
  $("#round-hint").innerHTML =
    state.mode === "eyes"
      ? eyesHint
      : "Click “Sign in” on either tab. Your device — not your eyes — decides what's genuine.";
}

function buildWindow(brand, isReal) {
  const domain = isReal ? brand.legit : brand.fake;
  const win = document.createElement("div");
  win.className = "window";
  win.style.setProperty("--brand", brand.color);
  win.dataset.real = String(isReal);
  win.dataset.domain = domain;

  const signLabel = state.mode === "passkey" ? "🔑 Sign in" : "Sign in";

  // Most phishing sites have valid https certs too — so a padlock alone
  // proves nothing. A few easy rounds drop to http to teach that signal.
  const insecure = !isReal && brand.fakeScheme === "http";
  const scheme = insecure ? "http://" : "https://";
  const lock = insecure
    ? `<span class="lock insecure">⚠</span><span class="notsecure">Not secure</span>`
    : `<span class="lock secure">🔒</span>`;

  // Each window is a full, unique brand homepage. The ONLY real
  // difference is the host (and sometimes the scheme) in the address bar.
  win.innerHTML = `
    <div class="win-chrome">
      <div class="traffic"><span class="r"></span><span class="y"></span><span class="g"></span></div>
      <div class="urlbar">
        ${lock}
        <span class="host">${scheme}${domain}</span>
      </div>
    </div>
    <div class="site" style="--nav-bg:${brand.navBg};--nav-fg:${brand.navFg};--hero-bg:${brand.heroBg};--hero-fg:${brand.heroFg}">
      <nav class="site-nav">
        <div class="nav-brand"><span class="nav-mark">${brand.mark()}</span>${brand.nameHtml || `<span class="nav-name">${brand.name}</span>`}</div>
        ${brand.navExtra || ""}
        <div class="nav-right">
          <span class="nav-link">Help</span>
          <button class="signin-btn" data-act="signin">${signLabel}</button>
        </div>
      </nav>
      <div class="site-hero">${brand.home()}</div>
    </div>
  `;

  win.querySelector('[data-act="signin"]').addEventListener("click", (e) => {
    e.stopPropagation();
    onSignIn(win, isReal, brand);
  });

  return win;
}

// Single entry point for the "Sign in" button in either mode.
function onSignIn(win, isReal, brand) {
  if (state.mode === "eyes") onEyesPick(win, isReal);
  else onPasskeyAttempt(win, isReal, brand);
}

// Record a round outcome for the difficulty breakdown on the summary.
function recordResult(brand, correct) {
  state.results.push({ difficulty: brand.difficulty || "medium", correct: !!correct });
}

// ---------- Eyes mode: pure guess ----------------------------------
function onEyesPick(win, isReal) {
  if (state.resolved) return;
  state.resolved = true;
  const brand = state.deck[state.round];
  recordResult(brand, isReal);

  // flash verdicts on both windows
  markWindows(brand, win, isReal ? "real" : "fake");

  if (isReal) {
    state.score++;
    $("#score").textContent = state.score;
    resultOk(
      "🎉 Right — that one was real.",
      `Nicely spotted. ${brand.lesson} But be honest: were you sure, or was it a coin-flip?`,
      brand
    );
  } else {
    resultBad(
      "💀 Phished.",
      `You just handed your password to attackers. ${brand.lesson}`,
      brand
    );
  }
}

// ---------- Passkey mode: the browser knows ------------------------
async function onPasskeyAttempt(win, isReal, brand) {
  if (state.resolved) return;

  if (!isReal) {
    // Real browser behavior: NO credential is bound to this domain, so
    // the browser's passkey dialog comes up empty. We reproduce that
    // dialog, then explain what happened.
    state.resolved = true;
    recordResult(brand, true);
    showNoPasskeySheet(brand.fake, () => {
      markWindows(brand, win, "fake");
      state.score++; // correctly avoiding the phish counts as a win
      $("#score").textContent = state.score;
      resultBad(
        "🛡️ Phish blocked — by your passkey.",
        `Your browser looked for a passkey for <code>${brand.fake}</code> and found <strong>none</strong>. ` +
        `That's the tell — this isn't the site you registered with, no matter how convincing it looks. ` +
        `No password was typed, nothing was stolen. ${brand.lesson}`,
        brand,
        /*passkeyWin=*/true
      );
    });
    return;
  }

  // Real site: run the actual passkey ceremony (Touch ID) for realism.
  const btn = win.querySelector('[data-act="signin"]');
  btn.disabled = true;
  btn.textContent = "Verifying…";
  const ok = await assertPasskey();
  btn.disabled = false;
  btn.textContent = "🔑 Sign in";
  if (!ok) {
    // User cancelled the OS prompt — let them try again.
    return;
  }
  state.resolved = true;
  state.score++;
  recordResult(brand, true);
  $("#score").textContent = state.score;
  markWindows(brand, win, "real");
  resultOk(
    "✅ Signed in — instantly and safely.",
    `Your passkey matched <code>${brand.legit}</code>, so the sign-in just worked. ` +
    `No password, no code to type. The phishing tab never had a chance.`,
    brand,
    /*passkeyWin=*/true
  );
}

// Simulate the browser's own passkey dialog coming up empty on a site
// you never registered with — the real experience a phishing page hits.
function showNoPasskeySheet(domain, onClose) {
  const body = $("#pk-sheet-body");
  $("#pk-sheet-domain").textContent = domain;
  body.innerHTML =
    `<div class="pk-illus">🔑</div>` +
    `<div class="pk-searching"><span class="pk-spinner"></span> Checking this device for a passkey…</div>`;
  openOverlay("#passkey-sheet");
  setTimeout(() => {
    body.innerHTML =
      `<div class="pk-illus pk-illus-fail">🔑</div>` +
      `<div class="pk-title">No passkeys available</div>` +
      `<div class="pk-sub">There are no passkeys for <b>${domain}</b> on this device.<br>` +
      `Make sure you’re on the right website.</div>` +
      `<button class="btn btn-primary pk-close" id="pk-sheet-close">Close</button>`;
    $("#pk-sheet-close").addEventListener("click", () => {
      closeOverlay("#passkey-sheet");
      onClose();
    });
  }, 1300);
}

function markWindows(brand, clickedWin, clickedVerdict) {
  document.querySelectorAll("#windows .window").forEach((w) => {
    const real = w.dataset.real === "true";
    const verdict = real ? "real" : "fake";
    w.classList.add(verdict === "real" ? "verdict-real" : "verdict-fake");
    w.classList.remove("pick-hover");
    const tag = document.createElement("div");
    tag.className = "win-verdict " + verdict;
    tag.innerHTML = real
      ? `✓ REAL — ${brand.legit}`
      : `✕ FAKE — ${w.dataset.domain}`;
    w.insertBefore(tag, w.firstChild);
  });
}

// ---------- Result overlay -----------------------------------------
// Wrap the part of the fake domain that differs from the real one in a
// highlight, so the exact tell (a swapped char, an extra word, the @, …)
// jumps out — even when it's an invisible homoglyph.
function highlightDiff(legit, fake) {
  let p = 0;
  const maxP = Math.min(legit.length, fake.length);
  while (p < maxP && legit[p] === fake[p]) p++;
  let s = 0;
  while (
    s < maxP - p &&
    legit[legit.length - 1 - s] === fake[fake.length - 1 - s]
  ) s++;
  const mid = fake.slice(p, fake.length - s);
  if (!mid) return fake; // identical (shouldn't happen)
  return fake.slice(0, p) + `<span class="diffmark">${mid}</span>` + fake.slice(fake.length - s);
}

// The ASCII (punycode) form a real browser actually shows — only
// differs for homoglyph/IDN domains. This is the one tell eyes-mode
// players can rely on for the hard rounds.
function punycodeOf(host) {
  try {
    const h = new URL("https://" + host + "/").hostname;
    return /[^\x00-\x7F]/.test(host) && h !== host ? h : null;
  } catch (_) {
    return null;
  }
}

function buildReveal(brand) {
  const diff = brand.difficulty || "medium";
  const meta =
    `<div><span class="label">Technique:</span> ${brand.technique}` +
    ` <span class="diff-pill diff-${diff}" style="margin-left:6px">${diff[0].toUpperCase() + diff.slice(1)}</span></div>`;
  const fakeShown = highlightDiff(brand.legit, brand.fake);
  const puny = punycodeOf(brand.fake);
  const punyRow = puny
    ? `<div><span class="label">Real browser shows:</span> <span class="bad">${puny}</span> — the “xn--” form unmasks the trick</div>`
    : "";
  if (state.mode === "passkey") {
    return `
      <div><span class="label">Real domain:</span> <span class="ok">${brand.legit}</span> — passkey bound here ✓</div>
      <div><span class="label">Fake domain:</span> <span class="bad">${fakeShown}</span> — no passkey, browser refuses ✕</div>
      ${punyRow}
      ${meta}`;
  }
  return `
    <div><span class="label">Real:</span> <span class="ok">${brand.legit}</span></div>
    <div><span class="label">Fake:</span> <span class="bad">${fakeShown}</span></div>
    ${punyRow}
    ${meta}`;
}

function showResult(title, body, brand) {
  $("#result-icon").textContent = "";
  $("#result-title").textContent = title;
  $("#result-body").innerHTML = body;
  $("#result-reveal").innerHTML = buildReveal(brand);
  // Offer the inline passkey demo only in eyes mode (passkey mode just showed it).
  const demoBtn = $("#btn-passkey-demo");
  demoBtn.style.display = state.mode === "eyes" ? "" : "none";
  demoBtn.textContent = "🛡️ See what a passkey would do here";
  openOverlay("#result-overlay");
}
function resultOk(title, body, brand) { showResult(title, body, brand); }
function resultBad(title, body, brand) { showResult(title, body, brand); }

function nextRound() {
  closeOverlay("#result-overlay");
  state.round++;
  if (state.round >= state.totalRounds) {
    showSummary();
  } else {
    renderRound();
  }
}

// ---------- Summary ------------------------------------------------
function showSummary() {
  show("#screen-summary");
  const s = state.score;
  const T = state.totalRounds;
  $("#summary-score").textContent = `${s} / ${T}`;
  renderBreakdown();
  addGameToStats(state.mode, T, s);
  renderLifetime();

  if (state.mode === "eyes") {
    $("#summary-badge").textContent = s >= T ? "🍀" : "🎣";
    $("#summary-title").textContent =
      s >= T ? "You ran the gauntlet… on luck." : "That's how phishing wins.";
    $("#summary-body").innerHTML =
      s >= T
        ? "A perfect run — but real users do this dozens of times a day, half-distracted. Eventually everyone slips."
        : "You can't out-stare a phishing page. The difference is a single invisible character in the address bar.";
    $("#summary-cta").innerHTML =
      `<strong>Now try it with a passkey.</strong> Register one on the title screen and play again — ` +
      `you'll catch <em>every</em> phish, because your passkey simply won't work on the fake domain.`;
  } else {
    $("#summary-badge").textContent = "🛡️";
    $("#summary-title").textContent = "Flawless. Every phish, caught.";
    $("#summary-body").innerHTML =
      `You scored <strong>${s}/${T}</strong> — and you'd hit that every time. ` +
      `Your passkey did the spotting for you.`;
    $("#summary-cta").innerHTML =
      `<strong>That's the whole point.</strong> A device-bound passkey is locked to the real domain, ` +
      `so a look-alike site gets nothing. No password to phish, nothing to type, nothing to steal — ` +
      `and signing in was <em>faster</em> than typing one.`;
  }
}

// Per-difficulty accuracy bars on the summary screen.
function renderBreakdown() {
  const order = ["easy", "medium", "hard"];
  const tally = { easy: [0, 0], medium: [0, 0], hard: [0, 0] };
  state.results.forEach((r) => {
    const t = tally[r.difficulty] || (tally[r.difficulty] = [0, 0]);
    t[1]++;
    if (r.correct) t[0]++;
  });
  const rows = order
    .filter((d) => tally[d][1] > 0)
    .map((d) => {
      const [got, tot] = tally[d];
      const pct = Math.round((got / tot) * 100);
      const label = d[0].toUpperCase() + d.slice(1);
      return (
        `<div class="bd-row">` +
        `<span class="diff-pill diff-${d}">${label}</span>` +
        `<div class="bd-bar"><div class="bd-fill diff-fill-${d}" style="width:${pct}%"></div></div>` +
        `<span class="bd-score">${got}/${tot}</span>` +
        `</div>`
      );
    })
    .join("");
  $("#summary-breakdown").innerHTML =
    `<div class="bd-title">${state.mode === "eyes" ? "By eye" : "With your passkey"} — accuracy by difficulty</div>` + rows;
}

// ============================================================
//  Wiring
// ============================================================
function init() {
  loadStoredPasskey();
  renderLifetime();

  $("#btn-register").addEventListener("click", registerPasskey);

  // "See what a passkey would do here" on an eyes-mode result.
  $("#btn-passkey-demo").addEventListener("click", () => {
    const brand = state.deck[state.round];
    if (brand) showNoPasskeySheet(brand.fake, () => {});
  });

  // Game-length selector (5 or 10 rounds)
  $("#rounds-seg").querySelectorAll(".seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.roundsChoice = parseInt(btn.dataset.rounds, 10);
      $("#rounds-seg").querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
  $("#btn-play-eyes").addEventListener("click", () => startGame("eyes"));
  $("#btn-play-passkey").addEventListener("click", () => {
    if (!state.passkey.registered) return;
    startGame("passkey");
  });
  $("#btn-next").addEventListener("click", nextRound);
  $("#btn-quit").addEventListener("click", () => { closeOverlay("#result-overlay"); show("#screen-title"); });
  $("#btn-replay").addEventListener("click", () => startGame(state.mode));
  $("#btn-home").addEventListener("click", () => show("#screen-title"));

  $("#btn-how").addEventListener("click", () => openOverlay("#how-overlay"));
  $("#btn-how-close").addEventListener("click", () => closeOverlay("#how-overlay"));
  $("#btn-how-close-2").addEventListener("click", () => closeOverlay("#how-overlay"));
  $("#how-overlay").addEventListener("click", (e) => {
    if (e.target.id === "how-overlay") closeOverlay("#how-overlay");
  });
}

// ============================================================
//  Shared brand helpers (used by the 17 templated scenarios)
// ============================================================
function homoglyphLesson(charDesc) {
  return (
    "One letter in the fake is a " + charDesc + ", not the Latin character it mimics — so the two addresses " +
    "are indistinguishable to the eye. " + HOMOGLYPH_NOTE
  );
}

// A simple app-icon style monogram: rounded square in the brand colour
// with a 1–2 character label. Single centred glyph never clips.
function monogram(label, bg, fg) {
  fg = fg || "#ffffff";
  const fontSize = label.length > 1 ? 15 : 21;
  return (
    `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">` +
    `<rect width="36" height="36" rx="9" fill="${bg}"/>` +
    `<text x="18" y="${label.length > 1 ? 23 : 25}" text-anchor="middle" ` +
    `font-family="-apple-system,Segoe UI,Arial,sans-serif" font-size="${fontSize}" font-weight="700" fill="${fg}">${label}</text>` +
    `</svg>`
  );
}

// Reusable hero layouts. Colours come from the window's CSS vars.
function heroCenter(o) {
  return (
    `<div class="hero-c">` +
    (o.eyebrow ? `<p class="eyebrow">${o.eyebrow}</p>` : "") +
    `<h1>${o.h1}</h1>` +
    (o.sub ? `<p class="lede">${o.sub}</p>` : "") +
    (o.cta ? `<button class="hero-pill">${o.cta}</button>` : "") +
    `</div>`
  );
}
function heroTiles(o) {
  return (
    `<div class="hero-c"><h1>${o.h1}</h1>` +
    (o.sub ? `<p class="lede">${o.sub}</p>` : "") +
    `<div class="tile-row">` +
    o.tiles.map((t) => `<span class="tile" style="background:${t.bg}">${t.label}</span>`).join("") +
    `</div></div>`
  );
}
function heroChips(o) {
  return (
    `<div class="hero-c"><h1>${o.h1}</h1>` +
    (o.sub ? `<p class="lede">${o.sub}</p>` : "") +
    `<div class="chip-row">` +
    o.chips.map((c) => `<span class="chip">${c}</span>`).join("") +
    `</div></div>`
  );
}
function heroCards(o) {
  return (
    `<div class="hero-c"><h1>${o.h1}</h1>` +
    (o.sub ? `<p class="lede">${o.sub}</p>` : "") +
    `<div class="card-row">` +
    o.cards.map((c) => `<div class="mini-card">${c}</div>`).join("") +
    `</div></div>`
  );
}

// ============================================================
//  Inline brand logos (SVG) — recognizable approximations, no
//  external assets. Pure shapes (no SVG <text>, which clipped),
//  each coloured to sit on its brand's nav background.
// ============================================================
// Multicolour "Google" wordmark, used in the nav and the hero.
function googleWordmark(size) {
  const s = size || 19;
  const colors = ["#4285F4", "#EA4335", "#FBBC05", "#4285F4", "#34A853", "#EA4335"];
  const letters = "Google";
  let html = `<span style="font-family:'Product Sans',Arial,sans-serif;font-weight:500;font-size:${s}px;letter-spacing:-0.5px">`;
  for (let i = 0; i < letters.length; i++) {
    html += `<span style="color:${colors[i]}">${letters[i]}</span>`;
  }
  return html + "</span>";
}

function logoMicrosoft() {
  return `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="12" height="12" fill="#F25022"/><rect x="20" y="4" width="12" height="12" fill="#7FBA00"/><rect x="4" y="20" width="12" height="12" fill="#00A4EF"/><rect x="20" y="20" width="12" height="12" fill="#FFB900"/></svg>`;
}
function logoPaypal() {
  // Two interlocking "P" droplets.
  return `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M11 6h9.5c4 0 6.5 2.6 5.8 6.4-.7 3.9-3.9 6.1-8 6.1h-3.1l-1.4 8.5H8.4z" fill="#003087"/><path d="M16.5 10h9.5c4 0 6.5 2.6 5.8 6.4-.7 3.9-3.9 6.1-8 6.1h-3.1L19.3 31H14z" fill="#0070ba" opacity="0.85"/></svg>`;
}
function logoApple() {
  // White apple — sits on Apple's dark nav.
  return `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M24.8 19.2c0-3.1 2.5-4.6 2.6-4.7-1.4-2.1-3.6-2.4-4.4-2.4-1.9-.2-3.6 1.1-4.6 1.1-.9 0-2.4-1.1-3.9-1-2 0-3.9 1.2-4.9 3-2.1 3.7-.5 9.1 1.5 12.1 1 1.5 2.2 3.1 3.7 3 1.5-.1 2-.9 3.8-.9s2.3.9 3.9.9 2.6-1.4 3.6-2.9c1.1-1.6 1.6-3.2 1.6-3.3-.1 0-3.1-1.2-3.1-4.7z" fill="#f5f5f7"/><path d="M22 11.1c.8-1 1.4-2.4 1.2-3.8-1.2.05-2.6.8-3.4 1.8-.8.8-1.5 2.2-1.3 3.5 1.3.1 2.7-.7 3.5-1.5z" fill="#f5f5f7"/></svg>`;
}
function logoAmazon() {
  // Smile arrow only — the "amazon" wordmark is HTML in the nav.
  return `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M5 21c6 4.6 20 4.6 26 0" stroke="#FF9900" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18.6l4 2.4-4.2 2.2" fill="#FF9900"/></svg>`;
}
function logoGoogle() {
  return `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M18 16.4v3.6h5.1c-.2 1.3-1.6 3.9-5.1 3.9a5.9 5.9 0 0 1 0-11.8c1.7 0 2.8.7 3.5 1.4l2.5-2.4A9.6 9.6 0 1 0 18 27.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.07-1.1-.16-1.6z" fill="#4285F4"/><path d="M18 12.1c1.7 0 2.8.7 3.5 1.4l2.5-2.4A9.6 9.6 0 0 0 9.6 13l3.2 2.5c.8-2.3 2.9-3.4 5.2-3.4z" fill="#EA4335"/><path d="M27.04 16.6H18v3.6h5.1c-.5 2.5-2.6 3.9-5.1 3.9-2.3 0-4.4-1.1-5.2-3.4L9.6 23a9.6 9.6 0 0 0 17.6-4.8c0-.6-.07-1.1-.16-1.6z" fill="#34A853"/><path d="M12.8 20.7a5.9 5.9 0 0 1 0-5.4L9.6 13a9.6 9.6 0 0 0 0 10z" fill="#FBBC05"/></svg>`;
}
function logoNetflix() {
  return `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M11 3h4.4l5.2 14.6V3H25v30h-4.4l-5.2-14.6V33H11z" fill="#E50914"/></svg>`;
}
function logoChase() {
  // White octagon with a blue centre — sits on Chase's blue nav.
  return `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M14 3h8l6 6v8l-6 6h-8l-6-6V9z" fill="#ffffff"/><rect x="14.5" y="14.5" width="7" height="7" rx="1" fill="#117ACA"/></svg>`;
}
function logoCoinbase() {
  return `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="14" fill="#1652f0"/><rect x="13.5" y="13.5" width="9" height="9" rx="1.5" fill="#fff"/></svg>`;
}

document.addEventListener("DOMContentLoaded", init);
