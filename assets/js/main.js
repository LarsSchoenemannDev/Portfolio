/**
 * @typedef {Object} FormValidationState
 * @property {boolean} name - Validation status of the name field.
 * @property {boolean} mail - Validation status of the email field.
 * @property {boolean} message - Validation status of the message field.
 * @property {boolean} policy - Validation status of the privacy policy checkbox.
 */

/** @type {FormValidationState} Tracks real-time validation status for each form field. */
const valid = { name: false, mail: false, message: false, policy: false };

/** @type {string} Currently active language code. Defaults to English. */
let currentLang = "en";

/**
 * Updates the document's language attribute and applies localized strings to
 * elements marked with `data-i18n` (innerHTML) and `data-i18n-placeholder` (placeholder).
 * Also updates the active CSS class on language toggle buttons.
 *
 * @param {string} lang - The target language code (e.g., 'en', 'de', 'fr').
 * @returns {void}
 * @global {Object} translations - Expected global dictionary: `{ en: { key: "text" }, de: { key: "text" } }`
 */
function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (translations[lang][key] !== undefined) {
            el.innerHTML = translations[lang][key];
        }
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (translations[lang][key] !== undefined) {
            el.placeholder = translations[lang][key];
        }
    });

    document.querySelector(".legal-link").href = (lang === "de") ? "legalNotesDE.html" : "legalNotesEN.html";
    document.querySelectorAll(".language-button .header-button").forEach(btn => {
        btn.classList.toggle("active", btn.textContent.trim().toLowerCase() === lang);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".language-button .header-button").forEach(btn => {
        btn.addEventListener("click", () => {
            setLanguage(btn.textContent.trim().toLowerCase());
        });
    });
    setLanguage(currentLang);
});

/**
 * Toggles the visibility of the navigation overlay.
 * Updates ARIA accessibility attributes, locks/unlocks body scrolling,
 * and triggers the corresponding SVG open/close animation.
 *
 * @returns {void}
 */
function toggleMenu() {
    const overlay = document.getElementById("navOverlay");
    const btn = document.getElementById("burgerBtn");
    const isOpen = overlay.classList.contains("is-open");
    if (isOpen) {
        overlay.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        playSvgAnimation(".back-animation-svg", ".start-animation-svg");
    } else {
        overlay.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        playSvgAnimation(".start-animation-svg", ".back-animation-svg");
    }
}

/**
 * Animates SVG frames by sequentially showing elements matching `showGroup`
 * while hiding elements matching `hideGroup`. Applies a staggered delay (180ms per frame).
 *
 * @param {string} showGroup - CSS selector for the SVG group(s) to animate in.
 * @param {string} hideGroup - CSS selector for the SVG group(s) to animate out.
 * @returns {void}
 */
function playSvgAnimation(showGroup, hideGroup) {
    const framesToShow = document.querySelectorAll(showGroup);
    const framesToHide = document.querySelectorAll(hideGroup);
    framesToHide.forEach(svg => svg.classList.add("hidden"));
    framesToShow.forEach((svg, index) => {
        setTimeout(() => {
            framesToShow.forEach(s => s.classList.add("hidden"));
            svg.classList.remove("hidden");
        }, index * 180);
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        const overlay = document.getElementById("navOverlay");
        if (overlay.classList.contains("is-open")) toggleMenu();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".menu-item a").forEach(link => {
        link.addEventListener("mouseenter", () => {
            link.classList.remove("hover-out", "active");
            link.classList.add("hover-in");
        });
        link.addEventListener("mouseleave", () => {
            if (!link.classList.contains("active")) {
                link.classList.replace("hover-in", "hover-out");
            }
        });
    });
});

/**
 * Validates a standard text input (e.g., name, message) by checking if its
 * trimmed value meets the minimum length requirement (3 characters).
 * Toggles associated UI feedback elements, updates the validation state,
 * and triggers a form readiness check.
 *
 * @param {string} inputId - The `id` attribute of the input element to validate.
 * @returns {void}
 * @remarks Assumes DOM structure: [Input] -> [ErrorIcon] -> [SuccessIcon] -> [RequiredText]
 */
function formValidation(inputId) {
    let minLength = 3;
    let input = document.getElementById(inputId);

    let errorIcon = input.nextElementSibling;
    let successIcon = errorIcon.nextElementSibling;
    let requiredText = successIcon.nextElementSibling;

    if (input.value.trim().length >= minLength) {
        successIcon.classList.remove("hidden");
        errorIcon.classList.add("hidden");
        requiredText.classList.add("hiddenBlock");
        valid[input["name"]] = true;
    } else {
        errorIcon.classList.remove("hidden");
        successIcon.classList.add("hidden");
        requiredText.classList.remove("hiddenBlock");
        valid[input["name"]] = false;
    }
    handleSubmit();
}

/**
 * Validates the email input field using a standard email regex pattern.
 * Updates UI feedback icons, modifies the validation state, and checks form readiness.
 *
 * @returns {void}
 * @remarks Assumes DOM structure after email input: [ErrorIcon] -> [SuccessIcon] -> [RequiredText]
 */
function validateMail() {
    let mail = document.getElementById("contactEmail");
    let errorIcon = mail.nextElementSibling;
    let successIcon = errorIcon.nextElementSibling;
    let requiredText = successIcon.nextElementSibling;
    let mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (mailRegex.test(mail.value)) {
        successIcon.classList.remove("hidden");
        errorIcon.classList.add("hidden");
        requiredText.classList.add("hiddenBlock");
        valid.mail = true;
    } else {
        errorIcon.classList.remove("hidden");
        successIcon.classList.add("hidden");
        requiredText.classList.remove("hiddenBlock");
        valid.mail = false;
    }
    handleSubmit();
}

/**
 * Validates the privacy policy/checkbox input. Updates the validation state
 * and toggles the visibility of the associated error message.
 *
 * @returns {void}
 */
function approvalPolicy() {
    let button = document.getElementById("checkbox");
    let errorSpan = document.getElementById("errorSpan");
    if (button.checked) {
        valid.policy = true;
        errorSpan.classList.add("hiddenBlock");
    } else {
        valid.policy = false;
        errorSpan.classList.remove("hiddenBlock");
    }
    handleSubmit();
}

/**
 * Checks all validation states and returns invalid fields.
 *
 * @returns {Array} invalid field names
 */
function handleSubmit() {
    const button = document.querySelector('button[type="submit"]');

    // Alle Felder sammeln die false sind
    const invalidFields = Object.entries(valid)
        .filter(([key, value]) => value === false)
        .map(([key]) => key);

    const allValid = invalidFields.length === 0;

    if (allValid) {
        button.disabled = false;
        button.style.cursor = "pointer";
        console.log("you can");
    } else {
        button.disabled = true;
        button.style.cursor = "not-allowed";
        console.log("not yet");

        console.log("Missing:", invalidFields);
    }
    return invalidFields;
}