/**
 * The module/global object passed to the Froala specific plugin init functions
 */
export type FroalaModule = unknown;

export type Nullable<T extends {}> = T | null;
export type Maybe<T extends {}> = T | undefined;
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type DeepMutable<T> = T extends (string | number | boolean | undefined) ? T
	: T extends ReadonlyArray<infer TElement> ? Array<DeepMutable<TElement>>
	: T extends object ? { -readonly [P in keyof T]: DeepMutable<T[P]> }
	: T;

export interface IDisposable {
	dispose(): void;
}

export interface IOperationResult<T extends {}> {
	readonly error?: string;
	readonly result?: T;
}

export type OperationPromise<T extends {}> = Promise<IOperationResult<T>>;

export type LocalizeFunction = (key: string, defaultValue?: string) => string;

export interface ICommandStatus {
	readonly enabled: boolean;
	readonly active?: boolean;
}

export interface IEvents<TEvent extends string = string> extends IDisposable {
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

export interface ILoopIndexUser<TUserType extends string = string> {
	readonly name: string;
	readonly id: string;
	/**
	 * Defaults to "user", affects only internal APIs
	 */
	readonly type?: TUserType;
	/**
	 * For internal use
	 */
	readonly metaData?: { readonly [key: string]: string };
}

export type UserEvents = "beforeadd" | "add" | "remove" | "update" | "select";

export interface IUserManager<TUser extends ILoopIndexUser, TUserType = TUser extends ILoopIndexUser<infer U> ? U : never> extends IDisposable {
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
	getUsersOfType(type: TUserType): TUser[];
	hasUser(userId: string): boolean;
	readonly events: IEvents<UserEvents>;
	readonly currentUserId: string;
}


interface IFroalaCommandRecord {
	readonly command: string;
	readonly icon?: string;
	readonly tooltip?: string;
}

export type NodeOrJQuery = Node | JQuery;
export type NodeOrSelector = NodeOrJQuery | string;
export type ElementOrJQuery = Element | JQuery;

export type LocaleMapping = Record<string, string | string[]>;

export interface IPluginTooltipOptions {
	/**
	* @member App.TooltipsConfiguration
	* @property show
	*/
	readonly show: boolean | "always";
	/**
	 * @member App.TooltipsConfiguration
	 * @property {Number=500} delay msecs to wait before showing tooltip
	 */
	readonly delay: number;
	/**
	 * Plugin specific formatting template for the tooltip
	 * @member App.TooltipsConfiguration
	 * @property {String}
	 */
	readonly template: string;
	/**
	 * If true, use the standard html title
	 */
	readonly useTitle?: boolean;

	/**
	 * Override in plugins for a more specific type
	 */
	readonly formatter?: Function;
}

export interface IPluginLogOptions {
	readonly log: boolean;
	readonly debug: boolean;
	readonly warn: boolean;
	readonly error: boolean;
	readonly trace: boolean;
	readonly throttle: boolean;
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

/**
 * Return by the plugin's api when queried about the commands
 */
export interface IClientCommandRecord extends ICommandRecord {
	readonly localized: string;
}


export type UserTooltipsConfig<TConfig extends IPluginTooltipOptions> = boolean | "always" | Partial<TConfig>;

export type PluginConfigurationKey<TPlugin extends IPluginConfig> = keyof TPlugin;
export type TPluginConfigKey<TConfig extends IPluginConfig> = PluginConfigurationKey<TConfig>;
export type TPluginConfigValue<TConfig extends IPluginConfig, TKey extends TPluginConfigKey<TConfig>> = TConfig[TKey];
export type TPluginConfigResult<TConfig extends IPluginConfig, TKey,
	TValue> = TKey extends undefined ?
	TConfig
	: TKey extends TPluginConfigKey<TConfig> ?
	TValue extends undefined ?
	TConfig[TKey]
	: TValue extends TPluginConfigValue<TConfig, TKey> ?
	TConfig
	: never
	: never;


export type PluginConfigMethod<TConfig extends IPluginConfig> = <TKey extends (TPluginConfigKey<TConfig> | undefined) = undefined,
	TValue = undefined>
	(key?: TKey, value?: TValue) => TPluginConfigResult<TConfig, TKey, TValue>;


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
	readonly pageUrls: string | ReadonlyArray<string>;
	/**
	 * relative urls of css files to load. Non relative paths are not modified
	 * 
	 * Guaranteed array after init
	 * */
	readonly styleUrls: ReadonlyArray<string>;

	readonly localeMapping: LocaleMapping;

	/**
	 * @property {Boolean} logCommands
	 * If true, log editor commands through the loopindex logger
	 */
	readonly logCommands: boolean;
	/**
	 * @property {Boolean} logEvents
	 * If true, log editor events through the loopindex logger
	 */
	readonly logEvents: boolean;

	/**
	 * path to add to the plugin's path when loading plugin assets, so
	 * http:/..../plugin/folder may become http:/..../plugin/folder/../../common/folder
	 */
	readonly assetPath: string;

	readonly editorTheme: "dark" | "light" | "browser";

	readonly tooltips: Partial<UserTooltipsConfig<TTooltips>>;

	readonly debug: Partial<IPluginLogOptions>;

	readonly commands: Partial<TCommands>[];
}

export interface IPluginConfig<
	TTooltips extends IPluginTooltipOptions = IPluginTooltipOptions,
	TCommands extends ICommandRecord = ICommandRecord
> {
	/**
	 * URLs of style sheets to load into the page that runs the plugin code. Non relative paths are not modified.
	 * 
	 * Guaranteed array after init
	 */
	readonly pageUrls: ReadonlyArray<string>;
	/**
	 * relative urls of css files to load. Non relative paths are not modified
	 * 
	 * Guaranteed array after init
	 * */
	readonly styleUrls: ReadonlyArray<string>;

	readonly localeMapping: LocaleMapping;

	/**
	 * @property {Boolean} logCommands
	 * If true, log editor commands through the loopindex logger
	 */
	readonly logCommands: boolean;
	/**
	 * @property {Boolean} logEvents
	 * If true, log editor events through the loopindex logger
	 */
	readonly logEvents: boolean;

	/**
	 * path to add to the plugin's path when loading plugin assets, so
	 * http:/..../plugin/folder may become http:/..../plugin/folder/../../common/folder
	 */
	readonly assetPath: string;

	readonly editorTheme: "dark" | "light" | "browser";

	readonly tooltips: TTooltips;

	readonly debug: IPluginLogOptions;

	readonly commands: ReadonlyArray<TCommands>;
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

export type RangeInfo = Pick<Range, "startOffset" | "endOffset" | "startContainer" | "endContainer" | "commonAncestorContainer">;

export interface ICoreLoopIndexPlugin {
	readonly version: string;
	readonly build: string;
	readonly events: IEvents<PluginEvents>;

	/**
	 * Quick ref to jquery
	 */
	readonly $: JQueryStatic;


	/**
	 * resolve a path relative to the plugin's path and assetpath. Absolute paths are not
	 * modified. Guaranteed not null
	 * @param paths 
	 */
	resolvePath(...paths: string[]): string;

	/**
	 * Restore focus to the editor.
	 * @param {Boolean} inline if true, focus even if the editor is in inline mode
	 */
	focusEditor(inline?: boolean): void;

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
	setSelectedRange(range: RangeInfo): boolean;

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

export interface ILoopIndexPlugin<TEditor extends {}, TConfig extends IPluginConfig> extends ICoreLoopIndexPlugin {
	readonly editor: TEditor;

	/**
	 * no params: Returns a copy of the configuration object
	 * @param key If no value is provided, returns the current value
	 * @param value If the value is provided, it is set and a copy of the config object is returned
	 */
	readonly config: PluginConfigMethod<TConfig>;
}
