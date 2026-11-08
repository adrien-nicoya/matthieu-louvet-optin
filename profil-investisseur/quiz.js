const profiles = ["Prudent", "Équilibré", "Dynamique"];

const firstNameQuestion = {
  id: "name",
  topic: "Votre prénom",
  title: "Pour commencer, quel est votre prénom ?",
};

const goalsQuestion = {
  id: "goals",
  topic: "Vos objectifs",
  title: "Quels sont vos objectifs d’investissement ?",
  help: "Plusieurs réponses possibles.",
  options: [
    { label: "Faire fructifier mon épargne" },
    { label: "Me créer un revenu complémentaire" },
    { label: "Préparer un achat important" },
    { label: "Préparer ma retraite" },
    { label: "Protéger ma famille ou transmettre" },
    { label: "Un autre objectif" },
  ],
};

const priorityQuestion = {
  id: "project",
  topic: "Votre priorité",
  title: "Quel objectif compte le plus pour vous aujourd’hui ?",
};

const [contractACapital, contractBCapital] = [0.005, 0.02].map(annualFee =>
  Math.round(100_000 * ((1 + 0.07) * (1 - annualFee)) ** 20).toLocaleString("fr-FR")
);

const questions = [
  {
    id: "experience",
    topic: "Vos placements",
    title: "Avez-vous déjà investi ?",
    options: [
      { label: "Je n’ai encore aucun placement" },
      { label: "J’ai uniquement de l’épargne sur des livrets" },
      { label: "Oui, par exemple en actions, en ETF ou en immobilier" },
      { label: "Je préfère passer" },
    ],
  },
  {
    id: "intuition",
    topic: "Votre intuition",
    title: "Spontanément, quel profil d’investisseur pensez-vous avoir ?",
    options: [
      { label: "Prudent" },
      { label: "Équilibré" },
      { label: "Dynamique" },
      { label: "Je ne sais pas encore" },
    ],
  },
  {
    id: "horizon",
    topic: "Votre horizon",
    title: "Quand pourriez-vous avoir besoin de cet argent ?",
    options: [
      {
        label: "Moins de 3 ans",
        level: 0,
      },
      {
        label: "3 à 9 ans",
        level: 1,
      },
      { label: "10 à 19 ans", level: 2 },
      { label: "20 ans ou plus", level: 2 },
      {
        label: "Je ne sais pas encore",
        level: 1,
        uncertain: true,
      },
    ],
  },
  {
    id: "reaction",
    topic: "Votre réaction",
    title: "Votre placement de 10 000 € vaut désormais 8 000 €. Que faites-vous ?",
    options: [
      {
        label: "Je vends tout",
        level: 0,
      },
      {
        label: "Je vends une partie",
        level: 1,
      },
      {
        label: "Je laisse la somme investie",
        level: 2,
      },
      {
        label: "Je ne sais pas ce que je ferais",
        level: 1,
        uncertain: true,
      },
    ],
  },
  {
    id: "impact",
    topic: "Votre marge de manœuvre",
    title: "En cas d’imprévu, auriez-vous besoin de toucher à cet argent ?",
    options: [
      {
        label: "Oui, c’est ma principale réserve",
        level: 0,
      },
      {
        label: "Peut-être, j’ai un peu d’épargne à côté",
        level: 1,
      },
      {
        label: "Non, j’ai une réserve à part",
        level: 2,
      },
      {
        label: "Je ne sais pas encore",
        level: 1,
        uncertain: true,
      },
    ],
  },
  {
    id: "recovery",
    topic: "Score Investisseur · Après la baisse",
    title: "Votre portefeuille perd 20 % de sa valeur. De combien doit-il progresser pour retrouver exactement son niveau initial ?",
    scene: [
      { label: "Avant la baisse", value: "100 000 €" },
      { label: "Après −20 %", value: "80 000 €" },
    ],
    options: [
      { label: "+20 %" },
      { label: "+25 %", correct: true },
      { label: "+40 %" },
      { label: "Je ne sais pas" },
    ],
    reveal: {
      title: "Il faut une hausse de 25 %.",
      body: "Si 100 000 € deviennent 80 000 €, il faut récupérer 20 000 €. Cette somme représente 25 % des 80 000 € restants. C’est l’asymétrie des pertes. La baisse se calcule sur le montant de départ, la hausse sur le montant restant.",
      summary: "25 % pour revenir au départ",
    },
  },
  {
    id: "overlap",
    topic: "Score Investisseur · La diversification",
    title: "Vous détenez un ETF MSCI World et vous ajoutez un ETF S&P 500 pour mieux diversifier votre portefeuille. Est-ce une bonne idée ?",
    scene: [
      { label: "Vous avez déjà", value: "ETF MSCI World" },
      { label: "Vous ajoutez", value: "ETF S&P 500" },
    ],
    options: [
      { label: "Oui, deux ETF offrent deux fois plus de diversification" },
      { label: "Pas nécessairement, car de nombreuses entreprises figurent dans les deux indices", correct: true },
      { label: "Oui, s’ils sont détenus dans deux enveloppes différentes, par exemple un PEA et une assurance-vie" },
      { label: "Je ne sais pas" },
    ],
    reveal: {
      title: "Le MSCI World et le S&P 500 ont de nombreuses entreprises en commun.",
      body: "Les grandes entreprises américaines pèsent déjà lourd dans le MSCI World. En ajoutant un ETF S&P 500, vous renforcez surtout une exposition que vous aviez déjà. Dans votre portefeuille, les mêmes entreprises peuvent donc peser davantage.",
      summary: "Le MSCI World et le S&P 500 se recoupent",
    },
  },
  {
    id: "fees",
    topic: "Score Investisseur · Les frais",
    title: "Au bout de 20 ans, quel sera l’écart de capital entre les deux contrats d’assurance-vie ?",
    sceneCaption: "Vous investissez 100 000 € sur les mêmes supports dans les deux contrats, avec un rendement de 7 % par an avant frais.",
    scene: [
      { label: "Frais du contrat A", value: "0,5 % par an" },
      { label: "Frais du contrat B", value: "2 % par an" },
    ],
    options: [
      { label: "Environ 30 000 €" },
      { label: "Environ 64 500 €" },
      { label: "Environ 91 700 €", correct: true },
      { label: "Je ne sais pas" },
    ],
    reveal: {
      title: "Environ 91 700 € de moins avec le contrat B.",
      body: `En supposant que les frais sont prélevés en fin d’année, après le rendement, le contrat A atteint environ ${contractACapital} € et le contrat B ${contractBCapital} €. Chaque euro prélevé cesse de produire des gains les années suivantes. Plus l’écart de frais dure, plus il pèse sur le capital final.`,
      note: "Simulation illustrative avec frais prélevés annuellement sur l’encours après rendement, hors fiscalité, inflation et autres frais éventuels. Rendement constant hypothétique et non garanti.",
      summary: "Environ 91 700 € d’écart sur 20 ans",
    },
  },
  {
    id: "pastPerformance",
    topic: "Score Investisseur · Le piège des performances passées",
    title: "Vous devez choisir entre deux fonds. Sur les cinq dernières années, le premier a rapporté 12 % par an en moyenne et le second 7 %. Lequel privilégier ?",
    scene: [
      { label: "Premier fonds", value: "12 % par an" },
      { label: "Second fonds", value: "7 % par an" },
    ],
    options: [
      { label: "Le premier, puisqu’il a démontré qu’il était plus performant" },
      { label: "Le second, puisqu’il présente forcément moins de risques" },
      { label: "Impossible de trancher avec ces seules informations", correct: true },
      { label: "Je ne sais pas" },
    ],
    reveal: {
      title: "Ces chiffres ne suffisent pas pour choisir.",
      body: "Le premier fonds a peut-être pris plus de risques, concentré ses investissements ou profité d’un secteur favorable. Comparer les rendements seuls, c’est comparer la vitesse de pointe de deux voitures en oubliant leur tenue de route. Regardez aussi les risques, les frais et les actifs détenus.",
      summary: "Les performances passées ne suffisent pas",
    },
  },
  {
    id: "buyingPower",
    topic: "Score Investisseur · L’inflation",
    title: "Votre placement rapporte 3 % sur un an, tandis que les prix augmentent de 4 %. Votre capital a augmenté en euros. Votre pouvoir d’achat a-t-il augmenté ?",
    scene: [
      { label: "Rendement du placement", value: "+3 % en un an" },
      { label: "Inflation (hausse des prix)", value: "+4 % en un an" },
    ],
    options: [
      { label: "Oui, puisque votre capital a progressé de 3 %" },
      { label: "Il est resté identique puisque vous n’avez rien retiré" },
      { label: "Non, votre capital permet d’acheter moins qu’auparavant", correct: true },
      { label: "Je ne sais pas" },
    ],
    reveal: {
      title: "Votre pouvoir d’achat baisse.",
      body: "Votre relevé peut afficher plus d’euros alors que votre pouvoir d’achat baisse. Vous avez 103 € là où vous aviez 100 €, alors que les mêmes achats coûtent maintenant 104 €. Une fois la hausse des prix prise en compte, le rendement réel est d’environ −0,96 %.",
      summary: "−0,96 % de rendement réel",
    },
  },
];

const profileQuestions = questions.filter(question => !question.reveal);
const declicQuestions = questions.filter(question => question.reveal);
const questionById = Object.fromEntries(questions.map(question => [question.id, question]));
const disclaimer = "Quiz pédagogique uniquement. Profil indicatif lié à l’objectif choisi. Les montants du quiz sont fictifs. Les placements exposés aux marchés comportent un risque de perte en capital.";
const analysisDuration = 3300;
const analysisStages = [
  "Lecture de votre horizon…",
  "Analyse de votre réaction…",
  "Examen de votre réserve…",
  "Calcul de votre profil…",
];

function selectedOption(id, responses) {
  return questionById[id].options[responses[id]];
}

function assessProfile(responses) {
  const riskFactors = ["impact", "horizon", "reaction"].map(id => selectedOption(id, responses));
  const level = Math.min(...riskFactors.map(option => option.level));

  return {
    level,
    label: profiles[level],
    provisional: riskFactors.some(option => option.uncertain),
  };
}

const intro = document.getElementById("intro");
const flow = document.getElementById("flow");
const startButton = document.getElementById("start");
const questionScreen = document.getElementById("question-screen");
const questionTitle = document.getElementById("question-title");
const firstNameForm = document.getElementById("first-name-form");
const firstNameInput = document.getElementById("first-name");
const questionHelp = document.getElementById("question-help");
const questionScene = document.getElementById("question-scene");
const sceneCaption = document.getElementById("scene-caption");
const sceneTiles = document.getElementById("scene-tiles");
const mobileContext = document.getElementById("mobile-context");
const answerList = document.getElementById("answers");
const dossier = document.getElementById("dossier");
const stepCount = document.getElementById("step-count");
const stepTopic = document.getElementById("step-topic");
const progress = document.getElementById("progress");
const feedback = document.getElementById("feedback");
const feedbackTitle = document.getElementById("feedback-title");
const feedbackBody = document.getElementById("feedback-body");
const answerInstruction = document.getElementById("answer-instruction");
const continueButton = document.getElementById("continue");
const analysisScreen = document.getElementById("analysis-screen");
const analysisTitle = document.getElementById("analysis-title");
const analysisStatus = document.getElementById("analysis-status");
const analysisProgress = document.getElementById("analysis-progress");
const analysisPercent = document.getElementById("analysis-percent");
const analysisFactors = Array.from(document.getElementById("analysis-factors").children);
const resultScreen = document.getElementById("result-screen");
const resultTitle = document.getElementById("result-title");
const resultKicker = document.getElementById("result-kicker");
const resultProject = document.getElementById("result-project");
const riskScale = document.getElementById("risk-scale");
const initialProfile = document.getElementById("initial-profile");
const otherGoalSections = [
  document.getElementById("other-goals"),
  document.getElementById("capture-other-goals"),
];
const answerReview = document.getElementById("answer-review");
const captureDialog = document.getElementById("capture-dialog");
const captureImage = document.getElementById("capture-image");
const captureCard = captureDialog.querySelector(".capture-card");
const downloadLink = document.getElementById("download-pdf");
const downloadStatus = document.getElementById("download-status");
const retryPdf = document.getElementById("retry-pdf");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const selectedGoals = new Set();
let firstName = "";
let declicAnswers = {};
let priorityGoal;
let responses = {};
let step = -1;
let advancing = false;
let skipDeclics = false;
let currentResult;
let pdfUrl;

function goalsInOrder() {
  return goalsQuestion.options.filter(option => selectedGoals.has(option));
}

function currentSteps() {
  const priority = selectedGoals.size > 1 ? [{ ...priorityQuestion, options: goalsInOrder() }] : [];
  return [firstNameQuestion, goalsQuestion, ...priority, ...(skipDeclics ? profileQuestions : questions)];
}

function setPriority(option) {
  if (priorityGoal !== option) responses = {};
  priorityGoal = option;
}

function focusScreen(heading) {
  window.scrollTo(0, 0);
  heading.focus({ preventScroll: true });
}

function updateDossier(steps) {
  const entries = steps.map((question, index) => {
    const entry = document.createElement("div");
    entry.className = "dossier-entry";
    if (index === step) entry.setAttribute("aria-current", "step");

    const title = document.createElement("dt");
    title.textContent = question.topic;
    const response = document.createElement("dd");
    if (index < step) {
      if (question === firstNameQuestion) {
        response.textContent = firstName;
      } else if (question.id === "goals") {
        response.textContent = goalsInOrder().map(option => option.label).join(" · ");
      } else if (question.id === "project") {
        response.textContent = priorityGoal.label;
      } else if (question.reveal) {
        response.textContent = question.reveal.summary;
      } else {
        response.textContent = selectedOption(question.id, responses).label;
      }
    }
    entry.append(title, response);
    return entry;
  });
  dossier.replaceChildren(...entries);
}

function showStepDetails(steps) {
  const question = steps[step];
  stepCount.textContent = "Étape " + (step + 1) + " sur " + steps.length;
  stepTopic.textContent = question.reveal
    ? "Mini-défi " + (declicQuestions.indexOf(question) + 1) + " sur " + declicQuestions.length
    : question.topic;
  mobileContext.textContent = priorityGoal && profileQuestions.includes(question) ? priorityGoal.label : "Quiz investisseur";
  progress.max = steps.length;
  progress.value = step;
  updateDossier(steps);
}

function isSelected(question, option, choiceIndex) {
  if (question.id === "goals") return selectedGoals.has(option);
  if (question.id === "project") return priorityGoal === option;
  return (question.reveal ? declicAnswers : responses)[question.id] === choiceIndex;
}

function showExplanation(element, { body, note }) {
  element.textContent = body;
  if (note) {
    const footnote = document.createElement("small");
    footnote.textContent = note;
    element.append("\n\n", footnote);
  }
}

function updateFeedback(question) {
  const chosenIndex = declicAnswers[question.id];
  const choice = question.options[chosenIndex];
  answerList.classList.add("is-locked");
  for (const [index, button] of Array.from(answerList.children).entries()) {
    const correct = Boolean(question.options[index].correct);
    button.disabled = true;
    button.setAttribute("aria-pressed", String(index === chosenIndex));
    button.removeAttribute("aria-keyshortcuts");
    button.toggleAttribute("data-correct", correct);
    button.toggleAttribute("data-incorrect", index === chosenIndex && !correct && choice.label !== "Je ne sais pas");
    if (correct || index === chosenIndex) {
      const badge = document.createElement("span");
      badge.className = "answer-state";
      badge.textContent = correct ? "Bonne réponse" : "Votre réponse";
      button.append(badge);
    }
  }
  feedbackTitle.textContent = (choice.correct ? "Bien vu. " : "") + question.reveal.title;
  showExplanation(feedbackBody, question.reveal);
  answerInstruction.hidden = true;
  feedback.hidden = false;
  continueButton.hidden = false;
  progress.value = step + 1;
}

function showScene(question) {
  questionScene.hidden = !question.scene;
  sceneCaption.textContent = question.sceneCaption || "";
  sceneCaption.hidden = !question.sceneCaption;
  sceneTiles.replaceChildren(...(question.scene || []).map(({ label, value }) => {
    const tile = document.createElement("div");
    tile.className = "scene-tile";
    const caption = document.createElement("span");
    caption.textContent = label;
    const number = document.createElement("strong");
    number.textContent = value;
    tile.append(caption, number);
    return tile;
  }));
}

function showQuestion(index) {
  step = index;
  const steps = currentSteps();
  const question = steps[index];
  const asksName = question === firstNameQuestion;
  const multiple = question.id === "goals";

  showStepDetails(steps);
  questionTitle.textContent = question.title;
  firstNameForm.hidden = !asksName;
  answerList.hidden = asksName;
  if (asksName) {
    firstNameInput.value = firstName;
    firstNameInput.setCustomValidity("");
  }
  questionHelp.textContent = question.help || "";
  questionHelp.hidden = !question.help;
  showScene(question);
  answerList.classList.toggle("multi-answers", multiple);
  answerList.classList.remove("is-locked");
  const descriptions = [
    question.help && "question-help",
    question.scene && "question-scene",
    question.reveal && "answer-instruction",
  ].filter(Boolean);
  if (descriptions.length) answerList.setAttribute("aria-describedby", descriptions.join(" "));
  else answerList.removeAttribute("aria-describedby");
  feedback.hidden = true;
  answerInstruction.hidden = !question.reveal;
  continueButton.type = asksName ? "submit" : "button";
  continueButton.hidden = !asksName && !multiple;
  continueButton.disabled = multiple && selectedGoals.size === 0;

  const buttons = (question.options ?? []).map((option, choiceIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";
    button.setAttribute("aria-pressed", String(isSelected(question, option, choiceIndex)));
    button.setAttribute("aria-keyshortcuts", String(choiceIndex + 1));

    if (multiple) {
      const mark = document.createElement("span");
      mark.className = "answer-mark";
      mark.setAttribute("aria-hidden", "true");
      button.append(mark);
    }

    const label = document.createElement("span");
    label.textContent = option.label;
    const shortcut = document.createElement("kbd");
    shortcut.textContent = choiceIndex + 1;
    shortcut.setAttribute("aria-hidden", "true");
    button.append(label, shortcut);

    if (!multiple) {
      const arrow = document.createElement("span");
      arrow.className = "answer-arrow";
      arrow.textContent = "→";
      arrow.setAttribute("aria-hidden", "true");
      button.append(arrow);
    }

    button.addEventListener("click", () => chooseAnswer(choiceIndex));
    return button;
  });

  answerList.replaceChildren(...buttons);
  if (question.reveal && declicAnswers[question.id] !== undefined) updateFeedback(question);
  intro.hidden = true;
  flow.hidden = false;
  resultScreen.hidden = true;
  questionScreen.hidden = false;
  focusScreen(questionTitle);
}

function setAnswer(question, choiceIndex) {
  if (responses[question.id] === choiceIndex) return;
  for (const nextQuestion of currentSteps().slice(step + 1)) delete responses[nextQuestion.id];
  responses[question.id] = choiceIndex;
}

function advance() {
  const next = step + 1;
  if (next === currentSteps().length) showAnalysis();
  else showQuestion(next);
}

function chooseAnswer(choiceIndex) {
  if (advancing) return;
  const question = currentSteps()[step];
  const option = question.options[choiceIndex];
  const button = answerList.children[choiceIndex];

  if (question.id === "goals") {
    if (selectedGoals.has(option)) selectedGoals.delete(option);
    else selectedGoals.add(option);
    button.setAttribute("aria-pressed", String(selectedGoals.has(option)));
    continueButton.disabled = selectedGoals.size === 0;
    showStepDetails(currentSteps());
    return;
  }

  if (question.reveal) {
    if (declicAnswers[question.id] !== undefined) return;
    declicAnswers[question.id] = choiceIndex;
    updateFeedback(question);
    feedbackTitle.focus({ preventScroll: true });
    continueButton.scrollIntoView({ block: "nearest" });
    return;
  }

  if (question.id === "project") setPriority(option);
  else setAnswer(question, choiceIndex);

  for (const [index, choice] of Array.from(answerList.children).entries()) {
    choice.setAttribute("aria-pressed", String(index === choiceIndex));
  }

  advancing = true;
  window.setTimeout(() => {
    advancing = false;
    advance();
  }, reducedMotion.matches ? 0 : 160);
}

function resetPdf() {
  if (pdfUrl) URL.revokeObjectURL(pdfUrl);
  pdfUrl = undefined;
  captureImage.hidden = true;
  captureImage.replaceChildren();
  downloadLink.hidden = true;
  downloadLink.removeAttribute("href");
  retryPdf.hidden = true;
  downloadStatus.textContent = "";
}

function renderAnswerReview() {
  const items = declicQuestions.map(question => {
    const chosen = selectedOption(question.id, declicAnswers);
    const correct = question.options.find(option => option.correct);
    const item = document.createElement("li");
    const heading = document.createElement("h3");
    heading.textContent = question.title;
    item.append(heading);

    if (question.sceneCaption || question.scene) {
      const context = document.createElement("p");
      const facts = (question.scene ?? []).map(({ label, value }) => label + " · " + value);
      context.textContent = [question.sceneCaption, facts.join(" | ")].filter(Boolean).join(" ");
      item.append(context);
    }

    const answer = document.createElement("p");
    answer.className = "review-answer";
    answer.textContent = (chosen.correct ? "Votre bonne réponse · " : "Votre réponse · ") + chosen.label;
    item.append(answer);
    if (!chosen.correct) {
      const correction = document.createElement("p");
      correction.className = "review-answer";
      correction.textContent = "Bonne réponse · " + correct.label;
      item.append(correction);
    }

    const takeaway = document.createElement("p");
    takeaway.className = "review-takeaway";
    takeaway.textContent = question.reveal.title;
    const explanation = document.createElement("p");
    explanation.className = "review-explanation";
    showExplanation(explanation, question.reveal);
    item.append(takeaway, explanation);
    return item;
  });
  answerReview.open = false;
  document.getElementById("review-items").replaceChildren(...items);
}

function prepareResult() {
  const correctCount = declicQuestions.filter(question => selectedOption(question.id, declicAnswers).correct).length;
  const total = declicQuestions.length;
  const earnedPoints = correctCount * 4;
  const maxPoints = total * 4;
  const scoreCaption = correctCount + (correctCount === 1 ? " bonne réponse" : " bonnes réponses") + " sur " + total + " au premier essai.";
  const justGettingStarted = responses.experience === 0 || responses.experience === 1;
  currentResult = {
    ...assessProfile(responses),
    firstName,
    project: priorityGoal.label,
    otherGoals: goalsInOrder().filter(option => option !== priorityGoal).map(option => option.label),
    intuition: profiles[responses.intuition],
    horizon: selectedOption("horizon", responses).label,
    liveNext: justGettingStarted
      ? "Rendez-vous le 9 novembre pour voir, sur un portefeuille d’exemple, ce que votre profil change dans vos choix de placement."
      : "Rendez-vous le 9 novembre pour voir comment utiliser votre profil pour relire un portefeuille.",
    disclaimer,
  };
  document.getElementById("capture-first-name").textContent = currentResult.firstName;
  for (const section of otherGoalSections) {
    const items = currentResult.otherGoals.map(label => {
      const item = document.createElement("li");
      item.textContent = label;
      return item;
    });
    section.querySelector("ul").replaceChildren(...items);
    section.hidden = items.length === 0;
  }
  document.getElementById("capture-kicker").textContent = currentResult.provisional ? "Mon profil indicatif · À préciser" : "Mon profil indicatif";
  document.getElementById("capture-label").textContent = currentResult.label;
  document.getElementById("capture-project").textContent = currentResult.project;
  document.getElementById("capture-details").textContent = "Horizon · " + currentResult.horizon;
  for (const id of ["qi-gauge", "capture-gauge"]) {
    const gauge = document.getElementById(id);
    gauge.style.setProperty("--qi-fill", (earnedPoints / maxPoints * 100) + "%");
    gauge.querySelector("strong").textContent = earnedPoints;
    gauge.querySelector("span").textContent = " / " + maxPoints;
  }
  for (const id of ["score-caption", "capture-score-caption"]) {
    document.getElementById(id).textContent = scoreCaption;
  }
  renderAnswerReview();
  preparePdf(currentResult);
}

function animateAnalysis() {
  const animated = !reducedMotion.matches;
  const duration = animated ? analysisDuration : 500;
  const lastStage = analysisStages.length - 1;
  const startedAt = performance.now();
  let activeStage = -1;
  let displayedPercent = -1;

  function tick(now) {
    if (analysisScreen.hidden) return;
    const fraction = Math.min(Math.max((now - startedAt) / duration, 0), 1);
    const percent = animated ? Math.floor(fraction * 100) : 100;
    if (percent !== displayedPercent) {
      analysisProgress.value = percent;
      analysisPercent.textContent = percent + " %";
      displayedPercent = percent;
    }

    const stage = animated ? Math.min(Math.floor(fraction * analysisStages.length), lastStage) : lastStage;
    if (stage !== activeStage) {
      activeStage = stage;
      analysisStatus.textContent = animated ? analysisStages[stage] : "Votre résultat est prêt.";
      for (const [index, factor] of analysisFactors.entries()) {
        factor.classList.toggle("is-scanning", index === stage);
        factor.classList.toggle("is-scanned", index < stage);
      }
      if (stage === lastStage) prepareResult();
    }

    if (animated && fraction < 1) window.requestAnimationFrame(tick);
  }

  tick(startedAt);
  window.setTimeout(showResult, duration);
}

function showAnalysis() {
  const steps = currentSteps();
  step = steps.length;
  currentResult = undefined;
  resetPdf();
  for (const id of ["horizon", "reaction", "impact"]) {
    document.getElementById("analysis-" + id).textContent = selectedOption(id, responses).label;
  }
  updateDossier(steps);
  mobileContext.textContent = "Quiz investisseur";
  questionScreen.hidden = true;
  analysisScreen.hidden = false;
  focusScreen(analysisTitle);
  animateAnalysis();
}

function showResult() {
  if (analysisScreen.hidden) return;
  if (!currentResult) prepareResult();
  resultKicker.textContent = currentResult.provisional ? "Profil indicatif · À préciser" : "Votre profil indicatif";
  document.getElementById("result-first-name").textContent = currentResult.firstName;
  resultTitle.textContent = currentResult.label;
  resultProject.textContent = currentResult.project;
  for (const [index, segment] of Array.from(riskScale.children).entries()) {
    segment.classList.toggle("current", index === currentResult.level);
  }
  initialProfile.hidden = !currentResult.intuition;
  document.getElementById("initial-profile-value").textContent = currentResult.intuition ?? "";
  document.getElementById("live-next").textContent = currentResult.liveNext;
  document.getElementById("result-disclaimer").textContent = currentResult.disclaimer;
  analysisScreen.hidden = true;
  resultScreen.hidden = false;
  focusScreen(resultTitle);
}

startButton.addEventListener("click", () => {
  firstName = "";
  selectedGoals.clear();
  priorityGoal = undefined;
  responses = {};
  declicAnswers = {};
  skipDeclics = false;
  showQuestion(0);
});

firstNameInput.addEventListener("input", () => firstNameInput.setCustomValidity(""));
firstNameForm.addEventListener("submit", event => {
  event.preventDefault();
  if (firstNameForm.hidden) return;
  const name = firstNameInput.value.trim().replace(/\s+/g, " ").normalize("NFC");
  if (!name) {
    firstNameInput.setCustomValidity("Saisissez votre prénom pour continuer.");
    firstNameInput.reportValidity();
    return;
  }
  firstName = name;
  advance();
});

document.getElementById("capture-profile").addEventListener("click", () => {
  if (currentResult) captureDialog.showModal();
});

document.getElementById("back").addEventListener("click", () => {
  if (advancing) return;
  if (step > 0) {
    showQuestion(step - 1);
  } else {
    step = -1;
    flow.hidden = true;
    intro.hidden = false;
    focusScreen(startButton);
  }
});

continueButton.addEventListener("click", () => {
  if (questionScreen.hidden || advancing) return;
  const question = currentSteps()[step];
  if (question === firstNameQuestion) return;
  if (question === goalsQuestion && selectedGoals.size === 1) setPriority(goalsInOrder()[0]);
  advance();
});

document.getElementById("restart").addEventListener("click", () => {
  currentResult = undefined;
  resetPdf();
  responses = {};
  priorityGoal = undefined;
  skipDeclics = declicQuestions.every(question => declicAnswers[question.id] !== undefined);
  const goalsStep = currentSteps().indexOf(goalsQuestion);
  if (selectedGoals.size > 1) showQuestion(goalsStep + 1);
  else {
    selectedGoals.clear();
    showQuestion(goalsStep);
  }
});

async function preparePdf(resultToExport) {
  retryPdf.hidden = true;
  downloadStatus.textContent = "Préparation de votre fiche…";
  try {
    const { drawProfileCard, createProfilePdf } = await import("./profile-pdf.js?v=21");
    if (currentResult !== resultToExport) return;
    const card = captureImage.firstElementChild ?? await drawProfileCard(captureCard);
    if (currentResult !== resultToExport) return;
    captureImage.replaceChildren(card);
    captureImage.hidden = false;
    const pdf = await createProfilePdf(card);
    if (currentResult !== resultToExport) return;
    pdfUrl = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
    downloadLink.href = pdfUrl;
    downloadLink.hidden = false;
    downloadStatus.textContent = "";
  } catch {
    if (currentResult !== resultToExport) return;
    downloadStatus.textContent = "La préparation de la fiche a échoué. Vous pouvez réessayer ou l’enregistrer depuis l’impression.";
    retryPdf.hidden = false;
  }
}

retryPdf.addEventListener("click", () => {
  if (currentResult) preparePdf(currentResult);
});

document.getElementById("print-profile").addEventListener("click", () => {
  if (!currentResult) return;
  captureDialog.showModal();
  window.addEventListener("afterprint", () => captureDialog.close(), { once: true });
  window.print();
});

document.addEventListener("keydown", event => {
  if (step < 0 || advancing || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
  const question = currentSteps()[step];
  if (!question?.options || !/^[1-9]$/.test(event.key)) return;
  const choiceIndex = Number(event.key) - 1;
  if (choiceIndex < question.options.length) {
    event.preventDefault();
    chooseAnswer(choiceIndex);
  }
});
