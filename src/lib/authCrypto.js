import bcrypt from "bcryptjs";
import crypto from "crypto";

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt with 10 salt rounds (~65ms)
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string.");
  }
  return bcrypt.hash(password.trim(), SALT_ROUNDS);
}

/**
 * Compare a candidate password against a stored bcrypt hash
 * @param {string} candidatePassword
 * @param {string} storedHash
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(candidatePassword, storedHash) {
  if (!candidatePassword || !storedHash) return false;
  return bcrypt.compare(candidatePassword.trim(), storedHash.trim());
}

/**
 * Check if a string is already a valid bcrypt hash
 * @param {string} str
 * @returns {boolean}
 */
export function isBcryptHash(str) {
  if (!str || typeof str !== "string") return false;
  return /^\$2[aby]\$\d{2}\$[./0-9A-Za-z]{53}$/.test(str.trim());
}

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 * @param {number} length
 * @returns {string}
 */
export function generateNumericOTP(length = 6) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1).toString();
}

/**
 * Hash an OTP for secure database storage
 * @param {string} otp
 * @returns {Promise<string>}
 */
export async function hashOTP(otp) {
  return bcrypt.hash(otp.trim(), 8); // 8 rounds is optimal for fast short-lived OTPs (~15ms)
}

/**
 * Verify a candidate OTP against the stored hash
 * @param {string} candidateOtp
 * @param {string} storedHash
 * @returns {Promise<boolean>}
 */
export async function verifyOTP(candidateOtp, storedHash) {
  if (!candidateOtp || !storedHash) return false;
  return bcrypt.compare(candidateOtp.trim(), storedHash.trim());
}
