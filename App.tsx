import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    Direction, EntityType, GameState, Entity, EndingType, DialogueNode, MapId 
} from './types';
import { 
    GRID_SIZE, CELL_SIZE, MAPS, 
    CitrusHeadSVG, WorkerBeeSVG, SoldierBeeSVG, HoneyPoolSVG, 
    OldBeeSVG, QueenGateSVG, WallEyeSVG, HexTileSVG,
    GearDecor, TVDecor, EyePlantDecor, IVDripDecor, TrafficLightDecor, HoneyDripDecor,
    LarvaSVG, MirrorSVG,
    ITEM_DESCRIPTIONS, ItemIconSVG, CollagePatterns
} from './constants';
import { getDialogue, getSubNode, getEndingNode } from './services/dialogueService';
import { playSound as _playSound, getCtx, startBGM, stopBGM, setBgmCorruption } from './services/audioService';
import { 
    PanopticonBackground, PostProcessingLayer, DialogueBox, EndingScreen, SurrealOverlay, FogLayer
} from './components/CollageElements';
import { IntroModal } from './components/IntroModal';
import { BossFight } from './components/BossFight';
import { BookOpen } from 'lucide-react';

const MAX_HP = 100;
const MAX_REBEL = 100;

// --- Ambient Audio Hook ---
const MAP_NAMES: Record<MapId, string> = {
  [MapId.ENTRANCE]: '入口',
  [MapId.QUARTERS]: '工蜂宿舍',
  [MapId.STORAGE]: '储藏室',
  [MapId.NURSERY]: '育婴室',
  [MapId.THRONE]: '王座厅',
  [MapId.HIDDEN]: '隐藏房间',
  [MapId.LABORATORY]: '实验室',
  [MapId.OBSERVATORY]: '观察室',
  [MapId.PROCESSING]: '处理中心',
  [MapId.ARCHIVE]: '档案室'
};

export default function App() {
  // --- State ---
  const [gameState, setGameState] = useState<GameState>(GameState.TITLE);
  const [endingType, setEndingType] = useState<EndingType>(EndingType.DRONE);
  const [showIntro, setShowIntro] = useState(false);

  const [unlockedLore, setUnlockedLore] = useState<string[]>([]);
  const [loreToast, setLoreToast] = useState<string | null>(null);
  const [toastQueue, setToastQueue] = useState<string[]>([]);
  const notifiedLore = useRef(new Set<string>());

  const unlockLore = useCallback((key: string, title: string) => {
      setUnlockedLore(prev => {
          if (!prev.includes(key)) {
               return [...prev, key];
          }
          return prev;
      });
      if (!notifiedLore.current.has(key)) {
          notifiedLore.current.add(key);
          setToastQueue(prev => [...prev, `指南已记录: ${title}`]);
      }
  }, []);

  useEffect(() => {
      if (toastQueue.length > 0 && !loreToast) {
          const nextToast = toastQueue[0];
          setLoreToast(nextToast);
          setToastQueue(prev => prev.slice(1));
      }
  }, [toastQueue, loreToast]);

  useEffect(() => {
      if (loreToast) {
          const timer = setTimeout(() => {
              setLoreToast(null);
          }, 2000);
          return () => clearTimeout(timer);
      }
  }, [loreToast]);
  
  // Map State
  const [currentMapId, setCurrentMapId] = useState<MapId>(MapId.ENTRANCE);
  const [map, setMap] = useState<number[][]>(MAPS[MapId.ENTRANCE].layout);
  const [entities, setEntities] = useState<Entity[]>(MAPS[MapId.ENTRANCE].entities);
  
  const [player, setPlayer] = useState({ x: 6, y: 6, dir: Direction.DOWN });
  
  // Stats
  const [hp, setHp] = useState(MAX_HP); // Conformity/Sanity
  const [rebel, setRebel] = useState(0); // Dissonance
  
  const terrorRatio = rebel / MAX_REBEL; 
  const hpRatio = hp / MAX_HP;
  const corruptionLevel = (terrorRatio * 0.7) + ((1 - hpRatio) * 0.3);

  const playSound = useCallback((type: Parameters<typeof _playSound>[0]) => {
      _playSound(type, corruptionLevel);
  }, [corruptionLevel]);

  const [visited, setVisited] = useState<Record<string, number>>({});
  const [lastMoveTime, setLastMoveTime] = useState<number>(0);
  const [items, setItems] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  useEffect(() => {
      setBgmCorruption(corruptionLevel);
  }, [corruptionLevel]);

  useEffect(() => {
      if (gameState === GameState.PLAYING) {
          startBGM();
      } else if (gameState === GameState.TITLE || gameState === GameState.GAME_OVER) {
          stopBGM();
      }
  }, [gameState]);

  // Dialogue
  const [currentDialogue, setCurrentDialogue] = useState<DialogueNode | null>(null);
  const [typingText, setTypingText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  
  // Visuals
  const [shake, setShake] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [bumpEffect, setBumpEffect] = useState<{x: number, y: number, id: number} | null>(null);
  
  // Random wall eyes seed
  const [wallEyes, setWallEyes] = useState<Record<string, boolean>>({});
  const [floorEyes, setFloorEyes] = useState<Record<string, boolean>>({});

  // Simple seeded random number generator
  const seededRandom = (s: number) => {
      let x = Math.sin(s) * 10000;
      return x - Math.floor(x);
  };

  const generateMapData = useCallback((mapId: MapId, startX: number, startY: number, currentItems: string[]) => {
      const baseLayout = MAPS[mapId].layout.map(row => [...row]);
      const baseEntities = [...MAPS[mapId].entities];
      const newWallEyes: Record<string, boolean> = {};
      const newFloorEyes: Record<string, boolean> = {};

      // Use a seed based on the map string to keep the random generation consistent per map
      let seed = 0;
      for (let i = 0; i < mapId.length; i++) {
          seed += mapId.charCodeAt(i);
      }

      // Vary probabilities based on mapId
      const decorProb = 0.85 + (seed % 10) * 0.01; // 0.85 to 0.95
      const entityProb = 0.75 + (seed % 15) * 0.01; // 0.75 to 0.90
      const eyeProb = 0.65 + (seed % 20) * 0.01; // 0.65 to 0.85
      const floorEyeProb = 0.80 + (seed % 15) * 0.01; // 0.80 to 0.95

      // Generate random decor (2) and wallEyes on walls (1)
      for (let y = 0; y < GRID_SIZE; y++) {
          for (let x = 0; x < GRID_SIZE; x++) {
              if (baseLayout[y][x] === 1) {
                  // Place eyes on walls
                  const rand = seededRandom(seed++);
                  if (rand > eyeProb) {
                      newWallEyes[`${x},${y}`] = true;
                  }
              } else if (baseLayout[y][x] === 0) {
                  // Don't place decor on the start position or portals
                  const isStart = x === startX && y === startY;
                  const isPortal = MAPS[mapId].portals.some(p => p.x === x && p.y === y);
                  const hasEntity = baseEntities.some(e => e.x === x && e.y === y);
                  
                  const randEye = seededRandom(seed++);
                  if (randEye > floorEyeProb && !isStart && !isPortal) {
                      newFloorEyes[`${x},${y}`] = true;
                  }

                  if (!isStart && !isPortal && !hasEntity) {
                      const rand = seededRandom(seed++);
                      if (rand > decorProb) {
                          baseLayout[y][x] = 2; // Floor decor tile
                      } else if (rand > entityProb) {
                          // Add a random entity decoration
                          const subtypes = ['gear', 'tv', 'eyeplant', 'iv', 'traffic', 'honeydrip'];
                          const subtype = subtypes[Math.floor(seededRandom(seed++) * subtypes.length)];
                          baseEntities.push({
                              id: `decor_${x}_${y}`,
                              type: EntityType.DECORATION,
                              x, y,
                              data: { subtype }
                          });
                      }
                  }
              }
          }
      }

      // Filter out collected items from entities
      const filteredEntities = baseEntities.filter(e => {
          if (e.type === EntityType.ITEM_DROP && e.data?.name) {
              return !currentItems.includes(e.data.name);
          }
          return true;
      });

      return { layout: baseLayout, entities: filteredEntities, wallEyes: newWallEyes, floorEyes: newFloorEyes };
  }, []);

  // Initialize first map
  useEffect(() => {
      const { layout, entities: newEntities, wallEyes: newWallEyes, floorEyes: newFloorEyes } = generateMapData(MapId.ENTRANCE, 6, 6, []);
      setMap(layout);
      setEntities(newEntities);
      setWallEyes(newWallEyes);
      setFloorEyes(newFloorEyes);
  }, [generateMapData]);

  // --- Helpers ---
  const getEntityAt = (x: number, y: number) => entities.find(e => e.x === x && e.y === y);
  
  const isWalkable = (x: number, y: number) => {
      if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) return false;
      // Map wall check
      if (map[y][x] === 1) return false;
      
      return true;
  };
  
  const hasItem = (name: string) => items.includes(name);

  const useItem = (name: string) => {
      if (name === '发条心脏') {
          setHp(Math.min(MAX_HP, hp + 40));
          setRebel(Math.max(0, rebel - 5)); // Consuming clockwork heart makes you more compliant
          setItems(prev => {
              const idx = prev.indexOf(name);
              if (idx > -1) {
                  const next = [...prev];
                  next.splice(idx, 1);
                  return next;
              }
              return prev;
          });
          playSound('select');
      } else if (name === '镇静剂') {
          setHp(Math.min(MAX_HP, hp + 20));
          setRebel(Math.max(0, rebel - 30)); // Stronger compliance effect
          setItems(prev => {
              const idx = prev.indexOf(name);
              if (idx > -1) {
                  const next = [...prev];
                  next.splice(idx, 1);
                  return next;
              }
              return prev;
          });
          playSound('select');
      } else if (name === '违禁记录') {
          setRebel(Math.min(MAX_REBEL, rebel + 15));
          setShake(15);
          setTimeout(() => setShake(0), 500);
          playSound('horror');
      } else if (name === '记忆碎片') {
          setRebel(Math.min(MAX_REBEL, rebel + 5));
          playSound('select');
          setShake(8);
          setTimeout(() => setShake(0), 300);
      } else if (name === '死蜂徽章') {
          // Using the badge makes you feel the weight of the numbers
          setShake(3);
          setTimeout(() => setShake(0), 200);
          playSound('select');
      } else if (name === '干枯的花朵') {
          // The scent of the outside world
          setHp(Math.min(MAX_HP, hp + 5));
          setRebel(Math.min(MAX_REBEL, rebel + 2));
          playSound('select');
      } else if (name === '纯净的蜂王浆') {
          setHp(MAX_HP);
          setRebel(0); // Complete compliance
          setItems(prev => {
              const idx = prev.indexOf(name);
              if (idx > -1) {
                  const next = [...prev];
                  next.splice(idx, 1);
                  return next;
              }
              return prev;
          });
          playSound('select');
      } else if (name === '监控录像') {
          setRebel(Math.min(MAX_REBEL, rebel + 25));
          setShake(25);
          setTimeout(() => setShake(0), 800);
          playSound('horror');
      } else if (name === '全景监狱蓝图') {
          setRebel(Math.min(MAX_REBEL, rebel + 20));
          setShake(10);
          setTimeout(() => setShake(0), 400);
          playSound('select');
      } else if (name === '破碎的皇冠') {
          setShake(20);
          setTimeout(() => setShake(0), 600);
          playSound('horror');
      } else {
          // Key items don't get consumed but play a sound
          playSound('select');
      }
  };

  // --- Reset Game ---
  const resetGame = () => {
      setHp(MAX_HP);
      setRebel(0);
      setItems([]);
      setVisited({});
      
      // Reset Map
      setCurrentMapId(MapId.ENTRANCE);
      const { layout, entities: newEntities, wallEyes: newWallEyes, floorEyes: newFloorEyes } = generateMapData(MapId.ENTRANCE, 6, 6, []);
      setMap(layout);
      setEntities(newEntities);
      setWallEyes(newWallEyes);
      setFloorEyes(newFloorEyes);
      
      // Reset Player
      setPlayer({ x: 6, y: 6, dir: Direction.DOWN });
      
      // Reset System
      setCurrentDialogue(null);
      setGameState(GameState.TITLE);
  };

  // --- Map Switching ---
  const loadMap = (mapId: MapId, startX: number, startY: number) => {
      setTransitioning(true);
      playSound('move'); // Reuse move sound for transition
      
      setTimeout(() => {
          setCurrentMapId(mapId);
          const { layout, entities: newEntities, wallEyes: newWallEyes, floorEyes: newFloorEyes } = generateMapData(mapId, startX, startY, items);
          setMap(layout);
          setEntities(newEntities);
          setWallEyes(newWallEyes);
          setFloorEyes(newFloorEyes);
          
          setPlayer(p => ({ ...p, x: startX, y: startY }));
          setTransitioning(false);
      }, 500);
  };

  // --- Game Mechanics ---

  // --- Dialogue System ---
  
  const triggerEnding = (type: EndingType) => {
      setEndingType(type);
      setGameState(GameState.ENDING);
      const node = getEndingNode(type);
      setCurrentDialogue(node);
      setTypingText('');
      setTypingIndex(0);
      playSound('horror');
  };

  const evaluateEnding = () => {
      // 1. TRUE ENDING (Revolution): Needs all three key items
      if (hasItem('干枯的花朵') && hasItem('记忆碎片') && hasItem('破碎的皇冠')) {
          triggerEnding(EndingType.REVOLUTION);
          return;
      }

      // 2. ASCENSION: High Rebel + Memory + Records
      if (rebel > 85 && hasItem('记忆碎片') && hasItem('违禁记录')) {
          triggerEnding(EndingType.ASCENSION);
          return;
      }

      // 3. GHOST: Has Badge + Low Rebel
      if (hasItem('死蜂徽章') && rebel < 30) {
          triggerEnding(EndingType.GHOST);
          return;
      }

      // 4. SABOTAGE: Has Records + Mid Rebel
      if (hasItem('违禁记录') && rebel > 50) {
          triggerEnding(EndingType.SABOTAGE);
          return;
      }

      // 4. REVOLUTION ENDING: Needs Crown + High Rebel
      if (hasItem('破碎的皇冠') && rebel > 75) {
          triggerEnding(EndingType.REVOLUTION);
          return;
      }

      // 5. EXILE ENDING: High Rebel or Flower
      if (rebel > 60 || hasItem('干枯的花朵')) {
          triggerEnding(EndingType.EXILE);
          return;
      }

      // 6. MADNESS ENDING: Very high rebel but no items
      if (rebel > 90) {
          triggerEnding(EndingType.MADNESS);
          return;
      }

      // 7. CONFORM ENDINGS: High HP, Low Rebel
      if (hp > 80 && rebel < 20) {
          triggerEnding(EndingType.DRONE);
          return;
      }

      // 8. ROYAL JELLY: Mid-range
      if (hp > 50) {
          triggerEnding(EndingType.ROYAL_JELLY);
          return;
      }

      // 9. CONSUMED: Default/Low HP
      triggerEnding(EndingType.CONSUMED);
  };

  const handleDialogueOption = (opt: { text: string, effect: string, item?: string, nextId: string | null }) => {
      // Effects
      if (opt.effect === 'conform') {
          setHp(Math.min(MAX_HP, hp + 10));
          setRebel(Math.max(0, rebel - 5));
          playSound('select');
      } else if (opt.effect === 'rebel') {
          setHp(Math.max(0, hp - 15));
          setRebel(Math.min(MAX_REBEL, rebel + 15));
          playSound('horror');
          setShake(10);
          setTimeout(() => setShake(0), 500);
      } else if (opt.effect === 'get_item' && opt.item) {
          setItems(prev => [...prev, opt.item!]);
          // Remove item from world visually immediately
          setEntities(prev => prev.filter(e => !(e.type === EntityType.ITEM_DROP && e.data?.name === opt.item)));
          playSound('select');
      } else if (opt.effect === 'execute_ending') {
          triggerEnding(EndingType.EXECUTED);
          return;
      } else if (opt.effect === 'imprison_ending') {
          triggerEnding(EndingType.IMPRISONED);
          return;
      } else if (opt.effect === 'bluff_success') {
          setRebel(Math.max(0, rebel - 20)); // Reduce rebel so they don't get caught again immediately
          playSound('select');
      } else if (opt.effect === 'teleport_hidden') {
          loadMap(MapId.HIDDEN, 6, 10);
          playSound('horror');
      } else {
          playSound('select');
      }

      // Consume item if specified in option
      if (opt.item && opt.effect !== 'get_item') {
          setItems(prev => {
              const idx = prev.indexOf(opt.item!);
              if (idx > -1) {
                  const next = [...prev];
                  next.splice(idx, 1);
                  return next;
              }
              return prev;
          });
      }

      // Check Endings (Death/Madness automatic)
      if (hp <= 0 && gameState !== GameState.ENDING) {
          triggerEnding(EndingType.CONSUMED);
          return;
      }
      if (rebel >= 95 && Math.random() > 0.9 && gameState !== GameState.ENDING) {
           triggerEnding(EndingType.MADNESS);
           return;
      }

      if (opt.nextId) {
          if (opt.nextId === 'end_check_final') {
              evaluateEnding();
          } else if (opt.nextId === 'end_sabotage') {
              triggerEnding(EndingType.SABOTAGE);
          } else if (opt.nextId === 'end_ascension') {
              triggerEnding(EndingType.ASCENSION);
          } else if (opt.nextId === 'end_panopticon') {
              triggerEnding(EndingType.PANOPTICON);
          } else if (opt.nextId === 'end_memories') {
              triggerEnding(EndingType.MEMORIES);
          } else {
              const nextNode = getSubNode(opt.nextId, { hp, rebel }, hasItem);
              if (nextNode) {
                  setCurrentDialogue(nextNode);
                  setTypingText('');
                  setTypingIndex(0);
              } else {
                  setGameState(GameState.PLAYING);
                  setCurrentDialogue(null);
              }
          }
      } else {
          // End of dialogue
          if (gameState === GameState.ENDING) {
              setGameState(GameState.GAME_OVER);
              setCurrentDialogue(null);
          } else {
              setGameState(GameState.PLAYING);
              setCurrentDialogue(null);
          }
      }
  };

  const startDialogue = (type: EntityType, id: string) => {
      // Trigger lore unlocks based on entity type/id
      if (type === EntityType.WORKER_BEE) {
          unlockLore("worker", "工蜂：盲目的齿轮");
          if (id === 'worker_sleeping') unlockLore("worker_sleeping", "工蜂：沉睡者");
          else if (id === 'glutton_bee') unlockLore("worker_glutton", "工蜂：暴食者");
          else if (id === 'nurse_bee') unlockLore("worker_nurse", "工蜂：监护者");
          else if (id.startsWith('proc_worker')) unlockLore("worker_proc", "工蜂：处理员");
          else if (id === 'obs_worker') unlockLore("worker_record", "工蜂：记录员");
          else if (id === 'lab_scientist') unlockLore("worker_scientist", "工蜂：研究员");
      }
      else if (type === EntityType.SOLDIER_BEE) {
          unlockLore("soldier", "兵蜂：暴力的具象");
          if (id === 'guard_entry' || id === 'obs_guard') unlockLore("soldier_guard", "兵蜂：看守");
          else if (id.startsWith('guard_royal')) unlockLore("soldier_royal", "兵蜂：皇家守卫");
      }
      else if (type === EntityType.NPC_OLD) {
          unlockLore("oldbee", "被遗忘者：历史的残骸");
          if (id === 'npc_old_bee') unlockLore("oldbee_forgotten", "被遗忘者");
          else if (id === 'archivist') unlockLore("oldbee_archivist", "档案管理员");
      }
      else if (type === EntityType.LARVA) unlockLore("larva", "幼虫：尚未成型");
      else if (type === EntityType.MIRROR) unlockLore("citrus", "柑橘与腐烂");
      
      if (type === EntityType.QUEEN_GATE || id === 'item_blueprint' || id === 'obs_guard' || id === 'obs_worker') {
          unlockLore("panopticon", "全景视野");
      }
      
      if (type === EntityType.QUEEN_GATE && (rebel > 80 || hasItem('破碎的皇冠'))) {
          setGameState(GameState.BOSS_FIGHT);
          playSound('horror');
          return;
      }

      const node = getDialogue(type, id, visited, { hp, rebel }, hasItem);
      setGameState(GameState.DIALOGUE);
      setCurrentDialogue(node);
      setTypingText('');
      setTypingIndex(0);
      playSound('select');
      
      // Mark as visited (increment count)
      setVisited(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleInteraction = useCallback(() => {
    if (gameState !== GameState.PLAYING) {
        if ((gameState === GameState.DIALOGUE || gameState === GameState.ENDING) && currentDialogue) {
             if (typingIndex < currentDialogue.text.length) {
                 setTypingIndex(currentDialogue.text.length);
                 setTypingText(currentDialogue.text);
             } else if (!currentDialogue.options || currentDialogue.options.length === 0) {
                 handleDialogueOption({ text: '', effect: 'neutral', nextId: null });
             }
        }
        return;
    }

    // 1. Check if standing ON an entity (e.g. Item Drop or Portal)
    const entityUnderfoot = getEntityAt(player.x, player.y);
    if (entityUnderfoot && entityUnderfoot.type !== EntityType.PORTAL) {
        startDialogue(entityUnderfoot.type, entityUnderfoot.id);
        return;
    }

    // 2. Check Entity in Front
    let targetX = player.x;
    let targetY = player.y;
    
    switch(player.dir) {
        case Direction.UP: targetY--; break;
        case Direction.DOWN: targetY++; break;
        case Direction.LEFT: targetX--; break;
        case Direction.RIGHT: targetX++; break;
    }

    const targetEntity = getEntityAt(targetX, targetY);
    if (targetEntity && targetEntity.type !== EntityType.PORTAL) {
        startDialogue(targetEntity.type, targetEntity.id);
        return;
    }

    // 3. If no entity in front, interact with self
    startDialogue(EntityType.PLAYER, 'self_inspect');

  }, [gameState, player, map, entities, currentDialogue, items, playSound]);

  const movePlayer = useCallback((dx: number, dy: number, newDir: Direction) => {
      if (gameState !== GameState.PLAYING || transitioning) return;
      
      const now = Date.now();
      const currentTile = map[player.y][player.x];
      const isCurrentlySticky = currentTile === 3;
      const moveDelay = isCurrentlySticky ? 600 : 200; // Slow down if on sticky tile

      if (now - lastMoveTime < moveDelay) return;

      const newX = player.x + dx;
      const newY = player.y + dy;

      setPlayer(prev => ({ ...prev, dir: newDir }));
      setLastMoveTime(now);

      // Check Portals
      const portal = MAPS[currentMapId].portals.find(p => p.x === newX && p.y === newY);
      if (portal) {
          loadMap(portal.targetMap, portal.targetX, portal.targetY);
          return;
      }

      // Check collision
      // Allow moving onto Item Drops (they are walkable but interactable)
      const ent = getEntityAt(newX, newY);
      
      // DECORATION is now non-blocking to allow for atmospheric clutter
      const isBlockingEntity = ent && ent.type !== EntityType.ITEM_DROP && ent.type !== EntityType.PORTAL && ent.type !== EntityType.DECORATION;

      let nextPlayerX = player.x;
      let nextPlayerY = player.y;

      if (isWalkable(newX, newY) && !isBlockingEntity) {
          nextPlayerX = newX;
          nextPlayerY = newY;
          setPlayer(prev => ({ ...prev, x: newX, y: newY }));
          playSound('move');
          setIsMoving(true);
          setTimeout(() => setIsMoving(false), 250);
      } else {
          setShake(5);
          setBumpEffect({ x: newX, y: newY, id: Date.now() });
          setTimeout(() => setBumpEffect(null), 300);
          setTimeout(() => setShake(0), 200);
      }
  }, [gameState, player, map, entities, transitioning, currentMapId, lastMoveTime, playSound, rebel]);

  // --- Automatic Guard Pursuit ---
  useEffect(() => {
      if (gameState !== GameState.PLAYING) return;
      if (currentDialogue) return; // Pause pursuit when dialogue is open
      if (rebel <= 70) return;

      const interval = setInterval(() => {
          setEntities(prev => prev.map(e => {
              if (e.type === EntityType.SOLDIER_BEE && !e.id.startsWith('guard_royal')) {
                  const diffX = player.x - e.x;
                  const diffY = player.y - e.y;
                  const dist = Math.hypot(diffX, diffY);
                  
                  if (dist < 0.1) return e; // Reached or extremely close

                  // Speed increases as rebel increases from 70 to 100
                  const baseSpeed = 0.03; 
                  const maxExtraSpeed = 0.08; // Max speed = 0.11 at 100 rebel
                  const speed = baseSpeed + ((Math.max(0, Math.min(100, rebel)) - 70) / 30) * maxExtraSpeed;
                  
                  const moveX = (diffX / dist) * Math.min(speed, dist);
                  const moveY = (diffY / dist) * Math.min(speed, dist);

                  return { ...e, x: e.x + moveX, y: e.y + moveY };
              }
              return e;
          }));
      }, 50);

      return () => clearInterval(interval);
  }, [gameState, player.x, player.y, rebel, currentDialogue]);

  // --- Guard Catch Check ---
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
      if (gameState !== GameState.PLAYING) return;
      if (currentDialogue) return; // Don't trigger if already in dialogue
      if (rebel > 70) {
          const isCaught = entities.some(e => {
              if (e.type === EntityType.SOLDIER_BEE && !e.id.startsWith('guard_royal')) {
                 const dist = Math.hypot(e.x - player.x, e.y - player.y);
                 return dist < 0.7; // Catch distance
              }
              return false;
          });
          if (isCaught) {
              startDialogue(EntityType.SOLDIER_BEE, 'caught_by_guard');
          }
      }
  }, [player.x, player.y, entities, gameState, rebel, currentDialogue]);

  // --- Environmental Hazards ---
  useEffect(() => {
      if (gameState !== GameState.PLAYING) return;

      const interval = setInterval(() => {
          const currentTile = map[player.y][player.x];
          if (currentTile === 4) { // Corrosive
              setHp(prev => Math.max(0, prev - 2));
              setShake(3);
              setTimeout(() => setShake(0), 100);
          }
      }, 1000);
      
      return () => clearInterval(interval);
  }, [gameState, player, map]);

  // --- Input Handling ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (showIntro) return; // Block input while modal is open

        if (gameState === GameState.TITLE) {
            setGameState(GameState.PLAYING);
            playSound('select');
            const hasShownIntro = sessionStorage.getItem('panopticon_has_shown_intro_session');
            if (!hasShownIntro) {
                setShowIntro(true);
                sessionStorage.setItem('panopticon_has_shown_intro_session', 'true');
            }
            return;
        }
        
        if (gameState === GameState.GAME_OVER) {
            return; // Handled by button
        }

        switch(e.key) {
            case 'ArrowUp': case 'w': movePlayer(0, -1, Direction.UP); break;
            case 'ArrowDown': case 's': movePlayer(0, 1, Direction.DOWN); break;
            case 'ArrowLeft': case 'a': movePlayer(-1, 0, Direction.LEFT); break;
            case 'ArrowRight': case 'd': movePlayer(1, 0, Direction.RIGHT); break;
            case ' ': case 'Enter': handleInteraction(); break;
        }
    };
    
    const handleClick = () => {
         if ((gameState === GameState.DIALOGUE || gameState === GameState.ENDING) && currentDialogue) {
             if (typingIndex < currentDialogue.text.length) {
                 setTypingIndex(currentDialogue.text.length);
                 setTypingText(currentDialogue.text);
             } else if (!currentDialogue.options || currentDialogue.options.length === 0) {
                 handleDialogueOption({ text: '', effect: 'neutral', nextId: null });
             }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('click', handleClick);
    }
  }, [gameState, movePlayer, handleInteraction, playSound, currentDialogue, typingIndex, handleDialogueOption, showIntro]);


  // --- Typewriter ---
  useEffect(() => {
      if (gameState === GameState.DIALOGUE || gameState === GameState.ENDING) {
          if (currentDialogue && typingIndex < currentDialogue.text.length) {
              const timeout = setTimeout(() => {
                  setTypingText(prev => prev + currentDialogue.text.charAt(typingIndex));
                  setTypingIndex(prev => prev + 1);
                  if (typingIndex % 3 === 0) playSound('typewriter');
              }, 30);
              return () => clearTimeout(timeout);
          }
      }
  }, [typingIndex, currentDialogue, gameState, playSound]);


  // --- Render ---

  const containerStyle = {
      transform: `translate3d(${shake}px, ${shake}px, 0)`,
  };

    if (gameState === GameState.TITLE) {
        return (
            <div 
                className="w-full h-screen bg-yellow-400 flex flex-col items-center justify-center relative overflow-hidden font-ui cursor-default"
                onClick={() => {
                    setGameState(GameState.PLAYING);
                    playSound('select');
                    const hasShownIntro = sessionStorage.getItem('panopticon_has_shown_intro_session');
                    if (!hasShownIntro) {
                        setShowIntro(true);
                        sessionStorage.setItem('panopticon_has_shown_intro_session', 'true');
                    }
                }}
            >
                {/* Global SVG Definitions for Collage Patterns and Filters */}
                <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
                    <CollagePatterns />
                </svg>
                
                {/* Animated Honeycomb Background */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] animate-pulse-slow mix-blend-multiply"></div>
                
                {/* Surreal Floating Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(12)].map((_, i) => {
                        const randomLeft = Math.floor(seededRandom(i * 123) * 100);
                        const randomTop = Math.floor(seededRandom(i * 456) * 100);
                        const randomDelay = seededRandom(i * 789) * 5;
                        const randomScale = 0.5 + seededRandom(i * 321) * 1.5;
                        const randomRotation = Math.floor(seededRandom(i * 654) * 360);
                        
                        return (
                            <div key={`bg-hex-${i}`} className="absolute animate-float" style={{
                                left: `${randomLeft}%`,
                                top: `${randomTop}%`,
                                animationDelay: `${randomDelay}s`,
                                animationDuration: `${4 + seededRandom(i) * 4}s`,
                                opacity: 0.2
                            }}>
                                <svg width="100" height="100" viewBox="0 0 100 100" className="text-black" style={{ transform: `rotate(${randomRotation}deg) scale(${randomScale})` }}>
                                    <polygon points="50 5, 93 25, 93 75, 50 95, 7 75, 7 25" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.3" />
                                </svg>
                            </div>
                        );
                    })}
                    <div className="absolute top-1/4 left-1/4 opacity-10 animate-spin-slow">
                        <GearDecor />
                    </div>
                </div>

                {/* Main Title Card */}
                <div className="z-10 relative group">
                    {/* Glitch Shadows matching Sanity (Pink) and Corruption (Green) */}
                    <div className="absolute inset-0 bg-sweet-pink transform translate-x-3 translate-y-3 rotate-3 opacity-60 mix-blend-multiply transition-transform group-hover:translate-x-5 group-hover:translate-y-5"></div>
                    <div className="absolute inset-0 bg-rotten-green transform -translate-x-3 -translate-y-3 -rotate-3 opacity-60 mix-blend-multiply transition-transform group-hover:-translate-x-5 group-hover:-translate-y-5"></div>
                    
                    <div className="relative text-center p-12 border-4 border-black bg-[#f4f1ea] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform rotate-1 transition-transform hover:rotate-0">
                        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>
                        
                        <div className="relative z-10">
                            <h1 className="text-7xl font-bold mb-2 text-void-black font-horror tracking-widest drop-shadow-md">CITRUS HIVE</h1>
                            <div className="h-1 w-full bg-black mb-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-yellow-600 w-1/2 animate-pulse"></div>
                            </div>
                            <h2 className="text-3xl mb-10 text-rotten-green tracking-[0.3em] font-serif italic">DISSONANCE</h2>
                            
                            <div className="w-40 h-40 mx-auto mb-8 relative">
                                <div className="absolute inset-0 animate-spin-slow opacity-20">
                                    <svg viewBox="0 0 100 100">
                                        <polygon points="50 5, 93 25, 93 75, 50 95, 7 75, 7 25" fill="none" stroke="black" strokeWidth="2" strokeDasharray="4 4" />
                                    </svg>
                                </div>
                                <div className="absolute inset-0 animate-float">
                                    <CitrusHeadSVG rot={0} mood="neutral" />
                                </div>
                            </div>

                            <button 
                                className="inline-block border-4 border-black bg-black text-yellow-400 px-12 py-4 transform -rotate-1 shadow-[8px_8px_0px_rgba(0,0,0,0.3)] hover:bg-sweet-pink hover:text-white transition-all hover:scale-110 active:scale-95 group-hover:rotate-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setGameState(GameState.PLAYING);
                                    playSound('select');
                                    const hasShownIntro = sessionStorage.getItem('panopticon_has_shown_intro_session');
                                    if (!hasShownIntro) {
                                        setShowIntro(true);
                                        sessionStorage.setItem('panopticon_has_shown_intro_session', 'true');
                                    }
                                }}
                            >
                                <p className="text-2xl font-cute font-bold tracking-[0.2em] uppercase">开始</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

  // Helper to calculate hex position offset
  // Stagger odd rows continuously so floating values don't jump
  const getHexPos = (x: number, y: number) => {
      const stagger = 1 - Math.abs((Math.abs(y) % 2) - 1);
      const xOffset = stagger * (CELL_SIZE / 2);
      return {
          left: x * CELL_SIZE + xOffset,
          top: y * (CELL_SIZE * 0.75) // Hexagons overlap vertically
      }
  };

  // Calculate player target directly in front of them
  let playerTargetX = player.x;
  let playerTargetY = player.y;
  switch (player.dir) {
      case Direction.UP: playerTargetY--; break;
      case Direction.DOWN: playerTargetY++; break;
      case Direction.LEFT: playerTargetX--; break;
      case Direction.RIGHT: playerTargetX++; break;
  }

  return (
    <div className="w-full h-screen bg-gray-900 relative flex items-center justify-center overflow-hidden select-none animate-bg-pulse">
        {/* Global SVG Definitions for Collage Patterns and Filters */}
        <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
            <CollagePatterns />
        </svg>
        
        {/* Global Post Processing */}
        <PostProcessingLayer corruption={corruptionLevel} hpRatio={hpRatio} />
        
        <div className="absolute inset-0 pointer-events-none z-40 animate-pulse-slow">
            <div 
                className="honey-drip" 
                style={{ 
                    transform: `translateY(${-50 + corruptionLevel * 120}px)`, 
                    opacity: Math.min(0.9, 0.6 + corruptionLevel * 0.4),
                    filter: `hue-rotate(${corruptionLevel * 140}deg) saturate(${1 + corruptionLevel * 2}) brightness(${1 - corruptionLevel * 0.3}) blur(${corruptionLevel * 2}px)`
                }}
            ></div>
        </div>

        {/* HUD */}
        {gameState !== GameState.GAME_OVER && (
            <>
            <div className="absolute top-4 left-4 z-50 font-ui text-white drop-shadow-md pointer-events-auto">
                <div className="flex flex-col gap-3">
                    {/* Status Bars with Honeycomb/Collage styling */}
                    <div className="relative p-4 bg-[#1a1a1a] border-2 border-[#333] shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden group">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] mix-blend-overlay"></div>
                        
                        {/* Glitch overlay based on corruption */}
                        {corruptionLevel > 0.5 && (
                            <div className="absolute inset-0 bg-red-500/10 mix-blend-color-burn animate-pulse pointer-events-none"></div>
                        )}

                        <div className="relative z-10 flex flex-col gap-3">
                            {/* HP Bar */}
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 flex items-center justify-center bg-black border border-sweet-pink/50 rounded-full shadow-[0_0_10px_rgba(255,105,180,0.3)]">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-sweet-pink" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={hpRatio > 0.3 ? "currentColor" : "none"} className={hpRatio <= 0.3 ? "animate-pulse" : ""} />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-[10px] mb-1 font-bold tracking-widest text-sweet-pink/80">
                                        <span>SANITY</span>
                                        <span>{Math.round(hpRatio * 100)}%</span>
                                    </div>
                                    <div className="w-32 h-3 bg-black border border-sweet-pink/30 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-30"></div>
                                        <div className="h-full bg-sweet-pink transition-all duration-500 relative" style={{ width: `${hpRatio * 100}%` }}>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dissonance Bar */}
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 flex items-center justify-center bg-black border border-rotten-green/50 rounded-full shadow-[0_0_10px_rgba(139,195,74,0.3)]">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-rotten-green" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" fill={terrorRatio > 0.7 ? "currentColor" : "none"} className={terrorRatio > 0.7 ? "animate-pulse" : ""} />
                                        <circle cx="12" cy="12" r="3" fill="currentColor" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-[10px] mb-1 font-bold tracking-widest text-rotten-green/80">
                                        <span>DISSONANCE</span>
                                        <span>{Math.round(terrorRatio * 100)}%</span>
                                    </div>
                                    <div className="w-32 h-3 bg-black border border-rotten-green/30 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-30"></div>
                                        <div className="h-full bg-rotten-green transition-all duration-500 relative" style={{ width: `${terrorRatio * 100}%` }}>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Decorative tape */}
                        <div className="absolute -top-2 -left-2 w-8 h-4 bg-yellow-100/40 rotate-[-45deg] backdrop-blur-sm border border-white/10"></div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-4 bg-yellow-100/40 rotate-[-45deg] backdrop-blur-sm border border-white/10"></div>
                    </div>

                    {/* Location & Items Panel */}
                    <div className="relative p-3 bg-[#1a1a1a] border-2 border-[#333] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                        
                        <div className="relative z-10">
                            <div className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-2 border-b border-gray-700 pb-1">
                                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                {MAP_NAMES[currentMapId]}
                            </div>

                            {items.length > 0 && (
                                <div className="mt-2">
                                    <div className="text-[10px] text-yellow-500/80 mb-1 font-bold tracking-wider">INVENTORY</div>
                                    <div className="flex flex-wrap gap-2 relative max-w-[200px]">
                                        {items.map((item, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    useItem(item);
                                                }}
                                                onMouseEnter={() => setHoveredItem(item)}
                                                onMouseLeave={() => setHoveredItem(null)}
                                                className="relative group w-10 h-10 bg-black border border-gray-600 hover:border-yellow-400 flex items-center justify-center transition-colors shadow-sm"
                                                style={{
                                                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-colors"></div>
                                                <ItemIconSVG name={item} className="w-6 h-6 relative z-10 drop-shadow-md" />
                                            </button>
                                        ))}
                                        {hoveredItem && (
                                            <div className="absolute top-full left-0 mt-2 p-3 bg-[#111] border-2 border-yellow-600/50 text-xs text-white w-56 z-50 shadow-[4px_4px_0px_rgba(0,0,0,0.8)] pointer-events-none">
                                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                                <div className="relative z-10">
                                                    <div className="font-bold text-yellow-400 mb-1 flex items-center gap-2 border-b border-yellow-600/30 pb-1">
                                                        <ItemIconSVG name={hoveredItem} className="w-4 h-4" />
                                                        {hoveredItem}
                                                    </div>
                                                    <div className="opacity-80 leading-relaxed font-serif text-[11px] mt-1">{ITEM_DESCRIPTIONS[hoveredItem] || '一个神秘的物件。'}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <button 
                onClick={() => setShowIntro(true)} 
                className="absolute top-4 right-4 z-50 bg-[#1a1a1a] text-yellow-500 border-2 border-yellow-600/50 p-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-yellow-500 hover:text-black transition-colors pointer-events-auto"
                title="生存指南"
            >
                <BookOpen size={24} />
            </button>
            </>
        )}

        {/* Intro Modal */}
        {showIntro && <IntroModal unlockedLore={unlockedLore} corruption={corruptionLevel} onClose={() => setShowIntro(false)} />}
        
        {/* Lore Toast */}
        {loreToast && (
            <div className="absolute bottom-16 right-4 z-[60] bg-[#FFFAF0] border-2 border-[#FFC107] text-[#805f00] px-6 py-3 font-cute font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-slide-in">
                {loreToast}
            </div>
        )}

        {/* Game World Container */}
        <div 
            className="relative shadow-2xl transition-all duration-500"
            style={{ 
                width: GRID_SIZE * CELL_SIZE + (CELL_SIZE/2), // Extra width for stagger
                height: GRID_SIZE * (CELL_SIZE * 0.75) + (CELL_SIZE * 0.25),
                ...containerStyle,
                opacity: (transitioning || gameState === GameState.GAME_OVER) ? 0 : 1,
                transform: transitioning ? 'scale(0.95)' : 'scale(1)',
            }}
        >
            {/* Dynamic Panopticon Background */}
            <PanopticonBackground 
                theme={MAPS[currentMapId].theme} 
                sanityRatio={hpRatio} 
                mapId={currentMapId}
                playerPos={player}
            />

            {/* Surreal Background Decor - Non-interactive peculiar objects */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`bg-decor-${i}`}
                         className="absolute animate-float"
                         style={{
                             left: `${(i * 20 + 10) % 100}%`,
                             top: `${(i * 35 + 15) % 100}%`,
                             transform: `rotate(${(i * 60) % 360}deg) scale(${0.5 + (i % 3) * 0.2})`,
                             animationDelay: `${i * 0.7}s`
                         }}>
                        {i % 3 === 0 && <GearDecor />}
                        {i % 3 === 1 && <div className="w-16 h-16 border-4 border-dashed border-white/30 rounded-full flex items-center justify-center text-white/20 text-xs">VOID</div>}
                        {i % 3 === 2 && <div className="w-20 h-4 bg-white/10 border border-white/20 transform skew-x-12"></div>}
                    </div>
                ))}
            </div>
            
            {/* Grid Rendering */}
            <div className="absolute inset-0 z-10">
                {map.map((row, y) => row.map((cell, x) => {
                    const isWall = cell === 1;
                    const isDecor = cell === 2;
                    const hasEye = wallEyes[`${x},${y}`];
                    const hasFloorEye = floorEyes[`${x},${y}`];
                    const pos = getHexPos(x, y);
                    
                    // Corruption effects for the entire tile container
                    const hueShift = corruptionLevel * 40;
                    const saturation = 1 + (corruptionLevel * 2);
                    const glitchClass = corruptionLevel > 0.2 ? "animate-glitch" : "";
                    const colorShiftClass = corruptionLevel > 0.3 ? "animate-color-shift" : "";
                    const glitchDist = `${corruptionLevel * 6}px`;
                    const glitchDur = `${0.5 / (1 + corruptionLevel * 8)}s`;
                    
                    // Subtle background animation for floor tiles
                    const breatheClass = !isWall && corruptionLevel > 0.1 ? "animate-breathe" : "";
                    
                    // Dynamic shadow/glow based on corruption
                    const dropShadow = corruptionLevel > 0.3 ? ` drop-shadow(0 0 ${corruptionLevel * 15}px rgba(180, 0, 0, ${corruptionLevel * 0.8}))` : "";
                    
                    // Animation intensity scaling based on corruption (breathing -> twitching)
                    const animEase = corruptionLevel > 0.7 ? "steps(3, end)" : (corruptionLevel > 0.4 ? "linear" : "ease-in-out");
                    const breatheDur = `${Math.max(0.1, 4 - corruptionLevel * 3.9)}s`;
                    const breatheScaleMin = 0.98 - (corruptionLevel * 0.05);
                    const breatheScaleMax = 1.02 + (corruptionLevel * 0.1);
                    const breatheOpacity = Math.max(0.2, 0.8 - corruptionLevel * 0.5);
                    
                    const wobbleDur = `${Math.max(0.05, 3 - corruptionLevel * 2.95)}s`;
                    const wobbleDeg = `${2 + corruptionLevel * 12}deg`;
                    const wobbleScale = 1.05 + corruptionLevel * 0.2;

                    return (
                        <div key={`${x}-${y}`} 
                             className={`absolute ${glitchClass} ${colorShiftClass} ${breatheClass}`}
                             style={{
                                 width: CELL_SIZE,
                                 height: CELL_SIZE,
                                 left: pos.left,
                                 top: pos.top,
                                 filter: `hue-rotate(${hueShift}deg) saturate(${saturation})${dropShadow}`,
                                 '--glitch-dist': glitchDist,
                                 '--glitch-dur': glitchDur,
                                 '--breathe-dur': breatheDur,
                                 '--breathe-scale-min': breatheScaleMin,
                                 '--breathe-scale-max': breatheScaleMax,
                                 '--breathe-opacity': breatheOpacity,
                                 '--anim-ease': animEase,
                                 animationDelay: `${(x + y) * 0.1}s` // Stagger the breathing animations
                             } as React.CSSProperties}
                        >
                            <div className={`w-full h-full relative ${isWall && corruptionLevel > 0.1 ? 'animate-wobble' : ''}`}
                                 style={{ 
                                     '--wobble-dur': wobbleDur,
                                     '--wobble-deg': wobbleDeg,
                                     '--wobble-scale': wobbleScale,
                                     '--anim-ease': animEase,
                                     animationDelay: `${(x * y) * 0.05}s` // Stagger wall wobbles
                                 } as React.CSSProperties}>
                                <HexTileSVG type={cell} theme={MAPS[currentMapId].theme} corruption={corruptionLevel} />
                                
                                {/* Wall Eyes Overlay */}
                                {hasEye && (
                                    <div className="absolute inset-[20%] animate-pulse-slow pointer-events-none">
                                        <WallEyeSVG corruption={corruptionLevel} />
                                    </div>
                                )}
                                
                                {/* Floor Eyes Overlay */}
                                {hasFloorEye && (
                                    <div className="absolute inset-[30%] animate-pulse pointer-events-none opacity-60" style={{ transform: 'scale(1, 0.5)' }}>
                                        <WallEyeSVG corruption={corruptionLevel} />
                                    </div>
                                )}
                                
                                {/* Target Highlight */}
                                {x === playerTargetX && y === playerTargetY && !isWall && gameState === GameState.PLAYING && (
                                    <div className="absolute inset-0 z-10 pointer-events-none opacity-90 animate-pulse">
                                        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                                            <path 
                                                d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" 
                                                fill="none" 
                                                stroke={MAPS[currentMapId].theme.secondary} 
                                                strokeWidth="10" 
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }))}
            </div>

            {/* Portals Visuals */}
            {MAPS[currentMapId].portals.map((p, idx) => {
                const pos = getHexPos(p.x, p.y);
                return (
                    <div key={`portal-${idx}`} 
                         className="absolute bg-white/30 animate-pulse rounded-full border-2 border-dashed border-white z-10"
                         style={{ 
                             width: CELL_SIZE * 0.8, height: CELL_SIZE * 0.8, 
                             left: pos.left + (CELL_SIZE * 0.1), top: pos.top + (CELL_SIZE * 0.1),
                             pointerEvents: 'none'
                         }}
                    ></div>
                )
            })}

            {/* Entities */}
            {entities.map(ent => {
                const pos = getHexPos(ent.x, ent.y);
                const isChasing = rebel > 70 && ent.type === EntityType.SOLDIER_BEE && !ent.id.startsWith('guard_royal');
                
                return (
                    <div 
                        key={ent.id}
                        className={`absolute z-20 pointer-events-none transition-all ease-linear ${isChasing ? 'duration-75' : 'duration-500 ease-in-out'}`}
                        style={{
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            left: pos.left,
                            top: pos.top,
                        }}
                    >
                        <div className="w-full h-full p-2">
                            {ent.type === EntityType.WORKER_BEE && <WorkerBeeSVG />}
                            {ent.type === EntityType.SOLDIER_BEE && <SoldierBeeSVG />}
                            {ent.type === EntityType.HONEY_POOL && <HoneyPoolSVG />}
                            {ent.type === EntityType.LARVA && <LarvaSVG />}
                            {ent.type === EntityType.MIRROR && <MirrorSVG />}
                            {ent.type === EntityType.QUEEN_GATE && <QueenGateSVG />}
                            {ent.type === EntityType.ITEM_DROP && (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <div className="relative flex items-center justify-center animate-bounce">
                                        {/* Pulsing Glow that bounces with the item */}
                                        <div className="absolute w-10 h-10 bg-yellow-200/40 rounded-full blur-md animate-pulse" style={{ animationDuration: '2s' }}></div>
                                        
                                        {/* Twinkling Stars */}
                                        <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-white rotate-45 animate-pulse shadow-[0_0_4px_#ffffff]" style={{ animationDuration: '1.5s' }}></div>
                                        <div className="absolute bottom-0 -right-2 w-1 h-1 bg-yellow-100 rotate-45 animate-pulse shadow-[0_0_3px_#fef08a]" style={{ animationDelay: '0.5s', animationDuration: '2s' }}></div>
                                        <div className="absolute top-2 -right-1 w-1.5 h-1.5 bg-yellow-200 rotate-45 animate-pulse shadow-[0_0_5px_#fef08a]" style={{ animationDelay: '1s', animationDuration: '1.5s' }}></div>

                                        {/* Item Icon */}
                                        <div className="relative z-10 drop-shadow-md">
                                            {ent.data?.name ? <ItemIconSVG name={ent.data.name} className="w-8 h-8" /> : <ItemIconSVG name="unknown" className="w-8 h-8" />}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {ent.type === EntityType.NPC_OLD && <OldBeeSVG />}
                            {ent.type === EntityType.DECORATION && (
                                <>
                                    {ent.data?.subtype === 'gear' && <GearDecor />}
                                    {ent.data?.subtype === 'tv' && <TVDecor />}
                                    {ent.data?.subtype === 'eyeplant' && <EyePlantDecor />}
                                    {ent.data?.subtype === 'iv' && <IVDripDecor />}
                                    {ent.data?.subtype === 'traffic' && <TrafficLightDecor />}
                                    {ent.data?.subtype === 'honeydrip' && <HoneyDripDecor />}
                                </>
                            )}
                        </div>
                    </div>
                )
            })}

            {/* Bump Effect */}
            {bumpEffect && (() => {
                const pos = getHexPos(bumpEffect.x, bumpEffect.y);
                return (
                    <div 
                        key={bumpEffect.id}
                        className="absolute z-20 pointer-events-none animate-ping"
                        style={{
                            width: CELL_SIZE * 0.5,
                            height: CELL_SIZE * 0.5,
                            left: pos.left + CELL_SIZE * 0.25,
                            top: pos.top + CELL_SIZE * 0.25,
                            border: '2px solid rgba(255,255,255,0.6)',
                            borderRadius: '50%'
                        }}
                    ></div>
                );
            })()}

            {/* Player */}
            {(() => {
                const pos = getHexPos(player.x, player.y);
                return (
                    <div 
                        className="absolute transition-all duration-300 ease-out z-30 pointer-events-none"
                        style={{
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            left: pos.left,
                            top: pos.top,
                        }}
                    >
                        <div className={`w-full h-full p-1 transition-transform duration-200 ${player.dir === Direction.LEFT ? 'scale-x-[-1]' : ''} ${isMoving ? '-translate-y-1 rotate-[5deg]' : ''}`}>
                            <CitrusHeadSVG 
                                rot={gameState === GameState.PLAYING ? Math.sin(Date.now() / 200) * 5 : 0} 
                                mood={rebel > 60 ? 'rotten' : hp < 30 ? 'scared' : 'neutral'} 
                                corruption={rebel / 100}
                            />
                        </div>
                    </div>
                );
            })()}

            {/* Surreal Overlay for Atmosphere */}
            <FogLayer corruption={corruptionLevel} />
            <SurrealOverlay />
        </div>

        {/* Dialogue Overlay */}
        {(gameState === GameState.DIALOGUE || gameState === GameState.ENDING) && currentDialogue && (
            <div 
                className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-40" 
                onClick={(e) => {
                     e.stopPropagation();
                     if (typingIndex < currentDialogue.text.length) {
                         setTypingIndex(currentDialogue.text.length);
                         setTypingText(currentDialogue.text);
                     } else if (!currentDialogue.options || currentDialogue.options.length === 0) {
                         handleDialogueOption({ text: '', effect: 'neutral', nextId: null });
                     }
                }}
            >
                <DialogueBox 
                    speaker={currentDialogue.speaker}
                    text={currentDialogue.text}
                    options={currentDialogue.options}
                    onOption={handleDialogueOption}
                    typingText={typingText}
                    corruption={corruptionLevel}
                />
            </div>
        )}

        {/* Ending Screen */}
        {gameState === GameState.GAME_OVER && (
            <EndingScreen 
                type={endingType} 
                onRestart={() => {
                    setGameState(GameState.TITLE);
                    setHp(MAX_HP);
                    setRebel(0);
                    setItems([]);
                    setVisited({});
                    setCurrentMapId(MapId.ENTRANCE);
                    setMap(MAPS[MapId.ENTRANCE].layout);
                    setEntities(MAPS[MapId.ENTRANCE].entities);
                    setPlayer({ x: 6, y: 6, dir: Direction.DOWN });
                }} 
                stats={{ hp, rebel, items }}
            />
        )}

        {/* Boss Fight */}
        {gameState === GameState.BOSS_FIGHT && (
            <div className="absolute inset-0 z-50 bg-black overflow-hidden flex items-center justify-center font-ui selection:bg-red-900">
                {/* Background layer */}
                <PanopticonBackground theme={{primary: '#997a00', secondary: '#1a0d00', bgPattern: 'hex'}} sanityRatio={0.1} mapId="THRONE" />
                <SurrealOverlay />
                <FogLayer corruption={100} />
                <div className="relative z-10 scale-90 md:scale-100 shadow-[0_0_100px_rgba(255,0,0,0.4)] border-8 border-gray-900 bg-[#0a0500] overflow-hidden flex rounded-xl isolate">
                    <BossFight 
                        onWin={() => {
                            if (hasItem('干枯的花朵') && hasItem('记忆碎片') && hasItem('破碎的皇冠')) {
                                triggerEnding(EndingType.REVOLUTION);
                            } else {
                                triggerEnding(EndingType.ASCENSION);
                            }
                        }}
                        onLose={() => {
                            triggerEnding(EndingType.CONSUMED);
                        }}
                    />
                    <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30">
                        <PostProcessingLayer corruption={80} hpRatio={0.2} />
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}