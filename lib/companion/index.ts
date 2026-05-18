/**
 * Память компаньона (MVP).
 *
 *   import { buildCompanionMessage } from "@/lib/companion";
 *
 * Внутри:
 *   - build-companion-message.ts — детерминированный построитель реплики
 *     по существующим данным профиля. Без LLM, без внешних API.
 */

export {
  buildCompanionMessage,
  type BuildCompanionMessageInput,
  type CompanionMessage,
  type CompanionState,
} from "./build-companion-message";
