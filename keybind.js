/*
 * GUESSR PIN COORDINATES — RESPONSIBLE USE NOTICE
 *
 * This project is provided for fun, personal experimentation, and
 * educational purposes only.
 *
 * DO NOT use this script to ruin other people's games, harass players,
 * disrupt matches, or gain an unfair advantage where its use is prohibited.
 * Always respect the game's rules and terms of service.
 *
 * IMPORTANT: Moving the player pin only changes its displayed position.
 * It does NOT automatically submit, confirm, or lock in a guess.
 * You must still click the pin or use the game's normal confirmation
 * controls when required.
 *
 * This software is provided "AS IS", without warranties of any kind,
 * to the fullest extent permitted by applicable law. The author is not
 * responsible for misuse, modifications, or consequences arising from
 * the use or distribution of this code, to the extent permitted by law.
 *
 * Use at your own risk.
 *
 * See LICENSE for the full license and disclaimer.
 */
function printUsageInstructions(version) {
    console.info(
        `%cOpenguessr Helper — ${version}`,
        "font-weight:bold;font-size:14px;color:#8bbcff"
    );

    console.info("How to use:");

    if (version === "Toggle-button version") {
        console.info("1. Click the floating map-pin button to open the panel.");
    } else {
        console.info("1. Press Cmd + Shift + C to open or close the panel.");
    }

    console.info("2. Select Auto-fill to detect coordinates automatically.");
    console.info("3. Select Manual override to enter coordinates yourself.");
    console.info("4. Enter latitude, longitude (example: 48.8584, 2.2945).");
    console.info("5. Click Move Pin to reposition the existing player pin.");
    console.info("6. Click the pin or use the game's normal confirmation controls if required.");

    console.info(
        "Reminder: Moving the pin does NOT submit a guess automatically."
    );

    console.info(
        "Responsible use: For fun and learning. Respect game rules and other players."
    );
}

(() => {
    // Prevent duplicate instances.
    if (window.__guessrPinCleanup) {
        window.__guessrPinCleanup();
    }
    printUsageInstructions("Keyboard-shortcut version");

    let autoFillInterval = null;
    let captureStarted = false;
    let coordinateMode = "auto";
    let lastDetectedCoordinates = null;
    let destroyed = false;

    // Remove any previous UI.
    document.getElementById("guessr-pin-overlay")?.remove();
    document.getElementById("gp-glass-style")?.remove();

    // Create styles.
    const style = document.createElement("style");
    style.id = "gp-glass-style";

    style.textContent = `
    #guessr-pin-overlay {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 2147483647;
    font: 13px system-ui, sans-serif;
    color: white;
    }

    #gp-panel {
    width: 280px;
    box-sizing: border-box;
    padding: 16px;
    border: 1px solid #ffffff2c;
    border-radius: 17px;
    background: rgba(20, 24, 33, .88);
    backdrop-filter: blur(24px) saturate(150%);
    -webkit-backdrop-filter: blur(24px) saturate(150%);
    box-shadow: 0 16px 45px #0005;
    }

    #gp-panel[hidden] {
    display: none !important;
    }

    #gp-panel input {
    box-sizing: border-box;
    width: 100%;
    padding: 11px 12px;
    color: white;
    background: #ffffff0d;
    border: 1px solid #ffffff24;
    border-radius: 10px;
    outline: none;
    font: inherit;
    }

    #gp-panel input:focus {
    border-color: #8bbcffaa;
    background: #ffffff14;
    }

    #gp-panel input::placeholder {
    color: #a9afbc;
    }

    #gp-modes {
    display: flex;
    gap: 6px;
    margin-top: 14px;
    }

    #gp-modes button {
    flex: 1;
    padding: 9px 6px;
    border: 1px solid #ffffff24;
    border-radius: 9px;
    background: #ffffff0d;
    color: #c6cfdd;
    font: 500 11px system-ui, sans-serif;
    cursor: pointer;
    }

    #gp-modes button.active {
    background: #eaf2ff;
    border-color: #eaf2ff;
    color: #172235;
    }

    #gp-move {
    width: 100%;
    margin-top: 10px;
    padding: 11px;
    border: 0;
    border-radius: 10px;
    background: #eaf2ff;
    color: #172235;
    font: 600 13px system-ui, sans-serif;
    cursor: pointer;
    }

    #gp-move:disabled {
    opacity: .5;
    cursor: wait;
    }

    #gp-status {
    margin-top: 11px;
    color: #c6cfdd;
    font-size: 12px;
    line-height: 1.5;
    overflow-wrap: anywhere;
    }

    #gp-hint {
    margin-top: 7px;
    color: #9ba7b8;
    font-size: 11px;
    line-height: 1.5;
    }
    `;

    (document.head || document.documentElement).appendChild(style);

    // Create the overlay immediately.
    const root = document.createElement("div");
    root.id = "guessr-pin-overlay";

    root.innerHTML = `
    <div id="gp-panel" hidden>
    <div style="font-weight:650;font-size:14px">
    Map Pin Coordinates
    </div>

    <div style="margin-top:5px;color:#a9b5c7;font-size:12px">
    Move your existing player pin
    </div>

    <div id="gp-modes">
    <button id="gp-auto" class="active" type="button">
    Auto-fill
    </button>
    <button id="gp-manual" type="button">
    Manual override
    </button>
    </div>

    <div style="margin-top:12px">
    <input
    id="gp-coords"
    placeholder="Latitude, Longitude"
    autocomplete="off"
    spellcheck="false"
    >

    <div id="gp-hint">
    Automatically detected coordinates
    </div>

    <button id="gp-move" type="button">
    Move Pin
    </button>

    <div id="gp-status">
    Waiting for map…
    </div>
    </div>
    </div>
    `;

    (document.body || document.documentElement).appendChild(root);

    const panel = root.querySelector("#gp-panel");
    const input = root.querySelector("#gp-coords");
    const moveButton = root.querySelector("#gp-move");
    const status = root.querySelector("#gp-status");
    const hint = root.querySelector("#gp-hint");
    const autoButton = root.querySelector("#gp-auto");
    const manualButton = root.querySelector("#gp-manual");

    // IMPORTANT: Install keyboard listeners synchronously.
    // No map, Leaflet, iframe, or promise is needed to toggle the UI.
    function onKeyDown(event) {
        if (
            event.metaKey &&
            event.shiftKey &&
            event.code === "KeyC" &&
            !event.repeat
        ) {
            event.preventDefault();
            event.stopImmediatePropagation();

            panel.hidden = !panel.hidden;

            if (!panel.hidden) {
                input.focus({ preventScroll: true });
                input.select();
            }

            return;
        }

        if (event.key === "Escape" && !panel.hidden) {
            panel.hidden = true;
        }
    }

    document.addEventListener("keydown", onKeyDown, true);

    // Some sites focus a child frame or another browsing context.
    window.addEventListener("keydown", onKeyDown, true);

    // Keep the handler available for cleanup.
    window.__guessrPinKeyHandler = onKeyDown;

    const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

    async function waitFor(getValue, timeout = 30000) {
        const start = Date.now();

        while (!destroyed && Date.now() - start < timeout) {
            try {
                const value = getValue();
                if (value) return value;
            } catch {}

            await sleep(150);
        }

        throw new Error(
            destroyed
            ? "Script stopped."
            : "Timed out waiting for the map or player pin."
        );
    }

    // Coordinate extraction.
    function extractLatLngFromGoogleMapsIframe(iframe) {
        try {
            const url = new URL(iframe.src);
            const location = url.searchParams.get("location");

            if (!location) return null;

            const parts = location.split(",").map(Number);

            if (
                parts.length !== 2 ||
                !parts.every(Number.isFinite) ||
                Math.abs(parts[0]) > 90 ||
                Math.abs(parts[1]) > 180
            ) {
                return null;
            }

            return parts;
        } catch {
            return null;
        }
    }

    function findMapCoordinates() {
        for (const iframe of document.querySelectorAll("iframe")) {
            if (!iframe.src.includes("google.com/maps/embed")) {
                continue;
            }

            const coordinates =
            extractLatLngFromGoogleMapsIframe(iframe);

            if (coordinates) return coordinates;
        }

        return null;
    }

    function refreshAutoCoordinates() {
        if (destroyed || coordinateMode !== "auto") return;

        const coordinates = findMapCoordinates();

        if (!coordinates) {
            if (!lastDetectedCoordinates) {
                status.textContent =
                "Waiting for coordinates in the map embed…";
            }
            return;
        }

        const formatted = coordinates
        .map(value => Number(value.toFixed(6)))
        .join(", ");

        if (formatted !== lastDetectedCoordinates) {
            lastDetectedCoordinates = formatted;
            input.value = formatted;
            status.textContent = `Auto-filled coordinates: ${formatted}`;
        }
    }

    function setMode(mode) {
        coordinateMode = mode;

        autoButton.classList.toggle("active", mode === "auto");
        manualButton.classList.toggle("active", mode === "manual");

        if (mode === "auto") {
            hint.textContent = "Automatically detected coordinates";
            refreshAutoCoordinates();
        } else {
            hint.textContent = "Manual mode — enter latitude, longitude";
            status.textContent = "Manual override enabled.";
            input.focus();
            input.select();
        }
    }

    autoButton.addEventListener("click", () => setMode("auto"));
    manualButton.addEventListener("click", () => setMode("manual"));

    function captureMap(map) {
        if (map?.getContainer?.()?.id === "map") {
            window.__openGuessrMap = map;
            return true;
        }

        return false;
    }

    async function initializeCapture() {
        const Lref = await waitFor(() =>
        typeof L !== "undefined" && L.Map ? L : null
        );

        const proto = Lref.Map.prototype;

        if (!proto.addLayer.__guessrCapture) {
            const original = proto.addLayer;

            function hooked(layer) {
                captureMap(this);
                return original.apply(this, arguments);
            }

            hooked.__guessrCapture = true;
            proto.addLayer = hooked;
        }

        // Check if the map was already initialized.
        const existingMap = window.__openGuessrMap;

        if (existingMap?.getContainer?.()?.id === "map") {
            return existingMap;
        }

        // Observe map initialization without blocking the UI.
        return waitFor(() => {
            if (window.__openGuessrMap) {
                return window.__openGuessrMap;
            }

            const container = document.querySelector("#map");

            if (container?._leaflet_id) {
                // Compatible with Leaflet versions exposing the registry.
                const map =
                Lref.Map._instances?.[container._leaflet_id];

                if (map && captureMap(map)) {
                    return map;
                }
            }

            return null;
        });
    }

    // Begin background tasks only after shortcut registration.
    refreshAutoCoordinates();

    autoFillInterval = setInterval(refreshAutoCoordinates, 1000);
    window.__guessrAutoFillInterval = autoFillInterval;

    initializeCapture()
    .then(() => {
        if (destroyed) return;

        status.textContent =
        coordinateMode === "auto" && !lastDetectedCoordinates
        ? "Map captured. Waiting for coordinates…"
        : "Map captured. Ready to move pin.";
    })
    .catch(error => {
        if (!destroyed) status.textContent = error.message;
    });

        // Move the existing player pin.
        moveButton.addEventListener("click", async () => {
            moveButton.disabled = true;

            try {
                const parts = input.value.trim().split(/\s*,\s*/);

                if (
                    parts.length !== 2 ||
                    parts.some(part => part === "")
                ) {
                    throw new Error("Enter coordinates as latitude, longitude.");
                }

                const lat = Number(parts[0]);
                const lng = Number(parts[1]);

                if (
                    !Number.isFinite(lat) ||
                    Math.abs(lat) > 90 ||
                    !Number.isFinite(lng) ||
                    Math.abs(lng) > 180
                ) {
                    throw new Error("Latitude must be ±90 and longitude ±180.");
                }

                const map = await waitFor(() => window.__openGuessrMap);

                const Lref = await waitFor(() =>
                typeof L !== "undefined" && L.Marker ? L : null
                );

                const pin = await waitFor(() =>
                Object.values(map._layers || {}).find(layer =>
                layer instanceof Lref.Marker &&
                layer.options?.icon?.options?.iconUrl?.includes("player_pin")
                )
                );

                pin.setLatLng([lat, lng]);

                status.textContent = `Pin moved to ${lat}, ${lng}`;
            } catch (error) {
                status.textContent = error.message;
            } finally {
                moveButton.disabled = false;
            }
        });

        input.addEventListener("keydown", event => {
            if (event.key === "Enter" && !moveButton.disabled) {
                moveButton.click();
            }
        });

        // Allow this instance to be cleaned up before re-running.
        window.__guessrPinCleanup = () => {
            destroyed = true;

            if (autoFillInterval) {
                clearInterval(autoFillInterval);
            }

            document.removeEventListener("keydown", onKeyDown, true);
            window.removeEventListener("keydown", onKeyDown, true);

            root.remove();
            style.remove();

            window.__guessrPinKeyHandler = null;
            window.__guessrAutoFillInterval = null;
            window.__openGuessrMap = null;
        };
})();
