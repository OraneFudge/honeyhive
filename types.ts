
export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum MapId {
  ENTRANCE = 'ENTRANCE',
  QUARTERS = 'QUARTERS',
  STORAGE = 'STORAGE',
  NURSERY = 'NURSERY',
  THRONE = 'THRONE',
  HIDDEN = 'HIDDEN',
  LABORATORY = 'LABORATORY',
  OBSERVATORY = 'OBSERVATORY',
  PROCESSING = 'PROCESSING',
  ARCHIVE = 'ARCHIVE',
}

export enum EntityType {
  PLAYER = 'PLAYER',
  WORKER_BEE = 'WORKER_BEE',
  SOLDIER_BEE = 'SOLDIER_BEE',
  HONEY_POOL = 'HONEY_POOL',
  FLOWER_SHRINE = 'FLOWER_SHRINE',
  MIRROR = 'MIRROR',
  LARVA = 'LARVA',
  QUEEN_GATE = 'QUEEN_GATE',
  ITEM_DROP = 'ITEM_DROP',
  PORTAL = 'PORTAL',
  NPC_OLD = 'NPC_OLD',
  DECORATION = 'DECORATION', // New type for visual props
}

export interface Entity {
  id: string;
  type: EntityType;
  x: number;
  y: number;
  interacted?: boolean;
  data?: any; // For custom data like portal target or item name or decor subtype
}

export interface Portal {
  x: number;
  y: number;
  targetMap: MapId;
  targetX: number;
  targetY: number;
}

export interface DialogueOption {
  text: string;
  effect: 'conform' | 'rebel' | 'neutral' | 'get_item';
  item?: string;
  nextId: string | null; // null ends dialogue
}

export interface DialogueNode {
  id: string;
  text: string;
  speaker: string;
  image?: string; // Optional image key
  options: DialogueOption[];
}

export enum GameState {
  TITLE = 'TITLE',
  PLAYING = 'PLAYING',
  DIALOGUE = 'DIALOGUE',
  ENDING = 'ENDING',
  GAME_OVER = 'GAME_OVER',
  BOSS_FIGHT = 'BOSS_FIGHT',
}

export enum EndingType {
  CONSUMED = 'CONSUMED',
  DRONE = 'DRONE',
  ROYAL_JELLY = 'ROYAL_JELLY',
  EXILE = 'EXILE',
  MADNESS = 'MADNESS',
  REVOLUTION = 'REVOLUTION',
  MEMORIES = 'MEMORIES',
  SABOTAGE = 'SABOTAGE',
  ASCENSION = 'ASCENSION',
  GHOST = 'GHOST',
  PANOPTICON = 'PANOPTICON',
  EXECUTED = 'EXECUTED',
  IMPRISONED = 'IMPRISONED'
}
