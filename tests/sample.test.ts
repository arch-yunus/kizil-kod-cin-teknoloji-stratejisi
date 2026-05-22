import { run } from '../src/index';

test('runs without throwing', () => {
  expect(() => run()).not.toThrow();
});
