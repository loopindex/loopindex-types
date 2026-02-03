




export type NodeOrJQuery = Node | JQuery;
export type NodeOrSelector = NodeOrJQuery | string;
export type ElementOrJQuery = Element | JQuery;
export type NodePredicate<T = undefined> = (n: Node | null, ref?: T) => boolean;


export type BaseRangeInfo = Pick<Range, "startOffset" | "endOffset" | "startContainer" | "endContainer">;
export type RangeInfo = BaseRangeInfo & Pick<Range, "commonAncestorContainer">;


