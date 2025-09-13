// Put any app bootstrapping here: prefetch, warm APIs, load fonts, etc.
export async function initApp() {
  const tasks: Promise<unknown>[] = [];

  // Example: ensure fonts are ready (supported on modern browsers)
  if ("fonts" in document) {
    tasks.push((document as any).fonts.ready.catch(() => undefined));
  }

  // Example: artificial minimum so the loader isn’t a “flash”
  const minimum = new Promise((res) => setTimeout(res, 2000));

  await Promise.allSettled([minimum, ...tasks]);
}
