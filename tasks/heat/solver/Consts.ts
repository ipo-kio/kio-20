export const T_MAX: number = 1e6;
export const M = 6;
export const N = 6;
export const VIEW_DIVISION = 1;
export const N_element = VIEW_DIVISION * 25;
export const LENGTH = 1;
export const TIME = 250;
export const TIME_DIVISION = 10;
export const N_time = TIME_DIVISION * 250;
export const DEFAULT_MATERIAL: Material = "tree";

export const FOLLOW_EVALUATION_REDRAW_MS = 300;
export const DESIRED_MIN_TEMPERATURE = 50;
// export const DESIRED_MIN_TEMPERATURE = 1;

export type Material = "glass" | "air" | "tree" | "aluminium" | "sand";

export const material2index = {
    "aluminium": 0,
    "air": 1,
    "sand": 2,
    "glass": 3,
    "tree": 4
};
export const index2material: Material[] = ["aluminium", "air", "sand", "glass", "tree"];

// http://scask.ru/q_book_emp.php?id=35
const MUL_A = 1e3;
const MUL_K = 1e-2;
export const A = {
    "aluminium": 8.418e-5 * MUL_A,
    "air": 1.9e-5 * MUL_A,
    "sand": 1.15e-6 * MUL_A,
    "glass": 3.4e-7 * MUL_A,
    "tree": 8.2e-8  * MUL_A
};
export const K = {
    "aluminium": 239 * MUL_K,
    "air": 0.02 * MUL_K,
    "sand": 1.01 * MUL_K,
    "glass": 1.01 * MUL_K,
    "tree": 0.15  * MUL_K
};