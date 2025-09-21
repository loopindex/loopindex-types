## loopindex-types

Typescript types for LoopIndex plugins

### To use this module

Add this depenency to your project's `package.json`

    "loopindex-types": "git+https://github.com/loopindex/loopindex-types.git"

Once the module is installed, you can import loopindex types from "loopindex-types", e.g.

```typescript
// Import some lance types
import type { ILanceAppGlobals, IAnnotationsManager, ILanceInitEvent, ILancePlugin } from "loopindex-types/lance";

// import some FLITE types
import type { IFLITEAppGlobals, IFLITEPlugin, FLITEEvents } from "loopindex-types/flite";

// import common types
import type { Nullable, Mutable, IEvents } from "loopindex-types";
```

### Compilation Errors

Your typescript source may fail to compile after importing some LoopIndex type declarations, due to
some unidentified `JQueryXXX` symbols. This happens when the `types` field is defined in your `tsconfig.json`.
In this case, please add `"jquery"` to the `types` array. No need to define or install the dependency - this is done inside
the `loopindex-types` module.

### Updating the module

This module is updated at least once a month, so make sure that you update regularly:

    yarn upgrade loopindex-types

Or

    npm update loopindex-types


### Troubleshooting updates

When installing projects that use `loopindex-types` as a dependency, `yarn` may fail to update the package, indicating a problem
with the locally cached copy. Two common reasons are a reset in the package's `master` branch, or an accidental
edit in the cached copy.

removing the module from the cache will solve the problem. You can either clean completely:

    yarn cache clean

Or, if you read the details or the error message, you can see the location of the cached module and delete that folder.

