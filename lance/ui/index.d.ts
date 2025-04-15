import type { IEvents, NodeOrSelector, Nullable } from "../../common/";
import type { IAnnotation, IAnnotationsManager, IComment } from "../annotations";


export interface ICreateAnnotationsUIOptions {
	readonly type: "simple" | "aligned";
}

export declare interface IToolbarCommandRecord {
	command: string;
	iconUrl?: string;
	svgUrl?: string;
	svgData?: string;
	title?: string;
	label?: string;
}

export declare interface IToolbarConfiguration {
	buttons: Array<IToolbarButton>;
	commands: Array<IToolbarCommandRecord>;
}

export declare interface IToolbarButton {
	command: string;
	display?: "auto" | "show"
}

export declare type OverflowPolicy = ("show" | "hide" | "fold" | "none");
export declare type BlurPolicy = ( "save" | "discard");
export declare interface IUIGeneratorOptions {
	// owner: IAnnotationsManager;
	generate: boolean;
	generateCSS: boolean;
	commentTemplate?: NodeOrSelector;
	// styleUrls: Array<string>;
	toolbar: IToolbarConfiguration;
	overflow: OverflowPolicy;
	templateClasses: string;
}

export declare interface IAnnotationUIOptions {
	readonly container: NodeOrSelector;
	readonly owner: IAnnotationsManager;
	readonly commentTimeFormat?: string;
	readonly toolbar: Partial<IToolbarConfiguration>;
	readonly generateUI: boolean;
	readonly styleUrls?: Array<string>;
	readonly generateCSS: boolean;
	// readonly threadTemplate: NodeOrSelector;
	readonly commentTemplate: NodeOrSelector;
	readonly templateClass: string;
	readonly autoGrow: boolean | object;
	readonly autoScroll: boolean;
	readonly searchComments: boolean;
	readonly textareaOptions: any;
	readonly verticalMargin: number;
	readonly autoUpdate?: boolean;
	readonly alignCommentsToEditor?: boolean;
	/**
	 * @member LANCE.IAnnotationUIOptions
	 * Before validation, should be just the theme names
	 * After validation, contains the paths to the theme files or empty
	 */
	readonly theme: string[];

	readonly overflowPolicy: OverflowPolicy;
	readonly blurPolicy: BlurPolicy;
}

export type AnnotationViewOrId = IOneAnnotationView | string;

export interface IUIConfirmOptions {
	message: string;
	annotation: IAnnotation;
	commentId: string;
}
export type UIConfirmCallback = (options: IUIConfirmOptions) => Promise<boolean>;

export interface ILanceUI {
	readonly events: IEvents;
	// getCommentId(node: Element | JQuery): ICommentID;
	setSearchTerm(term: string): void;
	init(options: Pick<IAnnotationUIOptions, "owner" | "container"> & Partial<IAnnotationUIOptions>): Promise<boolean>;
	setConfirmCallback(callback: UIConfirmCallback): void;
	setCommentTimeFormat(format: string): void;
	/**
	 * 
	 * @param owner 
	 * @param options if options.load !== false, the annotations will be reloaded 
	 */
	setOwner(owner: IAnnotationsManager | null, options?: { load: boolean }): void;
}

export interface IViewSaveTextOptions {
	readonly view: IBaseView;
	readonly save: boolean 
	readonly event?: Event;
}
export type ViewTextHandler = (options: IViewSaveTextOptions) => any;

interface IBaseView {
	readonly id: string;
	readonly $ui: JQuery;
	setTextHandler(handler: ViewTextHandler): void;
}

export declare interface ICommentView extends IBaseView {
	readonly annotationId: string;
	readonly isSelected: boolean;
	readonly parent: IOneAnnotationView;
	// readonly $commentText: JQuery;
	readonly isEditing: boolean;
	/**
	 * If true, will turn reply off
	 * @param isEditing 
	 */
	setEditing(isEditing: boolean): ICommentView;
	setEditCommands(options: { ok: string, cancel: string }): ICommentView;
	hasEditedComment(): boolean;
	// hasEditedReply(): boolean;
	setSelected(selected: boolean): ICommentView;
	refresh(): ICommentView;
	getCommentText(): string;
	setCommentText(text: string): ICommentView;
}

export declare interface IOneAnnotationView extends IBaseView {
	readonly $wrapper: JQuery;
	readonly $reply: JQuery;
	/**
	 * Guaranteed not null
	 */
	readonly commentViews: ICommentView[];
	readonly isSelected: boolean;
	/**
	 * True if the view is in collapsed state and has expand override
	 */
	readonly isExpanded: boolean;
	readonly isCollapsed: boolean;
	readonly isVisible: boolean;
	readonly annotation: IAnnotation;
	readonly filteredCount: number;
	// readonly $reply: JQuery;
	readonly isReplying: boolean;

	countViews(): number;
	setReplying(isReplying: boolean): IOneAnnotationView;
	getReplyText(): string
	setReplyText(text: string): IOneAnnotationView;
	setPlaceholder(text: string): IOneAnnotationView;
	getEditedComment(): Nullable<ICommentView>;
	setFilterLabel(label: string): IOneAnnotationView;
	// setSelected(isSelected: boolean): IOneAnnotationView;
	getCommentUI(commentId: string): ICommentView | null;
	setExpanded(expanded: boolean): IOneAnnotationView;
	setResolved(resolved: boolean): IOneAnnotationView;
	setVisible(resolved: boolean): IOneAnnotationView;
	// setCollapsed(collapsed: boolean): IAnnotationView;
	setExpandedCallback(callback: Nullable<(isOpen: boolean) => void>): IOneAnnotationView;

	setCommentFiltered(commentId: string, isFiltered: boolean): IOneAnnotationView;

	refresh(): IOneAnnotationView;
	addComment(comment: IComment): ICommentView;
	alignTip(deltaY: number): void;
	/**
 * If true, this will create a spacer div after the element, to compensate
 * for moving it to absolute positioning
 * @param needsSpacer 
 */
	setSpacer(needsSpacer: boolean): IOneAnnotationView;
	clear(): IOneAnnotationView;
	height(): number;
}

