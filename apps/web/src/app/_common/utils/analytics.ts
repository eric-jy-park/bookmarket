declare global {
  interface Window {
    umami?: {
      track: (eventName: string, data?: Record<string, any>) => void;
    };
  }
}

export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.umami) {
    try {
      window.umami.track(eventName, data);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }
};

// Authentication Events
export const trackAuthEvent = {
  signupStart: () => trackEvent('auth_signup_start'),
  signupSuccess: (method: 'email' | 'google' | 'github') => trackEvent('auth_signup_success', { method }),
  loginStart: () => trackEvent('auth_login_start'),  
  loginSuccess: (method: 'email' | 'google' | 'github') => trackEvent('auth_login_success', { method }),
  oauthGoogle: () => trackEvent('auth_oauth_google'),
  oauthGithub: () => trackEvent('auth_oauth_github'),
};

// Bookmark Events
export const trackBookmarkEvent = {
  createStart: (url: string) => trackEvent('bookmark_create_start', { domain: new URL(url).hostname }),
  createSuccess: (url: string) => trackEvent('bookmark_create_success', { domain: new URL(url).hostname }),
  createError: (error: string) => trackEvent('bookmark_create_error', { error }),
  open: (url: string, source: 'list' | 'command' | 'context') => trackEvent('bookmark_open', { domain: new URL(url).hostname, source }),
  delete: (url: string) => trackEvent('bookmark_delete', { domain: new URL(url).hostname }),
  editTitle: (url: string) => trackEvent('bookmark_edit_title', { domain: new URL(url).hostname }),
  copyUrl: (url: string) => trackEvent('bookmark_copy_url', { domain: new URL(url).hostname }),
  refetch: (url: string) => trackEvent('bookmark_refetch', { domain: new URL(url).hostname }),
  fixFavicon: (url: string) => trackEvent('favicon_fix_attempt', { domain: new URL(url).hostname }),
};

// Category Events
export const trackCategoryEvent = {
  create: (categoryName: string) => trackEvent('category_create', { name: categoryName }),
  assign: (categoryName: string) => trackEvent('category_assign', { name: categoryName }),
  filter: (categoryName: string) => trackEvent('category_filter', { name: categoryName }),
};

// Command Menu Events  
export const trackCommandEvent = {
  open: () => trackEvent('command_menu_open'),
  search: (query: string) => trackEvent('command_menu_search', { query_length: query.length }),
  bookmarkOpen: (url: string) => trackEvent('command_menu_bookmark_open', { domain: new URL(url).hostname }),
  categorySelect: (categoryName: string) => trackEvent('command_menu_category_select', { name: categoryName }),
};

// Profile Events
export const trackProfileEvent = {
  editStart: () => trackEvent('profile_edit_start'),
  editSave: (changed_fields: string[]) => trackEvent('profile_edit_save', { changed_fields }),
  usernameCheck: (available: boolean) => trackEvent('username_check', { available }),
};

// Sharing Events
export const trackSharingEvent = {
  profileView: (username: string) => trackEvent('shared_profile_view', { username }),
  bookmarkClick: (url: string, username: string) => trackEvent('shared_bookmark_click', { domain: new URL(url).hostname, username }),
};

// Error Events
export const trackErrorEvent = {
  pageError: (error: string, page: string) => trackEvent('page_error', { error, page }),
  metadataFetchError: (url: string, error: string) => trackEvent('metadata_fetch_error', { domain: new URL(url).hostname, error }),
};