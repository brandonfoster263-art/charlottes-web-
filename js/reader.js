/* Read-along: speaks the page text and hops a little dot across each
   word as it's spoken, using the Web Speech API's word boundary events. */

(function () {
  function buildWordSpans(text) {
    const words = [];
    let html = '';
    const re = /\S+/g;
    let m;
    let last = 0;
    let i = 0;
    while ((m = re.exec(text)) !== null) {
      html += text.slice(last, m.index);
      html += `<span class="word" data-i="${i}">${m[0]}</span>`;
      words.push({ start: m.index, end: m.index + m[0].length, i });
      last = m.index + m[0].length;
      i++;
    }
    html += text.slice(last);
    return { html, words };
  }

  function wordIndexForChar(words, charIndex) {
    for (let k = words.length - 1; k >= 0; k--) {
      if (charIndex >= words[k].start) return words[k].i;
    }
    return 0;
  }

  class ReadAlong {
    constructor(dotEl) {
      this.dot = dotEl;
      this.supported = 'speechSynthesis' in window;
      this.active = false;
      this.onEnd = null;
    }

    stop() {
      if (this.supported) window.speechSynthesis.cancel();
      this.active = false;
      this.dot.classList.remove('shown');
      document.querySelectorAll('.page-text .word.active').forEach((el) => el.classList.remove('active'));
    }

    speak(pageTextEl, rawText, onEnd) {
      this.stop();
      if (!this.supported) {
        if (onEnd) onEnd();
        return;
      }
      this.active = true;
      this.onEnd = onEnd;
      const words = Array.from(pageTextEl.querySelectorAll('.word'));
      const utter = new SpeechSynthesisUtterance(rawText);
      utter.rate = 0.85;
      utter.pitch = 1.05;

      const moveDotTo = (el) => {
        const r = el.getBoundingClientRect();
        this.dot.style.left = `${r.left + r.width / 2 - 13}px`;
        this.dot.style.top = `${r.top - 30}px`;
        this.dot.classList.add('shown');
        this.dot.classList.remove('hop');
        void this.dot.offsetWidth;
        this.dot.classList.add('hop');
      };

      const highlight = (idx) => {
        words.forEach((w) => w.classList.remove('active'));
        const el = words[idx];
        if (el) {
          el.classList.add('active');
          moveDotTo(el);
        }
      };

      const charRanges = buildWordSpans(rawText).words;
      utter.onboundary = (e) => {
        if (e.name && e.name !== 'word') return;
        highlight(wordIndexForChar(charRanges, e.charIndex));
      };

      utter.onend = () => {
        this.active = false;
        this.dot.classList.remove('shown');
        words.forEach((w) => w.classList.remove('active'));
        if (this.onEnd) this.onEnd();
      };

      utter.onerror = () => {
        this.active = false;
        this.dot.classList.remove('shown');
        if (this.onEnd) this.onEnd();
      };

      window.speechSynthesis.speak(utter);
    }
  }

  window.ReadAlong = ReadAlong;
  window.buildWordSpans = buildWordSpans;
})();
