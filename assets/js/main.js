// playSvgAnimation(".right-side-animation .step-svg", ".right-side-animation .step-svg");


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

function endlessScroll() {
    const frames = document.querySelectorAll(".endless-arrow");
    let current = 0;
    setInterval(() => {
        frames.forEach(frame => {
            frame.classList.add("hidden");
        });
        frames[current].classList.remove("hidden");
        current++;
        if (current >= frames.length) {
            current = 0;
        }
    },100);
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


// function playSvgAnimation(showGroup, hideGroup) {
//     const framesToShow = document.querySelectorAll(showGroup);
//     const framesToHide = document.querySelectorAll(hideGroup);
//     setInterval(() => {
//         framesToHide.forEach(svg => svg.classList.add("hidden"));
//         framesToShow.forEach((svg, index) => {
//             setTimeout(() => {
//                 framesToShow.forEach(s => s.classList.add("hidden"));
//                 svg.classList.remove("hidden");
//             }, 1000 / 60);
//         });
//     }, 600);
// }