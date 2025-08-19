export type AlertType = "error" | "warning" | "info";
export interface IAlertOptions {
	readonly text: string;
	readonly title?: string;
	readonly type?: AlertType;
	readonly timeoutMsecs?: number;
}

export interface IConfirmOptions extends IAlertOptions {
	readonly ok?: string;
	readonly cancel?: string;
}

export interface IPromptOptions extends IConfirmOptions {
	readonly defaultValue: string;
}


export interface IModalAlertMethods {
	alert(options: IAlertOptions): Promise<void>;
	confirm(options: IConfirmOptions): Promise<boolean>;
	prompt(options: IPromptOptions): Promise<string>;
}

export interface IModalAlertManager extends IModalAlertMethods {
	configure(methods: Partial<IModalAlertMethods>): void;
}
