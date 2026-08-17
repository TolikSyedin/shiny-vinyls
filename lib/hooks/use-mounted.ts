import { useSyncExternalStore } from 'react'

// mounted-detection only: the value never changes after hydration, so
// there is nothing to subscribe to
function subscribeToNothing() {
  return () => {}
}

// The server has no idea which client-only state (theme, viewport, etc.)
// will resolve, so components that branch on it must render the SSR-safe
// default until mount confirms the real value — otherwise hydration mismatches.
export function useMounted() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  )
}
