export const sum = (a: number, b: number) => a + b

// function twoSum1(nums: number[], target: number): number[] {
//   let resArr: number[] = [];
//   for (let index = 0; index < nums.length; index++) {
//     for (let j = 0; j < nums.length; j++) {
//       if (nums[index] + nums[j] === target) {
//         resArr = [index, j];
//         // break;
//       }
//     }
//   }
//   return resArr
// }
// function twoSum2(nums: number[], target: number): number[] {
//   let resArr: number[] = [];
//   const map = new Map<number, number>();
//   for (let index = 0; index < nums.length; index++) {
//     const num = map.get(target - nums[index])
//     if (num !== undefined) {
//       resArr = [index, num];
//     }
//     map.set(nums[index], index);
//   }
//   return resArr
// }
// console.log(twoSum1([9, 3, 5, 2, 7], 5));
// console.log(twoSum2([9, 3, 5, 2, 7], 5));
