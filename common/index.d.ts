/**
 * The module/global object passed to the plugin init functions
 */
export type FroalaModule = unknown;

export type Nullable<T extends {}> = T | null;
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };


export type LocalizeFunction = (key: string, defaultValue?: string) => string;

export interface IEvents<TEvent extends string = string> {
	notifyListeners(event: TEvent, ...args: any[]): void;
	on(what: TEvent | TEvent[], callback: Function, scope?: object, options?: object): IEvents<TEvent>;
	off(eventOrScope?: TEvent | TEvent[] | object | null, scopeOrCallback?: object | Function): IEvents<TEvent>;
	removeAllListeners(): IEvents<TEvent>;
	muteListener(listener: any, mute: boolean): IEvents<TEvent>;
	muteEvents(): IEvents<TEvent>;
	unmuteEvents(): IEvents<TEvent>;
	once(event: TEvent | TEvent[], callback: Function, scope?: object, options?: any): IEvents<TEvent>;
	trigger(event: TEvent, ...args: any[]): IEvents<TEvent>;
}

export interface ILoopIndexUser {
	readonly name: string;
	readonly id: string;
}

export type UserEvents = "beforeadd" | "add" | "remove" | "update" | "select";

export interface IUserManager<TUser extends ILoopIndexUser> {
	setCurrentUser(userId: string): void;
	/**
	 * 
	 * @param createDefault If true, return a default user object if there's no current user
	 */
	getCurrentUser(createDefault?: boolean): Nullable<TUser>;
	/**
	 * This method relies  on the `"beforeadd"` event. You should install a handler that updates the `user` field
	 * in the event  with a new user ,so raw user data is converted to the user type you need
	 * @param user 
	 */
	addUser(user: Partial<TUser>): Nullable<TUser>;
	hasUser(id: string): boolean;
	removeUser(id: string): void;
	getUser(id: string): Nullable<TUser>;
	getAllUsers(): Record<string, TUser>;
	getUsersArray(): TUser[];
	updateUser(userInfo: Partial<TUser>): Nullable<TUser>;
	count(filter?: (user: TUser) => boolean): number;
	hasUser(userId: string): boolean;
	readonly events: IEvents<UserEvents>;
	readonly currentUserId: string;
}



interface IFroalaCommandRecord {
	readonly command: string;
	readonly icon?: string;
	readonly tooltip?: string;
}

export type NodeOrSelector = string | JQuery | HTMLElement;

export type LocaleMapping = Record<string, string |string[]>;

export interface IPluginTooltipOptions {
	/**
	* @member App.TooltipsConfiguration
	* @property show
	*/
	show: boolean | "always";
	/**
	 * @member App.TooltipsConfiguration
	 * @property {Number=500} delay msecs to wait before showing tooltip
	 */
	delay: number;
	/**
	 * Plugin specific formatting template for the tooltip
	 * @member App.TooltipsConfiguration
	 * @property {String}
	 */
	template: string;
	/**
	 * If true, use the standard html title
	 */
	useTitle?: boolean;

	/**
	 * Override in plugins for a more specific type
	 */
	formatter?: Function;
}

export interface IPluginLogOptions {
	log: boolean;
	debug: boolean;
	warn: boolean;
	error: boolean;
	trace: boolean;
	throttle: boolean;
}

export interface ICommandRecord {
	readonly command: string;
	readonly title: string;
	readonly toolbar?: boolean;
	/**
	 * If false, don't trigger undo events around this command
	 */
	readonly undo?: boolean;
	readonly svg?: string;
	/**
	 * Optional relative path of icon. If not present and there's no svg, the command name is used
	 */
	readonly iconUrl?: string;
	/**
	 * If true, the command should be available when the editor is in readOnly mode
	 */
	readonly readOnly?: boolean;
}

export type UserTooltipsConfig<TConfig extends IPluginTooltipOptions> = boolean | "always" | Partial<TConfig>;

/**
 * No members are mandatory, so always use a Partial of this interface
 */
export interface IPluginUserConfig<
	TTooltips extends IPluginTooltipOptions = IPluginTooltipOptions,
	TCommands extends ICommandRecord = ICommandRecord
	> {
	/**
	 * URLs of style sheets to load into the page that runs the plugin code. Non relative paths are not modified.
	 * 
	 * Guaranteed array after init
	 */
	pageUrls: string[];
	/**
	 * relative urls of css files to load. Non relative paths are not modified
	 * 
	 * Guaranteed array after init
	 * */
	styleUrls: string[];

	localeMapping: LocaleMapping;

	/**
	 * @property {Boolean} logCommands
	 * If true, log editor commands through the loopindex logger
	 */
	logCommands: boolean;
	/**
	 * @property {Boolean} logEvents
	 * If true, log editor events through the loopindex logger
	 */
	logEvents: boolean;

	/**
	 * path to add to the plugin's path when loading plugin assets, so
	 * http:/..../plugin/folder may become http:/..../plugin/folder/../../common/folder
	 */
	assetPath: string;

	editorTheme: "dark" | "light" | "browser";

	tooltips: Partial<UserTooltipsConfig<TTooltips>>;

	debug: Partial<IPluginLogOptions>;

	commands: Partial<TCommands>[];
}



