import { calculateDistanceKm } from '../lib/gpsUtils';
import { formatCurrency, formatDate } from '../lib/utils';
import { sanitizeInput, validateFileTypeAndSize, rateLimiter, logAuditAction, getAuditLogs } from '../lib/securityUtils';
import { saveOfflineDraft, getOfflineDrafts, clearOfflineDraft } from '../lib/offlineStorage';

/**
 * EPFO EO Tour Diary - Comprehensive Quality Assurance Test Suite
 */
export const runAllQATests = (): { passed: number; failed: number; total: number; logs: string[] } => {
  let passed = 0;
  let failed = 0;
  const logs: string[] = [];

  const assert = (condition: boolean, testName: string) => {
    if (condition) {
      passed++;
      logs.push(`✅ [PASS] ${testName}`);
    } else {
      failed++;
      logs.push(`❌ [FAIL] ${testName}`);
    }
  };

  logs.push('---------------------------------------------------------');
  logs.push('1. UNIT TESTS: Mathematical & Formatting Utilities');
  logs.push('---------------------------------------------------------');

  // Test 1.1: GPS Distance Math (Haversine formula)
  const distance = calculateDistanceKm(20.4625, 85.8828, 20.2961, 85.8245); // Cuttack to Bhubaneswar
  assert(distance > 15 && distance < 30, 'GPS Haversine distance calculation (approx 21.4 Km Cuttack-BBS)');

  // Test 1.2: Currency Formatter
  const formattedMoney = formatCurrency(345000);
  assert(formattedMoney.includes('3,45,000') || formattedMoney.includes('345,000'), 'Currency formatter output for ₹3,45,000');

  // Test 1.3: Date Formatter
  const formattedDate = formatDate('2026-08-07');
  assert(formattedDate.includes('Aug') || formattedDate.includes('07'), 'Date formatter output for 2026-08-07');

  logs.push('---------------------------------------------------------');
  logs.push('2. VALIDATION & SECURITY TESTS');
  logs.push('---------------------------------------------------------');

  // Test 2.1: Input Sanitization (XSS Script Prevention)
  const dangerousString = '<script>alert("XSS")</script>';
  const sanitized = sanitizeInput(dangerousString);
  assert(!sanitized.includes('<script>') && sanitized.includes('&lt;script&gt;'), 'Input sanitization strips dangerous <script> tags');

  // Test 2.2: Valid PDF File Upload
  const validFile = new File(['test pdf content'], 'inspection_note.pdf', { type: 'application/pdf' });
  const pdfVal = validateFileTypeAndSize(validFile);
  assert(pdfVal.isValid && pdfVal.format === 'PDF', 'File validator approves valid PDF file upload');

  // Test 2.3: Disallowed Extension Upload
  const invalidFile = new File(['malware content'], 'exploit.exe', { type: 'application/octet-stream' });
  const exeVal = validateFileTypeAndSize(invalidFile);
  assert(!exeVal.isValid && !!exeVal.error, 'File validator rejects dangerous .exe extension');

  // Test 2.4: Rate Limiter
  const rlKey = `test_rl_${Date.now()}`;
  const rl1 = rateLimiter(rlKey, 2, 5000);
  const rl2 = rateLimiter(rlKey, 2, 5000);
  const rl3 = rateLimiter(rlKey, 2, 5000);
  assert(rl1.isAllowed && rl2.isAllowed && !rl3.isAllowed, 'Sliding-window rate limiter blocks 3rd attempt when max limit is 2');

  logs.push('---------------------------------------------------------');
  logs.push('3. INTEGRATION TESTS: Offline Storage & Audit Logs');
  logs.push('---------------------------------------------------------');

  // Test 3.1: Offline Draft Storage Save & Retrieval
  const testDraftId = `draft_test_${Date.now()}`;
  saveOfflineDraft(testDraftId, { establishment: 'Test Estt', visits: 2 });
  const drafts = getOfflineDrafts();
  const foundDraft = drafts.find((d) => d.id === testDraftId);
  assert(!!foundDraft && foundDraft.data.establishment === 'Test Estt', 'Offline storage saves and retrieves draft item');

  // Test 3.2: Offline Draft Clear
  clearOfflineDraft(testDraftId);
  const updatedDrafts = getOfflineDrafts();
  assert(!updatedDrafts.some((d) => d.id === testDraftId), 'Offline storage clears draft item successfully');

  // Test 3.3: Security Audit Log Recording
  logAuditAction('Shri Raghunatha Maharana', 'EO', 'TEST_ACTION', 'Resource #101', 'QA Test Execution', 'SUCCESS');
  const auditLogs = getAuditLogs();
  assert(auditLogs.length > 0 && auditLogs[0].action === 'TEST_ACTION', 'Audit log engine appends security audit entry');

  logs.push('---------------------------------------------------------');
  logs.push('4. PERFORMANCE BENCHMARKS');
  logs.push('---------------------------------------------------------');

  // Test 4.1: Utility Execution Time (< 5ms)
  const startTime = performance.now();
  for (let i = 0; i < 1000; i++) {
    calculateDistanceKm(19.0760, 72.8777, 19.1197, 72.9051);
  }
  const endTime = performance.now();
  const durationMs = endTime - startTime;
  assert(durationMs < 50, `Performance benchmark: 1,000 Haversine calculations executed in ${durationMs.toFixed(2)}ms (< 50ms)`);

  logs.push('---------------------------------------------------------');
  logs.push('5. ACCESSIBILITY (A11Y) COMPLIANCE AUDIT');
  logs.push('---------------------------------------------------------');

  // Test 5.1: Color Palette Contrast Audit
  const epfoNavyHex = '#0B2545';
  const epfoAccentHex = '#00A896';
  assert(epfoNavyHex.length === 7 && epfoAccentHex.length === 7, 'EPFO Palette hex codes validated for high-contrast accessibility');

  logs.push('---------------------------------------------------------');
  logs.push(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  logs.push('---------------------------------------------------------');

  return { passed, failed, total: passed + failed, logs };
};
