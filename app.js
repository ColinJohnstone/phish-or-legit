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

  // ── 12 more brands to span every technique family (phishing data in
  //    the PHISH table below). ─────────────────────────────────────────
  {
    name: "YouTube", color: "#ff0000", kind: "streaming",
    navBg: "#ffffff", navFg: "#0f0f0f", heroBg: "#ffffff", heroFg: "#0f0f0f", legit: "www.youtube.com",
    mark: () => monogram("▶", "#ff0000"),
    home: () => heroCenter({ h1: "Enjoy the videos and music you love.", sub: "Sign in to like, comment, and subscribe.", cta: "Sign in" }),
  },
  {
    name: "Yahoo", color: "#6001d2", kind: "email",
    navBg: "#ffffff", navFg: "#1d2228", heroBg: "#f0e6ff", heroFg: "#1d2228", legit: "www.yahoo.com",
    mark: () => monogram("Y!", "#6001d2"),
    home: () => heroCenter({ h1: "Yahoo Mail", sub: "Sign in to your inbox, news, and finance.", cta: "Sign in" }),
  },
  {
    name: "FedEx", color: "#4d148c", kind: "shopping",
    navBg: "#4d148c", navFg: "#ffffff", heroBg: "#ffffff", heroFg: "#2c2c2c", legit: "www.fedex.com",
    mark: () => monogram("Fx", "#4d148c"),
    home: () => heroCards({ h1: "Track your package.", sub: "Sign in to manage shipments and deliveries.", cards: ["Track", "Ship", "Manage"] }),
  },
  {
    name: "DHL", color: "#d40511", kind: "shopping",
    navBg: "#ffcc00", navFg: "#d40511", heroBg: "#ffffff", heroFg: "#1a1a1a", legit: "www.dhl.com",
    mark: () => monogram("DHL", "#ffcc00", "#d40511"),
    home: () => heroCards({ h1: "Your parcel is on its way.", sub: "Sign in to track and reschedule deliveries.", cards: ["Track", "Redeliver", "Locations"] }),
  },
  {
    name: "UPS", color: "#351c15", kind: "shopping",
    navBg: "#351c15", navFg: "#ffb500", heroBg: "#ffffff", heroFg: "#351c15", legit: "www.ups.com",
    mark: () => monogram("UPS", "#ffb500", "#351c15"),
    home: () => heroCards({ h1: "Track. Ship. Deliver.", sub: "Sign in to UPS My Choice to manage packages.", cards: ["Tracking", "Shipping", "My Choice"] }),
  },
  {
    name: "Zoom", color: "#2d8cff", kind: "work",
    navBg: "#ffffff", navFg: "#232333", heroBg: "#f7faff", heroFg: "#232333", legit: "zoom.us",
    mark: () => monogram("Z", "#2d8cff"),
    home: () => heroCenter({ h1: "Meet happy.", sub: "Sign in to start or join a meeting.", cta: "Sign in" }),
  },
  {
    name: "Roblox", color: "#e2231a", kind: "gaming",
    navBg: "#ffffff", navFg: "#393b3d", heroBg: "#f2f4f5", heroFg: "#393b3d", legit: "www.roblox.com",
    mark: () => monogram("R", "#e2231a"),
    home: () => heroCenter({ h1: "Powering imagination.", sub: "Log in to play millions of experiences.", cta: "Log In" }),
  },
  {
    name: "Uber", color: "#000000", kind: "shopping",
    navBg: "#000000", navFg: "#ffffff", heroBg: "#ffffff", heroFg: "#000000", legit: "www.uber.com",
    mark: () => monogram("U", "#000000"),
    home: () => heroCenter({ h1: "Go anywhere with Uber.", sub: "Sign in to request a ride in minutes.", cta: "Sign in" }),
  },
  {
    name: "Airbnb", color: "#ff385c", kind: "shopping",
    navBg: "#ffffff", navFg: "#222222", heroBg: "#ffffff", heroFg: "#222222", legit: "www.airbnb.com",
    mark: () => monogram("A", "#ff385c"),
    home: () => heroCenter({ h1: "Find your next stay.", sub: "Log in to book homes and experiences.", cta: "Continue" }),
  },
  {
    name: "Walmart", color: "#0071dc", kind: "shopping",
    navBg: "#0071dc", navFg: "#ffffff", heroBg: "#ffffff", heroFg: "#1a1a1a", legit: "www.walmart.com",
    mark: () => monogram("W", "#0071dc"),
    home: () => heroCards({ h1: "Save money. Live better.", sub: "Sign in to track orders and reorder faster.", cards: ["Grocery", "Electronics", "Home"] }),
  },
  {
    name: "Disney+", color: "#0e47d6", kind: "streaming",
    navBg: "#0e1631", navFg: "#ffffff", heroBg: "#0a0e23", heroFg: "#ffffff", legit: "www.disneyplus.com",
    mark: () => monogram("D+", "#0e47d6", "#fff"),
    home: () => heroCenter({ h1: "The best stories, all in one place.", sub: "Sign in to stream Disney, Pixar, Marvel & more.", cta: "Log In" }),
  },
  {
    name: "Salesforce", color: "#00a1e0", kind: "work",
    navBg: "#ffffff", navFg: "#032d60", heroBg: "#f3f6fb", heroFg: "#032d60", legit: "login.salesforce.com",
    mark: () => monogram("SF", "#00a1e0"),
    home: () => heroCards({ h1: "Welcome back to Salesforce.", sub: "Log in to your CRM dashboard.", cards: ["Sales", "Service", "Marketing"] }),
  },

  // ── 6 more brands, each introducing a fresh technique family ──
  {
    name: "Apple", color: "#0071e3", kind: "email",
    navBg: "#161617", navFg: "#f5f5f7", heroBg: "#000000", heroFg: "#f5f5f7", legit: "appleid.apple.com",
    mark: logoApple, nameHtml: ``,
    home: () => `<div class="ap-hero"><p class="eyebrow" style="color:#f5f5f7;opacity:.7">Apple Account</p><h1 style="font-size:2.1rem">Sign in.</h1><p class="lede">One account for everything Apple.</p></div>`,
  },
  {
    name: "Netflix", color: "#e50914", kind: "streaming",
    navBg: "transparent", navFg: "#ffffff", heroBg: "#000000", heroFg: "#ffffff", legit: "www.netflix.com",
    mark: logoNetflix, nameHtml: `<span style="color:#e50914;font-weight:800;letter-spacing:1px;font-size:1.05rem">NETFLIX</span>`,
    home: () => heroCenter({ h1: "Unlimited movies, TV shows, and more.", sub: "Sign in to continue watching.", cta: "Sign In" }),
  },
  {
    name: "USPS", color: "#004b87", kind: "shopping",
    navBg: "#004b87", navFg: "#ffffff", heroBg: "#ffffff", heroFg: "#1a1a1a", legit: "www.usps.com",
    mark: () => monogram("US", "#004b87", "#fff"),
    home: () => heroCards({ h1: "Track & Manage your mail.", sub: "Sign in to schedule redelivery and holds.", cards: ["Track", "Redelivery", "Hold Mail"] }),
  },
  {
    name: "Pinterest", color: "#e60023", kind: "social",
    navBg: "#ffffff", navFg: "#111111", heroBg: "#fff8f8", heroFg: "#111111", legit: "www.pinterest.com",
    mark: () => monogram("P", "#e60023"),
    home: () => heroCenter({ h1: "Get your next great idea.", sub: "Log in to see ideas made for you.", cta: "Log in" }),
  },
  {
    name: "WhatsApp", color: "#25d366", kind: "social",
    navBg: "#075e54", navFg: "#ffffff", heroBg: "#ece5dd", heroFg: "#111111", legit: "web.whatsapp.com",
    mark: () => monogram("W", "#25d366"),
    home: () => heroCenter({ h1: "Message privately.", sub: "Scan the code or sign in to use WhatsApp Web.", cta: "Sign in" }),
  },
  {
    name: "Snapchat", color: "#111111", kind: "social",
    navBg: "#fffc00", navFg: "#111111", heroBg: "#fffc00", heroFg: "#111111", legit: "accounts.snapchat.com",
    mark: () => monogram("S", "#111111", "#fffc00"),
    home: () => heroCenter({ h1: "Open Snapchat on the web.", sub: "Log in to chat with friends.", cta: "Log in" }),
  },
];

// ── Phishing technique + difficulty per brand ─────────────────────
// Layered on top of the homepage definitions above so the look-alike
// domains span a real spread of tricks and difficulty levels:
//   easy   — obvious once you look (typos, digits-for-letters, http)
//   medium — correctly spelled but wrong domain (combosquat, wrong TLD)
//   hard   — invisible or structural (homoglyph, subdomain trick, @-trick)
const HG = HOMOGLYPH_NOTE;
// Every URL carries a realistic login subdomain + path, so the real and
// fake are comparable in length and prefix — you can't win by "pick the
// shorter one." The real banks/carriers genuinely use long URLs.
const PHISH = {
  // ─── Character omission (drop a letter) — EASY ───
  Google:    { difficulty: "easy", legit: "accounts.google.com/signin", fake: "accounts.gogle.com/signin",
    technique: "Typosquat — omission", lesson: "A letter is missing: <b>gogle</b> drops an “o”. Skim-readers never notice a dropped character." },
  Amazon:    { difficulty: "easy", legit: "www.amazon.com/ap/signin", fake: "www.amzon.com/ap/signin",
    technique: "Typosquat — omission", lesson: "<b>amzon</b> is missing the “a”. The brand still reads right at a glance — that's the trap." },
  Facebook:  { difficulty: "easy", legit: "www.facebook.com/login", fake: "www.facebok.com/login",
    technique: "Typosquat — omission", lesson: "<b>facebok</b> drops an “o”. One missing letter in a familiar word is easy to miss." },
  LinkedIn:  { difficulty: "easy", legit: "www.linkedin.com/login", fake: "www.linkdin.com/login",
    technique: "Typosquat — omission", lesson: "<b>linkdin</b> is missing the “e”. Your brain auto-corrects it to the real word." },
  Slack:     { difficulty: "easy", legit: "app.slack.com/signin", fake: "app.sack.com/signin",
    technique: "Typosquat — omission", lesson: "Drop the “l” and Slack becomes <b>sack</b> — a different, unrelated domain entirely." },
  Adobe:     { difficulty: "easy", legit: "account.adobe.com/sign-in", fake: "account.adob.com/sign-in",
    technique: "Typosquat — omission", lesson: "<b>adob</b> drops the trailing “e”. Truncated brand names are a classic look-alike." },

  // ─── Substitution & transposition — EASY/MEDIUM ───
  YouTube:   { difficulty: "easy", legit: "www.youtube.com/account", fake: "www.yuotube.com/account",
    technique: "Typosquat — transposition", lesson: "Two letters are flipped: <b>yuotube</b> swaps “ou” for “uo”. Transposed letters read almost normally." },
  Yahoo:     { difficulty: "easy", legit: "login.yahoo.com/account", fake: "login.yaho0.com/account",
    technique: "Typosquat — digit for letter", lesson: "The last “o” is a zero: <b>yaho0</b>. Numbers standing in for letters are a staple of phishing." },
  Twitter:   { difficulty: "medium", legit: "www.twitter.com/i/flow/login", fake: "www.twitterr.com/i/flow/login",
    technique: "Typosquat — doubled letter", lesson: "An extra “r”: <b>twitterr</b>. Doubled letters slip past quick reads — and the page is a perfect copy." },
  Instagram: { difficulty: "medium", legit: "www.instagram.com/accounts/login", fake: "www.instargam.com/accounts/login",
    technique: "Typosquat — transposition", lesson: "“ra” becomes “ar”: <b>instargam</b>. The letters are all correct, just two of them are swapped." },
  GitHub:    { difficulty: "medium", legit: "github.com/login", fake: "githbu.com/login",
    technique: "Typosquat — transposition", lesson: "“ub” becomes “bu”: <b>githbu</b>. A flipped pair at the end is genuinely hard to catch." },
  Spotify:   { difficulty: "hard", legit: "accounts.spotify.com/login", fake: "accounts.spotıfy.com/login",
    technique: "Homoglyph — dotless “ı”", lesson: "The “i” is a Turkish dotless <b>ı</b> (U+0131) — same shape, missing only the dot. " + HG },

  // ─── Subdomain stuffing (real brand as a subdomain) — HARD ───
  Chase:           { difficulty: "hard", legit: "secure.chase.com/web/auth/login", fake: "chase.com.login.verify-identity.net/auth",
    technique: "Subdomain stuffing", lesson: "Read right-to-left: the real domain is <b>verify-identity.net</b>. “chase.com” is just a subdomain label glued on the front to fool a left-to-right reader." },
  "Wells Fargo":   { difficulty: "hard", legit: "connect.secure.wellsfargo.com/auth/login", fake: "wellsfargo.com.secure.accounts.web-login.space/signon",
    technique: "Subdomain stuffing", lesson: "The actual site is <b>web-login.space</b> — everything before it is attacker-chosen text, including a fake “wellsfargo.com”." },
  "Bank of America": { difficulty: "hard", legit: "secure.bankofamerica.com/login/sign-in/signOn", fake: "bankofamerica.com.security.update-auth.info/login",
    technique: "Subdomain stuffing", lesson: "The registrable domain is <b>update-auth.info</b>, not bankofamerica.com. The bank name is only a subdomain prefix." },
  FedEx:           { difficulty: "hard", legit: "www.fedex.com/en-us/tracking/manage", fake: "fedex.com.package-tracking.shipment-delivery.top/track",
    technique: "Subdomain stuffing", lesson: "The real domain is <b>shipment-delivery.top</b>. Delivery-themed subdomains make the long chain feel plausible." },
  DHL:             { difficulty: "hard", legit: "www.dhl.com/en/express/tracking.html", fake: "dhl.com.alert.delivery-status.holding-facility.site/track",
    technique: "Subdomain stuffing", lesson: "The site is actually <b>holding-facility.site</b>. “dhl.com” at the start is bait — the truth is always the last two labels." },
  UPS:             { difficulty: "hard", legit: "www.ups.com/track/manage/mychoice", fake: "ups.com.mychoice.package.reschedule-portal.biz/track",
    technique: "Subdomain stuffing", lesson: "The owner of this page is <b>reschedule-portal.biz</b>. UPS branding is stuffed into the subdomains to hide that." },

  // ─── Look-alike top-level domains — MEDIUM ───
  Zoom:    { difficulty: "medium", legit: "zoom.us/signin", fake: "zoom.download/signin",
    technique: "Wrong TLD", lesson: "Correct name, wrong ending. Zoom is <b>zoom.us</b>; <b>zoom.download</b> is a cheap generic TLD owned by someone else." },
  Discord: { difficulty: "medium", legit: "discord.com/login", fake: "discord.support/login",
    technique: "Wrong TLD", lesson: "Discord lives on <b>discord.com</b>. The friendly-looking <b>discord.support</b> is a different registration entirely." },
  Steam:   { difficulty: "medium", legit: "store.steampowered.com/login", fake: "store.steampowered.gl/login",
    technique: "Wrong TLD", lesson: "Steam's store is <b>steampowered.com</b>. Swapping to <b>.gl</b> makes a brand-new domain that just looks official." },
  Roblox:  { difficulty: "medium", legit: "www.roblox.com/login", fake: "www.roblox.login/account",
    technique: "Wrong TLD", lesson: "<b>roblox.login</b> reads like a sign-in page, but “.login” is a TLD — the real site is <b>roblox.com</b>." },
  Uber:    { difficulty: "medium", legit: "auth.uber.com/login", fake: "auth.uber.help/login",
    technique: "Wrong TLD", lesson: "A support-looking <b>uber.help</b> is not Uber. The genuine domain is <b>uber.com</b>." },
  Airbnb:  { difficulty: "medium", legit: "www.airbnb.com/login", fake: "www.airbnb.rentals/login",
    technique: "Wrong TLD", lesson: "<b>airbnb.rentals</b> sounds on-brand, but it's a separate domain. Airbnb is <b>airbnb.com</b>." },

  // ─── Visual deception: blended Latin letters (comb-glyphs) — HARD ───
  Walmart:    { difficulty: "hard", legit: "www.walmart.com/account/login", fake: "www.walrnart.com/account/login",
    technique: "Comb-glyph (rn → m)", lesson: "There's no “m” — it's “r” + “n”: <b>walrnart</b>. Side by side, “rn” is nearly indistinguishable from “m”." },
  Microsoft:  { difficulty: "hard", legit: "login.microsoft.com/account", fake: "login.rnicrosoft.com/account",
    technique: "Comb-glyph (rn → m)", lesson: "That “m” is actually “rn”: <b>rnicrosoft</b>. The blended pair fakes a single letter." },
  "Disney+":  { difficulty: "hard", legit: "www.disneyplus.com/login", fake: "www.disneypIus.com/login",
    technique: "Comb-glyph (capital I → l)", lesson: "The “l” is a capital “I”: disneyp<b>I</b>us. In many fonts capital-I and lowercase-l are identical." },
  Salesforce: { difficulty: "hard", legit: "login.salesforce.com/sign-in", fake: "login.saIesforce.com/sign-in",
    technique: "Comb-glyph (capital I → l)", lesson: "“salesforce” uses a capital “I” for the “l”: sa<b>I</b>esforce. Same pixel shape, different character." },
  Twitch:     { difficulty: "medium", legit: "www.twitch.tv/login", fake: "www.twltch.tv/login",
    technique: "Comb-glyph (l → i)", lesson: "The “i” is really a lowercase “l”: tw<b>l</b>tch. The missing dot is the only clue." },
  eBay:       { difficulty: "medium", legit: "signin.ebay.com/signin", fake: "signin.ebav.com/signin",
    technique: "Comb-glyph (v → y)", lesson: "The “y” is a “v”: <b>ebav</b>. In some sans-serif fonts a “v” passes for a “y” at a glance." },

  // ─── Distinct extras (not in the core five) ───
  PayPal:  { difficulty: "easy", fakeScheme: "http", legit: "www.paypal.com/signin", fake: "www.paypal-account.com/signin",
    technique: "Not secure (http) + look-alike", lesson: "Two red flags: it's <b>http://</b> with no padlock, and the real domain is <b>paypal-account.com</b> — not paypal.com." },
  Coinbase: { difficulty: "hard", legit: "www.coinbase.com/signin", fake: "www.cоinbase.com/signin",
    technique: "Homoglyph (Cyrillic “о”)", lesson: "The first “o” is a Cyrillic <b>о</b>, not a Latin o — pixel-identical. " + HG },
  Binance: { difficulty: "hard", legit: "accounts.binance.com/en/user/login", fake: "accounts.binance.com@secure-wallet.io/login",
    technique: "The “@” trick", lesson: "Everything before the <b>@</b> is just a username and is ignored — the browser actually goes to <b>secure-wallet.io</b>. The “accounts.binance.com” is pure bait." },

  // ─── New technique families ───
  Apple:     { difficulty: "medium", legit: "appleid.apple.com/sign-in", fake: "apple-id-verify.com/sign-in",
    technique: "Look-alike domain (combosquat)", lesson: "<b>apple-id-verify.com</b> bolts extra words onto the brand. Apple ID sign-in only happens on <b>apple.com</b> — the added words make a brand-new, unrelated domain." },
  Netflix:   { difficulty: "hard", legit: "www.netflix.com/login", fake: "account-billing.net/netflix/login",
    technique: "Brand hidden in the path", lesson: "The word “netflix” here is in the <b>path</b>, not the domain. The actual site is <b>account-billing.net</b> — what comes before the first single “/” is all that matters." },
  USPS:      { difficulty: "hard", legit: "tools.usps.com/go/TrackConfirmAction", fake: "package-status.info/usps/redelivery",
    technique: "Brand hidden in the path", lesson: "“usps” sits in the <b>path</b>; the real domain is <b>package-status.info</b>. A brand name after the first “/” means nothing." },
  Pinterest: { difficulty: "medium", legit: "www.pinterest.com/login", fake: "wwwpinterest.com/login",
    technique: "Run-together “www” (missing dot)", lesson: "There's no dot after “www”: <b>wwwpinterest.com</b> is a single label — a different domain from <b>www.pinterest.com</b>." },
  WhatsApp:  { difficulty: "medium", legit: "web.whatsapp.com/", fake: "web.whatsapp.cm/",
    technique: "TLD typo (.cm vs .com)", lesson: "The ending is <b>.cm</b> (Cameroon), not <b>.com</b> — a one-letter TLD typo that catches fast fingers and fast eyes alike." },
  Snapchat:  { difficulty: "easy", legit: "accounts.snapchat.com/login", fake: "accounts.snapch4t.com/login",
    technique: "Typosquat — digit for letter", lesson: "The “a” is a <b>4</b>: snapch4t. Numbers swapped for letters are a classic, and easy to catch if you read it." },
};
BRANDS.forEach((b) => { if (PHISH[b.name]) Object.assign(b, PHISH[b.name]); });

// ---------- State --------------------------------------------------
const state = {
  mode: null,        // 'eyes' | 'passkey'
  round: 0,          // 0-based index into deck
  score: 0,
  roundsChoice: 5,   // how many rounds the player picked (5 or 10)
  difficultyPref: "mixed", // 'mixed' | 'easymed' | 'medhard' | 'hard'
  timerSeconds: 25,  // 0 = off
  totalRounds: 5,    // rounds in the current game
  deck: [],          // random subset of BRANDS for this game
  realIsLeft: true,  // which window is the real one this round
  resolved: false,   // round already decided?
  busy: false,       // a passkey ceremony is in flight (block re-clicks)
  pickedReal: false, // did the player click the genuine site this round?
  streak: 0,         // consecutive correct answers
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
    fams: s.fams || {}, // per-technique-family accuracy (eyes mode)
  };
}
function addGameToStats(mode, rounds, correct) {
  const s = getStats();
  s[mode].rounds += rounds;
  s[mode].correct += correct;
  // Per-family accuracy is only meaningful in eyes mode (passkey always wins).
  if (mode === "eyes") {
    state.results.forEach((r) => {
      const f = r.family || "other";
      const cur = s.fams[f] || { rounds: 0, correct: 0 };
      cur.rounds++;
      if (r.correct) cur.correct++;
      s.fams[f] = cur;
    });
  }
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
    const testBtn = $("#btn-test-passkey");
    if (testBtn) testBtn.style.display = "";
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

// A real platform passkey actually exists on this device (vs. simulated).
function realPasskeyAvailable() {
  const id = state.passkey.credentialId;
  return !!(
    window.PublicKeyCredential &&
    window.isSecureContext &&
    navigator.credentials &&
    typeof navigator.credentials.get === "function" &&
    id &&
    !id.startsWith("simulated") &&
    !id.startsWith("phone-")
  );
}

// Run a REAL WebAuthn ceremony.
//   kind 'real' → asks for the passkey you registered (Touch ID, succeeds)
//   kind 'fake' → asks for a credential that doesn't exist on this device,
//                 so the browser shows its own native "no passkey" UI and
//                 genuinely fails — the real phishing-site experience.
// Returns { sim:true } when there's no real authenticator (caller should
// fall back to the simulated illustration).
async function attemptPasskey(kind) {
  if (!realPasskeyAvailable()) return { sim: true };
  const allowCredentials =
    kind === "real"
      ? [{ type: "public-key", id: base64UrlToBuf(state.passkey.credentialId), transports: ["internal"] }]
      : [{ type: "public-key", id: randomBytes(32), transports: ["internal"] }];
  try {
    await navigator.credentials.get({
      publicKey: { challenge: randomBytes(32), timeout: 60000, userVerification: "preferred", allowCredentials },
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, err };
  }
}

// Back-compat shim for the passkey-mode real path.
async function assertPasskey() {
  const r = await attemptPasskey("real");
  if (r.sim) return true;       // simulated success
  return r.ok ? true : false;   // false = user cancelled the real prompt
}

// "Test your passkey" on the home screen — a real sign-in ceremony so you
// can feel the passkey work before you play.
async function testPasskey() {
  const status = $("#passkey-status");
  if (!state.passkey.registered) {
    status.className = "passkey-status info";
    status.textContent = "Register a passkey first, then test it.";
    return;
  }
  status.className = "passkey-status info";
  status.textContent = "Waiting for Face ID / Touch ID…";
  const r = await attemptPasskey("real");
  if (r.sim) {
    status.className = "passkey-status info";
    status.innerHTML =
      "✓ Passkey verified (simulated). Open this over <b>https</b> or <b>localhost</b> in a real browser to feel the actual Touch&nbsp;ID prompt.";
  } else if (r.ok) {
    status.className = "passkey-status ok";
    status.innerHTML =
      "✓ It works! Verified with your device on <b>" + location.hostname + "</b> — no password typed. A look-alike domain would get nothing.";
  } else {
    status.className = "passkey-status err";
    status.textContent =
      r.err && r.err.name === "NotAllowedError"
        ? "Cancelled, or no matching passkey on this device — tap to try again."
        : "Couldn't verify: " + (r.err && r.err.message ? r.err.message : "unknown error");
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
//  Sound — synthesized music + SFX via Web Audio (no asset files)
// ============================================================
const Sound = {
  ctx: null, master: null, musicBus: null, sfxBus: null,
  enabled: true, loopId: null, step: 0,
  load() {
    try { const v = JSON.parse(localStorage.getItem("phishgame.sound")); if (v !== null) this.enabled = v; } catch (_) {}
  },
  ensure() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain(); this.master.gain.value = this.enabled ? 0.9 : 0; this.master.connect(this.ctx.destination);
    this.musicBus = this.ctx.createGain(); this.musicBus.gain.value = 0.5; this.musicBus.connect(this.master);
    this.sfxBus = this.ctx.createGain(); this.sfxBus.gain.value = 0.7; this.sfxBus.connect(this.master);
  },
  resume() { this.ensure(); if (this.ctx && this.ctx.state === "suspended") this.ctx.resume(); },
  setEnabled(on) {
    this.enabled = on;
    try { localStorage.setItem("phishgame.sound", JSON.stringify(on)); } catch (_) {}
    if (this.master) this.master.gain.value = on ? 0.9 : 0;
  },
  osc(bus, freq, t, dur, type, peak, attack) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type || "triangle"; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak || 0.3, t + (attack || 0.01));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + 0.03);
    return o;
  },
  noise(bus, t, dur, peak) {
    if (!this.ctx) return;
    const n = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const g = this.ctx.createGain(); g.gain.value = peak || 0.2;
    const hp = this.ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 6000;
    src.connect(hp); hp.connect(g); g.connect(bus); src.start(t); src.stop(t + dur);
  },
  sfx(name) {
    this.resume();
    if (!this.ctx || !this.enabled) return;
    const t = this.ctx.currentTime, b = this.sfxBus;
    if (name === "pick") { this.osc(b, 320, t, 0.08, "square", 0.18); }
    else if (name === "correct") { [523, 659, 784, 1047].forEach((f, i) => this.osc(b, f, t + i * 0.07, 0.18, "triangle", 0.32)); }
    else if (name === "wrong") { this.osc(b, 200, t, 0.35, "sawtooth", 0.3); this.osc(b, 150, t + 0.12, 0.3, "sawtooth", 0.28); }
    else if (name === "block") { this.osc(b, 440, t, 0.1, "square", 0.25); this.osc(b, 660, t + 0.1, 0.22, "triangle", 0.28); }
    else if (name === "tick") { this.osc(b, 880, t, 0.05, "square", 0.18); }
    else if (name === "timeout") { this.osc(b, 180, t, 0.5, "sawtooth", 0.32); }
    else if (name === "start") { [392, 523, 659].forEach((f, i) => this.osc(b, f, t + i * 0.06, 0.16, "triangle", 0.3)); }
    else if (name === "win") { [523, 659, 784, 1047, 1319].forEach((f, i) => this.osc(b, f, t + i * 0.1, 0.4, "triangle", 0.34)); }
    else if (name === "lose") { [392, 330, 262].forEach((f, i) => this.osc(b, f, t + i * 0.14, 0.4, "sawtooth", 0.26)); }
  },
  // Upbeat looping lobby music: bass + arpeggio + kick/hat over a vi–IV–I–V loop.
  startMusic() {
    this.resume();
    if (!this.ctx || this.loopId) return;
    const A2 = 110, F2 = 87.31, C3 = 130.81, G2 = 98.0;
    const A3 = 220, C4 = 261.63, E4 = 329.63, F4 = 349.23, G4 = 392, B3 = 246.94, D4 = 293.66;
    const bass = [A2, A2, F2, F2, C3, C3, G2, G2];
    const arp = [
      [A3, C4, E4, C4], [A3, C4, E4, C4], [A3, C4, F4, C4], [A3, C4, F4, C4],
      [C4, E4, G4, E4], [C4, E4, G4, E4], [B3, D4, G4, D4], [B3, D4, G4, D4],
    ];
    const stepMs = 150; // eighth notes
    this.step = 0;
    const tick = () => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime + 0.02;
      const s = this.step % 8, half = this.step % 2;
      if (half === 0) this.osc(this.musicBus, bass[s], t, 0.22, "triangle", 0.22); // bass on the beat
      this.osc(this.musicBus, arp[s][this.step % 4], t, 0.16, "square", 0.07);     // arpeggio
      if (half === 0) { this.osc(this.musicBus, 60, t, 0.13, "sine", 0.5); }        // kick
      this.noise(this.musicBus, t, 0.03, 0.05);                                     // hat
      this.step++;
    };
    tick();
    this.loopId = setInterval(tick, stepMs);
  },
  stopMusic() { if (this.loopId) { clearInterval(this.loopId); this.loopId = null; } },
};

// ============================================================
//  Per-round countdown timer
// ============================================================
const Timer = { iv: null, end: 0, dur: 0, lastTick: 99 };
function startTimer() {
  stopTimer();
  if (!state.timerSeconds) { $("#timer-wrap").style.display = "none"; return; }
  Timer.dur = state.timerSeconds;
  Timer.end = performance.now() + Timer.dur * 1000;
  Timer.lastTick = Timer.dur + 1;
  $("#timer-wrap").style.display = "";
  const fill = $("#timer-fill"), num = $("#timer-num");
  const frame = () => {
    const remain = Math.max(0, Timer.end - performance.now());
    const frac = remain / (Timer.dur * 1000);
    fill.style.width = (frac * 100).toFixed(1) + "%";
    fill.className = "timer-fill " + (frac > 0.5 ? "t-ok" : frac > 0.25 ? "t-warn" : "t-danger");
    const secs = Math.ceil(remain / 1000);
    num.textContent = secs;
    if (secs <= 5 && secs !== Timer.lastTick && secs > 0) { Sound.sfx("tick"); Timer.lastTick = secs; }
    if (remain <= 0) { stopTimer(); onTimeout(); }
  };
  frame();
  Timer.iv = setInterval(frame, 90);
}
function stopTimer() { if (Timer.iv) { clearInterval(Timer.iv); Timer.iv = null; } }
function onTimeout() {
  if (state.resolved) return;
  state.resolved = true;
  const brand = state.deck[state.round];
  state.streak = 0; updateStreak();
  recordResult(brand, false);
  Sound.sfx("timeout");
  markWindows(brand, document.querySelector("#windows .window"), "timeout");
  resultBad(
    "⏱️ Time's up.",
    `You ran out of time — and a hesitating user is a phished user. ${brand.lesson}`,
    brand
  );
}

// ============================================================
//  Confetti (lightweight canvas burst)
// ============================================================
function confetti(amount, power) {
  const cv = $("#confetti");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  cv.width = window.innerWidth; cv.height = window.innerHeight;
  const colors = ["#d4283d", "#e0a73a", "#2fd27a", "#5b8cff", "#ffffff"];
  const parts = [];
  const n = amount || 90;
  for (let i = 0; i < n; i++) {
    parts.push({
      x: cv.width / 2 + (Math.random() - 0.5) * 120,
      y: cv.height / 3,
      vx: (Math.random() - 0.5) * (power || 9),
      vy: -Math.random() * (power || 9) - 4,
      g: 0.22 + Math.random() * 0.12,
      s: 5 + Math.random() * 6,
      rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3,
      c: colors[(Math.random() * colors.length) | 0], life: 0,
    });
  }
  let frames = 0;
  const draw = () => {
    ctx.clearRect(0, 0, cv.width, cv.height);
    let alive = false;
    for (const p of parts) {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
      if (p.y < cv.height + 20) alive = true;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - p.life / 160);
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      ctx.restore();
    }
    frames++;
    if (alive && frames < 200) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, cv.width, cv.height);
  };
  draw();
}

function updateStreak() {
  const el = $("#streak");
  if (!el) return;
  if (state.streak >= 2) { el.style.display = ""; el.textContent = "🔥 " + state.streak; el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
  else { el.style.display = "none"; }
}
function bumpScore() {
  const el = $("#score");
  el.textContent = state.score;
  el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
}

// ============================================================
//  Game flow
// ============================================================
// Map a brand's technique string to a coarse "family" so we can cap how
// often a family appears in one game.
function familyOf(tech) {
  const t = (tech || "").toLowerCase();
  if (t.includes("omission")) return "omission";
  if (t.includes("transposition")) return "transposition";
  if (t.includes("doubled")) return "doubled";
  if (t.includes("digit")) return "substitution";
  if (t.includes("combosquat")) return "combosquat";
  if (t.includes("subdomain")) return "subdomain";
  if (t.includes("in the path") || t.includes("brand hidden")) return "brandpath";
  if (t.includes("run-together") || t.includes("missing dot")) return "wwwrunon";
  if (t.includes("tld typo")) return "tldtypo";
  if (t.includes("wrong tld")) return "tld";
  if (t.includes("rn →")) return "comb-rn";
  if (t.includes("comb-glyph")) return "comb-letter";
  if (t.includes("homoglyph")) return "homoglyph";
  if (t.includes("@")) return "at";
  if (t.includes("not secure") || t.includes("http")) return "http";
  return "other";
}

// Friendly name + a real-world tip for each technique family (coaching).
const FAMILY_INFO = {
  omission: { label: "Missing letters", tip: "Read the brand name letter by letter — a dropped character (gogle, amzon) hides in plain sight." },
  transposition: { label: "Swapped letters", tip: "Two flipped letters still ‘read’ right (yuotube, instargam). Slow down on the spelling." },
  doubled: { label: "Doubled letters", tip: "An extra letter (twitterr) sneaks past a quick glance." },
  substitution: { label: "Digit-for-letter", tip: "Watch for 0/o, 1/l, 4/a — numbers posing as letters (yaho0, snapch4t)." },
  combosquat: { label: "Look-alike domains", tip: "Extra words or hyphens (apple-id-verify.com) make a brand-new domain. The brand name alone proves nothing." },
  subdomain: { label: "Subdomain stuffing", tip: "Read a URL right-to-left: the real site is the part just before the first ‘/’." },
  brandpath: { label: "Brand in the path", tip: "A brand after the first ‘/’ is meaningless — check the domain itself (the part before it)." },
  wwwrunon: { label: "Run-together ‘www’", tip: "No dot after ‘www’ (wwwpaypal.com) makes one big fake label." },
  tldtypo: { label: "TLD typos", tip: "Watch the ending: .cm / .co are not .com." },
  tld: { label: "Wrong endings (TLD)", tip: "Same name, different ending (zoom.download) = a different owner." },
  "comb-rn": { label: "Blended letters (rn→m)", tip: "‘rn’ side by side looks just like ‘m’ (walrnart, rnicrosoft)." },
  "comb-letter": { label: "Look-alike letters", tip: "Capital-I vs l, l vs i, v vs y — fonts make these nearly identical." },
  homoglyph: { label: "Hidden characters", tip: "Some letters are foreign look-alikes; a real browser unmasks them as a confusing ‘xn--’ address." },
  at: { label: "The ‘@’ trick", tip: "Everything before an ‘@’ in a URL is ignored — the browser goes to whatever follows it." },
  http: { label: "Not secure (http)", tip: "No padlock means no encryption. Never type a password on an http page." },
  other: { label: "Look-alike sites", tip: "Always verify the domain before you sign in." },
};

function allowedDifficulties(pref) {
  if (pref === "easymed") return new Set(["easy", "medium"]);
  if (pref === "medhard") return new Set(["medium", "hard"]);
  if (pref === "hard") return new Set(["hard"]);
  return new Set(["easy", "medium", "hard"]); // mixed
}

// Draw n brands, capping each technique family at 2; relax only if the
// pool is too small to fill the game otherwise.
function drawDeck(eligible, n) {
  const shuffled = shuffle(eligible);
  const counts = {};
  const picked = [];
  for (const b of shuffled) {
    if (picked.length >= n) break;
    const f = familyOf(b.technique);
    if ((counts[f] || 0) < 2) { counts[f] = (counts[f] || 0) + 1; picked.push(b); }
  }
  if (picked.length < n) {
    for (const b of shuffled) {
      if (picked.length >= n) break;
      if (!picked.includes(b)) picked.push(b);
    }
  }
  return picked;
}

function startGame(mode) {
  state.mode = mode;
  state.round = 0;
  state.score = 0;
  state.streak = 0;
  state.results = [];
  const allowed = allowedDifficulties(state.difficultyPref);
  const eligible = BRANDS.filter((b) => allowed.has(b.difficulty));
  state.totalRounds = Math.min(state.roundsChoice, eligible.length);
  // Draw distinct brands (≤2 per technique family), then order easy → hard.
  const rank = { easy: 0, medium: 1, hard: 2 };
  state.deck = drawDeck(eligible, state.totalRounds)
    .sort((a, b) => (rank[a.difficulty] || 1) - (rank[b.difficulty] || 1));
  updateStreak();
  Sound.sfx("start");
  show("#screen-round");
  renderRound();
}

function renderRound() {
  state.resolved = false;
  state.busy = false;
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
  const w1 = buildWindow(brand, leftReal), w2 = buildWindow(brand, !leftReal);
  w1.classList.add("win-enter", "win-enter-l");
  w2.classList.add("win-enter", "win-enter-r");
  $("#windows").appendChild(w1);
  $("#windows").appendChild(w2);
  startTimer();

  const inspect = " <span class=\"muted\">(hover a URL for the full address · keys 1 / 2)</span>";
  const eyesHint =
    brand.difficulty === "easy"
      ? "The pages are identical — the address bar is your only clue, and this one's catchable. Find the real " + brand.name + "."
      : brand.difficulty === "hard"
      ? "Identical pages, and the address bar barely helps. Which domain really belongs to " + brand.name + "? Good luck."
      : "Both look right. Only one address bar actually belongs to " + brand.name + ".";
  $("#round-hint").innerHTML =
    state.mode === "eyes"
      ? eyesHint + inspect
      : "Click “Sign in” on either tab. Your device — not your eyes — decides what's genuine." + inspect;
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

  // Show the address with the path muted (like a real browser) so length
  // alone is not a tell; the full URL is on hover via title=.
  const slash = domain.indexOf("/");
  const hostPart = slash === -1 ? domain : domain.slice(0, slash);
  const pathPart = slash === -1 ? "" : domain.slice(slash);

  // Each window is a full, unique brand homepage. The ONLY real
  // difference is the host (and sometimes the scheme) in the address bar.
  win.innerHTML = `
    <div class="win-chrome">
      <div class="traffic"><span class="r"></span><span class="y"></span><span class="g"></span></div>
      <div class="urlbar" title="${scheme}${domain}">
        ${lock}
        <span class="urladdr"><span class="host">${scheme}${hostPart}</span><span class="urlpath">${pathPart}</span></span>
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

  // Any button on the page — the nav "Sign in" OR the hero "Log in" /
  // "Continue" / "Get Started" call-to-action — triggers the sign-in.
  win.addEventListener("click", (e) => {
    if (e.target.closest("button")) {
      e.stopPropagation();
      onSignIn(win, isReal, brand);
    }
  });

  return win;
}

// Single entry point for any sign-in/login button, in either mode.
function onSignIn(win, isReal, brand) {
  if (state.resolved || state.busy) return;
  Sound.sfx("pick");
  if (state.mode === "eyes") onEyesPick(win, isReal);
  else onPasskeyAttempt(win, isReal, brand);
}

// Record a round outcome for the difficulty + technique breakdown.
function recordResult(brand, correct) {
  state.results.push({
    difficulty: brand.difficulty || "medium",
    family: familyOf(brand.technique),
    technique: brand.technique,
    name: brand.name,
    correct: !!correct,
  });
}

// ---------- Eyes mode: pure guess ----------------------------------
function onEyesPick(win, isReal) {
  if (state.resolved) return;
  state.resolved = true;
  stopTimer();
  const brand = state.deck[state.round];
  state.pickedReal = isReal; // which site the player clicked (for the passkey demo)
  recordResult(brand, isReal);

  // flash verdicts on both windows
  markWindows(brand, win, isReal ? "real" : "fake");

  if (isReal) {
    state.score++;
    state.streak++;
    bumpScore();
    updateStreak();
    Sound.sfx("correct");
    if (state.streak >= 3) confetti(70, 8);
    resultOk(
      "🎉 Right — that one was real.",
      `Nicely spotted. ${brand.lesson} But be honest: were you sure, or was it a coin-flip?`,
      brand
    );
  } else {
    state.streak = 0;
    updateStreak();
    Sound.sfx("wrong");
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
  stopTimer();
  state.busy = true;

  if (!isReal) {
    // Actually ask the browser for a passkey. With a real authenticator
    // this pops the OS's own dialog, which finds nothing (no matching
    // credential) and refuses — the genuine phishing-site experience.
    // Without one, fall back to the simulated illustration.
    const btn = win.querySelector('[data-act="signin"]');
    btn.disabled = true;
    btn.textContent = "Verifying…";
    const r = await attemptPasskey("fake");
    btn.disabled = false;
    btn.textContent = "🔑 Sign in";

    const blocked = () => {
      state.resolved = true;
      recordResult(brand, true);
      markWindows(brand, win, "fake");
      state.score++; // correctly avoiding the phish counts as a win
      state.streak++;
      bumpScore();
      updateStreak();
      Sound.sfx("block");
      resultBad(
        "🛡️ Phish blocked — by your passkey.",
        `Your browser looked for a passkey for <code>${brand.fake}</code> and found <strong>none</strong>. ` +
        `That's the tell — this isn't the site you registered with, no matter how convincing it looks. ` +
        `No password was typed, nothing was stolen. ${brand.lesson}`,
        brand,
        /*passkeyWin=*/true
      );
    };

    if (r.sim) {
      showPasskeySheet(false, brand.fake, blocked); // simulated illustration
    } else {
      blocked(); // the real OS dialog already showed and refused
    }
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
    state.busy = false;
    return;
  }
  state.resolved = true;
  state.score++;
  state.streak++;
  recordResult(brand, true);
  bumpScore();
  updateStreak();
  Sound.sfx("correct");
  markWindows(brand, win, "real");
  resultOk(
    "✅ Signed in — instantly and safely.",
    `Your passkey matched <code>${brand.legit}</code>, so the sign-in just worked. ` +
    `No password, no code to type. The phishing tab never had a chance.`,
    brand,
    /*passkeyWin=*/true
  );
}

// The passkey dialog. When `immediate` is false we play a short
// "searching…" animation (the simulated illustration, used only when no
// real authenticator exists). When `immediate` is true the real browser
// dialog already ran, so we jump straight to confirming the outcome.
function passkeySheetFinalHTML(success, domain) {
  return success
    ? `<div class="pk-illus">✅</div>` +
      `<div class="pk-title">Signed in</div>` +
      `<div class="pk-sub pk-sub-ok">Verified with Face&nbsp;ID / Touch&nbsp;ID. You're signed in to ` +
      `<b>${domain}</b> — no password typed.</div>` +
      `<button class="btn btn-primary pk-close" id="pk-sheet-close">Done</button>`
    : `<div class="pk-illus pk-illus-fail">🔑</div>` +
      `<div class="pk-title">No passkey for this site</div>` +
      `<div class="pk-sub">Your device had no passkey for <b>${domain}</b>, so sign-in was refused.<br>` +
      `A look-alike domain gets nothing — that's the phishing defence.</div>` +
      `<button class="btn btn-primary pk-close" id="pk-sheet-close">Close</button>`;
}

function showPasskeySheet(success, domain, onClose, immediate) {
  const body = $("#pk-sheet-body");
  $("#pk-sheet-domain").textContent = domain;
  openOverlay("#passkey-sheet");
  const finish = () => {
    body.innerHTML = passkeySheetFinalHTML(success, domain);
    $("#pk-sheet-close").addEventListener("click", () => {
      closeOverlay("#passkey-sheet");
      if (onClose) onClose();
    });
  };
  if (immediate) {
    finish();
  } else {
    body.innerHTML =
      `<div class="pk-illus">🔑</div>` +
      `<div class="pk-searching"><span class="pk-spinner"></span> Checking this device for a passkey…</div>`;
    setTimeout(finish, 1300);
  }
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

// For subdomain-stuffing / @-tricks the whole string differs, so instead
// highlight the actual registrable domain (the last two labels of the
// host) — the real owner of the page.
function highlightRoot(fake) {
  const host = fake.split("@").pop().split("/")[0]; // drop userinfo + path
  const parts = host.split(".");
  if (parts.length < 2) return fake;
  const root = parts.slice(-2).join(".");
  const i = fake.indexOf(root);
  if (i < 0) return fake;
  return fake.slice(0, i) + `<span class="diffmark">${root}</span>` + fake.slice(i + root.length);
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
  const structural = /Subdomain|@/.test(brand.technique);
  const fakeShown = structural ? highlightRoot(brand.fake) : highlightDiff(brand.legit, brand.fake);
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
  demoBtn.textContent = state.pickedReal
    ? "🔑 See your passkey sign in here"
    : "🛡️ See how a passkey would've blocked this";
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
  stopTimer();
  Sound.stopMusic();
  show("#screen-summary");
  const s = state.score;
  const T = state.totalRounds;
  $("#summary-score").textContent = `${s} / ${T}`;
  renderBreakdown();
  addGameToStats(state.mode, T, s);
  renderLifetime();
  renderCoaching();

  // End-of-game flourish
  const ratio = T ? s / T : 0;
  if (ratio >= 0.6) {
    Sound.sfx("win");
    confetti(s >= T ? 180 : 110, s >= T ? 12 : 9);
  } else {
    Sound.sfx("lose");
  }

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
  const diffLabel = { mixed: "Mixed", easymed: "Easy–Med", medhard: "Med–Hard", hard: "All Hard" }[state.difficultyPref] || "Mixed";
  $("#summary-breakdown").innerHTML =
    `<div class="bd-title">${state.mode === "eyes" ? "By eye" : "With your passkey"} · ${diffLabel} · ${state.totalRounds} rounds — accuracy by difficulty</div>` + rows;
}

// Coaching: your weak technique + a real-world takeaway.
function renderCoaching() {
  const el = $("#summary-coaching");
  if (!el) return;

  if (state.mode === "passkey") {
    el.innerHTML =
      `<div class="coach-tip"><b>The takeaway:</b> a passkey makes “spot the phish” obsolete — ` +
      `it simply won't work on a look-alike domain, so there's nothing left to get wrong.</div>`;
    return;
  }

  let html = "";
  // Lifetime weak spot (needs a little data); else this game's worst miss.
  const stats = getStats();
  let weak = null;
  Object.keys(stats.fams).forEach((f) => {
    const d = stats.fams[f];
    if (d.rounds >= 2) {
      const acc = d.correct / d.rounds;
      if (!weak || acc < weak.acc) weak = { f, acc, ...d };
    }
  });
  if (weak && weak.acc < 0.999) {
    const info = FAMILY_INFO[weak.f] || FAMILY_INFO.other;
    html +=
      `<div class="coach-head">🎯 Your weak spot: <b>${info.label}</b> ` +
      `<span class="muted">(${Math.round(weak.acc * 100)}% over ${weak.rounds})</span></div>` +
      `<div class="coach-tip">${info.tip}</div>`;
  } else {
    const missed = {};
    state.results.forEach((r) => { if (!r.correct) missed[r.family] = (missed[r.family] || 0) + 1; });
    const keys = Object.keys(missed);
    if (keys.length) {
      const f = keys.sort((a, b) => missed[b] - missed[a])[0];
      const info = FAMILY_INFO[f] || FAMILY_INFO.other;
      html += `<div class="coach-head">🎯 Watch out for: <b>${info.label}</b></div><div class="coach-tip">${info.tip}</div>`;
    }
  }

  html +=
    `<div class="coach-tips"><b>In real life</b>` +
    `<ul>` +
    `<li>Don't trust how a page <em>looks</em> — copies are pixel-perfect.</li>` +
    `<li>Read the domain right-to-left; the real site is just before the first “/”.</li>` +
    `<li>Let a <b>passkey</b> (or password manager) decide — it won't autofill on a look-alike.</li>` +
    `</ul></div>`;
  el.innerHTML = html;
}

// Share / copy a result card to spread the word.
async function shareResult() {
  const T = state.totalRounds, s = state.score;
  const url = location.href.split("?")[0].split("#")[0];
  const line =
    state.mode === "eyes"
      ? `I caught ${s}/${T} phishing sites by eye ${s / T >= 0.6 ? "😎" : "😅"}`
      : `My passkey blocked every phish — ${s}/${T} 🔑`;
  const text = `🎣 Phish or Legit?\n${line}\nAlmost nobody spots them by eye — but a device-bound passkey catches them all. Can you beat me?\n${url}`;
  try {
    if (navigator.share) { await navigator.share({ title: "Phish or Legit?", text }); return; }
  } catch (_) { /* user cancelled share */ return; }
  try {
    await navigator.clipboard.writeText(text);
    flashShare("Copied to clipboard ✓");
  } catch (_) {
    flashShare("Press ⌘/Ctrl+C to copy");
  }
}
function flashShare(msg) {
  const b = $("#btn-share");
  if (!b) return;
  const prev = b.textContent;
  b.textContent = msg;
  setTimeout(() => { b.textContent = prev; }, 1900);
}

// ============================================================
//  Wiring
// ============================================================
function init() {
  loadStoredPasskey();
  renderLifetime();

  $("#btn-register").addEventListener("click", registerPasskey);
  $("#btn-test-passkey").addEventListener("click", testPasskey);

  // "See what a passkey would do here" on an eyes-mode result. Runs a
  // REAL WebAuthn ceremony when a real passkey exists: the genuine site
  // signs in with your actual passkey (Touch ID); the look-alike triggers
  // the browser's own "no passkey" failure. Falls back to the simulated
  // illustration when there's no real authenticator.
  $("#btn-passkey-demo").addEventListener("click", async (e) => {
    const brand = state.deck[state.round];
    if (!brand) return;
    const btn = e.currentTarget;
    const wantReal = state.pickedReal;
    btn.disabled = true;
    const r = await attemptPasskey(wantReal ? "real" : "fake");
    btn.disabled = false;
    if (r.sim) {
      showPasskeySheet(wantReal, wantReal ? brand.legit : brand.fake, () => {});
    } else if (wantReal) {
      if (r.ok) showPasskeySheet(true, brand.legit, () => {}, /*immediate=*/ true);
      // if the user cancelled the real prompt, do nothing (let them retry)
    } else {
      // the real attempt to use a passkey on the look-alike was refused
      showPasskeySheet(false, brand.fake, () => {}, /*immediate=*/ true);
    }
  });

  // Game-length selector (5 or 10 rounds)
  $("#rounds-seg").querySelectorAll(".seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.roundsChoice = parseInt(btn.dataset.rounds, 10);
      $("#rounds-seg").querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
  // Difficulty selector
  $("#diff-seg").querySelectorAll(".seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.difficultyPref = btn.dataset.diff;
      $("#diff-seg").querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
  // Timer selector
  $("#timer-seg").querySelectorAll(".seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.timerSeconds = parseInt(btn.dataset.timer, 10);
      $("#timer-seg").querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
  // Sound
  Sound.load();
  const soundBtn = $("#btn-sound");
  soundBtn.textContent = Sound.enabled ? "🔊" : "🔇";
  soundBtn.addEventListener("click", () => {
    Sound.resume();
    Sound.setEnabled(!Sound.enabled);
    soundBtn.textContent = Sound.enabled ? "🔊" : "🔇";
  });
  // Unlock audio on the first user gesture (autoplay policy).
  document.addEventListener("pointerdown", () => Sound.resume(), { once: true });
  $("#btn-play-eyes").addEventListener("click", () => startGame("eyes"));
  $("#btn-play-passkey").addEventListener("click", () => {
    if (!state.passkey.registered) return;
    startGame("passkey");
  });
  $("#btn-next").addEventListener("click", nextRound);
  $("#btn-quit").addEventListener("click", () => { stopTimer(); Sound.stopMusic(); closeOverlay("#result-overlay"); show("#screen-title"); });
  $("#btn-share").addEventListener("click", shareResult);
  $("#btn-replay").addEventListener("click", () => startGame(state.mode));
  $("#btn-home").addEventListener("click", () => { Sound.stopMusic(); show("#screen-title"); });

  $("#btn-how").addEventListener("click", () => openOverlay("#how-overlay"));
  $("#btn-how-close").addEventListener("click", () => closeOverlay("#how-overlay"));
  $("#btn-how-close-2").addEventListener("click", () => closeOverlay("#how-overlay"));
  $("#how-overlay").addEventListener("click", (e) => {
    if (e.target.id === "how-overlay") closeOverlay("#how-overlay");
  });

  // Keyboard play: ← / 1 = left tab, → / 2 = right tab, Enter = advance.
  document.addEventListener("keydown", (e) => {
    const resultOpen = $("#result-overlay").classList.contains("active");
    const sheetOpen = $("#passkey-sheet").classList.contains("active");
    const roundOpen = $("#screen-round").classList.contains("active");
    if (sheetOpen) {
      const close = $("#pk-sheet-close");
      if (close && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); close.click(); }
      return;
    }
    if (resultOpen) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); $("#btn-next").click(); }
      return;
    }
    if (roundOpen && !state.resolved) {
      if (e.key === "ArrowLeft" || e.key === "1") { e.preventDefault(); pickWindow(0); }
      else if (e.key === "ArrowRight" || e.key === "2") { e.preventDefault(); pickWindow(1); }
    }
  });
}

function pickWindow(idx) {
  const w = document.querySelectorAll("#windows .window")[idx];
  const btn = w && w.querySelector('[data-act="signin"]');
  if (btn) btn.click();
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
