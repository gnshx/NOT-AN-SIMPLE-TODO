import path from 'path';
import crypto from 'crypto';

export interface FileValidationResult {
  valid: boolean;
  reason?: string;
  sanitizedFilename?: string;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain'
]);

const DANGEROUS_EXTENSIONS = new Set([
  '.exe',
  '.sh',
  '.bat',
  '.cmd',
  '.elf',
  '.bin',
  '.js',
  '.mjs',
  '.ts',
  '.py',
  '.html',
  '.htm',
  '.php',
  '.svg'
]);

/**
 * Validates uploaded resume and document attachments:
 * 1. Restricts maximum file size (< 10MB).
 * 2. Whitelists MIME types.
 * 3. Inspects magic bytes to prevent MIME spoofing.
 * 4. Sanitizes filename, eliminating path traversal attempts (../../).
 */
export function validateUploadedFile(params: {
  filename: string;
  sizeBytes: number;
  mimeType: string;
  buffer?: Buffer;
}): FileValidationResult {
  const { filename, sizeBytes, mimeType, buffer } = params;

  // 1. File size check
  if (!sizeBytes || sizeBytes <= 0) {
    return { valid: false, reason: 'File is empty.' };
  }
  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    return { valid: false, reason: `File size (${(sizeBytes / 1024 / 1024).toFixed(1)}MB) exceeds maximum limit of 10MB.` };
  }

  // 2. Dangerous extension check
  const ext = path.extname(filename || '').toLowerCase();
  if (DANGEROUS_EXTENSIONS.has(ext)) {
    return { valid: false, reason: `Executable or script extension '${ext}' is strictly prohibited.` };
  }

  // 3. MIME type whitelist check
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return { valid: false, reason: `MIME type '${mimeType}' is not permitted. Only PDF, DOCX, and TXT files are allowed.` };
  }

  // 4. Magic bytes verification (if buffer provided)
  if (buffer && buffer.length >= 4) {
    if (mimeType === 'application/pdf') {
      const isPdfMagic = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46; // %PDF
      if (!isPdfMagic) {
        return { valid: false, reason: 'File content does not match declared PDF magic bytes.' };
      }
    } else if (mimeType.includes('openxmlformats') || mimeType.includes('msword')) {
      const isZipMagic = buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04; // PK..
      if (!isZipMagic) {
        return { valid: false, reason: 'File content does not match declared DOCX package magic bytes.' };
      }
    }
  }

  // 5. Safe filename generation (path traversal elimination)
  const baseName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
  const safeId = crypto.randomBytes(8).toString('hex');
  const sanitizedFilename = `${safeId}_${baseName}`;

  return {
    valid: true,
    sanitizedFilename
  };
}
