const valid = { name: false, mail: false, message: false, policy: false }

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
        valid[input["name"]] = true
    } else {
        errorIcon.classList.remove("hidden");
        successIcon.classList.add("hidden");
        requiredText.classList.remove("hiddenBlock");
        valid[input["name"]] = false
    }
    handleSubmit();
}

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

function approvalPolicy() {
    let button = document.getElementById("checkbox")
    let errorSpan = document.getElementById("errorSpan")
    if (button.checked) {
        valid.policy = true;
        errorSpan.classList.add("hiddenBlock")
    } else {
        valid.policy = false;
        errorSpan.classList.remove("hiddenBlock")
    }
    handleSubmit()
}

function handleSubmit() {
    let button = document.querySelector('button[type="submit"]');
    let requiredHidden = document.querySelectorAll(".required")
    let allValid = Object.values(valid).every(e => e === true);
    if (allValid) {
        button.disabled = false;
        button.style.cursor = "pointer";
    } else {
        button.disabled = true;
        button.style.cursor = "not-allowed";
        
    }
}