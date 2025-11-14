import { onCall } from "firebase-functions/v2/https";
import { createUserWithRole } from "./createUserWithRole";
import { deleteUserCascade } from "./deleteUserCascade";

// Export callable functions
export const createUserWithRoleFn = onCall(createUserWithRole);
export const deleteUserCascadeFn = onCall(deleteUserCascade);

// Keep old functions here too (if you still have them)
// export const createAccount = onCall(oldFunction);
// export const deleteAccount = onCall(oldDeleteFunction);
