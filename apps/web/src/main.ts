import "./style.css";
import { getTweakData } from "./bridge";

const data = getTweakData();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 gap-8">
    <h1 class="text-3xl font-bold tracking-tight">CASTweak</h1>
    <p class="text-zinc-400 text-sm">Timer offset: ${data.timerOffsetSeconds}s</p>
  </div>
`;
