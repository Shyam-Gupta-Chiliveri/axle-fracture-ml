const MODEL = window.AXLE_MODEL;

const COLORS = {
  "No temper": "#8d8a83",
  "180°C / 1 h": "#0c2340",
  "200°C / 1 h": "#3d6f99",
  "200°C / 3 h": "#7fa0bf",
  "220°C / 1 h": "#1f6b4a",
  "240°C / 1 h": "#8a5a12",
  "Vacuum tempering 230°C": "#7a2e24",
  "Temper, temperature not recorded": "#b08968",
};

let LANG = localStorage.getItem("axle-lang") === "de" ? "de" : "en";
let THEME = localStorage.getItem("axle-theme") === "dark" ? "dark" : "light";

const COPY = {
  en: {
    title: "Axle property desk",
    eyebrow: "Materials laboratory",
    brand: "Axle property desk",
    themeLabel: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",
    langLabel: "Language",
    tasksLabel: "Tasks",
    modeMeasure: "From hardness",
    modeTarget: "From a target",
    modeFile: "From a file",
    modeMethod: "The method",
    hMeasure: "From a hardness reading",
    pMeasure: "Enter the mean HV10. When you know the temper, type the temperature in degrees and the hold in hours. Ductility, brittleness, and bending force come from these axle tests. Rockwell, Brinell, and tensile strength are read from the same hardness.",
    meanHv: "Mean HV10",
    knowTemper: "I know the temper",
    processLabel: "Temper process",
    processTemperKicker: "Furnace",
    processTemper: "Tempering",
    processTemperNote: "Temperature and hold",
    processVacKicker: "Vacuum",
    processVac: "Vacuum tempering",
    processVacNote: "230 °C in this history",
    vacuumCopy: "The vacuum temper recorded on these axles.",
    hintVacuum: "Vacuum tempering in this history was run at 230 °C. The hardness still moves ductility and bending force.",
    temperTemp: "Tempering temperature",
    hold: "Hold",
    groupTests: "From these axle tests",
    groupHardness: "From this hardness",
    copyHardness: "Rockwell C, Brinell, and tensile strength follow DIN EN ISO 18265 Table A.1 for unalloyed and low-alloy steel. They were not measured on these axles. 4Cr13 and X46CrS13 are martensitic stainless, so treat the conversion as a guide. Brinell and tensile strength stop at 650 HV10, where that table stops. Tensile strength scatters by about ±85 N/mm².",
    groupImpact: "Impact",
    copyImpact: "The marked step is where this hardness sits among the axle tests.",
    capScatter: "Ductility against hardness in this test history. The line is the trend through the tests. Each colour is a temper.",
    capCompare: "Comparison of hardness, bending force, and ductility across the testing groups.",
    hTarget: "From the property you need",
    pTarget: "Name a ductility or an average bending force. The desk returns a temper that was actually run, and the hardness those axles had.",
    ariaTarget: "Target property",
    kindDuct: "Ductility",
    kindForce: "Bending force",
    groupAim: "At the hardness to aim for",
    groupImpactTemper: "Impact at that temper",
    capTempers: "Every recorded temper, nearest first",
    thTemper: "Temper",
    thAxles: "Axles",
    thDuct: "Ductility",
    thBrit: "Brittleness",
    thForce: "Avg force",
    hFile: "From an Excel or CSV file",
    pFile: "Drop a sheet of hardness readings. Temper columns such as Series Tempering and Additional Tempering are read as they were written in the laboratory. If the sheet already has ductility or bending force, the desk shows how far each estimate sits from the measurement.",
    ariaUpload: "Upload an Excel or CSV file",
    dropTitle: "Drop the file here",
    dropCopy: "Excel .xlsx or .csv. The first sheet is read. Save a Word or PDF table as Excel before uploading.",
    download: "Download the analysis",
    capBatch: "First 40 rows. HRC and tensile strength are the ISO 18265 conversion of the hardness. Tensile strength is blank above 650 HV10. Impact is Low below 22% ductility, Moderate from 22 to 33%, and Higher above 33%.",
    foot: "Estimates from the axle test history. A held-out testing group can miss these figures. This is not a release signature.",
    hMethod: "How the model was built",
    pMethod: "Ductility was already measured. Six models learned it from the chemistry, the hardness, and the bending force.",
    factKindLabel: "Kind of learning",
    factKind: "Supervised",
    factModelLabel: "Test result",
    factModel: "90.02%",
    factSplitLabel: "Split",
    factSplit: "80 / 20",
    factChosenLabel: "Chosen model",
    factChosen: "Ridge",
    factInverseLabel: "From a target",
    factInverse: "A lookup",
    deckPrev: "Back",
    deckNext: "Next",
    proc1t: "The rows",
    proc1p: "385,000 axles. Each row already carries a ductility and a brittleness.",
    proc2t: "The inputs",
    proc2p: "Chemistry, hardness, bending force, the die, and the diameter.",
    proc3t: "The split",
    proc3p: "Seed 42. 308,000 rows train the models, 77,000 score them. Then the inputs are scaled.",
    nTrain: "308,000",
    nTest: "77,000",
    proc4t: "The models",
    proc4p: "Linear, Ridge, Random Forest, XGBoost, LightGBM, and a stack of the tree models.",
    s1k: "01 · The score",
    s1h: "The score",
    s1p: "The first bar is training, the second is the test. Linear trains at 89.96% and tests at 90.02%. Ridge is the same pair.",
    legDuct: "Ductility",
    legBrit: "Brittleness",
    legTrain: "Training",
    legTest: "Test",
    s2k: "02 · The error",
    s2h: "The error",
    s2p: "Lower is better. Linear and Ridge are the smallest, at 1.99. Ridge has no brittleness bar: the notebook trains it on ductility only.",
    s3k: "03 · Overfitting",
    s3h: "Training and the test",
    s3p: "Random Forest trains higher than it tests. That is overfitting. Ridge stays level.",
    s4k: "04 · The gap",
    s4h: "Training minus test",
    s4p: "A bar above zero means the model remembered the training rows. Random Forest is that model.",
    s5k: "05 · Complexity",
    s5h: "Simple and complex",
    s5p: "Green is a test of 90% or more. Linear and Ridge are the simple ones, at complexity 1. The stack, at 9, does not pass them.",
    featT: "Feature engineering",
    featP: "Five inputs were added. Carbon over manganese, the hardness range, the force range, the alloy total, and hardness times force.",
    tuneT: "Hyperparameter tuning",
    tuneP: "XGBoost and LightGBM were trained again: 500 trees, depth 8, and a learning rate of 0.05.",
    tuneN: "The first bar is training, the second is the test. XGBoost's test moves from 89.87% to 89.91%. LightGBM's test moves from 90.01% to 89.98%.",
    advT: "Advanced optimization",
    advHow: "XGBoost, LightGBM, and Random Forest were stacked, and Ridge blended their predictions with 3-fold cross-validation.",
    advP: "Ductility first, then brittleness. The first bar is training, the second is the test.",
    advDuct: "Ductility",
    advDuctN: "Linear and Ridge test at 90.0235%. XGBoost tests at 89.8683%, and after tuning at 89.91%. LightGBM tests at 90.0093%, and after tuning at 89.98%. The stack tests at 89.9969%.",
    advBrit: "Brittleness",
    advBritN: "Linear tests at 90.0235%. XGBoost tests at 89.8456%. LightGBM tests at 90.0047%. The stack tests at 89.9968%. Tuning was run for ductility only. Ridge matches Linear, because brittleness is 100 minus ductility.",
    s6k: "06 · The miss",
    s6h: "The error in ductility points",
    s6p: "The typical miss for the chosen Ridge model is 1.59 ductility points.",
    keptT: "What was kept",
    keptLinLabel: "Linear",
    keptLin: "90.0235%",
    keptRidgeLabel: "Ridge",
    keptRidge: "90.0235%",
    keptMissLabel: "Typical miss",
    keptMiss: "± 1.59",
    keptP: "Both win. They train at 89.96% and test at 90.0235%, and the two scores stay level. The stack trains higher and tests lower, so it does not pass them. The miss is 1.59 points.",
    step1t: "The table",
    step1p: "385,000 axle tests. 4Cr13 accounts for 359,178 rows and X46CrS13 for 25,822. Each row has a mean HV10, a bending force, a ductility, and the temper written as Series Tempering and Additional Tempering.",
    step2t: "The temper, as written",
    step2p: "The text is read into a temperature and a hold. Vacuum tempering stays its own schedule: 230 °C in this history. A row marked only “Yes” has no temperature, so it is not offered as a temper to aim for.",
    step3t: "Whole testing groups stay together",
    step3p: "The split follows the testing family, seed 42, so every sample of one family stays on the same side. Training has 230,455 rows, validation 76,962, and the holdout 77,583. The holdout families are Testing Group D (Version-6) and Testing Group E (Version-6).",
    step4t: "Ridge regression",
    step4p: "Each result on this page is a Ridge regression with penalty α = 1.0, after the features are standardized. Hardness alone uses mean HV10. A known temper adds the temperature, the hold, and two flags for whether the temper was specified. The measured result is the target, so this is supervised regression. The wider study also fitted ordinary linear regression and Lasso. Validation R² selected Lasso for hardness to ductility. This page serves the Ridge fit. On the holdout the two miss ductility by about the same amount, 3.3 points.",
    step5t: "The error that is shown",
    step5p: "The ± printed with an estimate is the mean absolute error of the training-only fit on those held-out families: 3.3 points of ductility and 480 N of average force. R² on those families is −1.57 for ductility and −4.05 for force. A negative R² means D and E do not lie on the line learned from the other families. Minimum and maximum hardness do follow the reading: R² 0.88, about ±5 HV.",
    step6t: "What stays outside the model",
    step6p: "Bending force is not an input to ductility. Both come from the same mechanical test, and on the training rows the correlation is 0.96, so force would leak the answer. Brittleness is exactly 100 minus ductility. Rockwell C, Brinell, and tensile strength are DIN EN ISO 18265 Table A.1, a conversion, not a fit. Impact is Low, Moderate, or Higher from the ductility. A requested ductility or force returns the nearest temper that was actually run. That is a lookup.",
    heldTitle: "On the held-out families",
    heldDuctLabel: "Ductility, MAE",
    heldDuct: "± 3.3",
    heldForceLabel: "Average force, MAE",
    heldForce: "± 480 N",
    heldHvLabel: "Hardness spread, R²",
    heldHv: "0.88",
    heldCopy: "R² for ductility is −1.57 and for average force −4.05. Negative R² means Testing Group D and E (Version-6) are off the line learned from the other families. The ± is the width to read with the estimate.",
    hint: "Type any temperature and any hold. This history recorded {temps} °C, held for {hours}.",
    needTemper: "Type the tempering temperature in °C and the hold in hours.",
    warnBand: "Tempering this grade between 425 and 600 °C is avoided. Toughness falls in that band.",
    notePlain: "At {hv} HV10 the history points to about {duct}% ductile, so the balance is still mostly brittle, with bending force near {force}.",
    noteKnown: "{schedule} was run in this history. At {hv} HV10 that points to about {duct}% ductile, with bending force near {force}.",
    noteOff: "{c} °C for {h} h was not a temper in this test history. Recorded temperatures are {temps} °C, held for {hours}. The figure continues that trend.",
    ductilityBand: "Ductility, ± {band}",
    brittleness: "Brittleness",
    forceBand: "Average force, ± {band}",
    forceMin: "Minimum force",
    forceMax: "Maximum force",
    spread: "Hardness spread",
    rockwell: "Rockwell C",
    brinell: "Brinell",
    tensile: "Tensile strength",
    tensileBand: "Tensile strength, ± 85",
    impactLow: "Low",
    impactMod: "Moderate",
    impactHigh: "Higher",
    bandLow: "Below 22%",
    bandMod: "22 to 33%",
    bandHigh: "Above 33%",
    whereLow: "With the untempered axles",
    whereMod: "With the 180–240 °C tempers",
    whereHigh: "At the tougher end of this history",
    targetDuct: "Ductility %",
    targetForce: "Average bending force, N",
    noteTarget: "{schedule} is the closest recorded temper. Those axles sat near {hv} HV10.",
    temper: "Temper",
    holdWord: "Hold",
    aim: "Hardness to aim for",
    ariaScatter: "Ductility against hardness with the trend through the tests",
    ariaCompare: "Comparison of hardness, bending force, and ductility by testing group",
    axisForce: "Avg bending force (N)",
    axisHv: "Mean HV10",
    rowForce: "Force N",
    rowDuct: "Ductility",
    legendDuct: "Ductility %",
    legendForce: "Avg bending force (N)",
    legendHv: "Mean HV10",
    compareNear: "Comparison of hardness, bending force, and ductility. {hv} HV10 sits nearest {name} {version}: {groupHv} HV, {duct}% ductile, {force} N.",
    groupTesting: "Testing",
    colHardness: "Hardness column",
    colSeries: "Series tempering, optional",
    colAdditional: "Additional tempering, optional",
    colTemper: "Temper °C, optional",
    colHours: "Hold hours, optional",
    colDuct: "Measured ductility, optional",
    colForce: "Measured force, optional",
    notInFile: "Not in this file",
    chooseHv: "Choose the column that holds the hardness reading.",
    noNumeric: "No numeric hardness values were found in that column.",
    rowsRead: "{n} rows read. Average estimated ductility is {duct}%.",
    rows: "Rows",
    meanDuct: "Mean estimated ductility",
    missDuct: "Miss versus measured ductility",
    missForce: "Miss versus measured force",
    points: "{n} points",
    thRow: "Row",
    thHrc: "HRC",
    thTensile: "Tensile strength",
    thImpact: "Impact",
    thTemperRead: "Temper read",
    thMeasured: "Measured",
    thAvg: "Avg force",
    thMin: "Min force",
    thMax: "Max force",
    hardnessOnly: "Hardness only",
    noRows: "The file has no data rows.",
    excelMissing: "Excel support did not load. Use a CSV export.",
    fileFail: "That file could not be read.",
    schedNone: "No temper",
    schedUnknown: "Temper, temperature not recorded",
    schedVac: "Vacuum tempering {temp}°C",
    schedHold: "{c}°C / {h} h",
  },
  de: {
    title: "Achsenkennwerte",
    eyebrow: "Werkstofflabor",
    brand: "Achsenkennwerte",
    themeLabel: "Darstellung",
    themeLight: "Hell",
    themeDark: "Dunkel",
    langLabel: "Sprache",
    tasksLabel: "Aufgaben",
    modeMeasure: "Aus der Härte",
    modeTarget: "Aus einem Ziel",
    modeFile: "Aus einer Datei",
    modeMethod: "Das Verfahren",
    hMeasure: "Aus einem Härtewert",
    pMeasure: "Geben Sie die mittlere HV10 ein. Wenn das Anlassen bekannt ist, tragen Sie die Temperatur in Grad und die Haltedauer in Stunden ein. Duktilität, Sprödigkeit und Biegekraft stammen aus diesen Achsenprüfungen. Rockwell, Brinell und Zugfestigkeit werden aus derselben Härte gelesen.",
    meanHv: "Mittlere HV10",
    knowTemper: "Anlassen ist bekannt",
    processLabel: "Anlassverfahren",
    processTemperKicker: "Ofen",
    processTemper: "Anlassen",
    processTemperNote: "Temperatur und Haltedauer",
    processVacKicker: "Vakuum",
    processVac: "Vakuumanlassen",
    processVacNote: "230 °C in dieser Reihe",
    vacuumCopy: "Das Vakuumanlassen, das an diesen Achsen erfasst wurde.",
    hintVacuum: "Das Vakuumanlassen in dieser Reihe wurde bei 230 °C gefahren. Die Härte verschiebt weiterhin Duktilität und Biegekraft.",
    temperTemp: "Anlasstemperatur",
    hold: "Haltedauer",
    groupTests: "Aus diesen Achsenprüfungen",
    groupHardness: "Aus dieser Härte",
    copyHardness: "Rockwell C, Brinell und Zugfestigkeit folgen DIN EN ISO 18265 Tabelle A.1 für unlegierten und niedriglegierten Stahl. An diesen Achsen wurden sie nicht gemessen. 4Cr13 und X46CrS13 sind martensitische nichtrostende Stähle, die Umwertung ist daher eine Orientierung. Brinell und Zugfestigkeit enden bei 650 HV10, dort endet die Tabelle. Die Zugfestigkeit streut um etwa ±85 N/mm².",
    groupImpact: "Schlagzähigkeit",
    copyImpact: "Die markierte Stufe ist die Lage dieser Härte in den Achsenprüfungen.",
    capScatter: "Duktilität über der Härte in dieser Prüfreihe. Die Linie ist der Trend durch die Prüfungen. Jede Farbe ist ein Anlassen.",
    capCompare: "Vergleich von Härte, Biegekraft und Duktilität über die Prüfgruppen.",
    hTarget: "Aus der benötigten Eigenschaft",
    pTarget: "Nennen Sie eine Duktilität oder eine mittlere Biegekraft. Der Platz nennt ein Anlassen, das tatsächlich gefahren wurde, und die Härte dieser Achsen.",
    ariaTarget: "Zieleigenschaft",
    kindDuct: "Duktilität",
    kindForce: "Biegekraft",
    groupAim: "Bei der Zielhärte",
    groupImpactTemper: "Schlagzähigkeit bei diesem Anlassen",
    capTempers: "Jedes erfasste Anlassen, das nächste zuerst",
    thTemper: "Anlassen",
    thAxles: "Achsen",
    thDuct: "Duktilität",
    thBrit: "Sprödigkeit",
    thForce: "Mittlere Kraft",
    hFile: "Aus einer Excel- oder CSV-Datei",
    pFile: "Legen Sie ein Blatt mit Härtewerten ab. Spalten wie Series Tempering und Additional Tempering werden so gelesen, wie sie im Labor geschrieben wurden. Stehen Duktilität oder Biegekraft bereits im Blatt, zeigt der Platz den Abstand jeder Schätzung zur Messung.",
    ariaUpload: "Excel- oder CSV-Datei hochladen",
    dropTitle: "Datei hier ablegen",
    dropCopy: "Excel .xlsx oder .csv. Das erste Blatt wird gelesen. Eine Word- oder PDF-Tabelle vor dem Hochladen als Excel speichern.",
    download: "Auswertung herunterladen",
    capBatch: "Die ersten 40 Zeilen. HRC und Zugfestigkeit sind die ISO-18265-Umwertung der Härte. Die Zugfestigkeit bleibt über 650 HV10 leer. Die Schlagzähigkeit ist Niedrig unter 22 % Duktilität, Mittel von 22 bis 33 % und Höher über 33 %.",
    foot: "Schätzungen aus der Achsenprüfreihe. Eine zurückgehaltene Prüfgruppe kann von diesen Werten abweichen. Dies ist keine Freigabe.",
    hMethod: "Wie das Modell gebaut wurde",
    pMethod: "Die Duktilität war schon gemessen. Sechs Modelle haben sie aus Chemie, Härte und Biegekraft gelernt.",
    factKindLabel: "Art des Lernens",
    factKind: "Überwacht",
    factModelLabel: "Auf dieser Seite",
    factModel: "Ridge, α 1,0",
    factSplitLabel: "Aufteilung",
    factSplit: "Nach Familie",
    factChosenLabel: "Auf der Validierung gewählt",
    factChosen: "Lasso",
    factInverseLabel: "Aus einem Ziel",
    factInverse: "Eine Suche",
    deckPrev: "Zurück",
    deckNext: "Weiter",
    proc1t: "Die Zeilen",
    proc1p: "385.000 Achsen. Jede Zeile trägt bereits Duktilität und Sprödigkeit.",
    proc2t: "Die Eingaben",
    proc2p: "Chemie, Härte, Biegekraft, die Gießform und der Durchmesser.",
    proc3t: "Die Aufteilung",
    proc3p: "Seed 42. 308.000 Zeilen trainieren, 77.000 bewerten. Danach werden die Eingaben skaliert.",
    nTrain: "308.000",
    nTest: "77.000",
    proc4t: "Die Modelle",
    proc4p: "Linear, Ridge, Random Forest, XGBoost, LightGBM und ein Stack der Baummodelle.",
    s1k: "01 · Die Zahl",
    s1h: "Die Zahl",
    s1p: "Der erste Balken ist das Training, der zweite der Test. Linear trainiert bei 89,96 % und testet bei 90,02 %. Ridge ist dasselbe Paar.",
    legDuct: "Duktilität",
    legBrit: "Sprödigkeit",
    legTrain: "Training",
    legTest: "Test",
    s2k: "02 · Der Fehler",
    s2h: "Der Fehler",
    s2p: "Niedriger ist besser. Linear und Ridge sind die kleinsten, bei 1,99. Ridge hat keinen Sprödigkeitsbalken: das Notebook trainiert es nur auf Duktilität.",
    s3k: "03 · Überanpassung",
    s3h: "Training und Test",
    s3p: "Random Forest trainiert höher, als es testet. Das ist Überanpassung. Ridge bleibt auf einer Höhe.",
    s4k: "04 · Der Abstand",
    s4h: "Training minus Test",
    s4p: "Ein Balken über null heißt, das Modell hat sich die Trainingszeilen gemerkt. Das ist Random Forest.",
    s5k: "05 · Komplexität",
    s5h: "Einfach und komplex",
    s5p: "Grün ist ein Test von 90 % oder mehr. Linear und Ridge sind die einfachen, bei Komplexität 1. Der Stack, bei 9, übertrifft sie nicht.",
    featT: "Feature Engineering",
    featP: "Fünf Eingaben kamen dazu. Kohlenstoff durch Mangan, die Härtespanne, die Kraftspanne, die Legierungssumme und Härte mal Kraft.",
    tuneT: "Hyperparameter-Tuning",
    tuneP: "XGBoost und LightGBM wurden erneut trainiert: 500 Bäume, Tiefe 8 und eine Lernrate von 0,05.",
    tuneN: "Der erste Balken ist das Training, der zweite der Test. Der Test von XGBoost geht von 89,87 % auf 89,91 %. LightGBM geht von 90,01 % auf 89,98 %.",
    advT: "Erweiterte Optimierung",
    advHow: "XGBoost, LightGBM und Random Forest wurden gestapelt, und Ridge mischte ihre Vorhersagen mit 3-facher Kreuzvalidierung.",
    advP: "Zuerst Duktilität, dann Sprödigkeit. Der erste Balken ist das Training, der zweite der Test.",
    advDuct: "Duktilität",
    advDuctN: "Linear und Ridge testen bei 90,0235 %. XGBoost testet bei 89,8683 %, nach dem Tuning bei 89,91 %. LightGBM testet bei 90,0093 %, nach dem Tuning bei 89,98 %. Der Stack testet bei 89,9969 %.",
    advBrit: "Sprödigkeit",
    advBritN: "Linear testet bei 90,0235 %. XGBoost testet bei 89,8456 %. LightGBM testet bei 90,0047 %. Der Stack testet bei 89,9968 %. Das Tuning lief nur für die Duktilität. Ridge entspricht Linear, weil Sprödigkeit 100 minus Duktilität ist.",
    s6k: "06 · Der Fehlbetrag",
    s6h: "Der Fehler in Duktilitätspunkten",
    s6p: "Der typische Fehler des gewählten Ridge-Modells beträgt 1,59 Duktilitätspunkte.",
    keptT: "Was behalten wurde",
    keptLinLabel: "Linear",
    keptLin: "90,0235 %",
    keptRidgeLabel: "Ridge",
    keptRidge: "90,0235 %",
    keptMissLabel: "Typischer Fehler",
    keptMiss: "± 1,59",
    keptP: "Beide gewinnen. Sie trainieren bei 89,96 % und testen bei 90,0235 %, und die beiden Zahlen bleiben auf einer Höhe. Der Stack trainiert höher und testet niedriger, deshalb übertrifft er sie nicht. Der Fehler beträgt 1,59 Punkte.",
    step1t: "Die Tabelle",
    step1p: "385.000 Achsenprüfungen. 4Cr13 stellt 359.178 Zeilen, X46CrS13 25.822. Jede Zeile trägt eine mittlere HV10, eine Biegekraft, eine Duktilität und das Anlassen, geschrieben als Series Tempering und Additional Tempering.",
    step2t: "Das Anlassen, wie es geschrieben wurde",
    step2p: "Aus dem Text werden Temperatur und Haltedauer gelesen. Vakuumanlassen bleibt ein eigenes Programm: 230 °C in dieser Reihe. Eine Zeile, die nur „Yes“ trägt, hat keine Temperatur und wird nicht als Zielanlassen angeboten.",
    step3t: "Ganze Prüfgruppen bleiben zusammen",
    step3p: "Die Aufteilung folgt der Prüffamilie, Seed 42, sodass jede Probe einer Familie auf derselben Seite bleibt. Das Training hat 230.455 Zeilen, die Validierung 76.962 und die zurückgehaltene Menge 77.583. Zurückgehalten sind Testing Group D (Version-6) und Testing Group E (Version-6).",
    step4t: "Ridge-Regression",
    step4p: "Jedes Ergebnis auf dieser Seite ist eine Ridge-Regression mit Strafterm α = 1,0, nachdem die Merkmale standardisiert wurden. Härte allein verwendet die mittlere HV10. Ein bekanntes Anlassen ergänzt Temperatur, Haltedauer und zwei Kennzeichen, ob das Anlassen angegeben war. Das gemessene Ergebnis ist das Ziel, also ist dies überwachte Regression. Dieselbe Untersuchung hat auch gewöhnliche lineare Regression und Lasso angepasst. Die Validierungs-R² wählte Lasso für Härte nach Duktilität. Diese Seite liefert die Ridge-Anpassung. Auf den zurückgehaltenen Gruppen verfehlen beide die Duktilität um etwa denselben Betrag, 3,3 Punkte.",
    step5t: "Der Fehler, der gezeigt wird",
    step5p: "Das ± neben einer Schätzung ist der mittlere absolute Fehler der nur auf dem Training angepassten Gerade auf den zurückgehaltenen Familien: 3,3 Punkte Duktilität und 480 N mittlere Kraft. Die R² dort ist −1,57 für die Duktilität und −4,05 für die Kraft. Eine negative R² bedeutet, dass D und E nicht auf der Gerade der anderen Familien liegen. Mindest- und Höchsthärte folgen der Ablesung: R² 0,88, etwa ±5 HV.",
    step6t: "Was außerhalb des Modells bleibt",
    step6p: "Die Biegekraft ist keine Eingabe für die Duktilität. Beide stammen aus derselben mechanischen Prüfung, und auf den Trainingszeilen liegt die Korrelation bei 0,96, die Kraft würde also die Antwort verraten. Die Sprödigkeit ist genau 100 minus Duktilität. Rockwell C, Brinell und Zugfestigkeit sind DIN EN ISO 18265 Tabelle A.1, eine Umwertung, keine Anpassung. Die Schlagzähigkeit ist Niedrig, Mittel oder Höher aus der Duktilität. Eine gewünschte Duktilität oder Kraft liefert das nächstliegende Anlassen, das tatsächlich gefahren wurde. Das ist eine Suche, kein zweites Modell.",
    heldTitle: "Auf den zurückgehaltenen Familien",
    heldDuctLabel: "Duktilität, MAE",
    heldDuct: "± 3,3",
    heldForceLabel: "Mittlere Kraft, MAE",
    heldForce: "± 480 N",
    heldHvLabel: "Härtespanne, R²",
    heldHv: "0,88",
    heldCopy: "Die R² der Duktilität ist −1,57 und die der mittleren Kraft −4,05. Eine negative R² bedeutet, dass Testing Group D und E (Version-6) neben der Gerade der anderen Familien liegen. Das ± ist die Breite, mit der die Schätzung zu lesen ist.",
    hint: "Geben Sie eine beliebige Temperatur und eine beliebige Haltedauer ein. In dieser Reihe wurden {temps} °C erfasst, gehalten für {hours}.",
    needTemper: "Tragen Sie die Anlasstemperatur in °C und die Haltedauer in Stunden ein.",
    warnBand: "Anlassen dieser Güte zwischen 425 und 600 °C wird vermieden. In diesem Band fällt die Zähigkeit.",
    notePlain: "Bei {hv} HV10 weist die Reihe auf etwa {duct} % duktil, der Rest bleibt überwiegend spröde, die Biegekraft liegt nahe {force}.",
    noteKnown: "{schedule} wurde in dieser Reihe gefahren. Bei {hv} HV10 weist das auf etwa {duct} % duktil, die Biegekraft liegt nahe {force}.",
    noteOff: "{c} °C für {h} h war kein Anlassen in dieser Prüfreihe. Erfasste Temperaturen sind {temps} °C, gehalten für {hours}. Der Wert folgt diesem Trend.",
    ductilityBand: "Duktilität, ± {band}",
    brittleness: "Sprödigkeit",
    forceBand: "Mittlere Kraft, ± {band}",
    forceMin: "Mindestkraft",
    forceMax: "Höchstkraft",
    spread: "Härtespanne",
    rockwell: "Rockwell C",
    brinell: "Brinell",
    tensile: "Zugfestigkeit",
    tensileBand: "Zugfestigkeit, ± 85",
    impactLow: "Niedrig",
    impactMod: "Mittel",
    impactHigh: "Höher",
    bandLow: "Unter 22 %",
    bandMod: "22 bis 33 %",
    bandHigh: "Über 33 %",
    whereLow: "Bei den nicht angelassenen Achsen",
    whereMod: "Bei den Anlassungen 180–240 °C",
    whereHigh: "Am zäheren Ende dieser Reihe",
    targetDuct: "Duktilität %",
    targetForce: "Mittlere Biegekraft, N",
    noteTarget: "{schedule} ist das nächstliegende erfasste Anlassen. Diese Achsen lagen nahe {hv} HV10.",
    temper: "Anlassen",
    holdWord: "Haltedauer",
    aim: "Zielhärte",
    ariaScatter: "Duktilität über der Härte mit dem Trend durch die Prüfungen",
    ariaCompare: "Vergleich von Härte, Biegekraft und Duktilität nach Prüfgruppe",
    axisForce: "Biegekraft (N)",
    axisHv: "Härte HV10",
    rowForce: "Kraft N",
    rowDuct: "Duktilität",
    legendDuct: "Duktilität %",
    legendForce: "Biegekraft (N)",
    legendHv: "Härte HV10",
    compareNear: "Vergleich von Härte, Biegekraft und Duktilität. {hv} HV10 liegt am nächsten bei {name} {version}: {groupHv} HV, {duct} % duktil, {force} N.",
    groupTesting: "Prüfung",
    colHardness: "Härtespalte",
    colSeries: "Serienanlassen, optional",
    colAdditional: "Zusätzliches Anlassen, optional",
    colTemper: "Anlassen °C, optional",
    colHours: "Haltestunden, optional",
    colDuct: "Gemessene Duktilität, optional",
    colForce: "Gemessene Kraft, optional",
    notInFile: "Nicht in dieser Datei",
    chooseHv: "Wählen Sie die Spalte mit dem Härtewert.",
    noNumeric: "In dieser Spalte wurden keine numerischen Härtewerte gefunden.",
    rowsRead: "{n} Zeilen gelesen. Die mittlere geschätzte Duktilität beträgt {duct} %.",
    rows: "Zeilen",
    meanDuct: "Mittlere geschätzte Duktilität",
    missDuct: "Abweichung zur gemessenen Duktilität",
    missForce: "Abweichung zur gemessenen Kraft",
    points: "{n} Punkte",
    thRow: "Zeile",
    thHrc: "HRC",
    thTensile: "Zugfestigkeit",
    thImpact: "Schlagzähigkeit",
    thTemperRead: "Gelesenes Anlassen",
    thMeasured: "Gemessen",
    thAvg: "Mittlere Kraft",
    thMin: "Mindestkraft",
    thMax: "Höchstkraft",
    hardnessOnly: "Nur Härte",
    noRows: "Die Datei enthält keine Datenzeilen.",
    excelMissing: "Excel-Unterstützung wurde nicht geladen. Verwenden Sie einen CSV-Export.",
    fileFail: "Diese Datei konnte nicht gelesen werden.",
    schedNone: "Ohne Anlassen",
    schedUnknown: "Anlassen, Temperatur nicht erfasst",
    schedVac: "Vakuumanlassen {temp} °C",
    schedHold: "{c} °C / {h} h",
  },
};

function t(key, vars) {
  const text = (COPY[LANG] && COPY[LANG][key]) || COPY.en[key] || key;
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (_, name) => (vars[name] == null ? "" : String(vars[name])));
}

function localeTag() {
  return LANG === "de" ? "de-DE" : "en-GB";
}

function formatNumber(value, digits) {
  return Number(value).toLocaleString(localeTag(), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function formatInt(value) {
  return Math.round(Number(value)).toLocaleString(localeTag());
}

function scheduleName(name) {
  const text = String(name || "");
  if (text === "No temper") return t("schedNone");
  if (text === "Hardness only") return t("hardnessOnly");
  if (text === "Temper, temperature not recorded") return t("schedUnknown");
  if (/vacuum (hardening|tempering)/i.test(text)) {
    const temp = (text.match(/(\d+)/) || [])[1] || "230";
    return t("schedVac", { temp });
  }
  const hold = text.match(/(\d+)\s*°C\s*\/\s*(\d+(?:\.\d+)?)\s*h/i);
  if (hold) return t("schedHold", { c: hold[1], h: hold[2] });
  return text;
}

function impactLabel(name) {
  if (name === "Low") return t("impactLow");
  if (name === "Moderate") return t("impactMod");
  return t("impactHigh");
}

function groupLabel(name) {
  return name === "Testing" ? t("groupTesting") : name;
}

function applyStatic() {
  document.documentElement.lang = LANG;
  document.documentElement.dataset.theme = THEME;
  document.title = t("title");
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
  document.getElementById("theme-light").setAttribute("aria-pressed", THEME === "light" ? "true" : "false");
  document.getElementById("theme-dark").setAttribute("aria-pressed", THEME === "dark" ? "true" : "false");
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.lang === LANG ? "true" : "false");
  });
}

function predictPack(pack, features) {
  let y = pack.intercept;
  features.forEach((value, index) => {
    const z = (value - pack.mean[index]) / pack.scale[index];
    y += pack.coef[index] * z;
  });
  return y;
}

function estimate(meanHv, temper) {
  const useTemper = temper != null;
  const mode = useTemper ? "served_temper" : "served_hv";
  const specified = !useTemper
    ? 0
    : (temper.specified != null ? temper.specified : ((temper.c === 0 && temper.h === 0) ? 0 : 1));
  const unspecified = useTemper && temper.unspecified ? temper.unspecified : 0;
  const row = useTemper ? [meanHv, temper.c, temper.h, specified, unspecified] : [meanHv];
  const names = ["ductility", "force_avg", "force_min", "force_max", "hv_min", "hv_max"];
  const values = {};
  const band = {};
  names.forEach((name) => {
    values[name] = predictPack(MODEL.models[name][mode], row);
    band[name] = MODEL.metrics[name].hv.mae;
  });
  values.ductility = Math.min(100, Math.max(0, values.ductility));
  values.brittleness = 100 - values.ductility;
  return { values, band, outside: meanHv < MODEL.hv_min || meanHv > MODEL.hv_max };
}

function recommend(kind, target) {
  const key = kind === "ductility" ? "ductility" : "force_avg";
  return MODEL.schedules
    .filter((item) => item.recommendable !== false)
    .slice()
    .sort((a, b) => Math.abs(a[key] - target) - Math.abs(b[key] - target) || b.n - a.n);
}

function figure(label, value) {
  return `<div class="figure"><span class="label">${label}</span><span class="value">${value}</span></div>`;
}

function formatForce(value) {
  return `${formatInt(value)} N`;
}

// DIN EN ISO 18265 Table A.1, unalloyed and low-alloy steel: HV, HRC, HB, Rm in N/mm².
// Empty Brinell and tensile cells are empty in the table and stay empty here.
const ISO18265 = [
  [400, 40.8, 380, 1290], [410, 41.8, 390, 1320], [420, 42.7, 399, 1350], [430, 43.6, 409, 1385],
  [440, 44.5, 418, 1420], [450, 45.3, 428, 1455], [460, 46.1, 437, 1485], [470, 46.9, 447, 1520],
  [480, 47.7, 456, 1555], [490, 48.4, 466, 1595], [500, 49.1, 475, 1630], [510, 49.8, 485, 1665],
  [520, 50.5, 494, 1700], [530, 51.1, 504, 1740], [540, 51.7, 513, 1775], [550, 52.3, 523, 1810],
  [560, 53.0, 532, 1845], [570, 53.6, 542, 1880], [580, 54.1, 551, 1920], [590, 54.7, 561, 1955],
  [600, 55.2, 570, 1995], [610, 55.7, 580, 2030], [620, 56.3, 589, 2070], [630, 56.8, 599, 2105],
  [640, 57.3, 608, 2145], [650, 57.8, 618, 2180], [660, 58.3, null, null], [670, 58.8, null, null],
  [680, 59.2, null, null], [690, 59.7, null, null], [700, 60.1, null, null], [720, 61.0, null, null],
  [740, 61.8, null, null], [760, 62.5, null, null], [780, 63.3, null, null], [800, 64.0, null, null],
  [820, 64.7, null, null], [840, 65.3, null, null], [860, 65.9, null, null], [880, 66.4, null, null],
  [900, 67.0, null, null], [920, 67.5, null, null], [940, 68.0, null, null],
];

function convertHardness(hv) {
  const rows = ISO18265;
  if (hv < rows[0][0] || hv > rows[rows.length - 1][0]) return null;
  let upper = 1;
  while (upper < rows.length && rows[upper][0] < hv) upper += 1;
  const exact = rows[upper][0] === hv ? rows[upper] : (rows[upper - 1][0] === hv ? rows[upper - 1] : null);
  if (exact) return { hrc: exact[1], hb: exact[2], rm: exact[3] };
  const low = rows[upper - 1];
  const high = rows[upper];
  const span = (high[0] - low[0]) || 1;
  const t = (hv - low[0]) / span;
  const mix = (left, right) => (left == null || right == null) ? null : left + (right - left) * t;
  return { hrc: mix(low[1], high[1]), hb: mix(low[2], high[2]), rm: mix(low[3], high[3]) };
}

function impactClass(ductility) {
  if (ductility < 22) return "Low";
  if (ductility <= 33) return "Moderate";
  return "Higher";
}

function impactScale(ductility) {
  const current = impactClass(ductility);
  const steps = [
    ["Low", t("impactLow"), t("bandLow"), t("whereLow")],
    ["Moderate", t("impactMod"), t("bandMod"), t("whereMod")],
    ["Higher", t("impactHigh"), t("bandHigh"), t("whereHigh")],
  ];
  return `<div class="impact-scale">${steps.map(([key, name, band, where]) => `
    <div class="impact-step${key === current ? " is-on" : ""}">
      <span class="label">${name}</span>
      <span class="band">${band}</span>
      <span class="where">${where}</span>
    </div>`).join("")}</div>`;
}

function conversionFigures(hv) {
  const converted = convertHardness(hv);
  if (!converted) {
    return [
    figure(t("rockwell"), "—"),
    figure(t("brinell"), "—"),
    figure(t("tensile"), "—"),
    ].join("");
  }
  return [
    figure(t("rockwell"), `${formatNumber(converted.hrc, 1)} HRC`),
    figure(t("brinell"), converted.hb == null ? "—" : `${formatInt(converted.hb)} HB`),
    figure(converted.rm == null ? t("tensile") : t("tensileBand"), converted.rm == null ? "—" : `${formatInt(converted.rm)} N/mm²`),
  ].join("");
}

function temperGuide() {
  const recorded = MODEL.schedules.filter((item) => (
    item.recommendable !== false && item.temper_c > 0 && !/vacuum/i.test(item.schedule)
  ));
  const temps = [...new Set(recorded.map((item) => item.temper_c))].sort((a, b) => a - b);
  const hours = [...new Set(recorded.map((item) => item.temper_h))].sort((a, b) => a - b);
  return { temps, hours };
}

function formatHours(hours) {
  return Number.isInteger(hours) ? String(hours) : String(hours);
}

function recordedSchedule(c, h) {
  return MODEL.schedules.find((item) => item.recommendable !== false && item.temper_c === c && item.temper_h === h);
}

function renderMeasure() {
  const hv = Number(document.getElementById("hv").value);
  const useTemper = document.getElementById("use-temper").checked;
  const vacuum = useTemper && document.querySelector('input[name="process"]:checked').value === "vacuum";
  document.getElementById("temper-fields").hidden = !useTemper;
  document.getElementById("furnace-fields").hidden = !useTemper || vacuum;
  document.getElementById("vacuum-spec").hidden = !useTemper || !vacuum;
  const hint = document.getElementById("temper-hint");
  hint.hidden = !useTemper;
  const guide = temperGuide();
  const tempList = guide.temps.join(", ");
  const hourList = guide.hours.map((hours) => `${formatHours(hours)} h`).join(LANG === "de" ? " oder " : " or ");
  hint.textContent = vacuum ? t("hintVacuum") : t("hint", { temps: tempList, hours: hourList });
  const cRaw = document.getElementById("temper-c").value.trim();
  const hRaw = document.getElementById("temper-h").value.trim();
  const temperC = Number(cRaw);
  const temperH = Number(hRaw);
  const temperReady = vacuum || (cRaw !== "" && hRaw !== "" && Number.isFinite(temperC) && Number.isFinite(temperH));
  const temper = !useTemper || !temperReady ? null : (vacuum ? { c: 230, h: 1 } : { c: temperC, h: temperH });
  if (!Number.isFinite(hv)) return;
  if (useTemper && !temperReady) {
    document.getElementById("measure-note").textContent = t("needTemper");
    return;
  }
  const result = estimate(hv, temper);
  const v = result.values;
  document.getElementById("measure-results").innerHTML = [
    figure(t("ductilityBand", { band: formatNumber(result.band.ductility, 1) }), `${formatNumber(v.ductility, 1)} %`),
    figure(t("brittleness"), `${formatNumber(v.brittleness, 1)} %`),
    figure(t("forceBand", { band: formatInt(result.band.force_avg) }), formatForce(v.force_avg)),
    figure(t("forceMin"), formatForce(v.force_min)),
    figure(t("forceMax"), formatForce(v.force_max)),
    figure(t("spread"), `${formatInt(v.hv_min)} – ${formatInt(v.hv_max)}`),
  ].join("");
  document.getElementById("measure-converted").innerHTML = conversionFigures(hv);
  document.getElementById("measure-impact").innerHTML = impactScale(v.ductility);
  const warn = document.getElementById("impact-warn");
  const embrittled = temper && temper.c >= 425 && temper.c <= 600;
  warn.hidden = !embrittled;
  warn.textContent = embrittled ? t("warnBand") : "";
  const note = document.getElementById("measure-note");
  const known = temper ? recordedSchedule(temper.c, temper.h) : null;
  const temperOffHistory = Boolean(temper) && !known;
  note.className = temperOffHistory ? "note is-warn" : "note";
  if (!temper) {
    note.textContent = t("notePlain", { hv, duct: formatNumber(v.ductility, 0), force: formatForce(v.force_avg) });
  } else if (known) {
    note.textContent = t("noteKnown", { schedule: scheduleName(known.schedule), hv, duct: formatNumber(v.ductility, 0), force: formatForce(v.force_avg) });
  } else {
    note.textContent = t("noteOff", {
      c: temper.c,
      h: formatHours(temper.h),
      temps: guide.temps.join(", "),
      hours: guide.hours.map((hours) => `${formatHours(hours)} h`).join(LANG === "de" ? " oder " : " or "),
    });
  }
  document.getElementById("measure-chart").innerHTML = chart() + scheduleLegend();
  const nearest = nearestGroup(hv);
  document.getElementById("compare-plot").innerHTML = comparisonChart(hv);
  document.getElementById("compare-caption").textContent = t("compareNear", {
    hv,
    name: groupLabel(nearest.name),
    version: nearest.version,
    groupHv: nearest.hv,
    duct: formatNumber(nearest.ductility, 2),
    force: formatInt(nearest.force),
  });
}

function scheduleLegend() {
  const names = Object.keys(COLORS).filter((name) => MODEL.sample.some((point) => point.schedule === name));
  return `<ul class="swatches">${names.map((name) => `<li><span style="background:${COLORS[name]}"></span>${scheduleName(name)}</li>`).join("")}</ul>`;
}

function chart() {
  const width = 800;
  const height = 280;
  const pad = { l: 48, r: 16, t: 12, b: 32 };
  const x0 = 560;
  const x1 = 750;
  const y0 = 12;
  const y1 = 48;
  const sx = (hv) => pad.l + ((hv - x0) / (x1 - x0)) * (width - pad.l - pad.r);
  const sy = (ductility) => pad.t + ((y1 - ductility) / (y1 - y0)) * (height - pad.t - pad.b);
  const dots = MODEL.sample.map((point) => {
    const color = COLORS[point.schedule] || "#8d8a83";
    return `<circle cx="${sx(point.hv).toFixed(1)}" cy="${sy(point.ductility).toFixed(1)}" r="3.2" fill="${color}" fill-opacity="0.7"><title>${scheduleName(point.schedule)}: ${point.hv} HV10, ${formatNumber(point.ductility, 1)}%</title></circle>`;
  }).join("");
  let sxSum = 0;
  let sySum = 0;
  let sxx = 0;
  let sxy = 0;
  const n = MODEL.sample.length;
  MODEL.sample.forEach((point) => {
    sxSum += point.hv;
    sySum += point.ductility;
    sxx += point.hv * point.hv;
    sxy += point.hv * point.ductility;
  });
  const slope = (n * sxy - sxSum * sySum) / (n * sxx - sxSum * sxSum);
  const intercept = (sySum - slope * sxSum) / n;
  const yAt = (hv) => intercept + slope * hv;
  const xTicks = [580, 620, 660, 700, 740].map((tick) => `<text x="${sx(tick)}" y="${height - 8}" text-anchor="middle" font-size="11" fill="var(--muted)">${tick}</text>`).join("");
  const yTicks = [20, 30, 40].map((tick) => `<text x="8" y="${sy(tick) + 4}" font-size="11" fill="var(--muted)">${tick}</text>`).join("");
  const trend = `<line x1="${sx(x0)}" y1="${sy(yAt(x0))}" x2="${sx(x1)}" y2="${sy(yAt(x1))}" stroke="var(--blue)" stroke-width="1.75"/>`;
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${t("ariaScatter")}">${dots}${trend}${xTicks}${yTicks}</svg>`;
}

const GROUP_COMPARISON = [
  { name: "TG A", version: "V6", force: 3234, hv: 692, ductility: 19.83 },
  { name: "TG B", version: "Friulpress V6", force: 3245, hv: 677, ductility: 20.27 },
  { name: "TG C", version: "V6", force: 4202, hv: 648, ductility: 26.54 },
  { name: "TG D", version: "V6", force: 4332, hv: 648, ductility: 27.29 },
  { name: "TG E", version: "V6", force: 4768, hv: 630, ductility: 30.56 },
  { name: "TG F", version: "V6", force: 5143, hv: 620, ductility: 33.25 },
  { name: "TG H", version: "V11", force: 4379, hv: 638, ductility: 27.95 },
  { name: "TG I", version: "V11", force: 4688, hv: 632, ductility: 30.00 },
  { name: "TG B", version: "Freund V3", force: 5899, hv: 612, ductility: 38.23 },
  { name: "Testing", version: "V14", force: 6744, hv: 620, ductility: 42.82 },
  { name: "Testing", version: "V14 · 2", force: 6618, hv: 608, ductility: 42.85 },
];

function nearestGroup(hv) {
  return GROUP_COMPARISON.reduce((best, group) => (
    Math.abs(group.hv - hv) < Math.abs(best.hv - hv) ? group : best
  ));
}

function comparisonChart(hv) {
  const width = 1040;
  const height = 640;
  const left = 78;
  const right = 70;
  const top = 36;
  const plotH = 340;
  const plotW = width - left - right;
  const n = GROUP_COMPARISON.length;
  const slot = plotW / n;
  const barW = 16;
  const forceMax = 7800;
  const hv0 = 500;
  const hv1 = 720;
  const ductMax = Math.max(...GROUP_COMPARISON.map((group) => group.ductility));
  const forcePeak = Math.max(...GROUP_COMPARISON.map((group) => group.force));
  const yForce = (value) => top + (1 - value / forceMax) * plotH;
  const yHv = (value) => top + (1 - (value - hv0) / (hv1 - hv0)) * plotH;
  const yDuct = (value) => yForce(value * (forcePeak / ductMax));
  const nearest = nearestGroup(hv);
  const plotBottom = top + plotH;
  const nameY = plotBottom + 22;
  const versionY = plotBottom + 38;
  const forceY = plotBottom + 64;
  const hvY = plotBottom + 84;
  const ductY = plotBottom + 104;
  const forceGrid = [0, 2000, 4000, 6000].map((tick) => `
    <line x1="${left}" x2="${left + plotW}" y1="${yForce(tick)}" y2="${yForce(tick)}" stroke="var(--chart-grid)"/>
    <text x="${left - 10}" y="${yForce(tick) + 4}" text-anchor="end" font-size="11" fill="var(--force)">${formatInt(tick)}</text>
  `).join("");
  const hvTicks = [520, 560, 600, 640, 680, 720].map((tick) => `
    <text x="${left + plotW + 10}" y="${yHv(tick) + 4}" font-size="11" fill="var(--hv-ink)">${tick}</text>
  `).join("");
  const columns = GROUP_COMPARISON.map((group, index) => {
    const cx = left + slot * index + slot / 2;
    const on = group === nearest;
    const forceH = yForce(0) - yForce(group.force);
    const hvH = yHv(hv0) - yHv(group.hv);
    const ink = on ? "var(--ink)" : "var(--muted)";
    return `
      ${on ? `<rect x="${cx - slot / 2 + 4}" y="${top}" width="${slot - 8}" height="${ductY - top + 8}" fill="var(--blue)" fill-opacity="0.08"/>` : ""}
      <rect x="${cx - barW - 2}" y="${yForce(group.force)}" width="${barW}" height="${forceH}" fill="var(--force)" fill-opacity="${on ? 1 : 0.82}"/>
      <rect x="${cx + 2}" y="${yHv(group.hv)}" width="${barW}" height="${hvH}" fill="var(--hv-ink)" fill-opacity="${on ? 1 : 0.82}"/>
      <text x="${cx}" y="${nameY}" text-anchor="middle" font-size="12" fill="${ink}">${groupLabel(group.name)}</text>
      <text x="${cx}" y="${versionY}" text-anchor="middle" font-size="10" fill="${ink}">${group.version}</text>
      <text x="${cx}" y="${forceY}" text-anchor="middle" font-size="12" font-weight="500" fill="var(--force)">${formatInt(group.force)}</text>
      <text x="${cx}" y="${hvY}" text-anchor="middle" font-size="12" font-weight="500" fill="var(--hv-ink)">${group.hv}</text>
      <text x="${cx}" y="${ductY}" text-anchor="middle" font-size="12" font-weight="500" fill="var(--duct)">${formatNumber(group.ductility, 2)}%</text>
    `;
  }).join("");
  const line = GROUP_COMPARISON.map((group, index) => {
    const cx = left + slot * index + slot / 2;
    return `${cx.toFixed(1)},${yDuct(group.ductility).toFixed(1)}`;
  }).join(" ");
  const markers = GROUP_COMPARISON.map((group, index) => {
    const cx = left + slot * index + slot / 2;
    const y = yDuct(group.ductility);
    return `<circle cx="${cx}" cy="${y}" r="4.5" fill="var(--surface)" stroke="var(--duct)" stroke-width="2"/>`;
  }).join("");
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${t("ariaCompare")}">
    ${forceGrid}
    ${hvTicks}
    ${columns}
    <line x1="${left}" x2="${left + plotW}" y1="${plotBottom + 48}" y2="${plotBottom + 48}" stroke="var(--line)"/>
    <polyline points="${line}" fill="none" stroke="var(--duct)" stroke-width="2.5"/>
    ${markers}
    <text x="18" y="${top + 118}" transform="rotate(-90 18 ${top + 118})" font-size="12" fill="var(--force)">${t("axisForce")}</text>
    <text x="${width - 16}" y="${top + 108}" transform="rotate(90 ${width - 16} ${top + 108})" font-size="12" fill="var(--hv-ink)">${t("axisHv")}</text>
    <text x="${left - 10}" y="${forceY}" text-anchor="end" font-size="11" fill="var(--force)">${t("rowForce")}</text>
    <text x="${left - 10}" y="${hvY}" text-anchor="end" font-size="11" fill="var(--hv-ink)">HV10</text>
    <text x="${left - 10}" y="${ductY}" text-anchor="end" font-size="11" fill="var(--duct)">${t("rowDuct")}</text>
    <circle cx="${left}" cy="16" r="4.5" fill="var(--surface)" stroke="var(--duct)" stroke-width="2"/>
    <text x="${left + 12}" y="20" font-size="12" fill="var(--ink)">${t("legendDuct")}</text>
    <rect x="${left + 108}" y="8" width="12" height="12" fill="var(--force)"/>
    <text x="${left + 126}" y="18" font-size="12" fill="var(--ink)">${t("legendForce")}</text>
    <rect x="${left + 300}" y="8" width="12" height="12" fill="var(--hv-ink)"/>
    <text x="${left + 318}" y="18" font-size="12" fill="var(--ink)">${t("legendHv")}</text>
  </svg>`;
}

function renderTarget() {
  const kind = document.querySelector('input[name="kind"]:checked').value;
  const input = document.getElementById("target-value");
  const label = document.getElementById("target-label");
  if (kind === "force") {
    label.textContent = t("targetForce");
    input.min = "2000";
    input.max = "8000";
    input.step = "50";
    if (Number(input.value) < 1000) input.value = "4700";
  } else {
    label.textContent = t("targetDuct");
    input.min = "10";
    input.max = "50";
    input.step = "0.5";
    if (Number(input.value) > 100) input.value = "30";
  }
  const target = Number(input.value);
  if (!Number.isFinite(target)) return;
  const ranked = recommend(kind, target);
  const best = ranked[0];
  const note = document.getElementById("target-note");
  note.className = "note";
  note.textContent = t("noteTarget", { schedule: scheduleName(best.schedule), hv: formatInt(best.hv) });
  document.getElementById("target-results").innerHTML = [
    figure(t("temper"), scheduleName(best.schedule)),
    figure(t("holdWord"), `${best.temper_h} h`),
    figure(t("aim"), `${formatInt(best.hv)} HV10`),
    figure(t("kindDuct"), `${formatNumber(best.ductility, 1)} %`),
    figure(t("brittleness"), `${formatNumber(best.brittleness, 1)} %`),
    figure(t("thForce"), formatForce(best.force_avg)),
    figure(t("forceMin"), formatForce(best.force_min)),
    figure(t("forceMax"), formatForce(best.force_max)),
    figure(t("spread"), `${formatInt(best.hv_min)} – ${formatInt(best.hv_max)}`),
  ].join("");
  document.getElementById("target-converted").innerHTML = conversionFigures(best.hv);
  document.getElementById("target-impact").innerHTML = impactScale(best.ductility);
  document.querySelector("#target-table tbody").innerHTML = ranked.map((item, index) => `
    <tr class="${index === 0 ? "is-best" : ""}">
      <td>${scheduleName(item.schedule)}</td>
      <td>${formatInt(item.n)}</td>
      <td>${formatInt(item.hv)}</td>
      <td>${formatNumber(item.ductility, 1)} %</td>
      <td>${formatNumber(item.brittleness, 1)} %</td>
      <td>${formatForce(item.force_avg)}</td>
    </tr>`).join("");
}

const ALIASES = {
  hv: ["mean hv10", "hv10", "hardness", "mean hardness", "vickers", "hv"],
  series: ["series tempering", "series temper"],
  additional: ["additional tempering", "additional temper"],
  temper: ["temper c", "tempering temperature", "temperature", "temper", "temp"],
  hours: ["hold", "hours", "temper h", "hold time"],
  ductility: ["ductility %", "ductility"],
  force: ["avg bending force (n)", "avg bending force", "bending force", "average force"],
};

function cleanText(value) {
  const text = String(value ?? "").trim();
  return ["nan", "none", "null"].includes(text.toLowerCase()) ? "" : text;
}

function parseSchedule(series, additional) {
  const seriesText = cleanText(series);
  const additionalText = cleanText(additional);
  const add = additionalText.match(/(\d+)\s*°C\s*\/\s*(\d+)\s*h/i);
  const seriesMatch = seriesText.match(/(\d+)\s*°C(?:\s*\/\s*(\d+)\s*h)?/i);
  if (seriesText.toLowerCase().includes("vac")) {
    const temp = seriesMatch ? Number(seriesMatch[1]) : 230;
    const hours = add ? Number(add[2]) : 1;
    return { c: temp, h: hours, specified: 1, unspecified: 0, label: `Vacuum tempering ${temp}°C` };
  }
  if (add) {
    return { c: Number(add[1]), h: Number(add[2]), specified: 1, unspecified: 0, label: `${add[1]}°C / ${add[2]} h` };
  }
  if (seriesMatch) {
    const hours = seriesMatch[2] ? Number(seriesMatch[2]) : 1;
    return { c: Number(seriesMatch[1]), h: hours, specified: 1, unspecified: 0, label: `${seriesMatch[1]}°C / ${hours} h` };
  }
  if (seriesText.toLowerCase() === "yes") {
    return { c: 0, h: 0, specified: 0, unspecified: 1, label: "Temper, temperature not recorded" };
  }
  return { c: 0, h: 0, specified: 0, unspecified: 0, label: "No temper" };
}

let batchRows = [];
let batchResult = [];

function normalise(name) {
  return String(name).trim().toLowerCase();
}

function guess(headers, role) {
  const wanted = ALIASES[role];
  return headers.findIndex((header) => wanted.includes(normalise(header)));
}

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row = {};
    headers.forEach((header, index) => { row[header] = cells[index] ?? ""; });
    return row;
  });
}

function splitCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') { current += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
    } else current += char;
  }
  cells.push(current.trim());
  return cells;
}

function rowsFromFile(file, buffer) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv")) return parseCsv(new TextDecoder().decode(buffer));
  if (typeof XLSX === "undefined") throw new Error(t("excelMissing"));
  const book = XLSX.read(buffer, { type: "array" });
  return XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]], { defval: "" });
}

function buildMapper(headers) {
  const roles = [
    ["hv", "colHardness"],
    ["series", "colSeries"],
    ["additional", "colAdditional"],
    ["temper", "colTemper"],
    ["hours", "colHours"],
    ["ductility", "colDuct"],
    ["force", "colForce"],
  ];
  const mapper = document.getElementById("mapper");
  mapper.hidden = false;
  mapper.innerHTML = roles.map(([role, key]) => {
    const selected = guess(headers, role);
    const options = [`<option value="-1">${t("notInFile")}</option>`]
      .concat(headers.map((header, index) => `<option value="${index}" ${index === selected ? "selected" : ""}>${header}</option>`))
      .join("");
    return `<label><span data-i18n="${key}">${t(key)}</span><select data-role="${role}">${options}</select></label>`;
  }).join("");
  mapper.querySelectorAll("select").forEach((select) => select.addEventListener("change", runBatch));
}

function columnValue(row, headers, index) {
  if (index < 0 || index == null) return null;
  const raw = row[headers[index]];
  const value = Number(String(raw).replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

function temperFromRow(row, headers, picks) {
  if (picks.series >= 0 || picks.additional >= 0) {
    const series = picks.series >= 0 ? row[headers[picks.series]] : "";
    const additional = picks.additional >= 0 ? row[headers[picks.additional]] : "";
    return parseSchedule(series, additional);
  }
  const temperC = columnValue(row, headers, picks.temper);
  if (temperC == null) return null;
  const hours = columnValue(row, headers, picks.hours);
  const hold = hours == null ? 1 : hours;
  const bare = temperC === 0 && hold === 0;
  return { c: temperC, h: hold, specified: bare ? 0 : 1, unspecified: 0, label: bare ? "No temper" : `${temperC}°C / ${hold} h` };
}

function runBatch() {
  const headers = Object.keys(batchRows[0] || {});
  const picks = {};
  document.querySelectorAll("#mapper select").forEach((select) => {
    picks[select.dataset.role] = Number(select.value);
  });
  const note = document.getElementById("batch-note");
  if (picks.hv < 0) {
    note.className = "note is-warn";
    note.textContent = t("chooseHv");
    return;
  }
  const ductilityErrors = [];
  const forceErrors = [];
  batchResult = batchRows.map((row, index) => {
    const hv = columnValue(row, headers, picks.hv);
    if (hv == null) return null;
    const temper = temperFromRow(row, headers, picks);
    const result = estimate(hv, temper);
    const measuredDuctility = columnValue(row, headers, picks.ductility);
    const measuredForce = columnValue(row, headers, picks.force);
    if (measuredDuctility != null) ductilityErrors.push(Math.abs(measuredDuctility - result.values.ductility));
    if (measuredForce != null) forceErrors.push(Math.abs(measuredForce - result.values.force_avg));
    const converted = convertHardness(hv);
    return {
      row: index + 2,
      hv,
      schedule: temper ? temper.label : "Hardness only",
      ductility: result.values.ductility,
      brittleness: result.values.brittleness,
      force: result.values.force_avg,
      forceMin: result.values.force_min,
      forceMax: result.values.force_max,
      hvMin: result.values.hv_min,
      hvMax: result.values.hv_max,
      hrc: converted ? converted.hrc : null,
      rm: converted ? converted.rm : null,
      impact: impactClass(result.values.ductility),
      measuredDuctility,
      measuredForce,
    };
  }).filter(Boolean);

  if (!batchResult.length) {
    note.className = "note is-warn";
    note.textContent = t("noNumeric");
    return;
  }
  const meanDuctility = batchResult.reduce((sum, item) => sum + item.ductility, 0) / batchResult.length;
  note.className = "note";
  note.textContent = t("rowsRead", { n: formatInt(batchResult.length), duct: formatNumber(meanDuctility, 1) });
  const cards = [
    figure(t("rows"), formatInt(batchResult.length)),
    figure(t("meanDuct"), `${formatNumber(meanDuctility, 1)} %`),
  ];
  if (ductilityErrors.length) {
    const mae = ductilityErrors.reduce((sum, value) => sum + value, 0) / ductilityErrors.length;
    cards.push(figure(t("missDuct"), t("points", { n: formatNumber(mae, 1) })));
  }
  if (forceErrors.length) {
    const mae = forceErrors.reduce((sum, value) => sum + value, 0) / forceErrors.length;
    cards.push(figure(t("missForce"), `${formatInt(mae)} N`));
  }
  document.getElementById("batch-summary").innerHTML = cards.join("");
  const head = document.querySelector("#batch-table thead");
  const body = document.querySelector("#batch-table tbody");
  const showMeasured = batchResult.some((item) => item.measuredDuctility != null);
  head.innerHTML = `<tr><th>${t("thRow")}</th><th>HV10</th><th>${t("thHrc")}</th><th>${t("thTensile")}</th><th>${t("thImpact")}</th><th>${t("thTemperRead")}</th><th>${t("thDuct")}</th>${showMeasured ? `<th>${t("thMeasured")}</th>` : ""}<th>${t("thBrit")}</th><th>${t("thAvg")}</th><th>${t("thMin")}</th><th>${t("thMax")}</th></tr>`;
  body.innerHTML = batchResult.slice(0, 40).map((item) => `
    <tr>
      <td>${item.row}</td>
      <td>${item.hv}</td>
      <td>${item.hrc == null ? "—" : formatNumber(item.hrc, 1)}</td>
      <td>${item.rm == null ? "—" : formatInt(item.rm)}</td>
      <td>${impactLabel(item.impact)}</td>
      <td>${scheduleName(item.schedule)}</td>
      <td>${formatNumber(item.ductility, 1)} %</td>
      ${showMeasured ? `<td>${item.measuredDuctility == null ? "—" : `${formatNumber(item.measuredDuctility, 1)} %`}</td>` : ""}
      <td>${formatNumber(item.brittleness, 1)} %</td>
      <td>${formatForce(item.force)}</td>
      <td>${formatForce(item.forceMin)}</td>
      <td>${formatForce(item.forceMax)}</td>
    </tr>`).join("");
  document.getElementById("batch-wrap").hidden = false;
  document.getElementById("batch-actions").hidden = false;
}

function downloadBatch() {
  const header = ["row", "hv10", "hrc", "tensile_strength_n_mm2", "impact_class", "temper_read", "ductility_pct", "measured_ductility_pct", "brittleness_pct", "force_avg_n", "measured_force_n", "force_min_n", "force_max_n", "hv_min", "hv_max"];
  const lines = [header.join(",")].concat(batchResult.map((item) => [
    item.row,
    item.hv,
    item.hrc == null ? "" : item.hrc.toFixed(1),
    item.rm == null ? "" : Math.round(item.rm),
    item.impact,
    `"${item.schedule}"`,
    item.ductility.toFixed(2),
    item.measuredDuctility == null ? "" : item.measuredDuctility.toFixed(2),
    item.brittleness.toFixed(2),
    Math.round(item.force),
    item.measuredForce == null ? "" : Math.round(item.measuredForce),
    Math.round(item.forceMin),
    Math.round(item.forceMax),
    Math.round(item.hvMin),
    Math.round(item.hvMax),
  ].join(",")));
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "axle-analysis.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

async function loadFile(file) {
  const note = document.getElementById("batch-note");
  try {
    const buffer = await file.arrayBuffer();
    batchRows = rowsFromFile(file, buffer);
    if (!batchRows.length) throw new Error(t("noRows"));
    buildMapper(Object.keys(batchRows[0]));
    runBatch();
  } catch (error) {
    note.className = "note is-warn";
    note.textContent = error.message || t("fileFail");
  }
}

const FIT = [
  { name: "Linear", train: 0.8996, test: 0.900235, rmse: 1.989618, mae: 1.589506, brit: 0.900235, britRmse: 1.989618 },
  { name: "Ridge", train: 0.8996, test: 0.900235, rmse: 1.989618, mae: 1.589506, brit: null, britRmse: null },
  { name: "RF", train: 0.9480, test: 0.898443, rmse: 2.007406, mae: 1.602611, brit: 0.898664, britRmse: 2.005219 },
  { name: "XGB", train: 0.9160, test: 0.898683, rmse: 2.005036, mae: 1.601419, brit: 0.898456, britRmse: 2.007282 },
  { name: "LGB", train: 0.9006, test: 0.900093, rmse: 1.991035, mae: 1.590690, brit: 0.900047, britRmse: 1.991490 },
  { name: "Stack", train: 0.9062, test: 0.899969, rmse: 1.992265, mae: 1.5915, brit: 0.899968, britRmse: 1.992277 },
];

function vizSvg(inner, w, h) {
  return `<svg viewBox="0 0 ${w} ${h}" role="img" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif">${inner}</svg>`;
}

function vizFrame(ymin, ymax) {
  const W = 720;
  const H = 300;
  const L = 52;
  const R = 16;
  const T = 36;
  const B = 34;
  const plotW = W - L - R;
  const plotH = H - T - B;
  const y = (value) => T + ((ymax - value) / (ymax - ymin)) * plotH;
  const slot = plotW / FIT.length;
  const x = (index) => L + slot * index + slot / 2;
  return { W, H, L, R, T, plotW, plotH, y, x };
}

function vizAxis(frame, ticks, digits) {
  const grid = ticks.map((tick) => {
    const yy = frame.y(tick);
    return `<line x1="${frame.L}" x2="${frame.L + frame.plotW}" y1="${yy.toFixed(1)}" y2="${yy.toFixed(1)}" stroke="var(--chart-grid)"/>
      <text x="${frame.L - 8}" y="${(yy + 4).toFixed(1)}" text-anchor="end" fill="var(--muted)" font-size="11">${formatNumber(tick, digits)}</text>`;
  }).join("");
  const names = FIT.map((row, index) => `<text x="${frame.x(index).toFixed(1)}" y="${frame.H - 12}" text-anchor="middle" fill="${row.name === "Ridge" ? "var(--ink)" : "var(--muted)"}" font-size="12" font-weight="${row.name === "Ridge" ? 500 : 400}">${row.name}</text>`).join("");
  return grid + names;
}

function vizLegend(items) {
  return items.map((item, index) => {
    const x = 52 + index * 124;
    const swatch = item.line
      ? `<line x1="${x}" x2="${x + 16}" y1="14" y2="14" stroke="${item.color}" stroke-width="2"/>`
      : `<rect x="${x}" y="8" width="12" height="10" fill="${item.color}"/>`;
    return `${swatch}<text x="${x + 22}" y="17" fill="var(--muted)" font-size="12">${item.label}</text>`;
  }).join("");
}

function vizBar(cx, yValue, yBase, width, color) {
  const top = Math.min(yValue, yBase);
  const height = Math.max(1.5, Math.abs(yBase - yValue));
  return `<rect x="${(cx - width / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${width}" height="${height.toFixed(1)}" fill="${color}"/>`;
}

function chartScore() {
  const ymin = 0;
  const ymax = 118;
  const frame = vizFrame(ymin, ymax);
  const percent = (value) => value * 100;
  const bars = FIT.map((row, index) => {
    const label = `<text x="${frame.x(index).toFixed(1)}" y="48" text-anchor="middle" fill="var(--ink)" font-size="10" font-family="IBM Plex Mono, ui-monospace, monospace">${formatNumber(percent(row.train), 2)} / ${formatNumber(percent(row.test), 2)}</text>`;
    return vizBar(frame.x(index) - 9, frame.y(percent(row.train)), frame.y(0), 16, "var(--duct)") +
      vizBar(frame.x(index) + 9, frame.y(percent(row.test)), frame.y(0), 16, "var(--blue)") +
      label;
  }).join("");
  const y100 = frame.y(100);
  const mark = `<line x1="${frame.L}" x2="${frame.L + frame.plotW}" y1="${y100.toFixed(1)}" y2="${y100.toFixed(1)}" stroke="var(--dash)" stroke-dasharray="4 4"/>`;
  return vizSvg(
    vizLegend([{ label: t("legTrain"), color: "var(--duct)" }, { label: t("legTest"), color: "var(--blue)" }]) +
      vizAxis(frame, [0, 25, 50, 75, 100], 0) + bars + mark,
    frame.W,
    frame.H
  );
}

function chartRmse() {
  const ymin = 1.895;
  const ymax = 2.12;
  const frame = vizFrame(ymin, ymax);
  const bars = FIT.map((row, index) => {
    const pair = row.britRmse != null;
    const duct = vizBar(frame.x(index) + (pair ? -8 : 0), frame.y(row.rmse), frame.y(ymin), 14, "var(--blue)");
    const brit = pair ? vizBar(frame.x(index) + 8, frame.y(row.britRmse), frame.y(ymin), 14, "var(--force)") : "";
    return duct + brit;
  }).join("");
  return vizSvg(vizLegend([{ label: t("legDuct"), color: "var(--blue)" }, { label: t("legBrit"), color: "var(--force)" }]) + vizAxis(frame, [1.9, 1.95, 2, 2.05, 2.1], 2) + bars, frame.W, frame.H);
}

function chartFit() {
  const ymin = 0.888;
  const ymax = 0.962;
  const frame = vizFrame(ymin, ymax);
  const line = (key, color) => {
    const points = FIT.map((row, index) => `${frame.x(index).toFixed(1)},${frame.y(row[key]).toFixed(1)}`).join(" ");
    const dots = FIT.map((row, index) => `<circle cx="${frame.x(index).toFixed(1)}" cy="${frame.y(row[key]).toFixed(1)}" r="${row.name === "RF" && key === "train" ? 6 : 4}" fill="${color}"/>`).join("");
    return `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2"/>${dots}`;
  };
  const y95 = frame.y(0.95);
  const mark = `<line x1="${frame.L}" x2="${frame.L + frame.plotW}" y1="${y95.toFixed(1)}" y2="${y95.toFixed(1)}" stroke="var(--dash)" stroke-dasharray="4 4"/>`;
  return vizSvg(vizLegend([{ label: t("legTrain"), color: "var(--duct)", line: true }, { label: t("legTest"), color: "var(--force)", line: true }]) + vizAxis(frame, [0.89, 0.91, 0.93, 0.95], 2) + mark + line("train", "var(--duct)") + line("test", "var(--force)"), frame.W, frame.H);
}

function chartGap() {
  const ymin = -1.4;
  const ymax = 6.5;
  const frame = vizFrame(ymin, ymax);
  const zero = frame.y(0);
  const bars = FIT.map((row, index) => {
    const gap = (row.train - row.test) * 100;
    const color = gap > 0.5 ? "var(--force)" : "var(--blue)";
    const labelY = gap >= 0 ? frame.y(gap) - 8 : frame.y(gap) + 16;
    return vizBar(frame.x(index), frame.y(gap), zero, 26, color) +
      `<text x="${frame.x(index).toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" fill="var(--ink)" font-size="12" font-family="IBM Plex Mono, ui-monospace, monospace">${formatNumber(gap, 2)}</text>`;
  }).join("");
  const base = `<line x1="${frame.L}" x2="${frame.L + frame.plotW}" y1="${zero.toFixed(1)}" y2="${zero.toFixed(1)}" stroke="var(--ink)"/>`;
  return vizSvg(vizAxis(frame, [-1, 0, 2, 4, 6], 0) + base + bars, frame.W, frame.H);
}

function chartComplex() {
  const W = 720;
  const H = 300;
  const L = 48;
  const R = 20;
  const T = 22;
  const B = 36;
  const xmin = 0;
  const xmax = 10;
  const ymin = 89;
  const ymax = 96;
  const plotW = W - L - R;
  const plotH = H - T - B;
  const x = (value) => L + ((value - xmin) / (xmax - xmin)) * plotW;
  const y = (value) => T + ((ymax - value) / (ymax - ymin)) * plotH;
  const points = [
    { name: "Linear", c: 1, test: 0.900235, dx: -30 },
    { name: "Ridge", c: 1, test: 0.900235, dx: 30 },
    { name: "RF", c: 5, test: 0.898443, dx: 0 },
    { name: "LGB", c: 6, test: 0.900093, dx: 0 },
    { name: "XGB", c: 7, test: 0.898683, dx: 0 },
    { name: "Stack", c: 9, test: 0.899969, dx: 0 },
  ];
  const grid = [89, 91, 93, 95].map((tick) => {
    const yy = y(tick);
    return `<line x1="${L}" x2="${L + plotW}" y1="${yy.toFixed(1)}" y2="${yy.toFixed(1)}" stroke="var(--chart-grid)"/>
      <text x="${L - 8}" y="${(yy + 4).toFixed(1)}" text-anchor="end" fill="var(--muted)" font-size="11">${formatNumber(tick, 0)}</text>`;
  }).join("");
  const xticks = [0, 2, 4, 6, 8, 10].map((tick) => `<text x="${x(tick).toFixed(1)}" y="${H - 12}" text-anchor="middle" fill="var(--muted)" font-size="11">${tick}</text>`).join("");
  const dots = points.map((row) => {
    const cx = x(row.c) + row.dx;
    const cy = y(row.test * 100);
    const color = row.test >= 0.9 ? "var(--duct)" : "var(--force)";
    return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="9" fill="${color}" fill-opacity="0.9" stroke="var(--ink)" stroke-width="1.25"/>
      <text x="${cx.toFixed(1)}" y="${(cy - 18).toFixed(1)}" text-anchor="middle" fill="${row.name === "Ridge" ? "var(--ink)" : "var(--muted)"}" font-size="12" font-weight="${row.name === "Ridge" ? 500 : 400}">${row.name}</text>`;
  }).join("");
  return vizSvg(grid + xticks + dots, W, H);
}

function chartMae() {
  const ymin = 0;
  const ymax = 2.3;
  const frame = vizFrame(ymin, ymax);
  const bars = FIT.map((row, index) => {
    const chosen = row.name === "Ridge";
    const labelY = frame.y(row.mae) - 8;
    return vizBar(frame.x(index), frame.y(row.mae), frame.y(0), 28, chosen ? "var(--blue)" : "var(--hv-ink)") +
      `<text x="${frame.x(index).toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" fill="var(--ink)" font-size="12" font-family="IBM Plex Mono, ui-monospace, monospace">${formatNumber(row.mae, 2)}</text>`;
  }).join("");
  return vizSvg(vizAxis(frame, [0, 0.5, 1, 1.5, 2], 1) + bars, frame.W, frame.H);
}

const TUNE = [
  { name: "XGB", train: 0.9160, test: 0.8987 },
  { name: "XGB tuned", train: 0.9143, test: 0.8991 },
  { name: "LGB", train: 0.9006, test: 0.9001 },
  { name: "LGB tuned", train: 0.9041, test: 0.8998 },
];

const ADV_DUCT = [
  { name: "Linear", train: 0.8996, test: 0.900235 },
  { name: "Ridge", train: 0.8996, test: 0.900235 },
  { name: "XGB", train: 0.9160, test: 0.898683 },
  { name: "XGB tuned", train: 0.9143, test: 0.8991, testDigits: 2 },
  { name: "LGB", train: 0.9006, test: 0.900093 },
  { name: "LGB tuned", train: 0.9041, test: 0.8998, testDigits: 2 },
  { name: "Stack", train: 0.9062, test: 0.899969 },
];

const ADV_BRIT = [
  { name: "Linear", train: 0.8996, test: 0.900235 },
  { name: "Ridge", train: 0.8996, test: 0.900235 },
  { name: "XGB", train: 0.9166, test: 0.898456 },
  { name: "LGB", train: 0.9007, test: 0.900047 },
  { name: "Stack", train: 0.9061, test: 0.899968 },
];

function chartTrainTest(rows) {
  const ymin = 89.6;
  const ymax = 92.6;
  const W = 720;
  const H = 300;
  const L = 58;
  const R = 16;
  const T = 36;
  const B = 36;
  const plotW = W - L - R;
  const plotH = H - T - B;
  const y = (value) => T + ((ymax - value) / (ymax - ymin)) * plotH;
  const slot = plotW / rows.length;
  const x = (index) => L + slot * index + slot / 2;
  const ticks = [90, 91, 92].map((tick) => {
    const yy = y(tick);
    return `<line x1="${L}" x2="${L + plotW}" y1="${yy.toFixed(1)}" y2="${yy.toFixed(1)}" stroke="var(--chart-grid)"/>
      <text x="${L - 8}" y="${(yy + 4).toFixed(1)}" text-anchor="end" fill="var(--muted)" font-size="11">${formatNumber(tick, 0)}</text>`;
  }).join("");
  const names = rows.map((row, index) => {
    const win = row.name === "Linear" || row.name === "Ridge";
    return `<text x="${x(index).toFixed(1)}" y="${H - 12}" text-anchor="middle" fill="${win ? "var(--ink)" : "var(--muted)"}" font-size="12" font-weight="${win ? 500 : 400}">${row.name}</text>`;
  }).join("");
  const bars = rows.map((row, index) => {
    const train = row.train * 100;
    const test = row.test * 100;
    const top = Math.min(y(train), y(test));
    const digits = row.testDigits || 4;
    const label = `<text x="${x(index).toFixed(1)}" y="${(top - 22).toFixed(1)}" text-anchor="middle" fill="var(--ink)" font-size="10" font-family="IBM Plex Mono, ui-monospace, monospace">${formatNumber(train, 2)}</text>
      <text x="${x(index).toFixed(1)}" y="${(top - 10).toFixed(1)}" text-anchor="middle" fill="var(--ink)" font-size="10" font-family="IBM Plex Mono, ui-monospace, monospace">${formatNumber(test, digits)}</text>`;
    return vizBar(x(index) - 9, y(train), y(ymin), 14, "var(--duct)") +
      vizBar(x(index) + 9, y(test), y(ymin), 14, "var(--blue)") +
      label;
  }).join("");
  return vizSvg(
    vizLegend([{ label: t("legTrain"), color: "var(--duct)" }, { label: t("legTest"), color: "var(--blue)" }]) +
      ticks + names + bars,
    W,
    H
  );
}

function chartPairs(rows) {
  const ymin = 0;
  const ymax = 118;
  const W = 720;
  const H = 300;
  const L = 52;
  const R = 16;
  const T = 36;
  const B = 36;
  const plotW = W - L - R;
  const plotH = H - T - B;
  const y = (value) => T + ((ymax - value) / (ymax - ymin)) * plotH;
  const slot = plotW / rows.length;
  const x = (index) => L + slot * index + slot / 2;
  const percent = (value) => value * 100;
  const ticks = [0, 25, 50, 75, 100].map((tick) => {
    const yy = y(tick);
    return `<line x1="${L}" x2="${L + plotW}" y1="${yy.toFixed(1)}" y2="${yy.toFixed(1)}" stroke="var(--chart-grid)"/>
      <text x="${L - 8}" y="${(yy + 4).toFixed(1)}" text-anchor="end" fill="var(--muted)" font-size="11">${formatNumber(tick, 0)}</text>`;
  }).join("");
  const names = rows.map((row, index) => {
    const label = row.key ? t(row.key) : row.name;
    const tuned = row.name.includes("tuned");
    return `<text x="${x(index).toFixed(1)}" y="${H - 12}" text-anchor="middle" fill="${tuned ? "var(--ink)" : "var(--muted)"}" font-size="12" font-weight="${tuned ? 500 : 400}">${label}</text>`;
  }).join("");
  const bars = rows.map((row, index) => {
    const label = `<text x="${x(index).toFixed(1)}" y="48" text-anchor="middle" fill="var(--ink)" font-size="10" font-family="IBM Plex Mono, ui-monospace, monospace">${formatNumber(percent(row.train), 2)} / ${formatNumber(percent(row.test), 2)}</text>`;
    return vizBar(x(index) - 9, y(percent(row.train)), y(0), 16, "var(--duct)") +
      vizBar(x(index) + 9, y(percent(row.test)), y(0), 16, "var(--blue)") +
      label;
  }).join("");
  const y100 = y(100);
  const mark = `<line x1="${L}" x2="${L + plotW}" y1="${y100.toFixed(1)}" y2="${y100.toFixed(1)}" stroke="var(--dash)" stroke-dasharray="4 4"/>`;
  return vizSvg(
    vizLegend([{ label: t("legTrain"), color: "var(--duct)" }, { label: t("legTest"), color: "var(--blue)" }]) +
      ticks + names + bars + mark,
    W,
    H
  );
}

function renderMethod() {
  const mount = (id, html) => {
    const host = document.getElementById(id);
    if (host) host.innerHTML = html;
  };
  mount("c-r2", chartScore());
  mount("c-fit", chartFit());
  mount("c-gap", chartGap());
  mount("c-cx", chartComplex());
  mount("c-mae", chartMae());
  mount("c-tune", chartPairs(TUNE));
  mount("c-adv-duct", chartTrainTest(ADV_DUCT));
  mount("c-adv-brit", chartTrainTest(ADV_BRIT));
}

function show(mode) {
  document.querySelectorAll(".mode").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  });
  document.getElementById("panel-measure").hidden = mode !== "measure";
  document.getElementById("panel-target").hidden = mode !== "target";
  document.getElementById("panel-batch").hidden = mode !== "batch";
  document.getElementById("panel-method").hidden = mode !== "method";
}

function setTheme(theme) {
  THEME = theme === "dark" ? "dark" : "light";
  localStorage.setItem("axle-theme", THEME);
  applyStatic();
}

function setLang(lang) {
  LANG = lang === "de" ? "de" : "en";
  localStorage.setItem("axle-lang", LANG);
  applyStatic();
  renderMethod();
  renderMeasure();
  renderTarget();
  if (batchRows.length) runBatch();
}

function init() {
  applyStatic();
  document.getElementById("theme-light").addEventListener("click", () => setTheme("light"));
  document.getElementById("theme-dark").addEventListener("click", () => setTheme("dark"));
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => setLang(button.dataset.lang));
  });
  document.querySelectorAll(".mode").forEach((button) => {
    button.addEventListener("click", () => show(button.dataset.mode));
  });
  document.getElementById("measure-form").addEventListener("input", renderMeasure);
  document.getElementById("target-form").addEventListener("input", renderTarget);
  document.getElementById("download").addEventListener("click", downloadBatch);
  const drop = document.getElementById("drop");
  const file = document.getElementById("file");
  drop.addEventListener("click", () => file.click());
  drop.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); file.click(); }
  });
  file.addEventListener("change", () => { if (file.files[0]) loadFile(file.files[0]); });
  ["dragover", "dragleave", "drop"].forEach((name) => {
    drop.addEventListener(name, (event) => {
      event.preventDefault();
      drop.classList.toggle("is-hot", name === "dragover");
      if (name === "drop" && event.dataTransfer.files[0]) loadFile(event.dataTransfer.files[0]);
    });
  });
  renderMethod();
  renderMeasure();
  renderTarget();
}

init();
