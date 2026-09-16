import { validateUploadedFile } from '../../../web/src/lib/security/fileUpload';

export function runUploadSecurityTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // Test 1: Oversized file (>10MB) rejection
  const bigFileCheck = validateUploadedFile({
    filename: 'resume.pdf',
    sizeBytes: 15 * 1024 * 1024, // 15MB
    mimeType: 'application/pdf'
  });
  results.push({
    name: 'File Upload: Reject files exceeding 10MB limit',
    passed: !bigFileCheck.valid && bigFileCheck.reason?.includes('exceeds maximum limit'),
    details: 'Files over 10MB must be rejected to prevent storage and memory exhaustion.'
  });

  // Test 2: Dangerous executable file extension rejection (.exe, .sh, .html)
  const dangerousFiles = ['malware.exe', 'script.sh', 'payload.html', 'exploit.php', 'vector.svg'];
  let allDangerousBlocked = true;
  for (const filename of dangerousFiles) {
    const res = validateUploadedFile({
      filename,
      sizeBytes: 1024,
      mimeType: 'application/octet-stream'
    });
    if (res.valid) allDangerousBlocked = false;
  }
  results.push({
    name: 'File Upload: Executable and script extensions blocked (.exe, .sh, .html, .php, .svg)',
    passed: allDangerousBlocked,
    details: 'Executable or script files must be blocked from upload.'
  });

  // Test 3: Disallowed MIME type rejection
  const badMimeCheck = validateUploadedFile({
    filename: 'archive.zip',
    sizeBytes: 1024,
    mimeType: 'application/zip'
  });
  results.push({
    name: 'File Upload: Disallowed MIME type rejection',
    passed: !badMimeCheck.valid,
    details: 'Only PDF, DOCX, and TXT MIME types are permitted.'
  });

  // Test 4: Magic bytes mismatch detection (spoofed PDF)
  const fakePdfBuffer = Buffer.from('NOT_A_REAL_PDF_HEADER_JUST_TEXT');
  const spoofCheck = validateUploadedFile({
    filename: 'fake.pdf',
    sizeBytes: 100,
    mimeType: 'application/pdf',
    buffer: fakePdfBuffer
  });
  results.push({
    name: 'File Upload: Magic bytes verification (spoofed PDF detection)',
    passed: !spoofCheck.valid && spoofCheck.reason?.includes('magic bytes'),
    details: 'Files declaring application/pdf but missing %PDF magic bytes must be rejected.'
  });

  // Test 5: Valid PDF file with correct magic bytes allowed
  const validPdfBuffer = Buffer.from('%PDF-1.7 ... valid content ...');
  const validCheck = validateUploadedFile({
    filename: 'candidate_resume.pdf',
    sizeBytes: 50000,
    mimeType: 'application/pdf',
    buffer: validPdfBuffer
  });
  results.push({
    name: 'File Upload: Legitimate PDF with matching magic bytes accepted',
    passed: validCheck.valid && typeof validCheck.sanitizedFilename === 'string',
    details: 'Valid resumes must be accepted and assigned a sanitized random filename.'
  });

  // Test 6: Path traversal in filename sanitized
  const traversalCheck = validateUploadedFile({
    filename: '../../../../etc/cron.d/malicious.pdf',
    sizeBytes: 5000,
    mimeType: 'application/pdf',
    buffer: validPdfBuffer
  });
  const safeName = traversalCheck.sanitizedFilename || '';
  results.push({
    name: 'File Upload: Filename path traversal sanitization',
    passed: !safeName.includes('..') && !safeName.includes('/'),
    details: 'Path traversal sequences (../../) must be stripped from filenames.'
  });

  return results;
}
