/* =========================================================
   NAMINGA POULTRY
   MAIN JAVASCRIPT
========================================================= */

/* =========================================================
   1. SELECT ELEMENTS
========================================================= */

const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

const navLinks = document.querySelectorAll(".nav-link");

const currentYear = document.getElementById("currentYear");

const productModal = document.getElementById("productModal");
const orderForm = document.getElementById("orderForm");
const modalProductTitle = document.getElementById("modalProductTitle");
const modalProductDescription = document.getElementById("modalProductDescription");
const modalProductDetails = document.getElementById("modalProductDetails");
const orderProduct = document.getElementById("orderProduct");
const orderQuantity = document.getElementById("orderQuantity");
const orderQuantityLabel = document.getElementById("orderQuantityLabel");
const chickenCutsChoiceGroup = document.getElementById("chickenCutsChoiceGroup");
const orderCutChoice = document.getElementById("orderCutChoice");
const contactModal = document.getElementById("contactModal");
const contactForm = document.getElementById("contactForm");
let lastFocusedProductTrigger = null;
let lastFocusedContactTrigger = null;

/* =========================================================
   2. MOBILE NAVIGATION
========================================================= */

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");

    const isOpen = mainNav.classList.contains("open");

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );

    menuToggle.setAttribute("aria-expanded", isOpen);
  });
}

/* =========================================================
   3. CLOSE MOBILE MENU WHEN LINK IS CLICKED
========================================================= */

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (mainNav) {
      mainNav.classList.remove("open");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-label", "Open navigation menu");

      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

/* =========================================================
   4. CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener("click", (event) => {
  if (!mainNav || !menuToggle) {
    return;
  }

  const clickedInsideMenu = mainNav.contains(event.target);

  const clickedMenuButton = menuToggle.contains(event.target);

  if (!clickedInsideMenu && !clickedMenuButton) {
    mainNav.classList.remove("open");

    menuToggle.setAttribute("aria-label", "Open navigation menu");

    menuToggle.setAttribute("aria-expanded", "false");
  }
});

/* =========================================================
   5. HEADER SCROLL EFFECT
========================================================= */

function updateHeader() {
  if (!header) {
    return;
  }

  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateHeader);

updateHeader();

/* =========================================================
   6. ACTIVE NAVIGATION
========================================================= */

const sections = document.querySelectorAll("main section[id]");

function updateActiveNavigation() {
  const scrollPosition = window.scrollY + 150;

  let currentSection = "home";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;

    const sectionHeight = section.offsetHeight;

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    const linkTarget = link.getAttribute("href");

    if (linkTarget === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveNavigation);

updateActiveNavigation();

/* =========================================================
   7. SMOOTH SCROLL
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (event) {
    const targetId = this.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    const headerHeight = header ? header.offsetHeight : 0;

    const targetPosition = target.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPosition,

      behavior: "smooth",
    });
  });
});

/* =========================================================
   8. CURRENT YEAR
========================================================= */

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

/* =========================================================
   9. PRODUCT DETAILS AND ORDER MODAL
========================================================= */

function closeProductModal() {
  if (!productModal) {
    return;
  }

  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (lastFocusedProductTrigger) {
    lastFocusedProductTrigger.focus();
  }
}

document.querySelectorAll(".product-detail-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (!productModal) {
      return;
    }

    lastFocusedProductTrigger = trigger;

    const product = trigger.dataset.product || "Poultry product";

    modalProductTitle.textContent = product;
    modalProductDescription.textContent = trigger.dataset.productDescription || "";
    modalProductDetails.textContent = trigger.dataset.productDetails || "";
    orderProduct.value = product;
    orderQuantity.placeholder = trigger.dataset.quantityPlaceholder || "Enter quantity";

    const isChickenCutsOrder = product === "Dream Chicken Cuts";

    if (chickenCutsChoiceGroup && orderCutChoice) {
      chickenCutsChoiceGroup.hidden = !isChickenCutsOrder;
      orderCutChoice.required = isChickenCutsOrder;
    }

    orderQuantity.type = isChickenCutsOrder ? "number" : "text";
    orderQuantity.min = isChickenCutsOrder ? "1" : "";
    if (orderQuantityLabel) {
      orderQuantityLabel.textContent = isChickenCutsOrder ? "Number of packets" : "Quantity";
    }
    orderQuantity.placeholder = isChickenCutsOrder
      ? "e.g. 5 packets"
      : trigger.dataset.quantityPlaceholder || "Enter quantity";

    productModal.classList.add("is-open");
    productModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    document.getElementById("orderName").focus();
  });
});

document.querySelectorAll("[data-modal-close]").forEach((closeButton) => {
  closeButton.addEventListener("click", closeProductModal);
});

if (orderForm) {
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitMethod = event.submitter ? event.submitter.dataset.sendMethod : "whatsapp";
    const formData = new FormData(orderForm);
    const selectedCut = formData.get("cutChoice");
    const quantityLabel = selectedCut ? `${selectedCut}: ${formData.get("quantity")} packet(s)` : formData.get("quantity");
    const orderText = [
      `Hello Naminga Poultry, I would like to order ${formData.get("product")}.`,
      "",
      `Name: ${formData.get("name")}`,
      `Phone: ${formData.get("phone")}`,
      `Quantity: ${quantityLabel}`,
      `Delivery area: ${formData.get("location")}`,
      `Additional details: ${formData.get("message") || "None"}`,
    ].join("\\n");

    if (submitMethod === "email") {
      const subject = encodeURIComponent(`Order request: ${formData.get("product")}`);
      const body = encodeURIComponent(orderText);
      window.location.href = `mailto:info@namingapoultry.co.tz?subject=${subject}&body=${body}`;
      return;
    }

    window.open(`https://wa.me/255770025770?text=${encodeURIComponent(orderText)}`, "_blank", "noopener,noreferrer");
  });
}

/* =========================================================
   10. CONTACT MODAL
========================================================= */

function closeContactModal() {
  if (!contactModal) {
    return;
  }

  contactModal.classList.remove("is-open");
  contactModal.setAttribute("aria-hidden", "true");

  if (!productModal || !productModal.classList.contains("is-open")) {
    document.body.classList.remove("modal-open");
  }

  if (lastFocusedContactTrigger) {
    lastFocusedContactTrigger.focus();
  }
}

const contactModalTrigger = document.querySelector(".contact-modal-trigger");

if (contactModalTrigger && contactModal) {
  contactModalTrigger.addEventListener("click", (event) => {
    event.preventDefault();

    lastFocusedContactTrigger = contactModalTrigger;
    contactModal.classList.add("is-open");
    contactModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    contactModal.querySelector('input[name="name"]').focus();
  });
}

document.querySelectorAll("[data-contact-modal-close]").forEach((closeButton) => {
  closeButton.addEventListener("click", closeContactModal);
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitMethod = event.submitter ? event.submitter.dataset.contactSendMethod : "whatsapp";
    const formData = new FormData(contactForm);
    const messageText = [
      "Hello Naminga Poultry, I would like to get in touch.",
      "",
      `Name: ${formData.get("name")}`,
      `Phone: ${formData.get("phone")}`,
      `Email: ${formData.get("email")}`,
      `Subject: ${formData.get("subject")}`,
      `Message: ${formData.get("message")}`,
    ].join("\\n");

    if (submitMethod === "email") {
      const subject = encodeURIComponent(formData.get("subject"));
      const body = encodeURIComponent(messageText);
      window.location.href = `mailto:info@namingapoultry.co.tz?subject=${subject}&body=${body}`;
      return;
    }

    window.open(`https://wa.me/255770025770?text=${encodeURIComponent(messageText)}`, "_blank", "noopener,noreferrer");
  });
}

/* =========================================================
   9. SCROLL REVEAL ANIMATION
========================================================= */

const revealElements = document.querySelectorAll(
  ".feature-card, " +
    ".product-card, " +
    ".bird-card, " +
    ".why-item, " +
    ".gallery-image, " +
    ".group-card",
);

revealElements.forEach((element) => {
  element.style.opacity = "0";

  element.style.transform = "translateY(25px)";

  element.style.transition = "opacity 0.7s ease, " + "transform 0.7s ease";
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";

        entry.target.style.transform = "translateY(0)";

        observer.unobserve(entry.target);
      }
    });
  },

  {
    threshold: 0.12,
  },
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

/* =========================================================
   10. STAGGER PRODUCT ANIMATION
========================================================= */

const productCards = document.querySelectorAll(".product-card");

productCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 100}ms`;
});

/* =========================================================
   11. STAGGER WHY-CHOOSE-US ANIMATION
========================================================= */

const whyItems = document.querySelectorAll(".why-item");

whyItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 100}ms`;
});

/* =========================================================
   12. ESCAPE KEY CLOSES MOBILE MENU
========================================================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProductModal();
    closeContactModal();

    if (mainNav) {
      mainNav.classList.remove("open");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-label", "Open navigation menu");

      menuToggle.setAttribute("aria-expanded", "false");
    }
  }
});

/* =========================================================
  14. DETECT QUALITY SECTION
========================================================= */

/*
   Your HTML currently has:

   <section class="why-section">

   We need this section to work with:

   #quality

   This automatically adds the ID if it
   hasn't already been added in HTML.
*/

const qualitySection = document.querySelector(".why-section");

if (qualitySection && !qualitySection.id) {
  qualitySection.id = "quality";
}

/* =========================================================
  15. PREVENT BROKEN IMAGE EXPERIENCE
========================================================= */

const images = document.querySelectorAll("img");

images.forEach((image) => {
  image.addEventListener("error", () => {
    image.classList.add("image-error");
  });
});

/* =========================================================
  16. PAGE LOADED
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-loaded");
});
