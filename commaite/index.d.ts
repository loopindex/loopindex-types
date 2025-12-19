import type { IDisposable, IEvents } from "../common";
import type { IModalAlertManager } from "../common/alerts";

export type CommaiteTriggers = "paragraph" | "inline" | "sentence";
export type CommaiteEvents = "personas:change" | "personas:update" 
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

export interface ICommaiteConfiguration {
	readonly serverUrl: string;
	/**
	 * Defaults to all server personas
	 */
    readonly personas: IPersonaConfig[];
	readonly triggers: CommaiteTriggers[];
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

	readonly assetPath: string;
	/**
	 * If not null, the rest of the fields except `overrides` are ignored and the config
	 * is read from this url
	 */
	readonly configUrl?: string;


	/**
	 * Allows you to override settings in configUrl, meaningless otherwise
	 */
	readonly overrides?: Partial<Omit<ICommaiteConfiguration, "configUrl">>;

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

export interface ICommaitePlugin extends IDisposable {
	readonly events: IEvents<CommaiteEvents>;
	readonly serverUrl: string;
	readonly isMock: boolean;
	readonly alertManager: IModalAlertManager;
	createPersonaUI(optionss: IPersonaUIOptions): Promise<IPersonaUI>;
	getLocalizedString(key: string): string;
}

export interface ICommaiteInitEvent {
	readonly commaite: ICommaitePlugin;
}

