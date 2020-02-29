export interface Slice {
    width: number;
    height: number;
    get(x:number, y: number):number;
}