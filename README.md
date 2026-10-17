# Openguessr Helper

A lightweight, browser-based coordinate tool for Guessr-style map games. It adds a small floating interface that lets you enter geographic coordinates and reposition the existing player pin on the map.

**This project is intended for fun, experimentation, and personal learning. Please use it responsibly.**

## Features

- **Floating UI:** A compact, glass-style interface that stays out of the way.
- **Auto-fill:** Attempts to read latitude and longitude from supported Google Maps embed URLs.
- **Manual override:** Enter your own latitude and longitude.
- **Move Pin:** Repositions the existing player pin to the specified coordinates.
- **Keyboard shortcut:** Press `Cmd + Shift + C` to open or close the interface on supported browsers and platforms.
- **Accessibility:** Includes keyboard controls, focus handling, and screen-reader status announcements.
- **Cleanup support:** Removes the previous interface and its active interval when the script is run again.

## Files

This project contains two JavaScript variants:

| Version | Description |
|---|---|
| Original version | Opens the coordinate panel using a keyboard shortcut. |
| Toggle-button version | Adds a floating map-pin button, a close button, and an expandable panel. |

Both versions share the same core coordinate detection and pin movement functionality. **Run only one version at a time.**

## How It Works

1. The script creates a floating coordinate interface.
2. It attempts to detect coordinates from Google Maps embed URLs on the current page.
3. You can use the detected coordinates or switch to manual mode.
4. Enter the desired latitude and longitude in this format:

   `latitude, longitude`

   Example: `48.8584, 2.2945`

5. Click **Move Pin** to reposition the existing player pin.
6. Review the position on the map and click the pin yourself if the game requires a separate confirmation.

### Important: Moving the Pin Is Not Submitting a Guess

**Moving the pin only changes its displayed location on the map. It does not automatically submit, confirm, or lock in a guess.** You must still click the pin or use the game's normal confirmation controls as appropriate.

Coordinate detection is best-effort and depends on the page's map implementation. Auto-fill may not work on every map or game version.

## Usage

These scripts are intended for compatible browser pages where you have permission to run custom JavaScript.

1. Open a compatible map page.
2. Run one of the JavaScript variants in an appropriate, authorized environment.
3. Open the coordinate panel.
4. Choose Auto-fill or Manual override.
5. Enter or verify the coordinates.
6. Click **Move Pin** and confirm the displayed position.

Browser developer tools, page structures, and map libraries can change. Compatibility is not guaranteed.

## Quick Run (Browser Console)

You can run either version directly from the browser's Developer Tools console without manually downloading the file.

**Toggle-button version:**

```js
fetch('https://raw.githubusercontent.com/AbhyanshAnand/openguessr-helper/main/toggle.js')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  })
  .then(code => (0, eval)(code))
  .catch(error => console.error('Failed to load Guessr Pin Coordinates:', error));
```

**Keyboard-shortcut version:**

```js
fetch('https://raw.githubusercontent.com/AbhyanshAnand/openguessr-helper/main/keybind.js')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  })
  .then(code => (0, eval)(code))
  .catch(error => console.error('Failed to load Guessr Pin Coordinates:', error));
```

Replace `USERNAME`, `REPOSITORY`, `BRANCH`, and the filenames with the actual values from your GitHub repository.

Only run code from a source you trust. Fetching JavaScript and evaluating it executes that code with the privileges of the current page.

### Allowing Pasting in the Developer Console

Some browsers, including Chrome, may block pasting into the Developer Tools console as a security measure.

1. Open the compatible game page.
2. Open Developer Tools:
   - **Windows/Linux:** `Ctrl + Shift + J` in Chrome.
   - **macOS:** `Cmd + Option + J` in Chrome.
3. Select the **Console** tab.
4. If the browser displays a self-XSS warning, read it carefully and follow the browser's official instructions only if you understand and trust the code you intend to run.
5. Paste the appropriate quick-run command and press Enter.

Browser shortcuts and console security prompts may vary by browser and version.

### Using the Tool

**Toggle-button version**
1. Click the floating map-pin button to open the panel.
2. Choose **Auto-fill** to use detected coordinates, or **Manual override** to enter your own.
3. Enter coordinates as `latitude, longitude`.
4. Click **Move Pin**.
5. Click the pin or use the game's normal confirmation controls if needed.

**Keyboard-shortcut version**
1. Press `Cmd + Shift + C` to open or close the panel on supported platforms.
2. Choose Auto-fill or Manual override.
3. Enter or verify the coordinates.
4. Click **Move Pin**.

**Reminder:** Moving the pin only changes its displayed location. It does not submit a guess automatically.

Use the tool only where permitted by the game's rules. Do not use it to disrupt other players' games or gain an unfair advantage.


## Responsible Use

This project is **for entertainment, experimentation, and educational purposes only**.

- Do not use it to harass, sabotage, or ruin other people's games.
- Do not use it to gain an unfair advantage in competitive games, ranked matches, tournaments, or other settings where it is prohibited.
- Respect each game's rules, terms of service, and community guidelines.
- Use it only in single-player, private, or otherwise permitted environments.
- You are responsible for how you use, modify, and distribute this code.

The author does not endorse cheating, disruption, harassment, or violations of third-party rules.

## Limitations

- Requires a compatible page using Leaflet and an identifiable player-pin marker.
- Auto-fill only recognizes certain Google Maps embed URL formats.
- Map libraries, CSS selectors, marker names, and page structures may change.
- The script does not guarantee that the selected coordinates correspond to the actual location shown by the game.
- This project is provided as-is, without a guarantee of compatibility or continued operation.

## 🛠️ Developer Tool Spotlight: DAM

### DAM — Project Continuity Platform v0.6.2

**Your project has a history. DAM helps you keep it organized, recoverable, and ready to share.**

[DAM](https://github.com/OneAM-Labs/dam) is a CLI-based Project Continuity Platform written in Rust. It introduces its own project-management vocabulary and workflow while interoperating with Git and GitHub.

Whether you're experimenting with a small script or building a larger application, DAM helps you track project snapshots, manage parallel development streams, restore previous states, package projects, and coordinate releases.

### Why DAM?

- **Reservoirs:** Keep project history, configuration, and stored objects organized in a `.dam` directory.
- **Streams:** Maintain separate development timelines for features, experiments, and releases.
- **Seals:** Create immutable, named snapshots of your project's collected files.
- **Timeline & Restore:** Explore project history and restore previous snapshots when needed.
- **Release Management:** Organize distributable versions independently of development streams.
- **GitHub Sync:** Push and pull DAM history through GitHub branches.
- **Export & Import:** Package projects or snapshots for sharing and collaboration.
- **Credential Management:** Manage supported credentials through the OS keychain or an encrypted local vault.

### Get Started

Want to try DAM? Choose whichever installation method works best for you.

#### Option 1: Download Prebuilt Binaries

**Visit the official DAM website:**

🌐 **https://dam-pcp.web.app**

Use the website to find the available prebuilt binaries and installation options. This is the recommended starting point if you don't want to build DAM from source.

#### Option 2: Build and Install from Source

If you have Rust and Cargo installed, you can build DAM directly from its GitHub repository:

```bash
git clone https://github.com/OneAM-Labs/dam.git
cd dam
cargo install --path .
```

#### Initialize Your Project

Once DAM is installed, initialize it in your project directory:

```bash
dam source -n "My Project"
dam collect .
dam seal "Initial snapshot"
```

You're ready to start managing project snapshots, development streams, releases, and project history.

**Explore DAM:**
- Website: https://dam-pcp.web.app
- GitHub: https://github.com/OneAM-Labs/dam

### A Good Fit for Developers Who...

- Want a structured alternative workflow for project snapshots and history.
- Need to experiment without losing track of previous project states.
- Want explicit project packaging and setup automation.
- Prefer a CLI-based workflow built around named snapshots and development streams.

DAM is an independent project by **OneAM-Labs**. Check its repository for the latest documentation, supported features, and installation requirements.


## License

Distributed under the **MIT License with an additional responsible-use and warranty disclaimer**. See [LICENSE](LICENSE) for details.

This license does not guarantee immunity from liability or override rights and obligations under applicable law.
