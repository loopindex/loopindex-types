
export type Nullable<T extends {}> = T | null;
export type Maybe<T extends {}> = T | undefined;
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type DeepMutable<T> = T extends (string | number | boolean | undefined) ? T
	: T extends ReadonlyArray<infer TElement> ? Array<DeepMutable<TElement>>
	: T extends object ? { -readonly [P in keyof T]: DeepMutable<T[P]> }
	: T;

export type PartialWith<TObject extends {}, TKey extends keyof TObject = keyof TObject> = Pick<TObject, TKey> & Partial<TObject>;	
export type PartialWithout<TObject extends {}, TKey extends keyof TObject> = Omit<TObject, TKey> & Partial<TObject>;	

/**
 * Allows using keyof vars as indices
 */
export type KeyOf<TObject extends object> = (string & keyof TObject);
export type AnyFunction = (...args: any[]) => unknown;

export type ErrorMessage = string;

export type StringConverter = (s: string) => string;

export type Tuple<TFirst, TSecond> = [key: TFirst, value: TSecond];

export interface IClonable<T> {
    clone(): IClonableMixin<T>;
}

export type IClonableMixin<T> = T & IClonable<T>;

export interface IDisposable {
	dispose(): void;
}

export interface IOperationResult<T extends {}> {
	readonly error?: ErrorMessage;
	readonly result?: T;
}

export type OperationPromise<T extends {}> = Promise<IOperationResult<T>>;

export type PopStateFunction<TValue> = (timeout?: number) => TValue;

export interface IEventListenerOptions {
	readonly scope: unknown;
	readonly count: number;
}


export type StringEnum<T extends string[]> = T extends [string, ...infer U] ? 
	U extends string[] ? T[0] | StringEnum<U> : never
	: T[0];



export interface IEvents<TEvent extends string = string> extends IDisposable {
	// notifyListeners(event: TEvent, ...args: any[]): void;
	on(what: TEvent | TEvent[], callback: Function, options?: Partial<IEventListenerOptions>): IEvents<TEvent>;
	/**
	 * to remove all listeners associated with a scope:
	 * - If your scope is an object, just pass it as the first param
	 * - If it's a string, pass `(null, yourscope)` 
	 * @param eventOrScope 
	 * @param scopeOrCallback 
	 */
	off(eventOrScope?: TEvent | TEvent[] | object | null, scopeOrCallback?: object | AnyFunction): IEvents<TEvent>;
	removeAllListeners(): IEvents<TEvent>;
	muteListener(scope: unknown, mute: boolean): IEvents<TEvent>;
	muteEvents(): PopStateFunction<boolean>;
	unmuteEvents(): PopStateFunction<boolean>;
	once(event: TEvent | TEvent[], callback: AnyFunction, scope?: unknown): IEvents<TEvent>;
	trigger(event: TEvent, ...args: unknown[]): IEvents<TEvent>;
	hasListener(event: TEvent, scope?: unknown): boolean;
}

export interface ILoopIndexDebugOptions {
	log: boolean;
	debug: boolean;
	warn: boolean;
	error: boolean;
	trace: boolean;
	throttle: boolean;
}

export interface ILoopIndexLogger {
	/**
	 * Returns a copy of the new configuration
	 * @param options 
	 */
	config(options?: Partial<ILoopIndexDebugOptions>): ILoopIndexDebugOptions;
	log(...args: any[]): void;
	error(...args: any[]): void;
	warn(...args: any[]): void;
	debug(...args: any[]): void;
	ignore(...args: any[]): void;
	trace(...args: any[]): void;
}
