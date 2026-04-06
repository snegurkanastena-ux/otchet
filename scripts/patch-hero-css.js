const fs = require("fs");
const path = require("path");

const toDataUri = (s) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);

const svgEconomic = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 360" fill="none">
<defs>
<linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#94a3b8" stop-opacity="0.45"/><stop offset="100%" stop-color="#38bdf8" stop-opacity="0.2"/></linearGradient>
<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff" stop-opacity="0.16"/><stop offset="100%" stop-color="#fff" stop-opacity="0.03"/></linearGradient>
<filter id="f" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="12" result="B"/><feMerge><feMergeNode in="B"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<ellipse cx="360" cy="88" rx="120" ry="72" fill="#38bdf8" fill-opacity="0.06" filter="url(#f)"/>
<rect x="108" y="36" width="200" height="288" rx="40" stroke="url(#a)" stroke-width="1.25" fill="url(#b)"/>
<rect x="128" y="64" width="160" height="216" rx="10" fill="#0f172a" fill-opacity="0.5" stroke="#fff" stroke-opacity="0.07"/>
<path d="M138 252 Q220 218 302 242" stroke="#38bdf8" stroke-opacity="0.55" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<rect x="272" y="76" width="124" height="80" rx="16" fill="#fff" fill-opacity="0.06" stroke="#fff" stroke-opacity="0.14"/>
<rect x="292" y="100" width="84" height="5" rx="2.5" fill="#38bdf8" fill-opacity="0.35"/>
<rect x="292" y="114" width="60" height="4" rx="2" fill="#94a3b8" fill-opacity="0.3"/>
<rect x="36" y="112" width="96" height="68" rx="14" fill="#fff" fill-opacity="0.05" stroke="#fff" stroke-opacity="0.1"/>
<path d="M56 260 A 92 92 0 0 1 240 260" stroke="#a78bfa" stroke-opacity="0.5" stroke-width="1.25" fill="none" stroke-linecap="round"/>
<circle cx="240" cy="260" r="4.5" fill="#a78bfa" fill-opacity="0.75"/>
</svg>`;

const svgOperator = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 360" fill="none">
<defs>
<pattern id="p" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" stroke="#22d3ee" stroke-opacity="0.11" stroke-width="0.6"/></pattern>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#22d3ee" stop-opacity="0.15"/><stop offset="100%" stop-color="#6366f1" stop-opacity="0.08"/></linearGradient>
</defs>
<rect width="440" height="360" fill="url(#p)"/>
<rect x="240" y="40" width="180" height="280" rx="2" fill="url(#g)" fill-opacity="0.35"/>
<path d="M40 184 A 64 64 0 0 1 168 184" stroke="#22d3ee" stroke-opacity="0.4" stroke-width="1.2" fill="none"/>
<path d="M24 184 A 88 88 0 0 1 200 184" stroke="#22d3ee" stroke-opacity="0.25" stroke-width="1.2" fill="none"/>
<path d="M8 184 A 120 120 0 0 1 232 184" stroke="#22d3ee" stroke-opacity="0.14" stroke-width="1.2" fill="none"/>
<rect x="268" y="108" width="6" height="132" rx="3" fill="#38bdf8" fill-opacity="0.22"/>
<rect x="284" y="84" width="6" height="156" rx="3" fill="#22d3ee" fill-opacity="0.32"/>
<rect x="300" y="124" width="6" height="116" rx="3" fill="#38bdf8" fill-opacity="0.18"/>
<rect x="316" y="96" width="6" height="144" rx="3" fill="#22d3ee" fill-opacity="0.26"/>
<rect x="332" y="72" width="6" height="168" rx="3" fill="#818cf8" fill-opacity="0.2"/>
<rect x="308" y="196" width="80" height="100" rx="12" stroke="#e2e8f0" stroke-opacity="0.22" stroke-width="1.1" fill="#fff" fill-opacity="0.03"/>
<path d="M324 216v60M336 216v60M348 216v60M360 216v60" stroke="#94a3b8" stroke-opacity="0.4" stroke-width="1.15"/>
<circle cx="348" cy="232" r="3" fill="#22d3ee" fill-opacity="0.5"/>
</svg>`;

const ECONOMIC_URI = toDataUri(svgEconomic);
const OPERATOR_URI = toDataUri(svgOperator);

const premium = `
/* === PREMIUM HERO: ЭКОНОМИКА / ОПЕРАТОР (SVG data URI, без стоков) === */

.block-hero--economic,
.block-hero--operator {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  min-height: clamp(220px, 26vw, 300px);
  padding: 2.25rem 1.75rem 2.25rem 2rem;
  overflow: hidden;
  color: #f8fafc;
  background-image: none !important;
  isolation: isolate;
}

.block-hero--economic {
  background-color: #05080f !important;
  background-image:
    radial-gradient(ellipse 100% 80% at 92% 38%, rgba(56, 189, 248, 0.09) 0%, transparent 55%),
    radial-gradient(ellipse 70% 60% at 78% 72%, rgba(167, 139, 250, 0.07) 0%, transparent 50%),
    linear-gradient(152deg, #04060c 0%, #0b1220 42%, #060912 100%) !important;
}

.block-hero--operator {
  background-color: #05080f !important;
  background-image:
    radial-gradient(ellipse 90% 70% at 90% 30%, rgba(34, 211, 238, 0.1) 0%, transparent 52%),
    radial-gradient(ellipse 60% 50% at 75% 65%, rgba(99, 102, 241, 0.08) 0%, transparent 48%),
    linear-gradient(148deg, #04060c 0%, #0a1628 45%, #050a12 100%) !important;
}

.block-hero--economic::before,
.block-hero--operator::before {
  content: "";
  position: absolute;
  top: 50%;
  right: -2%;
  width: min(52%, 420px);
  height: 92%;
  max-height: 280px;
  transform: translateY(-50%);
  background-repeat: no-repeat;
  background-position: center right;
  background-size: contain;
  opacity: 0.92;
  pointer-events: none;
  z-index: 0;
}

.block-hero--economic::before {
  background-image: url("${ECONOMIC_URI}");
}

.block-hero--operator::before {
  background-image: url("${OPERATOR_URI}");
}

.block-hero--economic::after,
.block-hero--operator::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(
    90deg,
    rgba(4, 6, 12, 0.97) 0%,
    rgba(4, 6, 12, 0.9) 28%,
    rgba(4, 6, 12, 0.55) 46%,
    rgba(4, 6, 12, 0.18) 62%,
    rgba(4, 6, 12, 0.04) 74%,
    transparent 88%
  );
}

.block-hero--economic .block-hero__inner,
.block-hero--operator .block-hero__inner {
  position: relative;
  z-index: 2;
  flex: 0 1 auto;
  max-width: min(46%, 440px);
  margin: 0;
  padding-right: 1rem;
  text-shadow: 0 2px 28px rgba(0, 0, 0, 0.45);
}

.block-hero--economic .block-hero__label,
.block-hero--operator .block-hero__label {
  color: rgba(248, 250, 252, 0.72);
  letter-spacing: 0.18em;
}

.block-hero--economic .block-hero__title,
.block-hero--operator .block-hero__title {
  color: #fff;
}

.block-hero--economic .block-hero__tag,
.block-hero--operator .block-hero__tag {
  color: rgba(248, 250, 252, 0.88);
}

@media (max-width: 960px) {
  .block-hero--economic::before,
  .block-hero--operator::before {
    width: min(58%, 360px);
    opacity: 0.55;
    right: -6%;
  }

  .block-hero--economic::after,
  .block-hero--operator::after {
    background: linear-gradient(
      90deg,
      rgba(4, 6, 12, 0.96) 0%,
      rgba(4, 6, 12, 0.82) 40%,
      rgba(4, 6, 12, 0.35) 58%,
      rgba(4, 6, 12, 0.08) 75%,
      transparent 92%
    );
  }

  .block-hero--economic .block-hero__inner,
  .block-hero--operator .block-hero__inner {
    max-width: min(56%, 400px);
  }
}

@media (max-width: 720px) {
  .block-hero--economic,
  .block-hero--operator {
    flex-direction: column;
    align-items: flex-start;
    min-height: auto;
    padding: 1.75rem 1.35rem 1.5rem;
  }

  .block-hero--economic::before,
  .block-hero--operator::before {
    position: relative;
    top: auto;
    right: auto;
    transform: none;
    width: 100%;
    max-width: 280px;
    height: 160px;
    margin: 0.5rem 0 0 auto;
    opacity: 0.5;
    background-position: center;
  }

  .block-hero--economic::after,
  .block-hero--operator::after {
    background: linear-gradient(
      180deg,
      rgba(4, 6, 12, 0.94) 0%,
      rgba(4, 6, 12, 0.75) 45%,
      rgba(4, 6, 12, 0.25) 100%
    );
  }

  .block-hero--economic .block-hero__inner,
  .block-hero--operator .block-hero__inner {
    max-width: 100%;
    padding-right: 0;
  }
}
`;

const mainPath = path.join(__dirname, "..", "styles", "main.css");
let css = fs.readFileSync(mainPath, "utf8");
const marker = "/* === HERO REWORK: ECONOMIC / OPERATOR === */";
const idx = css.indexOf(marker);
if (idx === -1) {
  console.error("Marker not found in main.css");
  process.exit(1);
}
css = css.slice(0, idx) + premium.trim() + "\n";
fs.writeFileSync(mainPath, css, "utf8");
console.log("OK:", mainPath);
