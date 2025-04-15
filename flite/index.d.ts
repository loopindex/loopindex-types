import type { IPluginUserConfig, ILoopIndexUser, IUserManager, Nullable, FroalaModule } from "../common";


export interface IFLITEUser extends ILoopIndexUser {
    readonly style?: {
        common?: Record<string, string>;
        insert?: Record<string, string>;
        "delete"?: Record<string, string>;
    }
}

export interface IStatusCallbackOptions {
	readonly command: string;
	readonly plugin: IFLITEPlugin;
	readonly enabled: boolean;
	readonly active?: boolean;
	readonly user: ILoopIndexUser;
	readonly change: Nullable<ITrackedChange>;
}

export interface ITrackedChange {
	id: string;
	time: number;
	lastTime: number;
	sessionId?: string;
	userid: string;
	username: string;
	data: any;
}

export interface IChangeSet {
	count: number,
	changes: Record<string, ITrackedChange>;
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
}


export interface IFLITEPlugin<TEditor = unknown> {
	readonly editor: TEditor;
	readonly version: string;
	readonly users: IUserManager<IFLITEUser>;
	setUserInfo(idOrUser: string | Partial<ILoopIndexUser>): ILoopIndexUser;
	getUserInfo(): ILoopIndexUser;
	getChanges(options?: IChangeFilterOptions): IChangeSet;
	acceptAll(options?: IChangeFilterOptions): void;
	rejectAll(options?: IChangeFilterOptions): void;
	acceptOne(node: string | Node, options?: IChangeFilterOptions): void;
	acceptAll(node: string | Node, options?: IChangeFilterOptions): void;
	countChanges(options?: IChangeFilterOptions): number;
	
}

export interface IFLITEInitEvent {
	flite: IFLITEPlugin;
}


interface IFroalaCommandRecord {
	readonly command: string;
	readonly icon?: string;
	readonly tooltip?: string;
}


export interface IFLITEGlobals {
	initFroalaFLITEPlugin(Froala: FroalaModule, options: {
		path: string,
		assetPath?: string;
		commands?: IFroalaCommandRecord[];

	}): Promise<boolean>;
}

export interface IFLITEConfiguration extends IPluginUserConfig {
	user: Partial<IFLITEUser>;
	users: Partial<IFLITEUser>[];
}

export interface IEditorConfiguration {
    flite: Partial<IFLITEConfiguration>;
}


