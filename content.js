const feedSelector = 'div[data-finite-scroll-hotkey-context="FEED"]';
const feedFollowSelector = ".feed-follows-module";
const buttonId = "unlock-button";
const buttonSelector = `#${buttonId}`;
const lockTime = 1500; // in milliseconds

function unlockFeed() {
  const feed = document.querySelector(feedSelector);
  const feedFollow = document.querySelector(feedFollowSelector);
  const button = document.querySelector(buttonSelector);

  feed.style.visibility = "visible";
  feedFollow.style.visibility = "visible";
  button.style.display = "none";
}

function setupUnlockButton() {
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

    let pressTimer;
    let interval;

    function startProgress() {
      button.textContent = "";
      button.appendChild(progress);
      progress.value = 0;
      interval = setInterval(() => {
        progress.value++;
        if (progress.value >= 100) {
          unlockFeed();
          clearInterval(interval);
        }
      }, lockTime / 100);
    }

    function stopProgress() {
      clearTimeout(pressTimer);
      clearInterval(interval);
      button.textContent = "Feed locked. Press to unlock.";
      progress.value = 0;
    }

    // Mouse based device
    button.addEventListener("mousedown", startProgress);
    document.addEventListener("mouseup", stopProgress);

    // Touch based device
    button.addEventListener("touchstart", startProgress);
    document.addEventListener("touchend", stopProgress);
  }
}

function observePageChanges() {
  let lastLocation = window.location.href;
  setInterval(() => {
    let currentLocation = window.location.href;
    if (lastLocation !== currentLocation) {
      lastLocation = currentLocation;
      if (currentLocation.includes("/feed")) {
        setupUnlockButton();
      }
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", observePageChanges);
document.addEventListener("DOMContentLoaded", setupUnlockButton);
