import { ElementOrJQuery } from "../common";
import { IChangeFilterOptions, IChangeSet, IFLITEUser, ITrackedChange } from ".";
import type { IDisposable, Nullable } from "../common";

export interface ICleanDomOptions {
	/**
	 * if true, delete deleted elements
	 * */
	removeDeleted?: boolean;
}

export interface IBaseTrackingContext {
	readonly isTracking: boolean;
	readonly isInsert: boolean;
	readonly isDelete: boolean;
	readonly isCurrentUser: boolean;
	/**
	 * The tracking node found for the context
	 */
	readonly trackingNode: Nullable<Element>;
	readonly tracksContent: boolean;
}

export interface IAPITrackingContext extends IBaseTrackingContext {
	readonly change: Nullable<ITrackedChange>;
}



export interface IFLITEChangeTracker extends IDisposable {
	readonly rootElement: Element;


	/**
	 * 
	 * start/stop tracking DOM element
	 * @param {Boolean} start or stop tracking
	 * @param {Element} root The DOM element under which tracking will be performed. Not needed when
	 * setting start to false.
	 */
	toggleChangeTracking(bTrack: boolean, root: Element): IFLITEChangeTracker;

	getCleanDOM(container?: Nullable<Element | string>, options?: ICleanDomOptions): Element;

	getCurrentUser(): IFLITEUser;

	acceptChange(idOrNode: Node | string): boolean;
	rejectChange(idOrNode: Node | string): boolean;
	acceptAll(options?: Partial<IChangeFilterOptions>): void;
	rejectAll(options?: Partial<IChangeFilterOptions>): void;
	countChanges(options?: IChangeFilterOptions): number;
	/**
	 * Returns the change node that wraps the provided node
	 * @param node 
	 * @param nodeOnly if true, test only if the provided node is a change node
	 */
	getWrappingChangeNode(node: Nullable<Node>, nodeOnly?: boolean): Nullable<HTMLElement>;
	findNodeTrackingContext(node: Node, includeContainer?: boolean): IAPITrackingContext;
	getNodeChangeId(node: Nullable<Node>): Nullable<string>;
	getTrackedNodes(root?: ElementOrJQuery): JQuery;
	hasChanges(): boolean;
	setShowChanges(bShow: boolean): void;
	// getDeleteClass(): string;
	getChanges(options: IChangeFilterOptions): IChangeSet;
	/**
	 * Returns the currently selected DOM node
	 */
	getSelectedNode(): Nullable<Node>;

	/**
	 * Move to another tracked change node. Mode can be one of "next", "prev", "first", "last"
	 */
	navigateToChangeNode(mode: string): Element;

	/**
	 * Returns the change associated with a changed node
	 * @param node 
	 */
	getChangeForNode(node: Node): Nullable<ITrackedChange>;

	/**
	 * Returns the change associated with a changed node
	 * @param node 
	 */
	getChangeForId(id: string | null | undefined): Nullable<ITrackedChange>;
}