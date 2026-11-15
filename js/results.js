/* ============================================================
   PHISHLAB — EPISODE 05 · RESULTS & ANALYSIS
   Interactive explorer for the recorded experiment archive.
   Only archived configurations are ever displayed; nothing is
   interpolated, estimated or fabricated.
   ============================================================ */

(() => {
    "use strict";

    /* ============================================================
       1. STATIC DEFINITIONS
       ============================================================ */

    /* Feature-set identifiers exactly as stored in the archive. */
    const FEATURE_SETS = [
        { id: "M1 - Lexical", code: "M1", label: "Lexical", hint: "URL structure & characters" },
        { id: "M2 - Derived", code: "M2", label: "Derived", hint: "Adds statistical signals" },
        { id: "M3 - URL Features", code: "M3", label: "URL Features", hint: "Adds HTTPS usage" },
        { id: "M4 - Page-aware", code: "M4", label: "Page-aware", hint: "Broader page features" },
        { id: "M5 - All numeric", code: "M5", label: "All Numeric", hint: "Complete feature set" }
    ];

    /* Logical grouping used by the model selector. */
    const MODEL_GROUPS = [
        { key: "baseline", label: "Baseline", models: ["Majority Class"] },
        { key: "linear", label: "Linear Models", models: ["Logistic Regression", "Ridge Logistic Regression"] },
        { key: "svm", label: "Support Vector Machines", models: ["Linear SVM"] },
        { key: "tree", label: "Tree Models", models: ["Decision Tree", "Random Forest"] },
        { key: "boosting", label: "Boosting", models: ["Gradient Boosting", "AdaBoost", "XGBoost"] }
    ];

    const MODEL_INFO = {
        "Majority Class": {
            family: "Baseline",
            description: "A simple reference model that always predicts the majority class, providing a baseline against which more sophisticated models can be compared."
        },
        "Logistic Regression": {
            family: "Linear Models",
            description: "A linear classification model that estimates the probability of a URL being phishing using a logistic function applied to a weighted combination of its features."
        },
        "Ridge Logistic Regression": {
            family: "Linear Models",
            description: "A regularized version of logistic regression that uses L2 regularization to control model complexity and reduce overfitting."
        },
        "Linear SVM": {
            family: "Support Vector Machines",
            description: "A linear support vector classifier that separates phishing and legitimate URLs by finding a decision boundary with the largest possible margin."
        },
        "Decision Tree": {
            family: "Tree-Based Models",
            description: "A tree-based classifier that learns a sequence of feature-based decisions to distinguish phishing URLs from legitimate ones."
        },
        "Random Forest": {
            family: "Ensemble · Bagging",
            description: "An ensemble of decision trees trained on different samples and feature subsets, combining their predictions to improve robustness."
        },
        "Gradient Boosting": {
            family: "Ensemble · Boosting",
            description: "An ensemble that builds decision trees sequentially, with each new tree attempting to correct errors made by the preceding ones."
        },
        "AdaBoost": {
            family: "Ensemble · Boosting",
            description: "An adaptive boosting algorithm that combines weak learners while assigning greater importance to samples that previous learners misclassified."
        },
        "XGBoost": {
            family: "Ensemble · Boosting",
            description: "An optimized gradient-boosting algorithm that builds regularized decision trees sequentially to improve predictive performance."
        }
    };

    /* The nine retained models, used by the overall comparison. */
    const RETAINED_MODELS = [
        "Majority Class",
        "Logistic Regression",
        "Ridge Logistic Regression",
        "Linear SVM",
        "Decision Tree",
        "Random Forest",
        "Gradient Boosting",
        "AdaBoost",
        "XGBoost"
    ];

    /* Single unified model explorer. */
    const FAMILIES = {
        explorer: {
            title: "Model Explorer",
            blurb: "Explore model configurations and evaluate performance across feature sets.",
            models: RETAINED_MODELS
        }
    };

    const SPLITS = {
        validation: { id: "validation", label: "Validation", note: "Archived tuning window" },
        test: { id: "test", label: "Test", note: "Held-out final evaluation" }
    };

    const ANALYSIS_VIEWS = [
        { id: "metrics", label: "Metric comparison" },
        { id: "errors", label: "Classification errors" },
        { id: "configs", label: "Top configurations" }
    ];

    /* Archive locations (relative to the site root). */
    const VALIDATION_SOURCES = [
        "results/Baseline Models",
        "results/Ridge Logistic Regression",
        "results/Linear SVM",
        "results/Decision Trees",
        "results/Random Forests",
        "results/Gradient Boosting",
        "results/Ada Boosting",
        "results/XG Boosting"
    ];

    const TEST_SOURCES = {
        results: "results/Final_Tests/final_45_test_results.json",
        matrices: "results/Final_Tests/final_45_test_confusion_matrices.json"
    };

    /* Hyperparameters that were actually tuned, derived from the
       validation archive. Everything else is a fixed configuration. */
    const TUNED_KEYS = {
        "Logistic Regression": [],
        "Ridge Logistic Regression": ["C"],
        "Linear SVM": ["C"],
        "Decision Tree": ["criterion", "max_depth", "min_samples_leaf"],
        "Random Forest": ["n_estimators", "max_depth", "min_samples_leaf"],
        "Gradient Boosting": ["n_estimators", "learning_rate", "max_depth"],
        "AdaBoost": ["n_estimators", "learning_rate"],
        "XGBoost": ["n_estimators", "learning_rate", "max_depth"],
        "Majority Class": []
    };

    const PARAM_META = {
        C: { label: "Regularization strength (C)", short: "C", kind: "numeric" },
        max_depth: { label: "Maximum tree depth", short: "depth", kind: "numeric" },
        min_samples_leaf: { label: "Minimum samples per leaf", short: "leaf", kind: "numeric" },
        criterion: { label: "Split criterion", short: "criterion", kind: "choice" },
        n_estimators: { label: "Number of estimators", short: "trees", kind: "numeric" },
        learning_rate: { label: "Learning rate", short: "lr", kind: "numeric" },
        penalty: { label: "Penalty", short: "penalty" },
        solver: { label: "Solver", short: "solver" },
        max_iter: { label: "Max iterations", short: "max_iter" },
        loss: { label: "Loss", short: "loss" },
        dual: { label: "Dual formulation", short: "dual" },
        max_features: { label: "Max features", short: "max_features" },
        subsample: { label: "Subsample", short: "subsample" },
        bootstrap: { label: "Bootstrap", short: "bootstrap" },
        oob_score: { label: "Out-of-bag score", short: "oob_score" },
        class_weight: { label: "Class weight", short: "class_weight" },
        strategy: { label: "Strategy", short: "strategy" },
        random_state: { label: "Random state", short: "random_state" }
    };

    const FIXED_KEY_ORDER = [
        "penalty", "solver", "max_iter", "loss", "dual", "criterion",
        "max_features", "subsample", "bootstrap", "oob_score",
        "class_weight", "strategy", "random_state"
    ];

    const MATRIX_ORIENTATION = "[[TP, FN], [FP, TN]]";

    /* ============================================================
       2. RUNTIME STATE
       ============================================================ */

    const archive = {
        validation: [],
        matrices: [],
        test: [],
        testMatrices: {}
    };

    const indexes = {
        validationByModelFeature: new Map(),
        validationMatrixById: new Map(),
        testByModelFeature: new Map(),
        testMatrixByKey: new Map()
    };

    const dashboards = {};

    /* ============================================================
       3. UTILITIES
       ============================================================ */

    function escapeHTML(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function percent(value) {
        const n = Number(value);
        return Number.isFinite(n) ? `${(n * 100).toFixed(2)}%` : "—";
    }

    function integer(value) {
        const n = Number(value);
        return Number.isFinite(n) ? n.toLocaleString("en-US") : "—";
    }

    function seconds(value) {
        const n = Number(value);
        if (!Number.isFinite(n)) return "—";
        if (n < 1) return `${(n * 1000).toFixed(0)} ms`;
        if (n < 60) return `${n.toFixed(2)} s`;
        return `${(n / 60).toFixed(1)} min`;
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function mean(values) {
        const list = values.filter(v => Number.isFinite(Number(v))).map(Number);
        if (!list.length) return null;
        return list.reduce((sum, v) => sum + v, 0) / list.length;
    }

    function parseParams(record) {
        let params = record?.hyperparameters;

        if (typeof params === "string") {
            try {
                params = JSON.parse(params);
            } catch {
                params = {};
            }
        }

        return params && typeof params === "object" ? params : {};
    }

    /* Stable string used to compare JSON-ish values (numbers, strings, null). */
    function valueKey(value) {
        if (value === null || value === undefined) return "null";
        if (typeof value === "number") return `n:${value}`;
        if (typeof value === "boolean") return `b:${value}`;
        return `s:${String(value)}`;
    }

    function formatValue(value) {
        if (value === null || value === undefined) return "None";
        if (typeof value === "boolean") return value ? "True" : "False";
        return String(value);
    }

    function paramLabel(key) {
        return PARAM_META[key]?.label || key.replaceAll("_", " ");
    }

    function paramShort(key) {
        return PARAM_META[key]?.short || key;
    }

    function featureByCode(code) {
        return FEATURE_SETS.find(fs => fs.code === code) || FEATURE_SETS[0];
    }

    function featureLabel(id) {
        return FEATURE_SETS.find(fs => fs.id === id)?.label || id;
    }

    function modelFeatureKey(model, featureSet) {
        return `${model} || ${featureSet}`;
    }

    /* Sort option values: numeric ascending first, then text, null last. */
    function sortOptionValues(values) {
        const numeric = values.filter(v => typeof v === "number").sort((a, b) => a - b);
        const text = values.filter(v => typeof v === "string").sort((a, b) => a.localeCompare(b));
        const nullish = values.filter(v => v === null || v === undefined);
        return [...numeric, ...text, ...nullish];
    }

    /* ============================================================
       4. DATA LOADING
       ============================================================ */

    async function fetchJSON(path) {
        const response = await fetch(encodeURI(path));

        if (!response.ok) {
            throw new Error(`Could not load ${path} (HTTP ${response.status})`);
        }

        return response.json();
    }

    function normalizeMatrices(data) {
        if (Array.isArray(data)) return data;
        if (data && typeof data === "object") {
            return Object.entries(data).map(([key, value]) => ({ ...value, matrix_key: key }));
        }
        return [];
    }

    async function loadArchive() {
        const [resultGroups, matrixGroups, testResults, testMatrices] = await Promise.all([
            Promise.all(VALIDATION_SOURCES.map(folder => fetchJSON(`${folder}/all_results.json`))),
            Promise.all(VALIDATION_SOURCES.map(folder => fetchJSON(`${folder}/all_confusion_matrices.json`))),
            fetchJSON(TEST_SOURCES.results),
            fetchJSON(TEST_SOURCES.matrices)
        ]);

        archive.validation = resultGroups.flat();
        archive.matrices = matrixGroups.flatMap(normalizeMatrices);
        archive.test = testResults;
        archive.testMatrices = testMatrices;

        buildIndexes();
    }

    function buildIndexes() {
        indexes.validationByModelFeature.clear();
        indexes.validationMatrixById.clear();
        indexes.testByModelFeature.clear();
        indexes.testMatrixByKey.clear();

        archive.validation.forEach(record => {
            const key = modelFeatureKey(record.model, record.feature_set);
            if (!indexes.validationByModelFeature.has(key)) {
                indexes.validationByModelFeature.set(key, []);
            }
            indexes.validationByModelFeature.get(key).push(record);
        });

        archive.matrices.forEach(record => {
            if (record?.experiment_id) {
                indexes.validationMatrixById.set(record.experiment_id, record.confusion_matrix || null);
            }
        });

        archive.test.forEach(record => {
            indexes.testByModelFeature.set(modelFeatureKey(record.model, record.feature_set), record);
        });

        Object.entries(archive.testMatrices).forEach(([key, value]) => {
            indexes.testMatrixByKey.set(key, value?.confusion_matrix || null);
        });
    }

    /* ============================================================
       5. ARCHIVE QUERIES
       ============================================================ */

    function validationRecords(model, featureSet) {
        return indexes.validationByModelFeature.get(modelFeatureKey(model, featureSet)) || [];
    }

    function tuningRecords(records) {
        return records.filter(record => record.experiment_type === "Hyperparameter Tuning");
    }

    function tunedKeys(model) {
        return TUNED_KEYS[model] || [];
    }

    function testRecord(model, featureSet) {
        return indexes.testByModelFeature.get(modelFeatureKey(model, featureSet)) || null;
    }

    function validationMatrix(experimentId) {
        return indexes.validationMatrixById.get(experimentId) || null;
    }

    function testMatrix(model, featureSet) {
        return indexes.testMatrixByKey.get(modelFeatureKey(model, featureSet)) || null;
    }

    /* Distinct archived values for a tuned parameter (from tuning records only). */
    function parameterOptions(model, featureSet, key) {
        const records = tuningRecords(validationRecords(model, featureSet));
        const seen = new Map();

        records.forEach(record => {
            const params = parseParams(record);
            if (Object.hasOwn(params, key)) {
                seen.set(valueKey(params[key]), params[key]);
            }
        });

        return sortOptionValues([...seen.values()]);
    }

    /* Interactive parameters = tuned keys with more than one archived value. */
    function interactiveParameters(model, featureSet) {
        return tunedKeys(model).map(key => {
            const options = parameterOptions(model, featureSet, key);
            return {
                key,
                label: paramLabel(key),
                kind: PARAM_META[key]?.kind || "numeric",
                options
            };
        }).filter(parameter => parameter.options.length > 0);
    }

    /* Read-only parameters = constant, meaningful values during experimentation. */
    function fixedParameters(model, featureSet) {
        const records = validationRecords(model, featureSet);
        const source = tuningRecords(records).length ? tuningRecords(records) : records;
        const tuned = new Set(tunedKeys(model));
        const result = [];

        FIXED_KEY_ORDER.forEach(key => {
            if (tuned.has(key)) return;

            const values = new Map();

            source.forEach(record => {
                const params = parseParams(record);
                if (Object.hasOwn(params, key)) {
                    values.set(valueKey(params[key]), params[key]);
                }
            });

            if (values.size === 1) {
                result.push({ key, label: paramLabel(key), value: [...values.values()][0] });
            }
        });

        return result;
    }

    /* Find the archived experiment whose tuned parameters match the config. */
    function matchRecord(model, featureSet, config) {
        const keys = tunedKeys(model);
        const records = validationRecords(model, featureSet);

        const matches = records.filter(record => {
            const params = parseParams(record);
            return keys.every(key => valueKey(params[key]) === valueKey(config?.[key]));
        });

        if (!matches.length) return null;

        return matches.sort((a, b) => {
            const tunedA = a.experiment_type === "Hyperparameter Tuning" ? 0 : 1;
            const tunedB = b.experiment_type === "Hyperparameter Tuning" ? 0 : 1;
            if (tunedA !== tunedB) return tunedA - tunedB;
            return Number(b.validation_accuracy) - Number(a.validation_accuracy);
        })[0];
    }

    /* Default configuration for a model + feature set (reachable via sliders). */
    function defaultConfig(model, featureSet) {
        const records = validationRecords(model, featureSet);
        const pool = tuningRecords(records).length ? tuningRecords(records) : records;

        if (!pool.length) return {};

        const best = [...pool].sort(
            (a, b) => Number(b.validation_accuracy) - Number(a.validation_accuracy)
        )[0];

        const params = parseParams(best);
        const config = {};
        tunedKeys(model).forEach(key => { config[key] = params[key]; });
        return config;
    }

    function bestRecord(records, metric) {
        if (!records.length) return null;

        return [...records].sort((a, b) => {
            const primary = Number(b[metric]) - Number(a[metric]);
            if (primary) return primary;
            const accuracy = Number(b.validation_accuracy) - Number(a.validation_accuracy);
            if (accuracy) return accuracy;
            return String(a.model).localeCompare(String(b.model));
        })[0];
    }

    /* ============================================================
       6. METRICS
       ============================================================ */

    function precisionFromMatrix(matrix) {
        if (!Array.isArray(matrix?.[0]) || !Array.isArray(matrix?.[1])) return null;

        const truePositive = Number(matrix[0][0]);
        const falsePositive = Number(matrix[1][0]);
        const denominator = truePositive + falsePositive;

        return denominator === 0 ? 0 : truePositive / denominator;
    }

    function validationMetrics(record, matrix) {
        if (!record) return null;

        return {
            accuracy: record.validation_accuracy,
            balancedAccuracy: record.balanced_accuracy,
            phishingRecall: record.phishing_recall,
            phishingPrecision: precisionFromMatrix(matrix),
            missedPhishing: record.missed_phishing,
            falseAlarms: record.false_alarms,
            trainingTime: record.training_time_seconds
        };
    }

    function testMetrics(record, matrix) {
        if (!record) return null;

        return {
            accuracy: record.test_accuracy,
            balancedAccuracy: record.test_balanced_accuracy,
            phishingRecall: record.test_phishing_recall,
            phishingPrecision: record.test_phishing_precision ?? precisionFromMatrix(matrix),
            missedPhishing: record.test_missed_phishing,
            falseAlarms: record.test_false_alarms,
            trainingTime: record.training_time_seconds
        };
    }

    /* Resolve what the current dashboard state points at. */
    function resolveSelection(state) {
        if (state.split === "test") {
            const record = testRecord(state.model, state.featureSet);

            if (!record) return { split: "test", matched: false, record: null, matrix: null, metrics: null };

            const matrix = record.test_confusion_matrix || testMatrix(state.model, state.featureSet);
            return {
                split: "test",
                matched: true,
                record,
                matrix,
                metrics: testMetrics(record, matrix)
            };
        }

        const record = matchRecord(state.model, state.featureSet, state.config);

        if (!record) return { split: "validation", matched: false, record: null, matrix: null, metrics: null };

        const matrix = validationMatrix(record.experiment_id);
        return {
            split: "validation",
            matched: true,
            record,
            matrix,
            metrics: validationMetrics(record, matrix)
        };
    }

    /* ============================================================
       7. SHARED RENDER HELPERS
       ============================================================ */

    function barChart(items, options = {}) {
        const maximum = options.maximum
            || Math.max(1, ...items.map(item => Math.abs(Number(item.value)) || 0));

        return `
            <div class="rd-chart">
                ${items.map(item => {
            const value = Number(item.value);
            const valid = Number.isFinite(value);
            const width = valid && maximum
                ? clamp((Math.abs(value) / maximum) * 100, 0, 100)
                : 0;

            return `
                        <div class="rd-chart__row">
                            <span class="rd-chart__label" title="${escapeHTML(item.label)}">
                                ${escapeHTML(item.label)}
                            </span>
                            <span class="rd-chart__track">
                                <span class="rd-chart__bar${item.tone ? ` is-${item.tone}` : ""}"
                                    style="width:${width}%"></span>
                            </span>
                            <span class="rd-chart__value">
                                ${item.display !== undefined
                    ? escapeHTML(item.display)
                    : (valid ? integer(value) : "—")}
                            </span>
                        </div>
                    `;
        }).join("")}
            </div>
        `;
    }

    function emptyState(message) {
        return `<div class="rd-empty">${escapeHTML(message)}</div>`;
    }

    function panel(title, description, body, options = {}) {
        return `
            <section class="rd-panel${options.accent ? " is-accent" : ""}${options.tone ? ` is-${options.tone}` : ""}"
                ${options.region ? `data-region="${options.region}"` : ""}>
                <header class="rd-panel__head">
                    <div>
                        <h4>${escapeHTML(title)}</h4>
                        ${description ? `<p>${description}</p>` : ""}
                    </div>
                    ${options.tag ? `<span class="rd-tag${options.tagTone ? ` is-${options.tagTone}` : ""}">${escapeHTML(options.tag)}</span>` : ""}
                </header>
                <div class="rd-panel__body">${body}</div>
            </section>
        `;
    }

    function configSummary(record, keys) {
        const params = parseParams(record);
        const parts = keys
            .filter(key => Object.hasOwn(params, key))
            .map(key => `${paramShort(key)} ${formatValue(params[key])}`);

        return parts.length ? parts.join(" · ") : "Default configuration";
    }

    /* ============================================================
       8. DASHBOARD RENDERING
       ============================================================ */

    function modelSelectorMarkup(current, allowed) {
        const groups = MODEL_GROUPS
            .map(group => ({
                label: group.label,
                models: group.models.filter(model => allowed.includes(model))
            }))
            .filter(group => group.models.length);

        return groups.map(group => `
            <optgroup label="${escapeHTML(group.label)}">
                ${group.models.map(model => `
                    <option value="${escapeHTML(model)}" ${model === current ? "selected" : ""}>
                        ${escapeHTML(model)}
                    </option>
                `).join("")}
            </optgroup>
        `).join("");
    }

    function renderShell(familyKey) {
        const entry = dashboards[familyKey];
        const family = FAMILIES[familyKey];
        const state = entry.state;

        entry.el.innerHTML = `
            <div class="rd-dashboard${state.split === "test" ? " mode-test" : ""}" data-role="root">
                <header class="rd-head">
                    <div class="rd-head__titles">
                        <span class="rd-eyebrow">MODEL EXPLORER</span>
                        <h3>${escapeHTML(family.title)}</h3>
                        <p>${escapeHTML(family.blurb)}</p>
                    </div>
                    <span class="rd-mode-badge" data-role="mode-badge">
                        ${state.split === "test" ? "TEST SET" : "VALIDATION"}
                    </span>
                </header>

                <div class="rd-toolbar">
                    <label class="rd-field">
                        <span class="rd-field__label">Model</span>
                        <select class="rd-select" data-action="model">
                            ${modelSelectorMarkup(state.model, family.models)}
                        </select>
                    </label>

                    <div class="rd-split" role="group" aria-label="Evaluation split">
                        ${Object.values(SPLITS).map(split => `
                            <button type="button"
                                class="rd-split__button${state.split === split.id ? " is-active" : ""}"
                                data-action="split"
                                data-value="${split.id}"
                                aria-pressed="${state.split === split.id}">
                                ${escapeHTML(split.label)}
                            </button>
                        `).join("")}
                    </div>
                </div>
                <div class="rd-model-identity">
                    <span class="rd-model-identity__family">
                        ${escapeHTML(MODEL_INFO[state.model]?.family || "Model")}
                    </span>
                    <h4>${escapeHTML(state.model)}</h4>
                    <p>${escapeHTML(MODEL_INFO[state.model]?.description || "")}</p>
                </div>
                <div class="rd-features" role="tablist" aria-label="Feature sets">
                    ${FEATURE_SETS.map(fs => `
                        <button type="button"
                            class="rd-feature${state.featureSet === fs.id ? " is-active" : ""}"
                            data-action="feature"
                            data-value="${escapeHTML(fs.id)}"
                            role="tab"
                            aria-selected="${state.featureSet === fs.id}">
                            <span class="rd-feature__code">${fs.code}</span>
                            <span class="rd-feature__label">${escapeHTML(fs.label)}</span>
                        </button>
                    `).join("")}
                </div>

                <div class="rd-workspace">
                    <div class="rd-col rd-col--left">
                        <section class="rd-panel rd-panel--controls" data-region="controls"></section>
                        <section class="rd-panel" data-region="analysis"></section>
                        <section class="rd-panel" data-region="best"></section>
                    </div>
                    <div class="rd-col rd-col--right">
                        <section class="rd-panel" data-region="metrics"></section>
                        <section class="rd-panel" data-region="matrix"></section>
                        <section class="rd-panel" data-region="meta"></section>
                    </div>
                </div>
            </div>
        `;

        renderControls(familyKey);
        renderDynamic(familyKey);
    }

    /* ---------- Controls ---------- */

    function sliderMarkup(parameter, currentIndex) {
        const count = parameter.options.length;
        const max = Math.max(0, count - 1);
        const index = clamp(currentIndex, 0, max);
        const fill = max === 0 ? 100 : (index / max) * 100;
        const current = parameter.options[index];

        return `
            <div class="rd-param" data-param="${escapeHTML(parameter.key)}" data-kind="numeric">
                <div class="rd-param__head">
                    <span class="rd-param__label">${escapeHTML(parameter.label)}</span>
                    <span class="rd-param__value" data-role="param-value">${escapeHTML(formatValue(current))}</span>
                </div>
                <input
                    class="rd-range"
                    type="range"
                    min="0"
                    max="${max}"
                    step="1"
                    value="${index}"
                    data-action="slider"
                    data-param="${escapeHTML(parameter.key)}"
                    aria-label="${escapeHTML(parameter.label)}"
                    aria-valuetext="${escapeHTML(formatValue(current))}"
                    style="--fill:${fill}%"
                    ${count <= 1 ? "disabled" : ""}>
                <div class="rd-param__ticks" aria-hidden="true">
                    ${parameter.options.map((option, i) => `
                        <span class="rd-tick${i === index ? " is-current" : ""}">
                            ${escapeHTML(formatValue(option))}
                        </span>
                    `).join("")}
                </div>
            </div>
        `;
    }

    function choiceMarkup(parameter, currentKey) {
        const selected = parameter.options.find(
            option => valueKey(option) === currentKey
        );

        return `
        <div class="rd-param" data-param="${escapeHTML(parameter.key)}" data-kind="choice">
            <div class="rd-param__head">
                <span class="rd-param__label">${escapeHTML(parameter.label)}</span>
                <span class="rd-param__value" data-role="param-value">
                    ${escapeHTML(formatValue(selected))}
                </span>
            </div>
            <div class="rd-options" role="group" aria-label="${escapeHTML(parameter.label)}">
                ${parameter.options.map(option => `
                    <button type="button"
                        class="rd-option${valueKey(option) === currentKey ? " is-active" : ""}"
                        data-action="param-option"
                        data-param="${escapeHTML(parameter.key)}"
                        data-value="${escapeHTML(valueKey(option))}"
                        aria-pressed="${valueKey(option) === currentKey}">
                        ${escapeHTML(formatValue(option))}
                    </button>
                `).join("")}
            </div>
        </div>
    `;
    }

    function renderControls(familyKey) {
        const entry = dashboards[familyKey];
        const state = entry.state;
        const container = entry.el.querySelector('[data-region="controls"]');
        if (!container) return;

        const interactive = interactiveParameters(state.model, state.featureSet);
        const fixed = fixedParameters(state.model, state.featureSet);
        console.log("Model:", state.model);
        console.log("Variable parameters:", interactive);
        console.log("Fixed parameters:", fixed);

        let headNote;
        let body;

        if (state.split === "test") {
            const record = testRecord(state.model, state.featureSet);

            headNote = "The best-performing configuration was selected using validation data. "
                + "The model was then refitted on the combined training and validation datasets "
                + "and evaluated on the held-out test set.";
            body = record
                ? `
                    <div class="rd-lock">
                        <div class="rd-lock__icon">
                            <span aria-hidden="true">✓</span>
                        </div>

                        <div>
                            <strong>Final Model Evaluation</strong>
                            <p>
                                ${escapeHTML(state.model)} · ${escapeHTML(featureLabel(state.featureSet))}.
                                This configuration was selected using validation data,
                                refitted on the combined training and validation datasets,
                                and evaluated on the held-out test set.
                            </p>
                        </div>
                    </div>

                    <div class="rd-fixed">
                        <span class="rd-fixed__title">Selected Configuration</span>
                        <div class="rd-fixed__grid">
                            ${Object.entries(record.hyperparameters || {})
                    .filter(([, value]) => value !== null && value !== undefined)
                    .map(([key, value]) => `
                                    <div class="rd-fixed__item">
                                        <span>${escapeHTML(key)}</span>
                                        <strong>${escapeHTML(formatValue(value))}</strong>
                                    </div>
                                `).join("")}
                        </div>
                    </div>
                `
                : emptyState("No final test evaluation exists for this model and feature set.");
        } else if (!interactive.length && !fixed.length) {
            headNote = "Configuration controls";
            body = emptyState("No archived configuration is available for this selection.");
        } else {
            headNote = interactive.length
                ? "Adjust the genuinely tuned hyperparameters to explore archived experiments."
                : "This model has no tuned hyperparameters. Its configuration is fixed.";

            body = `
        ${interactive.length ? `
            <div class="rd-params">
                <span class="rd-fixed__title">Variable Hyperparameters</span>
                ${interactive.map(parameter => {
                const currentKey = valueKey(state.config?.[parameter.key]);
                const index = parameter.options.findIndex(
                    option => valueKey(option) === currentKey
                );

                return parameter.kind === "choice"
                    ? choiceMarkup(parameter, currentKey)
                    : sliderMarkup(parameter, index === -1 ? 0 : index);
            }).join("")}
            </div>
        ` : emptyState("No tunable hyperparameters.")}

        ${fixed.length ? `
            <div class="rd-fixed">
                <span class="rd-fixed__title">Fixed Hyperparameters</span>
                <div class="rd-fixed__grid">
                    ${fixed.map(item => `
                        <div class="rd-fixed__item">
                            <span>${escapeHTML(item.label)}</span>
                            <strong>${escapeHTML(formatValue(item.value))}</strong>
                        </div>
                    `).join("")}
                </div>
            </div>
        ` : ""}
    `;
        }

        container.innerHTML = `
            <header class="rd-panel__head">
                <div>
                    <h4>Hyperparameter Configuration</h4>
                    <p>${escapeHTML(headNote)}</p>
                </div>
                <span class="rd-tag${state.split === "test" ? " is-test" : ""}">
                    ${state.split === "test" ? "FINAL EVALUATION" : "INTERACTIVE"}
                </span>
            </header>

            <div class="rd-panel__body">
                ${body}
            </div>
        `;
    }

    function lockedConfigMarkup(record) {
        const params = parseParams(record);
        const keys = [...new Set([...tunedKeys(record.model), ...Object.keys(params)])];

        return `
            <div class="rd-fixed">
                <span class="rd-fixed__title">Frozen configuration</span>
                <div class="rd-fixed__grid">
                    ${keys.map(key => `
                        <div class="rd-fixed__item">
                            <span>${escapeHTML(paramLabel(key))}</span>
                            <strong>${escapeHTML(formatValue(params[key]))}</strong>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    }

    function fixedMarkup(fixed) {
        if (!fixed.length) return "";

        return `
            <div class="rd-fixed">
                <span class="rd-fixed__title">Fixed during experimentation</span>
                <div class="rd-fixed__grid">
                    ${fixed.map(item => `
                        <div class="rd-fixed__item">
                            <span>${escapeHTML(item.label)}</span>
                            <strong>${escapeHTML(formatValue(item.value))}</strong>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    }

    /* ---------- Analysis ---------- */

    function renderAnalysis(familyKey, selection) {
        const entry = dashboards[familyKey];
        const state = entry.state;
        const container = entry.el.querySelector('[data-region="analysis"]');
        if (!container) return;

        container.innerHTML = `
            <header class="rd-panel__head rd-panel__head--split">
                <div>
                    <h4>Analysis</h4>
                    <p>${escapeHTML(analysisSubtitle(state, selection))}</p>
                </div>
                <div class="rd-segmented" role="group" aria-label="Analysis graph">
                    ${ANALYSIS_VIEWS.map(view => `
                        <button type="button"
                            class="rd-segmented__button${state.analysis === view.id ? " is-active" : ""}"
                            data-action="analysis"
                            data-value="${view.id}"
                            aria-pressed="${state.analysis === view.id}">
                            ${escapeHTML(view.label)}
                        </button>
                    `).join("")}
                </div>
            </header>
            <div class="rd-panel__body">
                ${renderAnalysisBody(state, selection)}
            </div>
        `;
    }

    function analysisSubtitle(state, selection) {
        if (state.analysis === "configs") {
            return state.split === "test"
                ? "Validation-based comparison of the top archived configurations."
                : `Ranked archived configurations for ${state.model}.`;
        }
        if (!selection.matched) return "Select an evaluated configuration to inspect its metrics.";
        return state.split === "test"
            ? "Metrics from the held-out test evaluation."
            : "Metrics from the archived validation experiment.";
    }

    function renderAnalysisBody(state, selection) {
        const view = state.analysis;

        if (view === "configs") {
            return topConfigurationsChart(state);
        }

        if (!selection.matched || !selection.metrics) {
            return emptyState("Configuration not evaluated — no archived experiment matches this selection.");
        }

        const metrics = selection.metrics;

        if (view === "errors") {
            const total = Number(metrics.missedPhishing || 0) + Number(metrics.falseAlarms || 0);
            return `
                ${barChart([
                { label: "Missed phishing", value: metrics.missedPhishing, tone: "warn", display: integer(metrics.missedPhishing) },
                { label: "False alarms", value: metrics.falseAlarms, tone: "danger", display: integer(metrics.falseAlarms) }
            ])}
                <p class="rd-caption">
                    Total classification errors: <strong>${integer(total)}</strong>.
                    Missed phishing are phishing URLs predicted legitimate; false alarms are
                    legitimate URLs predicted phishing.
                </p>
            `;
        }

        const items = [
            { label: "Accuracy", value: metrics.accuracy, display: percent(metrics.accuracy) },
            { label: "Balanced accuracy", value: metrics.balancedAccuracy, display: percent(metrics.balancedAccuracy) },
            { label: "Phishing recall", value: metrics.phishingRecall, display: percent(metrics.phishingRecall) },
            { label: "Phishing precision", value: metrics.phishingPrecision, display: percent(metrics.phishingPrecision) }
        ];

        return `
            ${barChart(items.map(item => ({ ...item, value: Number(item.value) * 100 })), { maximum: 100 })}
            <p class="rd-caption">
                Rate metrics are shown on a 0–100% scale for the current ${state.split} evaluation.
            </p>
        `;
    }

    function topConfigurationsChart(state) {
        const records = validationRecords(state.model, state.featureSet);
        const pool = tuningRecords(records).length ? tuningRecords(records) : records;

        if (!pool.length) {
            return emptyState("No archived validation configurations are available for this model and feature set.");
        }

        const top = [...pool]
            .sort((a, b) => Number(b.validation_accuracy) - Number(a.validation_accuracy))
            .slice(0, 8);

        const items = top.map(record => ({
            label: configSummary(record, tunedKeys(state.model)),
            value: Number(record.validation_accuracy) * 100,
            display: percent(record.validation_accuracy)
        }));

        return `
            ${barChart(items, { maximum: 100 })}
            <p class="rd-caption">
                Best archived validation configurations ranked by validation accuracy
                ${state.split === "test" ? "<strong>(validation-based comparison)</strong>" : ""}.
                ${tunedKeys(state.model).length ? "" : "This model has a single fixed configuration."}
            </p>
        `;
    }

    /* ---------- Best validation configurations ---------- */

    function bestCard(title, description, record, metric) {
        if (!record) {
            return `
                <article class="rd-best">
                    <span class="rd-best__kicker">${escapeHTML(title)}</span>
                    <p class="rd-best__desc">${escapeHTML(description)}</p>
                    ${emptyState("No recorded configuration.")}
                </article>
            `;
        }

        return `
            <article class="rd-best">
                <span class="rd-best__kicker">${escapeHTML(title)}</span>
                <strong class="rd-best__value">${percent(record[metric])}</strong>
                <p class="rd-best__desc">${escapeHTML(record.model)} · ${escapeHTML(featureLabel(record.feature_set))}</p>
                <div class="rd-best__params">
                    ${tunedKeys(record.model).length
                ? tunedKeys(record.model).map(key => `
                            <span>${escapeHTML(paramLabel(key))} <b>${escapeHTML(formatValue(parseParams(record)[key]))}</b></span>
                        `).join("")
                : `<span>Configuration <b>Default</b></span>`}
                </div>
            </article>
        `;
    }

    function renderBestConfigs(familyKey) {
        const entry = dashboards[familyKey];
        const state = entry.state;
        const container = entry.el.querySelector('[data-region="best"]');
        if (!container) return;

        const records = validationRecords(state.model, state.featureSet);

        if (!records.length) {
            container.innerHTML = `
                <header class="rd-panel__head"><div><h4>Best validation configurations</h4></div></header>
                <div class="rd-panel__body">
                    ${emptyState("No validation experiments are available for this selection.")}
                </div>
            `;
            return;
        }

        const cards = [
            ["Best accuracy", "Highest overall classification accuracy.", bestRecord(records, "validation_accuracy"), "validation_accuracy"],
            ["Best balanced accuracy", "Highest mean recall across both classes.", bestRecord(records, "balanced_accuracy"), "balanced_accuracy"],
            ["Best phishing recall", "Highest share of phishing URLs detected.", bestRecord(records, "phishing_recall"), "phishing_recall"]
        ];

        const inTestMode = state.split === "test";

        container.innerHTML = `
            <header class="rd-panel__head">
                <div>
                    <h4>Best validation configurations</h4>
                    <p>
                        Best archived configurations for
                        <strong>${escapeHTML(state.model)}</strong> on
                        <strong>${escapeHTML(featureLabel(state.featureSet))}</strong>.
                        ${inTestMode ? " Validation archive · reference only." : ""}
                    </p>
                </div>
                <span class="rd-tag">VALIDATION</span>
            </header>
            <div class="rd-panel__body">
                <div class="rd-best__grid">
                    ${cards.map(([title, description, record, metric]) => bestCard(title, description, record, metric)).join("")}
                </div>
                <p class="rd-caption">
                    Each highlight is selected independently for its metric, so the three cards may
                    carry different hyperparameters. Values are read directly from the validation archive.
                </p>
            </div>
        `;
    }

    /* ---------- Metric cards ---------- */

    function renderMetricCards(familyKey, selection) {
        const entry = dashboards[familyKey];
        const state = entry.state;
        const container = entry.el.querySelector('[data-region="metrics"]');
        if (!container) return;

        if (!selection.matched || !selection.metrics) {
            container.innerHTML = `
                <header class="rd-panel__head">
                    <div><h4>Evaluation results</h4></div>
                </header>
                <div class="rd-panel__body">
                    ${emptyState(state.split === "test"
                ? "No final test evaluation is available for this model and feature set."
                : "Configuration not evaluated — choose a combination present in the archive.")}
                </div>
            `;
            return;
        }

        const metrics = selection.metrics;

        const cards = [
            ["Accuracy", percent(metrics.accuracy), "Overall correctness", "rate"],
            ["Balanced accuracy", percent(metrics.balancedAccuracy), "Mean recall across classes", "rate"],
            ["Phishing recall", percent(metrics.phishingRecall), "Phishing URLs detected", "rate"],
            ["Phishing precision", percent(metrics.phishingPrecision), "Predicted phishing that is correct", "rate"],
            ["Missed phishing", integer(metrics.missedPhishing), "Phishing predicted legitimate", "count"],
            ["False alarms", integer(metrics.falseAlarms), "Legitimate predicted phishing", "count"]
        ];

        container.innerHTML = `
            <header class="rd-panel__head">
                <div>
                    <h4>Performance metrics</h4>
                    <p>${selection.split === "test" ? "Held-out test evaluation." : "Archived validation evaluation."}</p>
                </div>
                <span class="rd-tag${selection.split === "test" ? " is-test" : ""}">
                    ${selection.split === "test" ? "TEST" : "VALIDATION"}
                </span>
            </header>
            <div class="rd-panel__body">
                <div class="rd-metrics">
                    ${cards.map(([label, value, description, tone]) => `
                        <div class="rd-metric is-${tone}">
                            <span class="rd-metric__label">${escapeHTML(label)}</span>
                            <strong class="rd-metric__value">${escapeHTML(value)}</strong>
                            <span class="rd-metric__desc">${escapeHTML(description)}</span>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    }

    /* ---------- Confusion matrix ---------- */

    function renderConfusion(familyKey, selection) {
        const entry = dashboards[familyKey];
        const state = entry.state;
        const container = entry.el.querySelector('[data-region="matrix"]');
        if (!container) return;

        if (!selection.matched || !selection.matrix) {
            container.innerHTML = `
                <header class="rd-panel__head"><div><h4>Confusion matrix</h4></div></header>
                <div class="rd-panel__body">
                    ${emptyState("No confusion matrix is available for this selection.")}
                </div>
            `;
            return;
        }

        const matrix = selection.matrix;
        const [[tp, fn], [fp, tn]] = matrix.map(row => row.map(Number));
        const total = tp + fn + fp + tn || 1;

        const cell = (label, value, tone) => `
            <div class="rd-cm__cell is-${tone}">
                <strong>${integer(value)}</strong>
                <span>${escapeHTML(label)} · ${percent(value / total)}</span>
            </div>
        `;

        container.innerHTML = `
            <header class="rd-panel__head">
                <div>
                    <h4>Confusion matrix</h4>
                    <p>Rows are actual labels, columns are predictions. Archived orientation ${escapeHTML(MATRIX_ORIENTATION)}.</p>
                </div>
                <span class="rd-tag${state.split === "test" ? " is-test" : ""}">
                    ${state.split === "test" ? "TEST" : "VALIDATION"}
                </span>
            </header>
            <div class="rd-panel__body">
                <div class="rd-cm">
                    <div class="rd-cm__corner" aria-hidden="true"></div>
                    <div class="rd-cm__head">Predicted phishing</div>
                    <div class="rd-cm__head">Predicted legitimate</div>

                    <div class="rd-cm__rowlabel">Actual phishing</div>
                    ${cell("True positive", tp, "tp")}
                    ${cell("False negative", fn, "fn")}

                    <div class="rd-cm__rowlabel">Actual legitimate</div>
                    ${cell("False positive", fp, "fp")}
                    ${cell("True negative", tn, "tn")}
                </div>

                <div class="rd-legend">
                    <span><i class="is-tp"></i> Correct phishing detection</span>
                    <span><i class="is-fn"></i> Missed phishing</span>
                    <span><i class="is-fp"></i> False alarm</span>
                    <span><i class="is-tn"></i> Correct legitimate detection</span>
                </div>
            </div>
        `;
    }

    /* ---------- Evaluation metadata ---------- */

    function renderMeta(familyKey, selection) {
        const entry = dashboards[familyKey];
        const state = entry.state;
        const container = entry.el.querySelector('[data-region="meta"]');
        if (!container) return;

        const rows = [];

        if (selection.matched && selection.record) {
            const record = selection.record;

            rows.push(["Model", record.model]);
            rows.push(["Feature set", featureLabel(record.feature_set)]);
            rows.push(["Evaluation split", selection.split === "test" ? "Held-out test set" : "Validation set"]);
            rows.push(["Feature count", integer(record.n_features)]);
            rows.push(["Training time", seconds(record.training_time_seconds)]);

            if (selection.split === "test") {
                rows.push(["Refit on", record.refit_on || "—"]);
            } else {
                rows.push(["Converged", record.converged === false ? "No" : "Yes"]);
            }
        } else {
            rows.push(["Model", state.model]);
            rows.push(["Feature set", featureLabel(state.featureSet)]);
            rows.push(["Evaluation split", state.split === "test" ? "Held-out test set" : "Validation set"]);
            rows.push(["Status", "Not evaluated"]);
        }

        container.innerHTML = `
            <header class="rd-panel__head">
                <div><h4>Evaluation details</h4></div>
                <span class="rd-tag${state.split === "test" ? " is-test" : ""}">
                    ${state.split === "test" ? "TEST" : "VALIDATION"}
                </span>
            </header>
            <div class="rd-panel__body">
                <dl class="rd-facts">
                    ${rows.map(([term, value]) => `
                        <div class="rd-facts__row">
                            <dt>${escapeHTML(term)}</dt>
                            <dd>${escapeHTML(value)}</dd>
                        </div>
                    `).join("")}
                </dl>
            </div>
        `;
    }

    /* ---------- Dynamic refresh ---------- */

    function renderDynamic(familyKey) {
        const entry = dashboards[familyKey];
        if (!entry) return;

        const state = entry.state;
        const root = entry.el.querySelector('[data-role="root"]');
        if (root) root.classList.toggle("mode-test", state.split === "test");

        const badge = entry.el.querySelector('[data-role="mode-badge"]');
        if (badge) {
            badge.textContent = state.split === "test" ? "TEST SET" : "VALIDATION";
            badge.classList.toggle("is-test", state.split === "test");
        }

        const selection = resolveSelection(state);

        renderAnalysis(familyKey, selection);
        renderBestConfigs(familyKey);
        renderMetricCards(familyKey, selection);
        renderConfusion(familyKey, selection);
        renderMeta(familyKey, selection);
    }

    /* ============================================================
       9. OVERALL COMPARISON DASHBOARD
       ============================================================ */

    function renderOverall() {
        const root = document.querySelector('[data-family="overall"]');
        if (!root) return;

        const rows = RETAINED_MODELS.flatMap(model =>
            FEATURE_SETS.map(fs => {
                const record = testRecord(model, fs.id);
                return { model, featureSet: fs, record };
            })
        );

        const available = rows.filter(row => row.record);

        root.innerHTML = `
            <div class="rd-dashboard rd-overall">
                <header class="rd-head">
                    <div class="rd-head__titles">
                        <span class="rd-eyebrow">FINAL EVALUATION</span>
                        <h3>Overall model comparison</h3>
                        <p>
                            Nine retained models across five feature sets — compare validation
                            performance against the corresponding held-out test results.
                        </p>
                    </div>
                    <span class="rd-mode-badge is-test">TEST SET</span>
                </header>

                <div class="rd-stats">
                    ${[
                ["Test evaluations", `${available.length} / ${rows.length}`],
                ["Retained models", String(RETAINED_MODELS.length)],
                ["Feature sets", String(FEATURE_SETS.length)],
                ["Performance Metrics", integer(5)]
            ].map(([label, value]) => `
                        <div class="rd-stat">
                            <span>${escapeHTML(label)}</span>
                            <strong>${escapeHTML(value)}</strong>
                        </div>
                    `).join("")}
                </div>

                ${renderHeatmap()}
                ${renderValidationTestExplorer()}
                ${renderFinalTestTable(rows)}
            </div>
        `;

        const comparisonModel = root.querySelector("#rd-comparison-model");
        const comparisonMetric = root.querySelector("#rd-comparison-metric");

        function updateComparison() {
            const body = root.querySelector("#rd-comparison-body");
            if (!body) return;

            body.innerHTML = renderComparisonRows(
                comparisonModel.value,
                comparisonMetric.value
            );
        }

        comparisonModel?.addEventListener("change", updateComparison);
        comparisonMetric?.addEventListener("change", updateComparison);
    }

    function heatColor(accuracy) {
        const value = Number(accuracy);
        if (!Number.isFinite(value)) return "transparent";
        const t = clamp((value - 0.55) / 0.45, 0, 1);
        const alpha = (0.08 + t * 0.72).toFixed(3);
        return `rgba(23, 107, 80, ${alpha})`;
    }

    function renderHeatmap() {
        return panel(
            "Test accuracy heat map",
            "Every retained model against every feature set, using the final held-out test evaluations.",
            `
                <div class="rd-heatmap" style="--cols:${FEATURE_SETS.length}">
                    <div class="rd-heatmap__corner"></div>
                    ${FEATURE_SETS.map(fs => `<div class="rd-heatmap__colhead">${escapeHTML(fs.code)}</div>`).join("")}

                    ${RETAINED_MODELS.map(model => `
                        <div class="rd-heatmap__rowhead">${escapeHTML(model)}</div>
                        ${FEATURE_SETS.map(fs => {
                const record = testRecord(model, fs.id);
                const accuracy = record ? Number(record.test_accuracy) : null;
                const dark = Number.isFinite(accuracy) && accuracy > 0.9;
                return `
                                <div class="rd-heatmap__cell${dark ? " is-dark" : ""}"
                                    style="background:${heatColor(accuracy)}"
                                    title="${escapeHTML(`${model} · ${fs.label} · ${record ? percent(accuracy) : "not available"}`)}">
                                    ${record ? percent(accuracy) : "—"}
                                </div>
                            `;
            }).join("")}
                    `).join("")}
                </div>
                <p class="rd-caption">
                    Cell values are the recorded test accuracy. Darker cells indicate higher accuracy.
                </p>
            `,
            { tag: "TEST SET", tagTone: "test" }
        );
    }

    /* ============================================================
   VALIDATION VS TEST PERFORMANCE EXPLORER
   ============================================================ */

const COMPARISON_METRICS = [
    {
        id: "accuracy",
        label: "Accuracy",
        validation: record => record.validation_accuracy,
        test: record => record.test_accuracy
    },
    {
        id: "balanced",
        label: "Balanced Accuracy",
        validation: record => record.balanced_accuracy,
        test: record => record.test_balanced_accuracy
    },
    {
        id: "recall",
        label: "Phishing Recall",
        validation: record => record.phishing_recall,
        test: record => record.test_phishing_recall
    },
    {
        id: "precision",
        label: "Phishing Precision",
        validation: (record, matrix) => precisionFromMatrix(matrix),
        test: record => record.test_phishing_precision
    },
    {
        id: "f1",
        label: "F1 Score",
        validation: (record, matrix) => {
            const precision = precisionFromMatrix(matrix);
            const recall = Number(record.phishing_recall);

            if (!Number.isFinite(precision) || !Number.isFinite(recall)) {
                return null;
            }

            return precision + recall === 0
                ? 0
                : 2 * precision * recall / (precision + recall);
        },
        test: record => {
            const precision = Number(record.test_phishing_precision);
            const recall = Number(record.test_phishing_recall);

            if (!Number.isFinite(precision) || !Number.isFinite(recall)) {
                return null;
            }

            return precision + recall === 0
                ? 0
                : 2 * precision * recall / (precision + recall);
        }
    }
];

function comparisonRecords(model, featureSet) {
    const test = testRecord(model, featureSet);

    if (!test?.selected_experiment_id) return null;

    const validation = archive.validation.find(record =>
        record.experiment_id === test.selected_experiment_id
    );

    if (!validation) return null;

    const matrix = validationMatrix(validation.experiment_id);

    return { validation, test, matrix };
}

function comparisonValue(records, metric) {
    if (!records) return null;

    const definition = COMPARISON_METRICS.find(item => item.id === metric);

    if (!definition) return null;

    const validation = Number(
        definition.validation(records.validation, records.matrix)
    );

    const test = Number(definition.test(records.test));

    if (!Number.isFinite(validation) || !Number.isFinite(test)) {
        return null;
    }

    return { validation, test, gap: validation - test };
}

function renderComparisonRows(model, metric) {
    return FEATURE_SETS.map(fs => {
        const records = comparisonRecords(model, fs.id);
        const values = comparisonValue(records, metric);

        if (!values) {
            return `
                <tr>
                    <td class="rd-table__model">
                        ${escapeHTML(fs.code)} · ${escapeHTML(fs.label)}
                    </td>
                    <td colspan="3" class="rd-table__missing">
                        Matching validation/test results unavailable
                    </td>
                    <td>—</td>
                </tr>
            `;
        }

        const gapPP = values.gap * 100;
        const gapLabel = `${gapPP >= 0 ? "+" : ""}${gapPP.toFixed(4)} pp`;
        const gapClass = gapPP > 0 ? "is-positive"
            : gapPP < 0 ? "is-negative" : "is-neutral";

        const barWidth = Math.min(Math.abs(gapPP), 1) * 100;

        return `
            <tr>
                <td class="rd-table__model">
                    <span class="rd-chip">${escapeHTML(fs.code)}</span>
                    ${escapeHTML(fs.label)}
                </td>
                <td>${percent(values.validation)}</td>
                <td>${percent(values.test)}</td>
                <td>
                    <div class="rd-gap ${gapClass}">
                        <strong>${gapLabel}</strong>
                        <div class="rd-gap__track">
                            <span style="width:${barWidth}%"></span>
                        </div>
                    </div>
                </td>
                <td>
                    ${records.validation.experiment_id === records.test.selected_experiment_id
                        ? '<span class="rd-match">MATCHED</span>'
                        : '<span class="rd-match is-unmatched">UNMATCHED</span>'}
                </td>
            </tr>
        `;
    }).join("");
}

function renderValidationTestExplorer() {
    return panel(
        "Validation vs Test Performance",
        "Compare the selected validation configuration against its corresponding held-out test evaluation.",
        `
            <div class="rd-comparison-controls">
                <label class="rd-field">
                    <span class="rd-field__label">Select model</span>
                    <select class="rd-select" id="rd-comparison-model">
                        ${modelSelectorMarkup(RETAINED_MODELS[0], RETAINED_MODELS)}
                    </select>
                </label>

                <label class="rd-field">
                    <span class="rd-field__label">Select metric</span>
                    <select class="rd-select" id="rd-comparison-metric">
                        ${COMPARISON_METRICS.map(metric => `
                            <option value="${metric.id}">
                                ${metric.label}
                            </option>
                        `).join("")}
                    </select>
                </label>
            </div>

            <div class="rd-table__wrap">
                <table class="rd-table rd-comparison-table">
                    <thead>
                        <tr>
                            <th>Feature set</th>
                            <th>Validation</th>
                            <th>Test</th>
                            <th>Generalization gap</th>
                            <th>Configuration</th>
                        </tr>
                    </thead>
                    <tbody id="rd-comparison-body">
                        ${renderComparisonRows(RETAINED_MODELS[0], "accuracy")}
                    </tbody>
                </table>
            </div>

            <p class="rd-caption">
                Generalization gap = Validation − Test, measured in percentage points.
                A positive gap indicates lower performance on the held-out test set.
                Each test result is matched to its originally selected validation experiment.
            </p>
        `,
        { accent: true }
    );
}

    function renderFinalTestTable(rows) {
        const body = rows.map(({ model, featureSet, record }) => {
            if (!record) {
                return `
                    <tr>
                        <td>${escapeHTML(model)}</td>
                        <td>${escapeHTML(featureSet.code)}</td>
                        <td colspan="6" class="rd-table__missing">Test evaluation unavailable</td>
                    </tr>
                `;
            }

            const perfect = Number(record.test_accuracy) >= 1;
            return `
                <tr${perfect ? ' class="is-perfect"' : ""}>
                    <td class="rd-table__model">${escapeHTML(model)}</td>
                    <td><span class="rd-chip">${escapeHTML(featureSet.code)}</span></td>
                    <td>${percent(record.test_accuracy)}</td>
                    <td>${percent(record.test_balanced_accuracy)}</td>
                    <td>${percent(record.test_phishing_recall)}</td>
                    <td>${percent(record.test_phishing_precision)}</td>
                    <td>${integer(record.test_missed_phishing)}</td>
                    <td>${integer(record.test_false_alarms)}</td>
                </tr>
            `;
        }).join("");

        return panel(
            "Final test results",
            "Each row is one model and one feature set, evaluated on the held-out test split.",
            `
                <div class="rd-table__wrap">
                    <table class="rd-table">
                        <thead>
                            <tr>
                                <th>Model</th>
                                <th>Features</th>
                                <th>Accuracy</th>
                                <th>Balanced acc.</th>
                                <th>Phishing recall</th>
                                <th>Phishing precision</th>
                                <th>Missed</th>
                                <th>False alarms</th>
                            </tr>
                        </thead>
                        <tbody>${body}</tbody>
                    </table>
                </div>
                <p class="rd-caption">
                    Test results correspond to configurations chosen on validation and then refitted on
                    train + validation data. Rows with perfect accuracy are highlighted.
                </p>
            `,
            { tag: "TEST SET", tagTone: "test" }
        );
    }

    /* ============================================================
       10. CONTROLLER
       ============================================================ */

    function initializeDashboards() {
        const familyKey = "explorer";
        const family = FAMILIES[familyKey];
        const el = document.querySelector('[data-family="explorer"]');

        if (!el) return;

        const model = family.models[0];
        const featureSet = FEATURE_SETS[0].id;

        dashboards[familyKey] = {
            el,
            state: {
                model,
                featureSet,
                split: "validation",
                analysis: "metrics",
                config: defaultConfig(model, featureSet)
            }
        };

        el.addEventListener("change", event => handleChange(event, familyKey));
        el.addEventListener("input", event => handleInput(event, familyKey));
        el.addEventListener("click", event => handleClick(event, familyKey));

        renderShell(familyKey);
    }

    function handleInput(event, familyKey) {
        const target = event.target;

        if (target.dataset?.action !== "slider") return;

        const entry = dashboards[familyKey];
        if (!entry) return;

        const state = entry.state;
        const key = target.dataset.param;
        const options = parameterOptions(state.model, state.featureSet, key);
        if (!options.length) return;

        const index = clamp(Number(target.value), 0, options.length - 1);
        state.config = { ...state.config, [key]: options[index] };

        const wrapper = target.closest(".rd-param");
        const valueLabel = wrapper?.querySelector('[data-role="param-value"]');
        if (valueLabel) valueLabel.textContent = formatValue(options[index]);

        wrapper?.querySelectorAll(".rd-tick").forEach((tick, i) => {
            tick.classList.toggle("is-current", i === index);
        });

        const max = Math.max(0, options.length - 1);
        target.style.setProperty("--fill", `${max === 0 ? 100 : (index / max) * 100}%`);
        target.setAttribute("aria-valuetext", formatValue(options[index]));

        renderDynamic(familyKey);
    }

    function handleChange(event, familyKey) {
        const target = event.target;
        const action = target.dataset?.action;
        const entry = dashboards[familyKey];
        if (!entry || !action) return;

        const state = entry.state;

        if (action === "model") {
            state.model = target.value;
            state.config = defaultConfig(state.model, state.featureSet);
            renderShell(familyKey);
            return;
        }

        if (action === "slider") {
            /* Committed on release; live updates are handled in handleInput. */
            renderDynamic(familyKey);
        }
    }

    function handleClick(event, familyKey) {
        const target = event.target.closest("[data-action]");
        if (!target) return;

        const entry = dashboards[familyKey];
        if (!entry) return;

        const state = entry.state;
        const action = target.dataset.action;

        if (action === "split") {
            const value = target.dataset.value;
            if (state.split === value) return;
            state.split = value;
            if (value === "validation") {
                state.config = defaultConfig(state.model, state.featureSet);
            }
            renderShell(familyKey);
            return;
        }

        if (action === "feature") {
            const value = target.dataset.value;
            if (state.featureSet === value) return;
            state.featureSet = value;
            state.config = defaultConfig(state.model, state.featureSet);
            renderShell(familyKey);
            return;
        }

        if (action === "analysis") {
            const value = target.dataset.value;
            if (state.analysis === value) return;
            state.analysis = value;
            entry.el.querySelectorAll('[data-action="analysis"]').forEach(button => {
                const active = button.dataset.value === value;
                button.classList.toggle("is-active", active);
                button.setAttribute("aria-pressed", String(active));
            });
            renderAnalysis(familyKey, resolveSelection(state));
            return;
        }

        if (action === "param-option") {
            const key = target.dataset.param;
            const options = parameterOptions(state.model, state.featureSet, key);
            const option = options.find(item => valueKey(item) === target.dataset.value);
            if (option === undefined) return;

            state.config = { ...state.config, [key]: option };

            const wrapper = target.closest(".rd-param");
            wrapper?.querySelectorAll(".rd-option").forEach(button => {
                const active = button.dataset.value === target.dataset.value;
                button.classList.toggle("is-active", active);
                button.setAttribute("aria-pressed", String(active));
            });

            renderDynamic(familyKey);
        }
    }

    /* ============================================================
       11. BOOT
       ============================================================ */

    async function initializeResultsPage() {
        const section = document.querySelector("#results");
        if (!section) return;

        try {
            await loadArchive();
            initializeDashboards();
            renderOverall();

            console.info(
                `PhishLab Results & Analysis ready — ${archive.validation.length} validation experiments, `
                + `${archive.test.length} test evaluations.`
            );
        } catch (error) {
            console.error("Failed to initialise Results & Analysis:", error);

            section.querySelectorAll(".results-dashboard").forEach(el => {
                el.innerHTML = `
                    <div class="rd-dashboard">
                        <div class="rd-load-error">
                            <h3>Unable to load the experiment archive</h3>
                            <p>${escapeHTML(error.message)}</p>
                            <p>
                                The dashboard reads the recorded JSON archives under
                                <code>results/</code>. Serve the site over HTTP rather than
                                opening the file directly.
                            </p>
                        </div>
                    </div>
                `;
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeResultsPage);
    } else {
        initializeResultsPage();
    }
})();
