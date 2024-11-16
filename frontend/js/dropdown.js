document.addEventListener("DOMContentLoaded", function () {
  const settingsBtn = document.querySelector(".settings-btn");
  const dropdown = document.getElementById("settingsDropdown");

  settingsBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.classList.toggle("active");
  });

  document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target) && !settingsBtn.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });

  const dropdownItems = document.querySelectorAll(".dropdown-item");
  dropdownItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const action = this.textContent.trim();

      switch (action) {
        case "⚙️ Settings":
          openSettings();
          break;
      }

      dropdown.classList.remove("active");
    });
  });

  function openSettings() {
    console.log("Settings opened");
  }
});
