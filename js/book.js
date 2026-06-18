(function () {
  const pages = window.BOOK_PAGES;
  let current = 0;
  let flipping = false;

  const els = {
    closedBook: document.getElementById('closed-book'),
    coverFront: document.querySelector('.cover-front'),
    openBtn: document.getElementById('open-btn'),
    spread: document.getElementById('open-spread'),
    pagesArea: document.getElementById('pages-area'),
    left: document.getElementById('page-left'),
    right: document.getElementById('page-right'),
    controls: document.getElementById('controls'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    readBtn: document.getElementById('read-btn'),
    indicator: document.getElementById('page-indicator'),
    dot: document.getElementById('read-dot'),
    bookWrap: document.getElementById('book-wrap'),
  };

  const reader = new window.ReadAlong(els.dot);
  document.querySelector('.cover-art').innerHTML = window.COVER_ILLUSTRATION;

  function pageMarkup(side, page, label) {
    const isCover = page.kind === 'cover' || page.kind === 'title' || page.kind === 'end';
    const { html } = window.buildWordSpans(page.text);
    return `
      <div class="illustration">${page.illustration}</div>
      ${side === 'right' ? `<div class="page-text${isCover ? ' centered' : ''}">${html}${page.sub ? `<div class="sub">${page.sub}</div>` : ''}</div>` : ''}
      <div class="page-number">${label}</div>
    `;
  }

  function render() {
    const left = pages[current];
    const right = pages[current + 1] || pages[current];
    els.left.innerHTML = pageMarkup('left', left, current + 1);
    els.right.innerHTML = pageMarkup('right', right, current + 2 <= pages.length ? current + 2 : '');
    els.prevBtn.disabled = current <= 0;
    els.nextBtn.disabled = current + 2 >= pages.length;
    els.indicator.textContent = `${current + 1}-${Math.min(current + 2, pages.length)} / ${pages.length}`;
    reader.stop();
    setReadingState(false);
  }

  function setReadingState(isReading) {
    els.readBtn.classList.toggle('reading', isReading);
    els.readBtn.textContent = isReading ? '⏹ Stop' : '🔊 Read to me';
  }

  function flip(direction) {
    if (flipping) return;
    if (direction === 1 && current + 2 >= pages.length) return;
    if (direction === -1 && current <= 0) return;
    flipping = true;
    reader.stop();

    const leaf = document.createElement('div');
    leaf.className = `leaf ${direction === 1 ? 'to-right' : 'to-left'}`;
    const frontPage = direction === 1 ? pages[current + 1] : pages[current];
    const backPage = direction === 1 ? (pages[current + 2] || pages[current + 1]) : (pages[current - 1] || pages[current]);
    leaf.innerHTML = `
      <div class="leaf-face front">${pageMarkup('right', frontPage, '')}</div>
      <div class="leaf-face back">${pageMarkup('left', backPage, '')}</div>
    `;
    if (direction === 1) {
      els.pagesArea.appendChild(leaf);
    } else {
      els.pagesArea.insertBefore(leaf, els.pagesArea.firstChild);
    }

    requestAnimationFrame(() => {
      leaf.classList.add(direction === 1 ? 'playing-fwd' : 'playing-bwd');
    });

    setTimeout(() => {
      current = direction === 1 ? current + 2 : current - 2;
      if (current < 0) current = 0;
      render();
    }, 450);

    leaf.addEventListener('animationend', () => {
      leaf.remove();
      flipping = false;
    });
  }

  function openBook() {
    els.coverFront.style.transform = 'rotateY(-155deg)';
    els.openBtn.classList.add('hidden');
    els.bookWrap.style.transform = 'rotateX(4deg)';
    setTimeout(() => {
      els.closedBook.classList.add('hidden');
      els.spread.classList.add('visible');
      els.controls.classList.add('visible');
      render();
    }, 1050);
  }

  function toggleRead() {
    if (reader.active) {
      reader.stop();
      setReadingState(false);
      return;
    }
    setReadingState(true);
    const textEl = els.right.querySelector('.page-text');
    const rightPage = pages[current + 1] || pages[current];
    if (!textEl) {
      setReadingState(false);
      return;
    }
    reader.speak(textEl, rightPage.text, () => setReadingState(false));
  }

  els.openBtn.addEventListener('click', openBook);
  els.nextBtn.addEventListener('click', () => flip(1));
  els.prevBtn.addEventListener('click', () => flip(-1));
  els.readBtn.addEventListener('click', toggleRead);
  document.addEventListener('keydown', (e) => {
    if (!els.spread.classList.contains('visible')) return;
    if (e.key === 'ArrowRight') flip(1);
    if (e.key === 'ArrowLeft') flip(-1);
  });
})();
