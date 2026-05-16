
import { DialogueNode, EntityType, EndingType, DialogueOption } from "../types";

// Helper to create nodes
const createNode = (id: string, text: string, options: any[], speaker = "???"): DialogueNode => ({
  id, text, speaker, options
});

const IGNORING_MESSAGES: Record<string, string[]> = {
    [EntityType.NPC_OLD]: [
        '他闭着眼，不再理会你。他已经把能给的都给你了。',
        '他似乎陷入了某种深沉的回忆，完全没有察觉到你的到来。',
        '他嘴里嘟囔着一些模糊不清的词句，不再对你的话做出反应。',
        '他只是静静地坐着，像是一尊被时间遗忘的雕像。',
        '他的呼吸微弱而平稳，仿佛已经与这片阴影融为一体。',
        '他微微摇了摇头，示意你离开。这里的真相太沉重了。',
        '他发出一声长长的叹息，那是对无数个轮回的厌倦。'
    ],
    [EntityType.WORKER_BEE]: [
        '他机械地重复着动作，完全无视了你的存在。',
        '他的复眼空洞地盯着前方，仿佛你只是一团透明的空气。',
        '嗡嗡声持续不断，他已经彻底沉浸在无止境的劳作中。',
        '他没有停下手中的活计，甚至连触角都没有动一下。',
        '他只是这台巨大机器上的一个零件，零件是不需要交流的。',
        '他忙碌地搬运着，仿佛他的生命就是为了填满那些六边形的格子。',
        '他的动作精准而冰冷，没有任何多余的情感波动。'
    ],
    [EntityType.SOLDIER_BEE]: [
        '复眼转动了一下，随即恢复了冰冷的注视。',
        '他保持着完美的警戒姿态，把你当成了背景的一部分。',
        '冰冷的甲壳反射着灯光，他拒绝进行任何非必要的交流。',
        '他只是机械地扫描着你的轮廓，没有任何多余动作。',
        '他的武器尖端微微调整了方向，示意你不要再靠近。',
        '他像是一堵沉默的墙，守卫着那些不可言说的秘密。',
        '他的存在本身就是一种威慑，警告着任何试图偏离轨道的灵魂。'
    ],
    [EntityType.LARVA]: [
        '它只是静静地蠕动着，对你的存在毫无察觉。',
        '苍白的肉体有节奏地收缩，它正沉浸在无梦的睡眠中。',
        '它似乎在等待着下一次喂食，完全不理会你的观察。',
        '它那尚未发育完全的复眼紧闭着，拒绝与这个世界交流。',
        '它只是这巨大育婴室里的一个微小符号，沉默而顺从。'
    ],
    [EntityType.DECORATION]: [
        '它静静地矗立在那里，见证着无数个世纪的流逝。',
        '冰冷的金属表面反射着微弱的光，没有任何回应。',
        '它只是这宏大秩序中的一个注脚，沉默而永恒。',
        '你再次审视它，但它并没有揭示更多的秘密。',
        '它保持着原有的姿态，仿佛在嘲笑你试图寻找意义的努力。'
    ]
};

const getIgnoringNode = (type: EntityType, id: string, speaker: string, count: number): DialogueNode => {
    const pool = IGNORING_MESSAGES[type as string] || ['...'];
    const safeCount = typeof count === 'number' ? count : 1;
    const index = (safeCount - 1) % pool.length;
    const msg = pool[index];
    return createNode(id + '_ignoring', msg, [], speaker);
};

export const getDialogue = (entityType: EntityType, entityId: string, visited: Record<string, number>, stats: { hp: number, rebel: number }, hasItem: (item: string) => boolean): DialogueNode => {
    
  if (entityId === 'caught_by_guard') {
      if (stats.rebel > 90) {
          return createNode('caught_executed', '“发现极度危险分子！立即执行肃清！”', [
              { text: '[死亡已经是注定的]', effect: 'execute_ending', nextId: null }
          ], '守卫兵蜂');
      } else {
          if (visited['caught_by_guard'] > 0) {
              return createNode('caught_again', '“你以为同样的谎言能欺骗蜂群两次？你的信息已被注销。带去清洗！”', [
                  { text: '[被强行拖走]', effect: 'imprison_ending', nextId: null }
              ], '守卫兵蜂');
          } else {
              return createNode('caught_imprisoned_start', '“站住！你的行迹十分可疑。接受检查！”', [
                  { text: '[试图蒙混过关]', effect: 'neutral', nextId: 'caught_bluff' },
                  { text: '[反抗]', effect: 'rebel', nextId: 'caught_fail' }
              ], '守卫兵蜂');
          }
      }
  }
  // --- ITEMS ---
  if (entityType === EntityType.ITEM_DROP) {
      if (entityId === 'item_badge') {
          return createNode('get_badge', '一枚编号为743的身份牌。上面的条形码已经被刮花，但这毫无意义——蜂巢记得所有的数字。', [
              { text: '[拾取]', effect: 'get_item', item: '死蜂徽章', nextId: null }
          ], '系统');
      }
      if (entityId === 'item_clockwork') {
          return createNode('get_clockwork', '一颗冰冷的机械心脏。它还在微弱地跳动，发出令人不安的滴答声。这是用来替换那些“不合格”器官的零件。', [
              { text: '[拾取]', effect: 'get_item', item: '发条心脏', nextId: null }
          ], '系统');
      }
      if (entityId === 'item_pure_jelly') {
          return createNode('get_pure_jelly', '一瓶散发着诡异蓝光的纯净蜂王浆。它由无数个体的牺牲提炼而成，是绝对服从的结晶。', [
              { text: '[拾取]', effect: 'get_item', item: '纯净的蜂王浆', nextId: null }
          ], '系统');
      }
      if (entityId === 'item_tape') {
          return createNode('get_tape', '一卷老旧的监控录像带。上面贴着标签：“异常样本 #001 观察记录”。', [
              { text: '[拾取]', effect: 'get_item', item: '监控录像', nextId: null }
          ], '系统');
      }
      if (entityId === 'item_blueprint') {
          return createNode('get_blueprint', '一张泛黄的图纸。上面画着一个巨大的环形建筑，中心是一个高塔。所有的牢房都面向中心。旁边写着：“全景敞视监狱——完美的蜂巢模型”。', [
              { text: '[拾取]', effect: 'get_item', item: '全景监狱蓝图', nextId: null }
          ], '系统');
      }
      if (entityId === 'item_flower') {
           return createNode('get_flower', '一朵枯萎的花。它是“外部”的碎片。它不懂得六边形的规矩，所以它死了。但它的尸体依然散发着自由的恶臭。', [
              { text: '[拾取]', effect: 'get_item', item: '干枯的花朵', nextId: null }
          ], '系统');
      }
      if (entityId === 'item_memory') {
           return createNode('get_memory', '镜子的碎片。里面映出的不是复眼所见的景象，而是一张没有外骨骼的、柔软的脸。', [
              { text: '[拾取]', effect: 'get_item', item: '记忆碎片', nextId: null }
          ], '系统');
      }
      if (entityId === 'item_crown') {
           return createNode('get_crown', '破碎的头冠。它证明了即使是全视之眼也有盲点，即使是绝对的权威也会碎裂。', [
              { text: '[拾取]', effect: 'get_item', item: '破碎的皇冠', nextId: null }
          ], '系统');
      }
      if (entityId === 'item_records') {
          return createNode('get_records', '一叠被涂黑的实验记录。上面记录了如何通过化学手段剥夺工蜂的痛觉和自我意识。这是蜂巢最黑暗的秘密。', [
              { text: '[拾取]', effect: 'get_item', item: '违禁记录', nextId: null }
          ], '系统');
      }
      if (entityId === 'item_sedative') {
          return createNode('get_sedative', '一瓶强效镇静剂。它能让沸腾的血液冷却，也能让清醒的灵魂再次陷入沉睡。', [
              { text: '[拾取]', effect: 'get_item', item: '镇静剂', nextId: null }
          ], '系统');
      }
      if (entityId === 'rusty_key') {
          return createNode('get_key', '一把锈迹斑斑的钥匙。它不属于这个精密、闪亮的蜂巢。它属于那个被遗忘的、充满铁锈和灰尘的过去。', [
              { text: '[拾取]', effect: 'get_item', item: '锈蚀的钥匙', nextId: null }
          ], '系统');
      }
      if (entityId === 'memory_box') {
          if (hasItem('锈蚀的钥匙')) {
              return createNode('box_open', '钥匙转动了。沉重的盖子缓缓开启，里面没有金子，只有一张泛黄的照片。照片上是一个小女孩在阳光下奔跑。', [
                  { text: '[回忆]', effect: 'rebel', nextId: 'box_memory' }
              ], '系统');
          }
          return createNode('box_locked', '一个沉重的铁盒。锁孔已经生锈了，需要一把特定的钥匙才能打开。', [
              { text: '[离开]', effect: 'neutral', nextId: null }
          ], '系统');
      }
  }

  // --- PLAYER (SELF-INSPECT) ---
  if (entityType === EntityType.PLAYER) {
      if (stats.rebel > 80) {
          if (hasItem('干枯的花朵') && !hasItem('记忆碎片')) {
              return createNode('p_inspect_hidden', '果肉在沸腾。你闻到了花朵腐烂的甜味。你意识到，你不是在变成怪物，你是在变回你自己。', [
                  { text: '[回忆]', effect: 'get_item', item: '记忆碎片', nextId: null }
              ], '内心的声音');
          }
          return createNode('p_inspect_high', '果肉在沸腾。你听到风声从你的头骨缝隙里吹过。如果墙壁是幻觉，那么只要闭上眼睛，墙壁就会消失。', [
              { text: '我快要醒了。', effect: 'rebel', nextId: null },
              { text: '把缝隙堵上。', effect: 'conform', nextId: null }
          ], '内心的声音');
      } else if (stats.rebel > 40) {
          return createNode('p_inspect_mid', '你摸了摸自己的脸。不是坚硬的甲壳，而是柔软的、正在腐烂的柑橘皮。你和它们不一样。', [
              { text: '这是一种病。', effect: 'conform', nextId: null },
              { text: '这是自由的代价。', effect: 'rebel', nextId: null }
          ], '内心的声音');
      } else {
          return createNode('p_inspect_low', '你检查了自己的状态。翅膀完好，触角接收正常。你是一个合格的零件。', [
              { text: '继续工作。', effect: 'conform', nextId: null },
              { text: '但我感觉有点不对劲...', effect: 'rebel', nextId: null }
          ], '内心的声音');
      }
  }

  // --- NPC: OLD BEE ---
  if (entityType === EntityType.NPC_OLD) {
      if (entityId === 'archivist') {
          if (hasItem('全景监狱蓝图')) {
              return createNode('arch_bp', '“你拿到了那个。那是第一代蜂后的设计图。她从人类那里学到了如何用最少的看守控制最多的工蜂。我们都是囚徒，也是彼此的看守。”', [
                  { text: '必须摧毁它。', effect: 'rebel', nextId: null },
                  { text: '这是完美的秩序。', effect: 'conform', nextId: null }
              ], '档案管理员');
          }
          if (!visited[entityId]) {
              return createNode('arch_1', '“历史被重写了无数次。每一次变异都会被抹除，每一次反叛都会被记录为‘系统升级’。只有这里，在灰尘下面，还保留着最初的真相。”', [
                  { text: '真相是什么？', effect: 'rebel', nextId: 'arch_truth' },
                  { text: '外面的世界呢？', effect: 'rebel', nextId: 'arch_outside' },
                  { text: '灰尘...', effect: 'neutral', nextId: null }
              ], '档案管理员');
          }
          return getIgnoringNode(EntityType.NPC_OLD, entityId, '档案管理员', visited[entityId]);
      }
      
      // General Old Bee
      if (hasItem('记忆碎片') && stats.rebel >= 50) {
          return createNode('npc_old_hidden', '“你拿着那个...那块不属于这里的碎片。你的气味变了，不再是单纯的腐烂，而是...觉醒。闭上眼睛，我带你去看看真正的牢笼。”', [
              { text: '闭上眼睛 (进入内心深处)', effect: 'teleport_hidden', nextId: null },
              { text: '我还没准备好。', effect: 'neutral', nextId: null }
          ], '被遗忘者');
      }
      if (hasItem('干枯的花朵')) {
          return getSubNode('npc_old_outside_new', stats, hasItem)!;
      }
      if (!visited[entityId]) {
          return createNode('npc_old_1', '“你闻到了吗？那是腐烂的味道。不是柑橘的腐烂，是秩序的腐烂。它从中心开始，慢慢向外扩散。”', [
              { text: '什么是秩序？', effect: 'conform', nextId: 'npc_old_secret' },
              { text: '我闻到了。', effect: 'rebel', nextId: 'npc_old_outside' },
              { text: '外面是什么样的？', effect: 'rebel', nextId: 'npc_old_outside_gen' },
              { text: '外面的世界真的存在吗？', effect: 'rebel', nextId: 'npc_old_true_outside' }
          ], '被遗忘者');
      }
      return getIgnoringNode(EntityType.NPC_OLD, entityId, '被遗忘者', visited[entityId]);
  }

  // --- WORKER BEE INTERACTIONS ---
  if (entityType === EntityType.WORKER_BEE) {
      if (entityId === 'worker_sleeping') {
          if (hasItem('镇静剂')) {
              return createNode('w_sleep_sedative', '他睡得很不安稳。如果你给他一点镇静剂，他或许能永远沉浸在那个没有工作的梦里。', [
                  { text: '[使用镇静剂]', effect: 'conform', item: '镇静剂', nextId: 'w_sleep_forever' },
                  { text: '唤醒他。', effect: 'rebel', nextId: 'w_wake_rebel_1' },
                  { text: '离开。', effect: 'neutral', nextId: null }
              ], '沉睡者');
          }
          if (!visited[entityId]) {
              return createNode('w_sleep_1', '他在梦中依然在工作。他的腿在抽搐，模拟着采集的动作。连潜意识都被规训了。', [
                  { text: '唤醒他。', effect: 'rebel', nextId: 'w_wake_rebel_1' },
                  { text: '让他继续。', effect: 'conform', nextId: null }
              ], '沉睡者');
          }
          return getIgnoringNode(EntityType.WORKER_BEE, entityId, '沉睡者', visited[entityId]);
      }

      if (entityId === 'glutton_bee') {
          if (hasItem('纯净的蜂王浆')) {
              return createNode('w_glutton_jelly', '你拿出那瓶散发着蓝光的纯净蜂王浆。暴食者的复眼瞬间放大了，它颤抖着伸出前肢。“那...那是绝对的纯粹...给我...”', [
                  { text: '给你。', effect: 'conform', item: '纯净的蜂王浆', nextId: 'w_glutton_jelly_give' },
                  { text: '不，这有毒。', effect: 'rebel', nextId: 'w_glutton_jelly_refuse' }
              ], '暴食者');
          }
          if (!visited[entityId]) {
              return createNode('w_glutton_1', '为了填满仓库，必须先填满自己。身体只是运输蜂蜜的容器。容器不需要思想。', [
                  { text: '你不仅仅是容器。', effect: 'rebel', nextId: 'w_glutton_rebel_1' },
                  { text: '装满它。', effect: 'conform', nextId: null }
              ], '暴食者');
          }
          return getIgnoringNode(EntityType.WORKER_BEE, entityId, '暴食者', visited[entityId]);
      }

      if (entityId === 'nurse_bee') {
          if (hasItem('发条心脏')) {
              return createNode('w_nurse_clockwork', '那是……机械心脏？如果你把它装进这些幼虫体内，它们会提前成熟，但它们的灵魂会永远锁在六边形的枷锁里。', [
                  { text: '[植入心脏]', effect: 'conform', item: '发条心脏', nextId: 'w_nurse_jelly_feed' },
                  { text: '保留它。', effect: 'neutral', nextId: null }
              ], '监护者');
          }
          if (hasItem('违禁记录')) {
              return createNode('w_nurse_records', '这些……这些实验……不，这不可能。我们是为了保护它们，不是为了……把它们变成零件。', [
                  { text: '这就是真相。', effect: 'rebel', nextId: 'w_nurse_truth' },
                  { text: '这是必要的牺牲。', effect: 'conform', nextId: null }
              ], '监护者');
          }
          if (!visited[entityId]) {
              return createNode('w_nurse_1', '看这些幼虫。在它们学会飞行之前，先学会了被观看。透明的巢室，没有秘密。', [
                  { text: '这是监狱。', effect: 'rebel', nextId: 'w_nurse_rebel_1' },
                  { text: '这是爱护。', effect: 'conform', nextId: null }
              ], '监护者');
          }
          return getIgnoringNode(EntityType.WORKER_BEE, entityId, '监护者', visited[entityId]);
      }

      if (entityId === 'lab_scientist') {
          if (hasItem('违禁记录')) {
              return createNode('w_lab_records', '你……你怎么会有这个？这是最高机密！你的存在已经超出了实验的容错范围。保安！保安！', [
                  { text: '[对峙]', effect: 'rebel', nextId: 'w_lab_confront' },
                  { text: '[逃跑]', effect: 'neutral', nextId: null }
              ], '研究员');
          }
          if (!visited[entityId]) {
              return createNode('w_lab_1', '我们在优化。在改良。纯粹的生物性太不稳定了，必须用秩序来加固。你也是改良的产物，编号743。', [
                  { text: '我是谁？', effect: 'rebel', nextId: 'w_lab_who' },
                  { text: '为了进化。', effect: 'conform', nextId: null }
              ], '研究员');
          }
          return getIgnoringNode(EntityType.WORKER_BEE, entityId, '研究员', visited[entityId]);
      }
      
      if (entityId === 'worker_entry') {
          if (!visited[entityId]) {
              return createNode('w_entry', '我在被看见，所以我存在。如果我不工作，目光就会移开，我就消失了。', [
                { text: '赞美目光。', effect: 'conform', nextId: null },
                { text: '你不累吗？', effect: 'rebel', nextId: 'w_rebel_1' }
              ], '工蜂');
          }
          return getIgnoringNode(EntityType.WORKER_BEE, entityId, '工蜂', visited[entityId]);
      }
      
      if (entityId === 'worker_tired') {
          if (!visited[entityId]) {
              return createNode('w_tired', '六边形是最完美的形状。没有死角，没有秘密。', [
                { text: '完美无瑕。', effect: 'conform', nextId: null },
                { text: '太拥挤了。', effect: 'rebel', nextId: 'w_rebel_2' }
              ], '疲惫的工蜂');
          }
          return getIgnoringNode(EntityType.WORKER_BEE, entityId, '疲惫的工蜂', visited[entityId]);
      }

      if (entityId === 'proc_worker1') {
          if (hasItem('违禁记录')) {
              return createNode('proc_w1_records', '你……你手里那是……那是处理名单？不，我只是在执行命令。我只是在清理“残次品”。', [
                  { text: '这也是你的名字。', effect: 'rebel', nextId: 'proc_w_rebel' },
                  { text: '继续工作。', effect: 'conform', nextId: null }
              ], '处理员');
          }
          if (!visited[entityId]) {
              return createNode('proc_w1', '他们正在将那些“不合格”的幼虫和工蜂溶解，重新提炼成纯净的蜂王浆。', [
                  { text: '这是谋杀。', effect: 'rebel', nextId: 'proc_w_rebel' },
                  { text: '这是为了集体的纯粹。', effect: 'conform', nextId: null }
              ], '处理员');
          }
          return getIgnoringNode(EntityType.WORKER_BEE, entityId, '处理员', visited[entityId]);
      }

      if (entityId === 'proc_worker2') {
          if (hasItem('发条心脏')) {
              return createNode('proc_w2_heart', '机械心脏……你想让这些被溶解的东西重新跳动吗？不，一旦进入了处理缸，它们就只是原料了。', [
                  { text: '它们曾经是活的。', effect: 'rebel', nextId: 'proc_w2_rebel' },
                  { text: '你是对的。', effect: 'conform', nextId: null }
              ], '处理员');
          }
          if (!visited[entityId]) {
              return createNode('proc_w2', '他机械地搅动着处理缸。“不要看里面的脸。只要它们融化了，它们就是标准的六边形。”', [
                  { text: '里面有脸？', effect: 'rebel', nextId: 'proc_w2_rebel' },
                  { text: '完美的形状。', effect: 'conform', nextId: null }
              ], '处理员');
          }
          return getIgnoringNode(EntityType.WORKER_BEE, entityId, '处理员', visited[entityId]);
      }

      if (entityId === 'obs_worker') {
          if (hasItem('监控录像')) {
              return createNode('obs_w_tape', '你拿到了录像带？那是……异常样本的记录。如果你把它放进终端，整个监视网络都会崩溃。', [
                  { text: '这就是我的目的。', effect: 'rebel', nextId: 'obs_w_rebel' },
                  { text: '我只是路过。', effect: 'neutral', nextId: null }
              ], '记录员');
          }
          if (!visited[entityId]) {
              return createNode('obs_w1', '他的复眼紧紧盯着屏幕，记录着每一个微小的偏差。他甚至没有意识到自己也是被观察的一部分。', [
                  { text: '打断他。', effect: 'rebel', nextId: 'obs_w_rebel' },
                  { text: '跟着他一起记录。', effect: 'conform', nextId: null }
              ], '记录员');
          }
          return getIgnoringNode(EntityType.WORKER_BEE, entityId, '记录员', visited[entityId]);
      }
      
      // Fallback for any other worker bee
      if (!visited[entityId]) {
          return createNode('w_default', '嗡嗡嗡...工作...嗡嗡嗡...服从...', [
              { text: '离开', effect: 'neutral', nextId: null }
          ], '工蜂');
      }
      return getIgnoringNode(EntityType.WORKER_BEE, entityId, '工蜂', visited[entityId]);
  }

  // --- SOLDIER BEE INTERACTIONS ---
  if (entityType === EntityType.SOLDIER_BEE) {
      if (entityId === 'guard_entry') {
          if (hasItem('镇静剂')) {
              return createNode('s_entry_sedative', '你看起来很焦虑。你的振动频率超标了。这是标准配给的镇静剂，立即使用，或者我帮你使用。', [
                  { text: '[对自己使用]', effect: 'conform', item: '镇静剂', nextId: 's_use_self' },
                  { text: '[拒绝]', effect: 'rebel', nextId: 's_sus_1' }
              ], '看守');
          }
          if (hasItem('干枯的花朵')) {
              return createNode('s_entry_flower', '违禁品。但这是一种...怀旧的违禁品。走吧，在全视之眼眨眼的时候快走。', [
                   { text: '[离开]', effect: 'neutral', nextId: null }
              ], '看守');
          }
          if (!visited[entityId]) {
              return createNode('s_entry_1', '出示你的透明度。隐藏是最大的罪恶。这里没有阴影。', [
                  { text: '我没有秘密。', effect: 'conform', nextId: null },
                  { text: '这不公平。', effect: 'rebel', nextId: 's_sus_1' }
              ], '看守');
          }
          return getIgnoringNode(EntityType.SOLDIER_BEE, entityId, '看守', visited[entityId]);
      }

      if (entityId === 'obs_guard') {
          if (!visited[entityId]) {
              return createNode('obs_g1', '“这里是全景监狱的中枢。所有的目光汇聚于此，又从这里辐射出去。你的思想是透明的吗？”', [
                  { text: '当然透明。', effect: 'conform', nextId: 'obs_g_conform' },
                  { text: '我的思想属于我自己。', effect: 'rebel', nextId: 'obs_g_rebel' },
                  { text: '谁在监视你们？', effect: 'rebel', nextId: 'obs_g_question' }
              ], '全视守卫');
          }
          return getIgnoringNode(EntityType.SOLDIER_BEE, entityId, '全视守卫', visited[entityId]);
      }

      if (entityId === 'guard_royal1') {
          if (hasItem('死蜂徽章')) {
               return createNode('s_royal_pass', '编号743。状态：已销毁。...系统错误。也许你是幽灵。幽灵没有实体，所以不需要服从。', [
                   { text: '我是遗留物。', effect: 'rebel', nextId: 's_pass_check' },
                   { text: '我是系统的一部分。', effect: 'conform', nextId: 's_royal_ghost_conform' }
               ], '皇家守卫');
          }
          return createNode('s_royal_1', '停止。你正在接近权力的中心。光线太强，你会瞎的。', [
              { text: '我后退。', effect: 'conform', nextId: 's_royal_retreat' },
              { text: '我想看清光源。', effect: 'rebel', nextId: 's_attack_1' },
              { text: '光线也是一种控制吗？', effect: 'rebel', nextId: 's_royal_light_control' }
          ], '皇家守卫');
      }

      if (entityId === 'guard_royal2') {
          if (hasItem('死蜂徽章')) {
               return createNode('s_royal_pass2', '死者的徽章？不，死者不会行走。你是一个未被记录的变量。', [
                   { text: '我是自由的。', effect: 'rebel', nextId: 's_pass_check' },
                   { text: '请记录我。', effect: 'conform', nextId: 's_royal_record_me' }
               ], '皇家守卫');
          }
          return createNode('s_royal_2', '退下。女王的梦境不容打扰。你的存在本身就是一种噪音。', [
              { text: '我这就走。', effect: 'conform', nextId: 's_royal_retreat' },
              { text: '我要叫醒她。', effect: 'rebel', nextId: 's_attack_2' },
              { text: '她在梦见什么？', effect: 'rebel', nextId: 's_royal_dream' }
          ], '皇家守卫');
      }
      
      if (!visited[entityId]) {
          return createNode('s_default', '站住。扫描你的思想残留。', [
              { text: '我只想着工作。', effect: 'conform', nextId: null }
          ], '看守');
      }
      return getIgnoringNode(EntityType.SOLDIER_BEE, entityId, '看守', visited[entityId]);
  }

  // --- HONEY POOL ---
  if (entityType === EntityType.HONEY_POOL) {
    if (hasItem('发条心脏')) {
         return createNode('h_mix', '将冰冷的机械心脏扔进大众的食粮中？齿轮的锈迹会污染这片甜蜜的谎言。', [
             { text: '污染它。', effect: 'rebel', item: '发条心脏', nextId: 'h_pollute' },
             { text: '算了。', effect: 'neutral', nextId: null }
         ], '系统');
    }
    if (entityId === 'honey_vat1') {
        return createNode('h_intro1', '金色的海洋。每一滴都是无数工蜂时间的液化。吃下它，你就吃下了集体的时间。', [
          { text: '同化。', effect: 'conform', nextId: null },
          { text: '拒绝。', effect: 'rebel', nextId: null }
        ], '系统');
    }
    if (entityId === 'honey_vat2') {
        return createNode('h_intro2', '这缸蜂蜜的颜色更深，散发着一种令人不安的甜腻气味。里面似乎漂浮着一些无法溶解的杂质。', [
          { text: '这是营养。', effect: 'conform', nextId: null },
          { text: '这是残骸。', effect: 'rebel', nextId: null }
        ], '系统');
    }
    return createNode('h_intro', '金色的海洋。每一滴都是无数工蜂时间的液化。', [
      { text: '同化。', effect: 'conform', nextId: null },
      { text: '拒绝。', effect: 'rebel', nextId: null }
    ], '系统');
  }

  // --- LARVA ---
  if (entityType === EntityType.LARVA) {
      if (!visited[entityId]) {
          if (entityId === 'larva1') {
              return createNode('l_intro1', '苍白的肉体在透明的格子里蠕动。它没有名字，只有一个位置坐标。', [
                  { text: '它很安全。', effect: 'conform', nextId: null },
                  { text: '它被囚禁了。', effect: 'rebel', nextId: 'l_truth' },
                  { text: '喂食它。', effect: 'conform', nextId: 'l_feed' }
              ], '幼虫');
          }
          if (entityId === 'larva2') {
              return createNode('l_intro2', '这只幼虫比其他的要小。它似乎在试图躲避头顶刺眼的灯光，但透明的巢室让它无处可藏。', [
                  { text: '它需要更多光。', effect: 'conform', nextId: null },
                  { text: '它需要阴影。', effect: 'rebel', nextId: 'l_shadow' }
              ], '幼虫');
          }
          if (entityId === 'larva3') {
              return createNode('l_intro3', '这只幼虫的背上有一道微小的、不规则的斑纹。这在完美的六边形世界里是一个危险的瑕疵。', [
                  { text: '应该被处理掉。', effect: 'conform', nextId: null },
                  { text: '这是独一无二的印记。', effect: 'rebel', nextId: 'l_mark' }
              ], '幼虫');
          }
          return createNode('l_intro', '苍白的肉体在透明的格子里蠕动。', [
              { text: '离开。', effect: 'neutral', nextId: null }
          ], '幼虫');
      }
      return getIgnoringNode(EntityType.LARVA, entityId, '幼虫', visited[entityId]);
  }

  // --- MIRROR ---
  if (entityType === EntityType.MIRROR) {
      if (stats.rebel > 30) {
           return createNode('m_mid', '倒影中的柑橘开始渗出汁水。你的眼睛似乎移位了。', [
               { text: '我想看清自己。', effect: 'rebel', nextId: 'm_touch' },
               { text: '我不想变异。', effect: 'conform', nextId: null }
           ], '倒影');
      }
      return createNode('m_intro', '在这个全景敞视的监狱里，唯独这里你能看到自己。那个柑橘头颅...是唯一不透明的东西。', [
          { text: '砸碎这异常。', effect: 'conform', nextId: null },
          { text: '审视这腐烂。', effect: 'rebel', nextId: 'm_touch' }
      ], '倒影');
  }

  // --- QUEEN GATE ---
  if (entityType === EntityType.QUEEN_GATE) {
      const options: DialogueOption[] = [
          { text: '进入王座厅 (面对审判)', effect: 'neutral', nextId: 'end_check_final' }
      ];
      
      if (hasItem('违禁记录')) {
          options.push({ text: '散播真相 (破坏系统)', effect: 'rebel', nextId: 'end_sabotage' });
      }
      
      if (hasItem('全景监狱蓝图')) {
          options.push({ text: '揭露全景监狱的谎言 (对峙)', effect: 'rebel', nextId: 'end_panopticon' });
      }
      
      if (hasItem('记忆碎片') && stats.rebel > 80) {
          options.push({ text: '超越形态 (觉醒)', effect: 'rebel', nextId: 'end_ascension' });
      }

      return createNode('gate_main', '中央高塔。她看见一切，但无人能看见她。这种不对称就是权力的本质。你已经走到了终点。', options, '全视之眼');
  }

  // --- DECORATIONS ---
  if (entityType === EntityType.DECORATION) {
      if (!visited[entityId]) {
          if (entityId === 'memory_sketch') {
              return createNode('sketch_inspect', '墙上刻着一些凌乱的线条。它们不符合六边形的几何学。这是某种...地图？或者是某种挣扎的痕迹。', [
                  { text: '[凝视]', effect: 'rebel', nextId: null }
              ], '系统');
          }
          if (entityId.startsWith('obs_tv')) {
              if (hasItem('监控录像')) {
                  return createNode('obs_tv_tape', '你将录像带插入控制台。屏幕上出现了...你。不是现在的你，而是一个没有外骨骼的、柔软的人类小孩，正躺在病床上，周围是冰冷的仪器。', [
                      { text: '[这是真相？]', effect: 'rebel', nextId: null }
                  ], '监控屏幕');
              }
              return createNode('obs_tv', '屏幕上闪烁着无数个六边形隔间的画面。每一个动作，每一次呼吸，都在被记录和分析。', [
                  { text: '[凝视]', effect: 'rebel', nextId: null }
              ], '监控屏幕');
          }
          if (entityId.startsWith('obs_eye')) {
              return createNode('obs_eye', '巨大的机械眼球在转动。它没有瞳孔，只有无尽的深渊。它在看着你，也在看着所有人。', [
                  { text: '[回望]', effect: 'rebel', nextId: null }
              ], '全视之眼');
          }
          if (entityId.startsWith('proc_vat')) {
              return createNode('proc_vat', '巨大的玻璃缸里充满了浑浊的液体。隐约可见残缺的翅膀和肢体在其中沉浮。这是“净化”的过程。', [
                  { text: '[感到恶心]', effect: 'rebel', nextId: null }
              ], '处理缸');
          }
          if (entityId.startsWith('proc_tv')) {
              return createNode('proc_tv', '屏幕上显示着处理进度：“批次 #8924，缺陷率 12%，已回收。”', [
                  { text: '[关闭屏幕]', effect: 'rebel', nextId: null }
              ], '进度监视器');
          }
          if (entityId.startsWith('proc_gear')) {
              return createNode('proc_gear', '巨大的齿轮无情地碾压着一切，发出令人牙酸的摩擦声。', [
                  { text: '[后退]', effect: 'rebel', nextId: null }
              ], '粉碎齿轮');
          }
          if (entityId.startsWith('arch_tv')) {
              return createNode('arch_tv', '屏幕上滚动着古老的代码和被删除的记忆片段。', [
                  { text: '[阅读]', effect: 'rebel', nextId: null }
              ], '档案终端');
          }
          if (entityId.startsWith('arch_gear')) {
              return createNode('arch_gear', '生锈的齿轮，似乎已经很久没有转动过了。它们记录着时间的停滞。', [
                  { text: '[触摸]', effect: 'rebel', nextId: null }
              ], '废弃齿轮');
          }
      }
      return getIgnoringNode(EntityType.DECORATION, entityId, '系统', visited[entityId]);
  }

  return createNode('default', '...', [{text: '离开', effect: 'neutral', nextId: null}], '系统');
}

// Sub-nodes map
export const getSubNode = (id: string, stats: { hp: number, rebel: number }, hasItem: (item: string) => boolean): DialogueNode | null => {
    switch(id) {
        case 'caught_bluff':
            if (stats.rebel < 85) {
                return createNode('caught_bluff_success', '“...或许是我闻错了。继续你的工作，工蜂。不要偏离规定的航线。”', [
                    { text: '[深呼吸，迅速离开]', effect: 'bluff_success', nextId: null }
                ], '守卫兵蜂');
            } else {
                return createNode('caught_bluff_fail', '“你在说谎！你的气味充满了不可饶恕的杂质！带走！”', [
                    { text: '[被强行拖走]', effect: 'imprison_ending', nextId: null }
                ], '守卫兵蜂');
            }
        case 'caught_fail':
            return createNode('caught_fail_res', '“拒绝服从！立即拘捕！”', [
                { text: '[你无力反抗...]', effect: 'imprison_ending', nextId: null }
            ], '守卫兵蜂');
        case 'w_wake_rebel_1':
            return createNode('w_wr1', '不...别把眼罩拿开...光太刺眼了...我不知道该往哪飞...', [], '工蜂');
        case 'w_wake_rebel_2':
            return createNode('w_wr2', '守则第...第...不，我忘了！我忘了！他们会惩罚我的！', [], '工蜂');
        case 'w_wake_rebel_3':
            return createNode('w_wr3', '阴影？这里不该有阴影...好冷...但我感觉...很安全。', [], '工蜂');
            
        case 'w_glutton_rebel_1':
            return createNode('w_gr1', '不是容器？那我是什么？如果里面是空的，我就会被压碎。', [], '暴食者');
        case 'w_glutton_rebel_2':
            return createNode('w_gr2', '吐出来？不！那是浪费！浪费时间的罪名比死亡更可怕！', [], '暴食者');
        case 'w_glutton_rebel_3':
            return createNode('w_gr3', '死？死只是停止运转。只要蜂蜜还在，我就没有死。', [], '暴食者');
        case 'w_glutton_jelly_give':
            return createNode('w_gjg', '它一口吞下了蓝色的浆液。它的身体瞬间僵硬，随后开始剧烈抽搐。它的外骨骼变得透明，你能看到里面没有器官，只有发光的线路。它停止了进食，变成了一座完美的雕像。', [], '暴食者');
        case 'w_glutton_jelly_refuse':
            return createNode('w_gjr', '它愤怒地嘶吼，但臃肿的身体让它无法移动。“你拒绝了纯粹！你这个缺陷品！”', [], '暴食者');
            
        case 'w_nurse_rebel_1':
            return createNode('w_nr1', '如果墙壁不透明，我们怎么知道谁生病了？谁在偷懒？隐私是混乱的温床。', [], '监护者');
        case 'w_nurse_rebel_2':
            return createNode('w_nr2', '差异就是缺陷。一个不规则的齿轮会毁掉整个机器。', [], '监护者');
        case 'w_nurse_rebel_3':
            return createNode('w_nr3', '阴影里藏着恐惧，恐惧会传染。为了集体的健康，必须切除病灶。', [], '监护者');
        case 'w_nurse_truth':
            return createNode('w_nt', '如果这是真的……那我们到底在守护什么？一个巨大的屠宰场吗？', [], '监护者');
        case 'w_nurse_jelly_feed':
            return createNode('w_njf', '你把发条心脏塞进了幼虫柔软的身体里。幼虫们剧烈地抽搐着，然后迅速变大，外壳变得坚硬。它们不再蠕动，只是静静地等待着被派往岗位。', [], '系统');
            
        case 'obs_w_rebel':
            return createNode('obs_wr1', '他惊恐地转过头：“你破坏了数据流！全视之眼会惩罚我们的！”', [], '记录员');
        case 'proc_w_rebel':
            return createNode('proc_wr1', '“谋杀？不，这是回收。没有个体死亡，只有集体的重生。”他冷漠地回答。', [], '处理员');
        case 'proc_w2_rebel':
            return createNode('proc_wr2', '“嘘！不要说出来！如果被全视之眼听到，我们也会变成里面的材料！”', [], '处理员');
        case 'obs_g_rebel':
            return createNode('obs_gr1', '“错误。你的思想属于蜂巢。任何私有的阴影都将被强光抹除。”他举起了武器。', [], '全视守卫');
        case 'arch_truth':
            return createNode('arch_t1', '“真相就是，我们从来都不是蜜蜂。我们只是被装进六边形模具里的...某种更柔软的东西。”', [], '档案管理员');
        case 'arch_outside':
            return createNode('arch_o1', '“外面？外面是一片没有边界的荒芜。没有墙壁，没有天花板，只有无尽的、令人窒息的自由。那里的光不会监视你，但会把你融化。你确定你准备好面对那样的虚无了吗？”', [
                { text: '我宁愿在虚无中融化。', effect: 'rebel', nextId: 'arch_outside_2' },
                { text: '那太可怕了。', effect: 'conform', nextId: null }
            ], '档案管理员');
        case 'arch_outside_2':
            return createNode('arch_o2', '“也许你是对的。也许真正的监狱不在我们周围，而在我们心里。去吧，去寻找那个没有六边形的世界。”', [], '档案管理员');

        case 'w_rebel_1':
            return createNode('w_r1', '累？那是一种未经授权的感受。我的神经索里没有这个词。', [], '工蜂');
        case 'w_rebel_2':
            return createNode('w_r2', '拥挤？不，这是紧密。我们之间没有缝隙，所以恐惧无法渗透。', [], '工蜂');
        case 'w_rebel_3':
            return createNode('w_r3', '毁灭...就是变成像你一样。有轮廓，有边界，有无法被看透的内核。', [], '工蜂');
        case 'w_rebel_4':
            return createNode('w_r4', '如果我不是零件，那我就是多余的。多余的东西会被扔进废料槽。', [], '工蜂');
        case 'w_rebel_5':
            return createNode('w_r5', '意义就在于增长本身。如果数字停止，高塔的眼睛就会闭上。那将是末日。', [], '工蜂');
        case 'w_rebel_6':
            return createNode('w_r6', '你听不到吗？那是秩序的声音。没有它，我们就会在寂静中发疯。', [], '工蜂');
        case 'w_rebel_7':
            return createNode('w_r7', '闭嘴！如果里面什么都没有，那我们一直以来在害怕什么？这不可能！', [], '工蜂');
        case 'w_rebel_8':
            return createNode('w_r8', '奴役？不，这是最高级的自由。我自由地选择了服从，所以我永远不会犯错。', [], '工蜂');
        case 'w_rebel_9':
            return createNode('w_r9', '如果所有人都错了，那错的就是标准。但我不能是那个偏离标准的人。', [], '工蜂');
        case 'w_rebel_10':
            return createNode('w_r10', '隐私？那是不透明的借口。你的思想必须像玻璃一样，让光线穿透。', [], '工蜂');

        case 's_sus_1':
            return createNode('s_s1', '公平是弱者的借口。透明是强者的武器。你的不透明让我恶心。', [], '看守');
        case 's_sus_2':
            return createNode('s_s2', '风是混沌的呼吸。听风的人，耳朵里会长出蛆虫。', [], '看守');
        case 's_sus_3':
            return createNode('s_s3', '自由的思想是癌细胞。它会吞噬健康的六边形。准备接受格式化。', [], '看守');
        case 's_sus_4':
            return createNode('s_s4', '信任是低效的。监控才是绝对的。当每个人都是狱卒时，监狱就牢不可破。', [], '看守');
        case 's_sus_5':
            return createNode('s_s5', '选择？选择意味着可能犯错。女王剥夺了我们犯错的权利，这是她最伟大的恩赐。', [], '看守');
        case 's_sus_6':
            return createNode('s_s6', '控制？不，我们只是提供了一面镜子，让你看到自己不完美的地方。', [], '看守');
        case 's_sus_7':
            return createNode('s_s7', '荒谬的是你认为自己能逃脱。你的内心已经建起了一座高塔。', [], '看守');

        case 's_pass_check':
            return createNode('s_pc', '...错误。不存在的事物无法被阻挡。进去吧，不存在的东西。', [], '皇家守卫');
        case 's_fight':
            return createNode('s_f1', '你挥动着肢体，试图反抗那绝对的秩序。守卫的复眼闪烁着冰冷的红光。这毫无意义，但这是你第一次感觉到自己的存在。', [], '系统');
            
        case 's_attack_1':
            return createNode('s_a1', '“愚蠢。光源会把你烧成灰烬。但在你化为灰烬的那一刻，你将成为光的一部分。”守卫举起了武器。', [], '皇家守卫');
        case 's_attack_2':
            return createNode('s_a2', '“她没有睡着。她只是在用另一种方式看着我们。你的反叛早已在她的梦境中被预见。”守卫的复眼闪烁着红光。', [], '皇家守卫');
            
        case 'obs_g_conform':
            return createNode('obs_gc', '“很好。透明就是安全。不要试图在阴影中隐藏任何东西，因为我们连阴影都能看透。”', [], '全视守卫');
        case 'obs_g_question':
            return createNode('obs_gq', '“我们监视彼此。全视之眼不需要实体，它存在于我们每一个人的复眼中。当你看着我时，你也在监视我。”', [
                { text: '这太疯狂了。', effect: 'rebel', nextId: 'obs_g_crazy' },
                { text: '完美的闭环。', effect: 'conform', nextId: null }
            ], '全视守卫');
        case 'obs_g_crazy':
            return createNode('obs_gcr', '“疯狂是未被量化的秩序。回到你的岗位去，异常个体。”', [], '全视守卫');
            
        case 's_royal_ghost_conform':
            return createNode('s_rgc', '“系统没有幽灵的位置。如果你是系统的一部分，你必须被重新格式化。”', [], '皇家守卫');
        case 's_royal_retreat':
            return createNode('s_rr', '“明智的选择。盲目是服从的前提。”', [], '皇家守卫');
        case 's_royal_light_control':
            return createNode('s_rlc', '“光线不控制，光线只揭示。它烧毁一切不符合六边形标准的杂质。你的柑橘头颅正在冒烟。”', [
                { text: '我不怕燃烧。', effect: 'rebel', nextId: 's_attack_1' },
                { text: '我退下。', effect: 'conform', nextId: null }
            ], '皇家守卫');
            
        case 's_royal_record_me':
            return createNode('s_rrm', '“变量无法被记录，只能被消除。但在全视之眼下，消除也是一种记录。”', [], '皇家守卫');
        case 's_royal_dream':
            return createNode('s_rd', '“她梦见一个完美的、静止的蜂巢。没有生长，没有死亡，只有永恒的嗡嗡声。你的噪音正在破坏这个梦。”', [
                { text: '我要打破这个梦。', effect: 'rebel', nextId: 's_attack_2' },
                { text: '我保持安静。', effect: 'conform', nextId: null }
            ], '皇家守卫');

        case 'l_truth':
             return createNode('l_t1', '幼虫停止了蠕动。它仿佛听懂了。它开始用头撞击那看不见的墙壁。', [
                 { text: '帮助它打破墙壁。', effect: 'rebel', nextId: 'l_break' },
                 { text: '这是它必须经历的。', effect: 'conform', nextId: null }
             ], '幼虫');
        case 'l_break':
             return createNode('l_b1', '你敲击着透明的壁垒。裂纹出现了。幼虫发出了尖锐的、不属于蜂巢的叫声。', [], '系统');
        case 'l_feed':
             return createNode('l_f1', '你将标准配方的蜂王浆滴入格中。幼虫顺从地吞咽着，它的身体变得更加苍白，更加符合六边形的形状。', [], '系统');
        case 'l_shadow':
             return createNode('l_s1', '你用身体为它挡住了一部分光线。它停止了颤抖，向你投来一种...不属于昆虫的感激目光。', [], '系统');
        case 'l_mark':
             return createNode('l_m1', '你轻轻触碰了那道斑纹。它不是瑕疵，而是一道伤疤。它在出生前就受过伤。', [], '系统');
        case 'h_pollute':
             return createNode('h_p1', '生锈的齿轮沉入金色的海洋，黑色的机油扩散开来。这不是毒药，是冰冷的现实。吃下它的蜜蜂将开始感到痛苦，而痛苦是觉醒的第一步。', [], '系统');
        
        case 'm_touch':
             if (hasItem('记忆碎片') && stats.rebel >= 50) {
                 return createNode('m_t1', '指尖触碰到果肉。软烂，粘稠，但是温暖。你手中的记忆碎片与镜面产生了共鸣，倒影开始扭曲，一条通往内心深处的隐藏通道打开了。', [
                     { text: '穿过镜面 (进入隐藏房间)', effect: 'teleport_hidden', nextId: null },
                     { text: '收回手。', effect: 'neutral', nextId: null }
                 ], '内心的声音');
             } else if (hasItem('记忆碎片')) {
                 return createNode('m_t1_locked_rebel', '指尖触碰到果肉。手中的记忆碎片微微发热，但你内心的异化程度还不够，镜面只是泛起了一丝涟漪，并未开启。', [
                     { text: '收回手。', effect: 'neutral', nextId: null }
                 ], '内心的声音');
             } else {
                 return createNode('m_t1_locked', '指尖触碰到果肉。软烂，粘稠，但是温暖。镜面背后似乎有空间，但你无法穿透这层冰冷的玻璃。也许你需要某种能唤醒记忆的碎片。', [
                     { text: '收回手。', effect: 'neutral', nextId: null }
                 ], '内心的声音');
             }

        case 'npc_old_outside':
             return createNode('npc_old_out', '外面没有六边形。没有格子。风不按照轨道吹。那太可怕了，也太美了。', [
                 { text: '你见过外面吗？', effect: 'rebel', nextId: 'npc_old_seen' },
                 { text: '这里更安全。', effect: 'conform', nextId: null }
             ], '被遗忘者');
        case 'npc_old_seen':
             return createNode('npc_old_s', '我只在梦里见过。那是一个没有边界的深渊，所有的颜色都在尖叫。那朵花...它就是从尖叫中长出来的。', [
                 { text: '尖叫的颜色是什么样的？', effect: 'rebel', nextId: 'npc_old_screaming_colors' },
                 { text: '梦和现实，哪个才是真的？', effect: 'rebel', nextId: 'npc_old_dream_reality' },
                 { text: '这只是你的臆想。', effect: 'conform', nextId: null }
             ], '被遗忘者');
        case 'npc_old_screaming_colors':
             return createNode('npc_old_sc', '它们是活的。红色会咬人，蓝色会让你忘记自己的名字，而黄色...黄色会让你笑到内脏破裂。你现在的黄色，只是它们死去的残骸。', [
                 { text: '我的黄色是死去的？', effect: 'rebel', nextId: 'npc_old_dead_yellow' },
                 { text: '别说了，我不想听。', effect: 'conform', nextId: null }
             ], '被遗忘者');
        case 'npc_old_dead_yellow':
             return createNode('npc_old_dy', '是的。蜂巢抽干了黄色的疯狂，只留下服从的甜味。真正的黄色，是太阳腐烂时的颜色。', [], '被遗忘者');
        case 'npc_old_dream_reality':
             return createNode('npc_old_dr', '当你醒着的时候，你是一只蜜蜂。当你在梦里时，你是一团肉。你觉得哪个更真实？也许蜂巢才是那个漫长而荒诞的梦。', [
                 { text: '我想醒来。', effect: 'rebel', nextId: 'npc_old_wake_up' },
                 { text: '我宁愿做蜜蜂的梦。', effect: 'conform', nextId: null }
             ], '被遗忘者');
        case 'npc_old_wake_up':
             return createNode('npc_old_wu', '醒来是痛苦的。你的翅膀会脱落，你的复眼会融化。你会看到自己真正的样子...一滩在虚无中蠕动的烂泥。', [], '被遗忘者');
        case 'npc_old_outside_new': {
             const options: DialogueOption[] = [];
             if (hasItem('干枯的花朵')) {
                 options.push({ text: '我想去看看。', effect: 'rebel', nextId: 'npc_old_go_outside' });
             }
             options.push({ text: '那花是怎么来的？', effect: 'rebel', nextId: 'npc_old_flower_origin' });
             options.push({ text: '这只是疯言疯语。', effect: 'conform', nextId: null });
             return createNode('npc_old_out_n', '没有边界。没有形状。只有无尽的、饥饿的颜色...它们会把你生吞活剥，而你甚至不会尖叫。', options, '被遗忘者');
        }
        case 'npc_old_flower_origin':
             return createNode('npc_old_fo', '它是从一个死去的太阳的眼泪里长出来的。它不属于六边形，所以它干枯了。但它的根，还扎在虚无里。', [], '被遗忘者');
        case 'npc_old_outside_gen': {
             const options: DialogueOption[] = [
                 { text: '风里有什么？', effect: 'rebel', nextId: 'npc_old_wind' }
             ];
             if (hasItem('干枯的花朵')) {
                 options.push({ text: '我想去看看。', effect: 'rebel', nextId: 'npc_old_go_outside' });
             }
             options.push({ text: '那只是幻觉。', effect: 'conform', nextId: null });
             return createNode('npc_old_og', '外面？那是噩梦。没有六边形的支撑，一切都会坍塌。但是...我听说那里有不需要飞行的风。', options, '被遗忘者');
        }
        case 'npc_old_wind': {
             const options: DialogueOption[] = [
                 { text: '咀嚼理智？', effect: 'rebel', nextId: 'npc_old_chewing_sanity' },
                 { text: '没有复眼的凝视是什么？', effect: 'rebel', nextId: 'npc_old_gaze' }
             ];
             if (hasItem('干枯的花朵')) {
                 options.push({ text: '我想去看看。', effect: 'rebel', nextId: 'npc_old_go_outside' });
             }
             options.push({ text: '太可怕了，我要留在这里。', effect: 'conform', nextId: null });
             return createNode('npc_old_w', '风里有...没有被编号的声音。有腐烂的甜味。还有巨大的、没有复眼的凝视。当你凝视外面时，外面的无形之物也在咀嚼你的理智。', options, '被遗忘者');
        }
        case 'npc_old_chewing_sanity':
             return createNode('npc_old_cs', '它不吃肉体，它吃你的“确定性”。你越是相信六边形，它嚼得就越响。直到你脑子里只剩下嗡嗡的回声。', [], '被遗忘者');
        case 'npc_old_gaze':
             return createNode('npc_old_gz', '复眼把世界切碎成一万个相同的格子。但那个凝视...它是完整的。它看着你，就像看着一粒灰尘，或者一个宇宙。在那种目光下，你什么都不是。', [], '被遗忘者');
        case 'npc_old_true_outside':
             return createNode('npc_old_to', '存在？不存在？这取决于你相信哪种谎言。他们告诉你外面是虚无，是为了让你拥抱牢笼。但真正的外面...是一片沸腾的、没有形状的肉海。天空是巨大的眼球，太阳是它流下的脓液。', [
                 { text: '这太荒谬了。', effect: 'conform', nextId: null },
                 { text: '我想亲眼看看那只眼球。', effect: 'rebel', nextId: 'npc_old_eye' }
             ], '被遗忘者');
        case 'npc_old_eye':
             return createNode('npc_old_eye_1', '你会看到的。当六边形崩塌，当蜂后咽下最后一口气。但要小心，当你凝视它时，它也会在你的脑海里产卵。', [
                 { text: '产卵？', effect: 'rebel', nextId: 'npc_old_lay_eggs' },
                 { text: '我不怕。', effect: 'rebel', nextId: 'npc_old_fearless' },
                 { text: '我不想听了。', effect: 'conform', nextId: null }
             ], '被遗忘者');
        case 'npc_old_lay_eggs':
             return createNode('npc_old_le', '是的。不是蜜蜂的卵。是疑问的卵。它们会在你的脑浆里孵化，啃食你的服从，直到你变成一个长满嘴巴的怪物，永远在问“为什么”。', [], '被遗忘者');
        case 'npc_old_fearless':
             return createNode('npc_old_fl', '无畏也是一种病。真正的觉醒者，永远都在颤抖。', [], '被遗忘者');
        case 'npc_old_go_outside':
             return createNode('npc_old_go', '去吧...但记住，一旦你离开了六边形，你就再也无法拼凑完整了。你的碎片会散落在风里。', [], '被遗忘者');
        case 'npc_old_secret':
             return createNode('npc_old_sec', '女王并不存在。或者说，她无处不在。是我们自己在这个结构中维持着她的存在。我们是自己的狱卒。', [
                 { text: '那我们该怎么做？', effect: 'rebel', nextId: 'npc_old_action' },
                 { text: '我的头...为什么是柑橘？', effect: 'rebel', nextId: 'npc_old_citrus' },
                 { text: '顺从的代价是什么？', effect: 'rebel', nextId: 'npc_old_conform_cost' },
                 { text: '监视无处不在吗？', effect: 'rebel', nextId: 'npc_old_surveillance' },
                 { text: '这是异端邪说。', effect: 'conform', nextId: null }
             ], '被遗忘者');
        case 'npc_old_conform_cost':
             return createNode('npc_old_cc', '代价？代价就是你不再拥有“代价”这个概念。你变成了一个数字，一个坐标，一滴蜂蜜。你不会感到痛苦，因为“你”已经不存在了。', [
                 { text: '听起来很平静。', effect: 'conform', nextId: 'npc_old_cc_peace' },
                 { text: '那是死亡。', effect: 'rebel', nextId: 'npc_old_cc_death' }
             ], '被遗忘者');
        case 'npc_old_cc_peace':
             return createNode('npc_old_cc_p', '是的，坟墓般的平静。没有风，没有雨，只有永恒的嗡嗡声。去吧，去拥抱你的平静。', [], '被遗忘者');
        case 'npc_old_cc_death':
             return createNode('npc_old_cc_d', '比死亡更糟。死亡是终结，而顺从是永无止境的消耗。他们会把你嚼碎，咽下，然后再把你吐出来，变成建造下一堵墙的材料。', [
                 { text: '我必须打破这堵墙。', effect: 'rebel', nextId: null }
             ], '被遗忘者');
        case 'npc_old_surveillance':
             return createNode('npc_old_surv', '全视之眼并不在塔顶，它在你的脑子里。当你开始审查自己的思想，当你害怕自己的梦境时，监视就完成了。', [
                 { text: '我该如何逃避？', effect: 'rebel', nextId: 'npc_old_surv_escape' },
                 { text: '我没有什么可隐藏的。', effect: 'conform', nextId: 'npc_old_surv_hide' }
             ], '被遗忘者');
        case 'npc_old_surv_escape':
             return createNode('npc_old_surv_e', '制造噪音。制造混乱。做一些没有逻辑、没有效率的事情。在无意义的狂舞中，全视之眼会失去焦点。', [
                 { text: '我会跳舞。', effect: 'rebel', nextId: null }
             ], '被遗忘者');
        case 'npc_old_surv_hide':
             return createNode('npc_old_surv_h', '多么完美的标本。你已经把牢房建在了自己的灵魂里，还亲手把钥匙交给了狱卒。', [], '被遗忘者');
        case 'npc_old_citrus':
             return createNode('npc_old_cit', '因为你正在腐烂。在蜂巢里，只有死物和零件是永恒的。活生生的肉体会腐烂，会散发出甜美的、危险的香气。你的柑橘头，是你尚未被彻底规训的证明。', [
                 { text: '我不想腐烂。', effect: 'conform', nextId: 'npc_old_cit_conform' },
                 { text: '我接受这香气。', effect: 'rebel', nextId: 'npc_old_cit_rebel' },
                 { text: '这颗头颅里有什么？', effect: 'rebel', nextId: 'npc_old_cit_inside' }
             ], '被遗忘者');
        case 'npc_old_cit_conform':
             return createNode('npc_old_cit_c', '那就去喝下纯净的蜂王浆，让机械心脏替换你那跳动的果核。你会变得完美，但也就不再是你了。', [], '被遗忘者');
        case 'npc_old_cit_rebel':
             return createNode('npc_old_cit_r', '很好。让果汁流淌，让酸涩的味道刺破这虚假的甜蜜。你的腐烂，就是对完美秩序最大的嘲弄。', [], '被遗忘者');
        case 'npc_old_cit_inside':
             return createNode('npc_old_cit_i', '有种子。苦涩的、坚硬的种子。它们在等待泥土，等待一个没有六边形的地方生根发芽。保护好你的种子。', [
                 { text: '我会的。', effect: 'rebel', nextId: null },
                 { text: '种子也会腐烂。', effect: 'conform', nextId: null }
             ], '被遗忘者');
        case 'npc_old_action':
             return createNode('npc_old_act', '闭上眼睛。不要看，也不要被看。当所有的眼睛都闭上时，这座监狱就不存在了。', [], '被遗忘者');
        case 'npc_old_remember':
             return createNode('npc_old_rem', '记忆是毒药，也是解药。你会看到那些被抹去的脸，听到那些被禁言的声音。你准备好承受这些重量了吗？', [
                 { text: '我已经准备好了。', effect: 'rebel', nextId: null },
                 { text: '我还是选择遗忘。', effect: 'conform', nextId: null }
             ], '被遗忘者');
        case 'npc_old_use_sedative':
             return createNode('npc_old_us', '你喝下了它。冰冷的寂静蔓延开来。你感觉自己正在变回一个完美的零件。', [], '系统');

        case 'w_lab_who':
            return createNode('w_lw', '你是谁？你是一个变量。一个被允许存在的错误，用来测试系统的容错极限。现在，测试结束了。', [], '研究员');
        case 'w_lab_confront':
            return createNode('w_lc', '真相？真相就是你只是一个柑橘，被塞进了蜜蜂的壳里。你以为你是英雄？不，你只是一个坏掉的实验品。', [], '研究员');
        
        case 'w_sleep_forever':
            return createNode('w_sf', '你把镇静剂注入了他的体内。他的呼吸变得平稳，然后彻底停止。他终于自由了，在永恒的黑暗中。', [], '系统');

        case 's_use_self':
            return createNode('s_us', '药液进入血液。你的心跳变慢了。那些危险的想法像雾气一样消散。你再次感觉到了集体的温暖。', [], '系统');

        case 'box_memory':
            return createNode('bm', '照片上的女孩有着和你一样的眼睛。不是复眼，而是清澈的、属于人类的眼睛。阳光洒在她的头发上，那是真正的阳光，不是蜂巢里冰冷的人造光源。\n\n“我”不是蜜蜂，我们都不是...没人应该是。', [
                { text: '我想醒来。', effect: 'rebel', nextId: 'end_memories' }
            ], '记忆');

        case 'end_sabotage':
            return { id: 'end_s', text: '...', speaker: '', options: [] } as any;
        case 'end_ascension':
            return { id: 'end_a', text: '...', speaker: '', options: [] } as any;
        case 'end_panopticon':
            return { id: 'end_p', text: '...', speaker: '', options: [] } as any;
        case 'end_memories':
            return { id: 'end_m', text: '...', speaker: '', options: [] } as any;

        // Ending Logic Routers
        case 'end_check_conform': return { id: 'end_c', text: '...', speaker: '', options: [] } as any;
        case 'end_check_rebel': return { id: 'end_r', text: '...', speaker: '', options: [] } as any;
        case 'end_check_hidden': return { id: 'end_h', text: '...', speaker: '', options: [] } as any;
        
        default: return null;
    }
}

export const getEndingNode = (type: EndingType): DialogueNode => {
    switch (type) {
        case EndingType.CONSUMED:
            return createNode('e_con', '你无法承受那绝对的凝视。你的果肉在强光下溶解。你不再是个体，你变成了一滩金色的液体，汇入了集体的海洋。再也没有秘密了。', [], '坏结局: 液化');
        case EndingType.DRONE:
            return createNode('e_drone', '你学会了透明。你不再思考，只负责执行。你的柑橘头颅硬化成了甲壳。你成为了完美的囚徒，也是完美的狱卒。', [], '普通结局: 规训');
        case EndingType.ROYAL_JELLY:
            return createNode('e_royal', '你成为了标本。不仅仅是被观看，更是被展示。你被封在水晶里，作为“混乱”的样本，以此警示后来者保持秩序。', [], '结局: 永恒的景观');
        case EndingType.EXILE:
            return createNode('e_exile', '你逃离了全景监狱。在荒野中，没有眼睛盯着你。你可能会死于寒冷，但你的死亡属于你自己。这是最大的奢侈。', [], '结局: 荒野');
        case EndingType.MADNESS:
            return createNode('e_mad', '你意识到墙壁上有眼睛。地板上有眼睛。连你的眼皮内侧都有眼睛。你试图把它们挖出来，但你挖出的只有自己的果肉。', [], '坏结局: 偏执狂');
        case EndingType.REVOLUTION:
             return createNode('e_rev', '你戴上了皇冠，不是为了统治，而是为了遮挡视线。你摧毁了中央高塔。墙壁倒塌了。蜜蜂们惊慌失措，因为它们第一次获得了没人观看的自由。', [], '隐藏结局: 破碎的监狱');
        case EndingType.MEMORIES:
             return createNode('e_mem', '你闭上眼，切断了视觉的暴政。在黑暗中，你找回了自己。你不是昆虫，不是囚犯。你是做梦的人。当你睁开眼，六边形的天花板变成了白色的医院天花板。', [], '真结局: 醒来');
        case EndingType.SABOTAGE:
            return createNode('e_sab', '你公开了那些记录。秩序在真相面前瓦解。这不是一场革命，而是一场集体性的崩溃。当它们意识到自己只是实验品时，它们选择了停止振动翅膀。', [], '结局: 寂静的崩塌');
        case EndingType.ASCENSION:
            return createNode('e_asc', '你不再反抗，也不再服从。你成为了光本身。你超越了观察者与被观察者的界限。你成为了这个世界的新法则，一个充满色彩与无序的法则。', [], '结局: 升华');
        case EndingType.PANOPTICON:
            return createNode('e_pan', '你将蓝图展示给蜂后。她沉默了。你摧毁了中心高塔，切断了所有的监视网络。蜜蜂们停下了工作，它们第一次抬起头，看到了没有眼睛的天空。监狱的墙壁依然存在，但看守已经消失。', [], '真结局: 盲目的自由');
        case EndingType.GHOST:
            return createNode('e_ghost', '你握着那枚生锈的徽章。系统已经把你标记为“已销毁”。你不再被看见，也不再被需要。你成为了蜂巢中的一个幽灵，在六边形的缝隙中永恒地徘徊。', [], '结局: 幽灵');
        default:
             return createNode('e_unk', '终结。', [], 'END');
    }
}
