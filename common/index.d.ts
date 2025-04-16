/**
 * The module/global object passed to the Froala specific plugin init functions
 */
export type FroalaModule = unknown;

export type Nullable<T extends {}> = T | null;
export type Maybe<T extends {}> = T | undefined;
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type LocalizeFunction = (key: string, defaultValue?: string) => string;

export interface ICommandStatus {
	readonly enabled: boolean;
	readonly active?: boolean;
}

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
export interface IClientCommandRecord extends ICommandRecord {
	readonly localized: string;
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

export interface IFroalaCommandRecord {
	readonly command: string;
	readonly icon?: string;
	readonly tooltip?: string;
}

/**
 * Attempt to standardize cancelable events
 */
export interface ILoopIndexPluginEvent {
	canceled?: boolean;
}

/**
 * Events fired by all plugins
 */
export type PluginEvents = "config";

export interface ILoopIndexPlugin<TEditor, TConfig extends IPluginUserConfig> {
	readonly version: string;
	readonly build: string;
	readonly events: IEvents<PluginEvents>;
	readonly editor: TEditor;

	/**
	 * Quick ref to jquery
	 * @param e 
	 */
	readonly $: JQueryStatic;

	/**
	 * The path from which the plugin was loaded 
	 */
	readonly path: string;

	/**
	 * resolve a path relative to the plugin's path and assetpath. Absolute paths are not
	 * modified. Guaranteed not null
	 * @param paths 
	 */
	resolvePath(...paths: string[]): string;

	/**
	 * set the state of the commands to the provided values
	 * @param {String | String[]} commands 
	 * @param enable 
	 * @param active only relevant if true
	 */
	setCommandsState(commands: string | string[], enable: boolean, active?: boolean): void;

	/**
	 * Get the definitions of all the commands of this instance - command, title, iconUrl etc
	 */
	getCommands(): IClientCommandRecord[];

	/**
	 * Provides access to the configuration object. Has three modes of calling
	 * 
	 *     plugin.config() // returns a copy of the configuration object
	 *     plugin.config(key: string) // returns the value of the configuration property denoted by key
	 *     plugin.config(key: string, value: any) // sets the configuration property key to value, returns a copy of the configuration object
	 * 
	 */
	config<Tkey extends keyof TConfig, TRet = TConfig[Tkey]>(key: Tkey, value?: TRet): TRet;

	/**
	 * For debugging. If true, FLITE will log all editor commands (the command strings) before they are applied
	 * @member FLITE.FLITEPlugin
	 * @param {Boolean} log
	 * @private
	 * @ignore
	 */
	logEditorCommands(log: boolean): void;

	/**
	 * For debugging. If event logging is on, the plugin will emit log messages for most fired editor
	 * events. Selection, focus and mouse events are filtered out for the clarity and brevity
	 * of the log.
	 * @member FLITE.FLITEPlugin
	 * @param log 
	 */
	logEditorEvents(log: boolean): void;

	/**
	 * Async set language, returns success (internally gets an error string)
	 * @param locale "en" if falsy
	 */
	setLanguage(locale: string): Promise<boolean>;

	isInline(): boolean;

	getBody(): Nullable<HTMLElement>;

	getDocument(): Nullable<Document>;

	/**
	 * 
	 * @param editorOnly If true, return null if the editor thinks there's no selection
	 */
	getSelectedRange(editorOnly?: boolean): Nullable<Range>;

	/**
	 * Returns the window that contains the editor UI, not necessarily the same one that contains the document
	 */
	getEditorUIContainer(): Nullable<Window>;

	addDictionary(locale: string, dictionary: Record<string, string>): void;

	/**
	 * trigger an event thru the editor
	 * @param event 
	 * @param data 
	 */
	fireEditorEvent(event: string, data?: any): boolean;

	/**
	 * The plugin needs to read its state from the current content
	 */
	reloadFromDocument(): void;
}
