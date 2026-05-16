import React, { useState } from 'react';
import { CitrusHeadSVG, WorkerBeeSVG, SoldierBeeSVG, OldBeeSVG, LarvaSVG, WallEyeSVG, HoneyPoolSVG, QueenGateSVG, GearDecor } from '../constants';
import { Book, Target, Users, Hexagon, X } from 'lucide-react';

interface IntroModalProps {
    onClose: () => void;
    unlockedLore: string[];
    corruption: number;
}

export const IntroModal: React.FC<IntroModalProps> = ({ onClose, unlockedLore, corruption }) => {
    const [activeTab, setActiveTab] = useState<'background' | 'mechanics' | 'objectives' | 'npcs'>('background');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-body">
            <div className="bg-honey-dark border-4 border-black w-full max-w-4xl h-[85vh] flex flex-col shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden relative">
                {/* Header */}
                <div className="bg-black text-honey-main p-4 flex justify-between items-center border-b-4 border-black">
                    <h2 className="text-2xl font-bold font-cute tracking-widest text-[#FFC107]">◆ 蜂巢生存指南 ◆</h2>
                    <button 
                        onClick={onClose}
                        className="text-white hover:text-sweet-pink transition-colors focus:outline-none"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-48 bg-honey-main border-r-4 border-black flex flex-col">
                        <button 
                            onClick={() => setActiveTab('background')}
                            className={`p-4 text-left font-bold transition-colors border-b-2 border-black/20 flex items-center gap-2 ${activeTab === 'background' ? 'bg-black text-honey-main' : 'hover:bg-black/10'}`}
                        >
                            <Hexagon className="w-5 h-5" />
                            背景设定
                        </button>
                        <button 
                            onClick={() => setActiveTab('mechanics')}
                            className={`p-4 text-left font-bold transition-colors border-b-2 border-black/20 flex items-center gap-2 ${activeTab === 'mechanics' ? 'bg-black text-honey-main' : 'hover:bg-black/10'}`}
                        >
                            <Book className="w-5 h-5" />
                            游玩方式
                        </button>
                        <button 
                            onClick={() => setActiveTab('objectives')}
                            className={`p-4 text-left font-bold transition-colors border-b-2 border-black/20 flex items-center gap-2 ${activeTab === 'objectives' ? 'bg-black text-honey-main' : 'hover:bg-black/10'}`}
                        >
                            <Target className="w-5 h-5" />
                            任务目标
                        </button>
                        <button 
                            onClick={() => setActiveTab('npcs')}
                            className={`p-4 text-left font-bold transition-colors border-b-2 border-black/20 flex items-center gap-2 ${activeTab === 'npcs' ? 'bg-black text-honey-main' : 'hover:bg-black/10'}`}
                        >
                            <Users className="w-5 h-5" />
                            实体解析
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar textual-content leading-relaxed">
                        
                        {activeTab === 'background' && (
                            <div className="space-y-8 animate-fade-in">
                                {/* Panopticon */}
                                <div className="border-l-4 border-sweet-pink pl-4">
                                    <h3 className="text-2xl font-bold mb-2">1. 全景视野</h3>
                                    {unlockedLore.includes('panopticon') ? (
                                        <>
                                            <p className="mb-4 text-gray-700 font-serif italic">“她看见一切，但无人能看见她。这种不对称即是权力的本质。”</p>
                                            <div className="flex gap-4">
                                                <div className="w-24 h-24 flex-shrink-0 bg-black/5 rounded flex flex-col justify-center items-center overflow-hidden">
                                                    <WallEyeSVG corruption={0} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">不对称的凝视</h4>
                                                    <p className="text-sm text-gray-600">所有工蜂都处于被永远注视的恐惧中。即便中央高塔里并没有人看，这种心理预期已足以完成自我规训。在系统眼中，隐藏本身就是最大的异常。</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-gray-400 italic">尚未完全理解这个被无数眼睛盯着的场所的真实运作逻辑。</p>
                                    )}
                                </div>

                                {/* Flesh & Machine */}
                                <div className="border-l-4 border-sweet-pink pl-4">
                                    <h3 className="text-2xl font-bold mb-2">2. 柔顺的肉体</h3>
                                    {unlockedLore.includes('worker') || unlockedLore.includes('soldier') ? (
                                        <>
                                            <p className="mb-4 text-gray-700 font-serif italic">“身体只是运输蜂蜜的容器。容器不需要思想。”</p>
                                            <div className="flex gap-4">
                                                <div className="w-24 h-24 flex-shrink-0 bg-black/5 rounded flex flex-col justify-center items-center overflow-hidden">
                                                    <GearDecor/>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">零件化隐喻</h4>
                                                    <p className="text-sm text-gray-600">编号代替了名字，一切不符合标准的变异都会被重新溶解提炼。个体的死亡在集体看来不过是一次“回收”。</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-gray-400 italic">它们看起来像机械，但流淌着粘稠的液体。你还没有看透这种存在的本质。</p>
                                    )}
                                </div>

                                {/* Citrus */}
                                <div className="border-l-4 border-sweet-pink pl-4">
                                    <div className="flex items-start gap-6">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold mb-2">3. 柑橘与腐烂</h3>
                                            {unlockedLore.includes('citrus') ? (
                                                <>
                                                    <p className="mb-2 font-serif italic">“活生生的肉体会腐烂，会散发出甜美的、危险的香气。”</p>
                                                    <p className="text-sm text-gray-600">你是一只拥有柔软果肉脑袋的异常者。在由甲壳构建的冰冷社会中，“腐烂”是生命力的象征。这种果实腐败的香气，就是自由的雏形。</p>
                                                </>
                                            ) : (
                                                <p className="text-gray-400 italic">你觉得你的脑袋很柔软，甚至有一点酸涩的味道，和周围坚硬的甲壳格格不入。</p>
                                            )}
                                        </div>
                                        <div className="w-32 h-32 flex-shrink-0 border-2 border-black rounded-lg p-2 bg-[#FFFAF0] flex flex-col items-center justify-center transform rotate-3">
                                            <div className="w-24 h-24"><CitrusHeadSVG rot={0} corruption={corruption} /></div>
                                            <span className="text-xs font-bold mt-1 text-center font-cute text-black">743号</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'mechanics' && (
                            <div className="space-y-6 animate-fade-in">
                                <h3 className="text-2xl font-bold mb-4 border-b-2 border-black/10 pb-2">游玩方式</h3>
                                <p className="text-gray-700">游戏以俯视角的走格子探索形式进行。通过键盘的方向键 `[W, A, S, D]` 或 `[↑, ↓, ←, →]` 控制角色移动并与世界交互。</p>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-100 p-4 rounded border border-gray-300">
                                        <h4 className="font-bold mb-2 flex items-center gap-2">
                                            <span className="bg-black text-white px-2 py-0.5 rounded text-xs">HP</span>顺从度 (Conformity)
                                        </h4>
                                        <p className="text-sm">代表你对系统的服从。遭受系统性暴力或选择违背真心的回应会降低此值。当降至0时，你可能会彻底陷入疯狂或被回收。</p>
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded border border-gray-300">
                                        <h4 className="font-bold mb-2 flex items-center gap-2 text-sweet-pink">
                                            <span className="bg-sweet-pink text-white px-2 py-0.5 rounded text-xs">REBEL</span>叛逆度 (Dissonance)
                                        </h4>
                                        <p className="text-sm">代表你自主意识的觉醒程度。通过质疑NPC、发现系统的漏洞、阅读隐藏档案等行为增长。它决定了你的视界和最终走向。</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 bg-black text-white rounded flex items-center justify-center font-bold text-2xl flex-shrink-0">E</div>
                                        <div>
                                            <h4 className="font-bold text-lg">交互 (Interact)</h4>
                                            <p className="text-sm text-gray-700">靠近各类实体（工蜂、兵蜂、控制台、档案室等）按下 `E` 或 `空格键` 或 `Enter` 键进行对话和操作。在剧情中做出的每一个选择，都会导向不同的规训或反叛终局。</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 bg-black text-white rounded flex items-center justify-center font-bold text-2xl flex-shrink-0">I</div>
                                        <div>
                                            <h4 className="font-bold text-lg">物品栏 (Inventory)</h4>
                                            <p className="text-sm text-gray-700">按下 `I` 键查看收集的物品。某些特殊物品（如“死蜂徽章”、“纯净蜂王浆”）可以作为特定交互的钥匙，用来破解死板的系统逻辑。</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'objectives' && (
                            <div className="space-y-6 animate-fade-in">
                                <h3 className="text-2xl font-bold mb-4 border-b-2 border-black/10 pb-2">任务目标</h3>
                                <div className="bg-honey-main/20 p-6 rounded-lg border-2 border-honey-main shadow-inner">
                                    <p className="text-lg mb-4"><strong>你是一个初生的异常者 (743号)。</strong> 表面上，你的目标是履行作为一只“工蜂”的职责，前往各个区块，融入这个巨大的、轰鸣的系统中。</p>
                                    
                                    <ul className="list-disc pl-6 space-y-3 text-gray-800">
                                        <li><strong>存活与观察：</strong> 穿梭于育婴室、储藏室、处理中心，观察每一个零件如何运转。</li>
                                        <li><strong>收集碎片：</strong> 在被遗忘的角落搜寻线索与发条、镇静剂等物品。</li>
                                        <li><strong>寻找出口与真相：</strong> 是彻底沉沦、变得透明且完美，还是在腐烂中拥抱混乱寻找出路？你的目标取决于你的选择。</li>
                                    </ul>
                                </div>
                                <div className="mt-6 flex flex-col items-center justify-center text-center">
                                    <div className="w-32 h-32 mb-4 bg-gray-100 rounded-full flex items-center justify-center border-4 border-black border-dashed opacity-50 relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center scale-[2]"><QueenGateSVG /></div>
                                    </div>
                                    <p className="font-bold text-gray-500 italic">“所有路径最终都通向王座，但你真的想去那里吗？”</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'npcs' && (
                            <div className="space-y-8 animate-fade-in pb-8">
                                <p className="text-gray-700 italic border-l-4 border-gray-300 pl-4 mb-8">
                                    我们不是孤立的零件。每一次交互，都是一次关于“顺从”与“叛逆”的叩问。以下实体信息将随着你的探索逐步揭示。
                                </p>

                                <div className="space-y-6">
                                    {/* Worker Bee */}
                                    <div className="flex gap-6 border-b border-gray-200 pb-6">
                                        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg p-2 border border-gray-300">
                                            <div className="w-full h-full scale-[1.5] relative">
                                                {unlockedLore.includes('worker') ? <WorkerBeeSVG/> : <div className="w-full h-full text-4xl text-gray-400 flex items-center justify-center font-bold">?</div>}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2">1. 工蜂：盲目的齿轮</h4>
                                            {unlockedLore.includes('worker') ? (
                                                <>
                                                    <p className="text-sm text-gray-600 mb-2">受规训最深的群体，不仅是被压迫者，更是维持压迫体系运转的共谋。</p>
                                                    <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                                                        {unlockedLore.includes('worker_sleeping') && <li><strong>沉睡者：</strong>连梦境都被规训，镇静剂对其是一种谋杀式的解脱。</li>}
                                                        {unlockedLore.includes('worker_glutton') && <li><strong>暴食者：</strong>无限进食，失去生物乐趣，沦为容器。</li>}
                                                        {unlockedLore.includes('worker_nurse') && <li><strong>监护者：</strong>将“监视”等同于对幼虫的爱。</li>}
                                                        {unlockedLore.includes('worker_proc') && <li><strong>处理员：</strong>用“回收”自我催眠，拒绝看到谋杀的本质。</li>}
                                                        {unlockedLore.includes('worker_record') && <li><strong>记录员：</strong>监视别人的人自己也在被监视，对外围数据流异常感到惊恐。</li>}
                                                        {unlockedLore.includes('worker_scientist') && <li><strong>研究员：</strong>将同类作为测试耗材，对系统的残忍习以为常。</li>}
                                                    </ul>
                                                </>
                                            ) : (
                                                <p className="text-gray-400 italic">尚未深入观察那些忙碌的底层躯干。它们似乎没有个人意志。</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Soldier Bee */}
                                    <div className="flex gap-6 border-b border-gray-200 pb-6">
                                        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg p-2 border border-gray-300">
                                            <div className="w-full h-full scale-[1.5] relative">
                                                {unlockedLore.includes('soldier') ? <SoldierBeeSVG/> : <div className="w-full h-full text-4xl text-gray-400 flex items-center justify-center font-bold">?</div>}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2">2. 兵蜂：暴力的具象</h4>
                                            {unlockedLore.includes('soldier') ? (
                                                <>
                                                    <p className="text-sm text-gray-600 mb-2">他们不再生产，是规训失败时的兜底手段——惩罚与抹除。</p>
                                                    <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                                                        {unlockedLore.includes('soldier_guard') && <li><strong>看守：</strong>认为“透明是强者的武器”，把自由思想视为癌细胞。</li>}
                                                        {unlockedLore.includes('soldier_royal') && <li><strong>守卫：</strong>代表绝对理性与冰冷。但当僵化逻辑遇到“不存在的事物”时，会暴露出死机的荒谬。</li>}
                                                    </ul>
                                                </>
                                            ) : (
                                                <p className="text-gray-400 italic">尚未接触那些维持秩序的暴力机器。最好离它们的红眼远点。</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Old Bee */}
                                    <div className="flex gap-6 border-b border-gray-200 pb-6">
                                        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg p-2 border border-gray-300">
                                            <div className="w-full h-full scale-[1.5] relative">
                                                {unlockedLore.includes('oldbee') ? <OldBeeSVG/> : <div className="w-full h-full text-4xl text-gray-400 flex items-center justify-center font-bold">?</div>}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2">3. 被遗忘者：历史的残骸</h4>
                                            {unlockedLore.includes('oldbee') ? (
                                                <>
                                                    <p className="text-sm text-gray-600 mb-2">在这个不容许历史存在的蜂巢里，老蜂是记忆的活化石。</p>
                                                    <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                                                        {unlockedLore.includes('oldbee_archivist') && <li><strong>档案管理员：</strong>看透了历史被不断重写的本质。揭示了这里装的不过是被塞进六边形模具的柔软灵魂。</li>}
                                                        {unlockedLore.includes('oldbee_forgotten') && <li><strong>被遗忘者：</strong>闻到了秩序腐烂的味道，但他们害怕外面的深渊，因为离开六边形就再也无法拼凑完整。</li>}
                                                    </ul>
                                                </>
                                            ) : (
                                                <p className="text-gray-400 italic">尚未找到那些被系统判定为无效并抛弃的残骸。</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Larva */}
                                    <div className="flex gap-6 border-b border-gray-200 pb-6">
                                        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg p-2 border border-gray-300">
                                            <div className="w-full h-full scale-[1.5] relative">
                                                {unlockedLore.includes('larva') ? <LarvaSVG/> : <div className="w-full h-full text-4xl text-gray-400 flex items-center justify-center font-bold">?</div>}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2">4. 幼虫：尚未成型</h4>
                                            {unlockedLore.includes('larva') ? (
                                                <p className="text-sm text-gray-700 mb-2">一出生被赋予坐标而非名字。躲藏寻找阴影是它们仅存的对隐私的渴望。带有斑纹的（独一无二的印记）会被无情抹杀。</p>
                                            ) : (
                                                <p className="text-gray-400 italic">尚未踏入育婴室，未见证规训是如何从出生前开始的。</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Environment */}
                                    <div className="flex gap-6">
                                        <div className="w-24 h-24 flex-shrink-0 bg-[#FFFAF0] rounded-lg border-2 border-honey-main p-2 flex flex-col items-center justify-center overflow-hidden relative">
                                            <div className="absolute inset-0">
                                                <HoneyPoolSVG />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2 text-sweet-pink">环境：沉默的压迫者</h4>
                                            <p className="text-sm text-gray-600 mb-2"><strong>粉碎齿轮与处理缸：</strong>不顺从即液化。<br/><strong>蜂蜜池：</strong>庞大的剥削隐喻。每一滴都是工蜂时间的粘稠液化体。</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #000;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #333;
                }
            `}</style>
        </div>
    );
};
