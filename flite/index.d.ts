import { ILoopIndexGlobals } from "..";
import type {
	IPluginUserConfig, ILoopIndexUser, IUserManager,
	Nullable, FroalaModule,
	ICommandRecord, LocalizeFunction,
	IPluginTooltipOptions, Maybe, ICommandStatus,
	ILoopIndexPlugin,
	IPluginConfig, Mutable, ILoopIndexLogger,
	IFroalaInitOptions
} from "../common";

export type FLITECopyBehavior = "raw" | "clean";
export type FLITESessionPolicy = "always" | "manual" | "never";
export type FLITEOrphanPolicy = "editor" | "div" | "p" | "";
export type TrackingMode = "full" | "readonly" | "none";
export type PassiveInsertMode = "none" | "passive" | "active" | "insert";
export type AttributePolicy = "compact" | "dom" | "full" | "export";
export type EditorDestroyPolicy = "accept" | "reject" | "hide" | "none";
export type IMEMixedPolicy = "hide" | "none";
export type SpellcheckAttributePolicy = "none" | "all" | "delete";

export interface IFLITEUserStyle {
	readonly "delete"?: {
		readonly [selector: string]: string
	}
	readonly "insert"?: {
		readonly [selector: string]: string
	},
	readonly "common"?: {
		readonly [selector: string]: string
	}
}

export interface IFLITEUser<TUserType extends string = string> extends ILoopIndexUser<TUserType> {
	readonly style?: IFLITEUserStyle;
}

export interface IFLITECommand extends ICommandRecord {
	readonly trackingOnly: boolean;
}

export type FLITEStatusCallback = (options: IStatusCallbackOptions) => Maybe<ICommandStatus>;

export interface IStatusCallbackOptions {
	readonly command: string;
	readonly plugin: IFLITEPlugin;
	readonly enabled: boolean;
	readonly active?: boolean;
	readonly user: ILoopIndexUser;
	readonly change: Nullable<ITrackedChange>;
}

export interface ITrackedChange {
	readonly id: string;
	//type: "insertType" | "deleteType";
	readonly time: number;
	readonly lastTime: number;
	readonly userid: string;
	readonly username: string;
	readonly sessionId?: string;
	readonly data?: any;
	//style: string;
}
export interface IChangeSet {
	readonly count: number,
	readonly changes: Record<string, ITrackedChange>;
}

export interface IChangeFilterOptions {
	/**
	 * Array of user ids to include
	 */
	include?: Array<string>;
	/**
	 * Array of user ids to exclude
	 */
	exclude?: Array<string>;
	filter?: (params: { userid?: string, time?: number, data?: any }) => any;
	/**
	 * If true, verify that nodes exist when counting changes
	 */
	verify?: boolean;
	/**
	 * Don't fire editor events on completion
	 */
	notify?: false;
	/**
	 * Internal use
	 */
	strict?: boolean;

}

/**
 * The configuration object used by FLITE after the user config has been processed
 */
interface IMutableFLITEConfiguration extends Mutable<IPluginConfig<IFLITETooltipOptions, IFLITECommand>> {
	/**
	 * @member FLITE.configuration
	 * @property {Boolean} isTracking
	 * Initial tracking state of the plugin. Default: <code>true</code>
	 */
	isTracking: boolean;
	/**
	 * @member FLITE.configuration
	 * @property {Boolean} isVisible
	 * Initial visibility state of tracked changes. Default: <code>true</code>
	 */
	isVisible: boolean;
	/**
	 * @member FLITE.configuration
	 * @property {String} onEditorDestroy
	 * accept, reject, hide, none
	 */
	onEditorDestroy: EditorDestroyPolicy;

	/**
	 * @member FLITE.configuration
	 * @property {Object} backgroundColors
	 * Colors to use for text background
	 */
	backgroundColors: {
		"delete": ReadonlyArray<string>,
		"insert": ReadonlyArray<string>
	};


	/**
	 * @member FLITE.configuration
	 * @property {FLITE.TooltipsConfiguration} tooltips
	 * Configures the tooltips shown by FLITE
	 * <div><strong>Omit the classPath member in order to get tooltips in standard html title elements</strong></div>
	 * These are the default values used by FLITE:
	 * <pre>
	 * 	flite.tooltips = {
	 * 		show: true, // set to false to prevent tooltips
	 * 		delay: 500 // the delay in milliseconds between hovering over a change node and the appearance of a tooltip
	 * 		useTitle: false // if true, use the standard HTML title
	 * 		template: "%a by %u %t" // A format string used to create the content of tooltips shown over change spans
	 * 	};
	 * </pre>
	 * 
	 * <h3>Template formats</h3>
	 * (use uppercase to apply the format to the last modification date of the change span rather than the first) 
	 *
	 * - <strong>%a</strong>  The action, "added" or "deleted" (not internationalized yet)
	 * - <strong>%t</strong>  Timestamp of the first edit action in this change span (e.g. "now", "3 minutes ago", "August 15 1972")
	 * - <strong>%u</strong>  the name of the user who made the change
	 * - <strong>%dd</strong> double digit date of change, e.g. 02
	 * - <strong>%d</strong>  date of change, e.g. 2
	 * - <strong>%mm</strong> double digit month of change, e.g. 09
	 * - <strong>%m</strong>  month of change, e.g. 9
	 * - <strong>%yy</strong> double digit year of change, e.g. 11
	 * - <strong>%y</strong>  full month of change, e.g. 2011
	 * - <strong>%nn</strong> double digit minutes of change, e.g. 09
	 * - <strong>%n</strong>  minutes of change, e.g. 9
	 * - <strong>%hh</strong> double digit hour of change, e.g. 05
	 * - <strong>%h</strong>  hour of change, e.g. 5
	 *	 
	 */
	tooltips: IFLITETooltipOptions,

	/**
	 * @member FLITE.configuration
	 * @property contextMenu String, boolean or string[], Guaranteed string[] after config validation
	 * If boolean, false means no items in the editor's context menu,
	 * true means default items (accept one, reject one)
	 * if string, comma separated command names
	 * If array, list of commands names
	 * 
	 * After validation: string[]
	 */
	contextMenu: ReadonlyArray<string>;

	/**
	 * @member FLITE.configuration
	 * @property {Array|String} ignoreCommands
	 * Array or comma separated string of editor commands to ignore. When FLITE detects that a command from this list is about to
	 * be executed by the editor, it ignores the DOM changes generated by this command.
	 */
	ignoreCommands: ReadonlyArray<string>;

	/**
	 * @member FLITE.configuration
	 * @property {Array|String} ignoreSelectors
	 * Array of CSS selector strings. When FLITE processes insertion of html (e.g. clipboard paste or some other plugin
	 * invoking CKEditor's <code>insertHtml()</code>, it will skip nodes that match any of these selectors plus
	 * those that contain a non-empty value for the attribute <code>data-track-changes-ignore</code>. Note that mixing ignore
	 * and unignored nodes in the same insertion is not very useful, since the insertion will be handled entirely by
	 * FLITE if at least one node is not ignored.
	 */
	ignoreSelectors: string | string[];

	/**
	 * @member FLITE.configuration
	 * @property {Array|String} opaqueSelectors
	 * Array of CSS selector strings. FLITE will ignore changes inside elements that match these selectors
	 */
	opaqueSelectors: string | string[];

	/**
	 * @member FLITE.configuration
	 * @property {Array|String} deletableSelectors
	 * Array of CSS selector strings. Elements that match these selectors can be marked as deleted. 
	 * FLITE will add the selectors you provide to the default list, which is
	 * 
	 * <code>P,LI,H1,H2,H3,H4,H5,H6,DIV,IMG</code>
	 */
	deletableSelectors: string;

	/**
	 * Initial user to track with
	 */
	user?: Partial<IFLITEUser>;

	users: Partial<IFLITEUser>[];

	/**
	 * @member FLITE.configuration
	 * @property {Boolean} acceptRejectInReadOnly
	 */
	acceptRejectInReadOnly: boolean;
	/**
	 * If true, move to next node after accept/reject a single change
	 */
	autoNext: boolean;

	/** 
	 * A string denoting the time zone in which all time stamps should be read and stored
	 * @member FLITE.configuration
	 * @property {String} timezone
	 */
	timezone?: string;

	/** 
	 * A number denoting the number of seconds to add to a date, to make it the time in the plugin's timezone (configured in the timezone field)
	 * @member FLITE.configuration
	 * @property {String} timezone
	 */
	timezoneOffset?: number;

	/**
	 * if `true`, the command to stop tracking will not require resolution of all changes
	 * if `false`, you can't toggle tracking off if there are pending changes.
	 * 
	 * 
	 * if a function, it is invoked with the plugin instance as a parameter, the return value is assumed to be a `promise`.
	 * If the promise resolves to `true` or `false`, then it is  treated like the prev values.
	 * 
	 * If the promise resolves to `"accept"` or `"reject"`, then the corresponding action is performed
	 * before the tracking is turned off.
	 * @member FLITE.configuration
	 * @property {Boolean | Function} allowQuitWithChanges=false
	 */
	allowQuitWithChanges: boolean | ((plugin: IFLITEPlugin) => Promise<Boolean | "accept" | "reject">);

	/**
	 * @member FLITE.configuration
	 * @property {Boolean/String} ignoreContainers
	 * If true, do not track block containers. If a string,
	 */
	ignoreContainers: string | Array<string> | boolean;

	/**
	 * @member FLITE.configuration
	 * @property {Boolean} removeDeleteOnPaste
	 * If true, FLITE will try to remove content tracked as deleted from the clipboard before pasting.
	 */
	removeDeleteOnPaste: boolean;

	/**
	 * @member FLITE.configuration
	 * @property {Number} [maxDocumentReadyWaitSeconds=1.0]
	 * FLITE initializes itself after the document is ready (either `document.readyState==="complete"` or upon the `DOMContentLoaded event).
	 * If you document doesn't load for a while, you may still want FLITE to go ahead with its initialization. Set this value to the max
	 * number of *seconds* that you'd like FLITE to wait before forcing init.
	 */
	maxDocumentReadyWaitSeconds?: number;

	/**
	 * @member FLITE.configuration
	 * @property {Boolean} [preserveWhiteSpace=true]
	 * If true, FLITE will convert space sequences to interspersed &nbsp chars, when accepting changes
	 */
	preserveWhiteSpace?: boolean;

	/**
	 * @member FLITE.configuration
	 * @property {String} [spellCheckerClasses=null]
	 * A collection of classes to add to the plugin's spell checker css selector
	 */
	spellCheckerClasses?: string | string[];

	/**
	 * @member FLITE.configuration
	 * @property {Boolean} [trackApiInsert=true]
	 * A collection of classes to add to the plugin's spell checker css selector
	 */
	trackApiInsert: boolean;

	/**
	 * @member FLITE.configuration
	 * @property {Boolean} [showChangesWhenInactive=true]
	 * if `false`, hide tracking styles when not tracking
	 */
	showChangesWhenInactive: boolean;

	/**
	 * @member FLITE.configuration
	 * @property {Boolean} [trackSpellcheck=false]
	 * if `false`, hide tracking styles when not tracking
	 */
	trackSpellcheck: boolean;

	/**
	* @member FLITE.configuration
	* @property {Boolean} [handlePaste=true]
	* 
	*/
	handlePaste: boolean;

	/**
	 * @member FLITE.configuration
	 * @property {Boolean} [allowFindDeletedText=true]
	 * In supported editors (currently CKEditor and TinyMCE), `false` will direct FLITE to hide text marked for deletion
	 * when the user activates the Find/Replace dialog
	 */
	allowFindDeletedText: boolean;

	/**
	 * Determines how FLITE copies tracked data to the clipboard
	 * 
	 *
	 * - `clean` - Copy without trakcing markup and without deleted content
	 * - `raw` - Copy with all tracking markup
	 *
	 */
	copyBehavior: FLITECopyBehavior;

	/**
	 * Determines how FLITE manages sessions. This flag has three legal values:
	 * 
	 *
	 * - `always` (default) - Create a new session on each document reload/set content. In addition, sessions can be started through [api calls]({@link FLITEPlugin.startNewSession api calls} )
	 * - `manual` - Sessions are only started through [api calls]({@link FLITEPlugin.startNewSession api calls} )
	 * - `never` - Sessions are... well, never created.
	 *
	 */
	sessionPolicy: FLITESessionPolicy;

	/**
	 * Determines how FLITE handles inserts when it is not tracking and the editor caret is inside a tracked range.
	 *
	 * - `"passive"` (default) - if the caret is inside a tracked range, FLITE will split the range so the editor performs the insert outside tracking markup
	 * - `"none"` - FLITE ignores inserts when not tracking
	 * - `"active"` - FLITE will insert a span element into which the editor will insert
	 * - `"insert"` - FLITE will split the tracked range and insert the content itself.
	 *
	 */
	readonlyInsertPolicy: PassiveInsertMode;

	/**
	 * Commands in this array can be active when FLITE is not tracking or the editor is in readonly mode.
	 * 
	 * Defaults to no commands
	 * 
	 * Note that the show/hide changes commands are always active.
	 * 
	 * Example setting: ["flite-acceptall", "flite-rejectone"]
	 * 
	 * You can also pass the string '*' as shorthand for all the accept/reject commands
	 */
	nonTrackingCommands: string | string[];

	/**
	 * If true, track list items converted from bullet -> number or vice versa as added
	 */
	trackListTypeChange: boolean;

	/**
	 * By default, the FLITE commands are available, at least via the API, when tracking is off and/or when the document is
	 * in readonly mode. In this state, FLITE tries to keep user input outside tracked regions.
	 * 
	 * This behavior can be turned off by setting this options to ```false```.
	 */
	passiveTracking: boolean;

	statusCallback?: FLITEStatusCallback;

	clipboardSupport: boolean;

	/**
	 * Defaults to false
	 */
	preserveStyles: boolean;

	/**
	 * Defaults to false
	 * "compact", "dom", "full", "export"
	 */
	attributePolicy: AttributePolicy;

	/**
	 * Defaults to false
	 */
	trackIME: boolean;

	readonlyDelete: boolean;

	/**
	 * Defaults to "none"
	 */
	imeMixedTrackingPolicy: IMEMixedPolicy;

	orphanContainer: FLITEOrphanPolicy;

	/**
	 * Some browser spellchecker honor the `spellcheck` attribute of the elements. If you want to prevent the browser from
	 * checking the spelling of some or all tracked text, set this option to `true`. If you want to prevent the browser from
	 * @property {Boolean | "delete"} [disableSpellcheck=false]
	 * @since FLITE 1.6.25
	 * Allowed values:
	 * 
	 * - `false` - (default) - FLITE does not set the `spellcheck` attribute of tracked text
	 * - `true` - FLITE adds `spellcheck="false"` to tracked text
	 * - `"delete"`- FLITE adds `spellcheck="false"` to tracked deleted text
	 */
	disableSpellcheck: SpellcheckAttributePolicy;

	/**
	 * If `true`, override configured user settings with those found in loaded documents.
	 * 
	 * Defaults to `false`
	 */
	useDocumentUserData: boolean;

}


export type IFLITEConfiguration = Readonly<IMutableFLITEConfiguration>;
export interface IFLITEPlugin<
	TEditor extends {} = object,
	TConfig extends IFLITEConfiguration = IFLITEConfiguration,
	TUser extends IFLITEUser = IFLITEUser
>
	extends ILoopIndexPlugin<TEditor, TConfig> {

	readonly users: IUserManager<TUser>;
	/**
	 * Set the name & id of the current user
	 * @param {Object} info an object with the fields `name`, `id`
	 * @param {Boolean} silent if true, don't trigger events or refresh commands
	 * @returns true if the operation succeeded
	 */
	setUserInfo(user: Partial<IFLITEUser> | string, silent?: boolean): boolean;
	/**
 * Returns the current user. same as plugin.users.getCurrentUser()
 */
	getUserInfo(): Nullable<IFLITEUser>;
	getChanges(options?: IChangeFilterOptions): IChangeSet;
	acceptAll(options?: IChangeFilterOptions): void;
	rejectAll(options?: IChangeFilterOptions): void;
	/**
	 * Returns the number of change records (not necessarily the numnber of changed nodes, some of those may be part of the same change)
	 * @param options 
	 */
	countChanges(options?: IChangeFilterOptions): number;
	/**
	 * Returns the current change set, optionallly filtered by `options`
	 * @param options
	 */
	getChanges(options: IChangeFilterOptions): IChangeSet;


}

export interface IFLITEInitEvent<TEditor extends {} = object> {
	flite: IFLITEPlugin<TEditor>;
}




export interface IFLITEGlobals {
	readonly Commands: IFLITECommands;
	readonly Events: IFLITEEvents;
	readonly logger: ILoopIndexLogger;
	initFroalaFLITEPlugin(Froala: FroalaModule, options: IFroalaInitOptions): Promise<boolean>;
}

export interface ITooltipTitleOptions {
	config: IFLITETooltipOptions;
	change: ITrackedChange;
	timeOffset: number;
	isInsert: boolean;
	element: string;
	localize: LocalizeFunction;
}


export type TooltipCallback = (options: ITooltipTitleOptions) => string;

/**
 * @class FLITE.TooltipsConfiguration
 * @member FLITE
 */
export interface IFLITETooltipOptions extends IPluginTooltipOptions {
	/**
	 * @member FLITE.TooltipsConfiguration
	 * @property show
	 */
	formatter?: TooltipCallback;
}


/**
 * This is the full interface. Normally you use Partial<IFLITEConfiguration> in your code
 */
export interface IFLITEUserConfiguration extends IPluginUserConfig<IFLITETooltipOptions, IFLITECommand> {
	/**
	 * @member FLITE.configuration
	 * @property {Boolean} isTracking
	 * Initial tracking state of the plugin. Default: <code>true</code>
	 */
	isTracking: boolean;
	/**
	 * @member FLITE.configuration
	 * @property {Boolean} isVisible
	 * Initial visibility state of tracked changes. Default: <code>true</code>
	 */
	isVisible: boolean;
	/**
	 * @member FLITE.configuration
	 * @property {String} onEditorDestroy
	 * accept, reject, hide, none
	 */
	onEditorDestroy: string;

	/**
	 * @member FLITE.configuration
	 * @property {Object} backgroundColors
	 * Colors to use for text background
	 */
	backgroundColors: {
		"delete": ReadonlyArray<string>,
		"insert": ReadonlyArray<string>
	};


	/**
	 * @member FLITE.configuration
	 * @property {FLITE.TooltipsConfiguration} tooltips
	 * Configures the tooltips shown by FLITE
	 * <div><strong>Omit the classPath member in order to get tooltips in standard html title elements</strong></div>
	 * These are the default values used by FLITE:
	 * <pre>
	 * 	flite.tooltips = {
	 * 		show: true, // set to false to prevent tooltips
	 * 		delay: 500 // the delay in milliseconds between hovering over a change node and the appearance of a tooltip
	 * 		useTitle: false // if true, use the standard HTML title
	 * 		template: "%a by %u %t" // A format string used to create the content of tooltips shown over change spans
	 * 	};
	 * </pre>
	 * 
	 * <h3>Template formats</h3>
	 * (use uppercase to apply the format to the last modification date of the change span rather than the first) 
	 * 
	 * - <strong>%a</strong>  The action, "added" or "deleted" (not internationalized yet)
	 * - <strong>%t</strong>  Timestamp of the first edit action in this change span (e.g. "now", "3 minutes ago", "August 15 1972")
	 * - <strong>%u</strong>  the name of the user who made the change
	 * - <strong>%dd</strong> double digit date of change, e.g. 02
	 * - <strong>%d</strong>  date of change, e.g. 2
	 * - <strong>%mm</strong> double digit month of change, e.g. 09
	 * - <strong>%m</strong>  month of change, e.g. 9
	 * - <strong>%yy</strong> double digit year of change, e.g. 11
	 * - <strong>%y</strong>  full month of change, e.g. 2011
	 * - <strong>%nn</strong> double digit minutes of change, e.g. 09
	 * - <strong>%n</strong>  minutes of change, e.g. 9
	 * - <strong>%hh</strong> double digit hour of change, e.g. 05
	 * - <strong>%h</strong>  hour of change, e.g. 5
	 * 
	 */

	/**
	 * @member FLITE.configuration
	 * @property contextMenu String, boolean or string[], Guaranteed string[] after config validation
	 * If boolean, false means no items in the editor's context menu,
	 * true means default items (accept one, reject one)
	 * if string, comma separated command names
	 * If array, list of commands names
	 * 
	 * After validation: string[]
	 */
	contextMenu: boolean | string | Array<string>;

	/**
	 * @member FLITE.configuration
	 * @property {Array|String} ignoreCommands
	 * Array or comma separated string of editor commands to ignore. When FLITE detects that a command from this list is about to
	 * be executed by the editor, it ignores the DOM changes generated by this command.
	 */
	ignoreCommands: Array<string>;

	/**
	 * @member FLITE.configuration
	 * @property {Array|String} ignoreSelectors
	 * Array of CSS selector strings. When FLITE processes insertion of html (e.g. clipboard paste or some other plugin
	 * invoking CKEditor's <code>insertHtml()</code>, it will skip nodes that match any of these selectors plus
	 * those that contain a non-empty value for the attribute <code>data-track-changes-ignore</code>. Note that mixing ignore
	 * and unignored nodes in the same insertion is not very useful, since the insertion will be handled entirely by
	 * FLITE if at least one node is not ignored.
	 */
	ignoreSelectors: string | Array<string>;

	/**
	 * @member FLITE.configuration
	 * @property {Array|String} opaqueSelectors
	 * Array of CSS selector strings. FLITE will ignore changes inside elements that match these selectors
	 */
	opaqueSelectors: string | Array<string>;

	/**
	 * @member FLITE.configuration
	 * @property {Array|String} deletableSelectors
	 * Array of CSS selector strings. Elements that match these selectors can be marked as deleted. 
	 * FLITE will add the selectors you provide to the default list, which is
	 * 
	 * <code>P,LI,H1,H2,H3,H4,H5,H6,DIV,IMG</code>
	 */
	deletableSelectors: string | Array<string>;


	/**
	 * Initial user to track with
	 */
	user: Partial<IFLITEUser> | string;

	users: Partial<IFLITEUser>[];

	/**
	 * @member FLITE.configuration
	 * @property {Boolean} acceptRejectInReadOnly
	 */
	acceptRejectInReadOnly: boolean;

	/**
	 * If true, move to next node after accept/reject a single change
	 */
	autoNext: boolean;

	/** 
	 * A string denoting the time zone in which all time stamps should be read and stored
	 * @member FLITE.configuration
	 * @property {String} timezone
	 */
	timezone: string;

	/** 
	 * A number denoting the number of seconds to add to a date, to make it the time in the plugin's timezone (configured in the timezone field)
	 * @member FLITE.configuration
	 * @property {String} timezone
	 */
	timezoneOffset: number;

	/**
	 * if `true`, the command to stop tracking will not require resolution of all changes
	 * if `false`, you can't toggle tracking off if there are pending changes.
	 * 
	 * 
	 * if a function, it is invoked with the plugin instance as a parameter, the return value is assumed to be a `promise`.
	 * If the promise resolves to `true` or `false`, then it is  treated like the prev values.
	 * 
	 * If the promise resolves to `"accept"` or `"reject"`, then the corresponding action is performed
	 * before the tracking is turned off.
	 * @member FLITE.configuration
	 * @property {Boolean | Function} allowQuitWithChanges=false
	 */
	allowQuitWithChanges: boolean | ((plugin: IFLITEPlugin) => Promise<Boolean | "accept" | "reject">);

	/**
	 * @member FLITE.configuration
	 * @property {Boolean/String} ignoreContainers
	 * If true, do not track block containers. If a string,
	 */
	ignoreContainers: string | Array<string> | boolean;

	/**
	 * @member FLITE.configuration
	 * @property {Boolean} removeDeleteOnPaste
	 * If true, FLITE will try to remove content tracked as deleted from the clipboard before pasting.
	 */
	removeDeleteOnPaste: boolean;

	/**
	 * @member FLITE.configuration
	 * @property {Number} [maxDocumentReadyWaitSeconds=1.0]
	 * FLITE initializes itself after the document is ready (either `document.readyState==="complete"` or upon the `DOMContentLoaded event).
	 * If you document doesn't load for a while, you may still want FLITE to go ahead with its initialization. Set this value to the max
	 * number of *seconds* that you'd like FLITE to wait before forcing init.
	 */
	maxDocumentReadyWaitSeconds: number;

	/**
	 * @member FLITE.configuration
	 * @property {Boolean} [preserveWhiteSpace=true]
	 * If true, FLITE will convert space sequences to interspersed &nbsp chars, when accepting changes
	 */
	preserveWhiteSpace: boolean;

	/**
	 * @member FLITE.configuration
	 * @property {String} [spellCheckerClasses=null]
	 * A collection of classes to add to the plugin's spell checker css selector
	 */
	spellCheckerClasses: string | string[];

	/**
	 * @member FLITE.configuration
	 * @property {Boolean} [trackApiInsert=true]
	 * A collection of classes to add to the plugin's spell checker css selector
	 */
	trackApiInsert: boolean;

	/**
	 * @member FLITE.configuration
	 * @property {Boolean} [showChangesWhenInactive=true]
	 * if `false`, hide tracking styles when not tracking
	 */
	showChangesWhenInactive: boolean;

	/**
	 * @member FLITE.configuration
	 * @property {Boolean} [trackSpellcheck=false]
	 * if `false`, hide tracking styles when not tracking
	 */
	trackSpellcheck: boolean;

	/**
	* @member FLITE.configuration
	* @property {Boolean} [handlePaste=true]
	* 
	*/
	handlePaste: boolean;

	/**
	 * @member FLITE.configuration
	 * @property {Boolean} [allowFindDeletedText=true]
	 * In supported editors (currently CKEditor and TinyMCE), `false` will direct FLITE to hide text marked for deletion
	 * when the user activates the Find/Replace dialog
	 */
	allowFindDeletedText: boolean;

	/**
	 * Determines how FLITE copies tracked data to the clipboard
	 * 
	 *
	 * - `clean` - Copy without trakcing markup and without deleted content
	 * - `raw` - Copy with all tracking markup
	 *
	 */
	copyBehavior: FLITECopyBehavior;

	/**
	 * Determines how FLITE manages sessions. This flag has three legal values:
	 * 
	 *
	 * - `always` (default) - Create a new session on each document reload/set content. In addition, sessions can be started through [api calls]({@link FLITEPlugin.startNewSession api calls} )
	 * - `manual` - Sessions are only started through [api calls]({@link FLITEPlugin.startNewSession api calls} )
	 * - `never` - Sessions are... well, never created.
	 *
	 */
	sessionPolicy?: FLITESessionPolicy;

	/**
	 * Determines how FLITE handles inserts when it is not tracking and the editor caret is inside a tracked range.
	 *
	 * - `"passive"` (default) - if the caret is inside a tracked range, FLITE will split the range so the editor performs the insert outside tracking markup
	 * - `"none"` - FLITE ignores inserts when not tracking
	 * - `"active"` - FLITE will insert a span element into which the editor will insert
	 * - `"insert"` - FLITE will split the tracked range and insert the content itself.
	 *
	 */
	readonlyInsertPolicy?: PassiveInsertMode;

	/**
	 * Commands in this array can be active when FLITE is not tracking or the editor is in readonly mode.
	 * 
	 * Defaults to no commands
	 * 
	 * Note that the show/hide changes commands are always active.
	 * 
	 * Example setting: ["flite-acceptall", "flite-rejectone"]
	 * 
	 * You can also pass the string '*' as shorthand for all the accept/reject commands
	 */
	nonTrackingCommands?: string | string[];

	/**
	 * If true, track list items converted from bullet -> number or vice versa as added
	 */
	trackListTypeChange?: boolean;

	/**
	 * By default, the FLITE commands are available, at least via the API, when tracking is off and/or when the document is
	 * in readonly mode. In this state, FLITE tries to keep user input outside tracked regions.
	 * 
	 * This behavior can be turned off by setting this options to ```false```.
	 */
	passiveTracking?: boolean;

	statusCallback?: FLITEStatusCallback;

	clipboardSupport?: boolean;

	/**
	 * Defaults to false
	 */
	preserveStyles?: boolean;

	/**
	 * Defaults to false
	 * "compact", "dom", "full", "export"
	 */
	attributePolicy?: AttributePolicy

	/**
	 * Defaults to false
	 */
	trackIME?: boolean;

	/**
	 * Defaults to false
	 */
	readonlyDelete?: boolean;

	/**
	 * Defaults to "none"
	 */
	imeMixedTrackingPolicy?: IMEMixedPolicy;

	orphanContainer?: FLITEOrphanPolicy;

	/**
	 * Some browser spellchecker honor the `spellcheck` attribute of the elements. If you want to prevent the browser from
	 * checking the spelling of some or all tracked text, set this option to `true`. If you want to prevent the browser from
	 * @since FLITE 1.6.25
	 * Allowed values:
	 * 
	 * - `false` - (default) - FLITE does not set the `spellcheck` attribute of tracked text
	 * - `true` - FLITE adds `spellcheck="false"` to tracked text
	 * - `"delete"`- FLITE adds `spellcheck="false"` to tracked deleted text
	 */
	disableSpellcheck?: boolean | "delete";

	/**
	 * If `true`, override configured user settings with those found in loaded documents.
	 * 
	 * Defaults to `false`
	 */
	useDocumentUserData?: boolean;

}

export type IEditorConfiguration<TEditorConfig = Record<string, any>> = {
	flite: Partial<IFLITEUserConfiguration>;
} & Partial<TEditorConfig>;

export namespace FLITEEvents {
	interface IFLITEEvent<TEditor extends {} = object> {
		readonly flite: IFLITEPlugin<TEditor>;
	}
	interface ITrackingEvent<TEditor extends {} = object> extends IFLITEEvent<TEditor> {
		tracking: boolean;
	}

	interface IAcceptRejectEvent<TEditor extends {} = object> extends IFLITEEvent<TEditor> {
		options?: any;
	}
}

export interface IFLITEEvents {
	/**
	 * @member FLITE.Events
	 * @event INIT
	 * @param {FLITE.FLITEPlugin} flite an instance of a flite object associated with an editor instance
	 */
	readonly INIT: "flite:init",
	/**
	 * @member FLITE.Events
	 * @event ACCEPT
	 * @param {FLITE.FLITEPlugin} flite an instance of a flite object associated with an editor instance
	 * @param {Object} options filtering options
	 */
	readonly ACCEPT: "flite:accept",
	/**
	 * @member FLITE.Events
	 * @event REJECT
	 * @param {FLITE.FLITEPlugin} flite an instance of a flite object associated with an editor instance
	 * @param {Object} options filtering options
	 */

	readonly REJECT: "flite:reject",
	/**
	 * @member FLITE.Events
	 * @event EVENT_INTERCEPTED
	 * @param {Event} event The event that was intercepted
	 */
	readonly EVENT_INTERCEPTED: "flite:event-intercepted",
	/**
	* @member FLITE.Events
	* @event SHOW_HIDE
	* @param {FLITE.FLITEPlugin} flite an instance of a flite object associated with an editor instance
	* @param {Boolean} show indicates the new change tracking show status
	*/
	readonly SHOW_HIDE: "flite:showHide",
	/**
	 * @member FLITE.Events
	 * @event TRACKING
	 * @param {FLITE.FLITEPlugin} flite an instance of a flite object associated with an editor instance
	 * @param {Boolean} tracking indicates the new tracking status
	 */
	readonly TRACKING: "flite:tracking",

	/**
	 * @member FLITE.Events
	 * @event CHANGE
	 * @param {FLITE.FLITEPlugin} flite an instance of a flite object associated with an editor instance
	 */
	readonly CHANGE: "flite:change",

	/**
	 * @member FLITE.Events
	 * @event USERS_ADDED
	 * @param {FLITE.FLITEPlugin} flite an instance of a flite object associated with an editor instance
	 * @param {FLITE.FLITEUser[]} users a copy of the added user object
	 */
	readonly USERS_ADDED: "flite:users-added",

	/**
	 * @member FLITE.Events
	 * @event USER_CHANGED
	 * @param {FLITE.FLITEPlugin} flite an instance of a flite object associated with an editor instance
	 * @param {FLITE.FLITEUser} user a copy of the changed user object
	 */
	readonly USER_CHANGED: "flite:user-changed",

	/**
	 * @member FLITE.Events
	 * @event USER_REMOVED
	 * @param {FLITE.FLITEPlugin} flite an instance of a flite object associated with an editor instance
	 * @param {FLITE.FLITEUser} user a copy of the changed user object
	 */
	readonly USER_REMOVED: "flite:user-removed",

	/**
	 * @member FLITE.Events
	 * @event DISABLE_TRACKING
	 * Fire this event through the editor, to pause this editor's tracker
	 */
	readonly DISABLE_TRACKING: "flite:disable-tracking",

	/**
	 * @member FLITE.Events
	 * @event ENABLE_TRACKING
	 * Fire this event through the editor, to resume this editor's tracker. It's the equivalent of 
	 */
	readonly ENABLE_TRACKING: "flite:enable-tracking",
}

export interface IFLITECommands extends Object {
	/**
	 * @member FLITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [TOGGLE_TRACKING="flite-toggletracking"]
	 */
	TOGGLE_TRACKING: "flite-toggletracking",
	/**
	 * @member FLITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [TOGGLE_SHOW="flite-toggleshow"]
	 */
	TOGGLE_SHOW: "flite-toggleshow",
	/**
	 * @member FLITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [ACCEPT_ALL="flite-acceptall"]
	 */
	ACCEPT_ALL: "flite-acceptall",
	/**
	 * @member FLITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [REJECT_ALL="flite-rejectall"]
	 */
	REJECT_ALL: "flite-rejectall",
	/**
	 * @member FLITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [ACCEPT_ONE="flite-acceptone"]
	 */
	ACCEPT_ONE: "flite-acceptone",
	/**
	 * @member FLITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [REJECT_ONE="flite-rejectone"]
	 */
	REJECT_ONE: "flite-rejectone",
	/**
	 * @member FLITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [TOGGLE_TOOLTIPS="flite-toggletooltips"]
	 */
	TOGGLE_TOOLTIPS: "flite-toggletooltips",
	/**
	 * @member FLITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [NEXT_CHANGE="flite-nextchange"]
	 * Place the editor's caret at the beginning of the closest tracked change AFTER the current cursor position
	 */
	NEXT_CHANGE: "flite-nextchange",
	/**
	 * @member FLITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [PREV_CHANGE="flite-prevchange"]
	 * Place the editor's caret at the beginning of the closest tracked change BEFORE the current cursor position
	 */
	PREV_CHANGE: "flite-prevchange"
}

export interface IFLITEAppGlobals extends ILoopIndexGlobals {
	readonly FLITE: IFLITEGlobals;
}
