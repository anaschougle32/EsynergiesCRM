// Mobile utility functions for app-like experience

// Haptic feedback for mobile devices
export const hapticFeedback = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    // iOS haptic feedback
    if ('hapticFeedback' in window) {
      (window as any).hapticFeedback.impactOccurred('light');
    }
  },
  
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
    if ('hapticFeedback' in window) {
      (window as any).hapticFeedback.impactOccurred('medium');
    }
  },
  
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    if ('hapticFeedback' in window) {
      (window as any).hapticFeedback.impactOccurred('heavy');
    }
  },
  
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
    if ('hapticFeedback' in window) {
      (window as any).hapticFeedback.notificationOccurred('success');
    }
  },
  
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]);
    }
    if ('hapticFeedback' in window) {
      (window as any).hapticFeedback.notificationOccurred('error');
    }
  }
};

// Check if device is mobile
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check if device is iOS
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Check if device is Android
export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

// Check if device supports touch
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Get safe area insets
export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0'),
  };
};

// Prevent zoom on double tap (iOS)
export const preventZoom = () => {
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
};

// Add bounce effect to scrollable elements
export const addBounceEffect = (element: HTMLElement) => {
  if (isIOS()) {
    (element.style as any).webkitOverflowScrolling = 'touch';
    element.style.overscrollBehavior = 'none';
  }
};

// Pull to refresh functionality
export class PullToRefresh {
  private element: HTMLElement;
  private onRefresh: () => Promise<void>;
  private threshold: number;
  private startY: number = 0;
  private currentY: number = 0;
  private isRefreshing: boolean = false;
  private isPulling: boolean = false;

  constructor(element: HTMLElement, onRefresh: () => Promise<void>, threshold: number = 80) {
    this.element = element;
    this.onRefresh = onRefresh;
    this.threshold = threshold;
    this.init();
  }

  private init() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  private handleTouchStart(e: TouchEvent) {
    if (this.element.scrollTop === 0) {
      this.startY = e.touches[0].clientY;
      this.isPulling = true;
    }
  }

  private handleTouchMove(e: TouchEvent) {
    if (!this.isPulling || this.isRefreshing) return;

    this.currentY = e.touches[0].clientY;
    const pullDistance = this.currentY - this.startY;

    if (pullDistance > 0 && this.element.scrollTop === 0) {
      e.preventDefault();
      const progress = Math.min(pullDistance / this.threshold, 1);
      this.element.style.transform = `translateY(${pullDistance * 0.5}px)`;
      this.element.style.opacity = `${1 - progress * 0.2}`;
    }
  }

  private async handleTouchEnd() {
    if (!this.isPulling || this.isRefreshing) return;

    const pullDistance = this.currentY - this.startY;
    
    if (pullDistance > this.threshold) {
      this.isRefreshing = true;
      hapticFeedback.medium();
      
      try {
        await this.onRefresh();
        hapticFeedback.success();
      } catch (error) {
        hapticFeedback.error();
      } finally {
        this.isRefreshing = false;
      }
    }

    // Reset
    this.element.style.transform = '';
    this.element.style.opacity = '';
    this.isPulling = false;
    this.startY = 0;
    this.currentY = 0;
  }

  destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
  }
}

// Swipe gesture detection
export class SwipeGesture {
  private element: HTMLElement;
  private onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
  private threshold: number;
  private startX: number = 0;
  private startY: number = 0;

  constructor(
    element: HTMLElement, 
    onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void,
    threshold: number = 50
  ) {
    this.element = element;
    this.onSwipe = onSwipe;
    this.threshold = threshold;
    this.init();
  }

  private init() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  private handleTouchStart(e: TouchEvent) {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  }

  private handleTouchEnd(e: TouchEvent) {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    const deltaX = endX - this.startX;
    const deltaY = endY - this.startY;
    
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (Math.max(absDeltaX, absDeltaY) < this.threshold) return;

    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > 0) {
        this.onSwipe('right');
      } else {
        this.onSwipe('left');
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        this.onSwipe('down');
      } else {
        this.onSwipe('up');
      }
    }

    hapticFeedback.light();
  }

  destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
  }
}

// Add mobile-specific event listeners
export const addMobileEventListeners = () => {
  // Prevent zoom on double tap
  preventZoom();

  // Add viewport meta tag if not present
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    document.head.appendChild(viewport);
  }

  // Add mobile-specific CSS classes
  document.documentElement.classList.add(
    isMobile() ? 'is-mobile' : 'is-desktop',
    isIOS() ? 'is-ios' : isAndroid() ? 'is-android' : 'is-other',
    isTouchDevice() ? 'is-touch' : 'is-no-touch'
  );

  // Handle orientation changes
  window.addEventListener('orientationchange', () => {
    // Force a reflow to handle iOS Safari viewport issues
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  });

  // Handle focus events for better mobile UX
  document.addEventListener('focusin', (e) => {
    const target = e.target as HTMLElement;
    if (target && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
      // Scroll input into view on mobile
      if (isMobile()) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  });
};

// Initialize mobile utilities
export const initMobile = () => {
  if (typeof window !== 'undefined') {
    addMobileEventListeners();
  }
};

// Mobile-specific animations
export const mobileAnimations = {
  slideIn: (element: HTMLElement, direction: 'left' | 'right' | 'up' | 'down' = 'up') => {
    element.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      up: 'translateY(-100%)',
      down: 'translateY(100%)'
    };
    
    element.style.transform = transforms[direction];
    
    requestAnimationFrame(() => {
      element.style.transform = 'translate(0, 0)';
    });
  },

  fadeIn: (element: HTMLElement, duration: number = 300) => {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  },

  scaleIn: (element: HTMLElement, duration: number = 200) => {
    element.style.transform = 'scale(0.95)';
    element.style.opacity = '0';
    element.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    });
  }
};

export default {
  hapticFeedback,
  isMobile,
  isIOS,
  isAndroid,
  isTouchDevice,
  getSafeAreaInsets,
  PullToRefresh,
  SwipeGesture,
  initMobile,
  mobileAnimations
}; 