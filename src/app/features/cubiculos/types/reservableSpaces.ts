// Display Name es calculable a partir del codigo y el nombre concatenados
// status label igual.

import { SpaceStatus } from "../data/types";

// timeline no necesita search
export type TimelineBlock = {
  id: string;
  start: string;
  end: string;
  status: SpaceStatus;
};
