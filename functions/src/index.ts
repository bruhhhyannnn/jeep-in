// functions/src/index.ts
import { initializeApp } from "firebase-admin/app";
initializeApp();

export { createUserWithRoleFn } from "./createUserWithRole";
export { deleteUserCascadeFn } from "./deleteUserCascade";
