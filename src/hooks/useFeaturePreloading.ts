import { useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext';

/**
 * Preload heavy features based on user navigation patterns
 * This improves perceived performance by loading modules before they're needed
 */
export function useFeaturePreloading() {
  const { activeSection } = useNavigation();

  useEffect(() => {
    // Preload related features based on current section
    const preloadMap: Record<string, string[]> = {
      'overview': ['agents', 'ecosystem'], // From dashboard, users often go to agents
      'agents': ['integrations'], // Agents often need integrations
      'ecosystem': ['integrations'], // Ecosystem and integrations are related
      'deployment': ['operations'], // Deployment and operations are related
    };

    const sectionsToPreload = preloadMap[activeSection] || [];

    // Preload modules after a short delay (to not block current render)
    const timeoutId = setTimeout(() => {
      sectionsToPreload.forEach((section) => {
        switch (section) {
          case 'agents':
            import('../features/agents/AgentBuilder');
            break;
          case 'ecosystem':
            import('../features/ecosystem/EcosystemExplorer');
            break;
          case 'integrations':
            import('../features/integrations/IntegrationMarketplace');
            break;
        }
      });
    }, 1000); // Wait 1 second after section loads

    return () => clearTimeout(timeoutId);
  }, [activeSection]);
}

/**
 * Preload critical features on initial app load (after interaction)
 */
export function useInitialPreload() {
  useEffect(() => {
    // Wait for user interaction before preloading
    const handleInteraction = () => {
      // Preload most commonly used features
      requestIdleCallback(() => {
        import('../features/agents/AgentBuilder');
        import('../features/ecosystem/EcosystemExplorer');
      }, { timeout: 2000 });
    };

    // Listen for first user interaction
    const events = ['mousedown', 'touchstart', 'keydown', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, []);
}

/**
 * Utility to check if browser supports module preload
 */
export function supportsModulePreload(): boolean {
  const link = document.createElement('link');
  return link.relList && link.relList.supports && link.relList.supports('modulepreload');
}

/**
 * Fallback requestIdleCallback for browsers that don't support it
 */
function requestIdleCallback(callback: () => void, options?: { timeout?: number }) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  } else {
    // Fallback for Safari and older browsers
    const timeout = options?.timeout || 1000;
    return setTimeout(callback, timeout) as any;
  }
}
