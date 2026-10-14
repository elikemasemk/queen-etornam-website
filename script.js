// ================================================
// Queen Etornam's BeIT Foundation — Launch Countdown
// ================================================

// Countdown length: 5 hours
const COUNTDOWN_HOURS = 5;
const DURATION_MS = COUNTDOWN_HOURS * 60 * 60 * 1000;

// FIXED LAUNCH TIME (recommended once the page is live).
// Set this to an exact time so every visitor sees the same countdown.
// Format: "YYYY-MM-DDTHH:MM:SSZ" (Z = GMT/Accra time).
// Example: 5 hours from 10:45 GMT on 14 Oct 2026 -> "2026-10-14T15:45:00Z"
// Leave as null to start a 5-hour countdown from the first visit in this browser.
const LAUNCH_TIME = "2026-10-14T15:45:00Z";

// --- Work out the target time ---
function getTargetTime() {
  if (LAUNCH_TIME) return new Date(LAUNCH_TIME).getTime();

  // Fallback: remember the first visit so refreshing doesn't reset the timer
  const KEY = "beit_launch_target";
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved) return Number(saved);

  const target = Date.now() + DURATION_MS;
  try { localStorage.setItem(KEY, String(target)); } catch (e) {}
  return target;
}

const target = getTargetTime();
const startTime = target - DURATION_MS;

const els = {
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  progress: document.getElementById("progressBar"),
  countdown: document.getElementById("countdown"),
  launched: document.getElementById("launched"),
  launchTime: document.getElementById("launchTime"),
  tagline: document.querySelector(".tagline"),
};

const pad = (n) => String(n).padStart(2, "0");

function setValue(el, value) {
  if (el.textContent !== value) {
    el.textContent = value;
    el.classList.remove("tick");
    void el.offsetWidth; // restart animation
    el.classList.add("tick");
  }
}

function showLaunched() {
  els.countdown.hidden = true;
  els.progress.parentElement.hidden = true;
  els.launchTime.hidden = true;
  els.tagline.textContent = "The wait is over.";
  els.launched.hidden = false;
  document.title = "We're live! | Queen Etornam's BeIT Foundation";
}

function update() {
  const remaining = target - Date.now();

  if (remaining <= 0) {
    clearInterval(timer);
    showLaunched();
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  setValue(els.hours, pad(h));
  setValue(els.minutes, pad(m));
  setValue(els.seconds, pad(s));

  const elapsed = Math.min(Math.max(Date.now() - startTime, 0), DURATION_MS);
  els.progress.style.width = (elapsed / DURATION_MS) * 100 + "%";
}

// Show the launch time in the visitor's local time
els.launchTime.textContent =
  "Launching " +
  new Date(target).toLocaleString(undefined, {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

update();
const timer = setInterval(update, 1000);

// --- Notify form (front-end only for now) ---
document.getElementById("notifyForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email");
  const msg = document.getElementById("formMsg");
  // TODO: connect to a backend or service (e.g. Formspree, Mailchimp) to actually collect emails
  msg.textContent = "Thank you! We'll let you know as soon as we launch.";
  email.value = "";
});

document.getElementById("year").textContent = new Date().getFullYear();
