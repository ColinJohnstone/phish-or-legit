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

// All brands here are FICTIONAL — invented names, generic monogram logos, and
// generic per-category homepages (see siteHome). No real company names, logos,
// domains, or page designs appear anywhere in the game. Each entry carries only
// its theme (colour + category + nav/hero colours) and monogram; the look-alike
// phishing URLs + lessons are layered on from PHISH below.
const BRANDS = [
  { name: "Coinvault", color: "#1652f0", kind: "crypto", navBg: "#0a0b0d", navFg: "#ffffff", heroBg: "#0a0b0d", heroFg: "#ffffff", mono: "C" },
  { name: "PayPeer", color: "#0070ba", kind: "wallet", navBg: "#ffffff", navFg: "#2c2e2f", heroBg: "linear-gradient(160deg,#f5f7fa,#e8eefc)", heroFg: "#0a1f44", mono: "P" },
  { name: "Goozle", color: "#1a73e8", kind: "email", navBg: "#ffffff", navFg: "#5f6368", heroBg: "#ffffff", heroFg: "#202124", mono: "G" },
  { name: "Amazor", color: "#ff9900", kind: "shopping", navBg: "#131921", navFg: "#ffffff", heroBg: "#eaeded", heroFg: "#0f1111", mono: "A" },
  { name: "Crestline Bank", color: "#117aca", kind: "bank", navBg: "#117aca", navFg: "#ffffff", heroBg: "#ffffff", heroFg: "#0a0a0a", mono: "Cb" },
  { name: "Macrosoft", color: "#0067b8", kind: "work", navBg: "#ffffff", navFg: "#3b3b3b", heroBg: "#f3f2f1", heroFg: "#1b1a19", mono: "M" },
  { name: "Faceblock", color: "#1877f2", kind: "social", navBg: "#ffffff", navFg: "#1c1e21", heroBg: "#f0f2f5", heroFg: "#1c1e21", mono: "F" },
  { name: "Snapgram", color: "#e1306c", kind: "social", navBg: "#ffffff", navFg: "#262626", heroBg: "#fafafa", heroFg: "#262626", mono: "Sg" },
  { name: "Linkup", color: "#0a66c2", kind: "work", navBg: "#ffffff", navFg: "#000000", heroBg: "#f4f2ee", heroFg: "#1d1d1d", mono: "Lu" },
  { name: "Chirpy", color: "#1d9bf0", kind: "social", navBg: "#000000", navFg: "#ffffff", heroBg: "#000000", heroFg: "#ffffff", mono: "C" },
  { name: "Tunify", color: "#1db954", kind: "streaming", navBg: "#000000", navFg: "#ffffff", heroBg: "#121212", heroFg: "#ffffff", mono: "T" },
  { name: "Slacka", color: "#611f69", kind: "work", navBg: "#ffffff", navFg: "#1d1c1d", heroBg: "#f8f4f9", heroFg: "#1d1c1d", mono: "S" },
  { name: "CodeHub", color: "#238636", kind: "dev", navBg: "#161b22", navFg: "#ffffff", heroBg: "#0d1117", heroFg: "#e6edf3", mono: "CH" },
  { name: "Harmony", color: "#5865f2", kind: "social", navBg: "#5865f2", navFg: "#ffffff", heroBg: "#404eed", heroFg: "#ffffff", mono: "H" },
  { name: "Vapor", color: "#1999ff", kind: "gaming", navBg: "#171a21", navFg: "#ffffff", heroBg: "#1b2838", heroFg: "#ffffff", mono: "V" },
  { name: "Twixly", color: "#9146ff", kind: "streaming", navBg: "#18181b", navFg: "#ffffff", heroBg: "#0e0e10", heroFg: "#efeff1", mono: "T" },
  { name: "Adobi", color: "#fa0f00", kind: "work", navBg: "#ffffff", navFg: "#2c2c2c", heroBg: "#fafafa", heroFg: "#2c2c2c", mono: "A" },
  { name: "Tradr", color: "#f0b90b", kind: "crypto", navBg: "#181a20", navFg: "#ffffff", heroBg: "#0b0e11", heroFg: "#ffffff", mono: "T", monoFg: "#181a20" },
  { name: "Summit Bank", color: "#d71e28", kind: "bank", navBg: "#b31b1b", navFg: "#ffffff", heroBg: "#ffffff", heroFg: "#1a1a1a", mono: "Sb" },
  { name: "Harbor Bank", color: "#012169", kind: "bank", navBg: "#012169", navFg: "#ffffff", heroBg: "#ffffff", heroFg: "#1a1a1a", mono: "Hb" },
  { name: "eBuy", color: "#0064d2", kind: "shopping", navBg: "#ffffff", navFg: "#1a1a1a", heroBg: "#f7f7f7", heroFg: "#1a1a1a", mono: "e" },
  { name: "Vidtube", color: "#ff0000", kind: "streaming", navBg: "#ffffff", navFg: "#0f0f0f", heroBg: "#ffffff", heroFg: "#0f0f0f", mono: "V" },
  { name: "Wahoo", color: "#6001d2", kind: "email", navBg: "#ffffff", navFg: "#1d2228", heroBg: "#f0e6ff", heroFg: "#1d2228", mono: "W" },
  { name: "ShipFast", color: "#4d148c", kind: "delivery", navBg: "#4d148c", navFg: "#ffffff", heroBg: "#ffffff", heroFg: "#2c2c2c", mono: "Sf" },
  { name: "GHX Express", color: "#d40511", kind: "delivery", navBg: "#ffcc00", navFg: "#d40511", heroBg: "#ffffff", heroFg: "#1a1a1a", mono: "GHX", monoFg: "#d40511" },
  { name: "UPX", color: "#351c15", kind: "delivery", navBg: "#351c15", navFg: "#ffb500", heroBg: "#ffffff", heroFg: "#351c15", mono: "UPX", monoFg: "#351c15" },
  { name: "Meetly", color: "#2d8cff", kind: "work", navBg: "#ffffff", navFg: "#232333", heroBg: "#f7faff", heroFg: "#232333", mono: "M" },
  { name: "Blockworld", color: "#e2231a", kind: "gaming", navBg: "#ffffff", navFg: "#393b3d", heroBg: "#f2f4f5", heroFg: "#393b3d", mono: "B" },
  { name: "Ryde", color: "#000000", kind: "rideshare", navBg: "#000000", navFg: "#ffffff", heroBg: "#ffffff", heroFg: "#000000", mono: "R" },
  { name: "Roomly", color: "#ff385c", kind: "travel", navBg: "#ffffff", navFg: "#222222", heroBg: "#ffffff", heroFg: "#222222", mono: "R" },
  { name: "Valuemart", color: "#0071dc", kind: "shopping", navBg: "#0071dc", navFg: "#ffffff", heroBg: "#ffffff", heroFg: "#1a1a1a", mono: "V" },
  { name: "Wonder+", color: "#0e47d6", kind: "streaming", navBg: "#0e1631", navFg: "#ffffff", heroBg: "#0a0e23", heroFg: "#ffffff", mono: "W+" },
  { name: "Cloudforce", color: "#00a1e0", kind: "work", navBg: "#ffffff", navFg: "#032d60", heroBg: "#f3f6fb", heroFg: "#032d60", mono: "Cf" },
  { name: "Pearl", color: "#0071e3", kind: "email", navBg: "#161617", navFg: "#f5f5f7", heroBg: "#000000", heroFg: "#f5f5f7", mono: "P" },
  { name: "Streamly", color: "#e50914", kind: "streaming", navBg: "transparent", navFg: "#ffffff", heroBg: "#000000", heroFg: "#ffffff", mono: "S" },
  { name: "PostEx", color: "#004b87", kind: "delivery", navBg: "#004b87", navFg: "#ffffff", heroBg: "#ffffff", heroFg: "#1a1a1a", mono: "Px" },
  { name: "Pinly", color: "#e60023", kind: "social", navBg: "#ffffff", navFg: "#111111", heroBg: "#fff8f8", heroFg: "#111111", mono: "P" },
  { name: "ChatBox", color: "#25d366", kind: "social", navBg: "#075e54", navFg: "#ffffff", heroBg: "#ece5dd", heroFg: "#111111", mono: "C" },
  { name: "Snapzy", color: "#111111", kind: "social", navBg: "#fffc00", navFg: "#111111", heroBg: "#fffc00", heroFg: "#111111", mono: "S", monoFg: "#fffc00" },
];
// ── Phishing-EMAIL scenarios (easy difficulty, no URL trick required) ──
// Not every phish relies on a look-alike domain. These rounds show two
// "emails" with the same subject line, but one uses the everyday tells of
// a mass-phishing blast — invented urgency, a generic greeting, a threat,
// sloppy grammar — while the real one is calm and personal. The sender
// address still differs too (so the tap-to-reveal + passkey mechanics stay
// consistent with every other round), but you shouldn't need to read it
// closely to win one of these.
function phishMailBody(c) {
  return `
    <div class="pg pg-pad pmail">
      <div class="pmail-subject">${c.subject}</div>
      <div class="pmail-greet">${c.greeting}</div>
      <p class="pmail-body">${c.body}</p>
      <button class="pg-btn-fill pmail-cta">${c.cta}</button>
      <p class="pmail-sign">${c.sign}</p>
    </div>`;
}
function phishMail(name, color, mono, legit, fake, technique, lesson, legitMail, fakeMail) {
  return {
    name, color, kind: "phishmail", difficulty: "easy",
    navBg: "#f5f7fb", navFg: "#1a2233", heroBg: "#ffffff", heroFg: "#1a2233",
    legit, fake, technique, lesson,
    mark: () => monogram(mono, color),
    home: (isReal) => phishMailBody(isReal ? legitMail : fakeMail),
  };
}
BRANDS.push(
  phishMail("NimbusPay", "#2e6bd6", "N",
    "alerts@nimbuspay.com", "alerts@nimbuspay-secure.com",
    "Email red flags — urgency & fear",
    "Real companies don't threaten to freeze your account over email. The countdown, the threat, and the generic greeting are the tell — you don't need to squint at the sender address to catch this one.",
    { subject: "Your March statement is ready", greeting: '<span class="rfok">Hi Jordan,</span>',
      body: "Your monthly NimbusPay statement is now available. Nothing needs your attention — just keeping you in the loop, as always.",
      cta: "View statement", sign: "— The NimbusPay Team" },
    { subject: "⚠️ URGENT: Unauthorized transaction detected", greeting: '<span class="rf">Dear Valued Customer,</span>',
      body: "We detected a suspicious transaction of $842.19 on your account. If this wasn't you, " +
        '<span class="rf">you must verify your identity within 24 hours or your account will be permanently suspended.</span> ' +
        "Please to confirm you're account informations immediately.",
      cta: "Verify Now", sign: "— NimbusPay Security Team" }),
  phishMail("Meridian Cloud", "#6d4fe0", "M",
    "notifications@meridiancloud.com", "notifications@meridian-cloud-alerts.com",
    "Email red flags — false deadline",
    "A storage warning doesn't come with a countdown to permanent data loss. Manufactured urgency is designed to make you click before you think — that's the tell, not the sender address.",
    { subject: "Your storage is 82% full", greeting: '<span class="rfok">Hi Jordan,</span>',
      body: "Just a heads up — you're using 82% of your storage. No rush; upgrade anytime from your account settings if you'd like more room.",
      cta: "Manage storage", sign: "— Meridian Cloud" },
    { subject: "🚨 Your files will be PERMANENTLY DELETED in 24 hours", greeting: '<span class="rf">Dear Customer,</span>',
      body: '<span class="rf">Your storage limit has been exceeded and all files will be deleted within 24 hours</span> unless you verify your account now. ' +
        "This is you're final notice — act immediately to avoid permanent data loss.",
      cta: "Save My Files", sign: "— Meridian Cloud Support" }),
  phishMail("Beacon Rewards", "#e0a73a", "B",
    "rewards@beaconrewards.com", "rewards@beacon-rewards-claim.net",
    "Email red flags — too good to be true",
    "You can't be “randomly selected” for a reward you never entered, and a real prize doesn't expire in two hours. If an email needs you to hurry before you think, that's the point of the email.",
    { subject: "You've earned 150 points this month", greeting: '<span class="rfok">Hi Jordan,</span>',
      body: "Nice work — you earned 150 Beacon points in March. Check your balance anytime; points never expire.",
      cta: "View my points", sign: "— Beacon Rewards" },
    { subject: "🎉 You've WON a $500 gift card!", greeting: '<span class="rf">Dear Valued Member,</span>',
      body: '<span class="rf">Congratulations! You\'ve been randomly selected to receive a $500 gift card.</span> ' +
        '<span class="rf">Claim within 2 hours or it will be forfeited to another member.</span> Click below now to claim you\'re prize.',
      cta: "Claim My Prize", sign: "— Rewards Team" }),
  phishMail("Fieldstone Insurance", "#2f8f5a", "F",
    "billing@fieldstoneinsurance.com", "billing@fieldstone-insurance-billing.info",
    "Email red flags — threats & poor grammar",
    "“Please to update” and “you're payment information” aren't how a real insurer writes. Pair broken grammar with a cancellation threat and it's a mass-blasted fake — no look-alike domain needed to spot it.",
    { subject: "Your April payment was received", greeting: '<span class="rfok">Hi Jordan,</span>',
      body: "This confirms we received your April premium payment. Your policy is active and in good standing — no action needed.",
      cta: "View my policy", sign: "— Fieldstone Insurance" },
    { subject: "FINAL NOTICE: Policy will be CANCELLED", greeting: '<span class="rf">Dear Policyholder,</span>',
      body: 'Your policy will be <span class="rf">cancelled within 24 hours</span> due to a billing issue. ' +
        "Please to update you're payment information immediately to avoid a gap in you're coverage.",
      cta: "Update Billing Now", sign: "— Billing Department" }),
  phishMail("Lockbox Mail", "#3a70e8", "L",
    "security@lockboxmail.com", "security@lockbox-mail-verify.com",
    "Email red flags — fake security alert",
    "A real security alert names the device, browser, and location and lets you shrug it off if it was you. A fake one skips the specifics and goes straight to a threat and a countdown.",
    { subject: "New device signed in to your account", greeting: '<span class="rfok">Hi Jordan,</span>',
      body: "We noticed a sign-in from a new device (Chrome on Mac, San Francisco) at 9:14 AM. If this was you, no action is needed.",
      cta: "Review activity", sign: "— Lockbox Mail Security" },
    { subject: "Unusual sign-in activity — verify immediately", greeting: '<span class="rf">Dear Account Holder,</span>',
      body: '<span class="rf">We detected a sign-in attempt from Lagos, Nigeria.</span> If you do not verify you\'re identity ' +
        '<span class="rf">within 24 hours, you\'re account will be permanently locked.</span>',
      cta: "Verify Identity", sign: "— Security Team" })
);

// ── Phishing technique + difficulty per brand ─────────────────────
// Layered on top of the homepage definitions above so the look-alike
// domains span a real spread of tricks and difficulty levels:
//   easy   — obvious once you look (typos, digits-for-letters, http,
//            plus the non-URL "phishmail" rounds below — urgency, generic
//            greetings, threats: the everyday red flags in your inbox)
//   medium — correctly spelled but wrong domain, or readable if you check
//            carefully (combosquat, wrong TLD, subdomain stuffing, @-trick)
//   hard   — genuinely invisible: homoglyphs and blended-letter tricks that
//            are pixel-identical to the eye. This is the tier that makes the
//            case for passkeys — there is no "looking closer" that helps.
const HG = HOMOGLYPH_NOTE;
// Every URL carries a realistic login subdomain + path, so the real and
// fake are comparable in length and prefix — you can't win by "pick the
// shorter one." All brands here are FICTIONAL (no real trademarks).
const PHISH = {
  // ─── Character omission ───
  "Goozle":    { difficulty: "easy", legit: "accounts.goozle.com/signin", fake: "accounts.gozle.com/signin",
    technique: "Typosquat — omission", lesson: "A letter is missing: <b>gozle</b> drops an “o”. Skim-readers never notice a dropped character." },
  "Amazor":    { difficulty: "easy", legit: "www.amazor.com/ap/signin", fake: "www.amzor.com/ap/signin",
    technique: "Typosquat — omission", lesson: "<b>amzor</b> is missing an “a”. The brand still reads right at a glance — that's the trap." },
  "Faceblock":  { difficulty: "easy", legit: "www.faceblock.com/login", fake: "www.facblock.com/login",
    technique: "Typosquat — omission", lesson: "<b>facblock</b> drops the “e”. One missing letter in a familiar word is easy to miss." },
  "Linkup":  { difficulty: "easy", legit: "www.linkup.com/login", fake: "www.linup.com/login",
    technique: "Typosquat — omission", lesson: "<b>linup</b> is missing the “k”. Your brain auto-corrects it to the real word." },
  "Slacka":     { difficulty: "easy", legit: "app.slacka.com/signin", fake: "app.slaca.com/signin",
    technique: "Typosquat — omission", lesson: "Drop a “k” and <b>slaca</b> is a different, unrelated domain entirely." },
  "Adobi":     { difficulty: "easy", legit: "account.adobi.com/sign-in", fake: "account.adbi.com/sign-in",
    technique: "Typosquat — omission", lesson: "<b>adbi</b> drops the “o”. Truncated brand names are a classic look-alike." },

  // ─── Substitution & transposition ───
  "Vidtube":   { difficulty: "easy", legit: "www.vidtube.com/account", fake: "www.vidtbue.com/account",
    technique: "Typosquat — transposition", lesson: "Two letters are flipped: <b>vidtbue</b> swaps “ub” for “bu”. Transposed letters read almost normally." },
  "Wahoo":     { difficulty: "easy", legit: "login.wahoo.com/account", fake: "login.wah0o.com/account",
    technique: "Typosquat — digit for letter", lesson: "The last “o” is a zero: <b>wah0o</b>. Numbers standing in for letters are a staple of phishing." },
  "Chirpy":   { difficulty: "medium", legit: "www.chirpy.com/login", fake: "www.chirppy.com/login",
    technique: "Typosquat — doubled letter", lesson: "An extra “p”: <b>chirppy</b>. Doubled letters slip past quick reads — and the page is a perfect copy." },
  "Snapgram": { difficulty: "medium", legit: "www.snapgram.com/accounts/login", fake: "www.snpagram.com/accounts/login",
    technique: "Typosquat — transposition", lesson: "“ap” becomes “pa”: <b>snpagram</b>. The letters are all correct, just two of them are swapped." },
  "CodeHub":    { difficulty: "medium", legit: "codehub.com/login", fake: "codehbu.com/login",
    technique: "Typosquat — transposition", lesson: "“ub” becomes “bu”: <b>codehbu</b>. A flipped pair at the end is genuinely hard to catch." },
  "Tunify":   { difficulty: "hard", legit: "accounts.tunify.com/login", fake: "accounts.tunıfy.com/login",
    technique: "Homoglyph — dotless “ı”", lesson: "The “i” is a Turkish dotless <b>ı</b> (U+0131) — same shape, missing only the dot. " + HG },

  // ─── Subdomain stuffing (readable if you check right-to-left — medium,
  //     not hard: hard is reserved for tricks the eye truly cannot resolve) ───
  "Crestline Bank":             { difficulty: "medium", legit: "secure.crestline.com/web/auth/login", fake: "crestline.com.login.verify-identity.net/auth",
    technique: "Subdomain stuffing", lesson: "Read right-to-left: the real domain is <b>verify-identity.net</b>. “crestline.com” is just a subdomain label glued on the front to fool a left-to-right reader." },
  "Summit Bank":     { difficulty: "medium", legit: "connect.secure.summitbank.com/auth/login", fake: "summitbank.com.secure.accounts.web-login.space/signon",
    technique: "Subdomain stuffing", lesson: "The actual site is <b>web-login.space</b> — everything before it is attacker-chosen text, including a fake “summitbank.com”." },
  "Harbor Bank": { difficulty: "medium", legit: "secure.harborbank.com/login/sign-in/signOn", fake: "harborbank.com.security.update-auth.info/login",
    technique: "Subdomain stuffing", lesson: "The registrable domain is <b>update-auth.info</b>, not harborbank.com. The bank name is only a subdomain prefix." },
  "ShipFast":             { difficulty: "medium", legit: "www.shipfast.com/en-us/tracking/manage", fake: "shipfast.com.package-tracking.shipment-delivery.top/track",
    technique: "Subdomain stuffing", lesson: "The real domain is <b>shipment-delivery.top</b>. Delivery-themed subdomains make the long chain feel plausible." },
  "GHX Express":               { difficulty: "medium", legit: "www.ghx.com/en/express/tracking", fake: "ghx.com.alert.delivery-status.holding-facility.site/track",
    technique: "Subdomain stuffing", lesson: "The site is actually <b>holding-facility.site</b>. “ghx.com” at the start is bait — the truth is always the last two labels." },
  "UPX":               { difficulty: "medium", legit: "www.upx.com/track/manage/mychoice", fake: "upx.com.mychoice.package.reschedule-portal.biz/track",
    technique: "Subdomain stuffing", lesson: "The owner of this page is <b>reschedule-portal.biz</b>. The brand is stuffed into the subdomains to hide that." },

  // ─── Look-alike TLDs ───
  "Meetly":    { difficulty: "medium", legit: "meetly.us/signin", fake: "meetly.download/signin",
    technique: "Wrong TLD", lesson: "Correct name, wrong ending. Meetly is <b>meetly.us</b>; <b>meetly.download</b> is a cheap generic TLD owned by someone else." },
  "Harmony": { difficulty: "medium", legit: "harmony.com/login", fake: "harmony.support/login",
    technique: "Wrong TLD", lesson: "Harmony lives on <b>harmony.com</b>. The friendly-looking <b>harmony.support</b> is a different registration entirely." },
  "Vapor":   { difficulty: "medium", legit: "store.vapor.com/login", fake: "store.vapor.gl/login",
    technique: "Wrong TLD", lesson: "Vapor's store is <b>vapor.com</b>. Swapping to <b>.gl</b> makes a brand-new domain that just looks official." },
  "Blockworld":  { difficulty: "medium", legit: "www.blockworld.com/login", fake: "www.blockworld.live/account",
    technique: "Wrong TLD", lesson: "<b>.live</b> is a different top-level domain — the real site is <b>blockworld.com</b>." },
  "Ryde":    { difficulty: "medium", legit: "auth.ryde.com/login", fake: "auth.ryde.help/login",
    technique: "Wrong TLD", lesson: "A support-looking <b>ryde.help</b> is not Ryde. The genuine domain is <b>ryde.com</b>." },
  "Roomly":  { difficulty: "medium", legit: "www.roomly.com/login", fake: "www.roomly.rentals/login",
    technique: "Wrong TLD", lesson: "<b>roomly.rentals</b> sounds on-brand, but it's a separate domain. Roomly is <b>roomly.com</b>." },

  // ─── Comb-glyphs (blended letters) ───
  "Valuemart":    { difficulty: "hard", legit: "www.valuemart.com/account/login", fake: "www.valuernart.com/account/login",
    technique: "Comb-glyph (rn → m)", lesson: "There's no “m” — it's “r” + “n”: <b>valuernart</b>. Side by side, “rn” is nearly indistinguishable from “m”." },
  "Macrosoft":  { difficulty: "hard", legit: "login.macrosoft.com/account", fake: "login.rnacrosoft.com/account",
    technique: "Comb-glyph (rn → m)", lesson: "That “m” is actually “rn”: <b>rnacrosoft</b>. The blended pair fakes a single letter." },
  "Wonder+":  { difficulty: "hard", legit: "www.wonderplus.com/login", fake: "www.wonderpIus.com/login",
    technique: "Comb-glyph (capital I → l)", lesson: "The “l” is a capital “I”: wonderp<b>I</b>us. In many fonts capital-I and lowercase-l are identical." },
  "Cloudforce": { difficulty: "hard", legit: "login.cloudforce.com/sign-in", fake: "login.cIoudforce.com/sign-in",
    technique: "Comb-glyph (capital I → l)", lesson: "“cloudforce” uses a capital “I” for the “l”: c<b>I</b>oudforce. Same pixel shape, different character." },
  "Twixly":     { difficulty: "hard", legit: "www.twixly.tv/login", fake: "www.twlxly.tv/login",
    technique: "Comb-glyph (l → i)", lesson: "The “i” is really a lowercase “l”: tw<b>l</b>xly. The missing dot is the only clue." },
  "eBuy":       { difficulty: "hard", legit: "signin.ebuy.com/signin", fake: "signin.ebuv.com/signin",
    technique: "Comb-glyph (v → y)", lesson: "The “y” is a “v”: <b>ebuv</b>. In some sans-serif fonts a “v” passes for a “y” at a glance." },

  // ─── Distinct extras ───
  "PayPeer":  { difficulty: "easy", fakeScheme: "http", legit: "www.paypeer.com/signin", fake: "www.paypeer-account.com/signin",
    technique: "Not secure (http) + look-alike", lesson: "Two red flags: it's <b>http://</b> with no padlock, and the real domain is <b>paypeer-account.com</b> — not paypeer.com." },
  "Coinvault": { difficulty: "hard", legit: "www.coinvault.com/signin", fake: "www.cоinvault.com/signin",
    technique: "Homoglyph (Cyrillic “о”)", lesson: "The first “o” is a Cyrillic <b>о</b>, not a Latin o — pixel-identical. " + HG },
  "Tradr": { difficulty: "medium", legit: "accounts.tradr.com/en/user/login", fake: "accounts.tradr.com@secure-wallet.io/login",
    technique: "The “@” trick", lesson: "Everything before the <b>@</b> is just a username and is ignored — the browser actually goes to <b>secure-wallet.io</b>. The “accounts.tradr.com” is pure bait." },
  "Pearl":     { difficulty: "medium", legit: "id.pearl.com/sign-in", fake: "pearl-id-verify.com/sign-in",
    technique: "Look-alike domain (combosquat)", lesson: "<b>pearl-id-verify.com</b> bolts extra words onto the brand. Pearl sign-in only happens on <b>pearl.com</b> — the added words make a brand-new, unrelated domain." },
  "Streamly":   { difficulty: "medium", legit: "www.streamly.com/login", fake: "account-billing.net/streamly/login",
    technique: "Brand hidden in the path", lesson: "The word “streamly” here is in the <b>path</b>, not the domain. The actual site is <b>account-billing.net</b> — what comes before the first single “/” is all that matters." },
  "PostEx":      { difficulty: "medium", legit: "track.postex.com/go/TrackConfirm", fake: "package-status.info/postex/redelivery",
    technique: "Brand hidden in the path", lesson: "“postex” sits in the <b>path</b>; the real domain is <b>package-status.info</b>. A brand name after the first “/” means nothing." },
  "Pinly": { difficulty: "medium", legit: "www.pinly.com/login", fake: "wwwpinly.com/login",
    technique: "Run-together “www” (missing dot)", lesson: "There's no dot after “www”: <b>wwwpinly.com</b> is a single label — a different domain from <b>www.pinly.com</b>." },
  "ChatBox":  { difficulty: "medium", legit: "web.chatbox.com/", fake: "web.chatbox.cm/",
    technique: "TLD typo (.cm vs .com)", lesson: "The ending is <b>.cm</b> (Cameroon), not <b>.com</b> — a one-letter TLD typo that catches fast fingers and fast eyes alike." },
  "Snapzy":  { difficulty: "easy", legit: "accounts.snapzy.com/login", fake: "accounts.sn4pzy.com/login",
    technique: "Typosquat — digit for letter", lesson: "The “a” is a <b>4</b>: sn4pzy. Numbers swapped for letters are a classic, and easy to catch if you read it." },
};

// ── Inline imagery helpers (gradient "photos", avatars, charts) ──
const PG_GRADS = [
  ["#ff7a7a", "#c0392b"], ["#5b8cff", "#3f51b5"], ["#2fd27a", "#0f9d58"],
  ["#e0a73a", "#b9770f"], ["#9b6bff", "#5a3fd0"], ["#ff8a65", "#e64a19"],
  ["#26c6da", "#00838f"], ["#ec6aa0", "#ad1457"], ["#66bb6a", "#2e7d32"],
  ["#42a5f5", "#1565c0"], ["#ffca5f", "#ef6c00"], ["#7e8cff", "#3949ab"],
];
function pgGrad(i) { const g = PG_GRADS[((i % PG_GRADS.length) + PG_GRADS.length) % PG_GRADS.length]; return `linear-gradient(135deg, ${g[0]}, ${g[1]})`; }
function tile(i, label, h, ic) { return `<div class="pg-thumb" style="background:${pgGrad(i)};height:${h || 92}px"><span class="pg-photo-ic">${ic || "🎬"}</span>${label ? `<span class="pg-thumb-cap">${label}</span>` : ""}</div>`; }
// A "photo" subject emoji centred on a gradient so image cells read as real pictures
function photoIc(ic) { return `<span class="pg-photo-ic">${ic}</span>`; }
// CSS/SVG sunset-over-water scene for the social post photo (looks like a real snapshot)
function photoScene() {
  return `<svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" class="pg-scene" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pgSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ff8f5e"/><stop offset="0.42" stop-color="#ffd08a"/>
        <stop offset="0.58" stop-color="#ffe9c4"/><stop offset="1" stop-color="#a9d4d8"/>
      </linearGradient>
      <linearGradient id="pgWater" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#cfe6e3"/><stop offset="1" stop-color="#3f7e8f"/>
      </linearGradient>
    </defs>
    <rect width="400" height="112" fill="url(#pgSky)"/>
    <circle cx="200" cy="96" r="32" fill="#fff4d8"/>
    <path d="M0 112 L70 78 L130 100 L200 64 L270 98 L340 80 L400 104 L400 112 Z" fill="#587486" opacity="0.55"/>
    <rect y="112" width="400" height="68" fill="url(#pgWater)"/>
    <ellipse cx="200" cy="124" rx="28" ry="6" fill="#fff4d8" opacity="0.7"/>
    <g stroke="#ffffff" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round">
      <line x1="46" y1="134" x2="120" y2="134"/><line x1="252" y1="146" x2="346" y2="146"/>
      <line x1="96" y1="162" x2="210" y2="162"/><line x1="280" y1="166" x2="356" y2="166"/>
    </g>
  </svg>`;
}
function avatar(txt, i, cls) { return `<span class="pg-av ${cls || ""}" style="background:${pgGrad(i)}">${txt}</span>`; }
function initialsOf(n) { return (n.replace(/[^A-Za-z ]/g, "").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()) || "X"; }
function sparkline(color) {
  const pts = [7, 9, 8, 12, 10, 15, 13, 17, 15, 21, 19, 25, 24];
  const w = 320, h = 76, max = 28, step = w / (pts.length - 1);
  const line = pts.map((p, i) => `${(i * step).toFixed(0)},${(h - (p / max) * h).toFixed(0)}`).join(" ");
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" class="pg-spark"><polygon points="0,${h} ${line} ${w},${h}" fill="${color}" opacity="0.14"/><polyline points="${line}" fill="none" stroke="${color}" stroke-width="2.6"/></svg>`;
}
function mapBg(color) {
  return `<svg viewBox="0 0 400 160" preserveAspectRatio="none" class="pg-mapsvg"><rect width="400" height="160" fill="#e8edf2"/>` +
    `<path d="M0 50 H400 M0 110 H400 M90 0 V160 M250 0 V160" stroke="#d4dce5" stroke-width="6"/>` +
    `<path d="M30 140 C120 120 160 70 250 60 S360 30 390 20" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round"/>` +
    `<circle cx="30" cy="140" r="7" fill="${color}"/><circle cx="390" cy="20" r="7" fill="#1a1f2b"/></svg>`;
}

const SAMPLE = {
  products: [["Wireless headphones", 79, "🎧"], ["Smart watch", 149, "⌚"], ["4K webcam", 64, "📷"], ["Mech keyboard", 99, "⌨️"], ["Desk lamp", 32, "💡"], ["USB-C hub", 45, "🔌"]],
  games: [["Starfall", "🚀"], ["Apex Drift", "🏎️"], ["Mythos", "🐉"], ["Pixel Raid", "👾"], ["Velocity", "⚡"]],
  places: [["Cabin in the pines", "🌲"], ["Beachfront villa", "🏖️"], ["City loft", "🏙️"], ["Mountain chalet", "🏔️"]],
  coins: [["BTC", "Bitwave", "61,420", 2.4, true], ["ETH", "Ethon", "3,180", 1.1, true], ["SOL", "Solo", "148", -0.6, false], ["ADA", "Cardia", "0.62", 0.9, true]],
  mails: [[1, "Billing Team", "Your invoice is ready", "9:14 AM"], [1, "Maya Chen", "Re: project kickoff", "8:02 AM"], [0, "Newsletter", "5 tips for the week", "Yesterday"], [0, "Security", "New sign-in to your account", "Mon"]],
  tx: [["☕", "Corner Café", "Today", -4.5], ["💸", "From Jordan P.", "Yesterday", 25], ["🛒", "Greengrocer", "Yesterday", -38.2], ["⛽", "Shell Station", "Mon", -52]],
  repos: [["web-client", "Frontend app", "TypeScript"], ["api-server", "Core API", "Go"], ["design-system", "UI components", "CSS"]],
  steps: ["Picked up", "In transit", "Out for delivery", "Delivered"],
};

// ── Detailed, lifelike homepage per category ──
function siteHome(b) {
  const n = b.name, c = b.color;
  switch (b.kind) {
    case "streaming": return `
      <div class="pg">
        <div class="pg-feature" style="--c:${c}">
          <div class="pg-feature-bg"></div>
          <div class="pg-feature-body">
            <span class="pg-badge">${n} ORIGINAL</span>
            <h2>The Last Signal</h2>
            <p>A gripping new series — streaming now.</p>
            <div class="pg-cta-row"><button class="pg-btn-fill">▶ Play</button><button class="pg-btn-ghost">＋ My List</button></div>
          </div>
        </div>
        <div class="pg-sec"><h4>Trending now</h4><div class="pg-rowscroll">${[0, 1, 2, 3, 4, 5].map((i) => tile(i + 1, "", 110)).join("")}</div></div>
        <div class="pg-sec"><h4>Continue watching</h4><div class="pg-rowscroll">${[6, 7, 8, 9].map((i) => tile(i, "", 110)).join("")}</div></div>
      </div>`;

    case "shopping": return `
      <div class="pg">
        <div class="pg-promo" style="--c:${c}"><div><div class="pg-badge light">DEALS OF THE DAY</div><h2>Up to 50% off</h2><button class="pg-btn-fill">Shop now</button></div><div class="pg-promo-img" style="background:${pgGrad(3)}">${photoIc("🛍️")}</div></div>
        <h4 class="pg-h">Recommended for you</h4>
        <div class="pg-grid">${SAMPLE.products.map((p, i) => `<div class="pg-card"><div class="pg-card-img" style="background:${pgGrad(i)}">${photoIc(p[2])}</div><div class="pg-card-name">${p[0]}</div><div class="pg-price">$${p[1]}<span class="pg-rate">★ 4.${5 + (i % 4)}</span></div></div>`).join("")}</div>
      </div>`;

    case "delivery": return `
      <div class="pg pg-pad">
        <h2 class="pg-title">Track your shipment</h2>
        <div class="pg-track"><input value="${n.toUpperCase().replace(/\s/g, "")}-8842-9173" /><button class="pg-btn-fill">Track</button></div>
        <div class="pg-steps">${SAMPLE.steps.map((s, i) => `<div class="pg-step ${i <= 2 ? "done" : ""}"><span class="pg-step-dot"></span><span>${s}</span></div>`).join("")}</div>
        <div class="pg-map">${mapBg(c)}</div>
        <p class="pg-eta">📦 Estimated delivery: <b>Tomorrow by 8:00 PM</b></p>
      </div>`;

    case "bank": return `
      <div class="pg pg-pad">
        <h2 class="pg-title">Good afternoon, Taylor</h2>
        <div class="pg-bankcards">
          <div class="pg-acct" style="--c:${c}"><span class="pg-acct-t">Checking ••4821</span><b>$4,219.55</b><span class="pg-acct-s">Available balance</span></div>
          <div class="pg-acct alt"><span class="pg-acct-t">Savings ••7730</span><b>$18,940.12</b><span class="pg-acct-s">+$120 interest</span></div>
        </div>
        <div class="pg-quick">${["Transfer", "Pay bills", "Deposit", "Cards"].map((a) => `<button class="pg-quick-b">${a}</button>`).join("")}</div>
        <div class="pg-bankpromo" style="--c:${c}"><div><b>Earn 4.50% APY</b><p>Open a high-yield savings account in minutes.</p></div><span class="pg-bankpromo-i">%</span></div>
      </div>`;

    case "crypto": return `
      <div class="pg pg-pad">
        <div class="pg-cxtop"><div><span class="pg-mut">Portfolio value</span><h2>$12,847.20</h2><span class="pg-up">▲ 3.2% ($398) today</span></div><button class="pg-btn-fill">Buy / Sell</button></div>
        <div class="pg-chart">${sparkline(c)}</div>
        <div class="pg-list">${SAMPLE.coins.map((co, i) => `<div class="pg-li">${avatar(co[0], i, "sm")}<div class="pg-li-main"><b>${co[1]}</b><span class="pg-mut">${co[0]}</span></div><span class="pg-li-px">$${co[2]}</span><span class="${co[4] ? "pg-up" : "pg-down"}">${co[4] ? "▲" : "▼"} ${Math.abs(co[3])}%</span></div>`).join("")}</div>
      </div>`;

    case "wallet": return `
      <div class="pg pg-pad">
        <div class="pg-balcard" style="--c:${c}"><span>${n} balance</span><h2>$1,284.50</h2><div class="pg-cta-row"><button class="pg-btn-light">Send</button><button class="pg-btn-light">Request</button><button class="pg-btn-light">Add money</button></div></div>
        <h4 class="pg-h">Recent activity</h4>
        <div class="pg-list">${SAMPLE.tx.map((t, i) => `<div class="pg-li"><span class="pg-emoji">${t[0]}</span><div class="pg-li-main"><b>${t[1]}</b><span class="pg-mut">${t[2]}</span></div><span class="${t[3] < 0 ? "pg-down" : "pg-up"}">${t[3] < 0 ? "−" : "+"}$${Math.abs(t[3])}</span></div>`).join("")}</div>
      </div>`;

    case "email": return `
      <div class="pg">
        <div class="pg-emtop"><div class="pg-emsearch">🔍 Search mail</div>${avatar(initialsOf(n), 4, "sm")}</div>
        <div class="pg-list flush">${SAMPLE.mails.map((m, i) => `<div class="pg-mail ${m[0] ? "unread" : ""}">${avatar(initialsOf(m[1]), i + 2, "sm")}<div class="pg-mail-main"><b>${m[1]}</b><span class="pg-mut">${m[2]}</span></div><span class="pg-mut sm">${m[3]}</span></div>`).join("")}</div>
      </div>`;

    case "social": return `
      <div class="pg pg-pad">
        <div class="pg-compose">${avatar("You", 2, "sm")}<div class="pg-cinput">What's on your mind?</div></div>
        <div class="pg-post">
          <div class="pg-post-head">${avatar("AM", 7, "sm")}<div><b>Alex Morgan</b><div class="pg-mut sm">2h · 🌍</div></div></div>
          <p class="pg-post-text">Had the best weekend at the lake — already counting down to the next one 🌅🛶</p>
          <div class="pg-post-photo">${photoScene()}</div>
          <div class="pg-post-actions"><span>👍 Like</span><span>💬 Comment</span><span>↪ Share</span></div>
        </div>
      </div>`;

    case "gaming": return `
      <div class="pg">
        <div class="pg-feature game" style="--c:${c}"><div class="pg-feature-bg" style="background:${pgGrad(5)}"></div><div class="pg-feature-body"><span class="pg-badge">SPECIAL OFFER · −50%</span><h2>Starfall: Odyssey</h2><p>The galaxy is yours to explore.</p><button class="pg-btn-fill">Add to cart — $29.99</button></div></div>
        <div class="pg-sec"><h4>Popular on ${n}</h4><div class="pg-rowscroll">${SAMPLE.games.map((g, i) => `<div class="pg-thumb tall" style="background:${pgGrad(i)}"><span class="pg-photo-ic">${g[1]}</span><span class="pg-thumb-cap">${g[0]}</span></div>`).join("")}</div></div>
      </div>`;

    case "travel": return `
      <div class="pg pg-pad">
        <div class="pg-travelbar">📍 Anywhere&nbsp;·&nbsp;Any week&nbsp;·&nbsp;Add guests<button class="pg-btn-fill sm">Search</button></div>
        <div class="pg-grid">${SAMPLE.places.map((p, i) => `<div class="pg-card"><div class="pg-card-img tall" style="background:${pgGrad(i)}">${photoIc(p[1])}</div><div class="pg-card-name">${p[0]}</div><div class="pg-price">$${120 + i * 45}<span class="pg-mut"> /night</span><span class="pg-rate">★ 4.9</span></div></div>`).join("")}</div>
      </div>`;

    case "rideshare": return `
      <div class="pg">
        <div class="pg-ridemap">${mapBg(c)}</div>
        <div class="pg-ridecard">
          <div class="pg-ridewhere"><span>🟢 Current location</span><span>🏁 Where to?</span></div>
          <div class="pg-rideopts">${[["🚗", "Economy", "$12", true], ["🚙", "Comfort", "$18", false], ["🚐", "XL", "$24", false]].map((o) => `<div class="pg-rideopt ${o[3] ? "sel" : ""}"><span class="pg-emoji">${o[0]}</span><span>${o[1]}</span><b>${o[2]}</b></div>`).join("")}</div>
          <button class="pg-btn-fill wide">Request ${n}</button>
        </div>
      </div>`;

    case "dev": return `
      <div class="pg pg-pad">
        <div class="pg-devtop">${avatar(initialsOf(n), 4, "sm")}<b>your-org</b><span class="pg-mut">/ repositories</span></div>
        <div class="pg-list">${SAMPLE.repos.map((r, i) => `<div class="pg-repo"><div class="pg-repo-main"><b>${r[0]}</b><span class="pg-mut">${r[1]}</span></div><span class="pg-lang"><span class="pg-dot" style="background:${PG_GRADS[i][0]}"></span>${r[2]}</span></div>`).join("")}</div>
      </div>`;

    default: // work / SaaS
      return `
      <div class="pg">
        <div class="pg-wkhero" style="--c:${c}"><div><h2>Welcome back to ${n}</h2><p>Your team's work, all in one place.</p><button class="pg-btn-fill">Open dashboard</button></div><div class="pg-wkillus">${sparkline(c)}</div></div>
        <div class="pg-tiles">${[["📊", "Reports"], ["📁", "Files"], ["✅", "Tasks"], ["📅", "Calendar"], ["💬", "Messages"], ["⚙️", "Settings"]].map((t) => `<div class="pg-tile"><span class="pg-tile-i">${t[0]}</span><span>${t[1]}</span></div>`).join("")}</div>
      </div>`;
  }
}

// Layer the look-alike phishing data onto each brand's theme, and give every
// one a generic monogram + per-category homepage. Phish-EMAIL brands aren't in
// PHISH — they carry their own name/mark/home — so they're left untouched.
BRANDS.forEach((b) => {
  const p = PHISH[b.name];
  if (!p) return;
  Object.assign(b, p);                 // legit, fake, technique, lesson, difficulty
  b.nameHtml = "";
  b.navExtra = "";
  b.mark = () => monogram(b.mono, b.color, b.monoFg || "#fff");
  b.home = () => siteHome(b);
});

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
  audience: "personal", // 'personal' | 'enterprise' (Entra ID SSO + QR cross-device)
  passkey: {
    registered: false,
    credentialId: null,
    kind: "platform", // 'platform' (this device) | 'hybrid' (phone via QR)
    boundDomains: [], // legit domains the passkey "works" on
  },
};

const PK_STORE_KEY = "phishgame.passkey";
const STATS_KEY = "phishgame.stats";
const AUD_KEY = "phishgame.audience";

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
// True on phones/tablets — used to pick device-appropriate prompt copy and
// to skip the QR cross-device flow when the player is ALREADY on the phone.
function isTouchDevice() {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}
// Generic name for the OS unlock prompt — deliberately vendor-neutral (no
// real product names), and device-appropriate either way.
function verifierName() {
  return isTouchDevice() ? "face or fingerprint unlock" : "your fingerprint, face, or PIN";
}

function loadStoredPasskey() {
  try {
    const raw = localStorage.getItem(PK_STORE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    state.passkey.registered = true;
    state.passkey.credentialId = data.credentialId || null;
    state.passkey.kind = data.kind || "platform"; // 'platform' | 'hybrid'
    state.passkey.boundDomains = BRANDS.map((b) => b.legit);
    reflectPasskeyState();
  } catch (_) { /* ignore */ }
}

function reflectPasskeyState() {
  const statusEl = $("#passkey-status");
  const playBtn = $("#btn-play-passkey");
  const subEl = $("#passkey-mode-sub");
  if (state.passkey.registered) {
    statusEl.textContent =
      state.passkey.kind === "hybrid"
        ? "✓ Work passkey registered on your phone (Entra ID · one account, SSO everywhere)."
        : "✓ Passkey registered on this device.";
    statusEl.className = "passkey-status ok";
    playBtn.disabled = false;
    subEl.textContent = "You'll spot every phish";
    const testBtn = $("#btn-test-passkey");
    if (testBtn) testBtn.style.display = "";
  }
}

async function registerPasskey() {
  const statusEl = $("#passkey-status");
  // Enterprise on a computer = cross-device: the browser shows a QR code and
  // the passkey is created on the player's phone. Enterprise on a phone (or
  // any personal play) creates the passkey right on this device — the phone
  // IS the device, no QR needed.
  const crossDevice = state.audience === "enterprise" && !isTouchDevice();
  statusEl.className = "passkey-status info";
  statusEl.textContent = crossDevice
    ? "In the browser dialog, choose the option to use another phone or tablet, then scan the QR code with your phone…"
    : `Waiting for your device (${verifierName()})…`;

  // The honest path: a real passkey via WebAuthn.
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
          user: state.audience === "enterprise"
            ? {
                id: randomBytes(16),
                name: "jordan.lee@norvia.example",
                displayName: "Jordan Lee (Norvia Corp · Entra ID)",
              }
            : {
                id: randomBytes(16),
                name: "player@phishgame.demo",
                displayName: "Phish Game Player",
              },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },   // ES256
            { type: "public-key", alg: -257 }, // RS256
          ],
          authenticatorSelection: {
            // cross-platform = exclude this computer's own authenticator, so
            // the browser offers the QR/cross-device path; platform = the
            // local biometric / PIN unlock prompt.
            authenticatorAttachment: crossDevice ? "cross-platform" : "platform",
            residentKey: "preferred",
            userVerification: "preferred",
          },
          // Newer browsers use hints to put the QR option first; unknown
          // dictionary members are ignored elsewhere, so this is safe.
          ...(crossDevice ? { hints: ["hybrid"] } : {}),
          timeout: 120000,
          attestation: "none",
        },
      });
      const id = bufToBase64Url(cred.rawId);
      finalizeRegistration(id, true, crossDevice ? "hybrid" : "platform");
      return;
    } catch (err) {
      if (err && err.name === "NotAllowedError") {
        statusEl.className = "passkey-status err";
        statusEl.textContent = "Passkey prompt was dismissed. Try again when ready.";
        return;
      }
      // Any other failure → fall back to simulated passkey.
      console.warn("WebAuthn unavailable, simulating:", err);
      finalizeRegistration("simulated-" + Date.now(), false, "platform");
      return;
    }
  }

  // No secure context (e.g. opened as a file://) → simulate.
  finalizeRegistration("simulated-" + Date.now(), false, "platform");
  $("#passkey-status").className = "passkey-status info";
  $("#passkey-status").textContent =
    "✓ Passkey registered (simulated — serve over https or localhost for a real passkey prompt).";
}

function finalizeRegistration(credentialId, real, kind) {
  state.passkey.registered = true;
  state.passkey.credentialId = credentialId;
  state.passkey.kind = kind || "platform";
  state.passkey.boundDomains = BRANDS.map((b) => b.legit);
  try {
    localStorage.setItem(
      PK_STORE_KEY,
      JSON.stringify({ credentialId, real, kind: state.passkey.kind, at: Date.now() })
    );
  } catch (_) { /* ignore */ }
  reflectPasskeyState();
  if (real) {
    $("#passkey-status").className = "passkey-status ok";
    $("#passkey-status").textContent =
      state.passkey.kind === "hybrid"
        ? "✓ Work passkey created on your phone via the QR code — one Entra ID account, one passkey, SSO everywhere."
        : `✓ Device-bound passkey created with ${verifierName()}.`;
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
//   kind 'real' → asks for the passkey you registered (biometric, succeeds)
//   kind 'fake' → asks for a credential that doesn't exist on this device,
//                 so the browser shows its own native "no passkey" UI and
//                 genuinely fails — the real phishing-site experience.
// Returns { sim:true } when there's no real authenticator (caller should
// fall back to the simulated illustration).
async function attemptPasskey(kind) {
  if (!realPasskeyAvailable()) return { sim: true };
  // A cross-device ('hybrid') passkey lives on the player's phone, so the
  // real sign-in must offer the hybrid transport — the browser shows the
  // QR / "use your phone" flow again, exactly like a real enterprise SSO
  // sign-in at a workstation. The fake attempt stays internal-only so the
  // browser fails fast with its native "no passkey" UI.
  const realTransports =
    state.passkey.kind === "hybrid" ? ["hybrid", "internal"] : ["internal"];
  const allowCredentials =
    kind === "real"
      ? [{ type: "public-key", id: base64UrlToBuf(state.passkey.credentialId), transports: realTransports }]
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
  status.textContent =
    state.passkey.kind === "hybrid"
      ? "Follow the browser dialog — confirm with your phone…"
      : `Waiting for ${verifierName()}…`;
  const r = await attemptPasskey("real");
  if (r.sim) {
    status.className = "passkey-status info";
    status.innerHTML =
      "✓ Passkey verified (simulated). Open this over <b>https</b> or <b>localhost</b> in a real browser to feel the actual unlock prompt.";
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
  if (t.includes("red flag")) return "redflags";
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
  redflags: { label: "Email red flags", tip: "Urgency, threats, generic greetings, and sloppy grammar are the tell — not just the sender address." },
  omission: { label: "Missing letters", tip: "Read the brand name letter by letter — a single dropped character hides in plain sight." },
  transposition: { label: "Swapped letters", tip: "Two flipped letters still ‘read’ right. Slow down on the spelling." },
  doubled: { label: "Doubled letters", tip: "An extra repeated letter sneaks past a quick glance." },
  substitution: { label: "Digit-for-letter", tip: "Watch for 0/o, 1/l, 4/a — numbers posing as letters." },
  combosquat: { label: "Look-alike domains", tip: "Extra words or hyphens make a brand-new domain. The brand name alone proves nothing." },
  subdomain: { label: "Subdomain stuffing", tip: "Read a URL right-to-left: the real site is the part just before the first ‘/’." },
  brandpath: { label: "Brand in the path", tip: "A brand after the first ‘/’ is meaningless — check the domain itself (the part before it)." },
  wwwrunon: { label: "Run-together ‘www’", tip: "No dot after ‘www’ makes one big fake label, not the real site." },
  tldtypo: { label: "TLD typos", tip: "Watch the ending: .cm / .co are not .com." },
  tld: { label: "Wrong endings (TLD)", tip: "Same name, different ending = a different owner." },
  "comb-rn": { label: "Blended letters (rn→m)", tip: "‘rn’ side by side looks just like ‘m’. Look closely at every letter." },
  "comb-letter": { label: "Look-alike letters", tip: "Capital-I vs l, l vs i, v vs y — fonts make these nearly identical." },
  homoglyph: { label: "Hidden characters", tip: "Some letters are foreign look-alikes; a real browser unmasks them as a confusing ‘xn--’ address." },
  at: { label: "The ‘@’ trick", tip: "Everything before an ‘@’ in a URL is ignored — the browser goes to whatever follows it." },
  http: { label: "Not secure (http)", tip: "No padlock means no encryption. Never type a password on an http page." },
  other: { label: "Look-alike sites", tip: "Always verify the domain before you sign in." },
};

// In-depth guide to every technique the game features, rendered as an
// accordion on the home screen. `fake` highlights the malicious part with
// <span class="tdiff">…</span>.
const TECH_GUIDE = [
  { ic: "🔤", label: "Missing letter (omission)", tier: "easy",
    how: "A single character is quietly dropped from the brand name. We recognise familiar words by their overall shape, not letter by letter, so your brain silently fills the gap back in and reads the genuine name.",
    tell: "Spell the domain out one letter at a time.",
    real: "linkup.com", fake: 'lin<span class="tdiff">·</span>up.com <span class="tnote">(no “k”)</span>' },
  { ic: "🔁", label: "Swapped letters (transposition)", tier: "medium",
    how: "Two neighbouring letters trade places. Every correct letter is still present, just reordered, so the word reads almost normally at speed.",
    tell: "Check the order of letters in the middle of the name.",
    real: "snapgram.com", fake: 'sn<span class="tdiff">pa</span>gram.com' },
  { ic: "⏩", label: "Doubled letter", tier: "medium",
    how: "An extra copy of a letter is slipped in. Repeated letters are hard to count at a glance, so the duplicate hides in plain sight.",
    tell: "Watch for a letter that appears one too many times.",
    real: "chirpy.com", fake: 'chir<span class="tdiff">p</span>py.com' },
  { ic: "🔢", label: "Digit for a letter (substitution)", tier: "easy",
    how: "A number stands in for a look-alike letter — 0 for o, 1 for l, 4 for a. Obvious when you read it, invisible when you skim.",
    tell: "Numbers don’t belong in most brand names.",
    real: "snapzy.com", fake: 'sn<span class="tdiff">4</span>pzy.com' },
  { ic: "🌐", label: "Wrong ending (TLD)", tier: "medium",
    how: "Same brand name, different ending — “harmony.support” instead of “harmony.com”. Every top-level domain is a separate registration anyone can buy, so the name alone guarantees nothing about who owns the site.",
    tell: "Confirm the exact ending the brand really uses.",
    real: "harmony.com", fake: 'harmony.<span class="tdiff">support</span>' },
  { ic: "⌨️", label: "TLD typo (.cm / .co)", tier: "medium",
    how: "The ending is off by one character — “.cm” (Cameroon) or “.co” instead of “.com”. A classic trap for fast fingers and fast eyes alike.",
    tell: "Read the very end of the domain carefully.",
    real: "brand.com", fake: 'brand.<span class="tdiff">cm</span>' },
  { ic: "🧩", label: "Look-alike domain (combosquat)", tier: "medium",
    how: "Extra words or hyphens are bolted onto the brand to build a brand-new domain — “pearl-id-verify.com”. Registering that is trivial; the brand appearing inside it says nothing about who runs the page.",
    tell: "The registrable domain is just before the first single “/”. Added words make it a different owner.",
    real: "pearl.com", fake: 'pearl<span class="tdiff">-id-verify</span>.com' },
  { ic: "🔗", label: "Run-together “www” (missing dot)", tier: "medium",
    how: "There’s no dot after “www”: “wwwpinly.com”. That fuses it into a single label — a completely different domain from “www.pinly.com”.",
    tell: "Look for the dot right after “www”.",
    real: "www.pinly.com", fake: 'www<span class="tdiff">●</span>pinly.com <span class="tnote">(no dot)</span>' },
  { ic: "🪆", label: "Subdomain stuffing", tier: "medium",
    how: "The brand is placed as a label in front of the attacker’s real domain: “harborbank.com.update-auth.info”. Only the two labels just before the first single “/” actually own the site.",
    tell: "Read the domain right-to-left — the truth is the last two labels.",
    real: "harborbank.com", fake: 'harborbank.com.<span class="tdiff">update-auth.info</span>' },
  { ic: "🛣️", label: "Brand hidden in the path", tier: "medium",
    how: "The brand appears after the first “/”, in the path: “account-billing.net/streamly/login”. Everything after the domain is chosen by whoever owns that domain, so a brand there means nothing.",
    tell: "Only the part before the first single “/” identifies the site.",
    real: "streamly.com", fake: '<span class="tdiff">account-billing.net</span>/streamly/login' },
  { ic: "🎭", label: "The “@” trick", tier: "medium",
    how: "Everything before an “@” in a URL is treated as a username and discarded. “accounts.tradr.com@secure-wallet.io” actually loads secure-wallet.io — the trusted-looking part is pure decoration.",
    tell: "If there’s an “@” in the address, the real site is whatever follows it.",
    real: "tradr.com", fake: 'accounts.tradr.com<span class="tdiff">@secure-wallet.io</span>' },
  { ic: "🔬", label: "Blended letters (rn → m)", tier: "hard",
    how: "Two letters sit side by side to impersonate a third: “rn” looks just like “m”. “valuernart” reads as “valuemart” at a glance.",
    tell: "Look closely at any “m” — is it really “r” + “n”?",
    real: "valuemart.com", fake: 'value<span class="tdiff">rn</span>art.com' },
  { ic: "🔎", label: "Look-alike letters (capital-I, l, v…)", tier: "hard",
    how: "Different characters share a shape in common fonts — capital-I vs lowercase-l, l vs i, v vs y. “cIoudforce” uses a capital I where the “l” should be.",
    tell: "Suspicious of a letter? Select the text or retype it to see its true form.",
    real: "cloudforce.com", fake: 'c<span class="tdiff">I</span>oudforce.com' },
  { ic: "🥷", label: "Hidden character (homoglyph)", tier: "hard",
    how: "A letter is swapped for an identical-looking one from another alphabet — a Cyrillic “о” or Greek look-alike. To your eye it’s pixel-perfect; a real browser unmasks it as a confusing “xn--…” (Punycode) address in the bar.",
    tell: "If a familiar name suddenly renders as “xn--”, it’s a fake.",
    real: "brand.com", fake: 'br<span class="tdiff">а</span>nd.com <span class="tnote">(Cyrillic “а”)</span>' },
  { ic: "🔓", label: "Not secure (http)", tier: "easy",
    how: "The page loads over plain “http://” with no padlock, so anything you type travels unencrypted and readable. It’s often paired with a look-alike domain for a double hit.",
    tell: "No padlock means never type a password.",
    real: "https://paypeer.com", fake: '<span class="tdiff">http://</span>paypeer-account.com' },
  { ic: "📧", label: "Common email red flags", tier: "easy",
    how: "Not every phish relies on a look-alike domain. Urgent countdowns, threats of account closure, generic “Dear Customer” greetings, too-good-to-be-true prizes, and sloppy grammar are the classic tells of a mass-blasted phishing email — no domain trick required at all.",
    tell: "Slow down and ask: would the real company actually threaten me by email?",
    real: "Hi Jordan — your statement is ready, no action needed.",
    fake: '<span class="tdiff">Dear Valued Customer</span> — verify <span class="tdiff">within 24 hours</span> or your account will be <span class="tdiff">suspended</span>.' },
];

// Grid of technique cards. On a mouse/trackpad, hovering (or focusing) a
// card previews its detail in a small popover — no click needed. On touch,
// where hover doesn't exist, tapping a card pins the same detail open
// in-place instead (handled by the .open class + CSS below).
function renderTechniques() {
  const host = document.getElementById("tech-dd-list");
  if (!host) return;
  const tierLabel = { easy: "EASY", medium: "MEDIUM", hard: "HARD" };
  host.innerHTML = TECH_GUIDE.map((t, i) => `
    <div class="tech-card" tabindex="0" role="button" aria-expanded="false" data-i="${i}">
      <div class="tech-card-face">
        <span class="tech-ic">${t.ic}</span>
        <span class="tech-name">${t.label}</span>
        <span class="tech-tier diff-${t.tier}">${tierLabel[t.tier]}</span>
      </div>
      <div class="tech-detail">
        <p class="tech-how">${t.how}</p>
        <div class="tech-ex">
          <div><span class="tech-ex-k">Real</span><code class="ok">${t.real}</code></div>
          <div><span class="tech-ex-k">Fake</span><code class="bad">${t.fake}</code></div>
        </div>
        <p class="tech-tell"><b>Spot it:</b> ${t.tell}</p>
      </div>
    </div>`).join("");

  const cards = host.querySelectorAll(".tech-card");
  const setOpen = (card, open) => {
    card.classList.toggle("open", open);
    card.setAttribute("aria-expanded", String(open));
  };
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const willOpen = !card.classList.contains("open");
      cards.forEach((c) => { if (c !== card) setOpen(c, false); });
      setOpen(card, willOpen);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.click(); }
    });
  });
}

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
  const isMail = brand.kind === "phishmail";
  if (isMail) {
    $("#scenario").innerHTML =
      `Two emails claiming to be from <strong>${brand.name}</strong> just landed in your inbox. ` +
      (state.mode === "eyes"
        ? `<strong>Click through on the real one.</strong>`
        : `<strong>Click through — your passkey only works on the genuine one.</strong>`);
  } else {
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
  }

  // Build the two windows (each is a full brand homepage)
  const leftReal = state.realIsLeft;
  $("#windows").innerHTML = "";
  const w1 = buildWindow(brand, leftReal), w2 = buildWindow(brand, !leftReal);
  w1.classList.add("win-enter", "win-enter-l");
  w2.classList.add("win-enter", "win-enter-r");
  $("#windows").appendChild(w1);
  $("#windows").appendChild(w2);
  startTimer();

  // Touch / mobile-width gets tap guidance; pointer devices get hover/keys.
  // Width is included because the stacked mobile layout kicks in at ≤880px
  // and pointer-type media queries aren't reliable under device emulation.
  const touch = window.matchMedia("(hover: none), (pointer: coarse), (max-width: 880px)").matches;
  const inspect = touch
    ? " <span class=\"muted\">(tap a tab’s address bar to reveal the full link)</span>"
    : " <span class=\"muted\">(hover a URL for the full address · keys 1 / 2)</span>";
  const eyesHint = isMail
    ? "Read the tone, not just the sender — one of these is trying to rush you into a mistake."
    : brand.difficulty === "easy"
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
  const isMail = brand.kind === "phishmail";
  const win = document.createElement("div");
  win.className = "window" + (isMail ? " window-mail" : "");
  win.style.setProperty("--brand", brand.color);
  win.dataset.real = String(isReal);
  win.dataset.domain = domain;

  const signLabel = state.mode === "passkey" ? "🔑 Sign in" : "Sign in";

  // Most phishing sites have valid https certs too — so a padlock alone
  // proves nothing. A few easy rounds drop to http to teach that signal.
  // Email addresses have no scheme/padlock at all — show an envelope instead.
  const insecure = !isMail && !isReal && brand.fakeScheme === "http";
  const scheme = isMail ? "" : insecure ? "http://" : "https://";
  const lock = isMail
    ? `<span class="lock mail">✉️</span>`
    : insecure
    ? `<span class="lock insecure">⚠</span><span class="notsecure">Not secure</span>`
    : `<span class="lock secure">🔒</span>`;

  // Show the address with the path muted (like a real browser) so length
  // alone is not a tell; the full URL is on hover via title=.
  const slash = domain.indexOf("/");
  const hostPart = slash === -1 ? domain : domain.slice(0, slash);
  const pathPart = slash === -1 ? "" : domain.slice(slash);

  // Each window is a full, unique brand homepage/email. The ONLY real
  // difference is the host (and sometimes the scheme) in the address bar —
  // except phishmail rounds, where the two windows' CONTENT differs too
  // (tone, greeting, urgency), because that's the thing being taught there.
  win.innerHTML = `
    <div class="win-chrome">
      <div class="traffic"><span class="r"></span><span class="y"></span><span class="g"></span></div>
      <div class="urlbar" title="${scheme}${domain}">
        ${lock}
        <span class="favicon">${brand.mark()}</span>
        <span class="urladdr">${isMail ? '<span class="mail-label">From&nbsp;</span>' : ""}<span class="host">${scheme}${hostPart}</span><span class="urlpath">${pathPart}</span></span>
      </div>
    </div>
    <div class="site" style="--nav-bg:${brand.navBg};--nav-fg:${brand.navFg};--hero-bg:${brand.heroBg};--hero-fg:${brand.heroFg}">
      <nav class="site-nav">
        <div class="nav-brand"><span class="nav-mark">${brand.mark()}</span>${brand.nameHtml || `<span class="nav-name">${brand.name}</span>`}</div>
        ${brand.navExtra || ""}
        <div class="nav-right">
          ${isMail
            ? `<span class="nav-link">Reply</span><button class="signin-btn" data-act="signin">Open</button>`
            : `<span class="nav-link">Help</span><button class="signin-btn" data-act="signin">${signLabel}</button>`}
        </div>
      </nav>
      <div class="site-hero">${brand.home(isReal)}</div>
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

  // Touch has no hover, so tapping the address bar reveals the full URL
  // (it wraps instead of clipping). This is inspection only — it never
  // counts as an answer; only the Sign-in button decides the round.
  const urlbar = win.querySelector(".urlbar");
  urlbar.setAttribute("role", "button");
  urlbar.setAttribute("aria-label", "Reveal the full web address");
  urlbar.addEventListener("click", (e) => {
    e.stopPropagation();
    urlbar.classList.toggle("revealed");
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

  // Real site: run the actual passkey ceremony (biometric) for realism.
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
      `<div class="pk-sub pk-sub-ok">Verified with your device's screen lock. You're signed in to ` +
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

// ---------- Inline "where's the tell" highlighting on the windows --------
// After a round resolves, the two side-by-side windows themselves get the
// highlight — not just the separate result panel — so you can see exactly
// which characters differ right where you were just looking.
function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Character-level diff: the shortest span that, if swapped, turns `fake`
// into `legit` (common prefix trimmed, common suffix trimmed). Works for
// typos, digit-substitution, comb-glyphs, and homoglyphs alike — anywhere
// the two strings are mostly identical.
function diffCharRange(legit, fake) {
  let p = 0;
  const maxP = Math.min(legit.length, fake.length);
  while (p < maxP && legit[p] === fake[p]) p++;
  let s = 0;
  while (s < maxP - p && legit[legit.length - 1 - s] === fake[fake.length - 1 - s]) s++;
  return { start: p, end: Math.max(p, fake.length - s) };
}

// The true registrable domain hiding in a structurally-deceptive fake URL
// (subdomain stuffing, the @ trick, brand-in-path) — the last two labels
// of the host, after any "username@" prefix is stripped.
function computeRootRange(fake) {
  const atIdx = fake.lastIndexOf("@");
  const from = atIdx >= 0 ? atIdx + 1 : 0;
  const host = fake.slice(from).split("/")[0];
  const parts = host.split(".");
  if (parts.length < 2) return null;
  const root = parts.slice(-2).join(".");
  const i = fake.indexOf(root, from);
  return i < 0 ? null : { start: i, end: i + root.length };
}

// Picks the cleanest highlight for a legit/fake pair. Char-diff is tried
// first (it's precise); if the differing span would cover most of the
// host — meaning the two domains are structurally unrelated, e.g.
// subdomain-stuffing or brand-in-the-path — fall back to highlighting the
// fake's true registrable root instead, and the fake's whole host on legit.
function computeHighlight(legit, fake) {
  const hostLen = (s) => { const i = s.indexOf("/"); return i === -1 ? s.length : i; };
  const fakeHostLen = hostLen(fake), legitHostLen = hostLen(legit);
  const range = diffCharRange(legit, fake);
  const covered = Math.max(0, Math.min(range.end, fakeHostLen) - Math.max(range.start, 0));
  const ratio = fakeHostLen > 0 ? covered / fakeHostLen : 1;
  if (ratio > 0.55) {
    const root = computeRootRange(fake);
    return { fakeRange: root || range, legitRange: { start: 0, end: legitHostLen } };
  }
  return { fakeRange: range, legitRange: { start: range.start, end: legit.length - (fake.length - range.end) } };
}

// Rewrites a window's address-bar host/path spans with the differing
// substring wrapped in a highlight class, splitting the range across the
// same host/path boundary buildWindow used, so nothing double-escapes.
function markDomainSpans(win, domain, range, cls) {
  if (!range) return;
  const urlbar = win.querySelector(".urlbar");
  const hostEl = urlbar.querySelector(".host");
  const pathEl = urlbar.querySelector(".urlpath");
  const scheme = (hostEl.textContent.match(/^https?:\/\//) || [""])[0];
  const slash = domain.indexOf("/");
  const hostPart = slash === -1 ? domain : domain.slice(0, slash);
  const pathPart = slash === -1 ? "" : domain.slice(slash);
  const build = (part, base) => {
    const s = Math.max(0, Math.min(range.start - base, part.length));
    const e = Math.max(0, Math.min(range.end - base, part.length));
    if (e <= s) return escHtml(part);
    return escHtml(part.slice(0, s)) + `<span class="${cls}">${escHtml(part.slice(s, e))}</span>` + escHtml(part.slice(e));
  };
  hostEl.innerHTML = escHtml(scheme) + build(hostPart, 0);
  if (pathPart) pathEl.innerHTML = build(pathPart, hostPart.length);
  urlbar.classList.add("solved"); // un-clip so the highlight is guaranteed visible
}

function markWindows(brand, clickedWin, clickedVerdict) {
  const hl = computeHighlight(brand.legit, brand.fake);
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
    markDomainSpans(w, real ? brand.legit : brand.fake, real ? hl.legitRange : hl.fakeRange, real ? "diffmark ok" : "diffmark bad");
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

  // The result panel lives in page flow below the windows, which on mobile
  // usually puts it below the fold — nobody knows to scroll for it. So
  // scroll for them. Mobile brings the card to the top of the screen (the
  // verdict + Next button are the thing you need right after answering,
  // and the highlighted windows are one flick up). Desktop scrolls the
  // minimum needed — usually nothing, since the panel mostly fits.
  // Called synchronously (no rAF): DOM changes above are already applied
  // and layout is computed on demand, while rAF silently never fires in a
  // hidden tab, which would skip the scroll entirely.
  const card = $("#result-card");
  const mobile = window.matchMedia("(max-width: 880px)").matches;
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  card.scrollIntoView({ behavior, block: mobile ? "start" : "nearest" });
}
function resultOk(title, body, brand) { showResult(title, body, brand); }
function resultBad(title, body, brand) { showResult(title, body, brand); }

function nextRound() {
  closeOverlay("#result-overlay");
  // The result view may have scrolled the page (see showResult); the new
  // round expects to start from the top.
  window.scrollTo(0, 0);
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
// ---------- Audience: Personal vs Enterprise ------------------------
// Personal is the classic experience: a passkey created on THIS device.
// Enterprise tells the work-account story: one "Microsoft Entra ID"
// identity (fictional, like every brand here) with SSO across every app,
// protected by a passkey created on your phone via the browser's QR
// cross-device flow (when playing at a computer).
function applyAudience(aud) {
  state.audience = aud === "enterprise" ? "enterprise" : "personal";
  try { localStorage.setItem(AUD_KEY, state.audience); } catch (_) { /* ignore */ }
  const ent = state.audience === "enterprise";
  // The small fixed toggle shows which mode you're in (and returns to the chooser).
  const audBtn = $("#btn-audience");
  if (audBtn) audBtn.textContent = ent ? "🏢" : "👤";
  $("#pk-panel-glyph").textContent = ent ? "🏢" : "🔑";
  $("#pk-panel-title").textContent = ent
    ? "Work passkey — Entra ID, one account for everything"
    : "Device-bound passkey";
  $("#pk-panel-sub").textContent = ent
    ? "Your admin requires a phishing-resistant sign-in for your single SSO identity. On a computer, registration hands you off to your phone with a QR code."
    : "Register one and your passkey refuses the fake site — so the phish reveals itself.";
  $("#enterprise-note").style.display = ent ? "" : "none";
  $("#btn-register").textContent = ent
    ? (isTouchDevice() ? "Register work passkey on this phone" : "Register work passkey (QR → phone)")
    : "Register a passkey";
  // Status line may reference the audience — refresh it if already registered.
  if (state.passkey.registered) reflectPasskeyState();
}

// Live one-line summary shown on the collapsed "Game options" disclosure,
// so the current settings are still visible without the panel taking up
// space by default.
function updateGameOptionsSummary() {
  const el = document.getElementById("go-summary");
  if (!el) return;
  const diffLabel = { mixed: "Mixed", easymed: "Easy–Med", medhard: "Med–Hard", hard: "All hard" }[state.difficultyPref] || "Mixed";
  const timerLabel = { 0: "no timer", 25: "Chill timer", 15: "Normal timer", 8: "Blitz timer" }[state.timerSeconds] ?? "Chill timer";
  el.textContent = `${state.roundsChoice} rounds · ${diffLabel} · ${timerLabel}`;
}

// ---------- Theme (light / dark) -----------------------------------
const THEME_KEY = "phishgame.theme";
function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}
function applyTheme(t) {
  if (t === "light") document.documentElement.setAttribute("data-theme", "light");
  else document.documentElement.removeAttribute("data-theme");
  const btn = document.getElementById("btn-theme");
  // Show the icon for the theme you'd switch TO (the affordance).
  if (btn) btn.textContent = t === "light" ? "🌙" : "☀️";
  try { localStorage.setItem(THEME_KEY, t); } catch (_) { /* ignore */ }
}

function init() {
  loadStoredPasskey();
  renderLifetime();
  renderTechniques();
  applyTheme(currentTheme()); // sync the toggle icon to the theme set in <head>

  // Personal vs Enterprise. First visit lands on the split chooser (the
  // HTML's default active screen); a returning player skips straight to the
  // title with their saved choice. The small 👤/🏢 toggle is the only way
  // back to the chooser.
  let savedAud = null;
  try { savedAud = localStorage.getItem(AUD_KEY); } catch (_) { /* ignore */ }
  if (savedAud) {
    applyAudience(savedAud);
    show("#screen-title");
  }
  document.querySelectorAll(".aud-half").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyAudience(btn.dataset.aud);
      Sound.sfx("pick");
      show("#screen-title");
    });
  });
  $("#btn-audience").addEventListener("click", () => {
    stopTimer();
    Sound.stopMusic();
    closeOverlay("#result-overlay");
    window.scrollTo(0, 0);
    show("#screen-audience");
  });

  $("#btn-register").addEventListener("click", registerPasskey);
  $("#btn-test-passkey").addEventListener("click", testPasskey);

  // "See what a passkey would do here" on an eyes-mode result. Runs a
  // REAL WebAuthn ceremony when a real passkey exists: the genuine site
  // signs in with your actual passkey (biometric); the look-alike triggers
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
      updateGameOptionsSummary();
    });
  });
  // Difficulty selector
  $("#diff-seg").querySelectorAll(".seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.difficultyPref = btn.dataset.diff;
      $("#diff-seg").querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      updateGameOptionsSummary();
    });
  });
  // Timer selector
  $("#timer-seg").querySelectorAll(".seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.timerSeconds = parseInt(btn.dataset.timer, 10);
      $("#timer-seg").querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      updateGameOptionsSummary();
    });
  });
  updateGameOptionsSummary();
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

  $("#btn-theme").addEventListener("click", () => {
    applyTheme(currentTheme() === "light" ? "dark" : "light");
  });
  $("#btn-play-eyes").addEventListener("click", () => startGame("eyes"));
  $("#btn-play-passkey").addEventListener("click", () => {
    if (!state.passkey.registered) return;
    startGame("passkey");
  });
  $("#btn-next").addEventListener("click", nextRound);
  $("#btn-quit").addEventListener("click", () => { stopTimer(); Sound.stopMusic(); closeOverlay("#result-overlay"); window.scrollTo(0, 0); show("#screen-title"); });
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


document.addEventListener("DOMContentLoaded", init);
