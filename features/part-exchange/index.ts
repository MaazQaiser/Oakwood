import type { PartExchange } from "@/types/deal";

export function createEmptyPartExchange(): PartExchange {
  return {
    id: "px-draft",
  };
}

export {
  applyPxToDealAction,
  getActiveDealForPx,
  getPxUiState,
  lookupPxRegistration,
  savePxSettlement,
  startPxSession,
  valuePxVehicle,
} from "./actions";
