/**
 * Bridge between the Objective-C tweak and the web view.
 *
 * The tweak injects a JSON object into the HTML before loading it:
 *   <script>window.__CASTWEAK__ = { ... }</script>
 *
 * This module provides type-safe access to those injected values
 * and a way to send messages back to the native side via
 * webkit.messageHandlers.
 */

export interface TweakData {
  timerOffsetSeconds: number;
  timerTargetSeconds: number;
  examModeLostFocus: boolean;
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

/** Read injected tweak data (falls back to defaults in dev mode) */
export function getTweakData(): TweakData {
  return (
    window.__CASTWEAK__ ?? {
      timerOffsetSeconds: 0,
      timerTargetSeconds: -1,
      examModeLostFocus: false,
    }
  );
}

/** Send a message back to the native tweak */
export function postToTweak(action: string, payload?: Record<string, unknown>) {
  window.webkit?.messageHandlers.castweak.postMessage({ action, ...payload });
}
