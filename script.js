const menuPages = [
  "IMG_3723.jpg",
  "IMG_3724.jpg",
  "IMG_3725.jpg",
  "IMG_3726.jpg",
  "IMG_3727.jpg",
  "IMG_3729.jpg",
  "IMG_3730.jpg",
  "IMG_3731 (1).jpg",
  "IMG_3732.jpg",
  "IMG_3733.jpg",
  "IMG_3734.jpg"
];

const winePages = ["IMG_3735.jpg", "IMG_3736.jpg"];

const houseMedia = [
  { type: "video", filename: "01.MOV", caption: "Nossa casa — 01" },
  { type: "image", filename: "02.jpeg", alt: "Pizzaria Cristiano — foto 02", caption: "Nossa casa — 02" },
  { type: "image", filename: "03.jpeg", alt: "Pizzaria Cristiano — foto 03", caption: "Nossa casa — 03" },
  { type: "image", filename: "04.jpeg", alt: "Pizzaria Cristiano — foto 04", caption: "Nossa casa — 04" },
  { type: "video", filename: "05.MOV", caption: "Nossa casa — 05" },
  { type: "image", filename: "06.jpeg", alt: "Pizzaria Cristiano — foto 06", caption: "Nossa casa — 06" },
  { type: "image", filename: "07.jpg", alt: "Pizzaria Cristiano — foto 07", caption: "Nossa casa — 07" },
  { type: "image", filename: "08.PNG", alt: "Pizzaria Cristiano — foto 08", caption: "Nossa casa — 08" },
  { type: "image", filename: "09.jpg", alt: "Pizzaria Cristiano — foto 09", caption: "Nossa casa — 09" }
];

function setupPageViewer({
  pages,
  dialog,
  openButton,
  closeButton,
  pageImage,
  pageTurn,
  pageFront,
  pageBack,
  pageStatus,
  previousButton,
  nextButton,
  pageLabel
}) {
  const imagePaths = pages.map((filename) => `image/${encodeURIComponent(filename)}`);
  const pageLoads = new Map();
  let currentPage = 0;
  let isTurning = false;

  function preloadPage(index) {
    if (index < 0 || index >= imagePaths.length) return Promise.resolve(false);
    if (!pageLoads.has(index)) {
      pageLoads.set(index, new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);
        image.src = imagePaths[index];
      }));
    }
    return pageLoads.get(index);
  }

  function preloadAdjacentPages() {
    void preloadPage(currentPage - 1);
    void preloadPage(currentPage + 1);
  }

  function updateControls() {
    pageStatus.textContent = `PÁGINA ${currentPage + 1} DE ${imagePaths.length}`;
    previousButton.disabled = currentPage === 0 || isTurning;
    nextButton.disabled = currentPage === imagePaths.length - 1 || isTurning;
  }

  function openViewer() {
    if (dialog.open) return;
    dialog.showModal();
    document.body.classList.add("menu-open");
    closeButton.focus();
    preloadAdjacentPages();
  }

  function closeViewer() {
    if (dialog.open) dialog.close();
  }

  function turnPage(direction) {
    if (isTurning) return;

    const nextIndex = currentPage + direction;
    if (nextIndex < 0 || nextIndex >= imagePaths.length) return;

    isTurning = true;
    updateControls();
    pageFront.src = imagePaths[currentPage];
    pageBack.src = imagePaths[nextIndex];
    pageImage.src = imagePaths[nextIndex];
    pageImage.alt = `Página ${nextIndex + 1} ${pageLabel}`;
    pageTurn.className = `page-turn ${direction > 0 ? "turning-forward" : "turning-backward"}`;

    pageTurn.addEventListener("animationend", () => {
      currentPage = nextIndex;
      pageTurn.className = "page-turn";
      isTurning = false;
      updateControls();
      preloadAdjacentPages();
    }, { once: true });
  }

  openButton.addEventListener("click", openViewer);
  closeButton.addEventListener("click", closeViewer);
  dialog.addEventListener("close", () => document.body.classList.remove("menu-open"));
  previousButton.addEventListener("click", () => turnPage(-1));
  nextButton.addEventListener("click", () => turnPage(1));
  updateControls();
}

setupPageViewer({
  pages: menuPages,
  dialog: document.querySelector("#cardapio"),
  openButton: document.querySelector("[data-open-menu]"),
  closeButton: document.querySelector("[data-close-menu]"),
  pageImage: document.querySelector("[data-menu-page]"),
  pageTurn: document.querySelector("#cardapio .page-turn"),
  pageFront: document.querySelector("[data-page-front]"),
  pageBack: document.querySelector("[data-page-back]"),
  pageStatus: document.querySelector("[data-page-status]"),
  previousButton: document.querySelector("[data-page-previous]"),
  nextButton: document.querySelector("[data-page-next]"),
  pageLabel: "do cardápio"
});

setupPageViewer({
  pages: winePages,
  dialog: document.querySelector("#carta-vinhos"),
  openButton: document.querySelector("[data-open-wine]"),
  closeButton: document.querySelector("[data-close-wine]"),
  pageImage: document.querySelector("[data-wine-page]"),
  pageTurn: document.querySelector("#carta-vinhos .page-turn"),
  pageFront: document.querySelector("[data-wine-page-front]"),
  pageBack: document.querySelector("[data-wine-page-back]"),
  pageStatus: document.querySelector("[data-wine-page-status]"),
  previousButton: document.querySelector("[data-wine-page-previous]"),
  nextButton: document.querySelector("[data-wine-page-next]"),
  pageLabel: "da carta de vinhos"
});

function setupHouseGallery() {
  const dialog = document.querySelector("#nossa-casa");
  const openButton = document.querySelector("[data-open-house]");
  const closeButton = document.querySelector("[data-close-house]");
  const gallery = document.querySelector("[data-house-gallery]");
  const emptyMessage = document.querySelector("[data-house-gallery-empty]");

  function addMediaItem(item) {
    const card = document.createElement("article");
    card.className = "house-media-card";

    const frame = document.createElement("div");
    frame.className = "house-media-frame";

    const source = `nossa%20casa/${item.filename.split("/").map(encodeURIComponent).join("/")}`;
    let media;

    if (item.type === "video") {
      media = document.createElement("video");
      media.controls = true;
      media.playsInline = true;
      media.preload = "metadata";
      media.src = source;
      media.setAttribute("aria-label", item.caption || "Vídeo da Pizzaria Cristiano");
    } else {
      media = document.createElement("img");
      media.src = source;
      media.alt = item.alt;
      media.loading = "lazy";
    }

    frame.append(media);
    card.append(frame);

    if (item.caption) {
      const caption = document.createElement("p");
      caption.className = "house-media-caption";
      caption.textContent = item.caption;
      card.append(caption);
    }

    gallery.append(card);
  }

  houseMedia.forEach(addMediaItem);
  emptyMessage.hidden = houseMedia.length > 0;

  openButton.addEventListener("click", () => {
    if (dialog.open) return;
    dialog.showModal();
    document.body.classList.add("menu-open");
    closeButton.focus();
  });
  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => document.body.classList.remove("menu-open"));
}

setupHouseGallery();

function setupQRAccess() {
  const dialog = document.querySelector("#qr-access");
  const openButton = document.querySelector("[data-open-qr]");
  const closeButton = document.querySelector("[data-close-qr]");
  const image = document.querySelector("[data-qr-image]");
  const message = document.querySelector("[data-qr-message]");
  const downloadLink = document.querySelector("[data-qr-download]");

  function openQRDialog() {
    if (dialog.open) return;
    dialog.showModal();

    const url = new URL(window.location.href);
    if (!["http:", "https:"].includes(url.protocol) || ["localhost", "127.0.0.1", "::1"].includes(url.hostname)) {
      image.hidden = true;
      downloadLink.hidden = true;
      message.textContent = "Publique o site em um endereço acessível pela internet para gerar um QR code que funcione em outros celulares.";
      closeButton.focus();
      return;
    }

    url.search = "";
    url.hash = "";
    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(url.href)}`;
    image.hidden = false;
    downloadLink.hidden = true;
    message.textContent = "Gerando QR code...";
    downloadLink.href = qrURL;
    image.onload = () => {
      message.textContent = "Aponte a câmera do celular para acessar o site.";
      downloadLink.hidden = false;
    };
    image.onerror = () => {
      message.textContent = "Não foi possível gerar o QR code. Verifique sua conexão e tente novamente.";
      image.hidden = true;
    };
    image.src = qrURL;
    closeButton.focus();
  }

  openButton.addEventListener("click", openQRDialog);
  closeButton.addEventListener("click", () => dialog.close());
}

setupQRAccess();
