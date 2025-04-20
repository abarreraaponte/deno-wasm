// Extend the Window interface to include the translations property
declare global {
	interface Window {
		translations?: Record<string, string>;
	}
}

/**
 * Magic function to apply a translation that originally comes from the backend.
 * @param key 
 * @returns 
 */
export function t__(key :string) :string {
	return window.translations?.[key] || key;
}