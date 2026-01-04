import { schedule } from "node-cron";

import { updateScores } from "./update-scores";

export function registerCron() {
  schedule("0 4 * * *", updateScores, { timezone: "Europe/Rome" });
}
