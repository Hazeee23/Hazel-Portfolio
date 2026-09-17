/* =====================================
   OPEN PROJECTS PAGE
===================================== */

function openProjects() {

    const overlay =
        document.getElementById("projectsOverlay");

    overlay.classList.add("active");
    overlay.scrollTop = 0;

    document.body.style.overflow = "hidden";

}


/* =====================================
   CLOSE PROJECTS PAGE
===================================== */

function closeProjects() {

    const overlay =
        document.getElementById("projectsOverlay");

    overlay.classList.remove("active");

    if (window.innerWidth <= 1100) {

        document.body.style.overflowY = "auto";

    } else {

        document.body.style.overflow = "hidden";

    }

}


/* =====================================
   OPEN PROJECT DETAILS
===================================== */

function openProjectDetails(project) {

    const overlay =
        document.getElementById("projectDetailOverlay");

    // Inherit project's custom accent colors
    const computedStyle = getComputedStyle(project);
    const cardAccent = computedStyle.getPropertyValue('--card-accent').trim() || '#72c9a5';
    const cardAccentRgb = computedStyle.getPropertyValue('--card-accent-rgb').trim() || '114, 201, 165';
    const cardAccentText = computedStyle.getPropertyValue('--card-accent-text').trim() || cardAccent;
    overlay.style.setProperty('--modal-accent', cardAccent);
    overlay.style.setProperty('--modal-accent-rgb', cardAccentRgb);
    overlay.style.setProperty('--modal-accent-text', cardAccentText);

    const image =
        document.getElementById("projectDetailImage");

    const imageFallback =
        document.getElementById("projectDetailImageFallback");

    const imageWrap =
        document.querySelector(".project-detail-image-wrap");

    const title =
        project.querySelector("h3").textContent.trim();

    const description =
        project.querySelector(".project-details > p").textContent.trim();

    const number =
        project.querySelector(".project-number").textContent.trim();

    const tags =
        project.querySelector(".project-tags").innerHTML;

    // Get the authentic GitHub repository link
    const githubLink =
        project.dataset.projectLink ||
        (project.querySelector("a[href*='github.com']") ? project.querySelector("a[href*='github.com']").getAttribute("href") : null) ||
        (project.querySelector("a.project-link") ? project.querySelector("a.project-link").getAttribute("href") : null);

    document.getElementById("projectDetailTitle").textContent = title;

    const caseStudy =
        project.querySelector(".project-case-study");

    const descContainer =
        document.getElementById("projectDetailDescription");

    if (caseStudy) {

        descContainer.innerHTML = caseStudy.innerHTML;

    } else {

        descContainer.innerHTML = `<p>${description}</p>`;

    }

    document.getElementById("projectDetailNumber").textContent = number;
    document.getElementById("projectDetailTags").innerHTML = tags;

    image.alt = `${title} screenshot`;
    imageFallback.textContent = `Add a screenshot for ${title} to the assets folder.`;
    imageFallback.hidden = true;
    image.hidden = false;

    imageWrap.hidden = !project.dataset.projectImage;

    if (project.dataset.projectImage) {

        image.src = project.dataset.projectImage;

    }

    image.onerror = function() {

        image.hidden = true;
        imageFallback.hidden = false;

    };

    const detailLink =
        document.getElementById("projectDetailLink");

    if (githubLink && githubLink !== "#" && githubLink !== "null") {

        detailLink.href = githubLink;
        detailLink.hidden = false;
        detailLink.style.display = "inline-flex";

    } else {

        detailLink.removeAttribute("href");
        detailLink.hidden = true;
        detailLink.style.display = "none";

    }

    overlay.classList.add("active");
    document.body.style.overflow = "hidden";

}


/* =====================================
   CLOSE PROJECT DETAILS
===================================== */

function closeProjectDetails() {

    const overlay =
        document.getElementById("projectDetailOverlay");

    overlay.classList.remove("active");

    if (!document.getElementById("projectsOverlay").classList.contains("active")) {

        document.body.style.overflow =
            window.innerWidth <= 1100 ? "auto" : "hidden";

    }

}


/* =====================================
   SCROLL PROJECTS & DOT NAVIGATION
===================================== */

function scrollProjects(direction) {

    const projectList =
        document.querySelector(".projects-list");

    const project =
        projectList.querySelector(".project-item");

    if (!project) return;

    const gap =
        parseFloat(getComputedStyle(projectList).gap) || 0;

    projectList.scrollBy({
        left: direction * (project.offsetWidth + gap),
        behavior: "smooth"
    });

}

function goToProject(index) {

    const projectList =
        document.querySelector(".projects-list");

    if (!projectList) return;

    const items =
        projectList.querySelectorAll(".project-item");

    if (items[index]) {

        items[index].scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest"
        });

        updateActiveProjectDot(index);

    }

}

function updateActiveProjectDot(index) {

    const dots =
        document.querySelectorAll(".project-dot");

    dots.forEach((dot, i) => {

        dot.classList.toggle("active", i === index);

    });

    const counterCur =
        document.getElementById("projectCounterCurrent");

    if (counterCur) {

        counterCur.textContent = String(index + 1).padStart(2, "0");

    }

}

// Sync carousel scroll with dots and counter
document.addEventListener("DOMContentLoaded", function() {

    const projectList =
        document.querySelector(".projects-list");

    if (!projectList) return;

    let scrollTimeout;

    projectList.addEventListener("scroll", function() {

        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(function() {

            const items =
                projectList.querySelectorAll(".project-item");

            if (!items.length) return;

            const listCenter =
                projectList.scrollLeft + projectList.clientWidth / 2;

            let closestIdx = 0;
            let closestDist = Infinity;

            items.forEach((item, idx) => {

                const itemCenter =
                    item.offsetLeft + item.offsetWidth / 2;

                const dist =
                    Math.abs(listCenter - itemCenter);

                if (dist < closestDist) {

                    closestDist = dist;
                    closestIdx = idx;

                }

            });

            updateActiveProjectDot(closestIdx);

        }, 60);

    });

});


/* =====================================
   CLOSE WITH ESC KEY
===================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeProjectDetails();
            closeProjects();

        }

    }
);


/* =====================================
   EMAIL CLICK & COPY HELPER
===================================== */

function copyEmailToClipboard(email) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function() {
            showToast("Copied to clipboard: " + email);
        }).catch(function() {
            showToast("Contact: " + email);
        });
    } else {
        showToast("Contact: " + email);
    }
}

function showToast(message) {
    let toast = document.getElementById("emailToast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "emailToast";
        toast.className = "email-toast";
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="email-toast-icon">✓</span> <span>${message}</span>`;
    toast.classList.add("active");
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function() {
        toast.classList.remove("active");
    }, 3200);
}