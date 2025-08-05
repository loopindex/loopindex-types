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


### Updating the module

This module is updated at least once a month, so make sure that you update regularly:

    yarn upgrade loopindex-types

Or

    npm update loopindex-types


### Trouble shooting updates

`yarn` may fail to update the package, if the cached copy has been edited (usually by mistake). In this case,
removing the module from the cache will solve the problem. You can either clean completely:

    yarn cache clean

Or, if you read the details or the error message, you can see the location of the cached module and delete that folder.

