# Charlotte's Web — Interactive Picture Book

An interactive 3D picture book you can open, flip through, and play with
right in your browser — pick up the magic wand, cast sparkles, tap glowing
words for definitions, and read along.

## How to run it

This is a browser app made of plain HTML/CSS/JavaScript — there is nothing
to install or build. But it **will not work if you just double-click
`index.html`**. Modern browsers block the type of JavaScript this project
uses (ES modules) from loading directly off your hard drive for security
reasons, so you'll just see a blank page.

Instead, you need to serve the folder over `http://localhost` using a tiny
local web server. Pick whichever option below is easiest for you — you only
need to do this once per computer.

### Step 1: Unzip the download

Unzip the file you downloaded. You'll get a folder containing `index.html`,
a `css` folder, a `js` folder, and an `assets` folder. Keep them all
together in the same folder.

### Step 2: Start a local server

Open a terminal (Mac: **Terminal** app, Windows: **PowerShell** or
**Command Prompt**) and navigate into the unzipped folder. For example, if
you unzipped it to your Desktop:

```
cd Desktop/charlottes-web-
```

Then run **one** of the following, depending on what you already have
installed:

**Option A — Python (most Mac/Linux computers already have this):**
```
python3 -m http.server 8000
```
On some Windows installs the command is `python` instead of `python3`:
```
python -m http.server 8000
```

**Option B — Node.js (if you have it installed):**
```
npx serve . -p 8000
```

**Option C — VS Code, no terminal needed:**
1. Open the unzipped folder in VS Code.
2. Install the "Live Server" extension (search for it in the Extensions
   panel).
3. Right-click `index.html` in the file list and choose
   "Open with Live Server".
4. Skip Step 3 below — it'll open your browser for you automatically.

### Step 3: Open it in your browser

Once the server is running (it'll print something like
`Serving HTTP on :: port 8000`), open your browser and go to:

```
http://localhost:8000
```

The book should load. Leave the terminal window open while you're using the
book — closing it stops the server. To stop it on purpose, click back into
that terminal and press `Ctrl+C`.

Next time you want to play, just repeat Step 2 and Step 3 — no need to
unzip again.

## Controls

- **Open the Book** — click the button to open the cover.
- **Prev / Next** — flip pages.
- **Close Book** — close it back up and return to the cover.
- **Read to me** — has the current page read aloud, highlighting each word.
- **Magic wand** — tap the floating wand to pick it up, drag it around, and
  tap "Cast Sparkles!" to cast a spell. Tap it again to put it down.
- **Glowing words** — tap any underlined glowing word on the page to see
  what it means.
- Drag anywhere on the table to spin the book around, and scroll/pinch to
  zoom.
