/**
 * Input sanitization utilities for the contact form.
 * Strips control characters, null bytes, and HTML entities.
 * Validates field lengths and email format.
 */

const MAX_LENGTHS = {
  name: 100,
  email: 254,
  phone: 20,
  message: 5000,
} as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function stripControlChars(str: string): string {
    return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

function stripAllControlChars(str: string): string {
    return str.replace(/[\x00-\x1F\x7F]/g, "");
}

function stripNullBytes(str: string): string {
  return str.replace(/\0/g, "");
}

/** Strips control characters, null bytes, and HTML-escapes the input. */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== "string") return "";
  return stripNullBytes(stripControlChars(escapeHtml(input.trim())));
}

/** Like sanitizeInput but also strips all control characters (for name fields). */
export function sanitizeHeaderInput(input: unknown): string {
  if (typeof input !== "string") return "";
  return stripNullBytes(stripAllControlChars(escapeHtml(input.trim())));
}

/** Sanitizes and lowercases an email input string. */
export function sanitizeEmailInput(input: unknown): string {
  if (typeof input !== "string") return "";
  return stripNullBytes(stripAllControlChars(input.trim())).toLowerCase();
}

export interface SanitizedContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  errors: string[];
}

/**
 * Validates and sanitizes a contact form submission.
 * Returns sanitized field values and an array of validation error messages.
 *
 * @param body - Raw form data object with name, email, phone, message fields
 * @returns Sanitized fields plus any validation errors
 */
export function sanitizeContactForm(body: Record<string, unknown>): SanitizedContactForm {
  const errors: string[] = [];

  const name = sanitizeHeaderInput(body.name);
  const email = sanitizeEmailInput(body.email);
  const phone = sanitizeInput(body.phone);
  const message = sanitizeInput(body.message);

  if (!name || name.length === 0) {
    errors.push("Name is required.");
  } else if (name.length > MAX_LENGTHS.name) {
    errors.push(`Name must be ${MAX_LENGTHS.name} characters or less.`);
  }

  if (!email || email.length === 0) {
    errors.push("Email is required.");
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push("Please provide a valid email address.");
  } else if (email.length > MAX_LENGTHS.email) {
    errors.push(`Email must be ${MAX_LENGTHS.email} characters or less.`);
  }

  if (phone.length > MAX_LENGTHS.phone) {
    errors.push(`Phone must be ${MAX_LENGTHS.phone} characters or less.`);
  }

  if (!message || message.length === 0) {
    errors.push("Message is required.");
  } else if (message.length > MAX_LENGTHS.message) {
    errors.push(`Message must be ${MAX_LENGTHS.message} characters or less.`);
  }

  return { name, email, phone, message, errors };
}
