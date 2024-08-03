function generateGUID() {
  // Generate 16 random bytes
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);

  // Set the version to 4
  bytes[6] = (bytes[6] & 0x0f) | 0x40;

  // Set the variant to 10
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  // Convert bytes to hexadecimal and format as a GUID
  const guid = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${guid.substring(0, 8)}-${guid.substring(8, 12)}-${guid.substring(
    12,
    16
  )}-${guid.substring(16, 20)}-${guid.substring(20)}`;
}

document
  .getElementById("generateButton")
  .addEventListener("click", function () {
    const guid = generateGUID();
    document.getElementById("guid").value = guid;

    // Enable save button and store the GUID in a data attribute
    const saveButton = document.getElementById("saveButton");
    saveButton.disabled = false;
    saveButton.dataset.guid = guid;
  });

document.getElementById("saveButton").addEventListener("click", function () {
  const name = document.getElementById("nameInput").value.trim();
  const guid = this.dataset.guid;

  if (name && guid) {
    saveGUID(name, guid);
    displaySavedGUIDs();
    this.disabled = true;
    document.getElementById("nameInput").value = "";
  } else {
    return;
  }
});

function saveGUID(name, guid) {
  const savedGUIDs = JSON.parse(localStorage.getItem("savedGUIDs") || "[]");
  savedGUIDs.push({ name, guid });
  localStorage.setItem("savedGUIDs", JSON.stringify(savedGUIDs));
}

function displaySavedGUIDs() {
  const guidList = document.getElementById("guidList");
  guidList.innerHTML = "";
  const savedGUIDs = JSON.parse(localStorage.getItem("savedGUIDs") || "[]");

  savedGUIDs.forEach(({ name, guid }, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<span><span class="name">${name}</span><br> <span class="guid">${guid}</span></span>`;

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-trash-alt");
    deleteButton.appendChild(icon);

    deleteButton.addEventListener("click", function () {
      deleteSavedGUID(index);
    });

    const copyButton = document.createElement("button");
    copyButton.classList.add("copy-btn");
    const copyIcon = document.createElement("i");
    copyIcon.classList.add("fas", "fa-copy");
    copyButton.appendChild(copyIcon);

    copyButton.addEventListener("click", function () {
      const guid = this.parentNode.previousSibling.lastChild.textContent;
      navigator.clipboard.writeText(guid);

      this.childNodes[0].classList.remove("fa-copy");
      this.childNodes[0].classList.add("fa-check");
      this.classList.add("copied");
      setTimeout(() => {
        this.childNodes[0].classList.remove("fa-check");
        this.childNodes[0].classList.add("fa-copy");
        this.classList.remove("copied");
      }, 3000);
    });

    actions.appendChild(copyButton);
    actions.appendChild(deleteButton);

    listItem.appendChild(actions);
    guidList.appendChild(listItem);
  });

  guidList.scrollTop = guidList.scrollHeight;
}

function deleteSavedGUID(index) {
  const savedGUIDs = JSON.parse(localStorage.getItem("savedGUIDs") || "[]");

  if (index >= 0 && index < savedGUIDs.length) {
    savedGUIDs.splice(index, 1);
    localStorage.setItem("savedGUIDs", JSON.stringify(savedGUIDs));
    displaySavedGUIDs();
  }
}
// Display saved GUIDs on load
document.addEventListener("DOMContentLoaded", displaySavedGUIDs);
