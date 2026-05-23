/** @type {import('./file-template.mjs').Task[]} */
export const tasks = [
  { num: 166, slug: 'fizzbuzz', folder: '10-algorithms-easy', title: 'fizzbuzz', tags: ['algorithms'], difficulty: 'easy', description: 'fizzbuzz(n): массив строк 1..n.', solution: `export function fizzbuzz(n) {
  return Array.from({ length: n }, (_, i) => {
    const x = i + 1;
    if (x % 15 === 0) return 'FizzBuzz';
    if (x % 3 === 0) return 'Fizz';
    if (x % 5 === 0) return 'Buzz';
    return String(x);
  });
}`, test: `assert(fizzbuzz(5).join() === '1,2,Fizz,4,Buzz');` },
  { num: 167, slug: 'fibonacci', folder: '10-algorithms-easy', title: 'fibonacci', tags: ['algorithms'], difficulty: 'easy', description: 'fib(n) итеративно.', solution: `export function fibonacci(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`, test: `assert(fibonacci(6) === 8);` },
  { num: 168, slug: 'factorial', folder: '10-algorithms-easy', title: 'factorial', tags: ['algorithms'], difficulty: 'easy', description: 'factorial(n).', solution: `export function factorial(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}`, test: `assert(factorial(5) === 120);` },
  { num: 169, slug: 'sum-array', folder: '10-algorithms-easy', title: 'sum array', tags: ['algorithms'], difficulty: 'easy', description: 'sum массива.', solution: `export function sumArray(arr) {
  return arr.reduce((a, b) => a + b, 0);
}`, test: `assert(sumArray([1, 2, 3]) === 6);` },
  { num: 170, slug: 'max-min', folder: '10-algorithms-easy', title: 'max min', tags: ['algorithms'], difficulty: 'easy', description: 'maxMin(arr) → { max, min }.', solution: `export function maxMin(arr) {
  return { max: Math.max(...arr), min: Math.min(...arr) };
}`, test: `const { max, min } = maxMin([1, 5, 3]);
assert(max === 5 && min === 1);` },
  { num: 171, slug: 'two-sum', folder: '10-algorithms-easy', title: 'two sum', tags: ['algorithms'], difficulty: 'easy', description: 'twoSum(nums, target) → индексы.', solution: `export function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need), i];
    map.set(nums[i], i);
  }
  return [];
}`, test: `assert(twoSum([2, 7, 11, 15], 9).join() === '0,1');` },
  { num: 172, slug: 'binary-search', folder: '10-algorithms-easy', title: 'binary search', tags: ['algorithms'], difficulty: 'easy', description: 'binarySearch(sorted, target).', solution: `export function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`, test: `assert(binarySearch([1, 3, 5, 7], 5) === 2);` },
  { num: 173, slug: 'valid-parentheses', folder: '10-algorithms-easy', title: 'valid parentheses', tags: ['algorithms'], difficulty: 'easy', description: 'validParentheses(s).', solution: `export function validParentheses(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if ('([{'.includes(ch)) stack.push(ch);
    else if (')]}'.includes(ch)) {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}`, test: `assert(validParentheses('()[]{}') === true);
assert(validParentheses('(]') === false);` },
  { num: 174, slug: 'reverse-string', folder: '10-algorithms-easy', title: 'reverse string', tags: ['algorithms'], difficulty: 'easy', description: 'reverseString(s).', solution: `export function reverseString(s) {
  return [...s].reverse().join('');
}`, test: `assert(reverseString('abc') === 'cba');` },
  { num: 175, slug: 'reverse-array-inplace', folder: '10-algorithms-easy', title: 'reverse array inplace', tags: ['algorithms'], difficulty: 'easy', description: 'reverseInPlace(arr).',     solution: `export function reverseInPlace(arr) {
  let i = 0;
  let j = arr.length - 1;
  while (i < j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    i++;
    j--;
  }
  return arr;
}`, test: `const a = [1, 2, 3];
reverseInPlace(a);
assert(a.join() === '3,2,1');` },
  { num: 176, slug: 'merge-sorted', folder: '10-algorithms-easy', title: 'merge sorted', tags: ['algorithms'], difficulty: 'easy', description: 'mergeSorted(a, b).', solution: `export function mergeSorted(a, b) {
  const out = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) out.push(a[i] <= b[j] ? a[i++] : b[j++]);
  return out.concat(a.slice(i), b.slice(j));
}`, test: `assert(mergeSorted([1, 3], [2, 4]).join() === '1,2,3,4');` },
  { num: 177, slug: 'remove-duplicates-sorted', folder: '10-algorithms-easy', title: 'remove duplicates sorted', tags: ['algorithms'], difficulty: 'easy', description: 'uniqueSorted(arr).', solution: `export function uniqueSorted(arr) {
  if (!arr.length) return [];
  const out = [arr[0]];
  for (let i = 1; i < arr.length; i++) if (arr[i] !== arr[i - 1]) out.push(arr[i]);
  return out;
}`, test: `assert(uniqueSorted([1, 1, 2]).join() === '1,2');` },
  { num: 178, slug: 'missing-number', folder: '10-algorithms-easy', title: 'missing number', tags: ['algorithms'], difficulty: 'easy', description: 'missingNumber([0..n]).', solution: `export function missingNumber(nums) {
  const n = nums.length;
  let sum = (n * (n + 1)) / 2;
  for (const x of nums) sum -= x;
  return sum;
}`, test: `assert(missingNumber([3, 0, 1]) === 2);` },
  { num: 179, slug: 'majority-element', folder: '10-algorithms-easy', title: 'majority element', tags: ['algorithms'], difficulty: 'medium', description: 'majorityElement (Boyer–Moore).', solution: `export function majorityElement(nums) {
  let cand = null, count = 0;
  for (const n of nums) {
    if (count === 0) { cand = n; count = 1; }
    else if (n === cand) count++;
    else count--;
  }
  return cand;
}`, test: `assert(majorityElement([2, 2, 1, 1, 2]) === 2);` },
  { num: 180, slug: 'climbing-stairs', folder: '10-algorithms-easy', title: 'climbing stairs', tags: ['algorithms'], difficulty: 'easy', description: 'climbStairs(n).', solution: `export function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`, test: `assert(climbStairs(4) === 5);` },
  { num: 181, slug: 'coin-change-min', folder: '10-algorithms-easy', title: 'coin change min', tags: ['algorithms'], difficulty: 'medium', description: 'coinChange(coins, amount) min монет.', solution: `export function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (i >= c) dp[i] = Math.min(dp[i], dp[i - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`, test: `assert(coinChange([1, 2, 5], 11) === 3);` },
  { num: 182, slug: 'longest-substring', folder: '10-algorithms-easy', title: 'longest substring', tags: ['algorithms'], difficulty: 'medium', description: 'lengthOfLongestSubstring без повторов.', solution: `export function lengthOfLongestSubstring(s) {
  const set = new Set();
  let max = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) set.delete(s[left++]);
    set.add(s[right]);
    max = Math.max(max, right - left + 1);
  }
  return max;
}`, test: `assert(lengthOfLongestSubstring('abcabcbb') === 3);` },
  { num: 183, slug: 'max-subarray', folder: '10-algorithms-easy', title: 'max subarray', tags: ['algorithms'], difficulty: 'medium', description: 'maxSubArray (Kadane).', solution: `export function maxSubArray(nums) {
  let max = nums[0], cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    max = Math.max(max, cur);
  }
  return max;
}`, test: `assert(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) === 6);` },
  { num: 184, slug: 'contains-duplicate', folder: '10-algorithms-easy', title: 'contains duplicate', tags: ['algorithms'], difficulty: 'easy', description: 'containsDuplicate(nums).', solution: `export function containsDuplicate(nums) {
  const set = new Set();
  for (const n of nums) {
    if (set.has(n)) return true;
    set.add(n);
  }
  return false;
}`, test: `assert(containsDuplicate([1, 2, 3, 1]) === true);` },
  { num: 185, slug: 'move-zeros', folder: '10-algorithms-easy', title: 'move zeros', tags: ['algorithms'], difficulty: 'easy', description: 'moveZeroes in-place.', solution: `export function moveZeroes(nums) {
  let w = 0;
  for (const n of nums) if (n !== 0) nums[w++] = n;
  while (w < nums.length) nums[w++] = 0;
  return nums;
}`, test: `const a = [0, 1, 0, 3];
moveZeroes(a);
assert(a.join() === '1,3,0,0');` },
  { num: 186, slug: 'plus-one', folder: '10-algorithms-easy', title: 'plus one', tags: ['algorithms'], difficulty: 'easy', description: 'plusOne(digits).', solution: `export function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) { digits[i]++; return digits; }
    digits[i] = 0;
  }
  return [1, ...digits];
}`, test: `assert(plusOne([1, 2, 3]).join() === '1,2,4');` },
  { num: 187, slug: 'is-subsequence', folder: '10-algorithms-easy', title: 'is subsequence', tags: ['algorithms'], difficulty: 'easy', description: 'isSubsequence(s, t).', solution: `export function isSubsequence(s, t) {
  let i = 0;
  for (const ch of t) if (s[i] === ch) i++;
  return i === s.length;
}`, test: `assert(isSubsequence('abc', 'ahbgdc') === true);` },
  { num: 188, slug: 'ransom-note', folder: '10-algorithms-easy', title: 'ransom note', tags: ['algorithms'], difficulty: 'easy', description: 'canConstruct(ransom, magazine).', solution: `export function canConstruct(ransom, magazine) {
  const count = {};
  for (const ch of magazine) count[ch] = (count[ch] ?? 0) + 1;
  for (const ch of ransom) {
    if (!count[ch]) return false;
    count[ch]--;
  }
  return true;
}`, test: `assert(canConstruct('aa', 'aab') === true);` },
  { num: 189, slug: 'top-k-frequent', folder: '10-algorithms-easy', title: 'top k frequent', tags: ['algorithms'], difficulty: 'medium', description: 'topKFrequent(nums, k).', solution: `export function topKFrequent(nums, k) {
  const freq = {};
  for (const n of nums) freq[n] = (freq[n] ?? 0) + 1;
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([n]) => Number(n));
}`, test: `assert(topKFrequent([1, 1, 1, 2, 2, 3], 2).sort().join() === '1,2');` },
  {
    num: 190, slug: 'lru-cache', folder: '10-algorithms-easy', title: 'lru cache', tags: ['algorithms'], difficulty: 'medium',
    description: 'createLRU(capacity): get/set O(1) amortized.',
    solution: `export function createLRU(capacity) {
  const map = new Map();
  return {
    get(key) {
      if (!map.has(key)) return -1;
      const v = map.get(key);
      map.delete(key);
      map.set(key, v);
      return v;
    },
    set(key, value) {
      if (map.has(key)) map.delete(key);
      map.set(key, value);
      if (map.size > capacity) {
        const first = map.keys().next().value;
        map.delete(first);
      }
    },
  };
}`,
    test: `const lru = createLRU(2);
lru.set(1, 1); lru.set(2, 2);
assert(lru.get(1) === 1);
lru.set(3, 3);
assert(lru.get(2) === -1);`,
  },
];
