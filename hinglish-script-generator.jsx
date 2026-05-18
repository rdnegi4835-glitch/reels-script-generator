import { useState } from "react";

const NICHES = [
  { label: "💰 Finance / Paise", value: "personal finance and money tips for Indians" },
  { label: "💪 Fitness / Gym", value: "fitness, gym, and health tips" },
  { label: "😂 Comedy / Masti", value: "Indian comedy and relatable humor" },
  { label: "🍳 Food / Khana", value: "Indian food and cooking recipes" },
  { label: "📱 Tech / Gadgets", value: "tech gadgets and smartphone tips" },
  { label: "💼 Business / Startup", value: "business ideas and entrepreneurship" },
  { label: "🧠 Motivation", value: "motivational and self-improvement" },
  { label: "✈️ Travel", value: "travel and explore India" },
];

const FORMATS = [
  { label: "🎣 Hook + Story + CTA", value: "hook-story-cta" },
  { label: "🔢 Top 3 Tips", value: "top3" },
  { label: "😮 Shocking Fact", value: "shocking" },
  { label: "🆚 Before vs After", value: "before-after" },
];

const TONES = [
  { label: "🔥 Desi Bhai Vibe", value: "casual desi bhai style, very relatable" },
  { label: "😎 Cool & Confident", value: "cool, confident, and witty" },
  { label: "🤣 Full Comedy", value: "very funny and humorous" },
  { label: "💡 Smart & Informative", value: "informative but engaging" },
];

const buildPrompt = (niche, format, tone, topic) => {
  const formatInstructions = {
    "hook-story-cta": `Write in 3 clear parts:
[HOOK] (0-3 sec): One punchy opening line that stops the scroll
[STORY/VALUE] (3-45 sec): Main content in 4-6 short punchy lines
[CTA] (45-50 sec): One strong call-to-action line`,
    top3: `Write as:
[HOOK] (0-3 sec): Teaser hook line
[POINT 1] Quick tip with emoji
[POINT 2] Quick tip with emoji  
[POINT 3] Quick tip with emoji
[CTA]: Follow/share line`,
    shocking: `Write as:
[HOOK]: A shocking or surprising fact/statement
[EXPLANATION]: 3-4 lines explaining it simply
[TWIST]: The relatable conclusion
[CTA]: Engagement line`,
    "before-after": `Write as:
[BEFORE]: Describe the bad/old situation (2 lines)
[TURNING POINT]: What changed
[AFTER]: The good result (2 lines)
[CTA]: Motivational close`,
  };

  return `You are a viral Indian short-form video script writer. Write a 45-50 second Reels/Shorts script in Hinglish (Hindi + English mix, written in Roman script — NOT Devanagari).

NICHE: ${niche}
TOPIC: ${topic || "Choose the most viral topic in this niche right now"}
TONE: ${tone}
FORMAT:
${formatInstructions[format]}

RULES:
- Use Hinglish only (Roman script): mix Hindi words like "bhai", "yaar", "suno", "dekho", "ekdum", "matlab", "seedha" naturally with English
- Each line must be SHORT (max 10 words) — like actual spoken dialogue
- Add [PAUSE], [POINT TO CAMERA], [TEXT OVERLAY: ...] directions sparingly for drama
- Make it scroll-stopping and extremely relatable for 18-28 year old Indians
- End with a punchy CTA like "Follow karo", "Save kar lo", "Comment mein batao"
- Add emojis where natural
- Do NOT use Devanagari script at all

Output ONLY the script with section labels. No preamble, no explanation.`;
};

export default function App() {
  const [niche, setNiche] = useState(NICHES[0]);
  const [format, setFormat] = useState(FORMATS[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(0);

  const generate = async () => {
    setLoading(true);
    setScript("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt(niche.value, format.value, tone.value, topic) }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((b) => b.text || "").join("") || "Error generating script.";
      setScript(text);
      setCount((c) => c + 1);
    } catch {
      setScript("❌ Kuch gadbad ho gayi. Dobara try karo.");
    }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.root}>
      {/* BG noise */}
      <div style={styles.noise} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.badge}>🇮🇳 MADE FOR INDIAN CREATORS</div>
        <h1 style={styles.title}>
          <span style={styles.titleOrange}>REELS</span> SCRIPT
          <br />
          <span style={styles.titleWhite}>GENERATOR AI</span>
        </h1>
        <p style={styles.sub}>Viral Hinglish scripts — 10 seconds mein ✨</p>
        {count > 0 && <div style={styles.countBadge}>🔥 {count} scripts banaye</div>}
      </div>

      {/* Card */}
      <div style={styles.card}>
        {/* Niche */}
        <label style={styles.label}>📌 Apna Niche Choose Karo</label>
        <div style={styles.grid2}>
          {NICHES.map((n) => (
            <button
              key={n.value}
              onClick={() => setNiche(n)}
              style={{ ...styles.chip, ...(niche.value === n.value ? styles.chipActive : {}) }}
            >
              {n.label}
            </button>
          ))}
        </div>

        {/* Topic */}
        <label style={styles.label}>💡 Topic (optional — khali chodo toh AI choose karega)</label>
        <input
          style={styles.input}
          placeholder="e.g. Credit card se paise bachao, 5kg weight loss..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        {/* Format */}
        <label style={styles.label}>🎬 Script Format</label>
        <div style={styles.grid2}>
          {FORMATS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFormat(f)}
              style={{ ...styles.chip, ...(format.value === f.value ? styles.chipActive : {}) }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Tone */}
        <label style={styles.label}>🎭 Tone / Style</label>
        <div style={styles.grid2}>
          {TONES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTone(t)}
              style={{ ...styles.chip, ...(tone.value === t.value ? styles.chipActive : {}) }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button onClick={generate} disabled={loading} style={styles.genBtn}>
          {loading ? (
            <span style={styles.spinner}>⏳ Script ban raha hai...</span>
          ) : (
            "⚡ SCRIPT BANAO"
          )}
        </button>

        {/* Output */}
        {script && (
          <div style={styles.outputWrap}>
            <div style={styles.outputHeader}>
              <span style={styles.outputTitle}>📄 Tera Viral Script</span>
              <button onClick={copy} style={styles.copyBtn}>
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <pre style={styles.output}>{script}</pre>
            <div style={styles.tips}>
              <strong>📱 Pro Tips:</strong> Is script ko exactly bol — editing mein text overlay add karo. Hook ke saath trending audio use karo!
            </div>
          </div>
        )}
      </div>

      <p style={styles.footer}>Powered by AI • Diff3r3nt Creator Tools 🚀</p>
    </div>
  );
}

const orange = "#FF6B35";
const dark = "#0D0D0D";
const card = "#161616";
const border = "#2a2a2a";
const text = "#F0F0F0";
const muted = "#888";

const styles = {
  root: {
    minHeight: "100vh",
    background: dark,
    fontFamily: "'Trebuchet MS', sans-serif",
    padding: "24px 16px 48px",
    position: "relative",
    overflowX: "hidden",
  },
  noise: {
    position: "fixed",
    inset: 0,
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    pointerEvents: "none",
    zIndex: 0,
  },
  header: {
    textAlign: "center",
    marginBottom: 28,
    position: "relative",
    zIndex: 1,
  },
  badge: {
    display: "inline-block",
    background: "#1a1a1a",
    border: `1px solid ${border}`,
    color: muted,
    fontSize: 11,
    letterSpacing: 2,
    padding: "4px 12px",
    borderRadius: 99,
    marginBottom: 14,
  },
  title: {
    fontSize: "clamp(36px, 8vw, 60px)",
    fontWeight: 900,
    lineHeight: 1.05,
    margin: "0 0 10px",
    letterSpacing: -1,
  },
  titleOrange: { color: orange },
  titleWhite: { color: text },
  sub: { color: muted, fontSize: 14, margin: "0 0 10px" },
  countBadge: {
    display: "inline-block",
    background: "rgba(255,107,53,0.15)",
    color: orange,
    border: `1px solid rgba(255,107,53,0.3)`,
    fontSize: 12,
    padding: "3px 12px",
    borderRadius: 99,
  },
  card: {
    background: card,
    border: `1px solid ${border}`,
    borderRadius: 16,
    padding: "24px 20px",
    maxWidth: 640,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  label: {
    display: "block",
    color: text,
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 10,
    marginTop: 20,
    letterSpacing: 0.5,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
  },
  chip: {
    background: "#1c1c1c",
    border: `1px solid ${border}`,
    color: muted,
    borderRadius: 10,
    padding: "10px 8px",
    fontSize: 12,
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.15s",
    fontFamily: "inherit",
  },
  chipActive: {
    background: "rgba(255,107,53,0.12)",
    border: `1px solid ${orange}`,
    color: orange,
  },
  input: {
    width: "100%",
    background: "#1c1c1c",
    border: `1px solid ${border}`,
    borderRadius: 10,
    padding: "12px 14px",
    color: text,
    fontSize: 13,
    fontFamily: "inherit",
    boxSizing: "border-box",
    outline: "none",
  },
  genBtn: {
    width: "100%",
    background: orange,
    color: "#000",
    border: "none",
    borderRadius: 12,
    padding: "16px",
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: 1,
    cursor: "pointer",
    marginTop: 24,
    fontFamily: "inherit",
    transition: "opacity 0.2s",
  },
  spinner: { display: "block", textAlign: "center" },
  outputWrap: {
    marginTop: 24,
    background: "#111",
    border: `1px solid ${border}`,
    borderRadius: 12,
    overflow: "hidden",
  },
  outputHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: `1px solid ${border}`,
  },
  outputTitle: { color: text, fontSize: 13, fontWeight: 700 },
  copyBtn: {
    background: "transparent",
    border: `1px solid ${border}`,
    color: muted,
    borderRadius: 8,
    padding: "5px 12px",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  output: {
    padding: "16px",
    color: "#d4e8c2",
    fontSize: 13,
    lineHeight: 1.8,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    margin: 0,
    fontFamily: "monospace",
  },
  tips: {
    background: "rgba(255,107,53,0.08)",
    borderTop: `1px solid rgba(255,107,53,0.2)`,
    padding: "10px 16px",
    color: "#cc9",
    fontSize: 12,
    lineHeight: 1.6,
  },
  footer: {
    textAlign: "center",
    color: "#333",
    fontSize: 11,
    marginTop: 32,
    letterSpacing: 1,
    position: "relative",
    zIndex: 1,
  },
};
