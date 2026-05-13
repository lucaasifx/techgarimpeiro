import type { StoreAdapter } from '@techgarimpeiro/core';

const registry = new Map<string, StoreAdapter>();

export function registerAdapter(adapter: StoreAdapter): void {
  registry.set(adapter.storeSlug, adapter);
}

export function getAdapter(storeSlug: string): StoreAdapter {
  const adapter = registry.get(storeSlug);
  if (!adapter) throw new Error(`No adapter registered for store: ${storeSlug}`);
  return adapter;
}

export function listAdapters(): string[] {
  return [...registry.keys()];
}
