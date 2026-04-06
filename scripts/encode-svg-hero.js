const e = (s) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);

const eco = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 360" fill="none">
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

const op = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 360" fill="none">
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

console.log("ECONOMIC_URI=" + e(eco));
console.log("OPERATOR_URI=" + e(op));
