export type ClassType<T> = new (...args: any[]) => T;

export declare interface AbstractClassType<T> extends Function {
	prototype: T;
}
export type RequestType<T> = ClassType<T> | AbstractClassType<T>;
