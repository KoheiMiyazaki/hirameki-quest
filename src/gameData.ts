/**
 * ==========================================================================
 * 【共通ハーネスルール 1. データの分離と拡張性の確保（拡張性ハーネス）】
 * すべての可変データ（敵キャラクター、クイズ問題、装備アイテム、計算ルール）を
 * ロジックから完全に分離して一括定義。
 * 中身を書き換えるだけで別内容のアプリ（算数・国語・英語など）に変身可能。
 * ==========================================================================
 */

export type MonsterSvgType =
  | 'elephant'
  | 'bear'
  | 'goblin'
  | 'wolf'
  | 'dragon'
  // 🍔 食べ物 × 生き物
  | 'pudding_tyranno'
  | 'omurice_lion'
  | 'melon_panda'
  | 'fried_shrimp_rhino'
  | 'taiyaki_shark'
  // 📺 家電 × 生き物
  | 'dryer_chameleon'
  | 'roomba_penguin'
  | 'camera_ladybug'
  | 'toaster_rabbit'
  | 'tv_wolf'
  // ⚽ スポーツ × 生き物
  | 'boxing_koala'
  | 'tennis_raptor'
  | 'baseball_horse'
  | 'bowling_gorilla'
  | 'swimming_kappa'
  // ✈️ 乗り物 × 生き物
  | 'patrol_fox'
  | 'drill_mole'
  | 'excavator_saurus'
  | 'helicopter_hawk'
  | 'bicycle_otter'
  // 🏎️ クルマ・ザ・マッハ
  | 'car_the_mach'
  // 🏹 スケルトン・ゼロ・ブローク
  | 'skeleton_zero_broke'
  // 🛏️ ベッド・ヘッド
  | 'bed_head'
  // 👑 強敵ボスキャラクター（3ステージ毎に出現）
  | 'inferno_dragon'
  | 'ancient_golem'
  | 'archdemon_lord'
  | 'metal_caterpillar_bo';

export interface EnemyDefinition {
  id: string;
  name: string;
  categoryTag?: string; // モチーフジャンル
  svgType: MonsterSvgType;
  /* TODO: 画像差し替え用パス（将来本物のpng/jpgに差し替える場合はこちらを指定） */
  imagePath?: string | null;
  bgGradient: string;
  flavor: string;
  isBoss?: boolean;
}

/**
 * 👑 ボスキャラクター専用データ定義
 * （通常モンスターと明確に分離し、今後の追加・管理を容易に保つ）
 */
export interface BossDefinition extends EnemyDefinition {
  isBoss: true;
  bossTitle: string;        // 例: 「灼熱の暴君」
  bossSubtitleEn: string;   // 例: "INFERNO DRAGON"
  introQuote: string;       // カットイン時の決め台詞
  themeColor: 'red' | 'cyan' | 'purple' | 'orange' | 'silver';
  auraRgb: string;          // 演出用RGB
}

export interface QuizQuestion {
  id: string;
  category: 'math' | 'words' | 'riddle';
  categoryLabel: string;
  question: string;
  subQuestion?: string; // 補足や読みやすさ用
  choices: [string, string, string];
  answerIndex: 0 | 1 | 2;
  explanation: string;
}

export interface WeaponItem {
  id: string;
  name: string;
  attackBonus: number;
  iconType: 'none' | 'wooden_sword' | 'iron_sword' | 'diamond_sword';
  price: number;
  /* TODO: 画像差し替え用パス */
  imagePath?: string | null;
  isLocked?: boolean;
  lockReason?: string;
}

export interface ArmorItem {
  id: string;
  name: string;
  defenseBonus: number;
  iconType: 'none' | 'leather_armor' | 'iron_armor' | 'diamond_armor';
  price: number;
  /* TODO: 画像差し替え用パス */
  imagePath?: string | null;
  isLocked?: boolean;
  lockReason?: string;
}

export interface GameConfig {
  scoreMultiplierPerAttack: number;
  scorePerCorrectAnswer: number; // 問題正解時の獲得スコア（一律100点）
  // ステージごとの敵HP計算式
  calculateEnemyHp: (stage: number) => number;
  // ステージごとの敵基礎攻撃力計算式
  calculateEnemyAttack: (stage: number) => number;
  playerInitialHp: number;
  playerBaseAttack: number;
}

// --- ゲーム難易度・計算パラメータ（要望に準拠） ---
export const GAME_CONFIG: GameConfig = {
  scoreMultiplierPerAttack: 100,
  scorePerCorrectAnswer: 100, // 正解時は一律100点加算
  // 初期HPは3、ステージが5つ進むごとに+1加算
  calculateEnemyHp: (stage: number) => {
    return 3 + Math.floor((stage - 1) / 5);
  },
  // ステージ1で攻撃力:1、ステージ毎に+0.5（小数点以下切り捨て）
  calculateEnemyAttack: (stage: number) => {
    return Math.floor(1 + (stage - 1) * 0.5);
  },
  playerInitialHp: 5,
  playerBaseAttack: 1,
};

// --- 敵キャラクター一覧（20体の新ユニークモンスター + 初代ゾンビエレファント） ---
export const ENEMY_LIST: EnemyDefinition[] = [
  // 🍔 食べ物 × 生き物
  {
    id: 'pudding_tyranno',
    name: 'プリンティラノ',
    categoryTag: '🍔 食べ物×生き物',
    svgType: 'pudding_tyranno',
    /* TODO: 画像差し替え用パス: '/assets/images/enemies/pudding_tyranno.png' */
    imagePath: null,
    bgGradient: 'from-amber-950 via-zinc-900 to-black',
    flavor: 'プルプル ゆれる カラメルソースの きょうりゅう（恐竜）！',
  },
  // {
  //   id: 'omurice_lion',
  //   name: 'オムライスライオン',
  //   categoryTag: '🍔 食べ物×生き物',
  //   svgType: 'omurice_lion',
  //   /* TODO: 画像差し替え用パス: '/assets/images/enemies/omurice_lion.png' */
  //   imagePath: null,
  //   bgGradient: 'from-yellow-950 via-zinc-900 to-black',
  //   flavor: 'ふわふわ タマゴの たてがみをもつ 百じゅう（ひゃくじゅう）の 王（おう）さま！',
  // },
  {
    id: 'melon_panda',
    name: 'メロンパンダ',
    categoryTag: '🍔 食べ物×生き物',
    svgType: 'melon_panda',
    /* TODO: 画像差し替え用パス: '/assets/images/enemies/melon_panda.png' */
    imagePath: null,
    bgGradient: 'from-emerald-950 via-zinc-900 to-black',
    flavor: 'サクサク あまい メロンパンの もようをつけた パンダ！',
  },
  // {
  //   id: 'fried_shrimp_rhino',
  //   name: 'エビフライノセロス',
  //   categoryTag: '🍔 食べ物×生き物',
  //   svgType: 'fried_shrimp_rhino',
  //   /* TODO: 画像差し替え用パス: '/assets/images/enemies/fried_shrimp_rhino.png' */
  //   imagePath: null,
  //   bgGradient: 'from-orange-950 via-zinc-900 to-black',
  //   flavor: 'サクサクの エビのシッポの ツノをもつ つよい サイ！',
  // },
  {
    id: 'taiyaki_shark',
    name: 'たいやきシャーク',
    categoryTag: '🍔 食べ物×生き物',
    svgType: 'taiyaki_shark',
    /* TODO: 画像差し替え用パス: '/assets/images/enemies/taiyaki_shark.png' */
    imagePath: null,
    bgGradient: 'from-amber-950 via-zinc-900 to-black',
    flavor: 'あんこが ぎっしり つまった こんがりヤキの サメ（鮫）！',
  },

  // 📺 家電 × 生き物
  // {
  //   id: 'dryer_chameleon',
  //   name: 'ドライヤーカメレオン',
  //   categoryTag: '📺 家電×生き物',
  //   svgType: 'dryer_chameleon',
  //   /* TODO: 画像差し替え用パス: '/assets/images/enemies/dryer_chameleon.png' */
  //   imagePath: null,
  //   bgGradient: 'from-cyan-950 via-zinc-900 to-black',
  //   flavor: 'あったかい ぬくぬくの 風（かぜ）を ふきだす カメレオン！',
  // },
  {
    id: 'roomba_penguin',
    name: 'ルンバペンギン',
    categoryTag: '📺 家電×生き物',
    svgType: 'roomba_penguin',
    /* TODO: 画像差し替え用パス: '/assets/images/enemies/roomba_penguin.png' */
    imagePath: null,
    bgGradient: 'from-slate-900 via-zinc-900 to-black',
    flavor: 'おそうじしながら スイスイ すべる ロボットペンギン！',
  },
  // {
  //   id: 'camera_ladybug',
  //   name: 'てんとうむしカメラ',
  //   categoryTag: '📺 家電×生き物',
  //   svgType: 'camera_ladybug',
  //   /* TODO: 画像差し替え用パス: '/assets/images/enemies/camera_ladybug.png' */
  //   imagePath: null,
  //   bgGradient: 'from-red-950 via-zinc-900 to-black',
  //   flavor: 'ピカッと フラッシュをたく てんとう虫（むし）カメラ！',
  // },
  {
    id: 'toaster_rabbit',
    name: 'トースターウサギ',
    categoryTag: '📺 家電×生き物',
    svgType: 'toaster_rabbit',
    /* TODO: 画像差し替え用パス: '/assets/images/enemies/toaster_rabbit.png' */
    imagePath: null,
    bgGradient: 'from-stone-900 via-zinc-900 to-black',
    flavor: 'チン！と こんがりトーストが とびだす ウサギ（兎）！',
  },
  {
    id: 'tv_wolf',
    name: 'テレビオオカミ',
    categoryTag: '📺 家電×生き物',
    svgType: 'tv_wolf',
    /* TODO: 画像差し替え用パス: '/assets/images/enemies/tv_wolf.png' */
    imagePath: null,
    bgGradient: 'from-indigo-950 via-zinc-900 to-black',
    flavor: 'がめんに すなあらしを うつしながら ほえる オオカミ（狼）！',
  },

  // ⚽ スポーツ × 生き物
  // {
  //   id: 'boxing_koala',
  //   name: 'ボクシングコアラ',
  //   categoryTag: '⚽ スポーツ×生き物',
  //   svgType: 'boxing_koala',
  //   /* TODO: 画像差し替え用パス: '/assets/images/enemies/boxing_koala.png' */
  //   imagePath: null,
  //   bgGradient: 'from-red-950 via-zinc-900 to-black',
  //   flavor: 'まっかな グローブを はめた パワフルな コアラ！',
  // },
  {
    id: 'tennis_raptor',
    name: 'テニスラプトル',
    categoryTag: '⚽ スポーツ×生き物',
    svgType: 'tennis_raptor',
    /* TODO: 画像差し替え用パス: '/assets/images/enemies/tennis_raptor.png' */
    imagePath: null,
    bgGradient: 'from-lime-950 via-zinc-900 to-black',
    flavor: 'はやい サーブを くりだす すばやい きょうりゅう（恐竜）！',
  },
  // {
  //   id: 'baseball_horse',
  //   name: 'やきゅうウマ',
  //   categoryTag: '⚽ スポーツ×生き物',
  //   svgType: 'baseball_horse',
  //   /* TODO: 画像差し替え用パス: '/assets/images/enemies/baseball_horse.png' */
  //   imagePath: null,
  //   bgGradient: 'from-blue-950 via-zinc-900 to-black',
  //   flavor: 'ホームランを ねらう ユニフォームすがたの 馬（うま）！',
  // },
  // {
  //   id: 'bowling_gorilla',
  //   name: 'ボウリングゴリラ',
  //   categoryTag: '⚽ スポーツ×生き物',
  //   svgType: 'bowling_gorilla',
  //   /* TODO: 画像差し替え用パス: '/assets/images/enemies/bowling_gorilla.png' */
  //   imagePath: null,
  //   bgGradient: 'from-zinc-900 via-zinc-900 to-black',
  //   flavor: 'ストライクを れんぱつする 力（ちから）もちの ゴリラ！',
  // },
  {
    id: 'swimming_kappa',
    name: 'スイミングカッパ',
    categoryTag: '⚽ スポーツ×生き物',
    svgType: 'swimming_kappa',
    /* TODO: 画像差し替え用パス: '/assets/images/enemies/swimming_kappa.png' */
    imagePath: null,
    bgGradient: 'from-teal-950 via-zinc-900 to-black',
    flavor: 'ゴーグルをつけて プールを スイスイ およぐ カッパ！',
  },

  // ✈️ 乗り物 × 生き物
  // {
  //   id: 'patrol_fox',
  //   name: 'パトカーキツネ',
  //   categoryTag: '✈️ 乗り物×生き物',
  //   svgType: 'patrol_fox',
  //   /* TODO: 画像差し替え用パス: '/assets/images/enemies/patrol_fox.png' */
  //   imagePath: null,
  //   bgGradient: 'from-sky-950 via-zinc-900 to-black',
  //   flavor: 'ウーウー！ サイレンをならして パトロールする キツネ（狐）のおまわりさん！',
  // },
  {
    id: 'drill_mole',
    name: 'ドリルモグラ',
    categoryTag: '✈️ 乗り物×生き物',
    svgType: 'drill_mole',
    /* TODO: 画像差し替え用パス: '/assets/images/enemies/drill_mole.png' */
    imagePath: null,
    bgGradient: 'from-amber-950 via-zinc-900 to-black',
    flavor: 'おおきな ドリルで じめん（地面）を ほりまくる モグラ！',
  },
  {
    id: 'excavator_saurus',
    name: 'ショベルカーザウルス',
    categoryTag: '✈️ 乗り物×生き物',
    svgType: 'excavator_saurus',
    /* TODO: 画像差し替え用パス: '/assets/images/enemies/excavator_saurus.png' */
    imagePath: null,
    bgGradient: 'from-yellow-950 via-zinc-900 to-black',
    flavor: 'ながい くびをもつ ショベルカーの きょうりゅう（恐竜）！',
  },
  // {
  //   id: 'helicopter_hawk',
  //   name: 'ヘリコプタカ',
  //   categoryTag: '✈️ 乗り物×生き物',
  //   svgType: 'helicopter_hawk',
  //   /* TODO: 画像差し替え用パス: '/assets/images/enemies/helicopter_hawk.png' */
  //   imagePath: null,
  //   bgGradient: 'from-sky-950 via-zinc-900 to-black',
  //   flavor: 'プロペラで 大空（おおぞら）を とぶ タカ（鷹）！',
  // },
  {
    id: 'bicycle_otter',
    name: 'チャリンコラッコ',
    categoryTag: '✈️ 乗り物×生き物',
    svgType: 'bicycle_otter',
    /* TODO: 画像差し替え用パス: '/assets/images/enemies/bicycle_otter.png' */
    imagePath: null,
    bgGradient: 'from-blue-950 via-zinc-900 to-black',
    flavor: 'チリンチリン！ 自転車（じてんしゃ）を こいで はしる ラッコ！',
  },
  // 🏎️ クルマ・ザ・マッハ
  {
    id: 'car_the_mach',
    name: 'クルマ・ザ・マッハ',
    categoryTag: '🏎️ レースマシン',
    svgType: 'car_the_mach',
    /* TODO: 画像差し替え用パス: '/assets/images/enemies/car_the_mach.png' */
    imagePath: null,
    bgGradient: 'from-red-950 via-zinc-900 to-black',
    flavor: 'こうそくで おいかけてくる スピードレーサー！',
  },
  // 🏹 スケルトン・ゼロ・ブローク
  {
    id: 'skeleton_zero_broke',
    name: 'スケルトン・ゼロ・ブローク',
    categoryTag: '🏹 スケルトン',
    svgType: 'skeleton_zero_broke',
    /* TODO: 画像差し替え用パス: '/assets/images/enemies/skeleton_zero_broke.png' */
    imagePath: null,
    bgGradient: 'from-amber-950 via-zinc-900 to-black',
    flavor: '弓矢（ゆみや）で きみを ねらいうつぞ！きをつけろ！',
  },
  // 🛏️ ベッド・ヘッド
  {
    id: 'bed_head',
    name: 'ベッド・ヘッド',
    categoryTag: '🛏️ 家具',
    svgType: 'bed_head',
    /* TODO: 画像差し替え用パス: '/assets/images/enemies/bed_head.png' */
    imagePath: null,
    bgGradient: 'from-amber-950 via-zinc-900 to-black',
    flavor: 'ぼくで ねると ランダムで どこかに つれていくぞ！',
  },
  // 初代ゾンビエレファント
  {
    id: 'zombie_elephant',
    name: 'ゾンビエレファント',
    categoryTag: '💀 モンスター',
    svgType: 'elephant',
    /* TODO: 画像差し替え用パス: '/assets/images/enemies/zombie_elephant.png' */
    imagePath: null,
    bgGradient: 'from-purple-950 via-zinc-900 to-black',
    flavor: 'ドシーン！ かいぞくの ぼうしを かぶった ゾウ（象）のゾンビ！',
  },
];

/**
 * ==========================================================================
 * 👑 ボスキャラクター一覧（3ステージクリア毎に降臨する強大な大ボスたち）
 * 通常モンスターとは独立して管理され、今後も自由にボスを追加可能
 * ==========================================================================
 */
export const BOSS_LIST: BossDefinition[] = [
  // 1. インフェルノ・ドラゴン（王道RPGの灼熱の巨竜）
  {
    id: 'boss_inferno_dragon',
    name: 'インフェルノ・ドラゴン',
    bossTitle: '灼熱（しゃくねつ）の暴君（ぼうくん）',
    bossSubtitleEn: 'INFERNO DRAGON',
    categoryTag: '👑 大ボス',
    svgType: 'inferno_dragon',
    imagePath: null,
    bgGradient: 'from-red-950 via-zinc-950 to-black',
    flavor: 'マグマから目覚（めざ）めた紅蓮（ぐれん）の竜（りゅう）！炎（ほのお）で全（すべ）てを燃（も）やすぞ！',
    introQuote: '「グオオオッ！ 我（わ）が紅蓮（ぐれん）の業火（ごうか）に耐（た）えられるかな！？」',
    themeColor: 'red',
    auraRgb: '239, 68, 68',
    isBoss: true,
  },
  // 2. エンシェント・ゴーレム（古代文明の巨神）
  {
    id: 'boss_ancient_golem',
    name: 'エンシェント・ゴーレム',
    bossTitle: '古代（こだい）遺跡（いせき）の巨神（きょしん）',
    bossSubtitleEn: 'ANCIENT GOLEM',
    categoryTag: '👑 大ボス',
    svgType: 'ancient_golem',
    imagePath: null,
    bgGradient: 'from-cyan-950 via-zinc-950 to-black',
    flavor: '古代（こだい）の遺跡（いせき）を守（まも）る、青（あお）い魔力（まりょく）の巨神（きょしん）ゴーレム！',
    introQuote: '「侵入者（しんにゅうしゃ）……排除（はいじょ）……！ 古代（こだい）の怒（いか）りを喰（く）らえ……！」',
    themeColor: 'cyan',
    auraRgb: '6, 182, 212',
    isBoss: true,
  },
  // 3. 魔王 アークデーモン（暗黒次元の支配者）
  {
    id: 'boss_archdemon_lord',
    name: '魔王（まおう） アークデーモン',
    bossTitle: '深淵（しんえん）の支配者（しはいしゃ）',
    bossSubtitleEn: 'ARCHDEMON OVERLORD',
    categoryTag: '👑 大ボス',
    svgType: 'archdemon_lord',
    imagePath: null,
    bgGradient: 'from-purple-950 via-zinc-950 to-black',
    flavor: '闇（やみ）の世界（せかい）から現（あらわ）れた、漆黒（しっこく）の力（ちから）をもつ大魔王（だいまおう）！',
    introQuote: '「ククク……愚（おろ）かな人間（にんげん）よ、我（わ）が闇（やみ）にひれ伏（ふ）すがよい！」',
    themeColor: 'purple',
    auraRgb: '168, 85, 247',
    isBoss: true,
  },
  // 4. メタルいもむし・ボー（全身メタルの巨大いもむし・肩にオレンジマーク・足元からジェット炎で飛行）
  {
    id: 'boss_metal_caterpillar_bo',
    name: 'メタルいもむし・ボー',
    bossTitle: '鋼鉄（こうてつ）の飛翔（ひしょう）巨虫（きょちゅう）',
    bossSubtitleEn: 'METAL CATERPILLAR BO',
    categoryTag: '👑 大ボス',
    svgType: 'metal_caterpillar_bo',
    imagePath: null,
    bgGradient: 'from-slate-900 via-zinc-950 to-black',
    flavor: '全身（ぜんしん）メタルの巨大（きょだい）いもむし！肩（かた）にオレンジの丸（まる）いマークがあり、足元（あしもと）のジェット炎（ほのお）で大空（おおぞら）をとぶぞ！',
    introQuote: '「キィーーン！我（わ）が鋼鉄（こうてつ）の巨体（きょたい）とジェットの炎（ほのお）を見（み）よ！」',
    themeColor: 'orange',
    auraRgb: '249, 115, 22',
    isBoss: true,
  },
];

/**
 * ランダムなボスキャラを選定（直前のボスと被らない）
 */
export const getRandomBoss = (excludeId?: string): BossDefinition => {
  const filtered = excludeId ? BOSS_LIST.filter((b) => b.id !== excludeId) : BOSS_LIST;
  const pool = filtered.length > 0 ? filtered : BOSS_LIST;
  return pool[Math.floor(Math.random() * pool.length)];
};

// --- プレイヤー武器データ ---
export const WEAPON_LIST: WeaponItem[] = [
  {
    id: 'none',
    name: 'なし',
    attackBonus: 0,
    iconType: 'none',
    price: 0,
    imagePath: null,
    isLocked: false,
  },
  {
    id: 'wooden_sword',
    name: '木のけん',
    attackBonus: 3,
    iconType: 'wooden_sword',
    price: 50,
    imagePath: null,
    isLocked: false,
  },
  {
    id: 'iron_sword',
    name: '鉄のつるぎ',
    attackBonus: 5,
    iconType: 'iron_sword',
    price: 120,
    imagePath: null,
    isLocked: false,
  },
  {
    id: 'diamond_sword',
    name: 'ダイヤのけん',
    attackBonus: 10,
    iconType: 'diamond_sword',
    price: 300,
    imagePath: null,
    isLocked: false,
  },
];

// --- プレイヤー防具データ ---
export const ARMOR_LIST: ArmorItem[] = [
  {
    id: 'none',
    name: 'なし',
    defenseBonus: 0,
    iconType: 'none',
    price: 0,
    imagePath: null,
    isLocked: false,
  },
  {
    id: 'leather_armor',
    name: '皮のふく',
    defenseBonus: 2,
    iconType: 'leather_armor',
    price: 40,
    imagePath: null,
    isLocked: false,
  },
  {
    id: 'iron_armor',
    name: '鉄のよろい',
    defenseBonus: 4,
    iconType: 'iron_armor',
    price: 100,
    imagePath: null,
    isLocked: false,
  },
  {
    id: 'diamond_armor',
    name: 'ダイヤのぼうぐ',
    defenseBonus: 8,
    iconType: 'diamond_armor',
    price: 250,
    imagePath: null,
    isLocked: false,
  },
];

// --- クイズ問題データ（幼稚園児〜小学校低学年向け：ひらがな中心＆かんたん漢字） ---
export const QUIZ_DATABASE: QuizQuestion[] = [
  // 算数・かず
  {
    id: 'q1',
    category: 'math',
    categoryLabel: 'さんすう',
    question: '1 + 2 は？',
    choices: ['1', '3', '4'],
    answerIndex: 1,
    explanation: '1 と 2 を あわせると 3 だね！',
  },
  {
    id: 'q2',
    category: 'math',
    categoryLabel: 'さんすう',
    question: '2 + 3 は？',
    choices: ['5', '6', '4'],
    answerIndex: 0,
    explanation: '2 に 3 を たすと 5 だよ！',
  },
  {
    id: 'q3',
    category: 'math',
    categoryLabel: 'さんすう',
    question: '5 - 2 は？',
    choices: ['2', '4', '3'],
    answerIndex: 2,
    explanation: '5 から 2 を ひくと 3 だね！',
  },
  {
    id: 'q4',
    category: 'math',
    categoryLabel: 'さんすう',
    question: '3 + 4 は？',
    choices: ['7', '8', '6'],
    answerIndex: 0,
    explanation: '3 + 4 は 7 だよ！せいかい！',
  },
  {
    id: 'q5',
    category: 'math',
    categoryLabel: 'さんすう',
    question: 'りんごが 2こ、みかんが 2こ。ぜんぶで なんこ？',
    choices: ['3こ', '4こ', '5こ'],
    answerIndex: 1,
    explanation: '2 + 2 = 4こ だね！',
  },
  {
    id: 'q6',
    category: 'math',
    categoryLabel: 'さんすう',
    question: '4 + 5 は？',
    choices: ['8', '10', '9'],
    answerIndex: 2,
    explanation: '4 + 5 は 9 だよ！すごい！',
  },
  {
    id: 'q7',
    category: 'math',
    categoryLabel: 'さんすう',
    question: '10 - 4 は？',
    choices: ['6', '5', '7'],
    answerIndex: 0,
    explanation: '10 から 4 を ひくと 6 だね！',
  },
  {
    id: 'q8',
    category: 'math',
    categoryLabel: 'さんすう',
    question: 'さんかく（三角形）の かど（角）は いくつ？',
    choices: ['2つ', '3つ', '4つ'],
    answerIndex: 1,
    explanation: 'さんかくは 3つの かどが あるよ！',
  },

  // ことば・どうぶつ
  {
    id: 'q9',
    category: 'words',
    categoryLabel: 'ことば',
    question: '「いぬ」の なきごえは どれ？',
    choices: ['ワンワン', 'ニャーニャー', 'モーモー'],
    answerIndex: 0,
    explanation: 'いぬは ワンワン と なくよ！',
  },
  {
    id: 'q10',
    category: 'words',
    categoryLabel: 'ことば',
    question: 'あかい くだものは どれかな？',
    choices: ['バナナ', 'イチゴ', 'メロン'],
    answerIndex: 1,
    explanation: 'イチゴは まっかで あまくて おいしいね！',
  },
  {
    id: 'q11',
    category: 'words',
    categoryLabel: 'ことば',
    question: 'うみ（海）を およぐ いきものは どれ？',
    choices: ['イルカ', 'キリン', 'スズメ'],
    answerIndex: 0,
    explanation: 'イルカは うみを スイスイ およぐよ！',
  },
  {
    id: 'q12',
    category: 'words',
    categoryLabel: 'ことば',
    question: 'たいよう（太陽）は どっちから のぼる？',
    choices: ['ひがし（東）', 'にし（西）', 'みなみ（南）'],
    answerIndex: 0,
    explanation: 'たいようは ひがしから のぼるよ！',
  },

  // なぞなぞ・ひらめき
  {
    id: 'q13',
    category: 'riddle',
    categoryLabel: 'なぞなぞ',
    question: 'パンは パンでも たべられない パンは なーんだ？',
    choices: ['アンパン', 'フライパン', 'メロンパン'],
    answerIndex: 1,
    explanation: 'りょうりをつくる フライパン だよ！',
  },
  {
    id: 'q14',
    category: 'riddle',
    categoryLabel: 'なぞなぞ',
    question: 'いつも はな（鼻）が ながーい どうぶつは？',
    choices: ['ウサギ', 'ゾウ', 'ライオン'],
    answerIndex: 1,
    explanation: 'ながーい おはなの ゾウさん！',
  },
  {
    id: 'q15',
    category: 'riddle',
    categoryLabel: 'なぞなぞ',
    question: 'あめ（雨）の ひに ひらく おはなのような ものは？',
    choices: ['かさ（傘）', 'ながぐつ', 'カッパ'],
    answerIndex: 0,
    explanation: 'パッと ひらく かさ だね！',
  },
];

/**
 * ==========================================================================
 * さんすう問題 難易度レベル設定テーブル
 * 【共通ハーネスルール 1. データの分離と拡張性の確保（拡張性ハーネス）】
 * 「何ステージクリアすれば次の難易度へ進むか」を手作業で自由に変更できるパラメータ
 * ==========================================================================
 */
export interface MathDifficultyStageRule {
  level: number;
  title: string;
  description: string;
  /** この難易度をクリアするステージ数（手作業で自由に変更可能！例: 5なら5ステージ分出題） */
  stagesToClear: number;
  type:
    | 'single_digits'      // レベル1: 1桁の足し算・引き算（ステージ1〜10対応）
    | 'single_basic'       // 互換用
    | 'single_standard'    // 互換用
    | 'double_and_single'  // レベル2: 2桁と1桁の足し算・引き算
    | 'three_single'       // レベル3: 3つの一桁の足し算・引き算
    | 'double_and_double'  // レベル4: 2桁と2桁の足し算・引き算
    | 'three_double';      // レベル5: 3つの二桁の足し算・引き算
}

export const MATH_DIFFICULTY_RULES: MathDifficultyStageRule[] = [
  {
    level: 1,
    title: '1桁の足し算引き算',
    description: '1桁同士の計算（ステージ1〜9：ボス3体討伐まで）',
    stagesToClear: 9, // ★一律9ステージ（ボス3体討伐でレベルアップ）
    type: 'single_digits',
  },
  {
    level: 2,
    title: '2桁と1桁の足し算・引き算',
    description: '二桁の数字と一桁の数字の計算（例: 24 + 5, 38 - 6）',
    stagesToClear: 9, // ステージ10〜18（ボス3体討伐でレベルアップ）
    type: 'double_and_single',
  },
  {
    level: 3,
    title: '3つの1桁の足し算・引き算',
    description: '3つの一桁の数字の計算（例: 3 + 2 + 4, 8 - 3 + 2）',
    stagesToClear: 9, // ステージ19〜27（ボス3体討伐でレベルアップ）
    type: 'three_single',
  },
  {
    level: 4,
    title: '2桁と2桁の足し算・引き算',
    description: '二桁同士の本格的な計算（例: 24 + 35, 68 - 25）',
    stagesToClear: 9, // ステージ28〜36（ボス3体討伐でレベルアップ）
    type: 'double_and_double',
  },
  {
    level: 5,
    title: '3つの2桁の足し算・引き算',
    description: '3つの二桁の数字の計算（例: 12 + 25 + 10, 65 - 20 - 15）',
    stagesToClear: 9999, // ★最終レベル（ステージ37以降）
    type: 'three_double',
  },
];

/**
 * 各難易度のステージ範囲を計算するヘルパー関数
 */
export function getMathDifficultyRanges() {
  let currentStart = 1;
  return MATH_DIFFICULTY_RULES.map((rule, idx) => {
    const isLast = idx === MATH_DIFFICULTY_RULES.length - 1;
    const start = currentStart;
    const end = isLast ? 9999 : currentStart + rule.stagesToClear - 1;
    currentStart = end + 1;
    return {
      ...rule,
      startStage: start,
      endStage: end,
      isUnlimited: isLast,
    };
  });
}

/**
 * 現在のステージ番号から該当する難易度ルールを取得
 */
export function getMathDifficultyForStage(stage: number): MathDifficultyStageRule {
  const ranges = getMathDifficultyRanges();
  const found = ranges.find((r) => stage >= r.startStage && stage <= r.endStage);
  return found || ranges[ranges.length - 1];
}

/**
 * ==========================================================================
 * ステージ連動 算数問題自動生成ジェネレーター
 * ==========================================================================
 */
export function generateStageMathQuestion(stage: number): QuizQuestion {
  const currentRule = getMathDifficultyForStage(stage);
  let formulaQuestion = '';
  let ans = 0;
  let explanation = '';

  switch (currentRule.type) {
    case 'single_digits':
    case 'single_basic':
    case 'single_standard': {
      // レベル1: 1桁の足し算・引き算（ステージ1〜10対応）
      const isAdd = Math.random() < 0.5;
      if (isAdd) {
        // 1桁の足し算（1..9 + 1..9、答え2..18）
        const a = Math.floor(Math.random() * 9) + 1; // 1..9
        const b = Math.floor(Math.random() * 9) + 1; // 1..9
        ans = a + b;
        formulaQuestion = `${a} + ${b} は？`;
        explanation = `${a} + ${b} は ${ans} だね！`;
      } else {
        // 1桁の引き算（2..9 − 1..(a-1)、引かれる数も引く数も1桁）
        const a = Math.floor(Math.random() * 8) + 2; // 2..9 (1桁)
        const b = Math.floor(Math.random() * (a - 1)) + 1; // 1..(a-1) (1桁)
        ans = a - b;
        formulaQuestion = `${a} − ${b} は？`;
        explanation = `${a} − ${b} は ${ans} だね！`;
      }
      break;
    }

    case 'double_and_single': {
      // レベル2: 2桁と1桁の足し算・引き算
      const isAdd = Math.random() < 0.5;
      if (isAdd) {
        const a = Math.floor(Math.random() * 80) + 10; // 10..89
        const b = Math.floor(Math.random() * 9) + 1;   // 1..9
        ans = a + b;
        formulaQuestion = `${a} + ${b} は？`;
        explanation = `${a} + ${b} は ${ans} だね！`;
      } else {
        const a = Math.floor(Math.random() * 89) + 11; // 11..99
        const b = Math.floor(Math.random() * 9) + 1;   // 1..9
        ans = a - b;
        formulaQuestion = `${a} − ${b} は？`;
        explanation = `${a} − ${b} は ${ans} だね！`;
      }
      break;
    }

    case 'three_single': {
      // レベル4: 3つの一桁の数字の足し算・引き算（例: 3 + 2 + 4, 8 − 3 + 2, 7 − 2 − 1）
      const pattern = Math.floor(Math.random() * 4); // 0: ++, 1: +-, 2: -+, 3: --
      if (pattern === 0) {
        // a + b + c
        const a = Math.floor(Math.random() * 7) + 1; // 1..7
        const b = Math.floor(Math.random() * 6) + 1; // 1..6
        const c = Math.floor(Math.random() * 6) + 1; // 1..6
        ans = a + b + c;
        formulaQuestion = `${a} + ${b} + ${c} は？`;
        explanation = `${a} + ${b} + ${c} は ${ans} だね！`;
      } else if (pattern === 1) {
        // a + b - c
        const a = Math.floor(Math.random() * 6) + 2; // 2..7
        const b = Math.floor(Math.random() * 6) + 2; // 2..7
        const sum = a + b;
        const c = Math.floor(Math.random() * Math.min(sum - 1, 8)) + 1;
        ans = sum - c;
        formulaQuestion = `${a} + ${b} − ${c} は？`;
        explanation = `${a} + ${b} − ${c} は ${ans} だね！`;
      } else if (pattern === 2) {
        // a - b + c
        const a = Math.floor(Math.random() * 5) + 5; // 5..9
        const b = Math.floor(Math.random() * (a - 1)) + 1;
        const c = Math.floor(Math.random() * 7) + 1;
        ans = (a - b) + c;
        formulaQuestion = `${a} − ${b} + ${c} は？`;
        explanation = `${a} − ${b} + ${c} は ${ans} だね！`;
      } else {
        // a - b - c
        const a = Math.floor(Math.random() * 4) + 6; // 6..9
        const b = Math.floor(Math.random() * (a - 3)) + 1;
        const c = Math.floor(Math.random() * (a - b - 1)) + 1;
        ans = a - b - c;
        formulaQuestion = `${a} − ${b} − ${c} は？`;
        explanation = `${a} − ${b} − ${c} は ${ans} だね！`;
      }
      break;
    }

    case 'double_and_double': {
      // レベル5: 2桁と2桁の足し算・引き算
      const isAdd = Math.random() < 0.5;
      if (isAdd) {
        const a = Math.floor(Math.random() * 40) + 10; // 10..49
        const b = Math.floor(Math.random() * 40) + 10; // 10..49
        ans = a + b;
        formulaQuestion = `${a} + ${b} は？`;
        explanation = `${a} + ${b} は ${ans} だね！`;
      } else {
        const a = Math.floor(Math.random() * 60) + 35; // 35..94
        const b = Math.floor(Math.random() * (a - 20)) + 10; // 10..(a-10)
        ans = a - b;
        formulaQuestion = `${a} − ${b} は？`;
        explanation = `${a} − ${b} は ${ans} だね！`;
      }
      break;
    }

    case 'three_double': {
      // レベル6: 3つの二桁の数字の足し算・引き算（例: 12 + 25 + 10, 60 − 20 − 15, 35 + 20 − 15）
      const pattern = Math.floor(Math.random() * 4); // 0: ++, 1: +-, 2: -+, 3: --
      if (pattern === 0) {
        // a + b + c
        const a = Math.floor(Math.random() * 25) + 10; // 10..34
        const b = Math.floor(Math.random() * 25) + 10; // 10..34
        const c = Math.floor(Math.random() * 25) + 10; // 10..34
        ans = a + b + c;
        formulaQuestion = `${a} + ${b} + ${c} は？`;
        explanation = `${a} + ${b} + ${c} は ${ans} だね！`;
      } else if (pattern === 1) {
        // a + b - c
        const a = Math.floor(Math.random() * 30) + 15; // 15..44
        const b = Math.floor(Math.random() * 30) + 15; // 15..44
        const sum = a + b;
        const c = Math.floor(Math.random() * Math.min(sum - 15, 30)) + 10;
        ans = sum - c;
        formulaQuestion = `${a} + ${b} − ${c} は？`;
        explanation = `${a} + ${b} − ${c} は ${ans} だね！`;
      } else if (pattern === 2) {
        // a - b + c
        const a = Math.floor(Math.random() * 40) + 40; // 40..79
        const b = Math.floor(Math.random() * (a - 20)) + 10;
        const c = Math.floor(Math.random() * 30) + 10;
        ans = (a - b) + c;
        formulaQuestion = `${a} − ${b} + ${c} は？`;
        explanation = `${a} − ${b} + ${c} は ${ans} だね！`;
      } else {
        // a - b - c
        const a = Math.floor(Math.random() * 30) + 65; // 65..94
        const b = Math.floor(Math.random() * 20) + 10; // 10..29
        const c = Math.floor(Math.random() * Math.min(a - b - 15, 25)) + 10;
        ans = a - b - c;
        formulaQuestion = `${a} − ${b} − ${c} は？`;
        explanation = `${a} − ${b} − ${c} は ${ans} だね！`;
      }
      break;
    }
  }

  // 誤答候補の作成（正解に近い値、重複なし、負数なし）
  const candidateOffsets = [1, -1, 2, -2, 10, -10, 3, -3, 5, -5];
  const uniqueWrongs: number[] = [];

  for (const offset of candidateOffsets.sort(() => Math.random() - 0.5)) {
    const candidate = ans + offset;
    if (candidate >= 0 && candidate !== ans && !uniqueWrongs.includes(candidate)) {
      uniqueWrongs.push(candidate);
      if (uniqueWrongs.length === 2) break;
    }
  }

  // 万一候補が不足した場合のフォールバック
  if (uniqueWrongs.length < 1) uniqueWrongs.push(ans + 1);
  if (uniqueWrongs.length < 2) uniqueWrongs.push(uniqueWrongs[0] + 1);

  // 3つの選択肢をシャッフル
  const choicesList = [ans, uniqueWrongs[0], uniqueWrongs[1]].sort(() => Math.random() - 0.5);
  const answerIndex = choicesList.indexOf(ans) as 0 | 1 | 2;

  return {
    id: `auto-math-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    category: 'math',
    categoryLabel: `さんすう(Lv.${currentRule.level})`,
    question: formulaQuestion,
    choices: [String(choicesList[0]), String(choicesList[1]), String(choicesList[2])],
    answerIndex,
    explanation,
  };
}

