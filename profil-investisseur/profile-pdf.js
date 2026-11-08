const scale = 3;
const fontFamily = 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif';
const gold = "#f7da89";
const white = "#fff";
const muted = "rgba(255, 255, 255, .72)";
const faint = "rgba(255, 255, 255, .52)";
const line = "rgba(255, 255, 255, .16)";

function wrapText(context, text, maxWidth) {
  const lines = [];
  let row = "";
  for (const word of text.trim().split(/\s+/u)) {
    const next = row ? row + " " + word : word;
    if (context.measureText(next).width <= maxWidth) {
      row = next;
      continue;
    }
    if (row) lines.push(row);
    row = "";
    for (const character of word) {
      if (row && context.measureText(row + character).width > maxWidth) {
        lines.push(row);
        row = "";
      }
      row += character;
    }
  }
  if (row) lines.push(row);
  return lines;
}

export async function drawProfileCard(card) {
  const logo = card.querySelector("img");
  const content = selector => card.querySelector(selector).textContent.trim();
  const nameElement = card.querySelector(".capture-name");
  const nameDirection = getComputedStyle(nameElement).direction;
  const name = nameElement.textContent;
  const brand = content(".capture-brand strong");
  const subtitle = content(".capture-brand p");
  const kicker = content("#capture-kicker");
  const profile = content(".capture-profile");
  const goalsHeading = content(".capture-goals-heading h4");
  const goalLabel = content(".primary-objective .objective-label");
  const goal = content(".capture-project");
  const otherGoalsLabel = content(".other-goals .objective-label");
  const otherGoals = Array.from(card.querySelectorAll(".other-goals li"), item => item.textContent);
  const scoreKicker = content(".capture-score .next-label");
  const scoreLabel = content(".capture-score h4");
  const score = content("#capture-gauge strong");
  const scoreMax = content("#capture-gauge span");
  const scoreFill = Number.parseFloat(card.querySelector("#capture-gauge").style.getPropertyValue("--qi-fill")) / 100;
  const scoreCaption = content("#capture-score-caption");
  const next = content(".capture-next strong");
  const details = content("#capture-details");
  const footer = content(".capture-meta");

  const fontText = [brand, subtitle, kicker, name, profile, goalsHeading, goalLabel, goal, otherGoalsLabel, ...otherGoals, scoreKicker, scoreLabel, score, scoreMax, scoreCaption, next, details, footer].join(" ");
  await Promise.all([
    logo.decode(),
    ...[400, 500, 600].map(weight => document.fonts.load(weight + " 16px Inter", fontText)),
  ]);

  const width = Math.min(412, Math.max(268, document.documentElement.clientWidth - 52));
  const padding = 17;
  const right = width - padding;
  const usable = right - padding;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Measure the rows before sizing the card, then use that layout for both outputs.
  const draw = [];
  const font = (size, weight) => weight + " " + size + "px " + fontFamily;
  function block(value, x, top, {
    size, weight = 400, leading = size * 1.5, color = white, maxWidth = right - x, direction = "ltr",
  }) {
    context.font = font(size, weight);
    const lines = wrapText(context, value, maxWidth);
    draw.push(() => {
      context.font = font(size, weight);
      context.fillStyle = color;
      context.direction = direction;
      context.textAlign = direction === "rtl" ? "right" : "left";
      context.textBaseline = "middle";
      const start = direction === "rtl" ? x + maxWidth : x;
      lines.forEach((line, index) => context.fillText(line, start, top + (index + .5) * leading));
    });
    return top + lines.length * leading;
  }

  function box(x, y, w, h, radius, stroke, fill) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + w, y, x + w, y + h, radius);
    context.arcTo(x + w, y + h, x, y + h, radius);
    context.arcTo(x, y + h, x, y, radius);
    context.arcTo(x, y, x + w, y, radius);
    context.closePath();
    if (fill) {
      context.fillStyle = fill;
      context.fill();
    }
    context.strokeStyle = stroke;
    context.stroke();
  }

  function divider(y) {
    draw.push(() => {
      context.fillStyle = line;
      context.fillRect(padding, y, usable, 1);
    });
  }

  function icon(pathId, x, top) {
    const path = new Path2D(document.getElementById(pathId).getAttribute("d"));
    draw.push(() => {
      box(x, top, 26, 26, 7, "rgba(247, 218, 137, .23)", "rgba(247, 218, 137, .08)");
      context.save();
      context.translate(x + 5, top + 5);
      context.scale(16 / 24, 16 / 24);
      context.strokeStyle = gold;
      context.lineWidth = 1.6;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.stroke(path);
      context.restore();
    });
  }

  draw.push(() => context.drawImage(logo, padding, padding, 35, 35 * logo.naturalHeight / logo.naturalWidth));
  const brandEnd = block(brand, padding + 44, padding, { size: 13, weight: 600 });
  block(subtitle, padding + 44, brandEnd, { size: 11, color: faint });
  divider(63);

  let y = block(kicker.toLocaleUpperCase("fr"), padding, 76, { size: 10.5, weight: 600, color: gold });
  y = block(name, padding, y + 4, { size: 14, weight: 600, direction: nameDirection });
  y = block(profile, padding, y + 2, { size: 37, weight: 500, leading: 40, color: "#edf1f9" });

  const goalsTop = y + 12;
  icon("goal-icon-path", padding, goalsTop);
  block(goalsHeading, padding + 34, goalsTop + 3, { size: 14, weight: 600, leading: 20 });
  const goalTop = goalsTop + 34;
  const goalDrawStart = draw.length;
  y = block(goalLabel.toLocaleUpperCase("fr"), padding + 15, goalTop + 9, { size: 11, weight: 600, color: gold });
  y = block(goal, padding + 15, y + 3, { size: 15, weight: 600, color: "#fff4d9", maxWidth: usable - 27 }) + 10;
  const goalHeight = y - goalTop;
  draw.splice(goalDrawStart, 0, () => {
    const tint = context.createLinearGradient(padding, goalTop, right, goalTop);
    tint.addColorStop(0, "rgba(247, 218, 137, .12)");
    tint.addColorStop(1, "rgba(247, 218, 137, .035)");
    box(padding, goalTop, usable, goalHeight, 10, "rgba(247, 218, 137, .33)", tint);
    box(padding + 1, goalTop + 7, 2, goalHeight - 14, 1, gold, gold);
  });

  if (otherGoals.length) {
    y = block(otherGoalsLabel.toLocaleUpperCase("fr"), padding, y + 12, { size: 11, weight: 600, color: muted }) + 7;
    let x = padding;
    let rowHeight = 0;
    for (const value of otherGoals) {
      context.font = font(13, 400);
      const chipWidth = Math.min(usable, Math.ceil(context.measureText(value).width) + 28);
      if (x + chipWidth > right) {
        x = padding;
        y += rowHeight + 6;
        rowHeight = 0;
      }
      const chipX = x;
      const chipY = y;
      const chipDrawStart = draw.length;
      const chipTextBottom = block(value, x + 18, y + 3, {
        size: 13, leading: 20, color: "#e3eaf6", maxWidth: chipWidth - 26,
      });
      const chipHeight = chipTextBottom + 3 - y;
      draw.splice(chipDrawStart, 0, () => {
        box(chipX, chipY, chipWidth, chipHeight, 6, "rgba(202, 215, 239, .24)", "rgba(202, 215, 239, .06)");
        context.beginPath();
        context.arc(chipX + 9, chipY + 13, 1.75, 0, 2 * Math.PI);
        context.fillStyle = gold;
        context.fill();
      });
      rowHeight = Math.max(rowHeight, chipHeight);
      x += chipWidth + 6;
    }
    y += rowHeight;
  }

  const scoreTop = y + 13;
  const scoreDrawStart = draw.length;
  const gaugeRadius = 31;
  const gaugeX = right - gaugeRadius - 13;
  const scoreTextWidth = gaugeX - gaugeRadius - padding - 22;
  y = block(scoreKicker.toLocaleUpperCase("fr"), padding + 12, scoreTop + 12, { size: 9.5, weight: 600, color: gold, maxWidth: scoreTextWidth });
  y = block(scoreLabel, padding + 12, y + 3, { size: 15, weight: 600, color: "#f8f5ed", maxWidth: scoreTextWidth });
  y = block(scoreCaption, padding + 12, y + 4, { size: 11, color: "#d0d9e8", maxWidth: scoreTextWidth }) + 12;
  y = Math.max(y, scoreTop + 2 * gaugeRadius + 25);
  const scoreHeight = y - scoreTop;
  const gaugeY = scoreTop + scoreHeight / 2;

  draw.splice(scoreDrawStart, 0, () => {
    const tint = context.createLinearGradient(padding, scoreTop, right, scoreTop + scoreHeight);
    tint.addColorStop(0, "#101728");
    tint.addColorStop(1, "#202635");
    box(padding, scoreTop, usable, scoreHeight, 10, "rgba(247, 218, 137, .28)", tint);
  });
  draw.push(() => {
    const topAngle = -Math.PI / 2;
    context.save();
    context.beginPath();
    context.arc(gaugeX, gaugeY, gaugeRadius, 0, 2 * Math.PI);
    context.fillStyle = "#101728";
    context.fill();
    context.lineWidth = 3.5;
    context.strokeStyle = "#394353";
    context.stroke();
    if (scoreFill > 0) {
      const goldTone = context.createLinearGradient(gaugeX + gaugeRadius, gaugeY - gaugeRadius, gaugeX - gaugeRadius, gaugeY + gaugeRadius);
      goldTone.addColorStop(0, gold);
      goldTone.addColorStop(1, "#dfaf63");
      context.beginPath();
      const startAngle = scoreFill === 1 ? 0 : topAngle;
      context.arc(gaugeX, gaugeY, gaugeRadius, startAngle, startAngle + 2 * Math.PI * scoreFill);
      context.strokeStyle = goldTone;
      context.stroke();
    }

    context.direction = "ltr";
    context.textAlign = "left";
    context.textBaseline = "alphabetic";
    context.font = font(23, 600);
    const pointsWidth = context.measureText(score).width;
    context.font = font(9, 400);
    const maxWidth = context.measureText(scoreMax).width;
    const start = gaugeX - (pointsWidth + maxWidth + 2) / 2;
    context.fillStyle = "#c0cadb";
    context.fillText(scoreMax, start + pointsWidth + 2, gaugeY + 6);
    context.fillStyle = gold;
    context.font = font(23, 600);
    context.fillText(score, start, gaugeY + 6);
    context.restore();
  });

  divider(y + 11);
  const liveTop = y + 20;
  icon("live-icon-path", padding, liveTop + 3);
  y = block(next, padding + 34, liveTop, { size: 12, weight: 600, color: gold });
  y = block(details, padding + 34, y + 1, { size: 12, color: muted });
  y = block(footer, padding, y + 8, { size: 10, color: muted });

  const height = Math.ceil(y) + padding;
  canvas.width = width * scale;
  canvas.height = height * scale;
  context.scale(scale, scale);
  context.fillStyle = "#080d19";
  context.fillRect(0, 0, width, height);
  const background = context.createRadialGradient(width * .8, height, 0, width * .8, height, height * .62);
  background.addColorStop(0, "#111d38");
  background.addColorStop(1, "#090e1a");
  box(.5, .5, width - 1, height - 1, 12, "rgba(247, 218, 137, .3)", background);
  draw.forEach(paint => paint());
  return canvas;
}

export async function createProfilePdf(cardImage) {
  const { PDFDocument } = await import("./assets/pdf/pdf-lib.esm.min.js");
  const doc = await PDFDocument.create();
  doc.setTitle("Ma fiche de profil · Challenge S’investir");
  doc.setAuthor("S’investir");
  doc.setLanguage("fr-FR");

  const width = cardImage.width / scale;
  const height = cardImage.height / scale;
  const page = doc.addPage([width, height]);
  const image = await doc.embedPng(cardImage.toDataURL("image/png"));
  page.drawImage(image, { x: 0, y: 0, width, height });
  return doc.save();
}
