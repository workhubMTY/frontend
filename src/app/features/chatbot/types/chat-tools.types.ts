export interface SpaceCarouselItem {
  id: number;
  name: string;
  capacity: number;
  floor: string;
  status: string;
}

export interface ShowSpaceCarouselArgs {
  spaces: SpaceCarouselItem[];
  context: string;
}

export interface ShowSpaceCarouselResult {
  selected_id: number | null;
}

export interface OpenParticipantPickerArgs {
  prompt: string;
  preselected_eids: string[];
}

export interface OpenParticipantPickerResult {
  participant_eids: string[];
}

export type ClientToolName = "showSpaceCarousel" | "openParticipantPicker";
