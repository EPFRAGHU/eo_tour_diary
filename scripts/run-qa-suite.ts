import { runAllQATests } from '../src/test/qaTestSuite.test';

console.log('=========================================================');
console.log('      EPFO EO TOUR DIARY - QA & AUTOMATED TEST SUITE     ');
console.log('=========================================================');

const result = runAllQATests();

result.logs.forEach((log) => console.log(log));

if (result.failed > 0) {
  console.error(`❌ QA Test Suite failed with ${result.failed} failure(s).`);
  process.exit(1);
} else {
  console.log(`🎉 All ${result.passed} QA Tests Passed Successfully! (100% Pass Rate)`);
  process.exit(0);
}
