// On-screen controls for touch devices. Buttons translate into synthetic
// KeyboardEvents so the driving loop doesn't need a separate input path.
//
// Detection: shown automatically on touch / coarse-pointer / narrow
// viewports. Desktop users can also force them via the toggle pill in
// the bottom-left of the canvas.

import { useEffect, useState } from "react";

function detectMobile(): boolean {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || window.matchMedia?.("(pointer: coarse)").matches || window.innerWidth < 820;
}

export function TouchControls() {
  const [auto, setAuto] = useState(false);
  const [forced, setForced] = useState(false);

  useEffect(() => {
    const update = () => setAuto(detectMobile());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const show = auto || forced;

  return (
    <>
      <button
        type="button"
        onClick={() => setForced((v) => !v)}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/55 text-white text-xs px-2 py-1 rounded font-mono"
        style={{ transform: "translate(-50%, 0)", bottom: show ? 132 : 12 }}
      >
        📱 {show ? "skjul touch-knapper" : "vis touch-knapper"}
      </button>

      {show && (
        <>
          {/* Tap row sits above the steering pair so they never overlap on narrow phones */}
          <div className="absolute bottom-3 left-3 flex flex-col gap-2 select-none">
            <div className="flex gap-1.5">
              <TapButton k="q" label="Q" />
              <TapButton k="w" label="W" />
              <TapButton k="m" label="M" />
              <TapButton k="l" label="L" />
            </div>
            <div className="flex gap-2">
              <HoldButton k="ArrowLeft" label="◀" />
              <HoldButton k="ArrowRight" label="▶" />
            </div>
          </div>
          <div className="absolute bottom-14 right-3 flex flex-col gap-2 select-none">
            <HoldButton k="ArrowUp" label="▲" />
            <HoldButton k="ArrowDown" label="▼" />
          </div>
        </>
      )}
    </>
  );
}

function HoldButton({ k, label }: { k: string; label: string }) {
  return (
    <button
      type="button"
      className="touch-btn"
      onPointerDown={(e) => {
        e.preventDefault();
        pressKey(k);
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        releaseKey(k);
      }}
      onPointerLeave={() => releaseKey(k)}
      onPointerCancel={() => releaseKey(k)}
    >
      {label}
    </button>
  );
}

function TapButton({ k, label }: { k: string; label: string }) {
  return (
    <button
      type="button"
      className="touch-btn touch-btn-tap"
      onPointerDown={(e) => {
        e.preventDefault();
        pressKey(k);
        releaseKey(k);
      }}
    >
      {label}
    </button>
  );
}

function pressKey(key: string) {
  window.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}
function releaseKey(key: string) {
  window.dispatchEvent(new KeyboardEvent("keyup", { key, bubbles: true }));
}
