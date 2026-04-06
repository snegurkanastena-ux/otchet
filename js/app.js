import { dataMarch } from "../data/march.js";
const data = dataMarch;  
const REPORT_PHOTO_URL = "assets/manager.png";
const REPORT_PHOTO_NAME = "Анастасия Мельникова";
const REPORT_PHOTO_ROLE = "Бизнес-менеджер";

const app = document.getElementById("content");
const loading = document.getElementById("loading");

let portableChartInstance = null;

function formatNumber(value) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function formatPercent(value) {
  return `${value}%`;
}

function formatCurrency(value) {
  return `${formatNumber(value)} ₽`;
}

function formatDeltaValue(value, suffix = "%") {
  const n = Number(value) || 0;
  const sign = n > 0 ? "+" : "";
  return `${sign}${n}${suffix}`;
}

function deltaTone(value) {
  const n = Number(value) || 0;
  if (n > 0) return "ok";
  if (n < 0) return "bad";
  return "warn";
}

function percentChange(current, previous) {
  const prev = Number(previous) || 0;
  const curr = Number(current) || 0;
  if (!prev) return 0;
  return Math.round(((curr - prev) / prev) * 100);
}

function portableBarColor(percent) {
  const p = Number(percent);
  if (p >= 100) return "rgba(22, 163, 74, 0.9)";
  if (p >= 75) return "rgba(202, 138, 4, 0.9)";
  return "rgba(220, 38, 38, 0.9)";
}

function deltaText(current, previous, suffix = "п.п.") {
  const delta = current - previous;
  const sign = delta > 0 ? "+" : "";
  return `${previous} → ${current} (${sign}${delta} ${suffix})`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text == null ? "" : String(text);
  return div.innerHTML;
}

function statusPill(percent, thresholdLow = 75, thresholdHigh = 100) {
  const p = Number(percent);
  let cls = "pill pill--red";
  if (p >= thresholdHigh) cls = "pill pill--green";
  else if (p >= thresholdLow) cls = "pill pill--yellow";
  return `<span class="${cls}">${formatPercent(p)}</span>`;
}

function invoiceStatusPill(percent, target = 25) {
  const p = Number(percent);
  if (p <= target) return `<span class="pill pill--green">В норме</span>`;
  if (p <= target + 5) return `<span class="pill pill--yellow">Выше цели</span>`;
  return `<span class="pill pill--red">Критично</span>`;
}
function renderReverseExecutionGauge(current, target, label = "Цель") {
  const curr = Number(current) || 0;
  const tg = Number(target) || 25;

  const fillW = Math.min(Math.max(curr, 0), 100);
  const markerW = Math.min(Math.max(tg, 0), 100);

  let fillClass = "oz-gauge__fill--green";
  let factClass = "oz-gauge__fact--ok";
  let statusText = "В норме";
  let statusCls = "oz-gauge__status--ok";

  if (curr > tg && curr <= tg + 5) {
    fillClass = "oz-gauge__fill--yellow";
    factClass = "oz-gauge__fact--mid";
    statusText = "Выше цели";
    statusCls = "oz-gauge__status--mid";
  } else if (curr > tg + 5) {
    fillClass = "oz-gauge__fill--red";
    factClass = "oz-gauge__fact--bad";
    statusText = "Критично";
    statusCls = "oz-gauge__status--bad";
  }

  return `
    <div class="oz-gauge">
      <div class="oz-gauge__head">
        <span class="oz-gauge__fact ${factClass}">${formatPercent(curr)}</span>
        <span class="oz-gauge__target">${escapeHtml(label)}: ≤ ${formatPercent(tg)}</span>
        <span class="oz-gauge__status ${statusCls}">${statusText}</span>
      </div>
      <div class="oz-gauge__track">
        <div class="oz-gauge__fill ${fillClass}" style="width:${fillW}%"></div>
        <div class="oz-gauge__marker" style="left:${markerW}%"></div>
      </div>
      <div class="oz-gauge__scale"><span>0</span><span>25</span><span>100%</span></div>
    </div>
  `;
}

function renderInverseDeltaBadge(delta, suffix = "%") {
  const n = Number(delta) || 0;
  const cls =
    n < 0
      ? "pill pill--green"
      : n > 0
        ? "pill pill--red"
        : "pill pill--yellow";

  return `<span class="${cls}">${formatDeltaValue(n, suffix)}</span>`;
}
function renderList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderBlockHero(modifier, label, title, tagline) {
  return `
    <header class="block-hero block-hero--${modifier}">
      <div class="block-hero__inner">
        <p class="block-hero__label">${escapeHtml(label)}</p>
        <h2 class="block-hero__title">${escapeHtml(title)}</h2>
        ${tagline ? `<p class="block-hero__tag">${escapeHtml(tagline)}</p>` : ""}
      </div>
    </header>
  `;
}

function renderReportPhoto() {
  const url = (REPORT_PHOTO_URL || "").trim();
  if (!url) {
    return `<div class="report-cover__bg-photo report-cover__bg-photo--empty" aria-hidden="true"></div>`;
  }
  const safeSrc = url.replace(/"/g, "");
  return `
    <div class="report-cover__bg-photo" aria-hidden="true">
      <img src="${safeSrc}" alt="" loading="lazy" decoding="async" onerror="this.parentElement.classList.add('report-cover__bg-photo--empty'); this.remove();" />
    </div>
  `;
}

function renderKpiCard(label, value, sub, tone) {
  const toneClass = tone ? ` kpi-card--${tone}` : "";
  return `
    <div class="kpi-card${toneClass}">
      <span class="kpi-card__label">${escapeHtml(label)}</span>
      <div class="kpi-card__value">${value}</div>
      ${sub ? `<div class="kpi-card__sub">${escapeHtml(sub)}</div>` : ""}
    </div>
  `;
}

function economicBlockTone(e) {
  const fails = [
    e.portable.summary.percent < e.minTargetPercent,
    e.portable.sellOut.percent < e.minTargetPercent,
    e.accessoriesServices.summary.totalPercent < e.minTargetPercent,
    e.credits.summary.percent < e.minTargetPercent
  ].filter(Boolean).length;
  if (fails >= 3) return "bad";
  if (fails >= 1) return "warn";
  return "ok";
}

function economicBlockStatusLabel(e) {
  const t = economicBlockTone(e);
  if (t === "bad") return "Критично";
  if (t === "warn") return "Требует внимания";
  return "В норме";
}

function kpiToneFromPercent(p) {
  const n = Number(p);
  if (n >= 100) return "ok";
  if (n >= 75) return "warn";
  return "bad";
}

function hasMeaningfulValue(v) {
  return v !== null && v !== undefined && v !== "" && v !== "—";
}

function renderExecutionGauge(percent, minThreshold) {
  const p = Number(percent);
  const w = Math.min(Math.max(p, 0), 100);
  const fillClass =
    p >= 100
      ? "oz-gauge__fill--green"
      : p >= 75
        ? "oz-gauge__fill--yellow"
        : "oz-gauge__fill--red";
  const factClass =
    p >= 100
      ? "oz-gauge__fact--ok"
      : p >= 75
        ? "oz-gauge__fact--mid"
        : "oz-gauge__fact--bad";
  const thr = minThreshold != null ? minThreshold : 75;
  const statusText =
    p >= 100 ? "План выполнен" : p >= thr ? "Выше минимума" : "Ниже минимума";
  const statusCls =
    p >= 100
      ? "oz-gauge__status--ok"
      : p >= thr
        ? "oz-gauge__status--mid"
        : "oz-gauge__status--bad";
  const marker =
    minThreshold != null
      ? `<div class="oz-gauge__marker" style="left:${Math.min(thr, 100)}%"></div>`
      : "";

  return `
    <div class="oz-gauge" aria-hidden="false">
      <div class="oz-gauge__head">
        <span class="oz-gauge__fact ${factClass}">${formatPercent(p)}</span>
        <span class="oz-gauge__target">Мин. цель по ОЗ: ${formatPercent(thr)}</span>
        <span class="oz-gauge__status ${statusCls}">${statusText}</span>
      </div>
      <div class="oz-gauge__track">
        <div class="oz-gauge__fill ${fillClass}" style="width:${w}%"></div>
        ${marker}
      </div>
      <div class="oz-gauge__scale"><span>0</span><span>50</span><span>100%</span></div>
    </div>
  `;
}

function renderVmrOzGauge(ozScore, target) {
  const oz = Number(ozScore);
  const tg = Number(target);
  const fillW = Math.min(Math.max(oz, 0), 100);
  const markerW = Math.min(Math.max(tg, 0), 100);
  let fillClass = "oz-gauge__fill--red";
  let factClass = "oz-gauge__fact--bad";
  let statusText = "Ниже цели";
  let statusCls = "oz-gauge__status--bad";

  if (oz >= tg) {
    fillClass = "oz-gauge__fill--green";
    factClass = "oz-gauge__fact--ok";
    statusText = "Цель достигнута";
    statusCls = "oz-gauge__status--ok";
  } else if (oz >= tg - 5) {
    fillClass = "oz-gauge__fill--yellow";
    factClass = "oz-gauge__fact--mid";
    statusText = "Около цели";
    statusCls = "oz-gauge__status--mid";
  }

  return `
    <div class="oz-gauge">
      <div class="oz-gauge__head">
        <span class="oz-gauge__fact ${factClass}">${oz.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%</span>
        <span class="oz-gauge__target">Цель: ${tg.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%</span>
        <span class="oz-gauge__status ${statusCls}">${statusText}</span>
      </div>
      <div class="oz-gauge__track">
        <div class="oz-gauge__fill ${fillClass}" style="width:${fillW}%"></div>
        <div class="oz-gauge__marker" style="left:${markerW}%"></div>
      </div>
      <div class="oz-gauge__scale"><span>0</span><span>Факт / цель на шкале 0–100</span><span>100</span></div>
    </div>
  `;
}

function renderChipsBlock(label, names) {
  if (!names.length) {
    return `
      <div class="chips-block">
        <span class="chips-block__label">${escapeHtml(label)}</span>
        <div class="chips chips--empty"><span class="chip">Нет</span></div>
      </div>
    `;
  }

  return `
    <div class="chips-block">
      <span class="chips-block__label">${escapeHtml(label)}</span>
      <div class="chips">
        ${names
          .map(
            (n) => `<span class="chip" title="${escapeHtml(n)}"><span>${escapeHtml(n)}</span></span>`
          )
          .join("")}
      </div>
    </div>
  `;
}

function metricStrip(items) {
  return `
    <div class="metric-strip">
      ${items
        .map(
          (i) => `
            <div class="metric-tile">
              <div class="metric-tile__k">${escapeHtml(i.k)}</div>
              <div class="metric-tile__v${i.pct ? " metric-tile__v--pct" : ""}">${i.v}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function metricStripSafe(items) {
  const safeItems = (items || []).filter((i) => hasMeaningfulValue(i?.v));
  if (!safeItems.length) return "";
  return `
    <div class="metric-strip">
      ${safeItems
        .map(
          (i) => `
            <div class="metric-tile">
              <div class="metric-tile__k">${escapeHtml(i.k)}</div>
              <div class="metric-tile__v${i.pct ? " metric-tile__v--pct" : ""}">${i.v}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function planFactCompletionPercent(fact, plan) {
  const pl = Number(plan);
  const fc = Number(fact);
  if (!pl || pl <= 0) return fc > 0 ? 100 : 0;
  return (fc / pl) * 100;
}

function renderTwinKpiCard(title, plan, fact) {
  const pctRaw = planFactCompletionPercent(fact, plan);
  const pctRounded = Math.round(pctRaw);
  const tone = kpiToneFromPercent(pctRounded);
  return `
    <div class="twin-kpi-card">
      <div class="twin-kpi-card__title">${escapeHtml(title)}</div>
      <div class="twin-kpi-card__metric">
        <span class="twin-kpi-card__k">План</span>
        <span class="twin-kpi-card__v">${formatNumber(plan)} ₽</span>
      </div>
      <div class="twin-kpi-card__metric">
        <span class="twin-kpi-card__k">Факт</span>
        <span class="twin-kpi-card__v">${formatNumber(fact)} ₽</span>
      </div>
      <div class="twin-kpi-card__pct-block">
        <div class="twin-kpi-card__pct twin-kpi-card__pct--${tone}">${formatPercent(pctRounded)}</div>
        <div class="twin-kpi-card__pct-label">Итог по ОЗ</div>
      </div>
    </div>
  `;
}

function renderAccessoriesServicesTwinKpis(summary) {
  return `
    <div class="twin-kpi-row">
      ${renderTwinKpiCard("Аксессуары", summary.accessoriesPlan, summary.accessoriesFact)}
      ${renderTwinKpiCard("Услуги", summary.servicesPlan, summary.servicesFact)}
    </div>
  `;
}

function renderStackMetricCard(title, rows) {
  const prepared = (rows || []).filter((row) => hasMeaningfulValue(row?.value));
  if (!prepared.length) return "";

  return `
    <div class="twin-kpi-card">
      <div class="twin-kpi-card__title">${escapeHtml(title)}</div>
      ${prepared
        .map((row) => {
          const valueHtml = row.html ? row.value : escapeHtml(String(row.value));
          return `
            <div class="twin-kpi-card__metric">
              <span class="twin-kpi-card__k">${escapeHtml(row.label)}</span>
              <span class="twin-kpi-card__v">${valueHtml}</span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderStackMetricGrid(cards) {
  const html = (cards || []).filter(Boolean).join("");
  if (!html) return "";
  return `<div class="metric-strip">${html}</div>`;
}

function renderDeltaBadge(delta, suffix = "%") {
  const n = Number(delta) || 0;
  const tone = deltaTone(n);
  const cls =
    tone === "ok"
      ? "pill pill--green"
      : tone === "bad"
        ? "pill pill--red"
        : "pill pill--yellow";
  return `<span class="${cls}">${formatDeltaValue(n, suffix)}</span>`;
}

function renderPortableTable(stores) {
  const rows = stores
    .map(
      (store) => `
        <tr>
          <td>${escapeHtml(store.name)}</td>
          <td>${formatNumber(store.plan)}</td>
          <td>${formatNumber(store.fact)}</td>
          <td>${statusPill(store.percent)}</td>
          <td>${store.trafficDelta > 0 ? "+" : ""}${store.trafficDelta}%</td>
          <td>${store.conversionDelta > 0 ? "+" : ""}${store.conversionDelta}%</td>
          <td>${store.avgPriceDelta > 0 ? "+" : ""}${store.avgPriceDelta}%</td>
        </tr>
      `
    )
    .join("");

  return `
    <div class="table-wrap">
      <table class="report-table">
        <thead>
          <tr>
            <th>ТТ</th>
            <th>План, руб</th>
            <th>Факт, руб</th>
            <th>Вып., %</th>
            <th>Трафик</th>
            <th>Конверсия</th>
            <th>Ср. цена</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderAccessoriesTable(stores) {
  const rows = stores
    .map(
      (store) => `
        <tr>
          <td>${escapeHtml(store.name)}</td>
          <td>${formatNumber(store.accessoriesFact)}</td>
          <td>${statusPill(store.accessoriesPercent)}</td>
          <td>${formatNumber(store.accessoriesAvgPrice)}</td>
          <td>${formatNumber(store.servicesFact)}</td>
          <td>${statusPill(store.servicesPercent)}</td>
          <td>${store.packages}</td>
          <td>${formatPercent(store.extraSharePercent)}</td>
          <td>${store.attach.toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div class="table-wrap">
      <table class="report-table">
        <thead>
          <tr>
            <th>ТТ</th>
            <th>Аксы факт, руб</th>
            <th>Аксы, %</th>
            <th>Ср. цена</th>
            <th>Услуги факт, руб</th>
            <th>Услуги, %</th>
            <th>Пакеты, шт</th>
            <th>Доля допов</th>
            <th>Attach</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderCreditsTable(stores) {
  const rows = stores
    .map(
      (store) => `
        <tr>
          <td>${escapeHtml(store.name)}</td>
          <td>${formatNumber(store.factRevenue)}</td>
          <td>${statusPill(store.shareFact)}</td>
          <td>${store.applications}</td>
          <td>${store.hasCredits ? "Да" : "Нет"}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div class="table-wrap">
      <table class="report-table">
        <thead>
          <tr>
            <th>ТТ</th>
            <th>Факт, руб</th>
            <th>Доля, %</th>
            <th>Заявки</th>
            <th>Кредиты</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function operatorScoreLabel(percent, rules) {
  if (percent >= rules.full) return "1.0";
  if (percent >= rules.medium) return "0.6";
  if (percent >= rules.low) return "0.3";
  return "0";
}

function calcMetShare(stores) {
  const met = stores.filter((store) => store.metPlan).length;
  const total = stores.length;
  const percent = Math.round((met / total) * 100);
  return { met, total, percent };
}

function operatorSummaryCard(name, stores, rules) {
  const result = calcMetShare(stores);
  return `
    <div class="mini-card">
      <div><strong>${escapeHtml(name)}</strong></div>
      <div>ТТ выполнили: ${result.met}/${result.total} (${result.percent}%)</div>
      <div>Коэф.: <strong>${operatorScoreLabel(result.percent, rules)}</strong></div>
    </div>
  `;
}

function renderOperatorTable(stores, columns) {
  const thead = columns.map((col) => `<th>${escapeHtml(col.label)}</th>`).join("");
  const rows = stores
    .map((store) => {
      const cells = columns.map((col) => `<td>${col.render(store)}</td>`).join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <div class="table-wrap">
      <table class="report-table">
        <thead><tr>${thead}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderPortableChart(chartData) {
  if (!Array.isArray(chartData) || typeof Chart === "undefined") return;

  const canvas = document.getElementById("portableChart");
  if (!canvas) return;

  if (portableChartInstance) {
    portableChartInstance.destroy();
    portableChartInstance = null;
  }

  const prepared = [...chartData]
    .map((row) => ({
      name: row.name,
      percent: Number(row.percent) || 0
    }))
    .sort((a, b) => a.percent - b.percent);

  const labels = prepared.map((row) => row.name);
  const values = prepared.map((row) => row.percent);
  const backgroundColor = prepared.map((row) => portableBarColor(row.percent));
  const borderColor = backgroundColor.map((c) => c.replace("0.9", "1"));

  const wrap = canvas.closest(".chart-canvas-wrap--portable");
  if (wrap) {
    wrap.style.height = `${Math.min(760, Math.max(320, prepared.length * 52 + 120))}px`;
  }

  const maxValue = Math.max(100, ...values, 0);

  portableChartInstance = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor,
          borderColor,
          borderWidth: 1,
          borderRadius: 8,
          barThickness: 22,
          maxBarThickness: 24
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      indexAxis: "y",
      layout: {
        padding: {
          left: 8,
          right: 20,
          top: 8,
          bottom: 8
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          callbacks: {
            title(items) {
              const item = items?.[0];
              return item ? labels[item.dataIndex] : "";
            },
            label(ctx) {
              return `Выполнение: ${ctx.parsed.x}%`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          suggestedMax: Math.ceil(maxValue * 1.15),
          ticks: {
            font: { size: 11 },
            color: "#9ca3af",
            callback: (value) => `${value}%`
          },
          grid: {
            color: "rgba(148, 163, 184, 0.18)"
          },
          border: {
            display: false
          }
        },
        y: {
          ticks: {
            autoSkip: false,
            font: { size: 11 },
            color: "#9ca3af",
            padding: 6,
            callback(value, index) {
              const full = labels[index] || "";
              const max = 30;
              return full.length > max ? `${full.slice(0, max)}…` : full;
            }
          },
          grid: {
            display: false
          },
          border: {
            display: false
          }
        }
      }
    }
  });
}

function renderSectionAccordion(modifier, label, title, tagline, content, open = false) {
  return `
    <section class="report-block report-accordion ${open ? "is-open" : ""}" data-section="${escapeHtml(modifier)}">
      <button class="report-accordion__trigger" type="button" aria-expanded="${open ? "true" : "false"}">
        ${renderBlockHero(modifier, label, title, tagline)}
        <span class="report-accordion__chevron" aria-hidden="true"></span>
      </button>
      <div class="report-accordion__content">
        <div class="block-body">
          ${content}
        </div>
      </div>
    </section>
  `;
}

function renderInnerAccordionItem({ id, title, summaryBits, detailHtml, open = false }) {
  const bits = (summaryBits || [])
    .filter((b) => hasMeaningfulValue(b))
    .map((b) => `<span class="inner-accordion__bit">${escapeHtml(b)}</span>`)
    .join("");

  return `
    <div class="inner-accordion ${open ? "is-open" : ""}" data-inner-id="${escapeHtml(id)}">
      <button type="button" class="inner-accordion__trigger" aria-expanded="${open ? "true" : "false"}">
        <span class="inner-accordion__title">${escapeHtml(title)}</span>
        <span class="inner-accordion__summary">${bits}</span>
        <span class="inner-accordion__chevron" aria-hidden="true"></span>
      </button>
      <div class="inner-accordion__content">
        <div class="inner-accordion__body">${detailHtml}</div>
      </div>
    </div>
  `;
}

function renderInnerAccordionStack(childrenHtml) {
  return `<div class="inner-accordion-stack">${childrenHtml}</div>`;
}

function operatorShortStatus(percent) {
  const p = Number(percent);
  if (p >= 100) return "План выполнен";
  if (p >= 75) return "Выше минимума";
  return "Ниже минимума";
}

function updateAccordionHeight(innerContent) {
  if (!innerContent) return;
  innerContent.style.maxHeight = "none";
  innerContent.style.overflow = "visible";
}

function updateParentSectionHeight(el) {
  const section =
    el && el.classList && el.classList.contains("report-accordion")
      ? el
      : el && el.closest
        ? el.closest(".report-accordion")
        : null;
  if (!section || !section.classList.contains("is-open")) return;
  const outer = section.querySelector(".report-accordion__content");
  if (!outer) return;
  outer.style.maxHeight = "none";
  outer.style.overflow = "visible";
}

function syncOuterAccordionHeight(accordion) {
  updateParentSectionHeight(accordion);
}

function syncAllOpenOuterHeights() {
  document.querySelectorAll(".report-accordion.is-open").forEach((acc) => updateParentSectionHeight(acc));
}

function layoutAfterInnerOpen(innerContent, section, hasPortableChart) {
  const item = innerContent && innerContent.closest(".inner-accordion");
  const bump = () => {
    updateAccordionHeight(innerContent);
    updateParentSectionHeight(item || section);
  };
  requestAnimationFrame(() => {
    bump();
    requestAnimationFrame(() => {
      if (hasPortableChart) renderPortableChart(data.economic.portable.stores);
      bump();
      setTimeout(() => {
        if (hasPortableChart) renderPortableChart(data.economic.portable.stores);
        bump();
        syncAllOpenOuterHeights();
      }, 0);
    });
  });
}

function relayoutOpenInnerInSection(accordion) {
  if (!accordion) return;
  const openContent = accordion.querySelector(".inner-accordion.is-open .inner-accordion__content");
  if (!openContent) {
    updateParentSectionHeight(accordion);
    return;
  }
  layoutAfterInnerOpen(
    openContent,
    accordion,
    Boolean(openContent.querySelector("#portableChart"))
  );
}

function ensureDefaultInnerAccordion(accordion) {
  const stack = accordion.querySelector(".inner-accordion-stack");
  if (!stack) return;
  const items = stack.querySelectorAll(".inner-accordion");
  if (!items.length) return;
  let target = items[0];
  if (accordion.dataset.section === "admin") {
    const hr = stack.querySelector('[data-inner-id="admin-hr"]');
    if (hr) target = hr;
  }
  items.forEach((it) => {
    const c = it.querySelector(".inner-accordion__content");
    const t = it.querySelector(".inner-accordion__trigger");
    const on = it === target;
    it.classList.toggle("is-open", on);
    if (t) t.setAttribute("aria-expanded", on ? "true" : "false");
    if (c) {
      if (on) {
        c.style.maxHeight = "none";
        c.style.overflow = "visible";
      } else {
        c.style.maxHeight = "0px";
        c.style.overflow = "hidden";
      }
    }
  });
}

function initInnerAccordions() {
  const root = document.getElementById("content");
  if (!root) return;
  root.querySelectorAll(".report-accordion.is-open .inner-accordion").forEach((inn) => {
    const ic = inn.querySelector(".inner-accordion__content");
    const it = inn.querySelector(".inner-accordion__trigger");
    if (!ic || !it) return;
    if (inn.classList.contains("is-open")) {
      ic.style.maxHeight = "none";
      ic.style.overflow = "visible";
      it.setAttribute("aria-expanded", "true");
    } else {
      ic.style.maxHeight = "0px";
      ic.style.overflow = "hidden";
      it.setAttribute("aria-expanded", "false");
    }
  });
  syncAllOpenOuterHeights();
}

function initSectionAccordions() {
  const root = document.getElementById("content");
  if (!root) return;

  if (!root.dataset.accordionsBound) {
    root.dataset.accordionsBound = "1";
    root.addEventListener("click", (e) => {
      const innerTrig = e.target.closest(".inner-accordion__trigger");
      if (innerTrig && root.contains(innerTrig)) {
        e.preventDefault();
        const item = innerTrig.closest(".inner-accordion");
        const stack = innerTrig.closest(".inner-accordion-stack");
        const section = innerTrig.closest(".report-accordion");
        const innerContent = item.querySelector(".inner-accordion__content");
        if (!item || !stack || !innerContent) return;

        if (item.classList.contains("is-open")) {
          item.classList.remove("is-open");
          innerTrig.setAttribute("aria-expanded", "false");
          innerContent.style.maxHeight = "0px";
          innerContent.style.overflow = "hidden";
        } else {
          stack.querySelectorAll(".inner-accordion").forEach((o) => {
            o.classList.remove("is-open");
            const tr = o.querySelector(".inner-accordion__trigger");
            const ct = o.querySelector(".inner-accordion__content");
            if (tr) tr.setAttribute("aria-expanded", "false");
            if (ct) {
              ct.style.maxHeight = "0px";
              ct.style.overflow = "hidden";
            }
          });
          item.classList.add("is-open");
          innerTrig.setAttribute("aria-expanded", "true");
          const hasChart = Boolean(item.querySelector("#portableChart"));
          layoutAfterInnerOpen(innerContent, section, hasChart);
        }
        updateParentSectionHeight(section);
        return;
      }

      const secTrig = e.target.closest(".report-accordion__trigger");
      if (!secTrig || !root.contains(secTrig)) return;
      e.preventDefault();
      const accordion = secTrig.closest(".report-accordion");
      const outerContent = accordion.querySelector(".report-accordion__content");
      if (!outerContent) return;

      if (accordion.classList.contains("is-open")) {
        accordion.classList.remove("is-open");
        secTrig.setAttribute("aria-expanded", "false");
        outerContent.style.maxHeight = "0px";
        outerContent.style.overflow = "hidden";
        return;
      }

      root.querySelectorAll(".report-accordion").forEach((acc) => {
        acc.classList.remove("is-open");
        const tr = acc.querySelector(".report-accordion__trigger");
        const ct = acc.querySelector(".report-accordion__content");
        if (tr) tr.setAttribute("aria-expanded", "false");
        if (ct) {
          ct.style.maxHeight = "0px";
          ct.style.overflow = "hidden";
        }
      });

      accordion.classList.add("is-open");
      secTrig.setAttribute("aria-expanded", "true");
      outerContent.style.maxHeight = "none";
      outerContent.style.overflow = "visible";
      ensureDefaultInnerAccordion(accordion);

      requestAnimationFrame(() => {
        accordion.querySelectorAll(".inner-accordion.is-open .inner-accordion__content").forEach((ic) => {
          ic.style.maxHeight = "none";
          ic.style.overflow = "visible";
        });
        outerContent.style.maxHeight = "none";
        outerContent.style.overflow = "visible";
        relayoutOpenInnerInSection(accordion);
      });
    });
  }

  root.querySelectorAll(".report-accordion").forEach((acc) => {
    const outer = acc.querySelector(".report-accordion__content");
    const tr = acc.querySelector(".report-accordion__trigger");
    if (!outer || !tr) return;
    if (acc.classList.contains("is-open")) {
      tr.setAttribute("aria-expanded", "true");
      outer.style.maxHeight = "none";
      outer.style.overflow = "visible";
      acc.querySelectorAll(".inner-accordion").forEach((inn) => {
        const ic = inn.querySelector(".inner-accordion__content");
        const it = inn.querySelector(".inner-accordion__trigger");
        if (!ic || !it) return;
        if (inn.classList.contains("is-open")) {
          ic.style.maxHeight = "none";
          ic.style.overflow = "visible";
          it.setAttribute("aria-expanded", "true");
        } else {
          ic.style.maxHeight = "0px";
          ic.style.overflow = "hidden";
          it.setAttribute("aria-expanded", "false");
        }
      });
    } else {
      tr.setAttribute("aria-expanded", "false");
      outer.style.maxHeight = "0px";
      outer.style.overflow = "hidden";
    }
  });

  requestAnimationFrame(() => {
    initInnerAccordions();
    root.querySelectorAll(".report-accordion.is-open").forEach((acc) => {
      relayoutOpenInnerInSection(acc);
    });
    if (root.querySelector("#portableChart")) {
      renderPortableChart(data.economic.portable.stores);
    }
  });
}

function render() {
  const { economic, operator, administrative, focus } = data;

  const portableOutsiders = economic.portable.stores
    .filter((store) => store.percent < economic.minTargetPercent)
    .map((store) => store.name);

  const accessoriesRevenueOutsiders = economic.accessoriesServices.stores
    .filter((store) => store.accessoriesPercent < economic.minTargetPercent)
    .map((store) => store.name);

  const accessoriesAvgPriceOutsiders = economic.accessoriesServices.stores
    .filter((store) => store.accessoriesAvgPrice < 1000)
    .map((store) => store.name);

  const accessoriesAttachOutsiders = economic.accessoriesServices.stores
    .filter((store) => store.attach < 3.2)
    .map((store) => store.name);

  const creditsByIssueOutsiders = [...economic.credits.stores]
    .sort((a, b) => a.factRevenue - b.factRevenue)
    .slice(0, 4)
    .map((store) => `${store.name} — ${formatNumber(store.factRevenue)} ₽`);

  const simsOutsiders = operator.sims.stores.filter((s) => !s.metPlan).map((s) => s.name);
  const mnpOutsiders = operator.mnp.stores.filter((s) => !s.metPlan).map((s) => s.name);
  const upsaleOutsiders = operator.upsale.stores.filter((s) => !s.metPlan).map((s) => s.name);
  const yaOutsiders = operator.ya.stores.filter((s) => !s.metPlan).map((s) => s.name);
  const shpdOutsiders = operator.shpd.stores.filter((s) => !s.metPlan).map((s) => s.name);
  const csOutsiders = operator.cs.stores.filter((s) => !s.metPlan).map((s) => s.name);

  const vmrOutsiders = administrative.vmr.stores
    .filter((s) => s.score < administrative.vmr.target)
    .map((s) => `${s.name} — ${s.score.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}%`);

    const invoiceTarget = Number(administrative.payments.summary.bankCardPlanPercent || 25);
  const invoiceOutsiders = administrative.payments.stores
    .filter((s) => Number(s.bankCardPercent) > invoiceTarget)
    .map((s) => `${s.name} — ${s.bankCardPercent.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`);

  const portableApplesPercent = Math.round(
    planFactCompletionPercent(
      economic.portable.summary.applesFact,
      economic.portable.summary.applesPlan
    )
  );

  const portablePercentDelta = economic.portable.summary.percent - economic.portable.summary.prevPercent;
  const portableAppleDeltaPercent = percentChange(
    economic.portable.summary.applesFact,
    economic.portable.summary.prevApplesFact
  );

  const sellOutPercentDelta = economic.portable.sellOut.percent - economic.portable.sellOut.prevPercent;

  const extraShareDelta = economic.accessoriesServices.summary.extraShareCurrent - economic.accessoriesServices.summary.extraSharePrev;
  const attachDelta = Number(
    (economic.accessoriesServices.summary.attachCurrent - economic.accessoriesServices.summary.attachPrev).toFixed(2)
  );
  const packagesDelta = economic.accessoriesServices.summary.packagesCurrent - economic.accessoriesServices.summary.packagesPrev;

  const creditsRevenuePercent = Math.round(
    planFactCompletionPercent(
      economic.credits.summary.factRevenue,
      economic.credits.summary.planRevenue
    )
  );
  const creditsSharePercent = Math.round(
    planFactCompletionPercent(
      economic.credits.summary.factShare,
      economic.credits.summary.planShare
    )
  );
  const creditsApplicationsPercent = Math.round(
    planFactCompletionPercent(
      economic.credits.summary.applications,
      economic.credits.summary.planApplications
    )
  );
  const creditsShareDelta = economic.credits.summary.factShare - economic.credits.summary.prevShare;
  const creditsRevenueDelta = economic.credits.summary.percent - economic.credits.summary.prevPercent;
  const creditsApplicationsDelta = economic.credits.summary.applications - economic.credits.summary.prevApplications;

  const economicPortableDetail = `
    <div class="metric-panel metric-panel--nested">
      ${renderStackMetricGrid([
        renderStackMetricCard("Портативная техника", [
          { label: "План", value: formatCurrency(economic.portable.summary.plan) },
          { label: "Факт", value: formatCurrency(economic.portable.summary.fact) }
        ]),
        renderStackMetricCard("Итог по ОЗ", [
          { label: "Итог по ОЗ", value: formatPercent(economic.portable.summary.percent) },
          { label: "Динамика", value: renderDeltaBadge(portablePercentDelta), html: true }
        ]),
        renderStackMetricCard("Apple", [
          { label: "План", value: `${economic.portable.summary.applesPlan} шт` },
          { label: "Факт", value: `${economic.portable.summary.applesFact} шт` }
        ]),
        renderStackMetricCard("Apple", [
          { label: "Выполнение", value: formatPercent(portableApplesPercent) },
          { label: "Динамика", value: renderDeltaBadge(portableAppleDeltaPercent), html: true }
        ])
      ])}
      <div class="chart-canvas-wrap chart-canvas-wrap--portable">
        <canvas id="portableChart"></canvas>
      </div>
      ${renderExecutionGauge(economic.portable.summary.percent, economic.minTargetPercent)}
      ${renderChipsBlock("Аутсайдеры <75%", portableOutsiders)}
      <p class="prose-conclusion"><strong>Вывод:</strong> Портативная техника по ОЗ не выполнена. Основная проблема — слабая работа части ТТ по выручке, продаже высокомаржинальных устройств, конверсии и средней цене.</p>
    </div>`;

  const economicSellOutDetail = `
    <div class="metric-panel metric-panel--nested">
      ${renderStackMetricGrid([
        renderStackMetricCard("Sell Out", [
          { label: "План", value: `${economic.portable.sellOut.plan} шт` },
          { label: "Факт", value: `${economic.portable.sellOut.fact} шт` }
        ]),
        renderStackMetricCard("Итог по ОЗ", [
          { label: "Итог по ОЗ", value: formatPercent(economic.portable.sellOut.percent) },
          { label: "Динамика", value: renderDeltaBadge(sellOutPercentDelta), html: true }
        ]),
        renderStackMetricCard("ТТ", [
          { label: "Активные ТТ", value: String(economic.portable.sellOut.activeStores) },
          { label: "Пред. факт", value: `${economic.portable.sellOut.prevFact} шт` }
        ])
      ])}
      ${renderExecutionGauge(economic.portable.sellOut.percent, economic.minTargetPercent)}
      <p class="prose-note">По ТТ: только ${economic.portable.sellOut.activeStores} ТТ выполнили план, остальные с 0 — детальный разрез в данных отсутствует.</p>
      <p class="prose-conclusion"><strong>Вывод:</strong> направление фактически не отрабатывается системно.</p>
    </div>`;

  const economicAccessoriesDetail = `
    <div class="metric-panel metric-panel--nested">
      ${renderAccessoriesServicesTwinKpis(economic.accessoriesServices.summary)}
      ${renderStackMetricGrid([
        renderStackMetricCard("Ср. цена — аксы", [
          { label: "Пред. период", value: `${formatNumber(economic.accessoriesServices.summary.accessoriesAvgPricePrev)} ₽` },
          { label: "Факт", value: `${formatNumber(economic.accessoriesServices.summary.accessoriesAvgPriceCurrent)} ₽` },
          {
            label: "Динамика",
            value: renderDeltaBadge(
              economic.accessoriesServices.summary.accessoriesAvgPriceCurrent - economic.accessoriesServices.summary.accessoriesAvgPricePrev,
              " ₽"
            ),
            html: true
          }
        ]),
        renderStackMetricCard("Доля — аксы", [
          { label: "Пред. период", value: formatPercent(economic.accessoriesServices.summary.accessoriesSharePrev) },
          { label: "Факт", value: formatPercent(economic.accessoriesServices.summary.accessoriesShareCurrent) },
          {
            label: "Динамика",
            value: renderDeltaBadge(
              Number((economic.accessoriesServices.summary.accessoriesShareCurrent - economic.accessoriesServices.summary.accessoriesSharePrev).toFixed(1))
            ),
            html: true
          }
        ]),
        renderStackMetricCard("Ср. цена — услуги", [
          { label: "Пред. период", value: `${formatNumber(economic.accessoriesServices.summary.servicesAvgPricePrev)} ₽` },
          { label: "Факт", value: `${formatNumber(economic.accessoriesServices.summary.servicesAvgPriceCurrent)} ₽` },
          {
            label: "Динамика",
            value: renderDeltaBadge(
              economic.accessoriesServices.summary.servicesAvgPriceCurrent - economic.accessoriesServices.summary.servicesAvgPricePrev,
              " ₽"
            ),
            html: true
          }
        ]),
        renderStackMetricCard("Доля — услуги", [
          { label: "Пред. период", value: formatPercent(economic.accessoriesServices.summary.servicesSharePrev) },
          { label: "Факт", value: formatPercent(economic.accessoriesServices.summary.servicesShareCurrent) },
          {
            label: "Динамика",
            value: renderDeltaBadge(
              Number((economic.accessoriesServices.summary.servicesShareCurrent - economic.accessoriesServices.summary.servicesSharePrev).toFixed(1))
            ),
            html: true
          }
        ]),
        renderStackMetricCard("Доля допов", [
          { label: "Пред. период", value: formatPercent(economic.accessoriesServices.summary.extraSharePrev) },
          { label: "Факт", value: formatPercent(economic.accessoriesServices.summary.extraShareCurrent) },
          { label: "Динамика", value: renderDeltaBadge(extraShareDelta), html: true }
        ]),
        renderStackMetricCard("Attach", [
          { label: "Пред. период", value: String(economic.accessoriesServices.summary.attachPrev) },
          { label: "Факт", value: String(economic.accessoriesServices.summary.attachCurrent) },
          { label: "Динамика", value: renderDeltaBadge(attachDelta), html: true }
        ]),
        renderStackMetricCard("Пакеты", [
          { label: "Пред. период", value: String(economic.accessoriesServices.summary.packagesPrev) },
          { label: "Факт", value: String(economic.accessoriesServices.summary.packagesCurrent) },
          { label: "Динамика", value: renderDeltaBadge(packagesDelta, ""), html: true }
        ])
      ])}
      ${renderExecutionGauge(economic.accessoriesServices.summary.totalPercent, economic.minTargetPercent)}
      <p class="subsection-h">Таблица по ТТ</p>
      ${renderAccessoriesTable(economic.accessoriesServices.stores)}
      ${renderChipsBlock("Аутсайдеры по выручке акс (&lt;75%)", accessoriesRevenueOutsiders)}
      ${renderChipsBlock("Аутсайдеры по ср. цене (&lt;1000)", accessoriesAvgPriceOutsiders)}
      ${renderChipsBlock("Аутсайдеры по attach (&lt;3.2)", accessoriesAttachOutsiders)}
      <p class="prose-conclusion"><strong>Вывод:</strong> качественные показатели растут, но выручка блока остается ниже минимальной цели 75%. Основная проблема — низкая средняя цена и неравномерная работа ТТ.</p>
    </div>`;

  const economicCreditsDetail = `
    <div class="metric-panel metric-panel--nested">
      ${renderStackMetricGrid([
        renderStackMetricCard("Выручка", [
          { label: "План", value: formatCurrency(economic.credits.summary.planRevenue) },
          { label: "Факт", value: formatCurrency(economic.credits.summary.factRevenue) },
          { label: "% выполнения", value: formatPercent(creditsRevenuePercent) }
        ]),
        renderStackMetricCard("Доля кредитов", [
          { label: "План", value: formatPercent(economic.credits.summary.planShare) },
          { label: "Факт", value: formatPercent(economic.credits.summary.factShare) },
          { label: "% выполнения", value: formatPercent(creditsSharePercent) }
        ]),
        renderStackMetricCard("Заявки", [
          { label: "План", value: String(economic.credits.summary.planApplications) },
          { label: "Факт", value: String(economic.credits.summary.applications) },
          { label: "% выполнения", value: formatPercent(creditsApplicationsPercent) }
        ]),
        renderStackMetricCard("Динамика", [
          { label: "Доля", value: renderDeltaBadge(creditsShareDelta), html: true },
          { label: "Выручка", value: renderDeltaBadge(creditsRevenueDelta), html: true },
          { label: "Заявки", value: renderDeltaBadge(creditsApplicationsDelta, ""), html: true }
        ])
      ])}
      ${renderExecutionGauge(creditsSharePercent, economic.minTargetPercent)}
      <p class="subsection-h">Таблица по ТТ</p>
      ${renderCreditsTable(economic.credits.stores)}
      ${renderChipsBlock("Аутсайдеры по выдаче", creditsByIssueOutsiders)}
      <p class="prose-conclusion"><strong>Вывод:</strong> кредитное направление выполнено выше порога, но рост обеспечен неравномерно. Часть ТТ даёт слабую выдачу и не держит темп по доле и заявкам.</p>
    </div>`;

  const economicContent = `
    ${renderInnerAccordionStack(
      [
        renderInnerAccordionItem({
          id: "econ-portable",
          title: "Портативная техника",
          summaryBits: [],
          detailHtml: economicPortableDetail,
          open: true
        }),
        renderInnerAccordionItem({
          id: "econ-sellout",
          title: "Sell Out",
          summaryBits: [],
          detailHtml: economicSellOutDetail,
          open: false
        }),
        renderInnerAccordionItem({
          id: "econ-accessories",
          title: "Аксессуары и услуги",
          summaryBits: [],
          detailHtml: economicAccessoriesDetail,
          open: false
        }),
        renderInnerAccordionItem({
          id: "econ-credits",
          title: "Кредиты / рассрочки / сплит",
          summaryBits: [],
          detailHtml: economicCreditsDetail,
          open: false
        })
      ].join("")
    )}
<p class="prose-conclusion block-footer-note"><strong>Общий вывод по экономическому блоку:</strong> минимальная цель по всем экономическим показателям по ОЗ — ${formatPercent(economic.minTargetPercent)}. Ниже — провал блока. Провальные показатели месяца: ${[
  economic.portable.summary.percent < economic.minTargetPercent ? `портативная техника ${formatPercent(economic.portable.summary.percent)}` : null,
  economic.portable.sellOut.percent < economic.minTargetPercent ? `Sell Out ${formatPercent(economic.portable.sellOut.percent)}` : null,
  economic.accessoriesServices.summary.totalPercent < economic.minTargetPercent ? `акс+услуги ${formatPercent(economic.accessoriesServices.summary.totalPercent)}` : null,
  economic.credits.summary.percent < economic.minTargetPercent ? `кредиты ${formatPercent(economic.credits.summary.percent)}` : null
].filter(Boolean).join(", ") || "нет"}. Статус: ${economicBlockStatusLabel(economic)}.</p>
  `;

  const opSimsDelta = operator.sims.summary.percent - operator.sims.summary.prevPercent;
  const opMnpDelta = operator.mnp.summary.percent - operator.mnp.summary.prevPercent;
  const opGoldDelta = operator.abonGold.summary.percent - operator.abonGold.summary.prevGoldPercent;
  const shpdConversionPercent = Math.round(planFactCompletionPercent(operator.shpd.summary.fact, operator.shpd.summary.requests));

  const opSimsDetail = `
    <div class="metric-panel metric-panel--nested">
      ${renderStackMetricGrid([
        renderStackMetricCard("Сим-карты", [
          { label: "План", value: formatNumber(operator.sims.summary.plan) },
          { label: "Факт", value: formatNumber(operator.sims.summary.fact) }
        ]),
        renderStackMetricCard("Итог по ОЗ", [
          { label: "Итог по ОЗ", value: formatPercent(operator.sims.summary.percent) },
          { label: "Динамика", value: renderDeltaBadge(opSimsDelta), html: true }
        ]),
        renderStackMetricCard("Конверсия", [
          { label: "План", value: formatPercent(operator.sims.summary.convPlan) },
          { label: "Факт", value: formatPercent(operator.sims.summary.convFact) },
          {
            label: "Динамика",
            value: renderDeltaBadge(
              Number((operator.sims.summary.convFact - operator.sims.summary.prevConv).toFixed(1)),
              " п.п."
            ),
            html: true
          }
        ]),
        renderStackMetricCard("Качество базы", [
          { label: "Неактив", value: `${operator.sims.summary.inactivePrev} → ${operator.sims.summary.inactiveCurrent}` },
          { label: "Неподтв. заявки", value: `${operator.sims.summary.unconfirmedPrev} → ${operator.sims.summary.unconfirmedCurrent}` }
        ])
        ])}
        
        ${renderExecutionGauge(operator.sims.summary.percent, 75)}

      <p class="subsection-h">Таблица</p>
      ${renderOperatorTable(operator.sims.stores, [
        { label: "ТТ", render: (s) => escapeHtml(s.name) },
        { label: "Вып., %", render: (s) => statusPill(s.percent) },
        { label: "Конв. план", render: (s) => `${s.convPlan}%` },
        { label: "Конв. факт", render: (s) => `${s.convFact}%` },
        { label: "План выполнен", render: (s) => s.metPlan ? "Да" : "Нет" }
      ])}
      ${renderChipsBlock("Аутсайдеры (план не выполнен)", simsOutsiders)}
      <p class="prose-conclusion"><strong>Вывод:</strong> объем по сим-картам просел, но качество работы выросло: конверсия выше, неактив и неподтвержденные снижены.</p>
    </div>`;

  const opMnpDetail = `
    <div class="metric-panel metric-panel--nested">
      ${renderStackMetricGrid([
        renderStackMetricCard("МНП", [
          { label: "План", value: formatNumber(operator.mnp.summary.plan) },
          { label: "Факт", value: formatNumber(operator.mnp.summary.fact) }
        ]),
        renderStackMetricCard("Итог по ОЗ", [
          { label: "Итог по ОЗ", value: formatPercent(operator.mnp.summary.percent) },
          { label: "Динамика", value: renderDeltaBadge(opMnpDelta), html: true }
        ]),
        renderStackMetricCard("Заявки", [
          { label: "Факт", value: formatNumber(operator.mnp.summary.applications) },
          { label: "Доля заявок от GP", value: formatPercent(operator.mnp.summary.applicationsShare) }
        ])
      ])}
      ${renderExecutionGauge(operator.mnp.summary.percent, 75)}
      <p class="subsection-h">Таблица</p>
      ${renderOperatorTable(operator.mnp.stores, [
        { label: "ТТ", render: (s) => escapeHtml(s.name) },
        { label: "План", render: (s) => formatNumber(s.plan) },
        { label: "Заявки, шт", render: (s) => formatNumber(s.requests) },
        { label: "Факт", render: (s) => formatNumber(s.fact) },
        { label: "Доля заявок от GP", render: (s) => `${s.applicationsShare.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%` },
        { label: "Вып., %", render: (s) => statusPill(s.percent) },
        { label: "План выполнен", render: (s) => (s.metPlan ? "Да" : "Нет") }
      ])}
      ${renderChipsBlock("Аутсайдеры", mnpOutsiders)}
      <p class="prose-conclusion"><strong>Вывод:</strong> показатель выполнен выше 100%, но часть ТТ не дотягивает до плана. Основной резерв — качество работы с заявками и равномерность по зоне.</p>
    </div>`;

  const opGoldDetail = `
    <div class="metric-panel metric-panel--nested">
      ${renderStackMetricGrid([
        renderStackMetricCard("Золото / абонементы", [
          { label: "План", value: formatNumber(operator.abonGold.summary.plan) },
          { label: "Факт", value: formatNumber(operator.abonGold.summary.fact) }
        ]),
        renderStackMetricCard("Итог по ОЗ", [
          { label: "Итог по ОЗ", value: formatPercent(operator.abonGold.summary.percent) },
          { label: "Динамика", value: renderDeltaBadge(opGoldDelta), html: true }
        ]),
        renderStackMetricCard("Структура", [
          { label: "Золотые номера", value: formatNumber(operator.abonGold.summary.goldFact) },
          { label: "Абонементы", value: formatNumber(operator.abonGold.summary.subscriptionsFact) }
        ])
      ])}
      ${renderExecutionGauge(operator.abonGold.summary.percent, 75)}
      <p class="subsection-h">Таблица</p>
      ${renderOperatorTable(operator.abonGold.stores, [
        { label: "ТТ", render: (s) => escapeHtml(s.name) },
        { label: "План", render: (s) => formatNumber(s.plan) },
        { label: "Факт", render: (s) => formatNumber(s.fact) },
        { label: "Золото", render: (s) => formatNumber(s.gold) },
        { label: "Абонементы", render: (s) => formatNumber(s.subscriptions) },
        { label: "Вып., %", render: (s) => statusPill(s.percent) },
        { label: "План выполнен", render: (s) => (s.metPlan ? "Да" : "Нет") }
      ])}
      <p class="prose-conclusion"><strong>Вывод:</strong> результат формально очень сильный, но полностью построен на золотых номерах. Абонементы в текущем периоде не дают вклада и не масштабированы по ОЗ.</p>
    </div>`;

  const opUpsaleDetail = `
    <div class="metric-panel metric-panel--nested">
      ${renderStackMetricGrid([
        renderStackMetricCard("Upsale", [
          { label: "План", value: formatNumber(operator.upsale.summary.plan) },
          { label: "Факт", value: formatNumber(operator.upsale.summary.fact) }
        ]),
        renderStackMetricCard("Итог по ОЗ", [
          { label: "Итог по ОЗ", value: formatPercent(operator.upsale.summary.percent) },
          { label: "Прошлый период", value: operator.upsale.summary.prevAllStoresMet ? "Все ТТ выполнили" : "—" }
        ])
      ])}
      ${renderExecutionGauge(operator.upsale.summary.percent, 75)}
      <p class="subsection-h">Таблица</p>
      ${renderOperatorTable(operator.upsale.stores, [
        { label: "ТТ", render: (s) => escapeHtml(s.name) },
        { label: "Вып., %", render: (s) => statusPill(s.percent) },
        { label: "План выполнен", render: (s) => (s.metPlan ? "Да" : "Нет") }
      ])}
      ${renderChipsBlock("Аутсайдеры", upsaleOutsiders)}
      <p class="prose-conclusion"><strong>Вывод:</strong> upsale провален, выпала большая часть ТТ.</p>
    </div>`;

  const opYaDetail = `
    <div class="metric-panel metric-panel--nested">
      ${renderStackMetricGrid([
        renderStackMetricCard("ЯА", [
          { label: "План", value: formatNumber(operator.ya.summary.plan) },
          { label: "Факт", value: formatNumber(operator.ya.summary.fact) }
        ]),
        renderStackMetricCard("Итог по ОЗ", [
          { label: "Итог по ОЗ", value: formatPercent(operator.ya.summary.percent) },
          { label: "Пред. период", value: `ТТ с ЯА ≠ 0: ${operator.ya.summary.prevZeroNotClosedStores}` }
        ])
      ])}
      ${renderExecutionGauge(operator.ya.summary.percent, 75)}
      <p class="subsection-h">Таблица</p>
      ${renderOperatorTable(operator.ya.stores, [
        { label: "ТТ", render: (s) => escapeHtml(s.name) },
        { label: "Вып., %", render: (s) => statusPill(s.percent) },
        { label: "План выполнен", render: (s) => (s.metPlan ? "Да" : "Нет") }
      ])}
      ${renderChipsBlock("Аутсайдеры", yaOutsiders)}
      <p class="prose-conclusion"><strong>Вывод:</strong> ЯА — один из самых слабых показателей блока, работа крайне неравномерная.</p>
    </div>`;

  const opFtpDetail = `
    <div class="metric-panel metric-panel--nested">
      ${renderStackMetricGrid([
        renderStackMetricCard("ФТП", [
          { label: "План", value: formatNumber(operator.ftp.summary.plan) },
          { label: "Факт", value: formatNumber(operator.ftp.summary.fact) }
        ]),
        renderStackMetricCard("Итог по ОЗ", [
          { label: "Итог по ОЗ", value: formatPercent(operator.ftp.summary.percent) },
          { label: "Прошлый период", value: operator.ftp.summary.prevAllStoresMet ? "Все ТТ выполнили" : "—" }
        ])
      ])}
      ${renderExecutionGauge(operator.ftp.summary.percent, 75)}
      <p class="subsection-h">Таблица</p>
      ${renderOperatorTable(operator.ftp.stores, [
        { label: "ТТ", render: (s) => escapeHtml(s.name) },
        { label: "Вып., %", render: (s) => statusPill(s.percent) },
        { label: "План выполнен", render: (s) => (s.metPlan ? "Да" : "Нет") }
      ])}
      <p class="prose-conclusion"><strong>Вывод:</strong> ФТП — один из самых стабильных показателей операторского блока.</p>
    </div>`;

  const opSubDetail = `
    <div class="metric-panel metric-panel--nested">
      ${renderStackMetricGrid([
        renderStackMetricCard("Подписки", [
          { label: "План", value: formatCurrency(operator.subscriptions.summary.plan) },
          { label: "Факт", value: formatCurrency(operator.subscriptions.summary.fact) }
        ]),
        renderStackMetricCard("Итог по ОЗ", [
          { label: "Итог по ОЗ", value: formatPercent(operator.subscriptions.summary.percent) },
          { label: "Прошлый период", value: operator.subscriptions.summary.prevAllStoresMet ? "Все ТТ выполнили" : "—" }
        ])
      ])}
      ${renderExecutionGauge(operator.subscriptions.summary.percent, 75)}
      <p class="subsection-h">Таблица</p>
      ${renderOperatorTable(operator.subscriptions.stores, [
        { label: "ТТ", render: (s) => escapeHtml(s.name) },
        { label: "Вып., %", render: (s) => statusPill(s.percent) },
        { label: "План выполнен", render: (s) => (s.metPlan ? "Да" : "Нет") }
      ])}
      <p class="prose-conclusion"><strong>Вывод:</strong> Подписки — стабильно сильный и масштабированный показатель.</p>
    </div>`;

  const opShpdDetail = `
    <div class="metric-panel metric-panel--nested">
      ${renderStackMetricGrid([
        renderStackMetricCard("ШПД", [
          { label: "План", value: formatNumber(operator.shpd.summary.plan) },
          { label: "Факт", value: formatNumber(operator.shpd.summary.fact) }
        ]),
        renderStackMetricCard("Итог по ОЗ", [
          { label: "Итог по ОЗ", value: formatPercent(operator.shpd.summary.percent) },
          { label: "Прогноз", value: formatPercent(operator.shpd.summary.forecast) }
        ]),
        renderStackMetricCard("Заявки", [
          { label: "Факт", value: formatNumber(operator.shpd.summary.requests) },
          { label: "Конверсия", value: formatPercent(shpdConversionPercent) }
        ]),
        renderStackMetricCard("Пред. период", [
          { label: "Не выполнили", value: String(operator.shpd.summary.prevNotMetConnectionsStores) },
          { label: "Охват", value: operator.shpd.summary.prevAllStoresInvolved ? "Все ТТ в заявках" : "—" }
        ])
      ])}
      ${renderExecutionGauge(operator.shpd.summary.percent, 75)}
      <p class="subsection-h">Таблица</p>
      ${renderOperatorTable(operator.shpd.stores, [
        { label: "ТТ", render: (s) => escapeHtml(s.name) },
        { label: "План", render: (s) => formatNumber(s.plan) },
        { label: "Заявки", render: (s) => formatNumber(s.requests) },
        { label: "Факт", render: (s) => formatNumber(s.fact) },
        { label: "Вып., %", render: (s) => statusPill(s.percent) },
        { label: "План выполнен", render: (s) => (s.metPlan ? "Да" : "Нет") }
      ])}
      ${renderChipsBlock("Аутсайдеры", shpdOutsiders)}
      <p class="prose-conclusion"><strong>Вывод:</strong> ШПД в марте ниже минимума. Заявки есть, но конверсия в подключение по части ТТ слабая, из-за чего общий результат проседает.</p>
    </div>`;

  const opCsDetail = `
    <div class="metric-panel metric-panel--nested">
      ${renderStackMetricGrid([
        renderStackMetricCard("ЦС", [
          { label: "План", value: formatCurrency(operator.cs.summary.plan) },
          { label: "Факт", value: formatCurrency(operator.cs.summary.fact) }
        ]),
        renderStackMetricCard("Итог по ОЗ", [
          { label: "Итог по ОЗ", value: formatPercent(operator.cs.summary.percent) },
          { label: "Прогноз", value: formatPercent(operator.cs.summary.forecast) }
        ]),
        renderStackMetricCard("Пред. период", [
          { label: "Статус", value: operator.cs.summary.prevPlanClosed ? "План закрыт" : "—" },
          { label: "Все ТТ", value: operator.cs.summary.prevAllStoresMet ? "Да" : "Нет" }
        ])
      ])}
      ${renderExecutionGauge(operator.cs.summary.percent, 75)}
      <p class="subsection-h">Таблица</p>
      ${renderOperatorTable(operator.cs.stores, [
        { label: "ТТ", render: (s) => escapeHtml(s.name) },
        { label: "Факт, руб", render: (s) => formatNumber(s.fact) },
        { label: "Вып., %", render: (s) => statusPill(s.percent) },
        { label: "План выполнен", render: (s) => (s.metPlan ? "Да" : "Нет") }
      ])}
      ${renderChipsBlock("Аутсайдеры", csOutsiders)}
      <p class="prose-conclusion"><strong>Вывод:</strong> ЦС — один из самых проблемных показателей месяца после полного закрытия плана в прошлом периоде.</p>
    </div>`;

  const operatorContent = `
    <p class="rule-callout"><strong>Правило зачета блока:</strong> при 10 ТТ: 9–10 ТТ = 1.0, 7–8 ТТ = 0.6, 5–6 ТТ = 0.3, 0–4 ТТ = 0.</p>
    ${renderInnerAccordionStack(
      [
        renderInnerAccordionItem({
          id: "op-sims",
          title: "Сим-карты",
          summaryBits: [],
          detailHtml: opSimsDetail,
          open: false
        }),
        renderInnerAccordionItem({
          id: "op-mnp",
          title: "МНП",
          summaryBits: [],
          detailHtml: opMnpDetail,
          open: false
        }),
        renderInnerAccordionItem({
          id: "op-gold",
          title: "Золото / абонементы",
          summaryBits: [],
          detailHtml: opGoldDetail,
          open: false
        }),
        renderInnerAccordionItem({
          id: "op-upsale",
          title: "Upsale",
          summaryBits: [],
          detailHtml: opUpsaleDetail,
          open: false
        }),
        renderInnerAccordionItem({
          id: "op-ya",
          title: "ЯА",
          summaryBits: [],
          detailHtml: opYaDetail,
          open: false
        }),
        renderInnerAccordionItem({
          id: "op-ftp",
          title: "ФТП",
          summaryBits: [],
          detailHtml: opFtpDetail,
          open: false
        }),
        renderInnerAccordionItem({
          id: "op-sub",
          title: "Подписки",
          summaryBits: [],
          detailHtml: opSubDetail,
          open: false
        }),
        renderInnerAccordionItem({
          id: "op-shpd",
          title: "ШПД",
          summaryBits: [],
          detailHtml: opShpdDetail,
          open: false
        }),
        renderInnerAccordionItem({
          id: "op-cs",
          title: "ЦС",
          summaryBits: [],
          detailHtml: opCsDetail,
          open: false
        })
      ].join("")
    )}
<p class="prose-conclusion block-footer-note"><strong>Общий вывод по операторскому блоку:</strong> сильные показатели — сим-карты, МНП, ФТП, Подписки, золото. Ниже минимальной цели — ЯА и ШПД. Требуют внимания — Upsale и ЦС: показатели выше порога 75%, но не закрыты на 100%. Результат части направлений остается неравномерным по ТТ.</p>
  `;
  const adminHrDetail = `
  <div class="metric-panel metric-panel--nested">
    <div style="display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:16px; align-items:stretch;">
      ${renderStackMetricCard("Штат", [
        { label: "План ШР", value: formatNumber(administrative.hr.staffPlan) },
        { label: "Факт ШР", value: formatNumber(administrative.hr.staffFact) }
      ])}

      ${renderStackMetricCard("Укомплектованность", [
        { label: "Факт", value: formatPercent(administrative.hr.staffCompletionPercent) }
      ])}

      ${renderStackMetricCard("Рекомендации", [
        { label: "План", value: String(administrative.hr.recommendationPlan) },
        { label: "Факт", value: String(administrative.hr.recommendationFact) },
        { label: "Выполнение", value: formatPercent(administrative.hr.recommendationCompletionPercent) }
      ])}

      ${renderStackMetricCard("Движение персонала", [
        { label: "Стажеры", value: String(administrative.hr.traineesCount) },
        { label: "Увольняются", value: String(administrative.hr.leavingCount) }
      ])}
    </div>

    <p class="prose-note">В данных отчёта нет явного поля динамики по HR; отображены фактические значения периода.</p>
  </div>`;

    const adminVmrDetail = `
  <div class="metric-panel metric-panel--nested">
    <div style="display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:16px; align-items:stretch;">
      ${renderStackMetricCard("ВМР", [
        { label: "Факт по ОЗ", value: administrative.vmr.ozScore.toLocaleString("ru-RU", { maximumFractionDigits: 1 }) },
        { label: "Цель", value: String(administrative.vmr.target) }
      ])}

      ${renderStackMetricCard("Статус", [
        { label: "Статус", value: administrative.vmr.ozScore >= administrative.vmr.target ? "Цель достигнута" : "Ниже цели" },
        { label: "ТТ ниже цели", value: String(administrative.vmr.stores.filter((s) => s.score < administrative.vmr.target).length) }
      ])}

      ${renderStackMetricCard("ТОП ТТ", [
        {
          label: "",
          value: administrative.vmr.stores
            .slice()
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map((s) => s.name)
            .join("<br>"),
          html: true
        }
      ])}

      ${renderStackMetricCard("Антитоп ТТ", [
        {
          label: "",
          value: administrative.vmr.stores
            .slice()
            .sort((a, b) => a.score - b.score)
            .slice(0, 3)
            .map((s) => s.name)
            .join("<br>"),
          html: true
        }
      ])}
    </div>

    ${renderVmrOzGauge(administrative.vmr.ozScore, administrative.vmr.target)}

    <p class="subsection-h">Таблица по ТТ</p>
    ${renderOperatorTable(administrative.vmr.stores, [
      { label: "ТТ", render: (s) => escapeHtml(s.name) },
      { label: "Оценка", render: (s) => `${s.score.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}%` },
      { label: "Статус", render: (s) => statusPill(s.score, administrative.vmr.target, 100) }
    ])}
    ${renderChipsBlock("Провальные ТТ", vmrOutsiders)}
  </div>`;

    const adminInvoiceDetail = `
    <div class="metric-panel metric-panel--nested">
      <div style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:16px; align-items:stretch;">
  ${renderStackMetricCard("БК — доля", [
    { label: "План", value: "≤ " + formatPercent(administrative.payments.summary.bankCardPlanPercent) },
    { label: "Факт", value: formatPercent(administrative.payments.summary.bankCardSharePercent) },
    {
      label: "Динамика",
      value: renderInverseDeltaBadge(
        Number((
          administrative.payments.summary.bankCardSharePercent -
          administrative.payments.summary.prevBankCardSharePercent
        ).toFixed(1))
      ),
      html: true
    }
  ])}

  ${renderStackMetricCard("Инвойс — доля", [
    { label: "План", value: "≈ " + formatPercent(administrative.payments.summary.invoiceTargetPercent) },
    { label: "Факт", value: formatPercent(administrative.payments.summary.invoiceSharePercent) },
    {
      label: "Динамика",
      value: renderDeltaBadge(
        Number((
          administrative.payments.summary.invoiceSharePercent -
          administrative.payments.summary.prevInvoiceSharePercent
        ).toFixed(1))
      ),
      html: true
    }
  ])}

  ${renderStackMetricCard("Наличные — доля", [
    { label: "План", value: "—" },
    { label: "Факт", value: formatPercent(administrative.payments.summary.cashSharePercent) },
    {
      label: "Динамика",
      value: renderDeltaBadge(
        Number((
          administrative.payments.summary.cashSharePercent -
          administrative.payments.summary.prevCashSharePercent
        ).toFixed(1))
      ),
      html: true
    }
  ])}
</div>

<div style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:16px; align-items:stretch; margin-top:16px;">
  ${renderStackMetricCard("БК — рубли", [
    { label: "Факт", value: formatCurrency(administrative.payments.summary.bankCardRub) },
    { label: "Пред. период", value: formatCurrency(administrative.payments.summary.prevBankCardRub) }
  ])}

  ${renderStackMetricCard("Инвойс — рубли", [
    { label: "Факт", value: formatCurrency(administrative.payments.summary.invoiceRub) },
    { label: "Пред. период", value: formatCurrency(administrative.payments.summary.prevInvoiceRub) }
  ])}

  ${renderStackMetricCard("Наличные — рубли", [
    { label: "Факт", value: formatCurrency(administrative.payments.summary.cashRub) },
    { label: "Пред. период", value: formatCurrency(administrative.payments.summary.prevCashRub) }
  ])}
</div>
  
      ${renderReverseExecutionGauge(
        administrative.payments.summary.bankCardSharePercent,
        administrative.payments.summary.bankCardPlanPercent,
        "Цель по банковским картам"
      )}
  
      <p class="subsection-h">Таблица по ТТ</p>
      ${renderOperatorTable(administrative.payments.stores, [
        { label: "ТТ", render: (s) => escapeHtml(s.name) },
        { label: "Инвойс, %", render: (s) => `${s.invoicePercent.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%` },
        { label: "Инвойс, руб", render: (s) => formatNumber(s.invoiceRub) },
        { label: "Наличные, %", render: (s) => `${s.cashPercent.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%` },
        { label: "БК, %", render: (s) => `${s.bankCardPercent.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%` },
        { label: "Статус", render: (s) => invoiceStatusPill(s.bankCardPercent, invoiceTarget) }
      ])}
      ${renderChipsBlock("Аутсайдеры по доле БК (>25%)", invoiceOutsiders)}
      <p class="prose-note">${escapeHtml(administrative.payments.description)}</p>
      <p class="prose-conclusion"><strong>Вывод:</strong> итог блока оценивается по доле банковских карт. Текущий факт ${formatPercent(administrative.payments.summary.bankCardSharePercent)} при цели ≤ ${formatPercent(administrative.payments.summary.bankCardPlanPercent)}. Инвойс держится около целевого ориентира ${formatPercent(administrative.payments.summary.invoiceTargetPercent)}.</p>
    </div>`;
    const adminContent = `
    ${renderInnerAccordionStack(
      [
        renderInnerAccordionItem({
          id: "admin-hr",
          title: "HR",
          summaryBits: [],
          detailHtml: adminHrDetail,
          open: false
        }),
        renderInnerAccordionItem({
          id: "admin-vmr",
          title: "ВМР",
          summaryBits: [],
          detailHtml: adminVmrDetail,
          open: false
        }),
        renderInnerAccordionItem({
          id: "admin-invoice",
          title: "Invoice",
          summaryBits: [],
          detailHtml: adminInvoiceDetail,
          open: false
        })
      ].join("")
    )}
  `;
  const focusContent = `
  <div class="focus-lists">
    <div class="focus-list-card">
      <h3>Фокусные цели марта</h3>
      ${renderList(focus.march)}
    </div>
    <div class="focus-list-card">
      <h3>Цели на апрель</h3>
      ${renderList(focus.april)}
    </div>
  </div>
`;

    app.innerHTML = `
    <header class="report-cover">
      <div class="report-cover__shell">
        ${renderReportPhoto()}
        <div class="report-cover__main">
          <div class="report-cover__content">
            <div class="report-cover__eyebrow">
              <p class="report-cover__period">${escapeHtml(data.meta.period)}</p>
            </div>
           <h1 class="report-cover__title">Результаты работы</h1>
<p class="report-cover__subtitle">Ключевые показатели и аналитика</p>

<div class="report-cover__actions">
  <button class="report-btn" id="downloadPdfBtn" type="button">
    Скачать PDF
  </button>
</div>

</div>
            <div class="report-cover__line" aria-hidden="true"></div>
            <div class="report-cover__name">${escapeHtml(REPORT_PHOTO_NAME)}</div>
            <div class="report-cover__role">${escapeHtml(REPORT_PHOTO_ROLE)}</div>
          </div>
        </div>
      </div>
    </header>

    ${renderSectionAccordion("economic", "Раздел 1", "Экономический блок", "Портативка, аксы и услуги, кредиты, Sell Out", economicContent, true)}
    ${renderSectionAccordion("operator", "Раздел 2", "Операторский блок", "Сим, МНП, золото, upsale, ЯА, ФТП, подписки, ШПД, ЦС", operatorContent, false)}
    ${renderSectionAccordion("admin", "Раздел 3", "Административный блок", "HR, ВМР, Invoice", adminContent, false)}
    ${renderSectionAccordion("focus", "Раздел 4", "Фокусные цели", "Приоритеты на текущий и следующий месяц", focusContent, false)}
  `;

  renderPortableChart(economic.portable.stores);
  initSectionAccordions();

  loading.classList.add("hidden");
  app.classList.remove("hidden");
}
render();
function captureAccordionState() {
  return {
    sections: Array.from(document.querySelectorAll(".report-accordion")).map((section) => ({
      element: section,
      open: section.classList.contains("is-open"),
      trigger: section.querySelector(".report-accordion__trigger"),
      content: section.querySelector(".report-accordion__content"),
      inners: Array.from(section.querySelectorAll(".inner-accordion")).map((inner) => ({
        element: inner,
        open: inner.classList.contains("is-open"),
        trigger: inner.querySelector(".inner-accordion__trigger"),
        content: inner.querySelector(".inner-accordion__content"),
      })),
    })),
  };
}

function applyAccordionState(state) {
  if (!state || !state.sections) return;

  state.sections.forEach((sectionState) => {
    const section = sectionState.element;
    const trigger = sectionState.trigger;
    const content = sectionState.content;

    section.classList.toggle("is-open", sectionState.open);

    if (trigger) {
      trigger.setAttribute("aria-expanded", sectionState.open ? "true" : "false");
    }

    if (content) {
      content.style.display = "block";
      content.style.maxHeight = sectionState.open ? "none" : "0px";
      content.style.height = sectionState.open ? "auto" : "0px";
      content.style.overflow = sectionState.open ? "visible" : "hidden";
      content.style.visibility = "visible";
      content.style.opacity = "1";
    }

    sectionState.inners.forEach((innerState) => {
      const inner = innerState.element;
      const innerTrigger = innerState.trigger;
      const innerContent = innerState.content;

      inner.classList.toggle("is-open", innerState.open);

      if (innerTrigger) {
        innerTrigger.setAttribute("aria-expanded", innerState.open ? "true" : "false");
      }

      if (innerContent) {
        innerContent.style.display = "block";
        innerContent.style.maxHeight = innerState.open ? "none" : "0px";
        innerContent.style.height = innerState.open ? "auto" : "0px";
        innerContent.style.overflow = innerState.open ? "visible" : "hidden";
        innerContent.style.visibility = "visible";
        innerContent.style.opacity = "1";
      }
    });
  });
}

function expandAllAccordionsForPrint() {
  document.querySelectorAll(".report-accordion").forEach((section) => {
    section.classList.add("is-open");

    const trigger = section.querySelector(".report-accordion__trigger");
    const content = section.querySelector(".report-accordion__content");

    if (trigger) {
      trigger.setAttribute("aria-expanded", "true");
    }

    if (content) {
      content.style.display = "block";
      content.style.maxHeight = "none";
      content.style.height = "auto";
      content.style.overflow = "visible";
      content.style.visibility = "visible";
      content.style.opacity = "1";
    }

    section.querySelectorAll(".inner-accordion").forEach((inner) => {
      inner.classList.add("is-open");

      const innerTrigger = inner.querySelector(".inner-accordion__trigger");
      const innerContent = inner.querySelector(".inner-accordion__content");

      if (innerTrigger) {
        innerTrigger.setAttribute("aria-expanded", "true");
      }

      if (innerContent) {
        innerContent.style.display = "block";
        innerContent.style.maxHeight = "none";
        innerContent.style.height = "auto";
        innerContent.style.overflow = "visible";
        innerContent.style.visibility = "visible";
        innerContent.style.opacity = "1";
      }
    });
  });

  document.querySelectorAll(".report-block, .metric-panel, .inner-accordion, .report-accordion, .block-body, .inner-accordion__body").forEach((el) => {
    el.style.overflow = "visible";
    el.style.maxHeight = "none";
    el.style.height = "auto";
  });

  if (document.getElementById("portableChart")) {
    renderPortableChart(data.economic.portable.stores);
  }

  syncAllOpenOuterHeights();
}

function getPdfDocumentStyles() {
  return `<style>
    @page { size: A4; margin: 10mm; }
    * { box-sizing: border-box; }
    .pdf-body {
      font-family: "Segoe UI", Arial, sans-serif;
      font-size: 13px;
      line-height: 1.45;
      color: #1a1a1a;
      background: #fff;
      margin: 0;
      padding: 0;
    }
    .pdf-cover {
      min-height: 72vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      padding: 24px 16px 48px;
      page-break-after: always;
    }
    .pdf-cover__title {
      font-size: 22px;
      font-weight: 700;
      margin: 0 0 16px;
      color: #111;
    }
    .pdf-cover__period {
      font-size: 15px;
      margin: 0 0 28px;
      color: #333;
    }
    .pdf-cover__manager {
      font-size: 13px;
      margin: 0 0 8px;
      color: #333;
    }
    .pdf-cover__person {
      font-size: 14px;
      font-weight: 600;
      margin: 24px 0 4px;
    }
    .pdf-cover__role {
      font-size: 13px;
      color: #444;
      margin: 0;
    }
    .pdf-section {
      margin-bottom: 32px;
    }
    .pdf-section-title {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 700;
      color: #111;
      page-break-after: avoid;
    }
    .pdf-section-sub {
      margin: 0 0 20px;
      font-size: 13px;
      color: #444;
      page-break-after: avoid;
    }
    .pdf-subsection {
      margin-bottom: 28px;
    }
    .pdf-subsection:last-child {
      margin-bottom: 0;
    }
    .pdf-h3 {
      font-size: 15px;
      font-weight: 600;
      margin: 0 0 12px;
      color: #222;
      page-break-after: avoid;
    }
    .pdf-kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 10px 16px;
      margin: 0 0 16px;
    }
    .pdf-kpi {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 8px 10px;
      background: #fafafa;
      page-break-inside: avoid;
    }
    .pdf-kpi__label {
      display: block;
      font-size: 11px;
      color: #555;
      margin-bottom: 4px;
    }
    .pdf-kpi__value {
      font-size: 14px;
      font-weight: 600;
      color: #111;
    }
    .pdf-table-wrap {
      width: 100%;
      overflow: visible;
      margin: 12px 0 16px;
    }
    .pdf-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      page-break-inside: auto;
    }
    .pdf-table thead {
      display: table-header-group;
    }
    .pdf-table th,
    .pdf-table td {
      border: 1px solid #bbb;
      padding: 5px 6px;
      text-align: left;
      vertical-align: top;
      word-break: break-word;
    }
    .pdf-table th {
      background: #eee;
      font-weight: 600;
      color: #222;
    }
    .pdf-table tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    .pdf-note {
      font-size: 12px;
      color: #555;
      margin: 8px 0 12px;
    }
    .pdf-conclusion {
      font-size: 12px;
      margin: 12px 0 0;
      padding: 10px 12px;
      background: #f5f5f5;
      border-left: 3px solid #333;
      page-break-inside: avoid;
    }
    .pdf-conclusion--block {
      margin-top: 20px;
    }
    .pdf-muted {
      color: #666;
      font-size: 13px;
      margin: 8px 0;
    }
    .pdf-rule {
      font-size: 12px;
      padding: 10px 12px;
      background: #f0f0f0;
      border: 1px solid #ddd;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .pdf-list {
      margin: 8px 0 16px;
      padding-left: 20px;
    }
    .pdf-list li {
      margin-bottom: 6px;
    }
  </style>`;
}

function renderPdfCover(reportData) {
  const meta = reportData.meta || {};
  const title = meta.title || "Отчёт";
  const period = meta.period || "—";
  const manager = meta.manager || "";
  return `
    <header class="pdf-cover">
      <h1 class="pdf-cover__title">${escapeHtml(title)}</h1>
      <p class="pdf-cover__period">${escapeHtml(period)}</p>
      ${manager ? `<p class="pdf-cover__manager">${escapeHtml(manager)}</p>` : ""}
      <p class="pdf-cover__person">${escapeHtml(REPORT_PHOTO_NAME || "")}</p>
      <p class="pdf-cover__role">${escapeHtml(REPORT_PHOTO_ROLE || "")}</p>
    </header>
  `;
}

function renderPdfSectionTitle(title, subtitle) {
  const sub =
    subtitle != null && String(subtitle).trim() !== ""
      ? `<p class="pdf-section-sub">${escapeHtml(subtitle)}</p>`
      : "";
  return `
    <h2 class="pdf-section-title">${escapeHtml(title)}</h2>
    ${sub}
  `;
}

function renderPdfKpiGrid(items) {
  if (!items || !items.length) {
    return `<p class="pdf-muted">Показатели не заданы.</p>`;
  }
  const cells = items
    .map(
      (it) => `
    <div class="pdf-kpi">
      <span class="pdf-kpi__label">${escapeHtml(it.label)}</span>
      <span class="pdf-kpi__value">${escapeHtml(String(it.value))}</span>
    </div>
  `
    )
    .join("");
  return `<div class="pdf-kpi-grid">${cells}</div>`;
}

function renderPdfTable(columns, rows) {
  if (!columns || !columns.length) {
    return `<p class="pdf-muted">Нет колонок таблицы.</p>`;
  }
  if (!rows || !rows.length) {
    return `<p class="pdf-muted">Нет данных для таблицы.</p>`;
  }
  const thead = `<tr>${columns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join("")}</tr>`;
  const tbody = rows
    .map((row) => {
      const cells = columns.map((c) => `<td>${c.render(row)}</td>`).join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");
  return `
    <div class="pdf-table-wrap">
      <table class="pdf-table">
        <thead>${thead}</thead>
        <tbody>${tbody}</tbody>
      </table>
    </div>
  `;
}

function renderPdfConclusion(text) {
  const t = text == null || String(text).trim() === "" ? "Вывод не сформулирован." : String(text);
  return `<p class="pdf-conclusion"><strong>Вывод:</strong> ${escapeHtml(t)}</p>`;
}

function renderPdfSectionShell(sectionNum, title, subtitle, bodyHtml) {
  return `
    <section class="pdf-section">
      ${renderPdfSectionTitle(`Раздел ${sectionNum}. ${title}`, subtitle)}
      ${bodyHtml}
    </section>
  `;
}

function pdfInvoiceStatusText(percent, target) {
  const p = Number(percent);
  const t = Number(target) || 25;
  if (p <= t) return "В норме";
  if (p <= t + 5) return "Выше цели";
  return "Критично";
}

function pdfTdPlain(value) {
  if (value == null || value === "") return "—";
  return escapeHtml(String(value));
}

function renderPdfEconomicSection(reportData) {
  const economic = reportData.economic;
  if (!economic) {
    return renderPdfSectionShell(
      1,
      "Экономический блок",
      "Портативка, аксы и услуги, кредиты, Sell Out",
      `<p class="pdf-muted">Данные экономического блока отсутствуют.</p>`
    );
  }

  const minT = economic.minTargetPercent ?? 75;
  const portable = economic.portable || {};
  const portableSummary = portable.summary || {};
  const portableStores = Array.isArray(portable.stores) ? portable.stores : [];
  const sellOut = portable.sellOut || {};
  const acc = economic.accessoriesServices || {};
  const accSummary = acc.summary || {};
  const accStores = Array.isArray(acc.stores) ? acc.stores : [];
  const credits = economic.credits || {};
  const credSummary = credits.summary || {};
  const credStores = Array.isArray(credits.stores) ? credits.stores : [];

  const portableApplesPercent = Math.round(
    planFactCompletionPercent(portableSummary.applesFact, portableSummary.applesPlan)
  );
  const portablePercentDelta = (portableSummary.percent ?? 0) - (portableSummary.prevPercent ?? 0);
  const portableAppleDeltaPercent = percentChange(portableSummary.applesFact, portableSummary.prevApplesFact);
  const sellOutPercentDelta = (sellOut.percent ?? 0) - (sellOut.prevPercent ?? 0);
  const extraShareDelta = (accSummary.extraShareCurrent ?? 0) - (accSummary.extraSharePrev ?? 0);
  const attachDelta = Number(
    ((accSummary.attachCurrent ?? 0) - (accSummary.attachPrev ?? 0)).toFixed(2)
  );
  const packagesDelta = (accSummary.packagesCurrent ?? 0) - (accSummary.packagesPrev ?? 0);

  const creditsRevenuePercent = Math.round(
    planFactCompletionPercent(credSummary.factRevenue, credSummary.planRevenue)
  );
  const creditsSharePercent = Math.round(
    planFactCompletionPercent(credSummary.factShare, credSummary.planShare)
  );
  const creditsApplicationsPercent = Math.round(
    planFactCompletionPercent(credSummary.applications, credSummary.prevApplications)
  );

  const portableBlock = `
    <div class="pdf-subsection">
      <h3 class="pdf-h3">Портативная техника</h3>
      ${renderPdfKpiGrid([
        { label: "План", value: formatCurrency(portableSummary.plan) },
        { label: "Факт", value: formatCurrency(portableSummary.fact) },
        { label: "Итог по ОЗ", value: formatPercent(portableSummary.percent) },
        { label: "Динамика, п.п.", value: formatDeltaValue(portablePercentDelta) },
        { label: "Apple план, шт", value: String(portableSummary.applesPlan ?? "—") },
        { label: "Apple факт, шт", value: String(portableSummary.applesFact ?? "—") },
        { label: "Apple выполн.", value: formatPercent(portableApplesPercent) },
        { label: "Динамика Apple, %", value: formatDeltaValue(portableAppleDeltaPercent) }
      ])}
      ${renderPdfTable(
        [
          { label: "ТТ", render: (s) => pdfTdPlain(s.name) },
          { label: "План, руб", render: (s) => pdfTdPlain(formatNumber(s.plan)) },
          { label: "Факт, руб", render: (s) => pdfTdPlain(formatNumber(s.fact)) },
          { label: "Вып., %", render: (s) => pdfTdPlain(formatPercent(s.percent)) },
          { label: "Трафик Δ", render: (s) => pdfTdPlain(formatDeltaValue(s.trafficDelta)) },
          { label: "Конверсия Δ", render: (s) => pdfTdPlain(formatDeltaValue(s.conversionDelta)) },
          { label: "Ср. цена Δ", render: (s) => pdfTdPlain(formatDeltaValue(s.avgPriceDelta)) }
        ],
        portableStores
      )}
      ${renderPdfConclusion(
        "Портативная техника по ОЗ не выполнена. Основная проблема — слабая работа части ТТ по выручке, продаже высокомаржинальных устройств, конверсии и средней цене."
      )}
    </div>
  `;

  const sellOutBlock = `
    <div class="pdf-subsection">
      <h3 class="pdf-h3">Sell Out</h3>
      ${renderPdfKpiGrid([
        { label: "План, шт", value: String(sellOut.plan ?? "—") },
        { label: "Факт, шт", value: String(sellOut.fact ?? "—") },
        { label: "Итог по ОЗ", value: formatPercent(sellOut.percent) },
        { label: "Динамика, п.п.", value: formatDeltaValue(sellOutPercentDelta) },
        { label: "Активные ТТ", value: String(sellOut.activeStores ?? "—") },
        { label: "Пред. факт, шт", value: String(sellOut.prevFact ?? "—") }
      ])}
      <p class="pdf-note">По ТТ: только ${pdfTdPlain(sellOut.activeStores)} ТТ выполнили план, остальные с 0 — детальный разрез в данных отсутствует.</p>
      ${renderPdfConclusion("Направление фактически не отрабатывается системно.")}
    </div>
  `;

  const accessoriesBlock = `
    <div class="pdf-subsection">
      <h3 class="pdf-h3">Аксессуары и услуги</h3>
      ${renderPdfKpiGrid([
        { label: "Аксы план, ₽", value: formatCurrency(accSummary.accessoriesPlan) },
        { label: "Аксы факт, ₽", value: formatCurrency(accSummary.accessoriesFact) },
        { label: "Услуги план, ₽", value: formatCurrency(accSummary.servicesPlan) },
        { label: "Услуги факт, ₽", value: formatCurrency(accSummary.servicesFact) },
        { label: "Итог по ОЗ", value: formatPercent(accSummary.totalPercent) },
        { label: "Доля допов", value: formatPercent(accSummary.extraShareCurrent) },
        { label: "Δ доли допов", value: formatDeltaValue(extraShareDelta) },
        { label: "Attach", value: String(accSummary.attachCurrent ?? "—") },
        { label: "Δ Attach", value: formatDeltaValue(attachDelta, "") },
        { label: "Пакеты", value: String(accSummary.packagesCurrent ?? "—") },
        { label: "Δ пакетов", value: formatDeltaValue(packagesDelta, "") }
      ])}
      ${renderPdfTable(
        [
          { label: "ТТ", render: (s) => pdfTdPlain(s.name) },
          { label: "Аксы факт, ₽", render: (s) => pdfTdPlain(formatNumber(s.accessoriesFact)) },
          { label: "Аксы, %", render: (s) => pdfTdPlain(formatPercent(s.accessoriesPercent)) },
          { label: "Ср. цена", render: (s) => pdfTdPlain(formatNumber(s.accessoriesAvgPrice)) },
          { label: "Услуги факт, ₽", render: (s) => pdfTdPlain(formatNumber(s.servicesFact)) },
          { label: "Услуги, %", render: (s) => pdfTdPlain(formatPercent(s.servicesPercent)) },
          { label: "Пакеты", render: (s) => pdfTdPlain(s.packages) },
          { label: "Доля допов", render: (s) => pdfTdPlain(formatPercent(s.extraSharePercent)) },
          { label: "Attach", render: (s) => pdfTdPlain(Number(s.attach || 0).toFixed(2)) }
        ],
        accStores
      )}
      ${renderPdfConclusion(
        "Качественные показатели растут, но выручка блока остается ниже минимальной цели 75%. Основная проблема — низкая средняя цена и неравномерная работа ТТ."
      )}
    </div>
  `;

  const creditsBlock = `
    <div class="pdf-subsection">
      <h3 class="pdf-h3">Кредиты / рассрочки / сплит</h3>
      ${renderPdfKpiGrid([
        { label: "Выручка план, ₽", value: formatCurrency(credSummary.planRevenue) },
        { label: "Выручка факт, ₽", value: formatCurrency(credSummary.factRevenue) },
        { label: "% выручки", value: formatPercent(creditsRevenuePercent) },
        { label: "Доля план, %", value: formatPercent(credSummary.planShare) },
        { label: "Доля факт, %", value: formatPercent(credSummary.factShare) },
        { label: "% доли", value: formatPercent(creditsSharePercent) },
        { label: "Заявки (факт)", value: String(credSummary.applications ?? "—") },
        { label: "% заявок", value: formatPercent(creditsApplicationsPercent) }
      ])}
      ${renderPdfTable(
        [
          { label: "ТТ", render: (s) => pdfTdPlain(s.name) },
          { label: "Факт, ₽", render: (s) => pdfTdPlain(formatNumber(s.factRevenue)) },
          { label: "Доля, %", render: (s) => pdfTdPlain(formatPercent(s.shareFact)) },
          { label: "Заявки", render: (s) => pdfTdPlain(s.applications) },
          { label: "Кредиты", render: (s) => pdfTdPlain(s.hasCredits ? "Да" : "Нет") }
        ],
        credStores
      )}
      ${renderPdfConclusion(
        "Кредитное направление выполнено выше порога, но рост обеспечен неравномерно. Часть ТТ даёт слабую выдачу и не держит темп по доле и заявкам."
      )}
    </div>
  `;

  const blockFooter = `
  <p class="pdf-conclusion pdf-conclusion--block"><strong>Общий вывод по экономическому блоку:</strong> минимальная цель по всем экономическим показателям по ОЗ — ${formatPercent(minT)}. Ниже — провал блока. Провальные показатели месяца: ${[
    portableSummary.percent < minT ? `портативная техника ${formatPercent(portableSummary.percent)}` : null,
    sellOut.percent < minT ? `Sell Out ${formatPercent(sellOut.percent)}` : null,
    accSummary.totalPercent < minT ? `акс+услуги ${formatPercent(accSummary.totalPercent)}` : null,
    credSummary.percent < minT ? `кредиты ${formatPercent(creditsSummary.percent)}` : null
  ].filter(Boolean).join(", ") || "нет"}. Статус: ${escapeHtml(economicBlockStatusLabel(economic))}.</p>
`;

  return renderPdfSectionShell(
    1,
    "Экономический блок",
    "Портативка, аксы и услуги, кредиты, Sell Out",
    `${portableBlock}${sellOutBlock}${accessoriesBlock}${creditsBlock}${blockFooter}`
  );
}

function renderPdfOperatorSection(reportData) {
  const operator = reportData.operator;
  if (!operator) {
    return renderPdfSectionShell(
      2,
      "Операторский блок",
      "SIM, МНП, золото, upsale, ЯА, ФТП, подписки, ШПД, ЦС",
      `<p class="pdf-muted">Данные операторского блока отсутствуют.</p>`
    );
  }

  const opSimsDelta = (operator.sims?.summary?.percent ?? 0) - (operator.sims?.summary?.prevPercent ?? 0);
  const opMnpDelta = (operator.mnp?.summary?.percent ?? 0) - (operator.mnp?.summary?.prevPercent ?? 0);
  const opGoldDelta = (operator.abonGold?.summary?.percent ?? 0) - (operator.abonGold?.summary?.prevGoldPercent ?? 0);
  const shpdConversionPercent = Math.round(
    planFactCompletionPercent(operator.shpd?.summary?.fact, operator.shpd?.summary?.requests)
  );

  const parts = [
    `<p class="pdf-rule"><strong>Правило зачета блока:</strong> при 10 ТТ: 9–10 ТТ = 1.0, 7–8 ТТ = 0.6, 5–6 ТТ = 0.3, 0–4 ТТ = 0.</p>`
  ];

  const simsStores = operator.sims?.stores || [];
  parts.push(`
    <div class="pdf-subsection">
      <h3 class="pdf-h3">SIM</h3>
      ${renderPdfKpiGrid([
        { label: "План", value: formatNumber(operator.sims?.summary?.plan) },
        { label: "Факт", value: formatNumber(operator.sims?.summary?.fact) },
        { label: "Итог по ОЗ", value: formatPercent(operator.sims?.summary?.percent) },
        { label: "Динамика", value: formatDeltaValue(opSimsDelta) },
        { label: "Конв. план", value: formatPercent(operator.sims?.summary?.convPlan) },
        { label: "Конв. факт", value: formatPercent(operator.sims?.summary?.convFact) },
        { label: "Неактив", value: `${operator.sims?.summary?.inactivePrev ?? "—"} → ${operator.sims?.summary?.inactiveCurrent ?? "—"}` },
        { label: "Неподтв.", value: `${operator.sims?.summary?.unconfirmedPrev ?? "—"} → ${operator.sims?.summary?.unconfirmedCurrent ?? "—"}` }
      ])}
      ${renderPdfTable(
        [
          { label: "ТТ", render: (s) => pdfTdPlain(s.name) },
          { label: "Вып., %", render: (s) => pdfTdPlain(formatPercent(s.percent)) },
          { label: "Конв. план", render: (s) => pdfTdPlain(`${s.convPlan}%`) },
          { label: "Конв. факт", render: (s) => pdfTdPlain(`${s.convFact}%`) },
          { label: "План выполнен", render: (s) => pdfTdPlain(s.metPlan ? "Да" : "Нет") }
        ],
        simsStores
      )}
      ${renderPdfConclusion(
        "Объем по сим-картам просел, но качество работы выросло: конверсия выше, неактив и неподтвержденные снижены."
      )}
    </div>
  `);

  parts.push(`
    <div class="pdf-subsection">
      <h3 class="pdf-h3">МНП</h3>
      ${renderPdfKpiGrid([
        { label: "План", value: formatNumber(operator.mnp?.summary?.plan) },
        { label: "Факт", value: formatNumber(operator.mnp?.summary?.fact) },
        { label: "Итог по ОЗ", value: formatPercent(operator.mnp?.summary?.percent) },
        { label: "Динамика", value: formatDeltaValue(opMnpDelta) },
        { label: "Заявки", value: formatNumber(operator.mnp?.summary?.applications) },
        { label: "Доля заявок от GP", value: formatPercent(operator.mnp?.summary?.applicationsShare) }
      ])}
      ${renderPdfTable(
        [
          { label: "ТТ", render: (s) => pdfTdPlain(s.name) },
          { label: "План", render: (s) => pdfTdPlain(formatNumber(s.plan)) },
          { label: "Заявки, шт", render: (s) => pdfTdPlain(formatNumber(s.requests)) },
          { label: "Факт", render: (s) => pdfTdPlain(formatNumber(s.fact)) },
          {
            label: "Доля заявок",
            render: (s) =>
              pdfTdPlain(
                `${(s.applicationsShare != null ? s.applicationsShare : 0).toLocaleString("ru-RU", {
                  maximumFractionDigits: 1
                })}%`
              )
          },
          { label: "Вып., %", render: (s) => pdfTdPlain(formatPercent(s.percent)) },
          { label: "План выполнен", render: (s) => pdfTdPlain(s.metPlan ? "Да" : "Нет") }
        ],
        operator.mnp?.stores || []
      )}
      ${renderPdfConclusion(
        "Показатель выполнен выше 100%, но часть ТТ не дотягивает до плана. Основной резерв — качество работы с заявками и равномерность по зоне."
      )}
    </div>
  `);

  parts.push(`
    <div class="pdf-subsection">
      <h3 class="pdf-h3">Золото / абонементы</h3>
      ${renderPdfKpiGrid([
        { label: "План", value: formatNumber(operator.abonGold?.summary?.plan) },
        { label: "Факт", value: formatNumber(operator.abonGold?.summary?.fact) },
        { label: "Итог по ОЗ", value: formatPercent(operator.abonGold?.summary?.percent) },
        { label: "Динамика", value: formatDeltaValue(opGoldDelta) },
        { label: "Золотые номера", value: formatNumber(operator.abonGold?.summary?.goldFact) },
        { label: "Абонементы", value: formatNumber(operator.abonGold?.summary?.subscriptionsFact) }
      ])}
      ${renderPdfTable(
        [
          { label: "ТТ", render: (s) => pdfTdPlain(s.name) },
          { label: "План", render: (s) => pdfTdPlain(formatNumber(s.plan)) },
          { label: "Факт", render: (s) => pdfTdPlain(formatNumber(s.fact)) },
          { label: "Золото", render: (s) => pdfTdPlain(formatNumber(s.gold)) },
          { label: "Абонементы", render: (s) => pdfTdPlain(formatNumber(s.subscriptions)) },
          { label: "Вып., %", render: (s) => pdfTdPlain(formatPercent(s.percent)) },
          { label: "План выполнен", render: (s) => pdfTdPlain(s.metPlan ? "Да" : "Нет") }
        ],
        operator.abonGold?.stores || []
      )}
      ${renderPdfConclusion(
        "Результат формально очень сильный, но полностью построен на золотых номерах. Абонементы в текущем периоде не дают вклада и не масштабированы по ОЗ."
      )}
    </div>
  `);

  parts.push(`
    <div class="pdf-subsection">
      <h3 class="pdf-h3">Upsale</h3>
      ${renderPdfKpiGrid([
        { label: "План", value: formatNumber(operator.upsale?.summary?.plan) },
        { label: "Факт", value: formatNumber(operator.upsale?.summary?.fact) },
        { label: "Итог по ОЗ", value: formatPercent(operator.upsale?.summary?.percent) },
        {
          label: "Прошлый период",
          value: operator.upsale?.summary?.prevAllStoresMet ? "Все ТТ выполнили" : "—"
        }
      ])}
      ${renderPdfTable(
        [
          { label: "ТТ", render: (s) => pdfTdPlain(s.name) },
          { label: "Вып., %", render: (s) => pdfTdPlain(formatPercent(s.percent)) },
          { label: "План выполнен", render: (s) => pdfTdPlain(s.metPlan ? "Да" : "Нет") }
        ],
        operator.upsale?.stores || []
      )}
      ${renderPdfConclusion("Upsale провален, выпала большая часть ТТ.")}
    </div>
  `);

  parts.push(`
    <div class="pdf-subsection">
      <h3 class="pdf-h3">ЯА</h3>
      ${renderPdfKpiGrid([
        { label: "План", value: formatNumber(operator.ya?.summary?.plan) },
        { label: "Факт", value: formatNumber(operator.ya?.summary?.fact) },
        { label: "Итог по ОЗ", value: formatPercent(operator.ya?.summary?.percent) },
        {
          label: "Пред. период",
          value: `ТТ с ЯА ≠ 0: ${operator.ya?.summary?.prevZeroNotClosedStores ?? "—"}`
        }
      ])}
      ${renderPdfTable(
        [
          { label: "ТТ", render: (s) => pdfTdPlain(s.name) },
          { label: "Вып., %", render: (s) => pdfTdPlain(formatPercent(s.percent)) },
          { label: "План выполнен", render: (s) => pdfTdPlain(s.metPlan ? "Да" : "Нет") }
        ],
        operator.ya?.stores || []
      )}
      ${renderPdfConclusion("ЯА — один из самых слабых показателей блока, работа крайне неравномерная.")}
    </div>
  `);

  parts.push(`
    <div class="pdf-subsection">
      <h3 class="pdf-h3">ФТП</h3>
      ${renderPdfKpiGrid([
        { label: "План", value: formatNumber(operator.ftp?.summary?.plan) },
        { label: "Факт", value: formatNumber(operator.ftp?.summary?.fact) },
        { label: "Итог по ОЗ", value: formatPercent(operator.ftp?.summary?.percent) },
        {
          label: "Прошлый период",
          value: operator.ftp?.summary?.prevAllStoresMet ? "Все ТТ выполнили" : "—"
        }
      ])}
      ${renderPdfTable(
        [
          { label: "ТТ", render: (s) => pdfTdPlain(s.name) },
          { label: "Вып., %", render: (s) => pdfTdPlain(formatPercent(s.percent)) },
          { label: "План выполнен", render: (s) => pdfTdPlain(s.metPlan ? "Да" : "Нет") }
        ],
        operator.ftp?.stores || []
      )}
      ${renderPdfConclusion("ФТП — один из самых стабильных показателей операторского блока.")}
    </div>
  `);

  parts.push(`
    <div class="pdf-subsection">
      <h3 class="pdf-h3">Подписки</h3>
      ${renderPdfKpiGrid([
        { label: "План", value: formatCurrency(operator.subscriptions?.summary?.plan) },
        { label: "Факт", value: formatCurrency(operator.subscriptions?.summary?.fact) },
        { label: "Итог по ОЗ", value: formatPercent(operator.subscriptions?.summary?.percent) },
        {
          label: "Прошлый период",
          value: operator.subscriptions?.summary?.prevAllStoresMet ? "Все ТТ выполнили" : "—"
        }
      ])}
      ${renderPdfTable(
        [
          { label: "ТТ", render: (s) => pdfTdPlain(s.name) },
          { label: "Вып., %", render: (s) => pdfTdPlain(formatPercent(s.percent)) },
          { label: "План выполнен", render: (s) => pdfTdPlain(s.metPlan ? "Да" : "Нет") }
        ],
        operator.subscriptions?.stores || []
      )}
      ${renderPdfConclusion("Подписки — стабильно сильный и масштабированный показатель.")}
    </div>
  `);

  parts.push(`
    <div class="pdf-subsection">
      <h3 class="pdf-h3">ШПД</h3>
      ${renderPdfKpiGrid([
        { label: "План", value: formatNumber(operator.shpd?.summary?.plan) },
        { label: "Факт", value: formatNumber(operator.shpd?.summary?.fact) },
        { label: "Итог по ОЗ", value: formatPercent(operator.shpd?.summary?.percent) },
        { label: "Прогноз", value: formatPercent(operator.shpd?.summary?.forecast) },
        { label: "Заявки", value: formatNumber(operator.shpd?.summary?.requests) },
        { label: "Конверсия", value: formatPercent(shpdConversionPercent) },
        { label: "Пред. не выполнили", value: String(operator.shpd?.summary?.prevNotMetConnectionsStores ?? "—") }
      ])}
      ${renderPdfTable(
        [
          { label: "ТТ", render: (s) => pdfTdPlain(s.name) },
          { label: "План", render: (s) => pdfTdPlain(formatNumber(s.plan)) },
          { label: "Заявки", render: (s) => pdfTdPlain(formatNumber(s.requests)) },
          { label: "Факт", render: (s) => pdfTdPlain(formatNumber(s.fact)) },
          { label: "Вып., %", render: (s) => pdfTdPlain(formatPercent(s.percent)) },
          { label: "План выполнен", render: (s) => pdfTdPlain(s.metPlan ? "Да" : "Нет") }
        ],
        operator.shpd?.stores || []
      )}
      ${renderPdfConclusion(
        "ШПД в марте ниже минимума. Заявки есть, но конверсия в подключение по части ТТ слабая, из-за чего общий результат проседает."
      )}
    </div>
  `);

  parts.push(`
    <div class="pdf-subsection">
      <h3 class="pdf-h3">ЦС</h3>
      ${renderPdfKpiGrid([
        { label: "План", value: formatCurrency(operator.cs?.summary?.plan) },
        { label: "Факт", value: formatCurrency(operator.cs?.summary?.fact) },
        { label: "Итог по ОЗ", value: formatPercent(operator.cs?.summary?.percent) },
        { label: "Прогноз", value: formatPercent(operator.cs?.summary?.forecast) },
        {
          label: "Пред. период",
          value: operator.cs?.summary?.prevPlanClosed ? "План закрыт" : "—"
        }
      ])}
      ${renderPdfTable(
        [
          { label: "ТТ", render: (s) => pdfTdPlain(s.name) },
          { label: "Факт, ₽", render: (s) => pdfTdPlain(formatNumber(s.fact)) },
          { label: "Вып., %", render: (s) => pdfTdPlain(formatPercent(s.percent)) },
          { label: "План выполнен", render: (s) => pdfTdPlain(s.metPlan ? "Да" : "Нет") }
        ],
        operator.cs?.stores || []
      )}
      ${renderPdfConclusion(
        "ЦС — один из самых проблемных показателей месяца после полного закрытия плана в прошлом периоде."
      )}
    </div>
  `);

  parts.push(`
    <p class="pdf-conclusion pdf-conclusion--block"><strong>Общий вывод по операторскому блоку:</strong> сильные показатели — МНП, ФТП, Подписки, золото. Слабые — сим-карты по объему, Upsale, ЯА, ШПД, ЦС. Результат ряда направлений обеспечен неравномерно, за счет отдельных сильных ТТ.</p>
  `);

  return renderPdfSectionShell(
    2,
    "Операторский блок",
    "SIM, МНП, золото, upsale, ЯА, ФТП, подписки, ШПД, ЦС",
    parts.join("")
  );
}

function renderPdfAdminSection(reportData) {
  const administrative = reportData.administrative;
  if (!administrative) {
    return renderPdfSectionShell(
      3,
      "Административный блок",
      "HR, ВМР, Invoice",
      `<p class="pdf-muted">Данные административного блока отсутствуют.</p>`
    );
  }

  const hr = administrative.hr || {};
  const vmr = administrative.vmr || {};
  const payments = administrative.payments || {};
  const paySummary = payments.summary || {};
  const invoiceTarget = Number(paySummary.bankCardPlanPercent || 25);
  const vmrStores = Array.isArray(vmr.stores) ? vmr.stores : [];
  const payStores = Array.isArray(payments.stores) ? payments.stores : [];

  const hrBlock = `
    <div class="pdf-subsection">
      <h3 class="pdf-h3">HR</h3>
      ${renderPdfKpiGrid([
        { label: "План ШР", value: formatNumber(hr.staffPlan) },
        { label: "Факт ШР", value: formatNumber(hr.staffFact) },
        { label: "% укомплект.", value: formatPercent(hr.staffCompletionPercent) },
        {
          label: "Рекомендации",
          value: `${hr.recommendationFact ?? "—"}/${hr.recommendationPlan ?? "—"} (${formatPercent(hr.recommendationCompletionPercent)})`
        },
        { label: "Стажеры", value: String(hr.traineesCount ?? "—") },
        { label: "Увольняются", value: String(hr.leavingCount ?? "—") }
      ])}
      <p class="pdf-note">В данных отчёта нет явного поля динамики по HR; отображены фактические значения периода.</p>
    </div>
  `;

  const oz = Number(vmr.ozScore);
  const vmrTarget = Number(vmr.target);
  const vmrBlock = `
    <div class="pdf-subsection">
      <h3 class="pdf-h3">ВМР</h3>
      ${renderPdfKpiGrid([
        { label: "Факт по ОЗ", value: oz.toLocaleString("ru-RU", { maximumFractionDigits: 1 }) },
        { label: "Цель", value: String(vmrTarget || "—") },
        {
          label: "Статус",
          value: oz >= vmrTarget ? "Цель достигнута" : "Ниже цели"
        },
        {
          label: "ТТ ниже цели",
          value: String(vmrStores.filter((s) => s.score < vmrTarget).length)
        }
      ])}
      ${renderPdfTable(
        [
          { label: "ТТ", render: (s) => pdfTdPlain(s.name) },
          {
            label: "Оценка",
            render: (s) => pdfTdPlain(`${s.score.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}%`)
          },
          {
            label: "Статус",
            render: (s) =>
              pdfTdPlain(s.score >= vmrTarget ? "В норме / выше цели" : "Ниже цели")
          }
        ],
        vmrStores
      )}
    </div>
  `;

  const invoiceBlock = `
    <div class="pdf-subsection">
      <h3 class="pdf-h3">Invoice</h3>
      ${renderPdfKpiGrid([
        { label: "БК по ОЗ", value: formatPercent(paySummary.bankCardSharePercent) },
        { label: "Цель по БК", value: `≤ ${formatPercent(invoiceTarget)}` },
        { label: "Доля инвойса", value: formatPercent(paySummary.invoiceSharePercent) },
        { label: "Инвойс, ₽", value: formatCurrency(paySummary.invoiceRub) },
        { label: "Наличные", value: formatPercent(paySummary.cashSharePercent) }
      ])}
      ${renderPdfTable(
        [
          { label: "ТТ", render: (s) => pdfTdPlain(s.name) },
          {
            label: "Инвойс, %",
            render: (s) => pdfTdPlain(`${s.invoicePercent.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`)
          },
          { label: "Инвойс, ₽", render: (s) => pdfTdPlain(formatNumber(s.invoiceRub)) },
          {
            label: "Наличные, %",
            render: (s) => pdfTdPlain(`${s.cashPercent.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`)
          },
          {
            label: "БК, %",
            render: (s) => pdfTdPlain(`${s.bankCardPercent.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`)
          },
          {
            label: "Статус",
            render: (s) => pdfTdPlain(pdfInvoiceStatusText(s.bankCardPercent, invoiceTarget))
          }
        ],
        payStores
      )}
      ${payments.description ? `<p class="pdf-note">${escapeHtml(payments.description)}</p>` : ""}
    </div>
  `;

  const adminFooter = `
    <p class="pdf-conclusion pdf-conclusion--block"><strong>Общий вывод по административному блоку:</strong> HR и ВМР отражают текущее состояние штата и визуального мерчандайзинга; по Invoice важно удерживать долю банковских карт в целевом коридоре и контролировать ТТ с повышенной долей инвойса.</p>
  `;

  return renderPdfSectionShell(
    3,
    "Административный блок",
    "HR, ВМР, Invoice",
    `${hrBlock}${vmrBlock}${invoiceBlock}${adminFooter}`
  );
}

function renderPdfFocusSection(reportData) {
  const focus = reportData.focus || {};
  const march = Array.isArray(focus.march) ? focus.march : [];
  const april = Array.isArray(focus.april) ? focus.april : [];

  const listOrFallback = (items, emptyMsg) => {
    if (!items.length) {
      return `<p class="pdf-muted">${escapeHtml(emptyMsg)}</p>`;
    }
    return `<ul class="pdf-list">${items.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>`;
  };

  const body = `
    <div class="pdf-subsection">
      <h3 class="pdf-h3">Приоритеты (текущий месяц)</h3>
      ${listOrFallback(march, "Список приоритетов не задан.")}
    </div>
    <div class="pdf-subsection">
      <h3 class="pdf-h3">Цели на следующий месяц</h3>
      ${listOrFallback(april, "Список целей не задан.")}
    </div>
    ${renderPdfConclusion(
      "Фокусные цели задают вектор работы зоны: закрытие слабых направлений и масштабирование успешных практик по ТТ."
    )}
  `;

  return renderPdfSectionShell(
    4,
    "Фокусные цели",
    "Приоритеты на текущий и следующий месяц",
    body
  );
}

function buildPdfHtml() {
  const reportData = typeof data !== "undefined" && data ? data : {};
  const docTitle = reportData.meta?.title || "Отчёт";
  const inner = [
    renderPdfCover(reportData),
    renderPdfEconomicSection(reportData),
    renderPdfOperatorSection(reportData),
    renderPdfAdminSection(reportData),
    renderPdfFocusSection(reportData)
  ].join("");
  return `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(
    docTitle
  )}</title>${getPdfDocumentStyles()}</head><body class="pdf-body">${inner}</body></html>`;
}

function bindPdfButton() {
  const button = document.getElementById("downloadPdfBtn");
  if (!button) return;
  if (button.dataset.bound === "1") return;

  button.dataset.bound = "1";

  button.addEventListener("click", () => {
    const win = window.open("", "_blank");
    if (!win) {
      window.alert("Не удалось открыть окно печати. Разрешите всплывающие окна для этого сайта.");
      return;
    }

    const html = buildPdfHtml();
    win.document.open();
    win.document.write(html);
    win.document.close();

    const printWhenReady = () => {
      try {
        win.focus();
        win.print();
      } catch (e) {
        console.error(e);
      }
    };

    if (win.document.readyState === "complete") {
      setTimeout(printWhenReady, 300);
    } else {
      win.addEventListener("load", () => setTimeout(printWhenReady, 300));
    }
  });
}

bindPdfButton();