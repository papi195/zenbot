const OFFLINE_MESSAGE =
  'You appear to be offline. Please check your internet connection and try again.';

const NETWORK_MESSAGE =
  'Unable to reach the server. Please check your internet connection and try again.';

function extractMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null && 'message' in err) {
    return String((err as { message: unknown }).message);
  }
  return '';
}

function isNetworkFailure(message: string, err: unknown): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('network request failed') ||
    lower.includes('load failed') ||
    lower.includes('fetch failed') ||
    lower.includes('err_internet_disconnected') ||
    lower.includes('err_network_changed') ||
    (err instanceof TypeError && lower.includes('fetch'))
  );
}

export function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

export function getFriendlyErrorMessage(
  err: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  if (isOffline()) return OFFLINE_MESSAGE;

  const message = extractMessage(err);
  if (message && isNetworkFailure(message, err)) return NETWORK_MESSAGE;

  return message || fallback;
}
