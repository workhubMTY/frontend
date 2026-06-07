import type {
  ApiReservation,
  DayEvent,
  TimeBlock,
  TimelineEvent,
} from "../types/reservaciones";
import { timeValueToMinutes } from "./time";

export function blocksOverlap(firstBlock: TimeBlock, secondBlock: TimeBlock) {
  const firstStart = timeValueToMinutes(firstBlock.start);
  const firstEnd = timeValueToMinutes(firstBlock.end);
  const secondStart = timeValueToMinutes(secondBlock.start);
  const secondEnd = timeValueToMinutes(secondBlock.end);

  return firstStart < secondEnd && secondStart < firstEnd;
}

export function hasOverlappingBlocks(blocks: TimeBlock[]) {
  return blocks.some((block, blockIndex) =>
    blocks.some(
      (nextBlock, nextBlockIndex) =>
        blockIndex < nextBlockIndex && blocksOverlap(block, nextBlock),
    ),
  );
}

export function blockHasConflict(block: TimeBlock, blocks: TimeBlock[]) {
  return blocks.some(
    (nextBlock) => nextBlock.id !== block.id && blocksOverlap(block, nextBlock),
  );
}

export function blockOverlapsTimelineEvent(
  block: TimeBlock,
  event: TimelineEvent,
) {
  return blocksOverlap(block, {
    id: event.id,
    label: event.label,
    start: event.start,
    end: event.end,
  });
}

export function blockOverlapsApiReservation(
  block: TimeBlock,
  event: ApiReservation,
) {
  return blocksOverlap(block, {
    id: event.id,
    label: event.title,
    start: event.start,
    end: event.end,
  });
}

export function blockOverlapsDayEvent(block: TimeBlock, event: DayEvent) {
  return blocksOverlap(block, {
    id: event.id,
    label: event.title,
    start: event.start,
    end: event.end,
  });
}

export function getOverlapSegments(
  block: TimeBlock,
  blockers: Array<{ start: string; end: string }>,
) {
  const blockStart = timeValueToMinutes(block.start);
  const blockEnd = timeValueToMinutes(block.end);
  const blockDuration = Math.max(blockEnd - blockStart, 1);

  return blockers
    .map((blocker) => {
      const overlapStart = Math.max(
        blockStart,
        timeValueToMinutes(blocker.start),
      );
      const overlapEnd = Math.min(blockEnd, timeValueToMinutes(blocker.end));

      if (overlapStart >= overlapEnd) return null;

      return {
        left: `${((overlapStart - blockStart) / blockDuration) * 100}%`,
        width: `${((overlapEnd - overlapStart) / blockDuration) * 100}%`,
      };
    })
    .filter(Boolean) as Array<{ left: string; width: string }>;
}
