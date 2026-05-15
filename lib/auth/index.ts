/**
 * Auth-слой BFG. Сюда позже приедут хелперы guard'ов, контекст и т.п.
 */
export { signInWithPassword, signOut, signUpWithPassword } from "./actions";
export type { AuthResult } from "./actions";
export { getCurrentUser } from "./get-user";
