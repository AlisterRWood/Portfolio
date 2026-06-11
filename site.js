const app = document.getElementById("app");

fetch("data/portfolio.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error("Failed to load published portfolio data.");
    return response.json();
  })
  .then((data) => {
    app.innerHTML = renderPage(data);
  })
  .catch((error) => {
    app.innerHTML = '<div class="empty"><p>' + escapeHtml(error.message) + "</p></div>";
  });

function renderPage(data) {
  const aboutSection = data.sections.find((item) => item.section === "About");
  const cvSection = data.sections.find((item) => item.section === "CV");
  const caseStudyIntro = data.sections.find((item) => item.section === "Case Studies");
  const galleryIntro = data.sections.find((item) => item.section === "Product Gallery");

  return `
    <section class="hero">
      <div class="hero-grid">
        <div>
          <div class="eyebrow">Public portfolio</div>
          <h1>${escapeHtml(data.profile.name)}</h1>
          <p>${escapeHtml(data.profile.summary)}</p>
        </div>
        <dl class="hero-card">
          <dt>Portfolio focus</dt>
          <dd>${escapeHtml(data.profile.headline)}</dd>
          <dt style="margin-top:1rem">Published</dt>
          <dd>${escapeHtml(new Date(data.generatedAt).toLocaleDateString())}</dd>
        </dl>
      </div>
      <div class="grid meta-grid">
        <dl class="hero-card"><dt>Case studies</dt><dd>${data.caseStudies.length}</dd></dl>
        <dl class="hero-card"><dt>Roles</dt><dd>${data.roles.length}</dd></dl>
        <dl class="hero-card"><dt>Gallery items</dt><dd>${data.gallery.length}</dd></dl>
      </div>
    </section>

    ${aboutSection ? renderRichSection("About", aboutSection.title, aboutSection.content) : ""}
    ${renderRoles(data.roles)}
    ${cvSection ? renderRichSection("Positioning", cvSection.title, cvSection.content) : ""}
    ${renderCaseStudies(caseStudyIntro, data.caseStudies)}
    ${renderGallery(galleryIntro, data.gallery)}
    ${renderSkills(data.skills)}
    <footer class="footer">Generated from a private evidence system. Sensitive details are omitted or redacted for public sharing.</footer>
  `;
}

function renderRichSection(kicker, title, content) {
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <div class="section-kicker">${escapeHtml(kicker)}</div>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(content)}</p>
        </div>
      </div>
    </section>
  `;
}

function renderRoles(roles) {
  if (!roles.length) return "";
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <div class="section-kicker">Experience</div>
          <h2>Career history</h2>
          <p>Selected roles exported from the private career database with public and redacted handling applied.</p>
        </div>
      </div>
      <div class="cards-2">
        ${roles
          .map(
            (role) => `
              <article class="panel">
                <h3>${escapeHtml(role.title)}</h3>
                <p>${escapeHtml(role.company)} | ${escapeHtml(role.startDate)} - ${escapeHtml(role.endDate || "Present")}</p>
                <p>${escapeHtml(role.summary)}</p>
                ${role.responsibilities.length ? "<ul>" + role.responsibilities.map((item) => "<li>" + escapeHtml(item) + "</li>").join("") + "</ul>" : ""}
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderCaseStudies(intro, caseStudies) {
  if (!caseStudies.length) return "";
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <div class="section-kicker">Case studies</div>
          <h2>${escapeHtml(intro?.title || "Selected product work")}</h2>
          <p>${escapeHtml(intro?.content || "Evidence-backed case studies generated from the private app.")}</p>
        </div>
      </div>
      <div class="cards-2">
        ${caseStudies
          .map(
            (item) => `
              <article class="panel">
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml([item.roleTitle, item.company, item.timeline].filter(Boolean).join(" | "))}</p>
                <p><strong>Problem:</strong> ${escapeHtml(item.problem)}</p>
                <p><strong>Context:</strong> ${escapeHtml(item.context)}</p>
                <p><strong>Action:</strong> ${escapeHtml(item.action)}</p>
                <p><strong>Result:</strong> ${escapeHtml(item.result)}</p>
                ${item.metrics.length ? "<div class=\"tag-row\">" + item.metrics.map((metric) => "<span class=\"tag\">" + escapeHtml(metric) + "</span>").join("") + "</div>" : ""}
                ${item.skills.length ? "<div class=\"tag-row\">" + item.skills.map((skill) => "<span class=\"tag\">" + escapeHtml(skill) + "</span>").join("") + "</div>" : ""}
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderGallery(intro, gallery) {
  if (!gallery.length) return "";
  return `
    <section class="section gallery">
      <div class="section-head">
        <div>
          <div class="section-kicker">Gallery</div>
          <h2>${escapeHtml(intro?.title || "Screenshots and product proof")}</h2>
          <p>${escapeHtml(intro?.content || "Public image evidence copied into the portfolio repo.")}</p>
        </div>
      </div>
      <div class="cards-3">
        ${gallery
          .map(
            (item) => `
              <article class="panel">
                ${item.imagePath ? '<img src="' + encodeURI(item.imagePath) + '" alt="' + escapeHtml(item.title) + '" />' : ""}
                <h3 style="margin-top:1rem">${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.summary)}</p>
                ${item.tags.length ? "<div class=\"tag-row\">" + item.tags.map((tag) => "<span class=\"tag\">" + escapeHtml(tag) + "</span>").join("") + "</div>" : ""}
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderSkills(skills) {
  if (!skills.length) return "";
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <div class="section-kicker">Skills</div>
          <h2>Product leadership strengths</h2>
          <p>Skills are included only when they are backed by publishable achievements or evidence.</p>
        </div>
      </div>
      <div class="cards-3">
        ${skills
          .map(
            (skill) => `
              <article class="panel">
                <h3>${escapeHtml(skill.name)}</h3>
                <p>${escapeHtml(skill.description)}</p>
                <div class="tag-row"><span class="tag">Strength ${escapeHtml(String(skill.strengthScore))}</span></div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
