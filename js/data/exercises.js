// Master exercises index — imports all unit chunks
import { EXERCISES as EX12 } from './exercises_u1u2.js';
import { EXERCISES_U3U4 as EX34 } from './exercises_u3u4.js';
import { EXERCISES_U5U6 as EX56 } from './exercises_u5u6.js';
import { EXERCISES_U7U8 as EX78 } from './exercises_u7u8.js';
import { EXERCISES_U9U10 as EX910 } from './exercises_u9u10.js';
import { EXERCISES_U11U12 as EX1112 } from './exercises_u11u12.js';

export const ALL_EXERCISES = {
  ...EX12,
  ...EX34,
  ...EX56,
  ...EX78,
  ...EX910,
  ...EX1112,
};

export function getLessonExercises(lessonId) {
  return ALL_EXERCISES[lessonId] || [];
}
