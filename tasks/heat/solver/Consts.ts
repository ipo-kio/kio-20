export const T_MAX: number = 1e6;
export const M = 6;
export const N = 6;
export const VIEW_DIVISION = 5;
export const N_element = VIEW_DIVISION * 5;
export const LENGTH = 1;
export const TIME = 60 * 60;
export const TIME_DIVISION = 2;
export const N_time = TIME_DIVISION * 500;
export const DEFAULT_MATERIAL: Material = "tree";

export type Material = "glass" | "air" | "tree" | "aluminium" | "sand";

// http://scask.ru/q_book_emp.php?id=35
const MUL = 1e5;
export const A = {
    "aluminium": 8.418e-5 * MUL,
    "air": 1.9e-5 * MUL,
    "sand": 1.15e-6 * MUL,
    "glass": 3.4e-7 * MUL,
    "tree": 8.2e-8  * MUL
};
export const K = {
    "aluminium": 239 * MUL,
    "air": 0.02 * MUL,
    "sand": 1.01 * MUL,
    "glass": 1.01 * MUL,
    "tree": 0.15  * MUL
};

export const A_DEBUG = A;