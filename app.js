const WHATSAPP_NUMBER = "233538858495";
const DEFAULT_MESSAGE = "Hello Jeremy, I found King Jay's Tech and I'm interested in getting a website. I'd like to discuss my project.";

const year = document.getElementById("current-year");
if (year) year.textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    mainNav.classList.toggle("open", !isOpen);
  });
  mainNav.addEventListener("click", event => {
    if (event.target.closest("a")) {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter-button.active")?.classList.remove("active");
    button.classList.add("active");
    const category = button.dataset.filter;
    document.querySelectorAll(".project-card").forEach(card => {
      card.hidden = category !== "all" && card.dataset.category !== category;
    });
  });
});

const estimateForm = document.getElementById("estimate-form");
if (estimateForm) {
  estimateForm.addEventListener("submit", event => {
    event.preventDefault();
    const typeInput = document.getElementById("estimate-type");
    const type = typeInput.value;
    if (!type) {
      typeInput.focus();
      return;
    }
    const features = Array.from(estimateForm.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
    const pages = document.getElementById("estimate-pages").value;
    const design = document.getElementById("estimate-level").value;
    let recommendation = "Starter";
    if (type === "E-commerce store" || design === "Custom & advanced" || features.includes("Booking system")) {
      recommendation = "Premium";
    } else if (pages !== "1–3 pages" || features.length >= 2 || design === "Distinctive & polished") {
      recommendation = "Business";
    }
    const featureText = features.length ? features.join(", ") : "No additional features selected";
    const result = document.getElementById("estimate-result");
    result.replaceChildren();
    const heading = document.createElement("h4");
    heading.textContent = `Your project direction: ${recommendation}`;
    const summary = document.createElement("p");
    summary.textContent = `${type} with ${pages.toLowerCase()} · ${design.toLowerCase()} · ${featureText}.`;
    const link = document.createElement("a");
    const contactType = type === "E-commerce store" ? "E-commerce website" : type;
    const params = new URLSearchParams({ service: contactType, pages, budget: document.getElementById("estimate-budget").value });
    if (features.length) params.set("features", features.join(","));
    link.href = `contact.html?${params.toString()}#project-form`;
    link.className = "estimate-book-link";
    link.textContent = "Continue with this brief →";
    result.append(heading, summary, link);
    result.hidden = false;
  });
}

const bookingForm = document.getElementById("booking-form");
if (bookingForm) {
  const steps = Array.from(bookingForm.querySelectorAll(".booking-step"));
  const formError = document.getElementById("form-error");
  const confirmation = document.getElementById("booking-confirmation");

  const params = new URLSearchParams(window.location.search);
  const typeSelect = document.getElementById("booking-type");
  const requestedType = params.get("service");
  if (typeSelect && requestedType && Array.from(typeSelect.options).some(option => option.value === requestedType)) {
    typeSelect.value = requestedType;
  }
  const packageInput = bookingForm.querySelector('[name="package"]');
  if (packageInput) packageInput.value = params.get("package") || "";
  const pageSelect = bookingForm.querySelector('[name="pages"]');
  if (pageSelect && params.has("pages")) {
    const pages = params.get("pages");
    if (Array.from(pageSelect.options).some(option => option.value === pages)) pageSelect.value = pages;
  }
  const budgetSelect = bookingForm.querySelector('[name="budget"]');
  if (budgetSelect && params.has("budget")) {
    const budget = params.get("budget");
    if (Array.from(budgetSelect.options).some(option => option.value === budget)) budgetSelect.value = budget;
  }
  const selectedFeatures = new Set((params.get("features") || "").split(",").filter(Boolean).map(feature => feature === "WhatsApp integration" ? "WhatsApp" : feature));
  bookingForm.querySelectorAll('[name="features"]').forEach(input => { input.checked = selectedFeatures.has(input.value); });

  function showStep(number) {
    steps.forEach(step => step.classList.toggle("active", Number(step.dataset.step) === number));
    if (formError) formError.hidden = true;
    bookingForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function validateStep(step) {
    const inputs = Array.from(step.querySelectorAll("input[required], select[required], textarea[required]"));
    const firstInvalid = inputs.find(input => !input.checkValidity());
    if (!firstInvalid) return true;
    firstInvalid.reportValidity();
    firstInvalid.focus();
    return false;
  }

  function getValues() {
    const data = new FormData(bookingForm);
    return {
      name: data.get("name")?.trim() || "",
      business: data.get("business")?.trim() || "",
      email: data.get("email")?.trim() || "",
      phone: data.get("phone")?.trim() || "",
      country: data.get("country")?.trim() || "",
      type: data.get("type") || "",
      pages: data.get("pages") || "",
      budget: data.get("budget") || "",
      date: data.get("date") || "",
      references: data.get("references")?.trim() || "",
      package: data.get("package")?.trim() || "",
      features: data.getAll("features"),
      description: data.get("description")?.trim() || ""
    };
  }

  function buildSummary() {
    const data = getValues();
    const rows = [
      ["Name", data.name],
      ["Business", data.business || "Not specified"],
      ["Email", data.email],
      ["Phone / WhatsApp", data.phone],
      ["Country", data.country || "Not specified"],
      ["Website type", data.type],
      ["Pages", data.pages],
      ["Features", data.features.length ? data.features.join(", ") : "To be discussed"],
      ["Budget", data.budget],
      ["Desired date", data.date || "Flexible / to discuss"],
      ["References", data.references || "None provided"],
      ["Project description", data.description]
    ];
    if (data.package) rows.splice(6, 0, ["Package direction", data.package]);
    const summary = document.getElementById("project-summary");
    summary.replaceChildren(...rows.map(([label, value]) => {
      const row = document.createElement("div");
      row.className = "summary-row";
      const heading = document.createElement("strong");
      heading.textContent = label;
      const content = document.createElement("span");
      content.textContent = value;
      row.append(heading, content);
      return row;
    }));
  }

  bookingForm.querySelectorAll(".next-step").forEach(button => {
    button.addEventListener("click", () => {
      const currentStep = button.closest(".booking-step");
      const number = Number(currentStep.dataset.step);
      if (!validateStep(currentStep)) return;
      if (number === 2) buildSummary();
      showStep(number + 1);
    });
  });
  bookingForm.querySelectorAll(".previous-step").forEach(button => {
    button.addEventListener("click", () => showStep(Number(button.closest(".booking-step").dataset.step) - 1));
  });

  bookingForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!validateStep(steps[0]) || !validateStep(steps[1])) {
      formError.textContent = "Please complete the required details in the earlier steps before sending.";
      formError.hidden = false;
      return;
    }
    const data = getValues();
    const projectId = `KJT-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const message = [
      "Hello Jeremy, I'd like to discuss a website project with King Jay's Tech.",
      `Project reference: ${projectId}`,
      "",
      `Name: ${data.name}`,
      `Business / brand: ${data.business || "Not specified"}`,
      `Email: ${data.email}`,
      `Phone / WhatsApp: ${data.phone}`,
      `Country: ${data.country || "Not specified"}`,
      `Website type: ${data.type}`,
      `Package direction: ${data.package || "To be discussed"}`,
      `Pages: ${data.pages}`,
      `Requested features: ${data.features.length ? data.features.join(", ") : "To be discussed"}`,
      `Budget: ${data.budget}`,
      `Desired completion: ${data.date || "Flexible / to discuss"}`,
      `Reference websites: ${data.references || "None provided"}`,
      "",
      `Project description: ${data.description}`
    ].join("\n");
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const whatsappLink = document.createElement("a");
    whatsappLink.href = whatsappUrl;
    whatsappLink.target = "_blank";
    whatsappLink.rel = "noopener noreferrer";
    whatsappLink.click();
    steps.forEach(step => step.classList.remove("active"));
    document.getElementById("confirmation-id").textContent = `BRIEF READY · ${projectId}`;
    document.getElementById("confirmation-whatsapp").href = whatsappUrl;
    confirmation.hidden = false;
    confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  const newInquiry = document.getElementById("new-inquiry");
  if (newInquiry) {
    newInquiry.addEventListener("click", () => {
      bookingForm.reset();
      if (typeSelect) typeSelect.value = "";
      if (packageInput) packageInput.value = "";
      confirmation.hidden = true;
      showStep(1);
    });
  }
}

document.querySelectorAll(".floating-whatsapp,.footer-whatsapp").forEach(link => {
  if (!link.href.includes("text=")) link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
});
