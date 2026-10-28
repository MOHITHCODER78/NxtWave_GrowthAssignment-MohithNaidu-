import { 
  captureReferralCode, 
  processWorkshopRegistration, 
  calculateMilestones, 
  maskEmail,
  getOrCreateCurrentUserProfile 
} from '../../utils/referralEngine';
import { generateShareUrl, parseFriendUrlParams } from '../../utils/shareUrl';
import { WorkshopRegistration } from '../../types';

console.log('--- TEST SUITE: PHASE 6 REFERRAL ATTRIBUTION & REWARDS ---');

async function runTests() {
  // CRITERION 1: Valid Referral Code Creates Attribution
  console.log('\n[CRITERION 1] Valid Referral Code Capture:');
  const captured = captureReferralCode('?ref=PULSE-8912');
  console.log('Capture result:', captured);
  if (captured.code !== 'PULSE-8912' || captured.status !== 'captured') {
    throw new Error('Failed to capture valid referral code');
  }
  console.log('✓ Valid referral code successfully captured.');

  // CRITERION 2: Friend Mode + Referral Parameter Coexistence
  console.log('\n[CRITERION 2] Friend Mode & Referral Parameter Coexistence:');
  const combinedUrl = generateShareUrl({
    title: 'Smart Attendance Anomaly Detector',
    track: 'upgrade',
    authorName: 'Alex Chen',
    domain: 'Academic Operations',
    referralCode: 'PULSE-7842',
  });
  console.log('Combined Share URL:', combinedUrl);
  if (!combinedUrl.includes('view=friend') || !combinedUrl.includes('ref=PULSE-7842')) {
    throw new Error('Combined URL failed to preserve both friend view and referral code');
  }
  const parsedCombined = parseFriendUrlParams(combinedUrl);
  if (!parsedCombined || parsedCombined.referralCode !== 'PULSE-7842') {
    throw new Error('Failed to parse referral code from combined friend link');
  }
  console.log('✓ Friend Mode and Referral codes coexist harmoniously.');

  // CRITERION 3: Self-Referral & Unknown Code Safety
  console.log('\n[CRITERION 3] Self-Referral Prevention:');
  const currentUser = getOrCreateCurrentUserProfile();
  const selfCapture = captureReferralCode(`?ref=${currentUser.referralCode}`);
  console.log('Self-referral capture response:', selfCapture);
  if (selfCapture.status !== 'self_referral_ignored') {
    throw new Error('Self referral was not blocked');
  }

  const selfReg: WorkshopRegistration = {
    id: 'reg_self_1',
    studentName: currentUser.name,
    email: currentUser.email,
    phone: '9876543210',
    college: currentUser.college,
    yearOfStudy: '3rd Year',
    referralCodeUsed: currentUser.referralCode,
    verified: true,
    registeredAt: new Date().toISOString(),
  };
  const selfProcessResult = processWorkshopRegistration(selfReg);
  console.log('Self-registration process result:', selfProcessResult);
  if (selfProcessResult.status !== 'rejected' || selfProcessResult.creditsAwarded !== 0) {
    throw new Error('Self-referral was credited instead of rejected');
  }
  console.log('✓ Self-referral successfully rejected with zero credits awarded.');

  // CRITERION 4: Clicks and Modal Opens Award NO Credits
  console.log('\n[CRITERION 4] Non-Conversion Events (Clicks & Modal Opens):');
  const nonConversionReg: WorkshopRegistration = {
    id: 'reg_no_code',
    studentName: 'Casual Visitor',
    email: 'visitor@college.edu',
    phone: '9999999999',
    college: 'Random College',
    yearOfStudy: '2nd Year',
    referralCodeUsed: undefined, // no code submitted
    verified: true,
    registeredAt: new Date().toISOString(),
  };
  const nonConversionResult = processWorkshopRegistration(nonConversionReg);
  console.log('Non-referred registration result:', nonConversionResult);
  if (nonConversionResult.creditsAwarded !== 0) {
    throw new Error('Non-referred action awarded credits');
  }
  console.log('✓ Zero credits awarded for non-referral action.');

  // CRITERION 5: Qualifying Registration Awards Credits & Updates Status
  console.log('\n[CRITERION 5] Qualifying Registration Processing:');
  const qualifyingReg: WorkshopRegistration = {
    id: 'reg_friend_1',
    studentName: 'Rohan Sharma',
    email: 'rohan.sharma@nitk.edu',
    phone: '9123456780',
    college: 'NIT Karnataka',
    yearOfStudy: '3rd Year',
    referralCodeUsed: 'PULSE-7842',
    verified: true,
    registeredAt: new Date().toISOString(),
  };
  const qualifyResult = processWorkshopRegistration(qualifyingReg);
  console.log('Qualifying registration result:', qualifyResult);
  if (qualifyResult.status !== 'qualified' || qualifyResult.creditsAwarded !== 50) {
    throw new Error('Qualifying registration did not award 50 credits');
  }
  console.log('✓ Qualifying registration correctly awarded +50 Project Credits.');

  // CRITERION 6: Duplicate Processing Idempotency (Anti-Double-Crediting)
  console.log('\n[CRITERION 6] Idempotent Processing (Duplicate Prevention):');
  const duplicateResult = processWorkshopRegistration(qualifyingReg);
  console.log('Re-processing exact same registration:', duplicateResult);
  if (duplicateResult.creditsAwarded !== 0 || duplicateResult.status !== 'duplicate_ignored') {
    throw new Error('Duplicate registration awarded double credits');
  }

  // Duplicate email with different registration ID
  const duplicateEmailReg: WorkshopRegistration = {
    id: 'reg_friend_duplicate_id',
    studentName: 'Rohan Sharma (Duplicate Attempt)',
    email: 'rohan.sharma@nitk.edu', // same email
    phone: '9123456780',
    college: 'NIT Karnataka',
    yearOfStudy: '3rd Year',
    referralCodeUsed: 'PULSE-7842',
    verified: true,
    registeredAt: new Date().toISOString(),
  };
  const duplicateEmailResult = processWorkshopRegistration(duplicateEmailReg);
  console.log('Duplicate email registration result:', duplicateEmailResult);
  if (duplicateEmailResult.status !== 'rejected' || duplicateEmailResult.creditsAwarded !== 0) {
    throw new Error('Duplicate email under same code was not rejected');
  }
  console.log('✓ Idempotency and duplicate email protection verified.');

  // CRITERION 7: Bronze, Silver, Gold Milestone Thresholds
  console.log('\n[CRITERION 7] Milestone Tiers Thresholds Verification:');
  const zeroMilestones = calculateMilestones(0, 0);
  if (zeroMilestones[0].isUnlocked || zeroMilestones[1].isUnlocked || zeroMilestones[2].isUnlocked) {
    throw new Error('Milestones unlocked at 0 referrals');
  }

  const bronzeMilestones = calculateMilestones(1, 50);
  console.log('At 1 referral (50 credits): Bronze =', bronzeMilestones[0].isUnlocked, 'Silver =', bronzeMilestones[1].isUnlocked);
  if (!bronzeMilestones[0].isUnlocked || bronzeMilestones[1].isUnlocked) {
    throw new Error('Bronze milestone unlock criteria mismatch');
  }

  const silverMilestones = calculateMilestones(3, 150);
  console.log('At 3 referrals (150 credits): Silver =', silverMilestones[1].isUnlocked, 'Gold =', silverMilestones[2].isUnlocked);
  if (!silverMilestones[1].isUnlocked || silverMilestones[2].isUnlocked) {
    throw new Error('Silver milestone unlock criteria mismatch');
  }

  const goldMilestones = calculateMilestones(5, 250);
  console.log('At 5 referrals (250 credits): Gold =', goldMilestones[2].isUnlocked);
  if (!goldMilestones[2].isUnlocked) {
    throw new Error('Gold milestone unlock criteria mismatch');
  }
  console.log('✓ Bronze (1 / 50cr), Silver (3 / 150cr), and Gold (5 / 250cr) thresholds verified.');

  // CRITERION 8: Email Masking Privacy
  console.log('\n[CRITERION 8] Email Masking Privacy Audit:');
  const masked = maskEmail('rohan.das@vjti.edu');
  console.log('Masked email output:', masked);
  if (masked !== 'ro***@vjti.edu') {
    throw new Error(`Email masking failed: expected ro***@vjti.edu, got ${masked}`);
  }
  console.log('✓ Email masking preserves privacy.');

  console.log('\nALL 8 REFERRAL & REWARDS INTEGRITY CHECKS PASSED WITH 100% ACCURACY!');
}

runTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});

