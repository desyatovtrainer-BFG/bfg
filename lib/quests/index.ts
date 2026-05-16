/**
 * Барель модуля «ежедневные квесты» (MVP).
 *
 *   import { DAILY_QUESTS, completeDailyQuestAction } from "@/lib/quests";
 */

export {
  DAILY_QUESTS,
  DAILY_QUEST_ORDER,
  buildDailyQuestList,
  findDailyQuest,
  type DailyQuestTemplate,
} from "./daily-quests";

export {
  getTodayCompletedQuestIds,
  todayISO,
} from "./get-today-completions";

export {
  completeDailyQuestAction,
  type CompleteDailyQuestResponse,
} from "./actions";
