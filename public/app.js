"use strict";

const itemsEl = findPlaylistItemsContainerEl();
let childEl;
while ((childEl = itemsEl.firstChild)) {
  const wasRemoved = removeIfNotSelected(childEl);
  if (!wasRemoved) break;
}

/**
 * @returns {HTMLUListElement}
 */
function findPlaylistItemsContainerEl() {}

function removeIfNotSelected(el) {
  if (!el.classList.contains("selected")) {
    el.remove();
  }
  return !el.classList.contains("not-selected"); // this is really bad: mysterious, surprising, hidden dependency
}
