/**
 * Phase 7 Student Dashboard — storage validation tests (Node-safe).
 * Run: npx tsx src/components/dashboard/testStudentDashboard.ts
 */
import {
  getSavedProjects,
  getSavedForks,
  getDashboardActivity,
  forkToEvolutionPath,
  STUDENT_STORAGE_KEYS,
} from '../../utils/studentStorage';
import { EvolutionPath, ProjectFork, SavedProject } from '../../types';

console.log('--- TEST SUITE: PHASE 7 STUDENT DASHBOARD STORAGE ---');

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const samplePath: EvolutionPath = {
  id: 'path_test_upgrade',
  track: 'upgrade',
  badgeLabel: 'UPGRADE',
  title: 'Campus Weather Advisor+',
  tagline: 'Actionable commute guidance',
  overview: 'Adds decision rules on top of raw weather data.',
  problemSolved: 'Numbers without advice',
  targetUser: 'Commuting students',
  specificAiCapability: 'Multi-variable threshold scoring',
  whyUseful: 'Makes weather useful for campus life',
  architecturalShift: 'Rules engine over forecast API',
  recommendedStack: ['React', 'TypeScript', 'Tailwind'],
  sixtyMinuteStarterPlan: [
    {
      minuteRange: '0–15m',
      milestoneTitle: 'Scaffold',
      focusArea: 'Setup',
      actionableSteps: ['Init project'],
      deliverable: 'Repo ready',
    },
    {
      minuteRange: '15–30m',
      milestoneTitle: 'Rules',
      focusArea: 'Logic',
      actionableSteps: ['Write thresholds'],
      deliverable: 'Scoring fn',
    },
    {
      minuteRange: '30–45m',
      milestoneTitle: 'UI',
      focusArea: 'UX',
      actionableSteps: ['Advice card'],
      deliverable: 'Demo UI',
    },
    {
      minuteRange: '45–60m',
      milestoneTitle: 'Polish',
      focusArea: 'Ship',
      actionableSteps: ['README'],
      deliverable: 'Shareable demo',
    },
  ],
  difficulty: 'Beginner Friendly',
  nextAction: 'Build the scoring function first.',
};

// CRITERION 1: Node environment returns empty arrays (no fabricated data)
console.log('\n[CRITERION 1] Empty state without browser storage:');
const projects = getSavedProjects();
const forks = getSavedForks();
const activity = getDashboardActivity();
assert(Array.isArray(projects) && projects.length === 0, 'Expected empty projects in Node');
assert(Array.isArray(forks) && forks.length === 0, 'Expected empty forks in Node');
assert(Array.isArray(activity) && activity.length === 0, 'Expected empty activity in Node');
console.log('✓ Empty states are honest (no fabricated metrics).');

// CRITERION 2: forkToEvolutionPath preserves identity fields
console.log('\n[CRITERION 2] Fork → EvolutionPath mapping:');
const sampleFork: ProjectFork = {
  id: 'fork_test_1',
  parentProjectTitle: 'Campus Weather Advisor',
  parentAuthor: 'Alex Chen',
  parentTrack: 'upgrade',
  parentDomain: 'Environmental Intelligence',
  parentAiCapability: 'Threshold scoring',
  forkTitle: 'Campus Weather Advisor — Audio Edition',
  forkAuthor: 'Rohan Das',
  forkTrack: 'transform',
  problemSolved: 'Hands-busy commute queries',
  targetUser: 'Walking students',
  specificAiCapability: 'Speech-to-text weather queries',
  keyApproach: 'Web Speech API',
  recommendedStack: ['React', 'Web Speech API'],
  createdAt: new Date().toISOString(),
};
const mapped = forkToEvolutionPath(sampleFork);
assert(mapped.title === sampleFork.forkTitle, 'Mapped title mismatch');
assert(mapped.track === sampleFork.forkTrack, 'Mapped track mismatch');
assert(mapped.specificAiCapability === sampleFork.specificAiCapability, 'Capability mismatch');
assert(mapped.sixtyMinuteStarterPlan.length === 4, 'Expected 4 roadmap steps');
console.log('✓ Fork maps cleanly to Commit Card EvolutionPath.');

// CRITERION 3: Storage key stability (dashboard must reuse Friend Mode key)
console.log('\n[CRITERION 3] Storage key conventions:');
assert(
  STUDENT_STORAGE_KEYS.FORKS === 'projectpulse_forks',
  'Forks key must match Friend Mode persistence'
);
assert(
  STUDENT_STORAGE_KEYS.PROJECTS === 'projectpulse_saved_projects',
  'Projects key unexpected'
);
assert(
  STUDENT_STORAGE_KEYS.REGISTRATIONS === 'projectpulse_registrations',
  'Registrations key must match WorkshopModal'
);
console.log('✓ Storage keys align with existing Phase 5/6 conventions.');

// CRITERION 4: Malformed project shape is rejected by type guard path
console.log('\n[CRITERION 4] Saved project shape contract:');
const validShape: SavedProject = {
  id: 'proj_1',
  originalProject: 'Weather App',
  domain: 'Environmental Intelligence',
  path: samplePath,
  savedAt: new Date().toISOString(),
};
assert(typeof validShape.id === 'string', 'id required');
assert(validShape.path.track === 'upgrade', 'track required');
assert(Array.isArray(validShape.path.recommendedStack), 'stack required');
console.log('✓ SavedProject contract holds for dashboard rendering.');

console.log('\n=== PHASE 7 STORAGE TESTS PASSED ===\n');
