import { ILanceUser } from "..";
import type { ElementOrJQuery, IAutogrowOptions, IDisposable, IEvents, NodeOrJQuery, NodeOrSelector, Nullable } from "../../common/";
import type { IAnnotation, IAnnotationsManager, ICommentID } from "../annotations";

export type LanceUIType = "simple" | "aligned";
export interface ICreateAnnotationsUIOptions {
	readonly type: LanceUIType;
}

export interface ILanceUIEvents {
	/**
	 * "annotationui:created"
	 */
	readonly ANNOTATION_UI_CREATED: "annotationui:created",

	/**
	 * @member LANCE.AnnotationsUI
	 * @event ANNOTATION_UI_REMOVED
	 * 
	 * The ui of the specified annotation (thread) has been removed
	 * All parameters are enclosed in an Event object
	 * @param {Object} $node the annotationsui DOM node
	 * @param {String} id The id of the annotation
	 * @param {LANCE.AnnotationsUI} ui the containing ui
	 */
	readonly ANNOTATION_UI_REMOVED: "annotationui:removed",

	/**
	 * @member LANCE.AnnotationsUI
	 * @event ANNOTATION_UI_SELECTED
	 * 
	 * An annotation node has been selected or deselected.
	 * All parameters are enclosed in an Event object
	 * @param {Object} $node the annotationsui DOM node
	 * @param {LANCE.AnnotationsUI} ui the containing ui
	 * @param {String} id The id of the annotation
	 * @param {Boolean} isSelected the annotation id
	 */
	readonly ANNOTATION_UI_SELECTED: "annotationui:selected",

	/**
	 * @member LANCE.AnnotationsUI
	 * @event ANNOTATION_UI_CHANGED
	 * 
	 * An annotation node has been repopulated.
	 * All parameters are enclosed in an Event object
	 * @param {Object} $node the annotationsui DOM node
	 * @param {LANCE.AnnotationsUI} ui the containing ui
	 * @param {String} id The id of the annotation
	 */
	readonly ANNOTATION_UI_CHANGED: "annotationui:changed",

	/**
	 * @member LANCE.AnnotationsUI
	 * @event COMMENT_UI_CREATED
	 * 
	 * A comment node has been created and populated.
	 * All parameters are enclosed in an Event object
	 * @param {Object} $node the commentui DOM node
	 * @param {LANCE.AnnotationsUI} ui the containing ui
	 * @param {String} commentId The id of the comment
	 * @param {String} annotationId The id of the annotation
	 */
	readonly COMMENT_UI_CREATED: "commentui:created",

	/**
	 * @member LANCE.AnnotationsUI
	 * @event COMMENT_UI_CHANGED
	 * "commentui:changed"
	 * 
	 * The content of a comment node has changed.
	 * All parameters are enclosed in an Event object
	 * @param {Object} $node the commentui DOM node
	 * @param {LANCE.AnnotationsUI} ui the containing ui
	 * @param {String} commentId The id of the comment
	 * @param {String} annotationId The id of the annotation
	 */
	readonly COMMENT_UI_CHANGED: "commentui:changed",

	/**
	 * @member LANCE.AnnotationsUI
	 * @event COMMENT_UI_DONE
	 * "commentui:done"
	 * 
	 * done editing a comment
	 * All parameters are enclosed in an Event object
	 * @param {Object} $node the annotationsui DOM node
	 * @param {String} id The id of the annotation
	 * @param {LANCE.AnnotationsUI} ui the containing ui
	 */
	readonly COMMENT_UI_DONE: "commentui:done", // annotation: annotation id

	/**
	 * @member LANCE.AnnotationsUI
	 * @event COMMENT_UI_REMOVED
	 * 
	 * a comment node has been removed.
	 * All parameters are enclosed in an Event object
	 * @param {Object} $node the commentui DOM node
	 * @param {LANCE.AnnotationsUI} ui the containing ui
	 * @param {String} commentId The id of the comment
	 * @param {String} annotationId The id of the annotation
	 */
	readonly COMMENT_UI_REMOVED: "commentui:removed",

	/**
	 * @member LANCE.AnnotationsUI
	 * @event COMMENT_UI_BEFORE_COMMAND
	 * 
	 * a comment node has been removed.
	 * All parameters are enclosed in an Event object
	 * @param {String} command the commentui DOM node
	 * @param {Object} $node the commentui DOM node
	 * @param {LANCE.AnnotationsUI} ui the containing ui
	 * @param {String} commentId The id of the comment
	 * @param {String} annotationId The id of the annotation
	 * @param {Boolean} cancel set to false to prevent further command processing
	 */
	readonly COMMENT_UI_BEFORE_COMMAND: "commentui:before-command",

	/**
	 * @member LANCE.AnnotationsUI
	 * @event COMMENT_UI_AFTER_COMMAND
	 * "commentui:after-command"
	 * 
	 * a comment node has been removed.
	 * All parameters are enclosed in an Event object
	 * @param {String} command the commentui DOM node
	 * @param {Object} $node the commentui DOM node
	 * @param {LANCE.AnnotationsUI} ui the containing ui
	 * @param {String} commentId The id of the comment
	 * @param {String} annotationId The id of the annotation
	 */
	readonly COMMENT_UI_AFTER_COMMAND: "commentui:after-command";

	/**
	 * @member LANCE.AnnotationsUI
	 * @event COMMENT_UI_MENTION_ACTIVE
	 * 
	 * A @mention sequence is clicked.
	 * All parameters are enclosed in an Event object
	 * @param {IMentionedUser} user The mentioned user
	 * @param {string} annotationId The clicked thread id
	 * @param {string} commentId The clicked comment id
	 * See {@link LanceUIEvents.IMentionActiveEvent}
	 */
	COMMENT_UI_MENTION_ACTIVE: "commentui:mention:active";

}

export interface IStaticAnnotationsUI {
	readonly Events: Readonly<ILanceUIEvents>;
	readonly instances: ReadonlyArray<ILanceUI>;
}
export interface IToolbarCommandRecord {
	readonly command: string;
	readonly iconUrl?: string;
	readonly svgUrl?: string;
	readonly htmlData?: string;
	readonly svgData?: string;
	readonly title?: string;
	readonly label?: string;
	readonly classNames?: string | string[];
}

export interface IToolbarConfiguration {
	readonly buttons: ReadonlyArray<IToolbarButton>;
	readonly commands: ReadonlyArray<Pick<IToolbarCommandRecord, "command"> & Partial<IToolbarCommandRecord>>;
}

export interface IToolbarButton {
	readonly command: string;
	readonly display?: "auto" | "show"
}

export type OverflowPolicy = ("show" | "hide" | "fold" | "none");
export type BlurPolicy = ("save" | "discard");
export type ResolvedDisplayPolicy = ("show" | "hide" | "fold");

export type CommentStylingType = "mention" | "link";
/**
 * `"full"` - highlight only mentions of exact known user
 * `"prefix"` - highlight only mentions with a 3+ prefix of a known user name
 * `"any"` - highlight any mention
 */
export type MentionPolicy = "full" | "prefix";

export interface IMentionOptions {
	readonly policy: MentionPolicy;
	readonly usersOnly: boolean;
}

export interface IAnnotationUIOptions {
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
	readonly autoGrow: boolean | Partial<IAutogrowOptions>;
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
	/**
	 * Defaults to [ "link", "mention" ]
	 */
	readonly transformTypes: CommentStylingType[];
	readonly mention: IMentionOptions;
	readonly placeholderText: string;
	readonly resolvedDisplayPolicy: ResolvedDisplayPolicy;


}
export interface IUIConfirmOptions {
	readonly message: string;
	readonly annotation: IAnnotation;
	readonly commentId: string;
}
export type UIConfirmCallback = (options: IUIConfirmOptions) => Promise<boolean>;

export interface ILanceUI extends IDisposable {
	readonly events: IEvents;
	getCommentId(node: NodeOrJQuery): ICommentID;
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
	getOwner(): IAnnotationsManager | null;
			/**
		 * @member LANCE.AnnotationsUI
		 * @method localizeNode
		 * @readonly
		 * translates the marked placeholders in the text content and attributes of the node
		 * using the current owner's localizer.
		 */
	localizeNode(targetNode: ElementOrJQuery): void;
}

export interface IMentionedUser {
	/**
	 * If the mention references an existing users, this is the user's full name, otherwise
	 * it's the mentioned name without @
	 */
	readonly name: string;
	readonly user: Nullable<ILanceUser>;
	/**
	 * The full mention string, e.g. "@parker"
	 */
	readonly mention: string;
}
/**
 * These events are triggered through the UI's `events` member
 */

export namespace LanceUIEvents {

	interface ILanceUICreatedEvent {
		readonly ui: ILanceUI;
		readonly root: HTMLElement;
	}

	interface IAnnotationSelectedEvent {
		readonly isSelected: boolean;
		/**
		 * JQuery wrapper of the node that contains this annotation's view
		 */
		readonly $node: JQuery;
		readonly ui: ILanceUI;
		/**
		 * The id of the annotation whose view is de/selecetd
		 */
		readonly id: string;
	}

	/**
	 * Dispatched before (`"commentui:before-command"`) and after (`"commentui:after-command"`).
	 * set `cancel` to `true`  to cancel the command
	 */
	interface ICommandEvent {
		readonly command: string;
		readonly $node: Nullable<JQuery>;
		readonly ui: ILanceUI;
		readonly annotationId: string;
		readonly commentId: string;
		cancel: boolean;
		readonly manager: IAnnotationsManager;
	}

	/**
	 * Dispatched after a comment UI is created
	 */
	interface ICreatedEvent {
		readonly $node: JQuery;
		readonly ui: ILanceUI;
		readonly commentId: string;
		readonly annotationId: string;
	}

	interface IMentionAddEvent {
		readonly users: IMentionedUser[];
		readonly commentId: string;
		readonly annotationId: string;
		readonly ui: ILanceUI;
	}

	interface IMentionActiveEvent extends Omit<IMentionAddEvent, "users"> {
		readonly user: Nullable<IMentionedUser>;
	}
}



