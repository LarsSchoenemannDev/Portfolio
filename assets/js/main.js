/**
 * @typedef {Object} FormValidationState
 * @property {boolean} name - Validation status of the name field.
 * @property {boolean} mail - Validation status of the email field.
 * @property {boolean} message - Validation status of the message field.
 * @property {boolean} policy - Validation status of the privacy policy checkbox.
 */

/** @type {FormValidationState} Tracks real-time validation status for each form field. */
const valid = { name: false, mail: false, message: false, policy: false };

/** @type {string} Currently active language code. Defaults to German. */
let currentLang = "de"

/**
 * State of Header Svg animation 
 */
let animateState = false;

/**
 * Updates the documents language attribute and applies localized strings.
 */
function setLanguage() {
    if (!localStorage.getItem("language")) {
        localStorage.setItem("language", currentLang);
    }
    document.querySelectorAll(".language-button .header-button").forEach(btn => {
        const btnLang = btn.dataset.lang || btn.textContent.trim().toLowerCase();
        btn.classList.toggle("active", btnLang === currentLang);
    });
    translate()
    setPageLinks()
}

/**
 * Translates all elements with [data-i18n] and [data-i18n-placeholder]
 * attributes using the current language from `currentLang`.
 *
 * @returns {void}
 */
function translate() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (translations[currentLang][key] !== undefined) {
            el.innerHTML = translations[currentLang][key];
        }
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (translations?.[currentLang]?.[key] !== undefined) {
            el.placeholder = translations[currentLang][key];
        }
    });
}

/**
 * Updates href attributes of legal and privacy links
 * based on the current language (`currentLang`).
 *
 * @returns {void}
 */
function setPageLinks() {
    const legalLink = document.querySelector(".legal-link");
    if (legalLink) {
        legalLink.href = currentLang === "de" ? "legalNotesDE.html" : "legalNotesEN.html";
    }
    const privacyLink = document.querySelector(".privacy-link");
    if (privacyLink) {
        privacyLink.href = currentLang === "de" ? "PrivacyPolicyDE.html" : "PrivacyPolicyEN.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    currentLang = localStorage.getItem("language") || currentLang;

    document.querySelectorAll(".language-button .header-button").forEach(btn => {
        btn.addEventListener("click", () => {
            currentLang = btn.textContent.trim().toLowerCase();
            localStorage.setItem("language", currentLang);
            setLanguage();
        });
    });
    setLanguage();
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
    if (animateState) {     
        return;
    }
    framesToHide.forEach(svg => svg.classList.add("hidden"));
    animateState = true
    framesToShow.forEach((svg, index) => {
        setTimeout(() => {
            framesToShow.forEach(s => s.classList.add("hidden"));
            svg.classList.remove("hidden");
            if (index === framesToShow.length - 1) {
                animateState = false;
            }
        }, index * 150);        
    });
};

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
    let mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
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
}

function handleSubmit(event) {
    event.preventDefault();
    formValidation("contactName");
    validateMail();
    formValidation("contactMessage");
    approvalPolicy();
    let allValid = Object.values(valid).every(e => e === true);
    if (allValid) {
        postMessage();
        clearForm()
    }
}

/**
 * Clear formular im footer
 * @returns {void}
 */
function clearForm() {
    const checkbox = document.getElementById("checkbox");
    const messageSVG = document.querySelectorAll(".form-group svg")
    const messageSpan = document.querySelectorAll(".contact-form span")
    const inputs = document.querySelectorAll(
        ".contact-form input,.contact-form textarea"
    );
    messageSVG.forEach(e => { e.classList.add("hidden") });
    messageSpan.forEach(e => { e.classList.add("hiddenBlock") });
    inputs.forEach(input => { input.value = "" });;
    checkbox.checked = false;
}

function postMessage() {
    event.preventDefault();
    const body = {
        name: document.getElementById("contactName").value,
        email: document.getElementById("contactEmail").value,
        message: document.getElementById("contactMessage").value
    };
    fetch("sendMail.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                launchToast()
                clearForm()
            } else {
                errorLaunchToast()
            }
        })
}

/**
 * Displays the success toast notification.
 * The toast animates in, stays visible, then fades out automatically.
 * Total visible duration: 5000ms.
 */
function launchToast() {
    var x = document.getElementById("toast")
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 9000);
}

/**
 * Displays the error toast notification.
 * The toast animates in, stays visible, then fades out automatically.
 * Total visible duration: 5000ms.
 */
function errorLaunchToast() {
    var x = document.getElementById("toastError")
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 9000);
}