const NAME = "Minh Thi";
const MUSIC_STORAGE_KEY = "musicEnabled";

const state = {
  screen: 1,
  pin: ["", "", "", ""],
  openedCards: new Set(),
  totalCards: 10,
  musicEnabled: getStoredMusicPreference(),
};

const cardMessages = [
  "Anh không mong những điều quá lớn lao, chỉ mong mỗi ngày của em đều bình yên. Cảm ơn em vì đã đến và trở thành nơi khiến anh luôn muốn quay về.",
  "Chúc cho cô gái nhỏ của anh luôn xinh đẹp vui vẻ và hạnh phúc em nhé. Mong răng em sẽ luôn nở nụ cười xinh trên môi, gác bỏ mọi ưu phiền và luôn biết yêu bản thân nhiều hơn. Mong cho mọi điều tốt đẹp nhất sẽ đến với em và tình yêu đôi ta. Chúc cho tình yêu của chúng ta sẽ mãi mãi bền lâu. Yêu em nhiều lắm.",
  "Anh chúc em có một ngày lễ tình nhân thật dịu dàng, ấm áp và tràn đầy năng lượng tích cực. Mong em luôn vui vẻ, tươi tăn mỗi ngày, luôn mim cười thật nhiều và bỏ lại những muộn phiền phía sau lưng. Anh chúc em luôn được yêu thương, được quan tâm và trân trọng,được sống trong những điều khiến em cảm thấy hạnh phúc. Và mong rằng hôm nay cũng như những ngày sau nữa, em luôn có thật nhiều lý do để cười, và luôn cảm nhận được rằng có anh ở bên em.",
  "Valentine này anh chỉ muốn nói rằng, dù sau này cuộc sống có thay đổi thế nào, anh vẫn muốn nắm tay em đi qua từng giai đoạn, từng năm tháng, thật chậm và thật chắc",
  "Cảm ơn em vì đã luôn nhẹ nhàng với anh, kiên nhẫn với anh, và yêu anh theo cách rất riêng. Em là điều khiến những ngày bình thường của anh trở nên đáng nhớ",
  "Anh không hứa sẽ cho em cả thế giới, nhưng anh hứa sẽ luôn cố gắng để em cảm thấy được yêu thương, được lắng nghe, và không bao giờ phải một mình.",
  "Nếu mỗi kỷ niệm là một bông hoa, thì tình yêu của anh dành cho em đã thành cả một khu vườn rồi. Và em vẫn luôn là bông hoa đẹp nhất trong đó.",
  "Anh không giỏi nói những lời hoa mỹ, nhưng anh biết chắc một điều: có em trong cuộc đời, mọi thứ với anh đều trở nên ý nghĩa hơn rất nhiều.",
  "Mong rằng sau này, dù là những ngày vui hay những lúc mệt mỏi, tụi mình vẫn sẽ luôn ở cạnh nhau, kể cho nhau nghe mọi chuyện, và cùng nhau vượt qua tất cả.",
  "Giữa rất nhiều người ngoài kia, anh vẫn luôn cảm thấy may mắn vì người anh gặp là em. Và nếu được chọn lại từ đầu, anh vẫn sẽ chọn em, thêm một lần nữa.",
];

const memoryPhotos = [
  "https://sf-static.upanhlaylink.com/img/image_20260216b7ce6bb32792af6838e84de391c1032d.jpg",
  "https://sf-static.upanhlaylink.com/img/image_20260216ca03a09f651dd88b3261a80d95913525.jpg",
  "https://sf-static.upanhlaylink.com/img/image_20260216d3bfb830b063102164a75a5e2dbc8b26.jpg",
  "https://sf-static.upanhlaylink.com/img/image_202602167bdc2ecb3a5302c51a45b53b7334f43d.jpg",
  "https://sf-static.upanhlaylink.com/img/image_202602169154b5b6d6ebf9040dd31c5a4e0eafd1.jpg",
  "https://sf-static.upanhlaylink.com/img/image_20260216f71c9a4409396136c2d0a31824377ec6.jpg",
  "https://sf-static.upanhlaylink.com/img/image_202602164bff5994d17a1c3459d0405226a1b044.jpg",
];

const dom = {
  app: null,
  progressSteps: [],
  progressLabel: null,
  pinInputs: [],
  pinError: null,
  lockCard: null,
  lockIcon: null,
  modal: null,
  modalPhoto: null,
  timeline: null,
  memoryList: null,
  ambientLayer: null,
  burstLayer: null,
  openedCounter: null,
  miniCardGrid: null,
  audio: null,
  musicToggle: null,
  cardMessageModal: null,
  cardMessageBackdrop: null,
  cardMessageClose: null,
  cardMessageMeta: null,
  cardMessageTitle: null,
  cardMessageText: null,
};

let ambientTimer = null;
let finaleTimers = [];
let musicInitArmed = false;
let audioUnlocked = false;
let lastMusicTime = 0;
let musicToastTimer = null;

window.addEventListener("DOMContentLoaded", () => {
  cacheDom();
  preloadMemoryPhotos();
  buildMemoryFlow();
  buildMiniCards();
  setupPinInputs();
  setupMemoryObserver();
  setupEvents();
  setupMusicControls();
  initMusicOnFirstInteraction();
  updateProgress();
  setFinalMode(state.screen === 6);
  updateOpenedCounter();
  startAmbientHearts();
});

function cacheDom() {
  dom.app = document.querySelector(".app");
  dom.progressSteps = Array.from(document.querySelectorAll(".progress-step"));
  dom.progressLabel = document.getElementById("progress-label");
  dom.pinInputs = Array.from(document.querySelectorAll(".pin-input"));
  dom.pinError = document.getElementById("pin-error");
  dom.lockCard = document.getElementById("lock-card");
  dom.lockIcon = document.getElementById("lock-icon");
  dom.modal = document.getElementById("memory-modal");
  dom.modalPhoto = document.getElementById("memory-modal-photo");
  dom.timeline = document.getElementById("timeline");
  dom.memoryList = document.getElementById("memory-list");
  dom.ambientLayer = document.getElementById("ambient-hearts");
  dom.burstLayer = document.getElementById("burst-layer");
  dom.openedCounter = document.getElementById("opened-counter");
  dom.miniCardGrid = document.getElementById("mini-card-grid");
  dom.audio = document.getElementById("bgm");
  dom.musicToggle = document.getElementById("music-toggle");
  dom.cardMessageModal = document.getElementById("card-message-modal");
  dom.cardMessageBackdrop = document.getElementById("card-message-backdrop");
  dom.cardMessageClose = document.getElementById("card-message-close");
  dom.cardMessageMeta = document.getElementById("card-message-meta");
  dom.cardMessageTitle = document.getElementById("card-message-title");
  dom.cardMessageText = document.getElementById("card-message-text");
}

function setupEvents() {
  const yesBtn = document.getElementById("yes-btn");
  if (yesBtn) {
    yesBtn.addEventListener("click", handleYesClick);
  }

  const noBtn = document.getElementById("no-btn");
  if (noBtn) {
    noBtn.addEventListener("click", handleNoClick);
  }

  const pinForm = document.getElementById("pin-form");
  if (pinForm) {
    pinForm.addEventListener("submit", (event) => {
      event.preventDefault();
      validatePin();
    });
  }

  const unlockBtn = document.getElementById("unlock-btn");
  if (unlockBtn) {
    unlockBtn.addEventListener("click", () => {
      if (state.musicEnabled) {
        tryPlayMusic("unlock-click");
      }
    });
  }

  addNav("back-to-1", 1);
  addNav("back-to-2", 2);
  addNav("next-to-4", 4);
  addNav("back-to-3", 3);
  addNav("next-to-5", 5);
  addNav("back-to-4", 4);
  addNav("next-to-6", 6);

  const randomOpenBtn = document.getElementById("random-open-btn");
  const openAllBtn = document.getElementById("open-all-btn");
  const replayBtn = document.getElementById("replay-btn");

  if (randomOpenBtn) {
    randomOpenBtn.addEventListener("click", randomOpenCard);
  }

  if (openAllBtn) {
    openAllBtn.addEventListener("click", openAllCards);
  }

  if (replayBtn) {
    replayBtn.addEventListener("click", resetAll);
  }

  const modalCloseBtn = document.getElementById("memory-modal-close");
  const modalBackdrop = document.getElementById("memory-modal-backdrop");

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", closeModal);
  }

  if (dom.cardMessageClose) {
    dom.cardMessageClose.addEventListener("click", closeCardMessageModal);
  }

  if (dom.cardMessageBackdrop) {
    dom.cardMessageBackdrop.addEventListener("click", closeCardMessageModal);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (dom.cardMessageModal && dom.cardMessageModal.classList.contains("show")) {
      closeCardMessageModal();
    }

    if (dom.modal.classList.contains("show")) {
      closeModal();
    }
  });
}

function setupMusicControls() {
  if (!dom.audio || !dom.musicToggle) {
    return;
  }

  dom.audio.loop = true;
  dom.audio.muted = false;
  dom.audio.volume = 0.7;

  console.log("BGM src:", dom.audio.currentSrc || dom.audio.querySelector("source")?.getAttribute("src") || "");
  console.log("BGM readyState:", dom.audio.readyState);
  console.log("BGM networkState:", dom.audio.networkState);

  dom.musicToggle.addEventListener("click", (event) => {
    event.preventDefault();
    toggleMusic();
  });

  dom.audio.addEventListener("canplay", () => console.log("BGM canplay"));
  dom.audio.addEventListener("play", () => {
    console.log("BGM playing");
    updateMusicUI();
  });
  dom.audio.addEventListener("pause", () => {
    if (!Number.isNaN(dom.audio.currentTime) && dom.audio.currentTime > 0) {
      lastMusicTime = dom.audio.currentTime;
    }
    console.log("BGM paused");
    updateMusicUI();
  });
  dom.audio.addEventListener("error", () => console.log("BGM error", dom.audio.error));
  dom.audio.addEventListener("ended", () => {
    console.log("BGM ended");
    lastMusicTime = 0;
    dom.audio.currentTime = 0;
    if (state.musicEnabled) {
      dom.audio.play().catch(() => {
        updateMusicUI();
      });
    }
  });

  updateMusicUI();
}

function initMusicOnFirstInteraction() {
  if (musicInitArmed || !dom.audio) {
    return;
  }

  musicInitArmed = true;

  const handleFirstInteraction = () => {
    document.removeEventListener("pointerdown", handleFirstInteraction);
    document.removeEventListener("touchstart", handleFirstInteraction);

    if (state.musicEnabled) {
      tryPlayMusic("first-interaction");
    }

    updateMusicUI();
  };

  document.addEventListener("pointerdown", handleFirstInteraction, { once: true, passive: true });
  document.addEventListener("touchstart", handleFirstInteraction, { once: true, passive: true });
}

function toggleMusic() {
  if (!dom.audio) {
    return;
  }

  state.musicEnabled = !state.musicEnabled;
  saveMusicPreference(state.musicEnabled);

  if (state.musicEnabled) {
    tryPlayMusic("toggle-on", { showToastOnBlock: true });
  } else {
    lastMusicTime = dom.audio.currentTime || 0;
    dom.audio.pause();
  }

  updateMusicUI();
}

function updateMusicUI() {
  if (!dom.musicToggle || !dom.audio) {
    return;
  }

  const isPlaying = !dom.audio.paused;
  dom.musicToggle.textContent = isPlaying ? "🔊" : "🔇";
  dom.musicToggle.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
  dom.musicToggle.setAttribute("aria-pressed", String(isPlaying));
}

function tryPlayMusic(trigger = "unknown", options = {}) {
  if (!dom.audio) {
    return;
  }

  if (!state.musicEnabled) {
    updateMusicUI();
    return;
  }

  const { showToastOnBlock = false } = options;

  dom.audio.muted = false;
  dom.audio.volume = 0.7;

  if (!audioUnlocked) {
    dom.audio.load();
    audioUnlocked = true;
  }

  if (dom.audio.paused && dom.audio.readyState >= 2 && lastMusicTime > 0) {
    if (Number.isFinite(dom.audio.duration) && dom.audio.duration > 0 && lastMusicTime >= dom.audio.duration - 0.3) {
      lastMusicTime = 0;
      try {
        dom.audio.currentTime = 0;
      } catch (error) {
        // ignore invalid seek attempts
      }
    }

    if (lastMusicTime > 0) {
      try {
        dom.audio.currentTime = lastMusicTime;
      } catch (error) {
        // ignore invalid seek attempts
      }
    }
  }

  console.log("BGM play attempt:", trigger, {
    readyState: dom.audio.readyState,
    networkState: dom.audio.networkState,
    currentTime: dom.audio.currentTime,
  });

  const playPromise = dom.audio.play();
  if (playPromise && typeof playPromise.then === "function") {
    playPromise
      .then(() => {
        console.log("BGM play success:", trigger);
        updateMusicUI();
      })
      .catch((err) => {
        console.warn("BGM play blocked:", err);
        if (showToastOnBlock) {
          showMusicToast("Tap anywhere to start music 💗");
        }
        updateMusicUI();
      });
  } else {
    updateMusicUI();
  }
}

function showMusicToast(message) {
  const app = document.querySelector(".app");
  if (!app) {
    return;
  }

  let toast = document.getElementById("music-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "music-toast";
    toast.style.position = "absolute";
    toast.style.left = "50%";
    toast.style.bottom = "18px";
    toast.style.transform = "translateX(-50%) translateY(8px)";
    toast.style.padding = "8px 12px";
    toast.style.borderRadius = "999px";
    toast.style.background = "rgba(120, 38, 78, 0.86)";
    toast.style.color = "#fff";
    toast.style.fontSize = "0.82rem";
    toast.style.fontWeight = "600";
    toast.style.letterSpacing = "0.01em";
    toast.style.boxShadow = "0 10px 18px rgba(110, 35, 71, 0.3)";
    toast.style.opacity = "0";
    toast.style.pointerEvents = "none";
    toast.style.transition = "opacity 180ms ease, transform 180ms ease";
    toast.style.zIndex = "60";
    app.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";

  if (musicToastTimer) {
    clearTimeout(musicToastTimer);
  }

  musicToastTimer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(8px)";
  }, 1600);
}

function getStoredMusicPreference() {
  try {
    const stored = localStorage.getItem(MUSIC_STORAGE_KEY);
    if (stored === null) {
      return true;
    }

    return stored !== "0";
  } catch (error) {
    return true;
  }
}

function saveMusicPreference(isEnabled) {
  try {
    localStorage.setItem(MUSIC_STORAGE_KEY, isEnabled ? "1" : "0");
  } catch (error) {
    // no-op when localStorage is unavailable
  }
}

function addNav(id, targetScreen) {
  const button = document.getElementById(id);
  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    showScreen(targetScreen);
  });
}

function showScreen(n) {
  if (n < 1 || n > 6 || n === state.screen) {
    return;
  }

  const current = document.getElementById(`screen-${state.screen}`);
  const next = document.getElementById(`screen-${n}`);

  if (!next) {
    return;
  }

  if (current) {
    current.classList.remove("active");
    current.classList.add("is-exiting");
    setTimeout(() => current.classList.remove("is-exiting"), 260);
  }

  next.classList.add("active");
  state.screen = n;
  setFinalMode(n === 6);
  updateProgress();

  if (n === 6) {
    runFinale();
  }
}

function setFinalMode(isFinal) {
  if (!dom.app) {
    return;
  }

  dom.app.classList.toggle("final-mode", Boolean(isFinal));
}

function updateProgress() {
  dom.progressSteps.forEach((step, idx) => {
    const stepNumber = idx + 1;
    step.classList.toggle("done", stepNumber < state.screen);
    step.classList.toggle("active", stepNumber === state.screen);
  });

  if (dom.progressLabel) {
    dom.progressLabel.textContent = `${state.screen} / 6`;
  }
}

function handleNoClick() {
  const noBtn = document.getElementById("no-btn");
  const teaseText = document.getElementById("tease-text");
  const yesBtn = document.getElementById("yes-btn");

  if (!noBtn || noBtn.classList.contains("vanish")) {
    return;
  }

  noBtn.classList.add("vanish");
  if (teaseText) {
    teaseText.textContent = "Hehe 😼 Nope! Only YES is allowed!";
    teaseText.classList.add("show");
  }

  noBtn.addEventListener(
    "animationend",
    () => {
      noBtn.remove();
    },
    { once: true }
  );

  if (yesBtn) {
    yesBtn.classList.add("bounce");
    yesBtn.addEventListener(
      "animationend",
      () => {
        yesBtn.classList.remove("bounce");
      },
      { once: true }
    );
  }
}

function handleYesClick() {
  const gift = document.getElementById("gift-box");
  const yesBtn = document.getElementById("yes-btn");

  if (state.musicEnabled) {
    tryPlayMusic("yes-click");
  }

  if (yesBtn) {
    yesBtn.disabled = true;
  }

  if (gift) {
    gift.classList.add("open");
    burstHearts({ count: 36, originEl: gift });
  }

  setTimeout(() => {
    showScreen(2);
    if (yesBtn) {
      yesBtn.disabled = false;
    }
  }, 1000);
}

function setupPinInputs() {
  const pinForm = document.getElementById("pin-form");

  dom.pinInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      const digit = input.value.replace(/\D/g, "").slice(-1);
      input.value = digit;
      state.pin[index] = digit;

      if (digit && index < dom.pinInputs.length - 1) {
        dom.pinInputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace") {
        if (!input.value && index > 0) {
          const prev = dom.pinInputs[index - 1];
          prev.value = "";
          state.pin[index - 1] = "";
          prev.focus();
        } else {
          state.pin[index] = "";
        }
      }

      if (event.key === "ArrowLeft" && index > 0) {
        dom.pinInputs[index - 1].focus();
      }

      if (event.key === "ArrowRight" && index < dom.pinInputs.length - 1) {
        dom.pinInputs[index + 1].focus();
      }

      if (event.key === "Enter") {
        event.preventDefault();
        validatePin();
      }
    });

    input.addEventListener("focus", () => input.select());
  });

  if (pinForm) {
    pinForm.addEventListener("paste", (event) => {
      const pasted = (event.clipboardData || window.clipboardData)
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 4);

      if (!pasted) {
        return;
      }

      event.preventDefault();
      clearPinInputs(false, false);

      pasted.split("").forEach((digit, idx) => {
        if (dom.pinInputs[idx]) {
          dom.pinInputs[idx].value = digit;
          state.pin[idx] = digit;
        }
      });

      const focusIndex = Math.min(pasted.length, 3);
      dom.pinInputs[focusIndex].focus();
    });
  }
}

function validatePin() {
  if (state.musicEnabled) {
    tryPlayMusic("unlock-submit");
  }

  const pinValue = dom.pinInputs.map((input) => input.value).join("");

  if (pinValue === "0803") {
    dom.pinError.textContent = "";
    dom.lockCard.classList.remove("shake");
    dom.lockCard.classList.add("unlock-success");
    dom.lockIcon.textContent = "🔓";
    dom.lockIcon.classList.remove("wrong");
    dom.lockIcon.classList.add("unlocked");
    burstHearts({ count: 26, originEl: dom.lockCard });

    setTimeout(() => {
      showScreen(3);
    }, 700);

    return true;
  }

  dom.lockCard.classList.remove("unlock-success");
  dom.lockCard.classList.add("shake");
  dom.lockIcon.textContent = "🔒";
  dom.lockIcon.classList.remove("unlocked");
  dom.lockIcon.classList.add("wrong");
  dom.pinError.textContent = "Oops… try again, sweetheart 😺";

  clearPinInputs(true, true);

  setTimeout(() => {
    dom.lockCard.classList.remove("shake");
    dom.lockIcon.classList.remove("wrong");
  }, 460);

  return false;
}

function clearPinInputs(withFade, shouldFocus = true) {
  state.pin = ["", "", "", ""];

  dom.pinInputs.forEach((input) => {
    if (withFade) {
      input.classList.add("clearing");
    }

    input.value = "";

    if (withFade) {
      setTimeout(() => input.classList.remove("clearing"), 340);
    }
  });

  if (shouldFocus) {
    setTimeout(() => {
      if (dom.pinInputs[0]) {
        dom.pinInputs[0].focus();
      }
    }, withFade ? 120 : 0);
  }
}

function setupMemoryObserver() {
  const items = Array.from(document.querySelectorAll(".memory-item"));

  if (!("IntersectionObserver" in window) || !dom.timeline) {
    items.forEach((item) => item.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    {
      root: dom.timeline,
      threshold: 0.18,
    }
  );

  items.forEach((item) => observer.observe(item));
}

function preloadMemoryPhotos() {
  memoryPhotos.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function buildMemoryFlow() {
  if (!dom.memoryList) {
    return;
  }

  const timelineMarks = ["💗", "🐾", "💗", "🐱", "💖", "😻", "💞"];
  const fragment = document.createDocumentFragment();
  dom.memoryList.innerHTML = "";

  memoryPhotos.forEach((src, index) => {
    const memoryId = index + 1;
    const item = document.createElement("article");
    item.className = "memory-item";
    item.dataset.memory = String(memoryId);

    const mark = document.createElement("span");
    mark.className = "timeline-mark";
    mark.textContent = timelineMarks[index % timelineMarks.length];

    const button = document.createElement("button");
    button.className = "memory-photo memory-photo-real";
    button.dataset.memory = String(memoryId);
    button.setAttribute("aria-label", `Open memory photo ${memoryId}`);

    const image = document.createElement("img");
    image.className = "memory-photo-img";
    image.src = src;
    image.alt = `Memory photo ${memoryId}`;
    image.loading = "lazy";
    image.decoding = "async";

    const badge = document.createElement("span");
    badge.className = "memory-index-badge";
    badge.textContent = String(memoryId);
    badge.setAttribute("aria-hidden", "true");

    const fallback = document.createElement("span");
    fallback.className = "memory-fallback";
    fallback.textContent = "Image unavailable";
    fallback.hidden = true;

    image.addEventListener("error", () => {
      button.classList.add("is-fallback");
      fallback.hidden = false;
      image.remove();
    });

    button.appendChild(image);
    button.appendChild(badge);
    button.appendChild(fallback);
    button.addEventListener("click", () => openModal(memoryId));

    item.appendChild(mark);
    item.appendChild(button);
    fragment.appendChild(item);
  });

  dom.memoryList.appendChild(fragment);
}

function openModal(memoryIndex) {
  const src = memoryPhotos[memoryIndex - 1];
  dom.modalPhoto.className = "memory-modal-photo";
  dom.modalPhoto.innerHTML = "";

  if (src) {
    const image = document.createElement("img");
    image.src = src;
    image.alt = `Memory photo ${memoryIndex}`;
    image.decoding = "async";
    image.loading = "eager";
    image.addEventListener("error", () => {
      dom.modalPhoto.classList.add("is-fallback");
      dom.modalPhoto.textContent = "Image unavailable";
    });
    dom.modalPhoto.appendChild(image);
  } else {
    dom.modalPhoto.classList.add("is-fallback");
    dom.modalPhoto.textContent = "Image unavailable";
  }

  dom.modal.classList.add("show");
  dom.modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  dom.modal.classList.remove("show");
  dom.modal.setAttribute("aria-hidden", "true");
}

function openCardMessageModal(index) {
  if (!dom.cardMessageModal || !dom.cardMessageMeta || !dom.cardMessageTitle || !dom.cardMessageText) {
    return;
  }

  dom.cardMessageMeta.textContent = `Card #${index + 1}`;
  dom.cardMessageTitle.textContent = "To Minh Thi 💌";
  dom.cardMessageText.textContent = cardMessages[index] || "";
  dom.cardMessageModal.classList.add("show");
  dom.cardMessageModal.setAttribute("aria-hidden", "false");
}

function closeCardMessageModal() {
  if (!dom.cardMessageModal) {
    return;
  }

  dom.cardMessageModal.classList.remove("show");
  dom.cardMessageModal.setAttribute("aria-hidden", "true");
}

function buildMiniCards() {
  const fragment = document.createDocumentFragment();

  cardMessages.forEach((_, index) => {
    const card = document.createElement("div");
    card.className = "mini-card";
    card.dataset.index = String(index);
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Open card ${index + 1}`);

    card.innerHTML = `
      <div class="env">
        <div class="env-back"></div>
        <div class="env-flap"></div>
        <div class="env-seal">💗</div>
        <div class="env-hint">Tap to open</div>
        <div class="opened-tag">OPENED</div>
        <div class="letter">
          <div class="letter-text"></div>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      openCard(index, { showModal: true });
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCard(index, { showModal: true });
      }
    });

    fragment.appendChild(card);
  });

  dom.miniCardGrid.appendChild(fragment);
  state.totalCards = cardMessages.length;
}

function openCard(index, options = {}) {
  const { forceOpen = false, showModal = false } = options;
  const card = document.querySelector(`.mini-card[data-index="${index}"]`);

  if (!card) {
    return;
  }

  const wasOpened = state.openedCards.has(index);

  card.classList.remove("open");
  void card.offsetWidth;
  card.classList.add("open");
  card.classList.add("pop");
  setTimeout(() => card.classList.remove("pop"), 320);
  setTimeout(() => card.classList.remove("open"), 640);

  if (forceOpen || !wasOpened) {
    state.openedCards.add(index);
    card.classList.add("is-opened");
    sparkleAroundCard(card);
  } else {
    card.classList.add("is-opened");
  }

  updateOpenedCounter();

  if (showModal) {
    setTimeout(() => openCardMessageModal(index), 120);
  }
}

function randomOpenCard() {
  const unopened = cardMessages
    .map((_, idx) => idx)
    .filter((idx) => !state.openedCards.has(idx));

  if (!unopened.length) {
    if (dom.openedCounter) {
      dom.openedCounter.classList.add("pop");
      setTimeout(() => dom.openedCounter.classList.remove("pop"), 330);
    }
    return;
  }

  const randomIndex = unopened[Math.floor(Math.random() * unopened.length)];
  openCard(randomIndex, { forceOpen: true, showModal: false });

  const card = document.querySelector(`.mini-card[data-index="${randomIndex}"]`);
  if (card) {
    card.classList.add("glow");
    setTimeout(() => card.classList.remove("glow"), 780);
    card.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  }
}

function openAllCards() {
  const unopened = cardMessages
    .map((_, idx) => idx)
    .filter((idx) => !state.openedCards.has(idx));

  unopened.forEach((idx, order) => {
    setTimeout(() => {
      if (!state.openedCards.has(idx)) {
        openCard(idx, { forceOpen: true, showModal: false });
      }
    }, 110 * order);
  });
}

function updateOpenedCounter() {
  if (dom.openedCounter) {
    dom.openedCounter.textContent = `Opened: ${state.openedCards.size} / ${state.totalCards}`;
  }
}

function sparkleAroundCard(card) {
  const rect = card.getBoundingClientRect();

  for (let i = 0; i < 5; i += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "card-spark";
    sparkle.textContent = i % 2 === 0 ? "✦" : "✧";
    sparkle.style.left = `${Math.random() * rect.width}px`;
    sparkle.style.top = `${Math.random() * rect.height}px`;
    card.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 620);
  }
}

function burstHearts({ count = 24, originEl = null } = {}) {
  const origin = getOrigin(originEl);
  const hearts = ["💗", "💖", "💕", "💞", "🐾"];

  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement("span");
    const angle = (Math.random() * 120 - 60) * (Math.PI / 180);
    const distance = 55 + Math.random() * 120;
    const dx = Math.cos(angle) * distance;
    const dy = -Math.abs(Math.sin(angle) * distance) - (30 + Math.random() * 75);

    particle.className = "burst-heart";
    particle.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    particle.style.left = `${origin.x}px`;
    particle.style.top = `${origin.y}px`;
    particle.style.setProperty("--dx", `${dx.toFixed(1)}px`);
    particle.style.setProperty("--dy", `${dy.toFixed(1)}px`);
    particle.style.setProperty("--rot", `${Math.random() * 260 - 130}deg`);
    particle.style.setProperty("--start-scale", `${(0.65 + Math.random() * 0.6).toFixed(2)}`);
    particle.style.animationDuration = `${900 + Math.random() * 500}ms`;

    dom.burstLayer.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
  }
}

function getOrigin(originEl) {
  if (!originEl) {
    return {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.58,
    };
  }

  const rect = originEl.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function startAmbientHearts() {
  if (ambientTimer) {
    clearInterval(ambientTimer);
  }

  ambientTimer = setInterval(() => {
    if (document.hidden) {
      return;
    }

    createAmbientHeart();
  }, 1250);
}

function createAmbientHeart() {
  const heart = document.createElement("span");
  const symbols = ["♡", "♥", "❥", "💗"];
  const duration = 6500 + Math.random() * 4200;

  heart.className = "ambient-heart";
  heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${10 + Math.random() * 14}px`;
  heart.style.animationDuration = `${duration}ms`;
  heart.style.setProperty("--driftX", `${Math.random() * 70 - 35}px`);

  dom.ambientLayer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, duration);
}

function runFinale() {
  finaleTimers.forEach((timer) => clearTimeout(timer));
  finaleTimers = [];

  const origin = document.querySelector("#screen-6 .final6-title") || document.getElementById("screen-6");
  [0, 420, 840].forEach((delay) => {
    const t = setTimeout(() => burstHearts({ count: 12, originEl: origin }), delay);
    finaleTimers.push(t);
  });
}

function resetAll() {
  closeModal();
  closeCardMessageModal();

  const gift = document.getElementById("gift-box");
  if (gift) {
    gift.classList.remove("open");
  }

  const teaseText = document.getElementById("tease-text");
  if (teaseText) {
    teaseText.textContent = "";
    teaseText.classList.remove("show");
  }

  restoreNoButton();

  state.openedCards.clear();
  document.querySelectorAll(".mini-card").forEach((card) => {
    card.classList.remove("open", "pop", "glow", "is-opened");
  });
  updateOpenedCounter();

  clearPinInputs(false, false);
  dom.pinError.textContent = "";
  dom.lockCard.classList.remove("shake", "unlock-success");
  dom.lockIcon.classList.remove("wrong", "unlocked");
  dom.lockIcon.textContent = "🔒";

  if (dom.timeline) {
    dom.timeline.scrollTop = 0;
  }

  if (state.screen !== 1) {
    showScreen(1);
  } else {
    setFinalMode(false);
    updateProgress();
  }
}

function restoreNoButton() {
  const buttonsWrap = document.getElementById("screen1-buttons");
  const existingNo = document.getElementById("no-btn");

  if (existingNo) {
    existingNo.classList.remove("vanish");
    return;
  }

  if (!buttonsWrap) {
    return;
  }

  const noButton = document.createElement("button");
  noButton.id = "no-btn";
  noButton.className = "btn btn-soft";
  noButton.setAttribute("aria-label", "Say no to opening the gift");
  noButton.textContent = "NO 🙅‍♀️";
  noButton.addEventListener("click", handleNoClick);
  buttonsWrap.appendChild(noButton);
}
