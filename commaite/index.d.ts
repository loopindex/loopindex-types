import type { IDisposable, IEvents, ILoopIndexPlugin, IPluginConfig, IPluginUserConfig, KeyOf, PartialWith, PluginEvents } from "../common";
import type { IModalAlertManager } from "../common/alerts";

export type CommaiteTriggers = "paragraph" | "inline" | "sentence";
export type CommaiteEvents = PluginEvents | "personas:change" | "personas:update" 
	| "user:signin" | "user:signout" | "user:session"
	| "signin:on" | "signin:off";
export type PersonasUIEvents = "select" | "signin";
export type SuggestReplaceMode = "group" | "parts";
export type TrackGroupingPolicy = "single" | "group";

export interface ICredentials {
	readonly username: string;
	readonly password: string;
}

export interface IPersonaConfig {
	readonly name: string;
	readonly enabled: boolean;
	readonly active: boolean;
	readonly avatarUrl: string;
	readonly displayName: string;
	readonly description: string;
}

export interface ICommaiteLimits {
	readonly comment: number;
	readonly reaction: number;
	readonly paragraphSentences: number;
}

export interface ICommaiteUserConfiguration extends IPluginUserConfig {
	readonly serverUrl: string;
	/**
	 * Defaults to all server personas
	 */
    readonly personas: PartialWith<IPersonaConfig, "name">[];
	readonly triggers: CommaiteTriggers[];

	readonly limits: Partial<ICommaiteLimits>;
	/**
	 * Defaults to ???
	 */
	readonly inlineMarker: string;
	/**
	 * Defaults to false
	 */
	readonly mock: boolean;
	/**
	 * Defaults to `"group"`
	 */
	readonly suggestMode: SuggestReplaceMode;

	/**
	 * Defaults to "single"
	 */
	readonly groupTrackingMode: TrackGroupingPolicy;

	/**
	 * If not null, the rest of the fields except `overrides` are ignored and the config
	 * is read from this url
	 */
	readonly configUrl: string;


	/**
	 * Allows you to override settings in configUrl, meaningless otherwise
	 */
	readonly overrides: Partial<Omit<ICommaiteUserConfiguration, "configUrl" | "overrides">>;

	/**
	 * For debugging, leaves the suggestions UI onscreen after it has been applied
	 */
	readonly persistSuggestions: boolean;

	/**
	 * Ruleset to use in requests
	 */
	readonly ruleSet: string;
}

export type IEditorConfiguration<TEditorConfig = Record<string, unknown>> = {
	commaite: Partial<ICommaiteUserConfiguration>;
} & Partial<TEditorConfig>;


export interface ICommaiteConfiguration extends IPluginConfig {
	readonly serverUrl: string;
	/**
	 * Defaults to all server personas
	 */
    readonly personas: IPersonaConfig[];
	readonly triggers: CommaiteTriggers[];

	readonly limits: ICommaiteLimits;
	/**
	 * Defaults to ???
	 */
	readonly inlineMarker: string;
	/**
	 * Defaults to false
	 */
	readonly mock: boolean;
	/**
	 * Defaults to `"group"`
	 */
	readonly suggestMode: SuggestReplaceMode;

	/**
	 * Defaults to "single"
	 */
	readonly groupTrackingMode: TrackGroupingPolicy;

	/**
	 * If not null, the rest of the fields except `overrides` are ignored and the config
	 * is read from this url
	 */
	readonly configUrl?: string;


	/**
	 * Allows you to override settings in configUrl, meaningless otherwise
	 */
	readonly overrides: Partial<Omit<ICommaiteConfiguration, "configUrl" | "overrides">>;

	/**
	 * For debugging, leaves the suggestions UI onscreen after it has been applied
	 */
	readonly persistSuggestions: boolean;

	/**
	 * Ruleset to use in requests
	 */
	readonly ruleSet: string;
}

export interface IPersonaUI {
	readonly events: IEvents<PersonasUIEvents>;
	getSelectedPersonas(): string[];
	setTitleText(text: string): IPersonaUI;
	setTitleHtml(html: string): IPersonaUI;
	getCredentials(): ICredentials;
}

export interface IPersonaUIOptions {
	readonly container: HTMLElement;
	readonly title?: string;
	readonly styleUrls?: string | string[];
}

export interface ICommaiteCommands {
	/**
	 * @member COMMAITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [REACT_DOC="commaite-doc"]
	 */
	readonly REACT_DOC: "commaite-doc",
	/**
	 * @member COMMAITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [STATS="commaite-stats"]
	 */
	readonly STATS: "commaite-stats",
	/**
	 * @member COMMAITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [STATS="commaite-lookup"]
	 */
	readonly LOOKUP: "commaite-lookup",
	/**
	 * @member COMMAITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [USE_SUGGEST="commaite-use"]
	 */
	readonly USE_SUGGEST: "commaite-use",
	/**
	 * @member COMMAITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [REACT="commaite-react"]
	 */
	readonly COMMENT: "commaite-comment",
	/**
	 * @member COMMAITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [REACT="commaite-comment-para"]
	 */
	readonly COMMENT_PARA: "commaite-comment-para",
	/**
	 * @member COMMAITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [SIGNOUT="commaite-signout"]
	 */
	readonly SIGNOUT: "commaite-signout",

	/**
	 * @member COMMAITE.Commands
	 * @readonly
	 * @static
	 * @property {String} [ASK="commaite-ask"]
	 */
	readonly ASK: "commaite-ask",
}

export type CommaiteCommand = KeyOf<ICommaiteCommands>;

export interface ICommaitePlugin<
	TEditor extends {} = object,
	TConfig extends ICommaiteConfiguration = ICommaiteConfiguration
> extends ILoopIndexPlugin<TEditor, TConfig> {
	readonly serverUrl: string;
	readonly isMock: boolean;
	// readonly alertManager: IModalAlertManager;
	createPersonaUI(optionss: IPersonaUIOptions): Promise<IPersonaUI>;
}

export interface ICommaiteInitEvent {
	readonly commaite: ICommaitePlugin;
}

