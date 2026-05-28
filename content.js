const feedSelector = 'div[data-testid="mainFeed"], div[data-finite-scroll-hotkey-context="FEED"]';
const feedFollowSelector = ".feed-follows-module";
const loadButtonSelector = ".scaffold-finite-scroll__load-button";
const buttonId = "unlock-button";
const buttonSelector = `#${buttonId}`;
const lockTime = 2700; // in milliseconds

function unlockFeed() {
  const button = document.querySelector(buttonSelector);

  document.querySelectorAll(`${feedSelector}, ${feedFollowSelector}, ${loadButtonSelector}`)
    .forEach((element) => {
      element.style.visibility = "visible";
    });

  if (button) {
    button.style.display = "none";
  }
}

function setupUnlockButton() {
  if (!window.location.href.includes("/feed") || document.querySelector(buttonSelector)) {
    return;
  }

  const feed = document.querySelector(feedSelector);

  if (feed) {
    const button = document.createElement("button");
    button.setAttribute("id", buttonId);
    button.textContent = "Feed locked. Press to unlock.";
    button.classList.add("artdeco-card");
    button.classList.add("t-black");
    button.classList.add("t-16");
    button.classList.add("t-bold");
    feed.before(button);

    const progress = document.createElement("progress");
    progress.setAttribute("id", "progress-bar");
    progress.setAttribute("max", "100");
    progress.setAttribute("value", "0");

    let interval;

    function startProgress(event) {
      if (event.isPrimary === false) {
        return;
      }
      if (interval) {
        return;
      }
      if (event.button === 1 || event.button === 2) { // right or middle click
        return;
      }
      button.textContent = "";
      button.appendChild(progress);
      progress.value = 0;
      interval = setInterval(() => {
        progress.value++;
        if (progress.value >= 100) {
          unlockFeed();
          clearInterval(interval);
          interval = undefined;
        }
      }, lockTime / 100);
    }

    function stopProgress() {
      if (!interval) {
        return;
      }

      clearInterval(interval);
      interval = undefined;
      button.textContent = "Feed locked. Press to unlock.";
      progress.value = 0;
    }

    button.addEventListener("pointerdown", startProgress);
    document.addEventListener("pointerup", stopProgress);
    document.addEventListener("pointercancel", stopProgress);
  }
}

function observePageChanges() {
  if (!document.body) {
    return;
  }

  const observer = new MutationObserver(setupUnlockButton);
  observer.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener("DOMContentLoaded", setupUnlockButton);
document.addEventListener("DOMContentLoaded", observePageChanges);
