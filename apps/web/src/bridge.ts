import { useMemo } from "react";

/**
 * Bridge between the Objective-C tweak and the React web view.
 *
 * The tweak injects a JSON object into the HTML before loading:
 *   <script>window.__CASTWEAK__ = { ... }</script>
 *
 * This module provides type-safe access + a React hook,
 * and a way to send messages back to native via webkit.messageHandlers.
 */

export interface TweakData {
  timerOffsetSeconds: number;
  timerTargetSeconds: number;
  passcode: string;
  elapsedSeconds: number;
  [key: string]: unknown;
}

declare global {
  interface Window {
    __CASTWEAK__?: TweakData;
    webkit?: {
      messageHandlers: {
        castweak: {
          postMessage(msg: unknown): void;
        };
      };
    };
  }
}

const defaults: TweakData = {
  timerOffsetSeconds: 0,
  timerTargetSeconds: -1,
  passcode: "9653",
  elapsedSeconds: 0,
};

/** Read injected tweak data (falls back to defaults in dev mode) */
export function getTweakData(): TweakData {
  return window.__CASTWEAK__ ?? defaults;
}

/** React hook for tweak data */
export function useTweakData(): TweakData {
  return useMemo(() => getTweakData(), []);
}

/** Send a message back to the native tweak */
export function postToTweak(
  action: string,
  payload?: Record<string, unknown>
) {
  window.webkit?.messageHandlers.castweak.postMessage({ action, ...payload });
}
