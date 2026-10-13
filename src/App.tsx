/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useTransition } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  RotateCw,
  Sparkles,
  Trophy,
  Shield,
  Swords,
  ChevronRight,
  HelpCircle,
  Settings,
  Lock,
  Check,
  Home
} from 'lucide-react';
import {
  GAME_CONFIG,
  ENEMY_LIST,
  BOSS_LIST,
  getRandomBoss,
  BossDefinition,
  WEAPON_LIST,
  ARMOR_LIST,
  QUIZ_DATABASE,
  QuizQuestion,
  EnemyDefinition,
  WeaponItem,
  ArmorItem,
  generateStageMathQuestion,
  getMathDifficultyRanges,
  ScoreRankingEntry,
  formatRankingDate,
  normalizeRankingDate,
  DEFAULT_SCORE_RANKINGS,
} from './gameData.ts';
import { sound } from './audio.ts';
import { MonsterRenderer } from './components/MonsterRenderer.tsx';
import { WeaponIcon, ArmorIcon } from './components/ItemIcons.tsx';
import { CounterGauge } from './components/CounterGauge.tsx';
import { PWAInstallButton } from './components/PWAInstallButton.tsx';
import titleBgImg from './assets/images/title_bg_fantasy_1791719448731.jpg';

/**
 * 選択肢文字列の長さに応じて、ボタン枠を崩さず最大限の視認性を確保する動的フォントサイズ
 * 【要望1】ボタンサイズを完全に維持したまま、可能な限り大きな文字で子供でも見やすく表示
 */
const getChoiceFontSize = (text: string) => {
  const len = text.length;
  if (len <= 2) {
    // 1〜2文字（例: "5", "18", "99" など算数のほとんどの数字）
    return 'text-4xl sm:text-5xl font-black tracking-tight';
  }
  if (len <= 3) {
    // 3文字（例: "105", "イヌ", "サイ"）
    return 'text-3xl sm:text-4xl font-black tracking-tight';
  }
  if (len <= 4) {
    // 4文字（例: "ライオン", "キツネ", "リンゴ"）
    return 'text-2xl sm:text-3xl font-black tracking-tight';
  }
  if (len <= 6) {
    // 5〜6文字（例: "てんとうむし", "カメレオン"）
    return 'text-lg sm:text-xl font-extrabold leading-snug';
  }
  // 7文字以上
  return 'text-sm sm:text-base font-bold leading-tight';
};

/**
 * 問題文の文字長に応じた最適なフォントサイズ（UI枠崩れ防止＆最大視認性）
 * 短い算数問題は「text-4xl sm:text-5xl」の迫力ある特大文字で表示し、
 * なぞなぞ等の長い問題もカード枠内に美しく収まるよう最適化
 */
const getQuestionFontSize = (question: string, hasSubQuestion: boolean) => {
  const len = question.length;
  if (hasSubQuestion) {
    if (len <= 12) return 'text-2xl sm:text-3xl font-black';
    if (len <= 20) return 'text-xl sm:text-2xl font-black';
    return 'text-base sm:text-lg font-bold leading-snug';
  }
  // 算数問題などサブテキストがない場合（大部分のケース）
  if (len <= 10) {
    // 短い算数（例: "1 + 2 は？", "5 - 3 は？"）
    return 'text-4xl sm:text-5xl font-black tracking-wider';
  }
  if (len <= 16) {
    // 3つの数字の算数（例: "3 + 2 + 4 は？", "12 + 25 + 10 は？"）
    return 'text-3xl sm:text-4xl font-black tracking-wide';
  }
  if (len <= 25) {
    // 中くらいのなぞなぞ・ことば問題
    return 'text-xl sm:text-2xl font-black leading-snug';
  }
  // 長文のなぞなぞ
  return 'text-base sm:text-lg font-bold leading-snug';
};

export default function App() {
  // --- 1. ゲーム進行ステート ---
  const [stage, setStage] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [displayScore, setDisplayScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // 🏆 スコアランキングステート（Top 5リーダーボード用）
  const [rankingList, setRankingList] = useState<ScoreRankingEntry[]>(() => {
    try {
      const saved = localStorage.getItem('hirameki_score_ranking');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: ScoreRankingEntry) => ({
            ...item,
            dateStr: normalizeRankingDate(item),
          }));
        }
      }
    } catch {}
    return DEFAULT_SCORE_RANKINGS;
  });
  // 直近でランクインした記録の情報（ゲームオーバー時の特別祝福やNEWタグ表示用）
  const [lastRankIn, setLastRankIn] = useState<{ rank: number; score: number; entryId: string } | null>(null);
  const hasRecordedRunRef = useRef<boolean>(false);

  // プレイヤー保有アイテム（初期状態は武器・防具ともに「なし」のみ所持）
  const [ownedWeaponIds, setOwnedWeaponIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hirameki_owned_weapons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ['none'];
  });

  const [ownedArmorIds, setOwnedArmorIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hirameki_owned_armors');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ['none'];
  });

  // プレイヤー装備とステータス（初期状態は「なし」）
  const [playerHp, setPlayerHp] = useState<number>(GAME_CONFIG.playerInitialHp);
  const [playerMaxHp] = useState<number>(GAME_CONFIG.playerInitialHp);
  const [equippedWeapon, setEquippedWeapon] = useState<WeaponItem>(() => {
    try {
      const savedId = localStorage.getItem('hirameki_equipped_weapon_id');
      if (savedId) {
        const found = WEAPON_LIST.find((w) => w.id === savedId);
        if (found) return found;
      }
    } catch {}
    return WEAPON_LIST[0]; // 初期「なし」
  });
  const [equippedArmor, setEquippedArmor] = useState<ArmorItem>(() => {
    try {
      const savedId = localStorage.getItem('hirameki_equipped_armor_id');
      if (savedId) {
        const found = ARMOR_LIST.find((a) => a.id === savedId);
        if (found) return found;
      }
    } catch {}
    return ARMOR_LIST[0]; // 初期「なし」
  });

  // 🔨 武器・防具の耐久力（隠しパラメータ：武器は購入時に10〜20、防具は5〜10のランダム値、問題解答ごとに-1、0になるとステージクリア後に破損）
  const [weaponDurabilityMap, setWeaponDurabilityMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('hirameki_weapon_durabilities');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [armorDurabilityMap, setArmorDurabilityMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('hirameki_armor_durabilities');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const weaponDurabilityRef = useRef<Record<string, number>>(weaponDurabilityMap);
  const armorDurabilityRef = useRef<Record<string, number>>(armorDurabilityMap);

  useEffect(() => {
    weaponDurabilityRef.current = weaponDurabilityMap;
  }, [weaponDurabilityMap]);

  useEffect(() => {
    armorDurabilityRef.current = armorDurabilityMap;
  }, [armorDurabilityMap]);

  // 破損装備の通知ステート（ステージクリア時 & ボス勝利時）
  interface BrokenEquipment {
    id: string;
    name: string;
    type: 'weapon' | 'armor';
  }
  const [brokenItemsNotice, setBrokenItemsNotice] = useState<BrokenEquipment[]>([]);
  const [bossBrokenItems, setBossBrokenItems] = useState<BrokenEquipment[]>([]);

  // 🪙 所持金（おかね）ステート（localStorageで永続化）
  const [money, setMoney] = useState<number>(() => {
    try {
      const savedMoney = localStorage.getItem('hirameki_money');
      return savedMoney !== null ? parseInt(savedMoney, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [lastEarnedStageMoney, setLastEarnedStageMoney] = useState<number>(0);
  const [lastEarnedBossMoney, setLastEarnedBossMoney] = useState<number>(0);
  const [lastEarnedBossBonus, setLastEarnedBossBonus] = useState<number>(0);

  // 🪙 敵撃破時のコイン飛び散り演出用パーティクルステート
  interface CoinParticle {
    id: number;
    x: number;
    y: number;
    rot: number;
    scale: number;
    delay: number;
    size: number;
  }
  const [coinBurstParticles, setCoinBurstParticles] = useState<CoinParticle[]>([]);

  // 敵ステータス（ステージが進むたびにランダム選定）
  const getRandomEnemy = (excludeId?: string): EnemyDefinition => {
    const pool = ENEMY_LIST.filter((e) => e.id !== excludeId);
    const candidates = pool.length > 0 ? pool : ENEMY_LIST;
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  const [currentEnemyDef, setCurrentEnemyDef] = useState<EnemyDefinition>(() => getRandomEnemy());
  const [enemyHp, setEnemyHp] = useState<number>(GAME_CONFIG.calculateEnemyHp(1));

  // 👑 ボス戦ステート（3ステージクリア毎に登場）
  const [isBossBattle, setIsBossBattle] = useState<boolean>(false);
  const [currentBossDef, setCurrentBossDef] = useState<BossDefinition | null>(null);
  const [bossStageOrigin, setBossStageOrigin] = useState<number>(1);
  const [bossMaxHp, setBossMaxHp] = useState<number>(6);
  const [bossAttack, setBossAttack] = useState<number>(1);
  const [showBossCutIn, setShowBossCutIn] = useState<boolean>(false);
  const [showBossVictory, setShowBossVictory] = useState<boolean>(false);

  // 現在対峙中の敵の最大HP（通常時 vs ボス戦時）
  const activeEnemyMaxHp = isBossBattle ? bossMaxHp : GAME_CONFIG.calculateEnemyHp(stage);
  // 現在対峙中の敵の攻撃力（通常時 vs ボス戦時）
  const activeEnemyAttack = isBossBattle ? bossAttack : GAME_CONFIG.calculateEnemyAttack(stage);
  // 現在描画する敵キャラクター定義（通常敵 vs ボス敵）
  const displayEnemyDef: EnemyDefinition = isBossBattle && currentBossDef ? currentBossDef : currentEnemyDef;

  // クイズ状態（デフォルトをステージ連動「さんすう自動生成」に設定）
  const [quizMode, setQuizMode] = useState<'database' | 'auto_stage_math'>('auto_stage_math');
  const [dynamicQuestion, setDynamicQuestion] = useState<QuizQuestion | null>(() => generateStageMathQuestion(1));
  const [questionList, setQuestionList] = useState<QuizQuestion[]>(() => [...QUIZ_DATABASE]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const currentQuestion: QuizQuestion =
    quizMode === 'auto_stage_math'
      ? (dynamicQuestion || generateStageMathQuestion(isBossBattle ? stage + 1 : stage))
      : (questionList[questionIndex % questionList.length] || QUIZ_DATABASE[0]);

  // 演出・判定フラグ
  const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [enemyHitAnim, setEnemyHitAnim] = useState<boolean>(false);
  const [playerHitAnim, setPlayerHitAnim] = useState<boolean>(false);
  const [enemyDamageNum, setEnemyDamageNum] = useState<number | null>(null);
  const [playerDamageNum, setPlayerDamageNum] = useState<number | null>(null);
  const [lockMessage, setLockMessage] = useState<string | null>(null);

  // 👾 敵の「はんげき」ゲージステート（0〜10：1秒ごとに増加、10で敵から攻撃）
  const [counterGauge, setCounterGauge] = useState<number>(0);
  const [isCounterattackCause, setIsCounterattackCause] = useState<boolean>(false);

  // ステージクリア / ゲームオーバーモーダル
  const [isStageClearing, setIsStageClearing] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  // ステージクリア自動進行タイマーと二重実行防止ガード（モンスターの重複切り替えを防止）
  const stageClearTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isProceedingStageRef = useRef<boolean>(false);

  // 🎮 ゲームのタイトル画面ステート（初期値: true でタイトルを表示）
  const [isTitleScreen, setIsTitleScreen] = useState<boolean>(true);

  // ⚔️ 冒険スタート画面遷移ステート（タイトル画面・ゲームオーバー共通）
  // 1. ボタン押下後 1秒間で黒画面へフェード -> 2. 「ぼうけんスタート！」が0.5秒でフェードイン -> 3. バトル画面へ遷移
  type AdventureTransitionPhase = 'idle' | 'fade_to_black' | 'text_in' | 'fade_to_battle';
  const [adventureTransitionPhase, setAdventureTransitionPhase] = useState<AdventureTransitionPhase>('idle');
  const adventureTimersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAdventureTimers = () => {
    adventureTimersRef.current.forEach((t) => clearTimeout(t));
    adventureTimersRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearAdventureTimers();
    };
  }, []);

  // サウンドミュートステート
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  // そうびモーダル（武器 or 防具）
  const [showEquipModal, setShowEquipModal] = useState<boolean>(false);
  const [equipModalType, setEquipModalType] = useState<'weapon' | 'armor'>('weapon');

  // 設定モーダル（ゲーム設定・モード切替・ボス召喚）
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // おみせ画面モーダル
  const [showShop, setShowShop] = useState<boolean>(false);
  // おみせ購入確認ウィンドウ選択中アイテム
  interface ShopItemSelection {
    id: string;
    name: string;
    bonus: number;
    iconType: 'none' | 'wooden_sword' | 'iron_sword' | 'diamond_sword' | 'leather_armor' | 'iron_armor' | 'diamond_armor';
    price: number;
    type: 'weapon' | 'armor';
  }
  const [selectedShopItem, setSelectedShopItem] = useState<ShopItemSelection | null>(null);
  // 「おかねがたりません」アラート（0.5秒間表示）
  const [showNotEnoughMoney, setShowNotEnoughMoney] = useState<boolean>(false);

  // カテゴリフィルター（算数、ことば、なぞなぞ、ぜんぶ）
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 装備変更ハンドラー
  const handleEquipWeapon = (weapon: WeaponItem) => {
    sound.playEquip();
    setEquippedWeapon(weapon);
    try {
      localStorage.setItem('hirameki_equipped_weapon_id', weapon.id);
    } catch {}
  };

  const handleEquipArmor = (armor: ArmorItem) => {
    sound.playEquip();
    setEquippedArmor(armor);
    try {
      localStorage.setItem('hirameki_equipped_armor_id', armor.id);
    } catch {}
  };

  // お店購入処理 (isEquip: 買って装備するかどうか)
  const handleBuyItem = (isEquip: boolean) => {
    if (!selectedShopItem) return;

    if (money < selectedShopItem.price) {
      sound.playWrong();
      setShowNotEnoughMoney(true);
      setTimeout(() => {
        setShowNotEnoughMoney(false);
        setSelectedShopItem(null);
      }, 500);
      return;
    }

    const newMoney = money - selectedShopItem.price;
    setMoney(newMoney);
    try {
      localStorage.setItem('hirameki_money', newMoney.toString());
    } catch {}

    if (selectedShopItem.type === 'weapon') {
      const updated = Array.from(new Set([...ownedWeaponIds, selectedShopItem.id]));
      setOwnedWeaponIds(updated);
      try {
        localStorage.setItem('hirameki_owned_weapons', JSON.stringify(updated));
      } catch {}

      // 🔨 耐久力（隠しパラメータ：10〜20のランダム値）を設定
      const randomDurability = Math.floor(Math.random() * 11) + 10;
      const updatedDur = { ...weaponDurabilityRef.current, [selectedShopItem.id]: randomDurability };
      weaponDurabilityRef.current = updatedDur;
      setWeaponDurabilityMap(updatedDur);
      try {
        localStorage.setItem('hirameki_weapon_durabilities', JSON.stringify(updatedDur));
      } catch {}

      if (isEquip) {
        const item = WEAPON_LIST.find((w) => w.id === selectedShopItem.id);
        if (item) {
          setEquippedWeapon(item);
          try {
            localStorage.setItem('hirameki_equipped_weapon_id', item.id);
          } catch {}
        }
      }
    } else {
      const updated = Array.from(new Set([...ownedArmorIds, selectedShopItem.id]));
      setOwnedArmorIds(updated);
      try {
        localStorage.setItem('hirameki_owned_armors', JSON.stringify(updated));
      } catch {}

      // 🔨 耐久力（隠しパラメータ：5〜10のランダム値）を設定
      const randomDurability = Math.floor(Math.random() * 6) + 5;
      const updatedDur = { ...armorDurabilityRef.current, [selectedShopItem.id]: randomDurability };
      armorDurabilityRef.current = updatedDur;
      setArmorDurabilityMap(updatedDur);
      try {
        localStorage.setItem('hirameki_armor_durabilities', JSON.stringify(updatedDur));
      } catch {}

      if (isEquip) {
        const item = ARMOR_LIST.find((a) => a.id === selectedShopItem.id);
        if (item) {
          setEquippedArmor(item);
          try {
            localStorage.setItem('hirameki_equipped_armor_id', item.id);
          } catch {}
        }
      }
    }

    sound.playBuy();
    if (isEquip) {
      sound.playEquip();
    }
    setSelectedShopItem(null);
  };

  // --- 2. ハイスコア永続化（localStorage復元） ---
  useEffect(() => {
    try {
      const savedHigh = localStorage.getItem('hirameki_highscore');
      if (savedHigh !== null) {
        setHighScore(parseInt(savedHigh, 10) || 0);
      }
    } catch {
      // ignore
    }
  }, []);

  // --- 3. スコアのカウントアップアニメーション（要件：数字を一つずつカウントアップ） ---
  useEffect(() => {
    if (displayScore < score) {
      const diff = score - displayScore;
      const step = Math.max(1, Math.floor(diff / 8));
      const timer = setTimeout(() => {
        setDisplayScore((prev) => Math.min(score, prev + step));
        sound.playScoreTick();
      }, 35);
      return () => clearTimeout(timer);
    }
  }, [score, displayScore]);

  // ハイスコアリアルタイム更新
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      setIsNewRecord(true);
      try {
        localStorage.setItem('hirameki_highscore', score.toString());
      } catch {
        // ignore
      }
    }
  }, [score, highScore]);

  // --- 🏆 スコアランキング登録処理（ゲームオーバー時・タイトル復帰時に呼出） ---
  const registerScoreToRanking = (runScore: number, runStage: number) => {
    if (runScore <= 0 || hasRecordedRunRef.current) return;
    hasRecordedRunRef.current = true;

    const newEntry: ScoreRankingEntry = {
      id: `rank-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      score: runScore,
      stage: runStage,
      dateStr: formatRankingDate(new Date()),
      timestamp: Date.now(),
    };

    setRankingList((prev) => {
      const combined = [...prev, newEntry];
      combined.sort((a, b) => b.score - a.score || b.timestamp - a.timestamp);
      const updated = combined.slice(0, 10);
      try {
        localStorage.setItem('hirameki_score_ranking', JSON.stringify(updated));
      } catch {
        // ignore
      }

      // Top 5 入賞判定（1〜5位以内なら演出用ステートに保存）
      const rankIndex = updated.findIndex((item) => item.id === newEntry.id);
      if (rankIndex >= 0 && rankIndex < 5) {
        setLastRankIn({ rank: rankIndex + 1, score: runScore, entryId: newEntry.id });
      }
      return updated;
    });
  };

  // --- 4. サウンドトグル ---
  const handleToggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  // --- 5. カテゴリ変更処理（ハーネスルール：中身を書き換えて容易に変身） ---
  const handleCategoryChange = (cat: string) => {
    sound.playClick();
    setSelectedCategory(cat);
    let filtered = QUIZ_DATABASE;
    if (cat !== 'all') {
      filtered = QUIZ_DATABASE.filter((q) => q.category === cat);
    }
    // シャッフル
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setQuestionList(shuffled);
    setQuestionIndex(0);
  };

  // --- 6. 回答ボタンタップ処理 ---
  const handleAnswerClick = (choiceIndex: number) => {
    if (isProcessing || isGameOver || isStageClearing || showBossCutIn || showBossVictory) return;

    setCounterGauge(0);
    setIsCounterattackCause(false);
    setIsProcessing(true);

    // 🔨 耐久力消費: 装備中の武器・防具は問題を解答するごとに耐久力を1消費（正解・不正解問わず）
    if (equippedWeapon.id !== 'none') {
      const cur = weaponDurabilityRef.current[equippedWeapon.id] ?? 8;
      const next = Math.max(0, cur - 1);
      const updated = { ...weaponDurabilityRef.current, [equippedWeapon.id]: next };
      weaponDurabilityRef.current = updated;
      setWeaponDurabilityMap(updated);
      try {
        localStorage.setItem('hirameki_weapon_durabilities', JSON.stringify(updated));
      } catch {}
    }

    if (equippedArmor.id !== 'none') {
      const cur = armorDurabilityRef.current[equippedArmor.id] ?? 8;
      const next = Math.max(0, cur - 1);
      const updated = { ...armorDurabilityRef.current, [equippedArmor.id]: next };
      armorDurabilityRef.current = updated;
      setArmorDurabilityMap(updated);
      try {
        localStorage.setItem('hirameki_armor_durabilities', JSON.stringify(updated));
      } catch {}
    }

    const isCorrect = choiceIndex === currentQuestion.answerIndex;
    // 出題の難易度ステージ（ボス戦時は stage + 1）
    const targetQuestionStage = isBossBattle ? stage + 1 : stage;

    if (isCorrect) {
      // === 正解時 ===
      sound.playCorrect();
      setAnswerState('correct');

      // 正解時ポイント（要望: 一律100点加算）
      const attackPower = GAME_CONFIG.playerBaseAttack + equippedWeapon.attackBonus;
      const scoreGain = GAME_CONFIG.scorePerCorrectAnswer; // 一律100点

      // 敵ダメージアニメーション
      setTimeout(() => {
        sound.playHit();
        setEnemyHitAnim(true);
        setEnemyDamageNum(attackPower);
        setScore((prev) => prev + scoreGain);

        const nextHp = Math.max(0, enemyHp - attackPower);
        setEnemyHp(nextHp);

        setTimeout(() => {
          setEnemyHitAnim(false);
          setEnemyDamageNum(null);
        }, 600);

        // 敵のHPがゼロになった場合の分岐
        if (nextHp <= 0) {
          // 🪙 倒した敵キャラのHP × 10円の「おかね」を獲得
          // 👑 ボス討伐時はボーナスとしてクリアしたステージ数 × 50円を追加！
          const baseEarned = activeEnemyMaxHp * 10;
          const isBoss = isBossBattle;
          const bossBonus = isBoss ? Math.max(1, bossStageOrigin || stage) * 50 : 0;
          const earnedCoins = baseEarned + bossBonus;

          if (isBoss) {
            setLastEarnedBossMoney(earnedCoins);
            setLastEarnedBossBonus(bossBonus);
          } else {
            setLastEarnedStageMoney(earnedCoins);
          }

          setMoney((prev) => {
            const updated = prev + earnedCoins;
            try {
              localStorage.setItem('hirameki_money', updated.toString());
            } catch {
              // ignore
            }
            return updated;
          });

          // 🪙 コイン飛び散り演出を生成（通常敵: 数枚（8枚） / ボス: たくさん（26枚））
          const coinCount = isBoss ? 26 : 8;
          const generatedCoins: CoinParticle[] = Array.from({ length: coinCount }, (_, i) => {
            // 上方向への扇状ランダム角度（-165度 〜 -15度）
            const minAngle = isBoss ? -170 : -155;
            const maxAngle = isBoss ? -10 : -25;
            const angleDeg = minAngle + Math.random() * (maxAngle - minAngle);
            const angleRad = (angleDeg * Math.PI) / 180;
            const distance = isBoss ? 80 + Math.random() * 125 : 65 + Math.random() * 80;
            return {
              id: i,
              x: Math.round(Math.cos(angleRad) * distance),
              y: Math.round(Math.sin(angleRad) * distance), // 負の値（上方向へ飛ぶ）
              rot: Math.round((Math.random() - 0.5) * 540),
              scale: Number((0.85 + Math.random() * 0.45).toFixed(2)),
              delay: Math.round(i * (isBoss ? 22 : 32) + Math.random() * 20),
              size: Math.round(isBoss ? 26 + Math.random() * 10 : 23 + Math.random() * 6),
            };
          });
          setCoinBurstParticles(generatedCoins);
          sound.playCoinBurst(isBoss);

          // 約1秒間コイン飛び散り演出を見せた後、ステージクリア/ボス演出へ遷移
          setTimeout(() => {
            setCoinBurstParticles([]);
            if (isBossBattle) {
              // 👑 ボスを討伐した！ -> 豪華な勝利演出
              handleBossDefeat(earnedCoins, bossBonus);
            } else if (stage % 3 === 0) {
              // ⚠️ 3ステージ毎の節目敵を倒した！ -> 強大ボス出現イベント発動！
              handleTriggerBoss();
            } else {
              // 通常のステージクリア
              handleStageClear();
            }
          }, 1050);
        } else {
          // 敵が生き残っている場合のみ1秒後に次の問題へ
          setTimeout(() => {
            setAnswerState('idle');
            setIsProcessing(false);
            if (quizMode === 'auto_stage_math') {
              setDynamicQuestion(generateStageMathQuestion(targetQuestionStage));
            } else {
              setQuestionIndex((prev) => prev + 1);
            }
          }, 1000);
        }
      }, 400);

    } else {
      // === 不正解時 ===
      sound.playWrong();
      setAnswerState('wrong');

      // 今回のダメージ値 = 敵の攻撃値(ボス時は1.5倍) - 防具値 (最低1ダメージ)
      const incomingDamage = Math.max(1, activeEnemyAttack - equippedArmor.defenseBonus);

      // プレイヤーダメージアニメーション
      setTimeout(() => {
        sound.playHurt();
        setPlayerHitAnim(true);
        setPlayerDamageNum(incomingDamage);

        setPlayerHp((prev) => {
          const nextHp = Math.max(0, prev - incomingDamage);
          if (nextHp <= 0) {
            setTimeout(() => {
              handleGameOver();
            }, 600);
          }
          return nextHp;
        });

        setTimeout(() => {
          setPlayerHitAnim(false);
          setPlayerDamageNum(null);
        }, 600);
      }, 350);

      // 1秒間のタメ演出後に次の問題へ
      setTimeout(() => {
        setAnswerState('idle');
        setIsProcessing(false);
        setCounterGauge(0);
        if (quizMode === 'auto_stage_math') {
          setDynamicQuestion(generateStageMathQuestion(targetQuestionStage));
        } else {
          setQuestionIndex((prev) => prev + 1);
        }
      }, 1000);
    }
  };

  // --- 👾 敵の「はんげき」発動処理（10秒経過して回答がなかった場合：不正解時と同一の挙動） ---
  const handleEnemyCounterattack = () => {
    if (
      isTitleScreen ||
      adventureTransitionPhase !== 'idle' ||
      isProcessing ||
      answerState !== 'idle' ||
      isGameOver ||
      isStageClearing ||
      showBossCutIn ||
      showBossVictory ||
      showShop ||
      showEquipModal ||
      showSettingsModal
    ) {
      return;
    }

    // 即座にゲージをリセットして反撃処理に入る
    setCounterGauge(0);
    sound.playWrong();
    setAnswerState('wrong');
    setIsCounterattackCause(true);
    setIsProcessing(true);

    const targetQuestionStage = isBossBattle ? stage + 1 : stage;
    const incomingDamage = Math.max(1, activeEnemyAttack - equippedArmor.defenseBonus);

    // プレイヤーダメージアニメーション
    setTimeout(() => {
      sound.playHurt();
      setPlayerHitAnim(true);
      setPlayerDamageNum(incomingDamage);

      setPlayerHp((prev) => {
        const nextHp = Math.max(0, prev - incomingDamage);
        if (nextHp <= 0) {
          setTimeout(() => {
            handleGameOver();
          }, 600);
        }
        return nextHp;
      });

      setTimeout(() => {
        setPlayerHitAnim(false);
        setPlayerDamageNum(null);
      }, 600);
    }, 350);

    // 1秒間のタメ演出後に再開（反撃ゲージは0に戻る）
    // ★要件: 敵キャラの反撃後は問題を変えない！（ユーザーは思考中なので同じ問題を継続）
    setTimeout(() => {
      setAnswerState('idle');
      setIsCounterattackCause(false);
      setIsProcessing(false);
      setCounterGauge(0);
    }, 1000);
  };

  // 👾 敵の「はんげき」ゲージタイマー（1秒ごとに1ゲージ増加、10個目で敵が攻撃）
  const isQuestionActive =
    !isTitleScreen &&
    adventureTransitionPhase === 'idle' &&
    answerState === 'idle' &&
    !isProcessing &&
    !isStageClearing &&
    !isGameOver &&
    !showBossCutIn &&
    !showBossVictory &&
    !showShop &&
    !showEquipModal &&
    !showSettingsModal;

  useEffect(() => {
    if (!isQuestionActive) {
      return;
    }

    const intervalId = setInterval(() => {
      setCounterGauge((prev) => {
        if (prev >= 9) {
          return 10;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isQuestionActive, currentQuestion.id]);

  useEffect(() => {
    if (counterGauge >= 10 && isQuestionActive) {
      handleEnemyCounterattack();
    }
  }, [counterGauge, isQuestionActive]);

  // --- 👑 ボス出現イベント（3ステージクリア毎に発動） ---
  const handleTriggerBoss = (specificBossId?: string) => {
    // 4種類の強力なボスの中から選定（指定があればそのボス、通常はランダム）
    const boss = specificBossId
      ? BOSS_LIST.find((b) => b.id === specificBossId) || getRandomBoss(currentBossDef?.id)
      : getRandomBoss(currentBossDef?.id);
    const stageEnemyHp = GAME_CONFIG.calculateEnemyHp(stage);
    const stageEnemyAtk = GAME_CONFIG.calculateEnemyAttack(stage);

    // ボスのHPは前回の敵の2倍
    const calculatedBossHp = stageEnemyHp * 2;
    // ボスの攻撃力は通常敵と同じ（倍率なし）
    const calculatedBossAtk = stageEnemyAtk;

    setCurrentBossDef(boss);
    setBossMaxHp(calculatedBossHp);
    setEnemyHp(calculatedBossHp);
    setBossAttack(calculatedBossAtk);
    setBossStageOrigin(stage);
    setIsBossBattle(true);

    // ボスが出す問題の難易度は前回のステージより1つ上（stage + 1）
    if (quizMode === 'auto_stage_math') {
      setDynamicQuestion(generateStageMathQuestion(stage + 1));
    }

    // スマブラ風カットイン出現演出 & 警告音再生
    sound.playBossWarning();
    setShowBossCutIn(true);
    setAnswerState('idle');
    setIsProcessing(false);
  };

  // 🔨 耐久力切れの装備破損判定＆持ち物削除（ステージクリア・ボス撃破時に実行）
  const checkAndBreakEquipments = (): BrokenEquipment[] => {
    const broken: BrokenEquipment[] = [];

    // 装備中武器の破損チェック
    if (equippedWeapon.id !== 'none') {
      const weaponDur = weaponDurabilityRef.current[equippedWeapon.id] ?? 8;
      if (weaponDur <= 0) {
        broken.push({
          id: equippedWeapon.id,
          name: equippedWeapon.name,
          type: 'weapon',
        });
      }
    }

    // 装備中防具の破損チェック
    if (equippedArmor.id !== 'none') {
      const armorDur = armorDurabilityRef.current[equippedArmor.id] ?? 8;
      if (armorDur <= 0) {
        broken.push({
          id: equippedArmor.id,
          name: equippedArmor.name,
          type: 'armor',
        });
      }
    }

    if (broken.length > 0) {
      sound.playBreak();
      broken.forEach((item) => {
        if (item.type === 'weapon') {
          // 持ち物から削除（再購入が必要）
          setOwnedWeaponIds((prev) => {
            const updated = prev.filter((id) => id !== item.id);
            try {
              localStorage.setItem('hirameki_owned_weapons', JSON.stringify(updated));
            } catch {}
            return updated;
          });
          // 装備を「なし」に戻す
          setEquippedWeapon(WEAPON_LIST[0]);
          try {
            localStorage.setItem('hirameki_equipped_weapon_id', 'none');
          } catch {}
          // 耐久力データから削除
          const nextDur = { ...weaponDurabilityRef.current };
          delete nextDur[item.id];
          weaponDurabilityRef.current = nextDur;
          setWeaponDurabilityMap(nextDur);
          try {
            localStorage.setItem('hirameki_weapon_durabilities', JSON.stringify(nextDur));
          } catch {}
        } else {
          // 持ち物から削除（再購入が必要）
          setOwnedArmorIds((prev) => {
            const updated = prev.filter((id) => id !== item.id);
            try {
              localStorage.setItem('hirameki_owned_armors', JSON.stringify(updated));
            } catch {}
            return updated;
          });
          // 装備を「なし」に戻す
          setEquippedArmor(ARMOR_LIST[0]);
          try {
            localStorage.setItem('hirameki_equipped_armor_id', 'none');
          } catch {}
          // 耐久力データから削除
          const nextDur = { ...armorDurabilityRef.current };
          delete nextDur[item.id];
          armorDurabilityRef.current = nextDur;
          setArmorDurabilityMap(nextDur);
          try {
            localStorage.setItem('hirameki_armor_durabilities', JSON.stringify(nextDur));
          } catch {}
        }
      });
    }

    return broken;
  };

  // --- 👑 ボス撃破処理（豪華な勝利演出） ---
  const handleBossDefeat = (earnedCoins?: number, bossBonusCoins?: number) => {
    sound.playBossClear();
    if (earnedCoins) {
      setLastEarnedBossMoney(earnedCoins);
    }
    if (bossBonusCoins !== undefined) {
      setLastEarnedBossBonus(bossBonusCoins);
    }
    // 🔨 ボス撃破時の装備破損判定
    const broken = checkAndBreakEquipments();
    setBossBrokenItems(broken);

    // 撃破ボーナス: 2,000点加算 & プレイヤーのHP全回復！
    setScore((prev) => prev + 2000);
    setPlayerHp(playerMaxHp);
    setShowBossVictory(true);
    setAnswerState('idle');
    setIsProcessing(false);
    setCounterGauge(0);
  };

  // --- 👑 ボス撃破後に次のステージへ進む ---
  const handleProceedFromBossVictory = () => {
    if (isProceedingStageRef.current) return;
    isProceedingStageRef.current = true;

    sound.playClick();
    setShowBossVictory(false);
    setBossBrokenItems([]);
    setIsBossBattle(false);
    setCurrentBossDef(null);

    // ボスはステージにカウントしない（ステージ3のボスを倒したら、次のステージはステージ4）
    const nextStage = bossStageOrigin + 1;
    setStage(nextStage);

    // 次ステージの通常敵をランダム選定
    setCurrentEnemyDef(getRandomEnemy());
    const nextEnemyHp = GAME_CONFIG.calculateEnemyHp(nextStage);
    setEnemyHp(nextEnemyHp);

    if (quizMode === 'auto_stage_math') {
      setDynamicQuestion(generateStageMathQuestion(nextStage));
    }
    setAnswerState('idle');
    setIsProcessing(false);
    setCounterGauge(0);

    setTimeout(() => {
      isProceedingStageRef.current = false;
    }, 500);
  };

  // --- 7. 通常ステージクリア処理 ---
  const handleStageClear = () => {
    if (isProceedingStageRef.current) return;
    const broken = checkAndBreakEquipments();
    setBrokenItemsNotice(broken);
    setIsStageClearing(true);
    setAnswerState('idle');
    setIsProcessing(false);
    sound.playStageClear();

    // 既存の保留中タイマーがあれば確実に破棄
    if (stageClearTimerRef.current) {
      clearTimeout(stageClearTimerRef.current);
      stageClearTimerRef.current = null;
    }

    // 破損装備がない場合は1.8秒後に自動遷移、破損装備がある場合はユーザーが確認できるようにする
    if (broken.length === 0) {
      stageClearTimerRef.current = setTimeout(() => {
        proceedNextStageFromClear();
      }, 1800);
    }
  };

  // 通常ステージクリア後の次ステージへの進行処理
  const proceedNextStageFromClear = () => {
    // 重複遷移ガード（ボタン連打や自動タイマー発火との競合による二重実行・モンスター重複切替を完全防止）
    if (isProceedingStageRef.current) return;
    isProceedingStageRef.current = true;

    // 保留中の自動遷移タイマーがあれば確実に破棄（ボタン手動タップ時の二重遷移・モンスター重複切替を防止）
    if (stageClearTimerRef.current) {
      clearTimeout(stageClearTimerRef.current);
      stageClearTimerRef.current = null;
    }

    // 次の敵キャラをランダムに選定（直前の敵キャラと被らない）
    setCurrentEnemyDef((prev) => getRandomEnemy(prev.id));

    const nextStage = stage + 1;
    setStage(nextStage);
    // 次ステージの敵HPは100%全快からスタート
    const nextEnemyHp = GAME_CONFIG.calculateEnemyHp(nextStage);
    setEnemyHp(nextEnemyHp);

    // 自動生成モードの場合は新ステージに応じた難易度の問題を生成
    if (quizMode === 'auto_stage_math') {
      setDynamicQuestion(generateStageMathQuestion(nextStage));
    }

    setIsStageClearing(false);
    setBrokenItemsNotice([]);
    setAnswerState('idle');
    setIsProcessing(false);
    setCounterGauge(0);

    setTimeout(() => {
      isProceedingStageRef.current = false;
    }, 500);
  };

  // --- 8. ゲームオーバー処理 ---
  const handleGameOver = () => {
    setIsGameOver(true);
    sound.playGameOver();
    if (score > 0) {
      registerScoreToRanking(score, stage);
    }
  };

  // バトルゲーム状態の共通初期化
  const resetBattleGameState = () => {
    if (stageClearTimerRef.current) {
      clearTimeout(stageClearTimerRef.current);
      stageClearTimerRef.current = null;
    }
    isProceedingStageRef.current = false;
    hasRecordedRunRef.current = false;
    setLastRankIn(null);
    setStage(1);
    setScore(0);
    setDisplayScore(0);
    setIsNewRecord(false);
    setIsBossBattle(false);
    setCurrentBossDef(null);
    setShowBossCutIn(false);
    setShowBossVictory(false);
    setCurrentEnemyDef(getRandomEnemy());
    setPlayerHp(GAME_CONFIG.playerInitialHp);
    setEnemyHp(GAME_CONFIG.calculateEnemyHp(1));
    setQuestionIndex(0);
    if (quizMode === 'auto_stage_math') {
      setDynamicQuestion(generateStageMathQuestion(1));
    }
    setIsGameOver(false);
    setIsStageClearing(false);
    setBrokenItemsNotice([]);
    setBossBrokenItems([]);
    setCoinBurstParticles([]);
    setAnswerState('idle');
    setIsCounterattackCause(false);
    setIsProcessing(false);
    setCounterGauge(0);
  };

  // --- 9. 冒険スタート画面遷移（タイトル画面・ゲームオーバー共通） ---
  // 要件:
  // ・ボタン押下後、1秒間で画面全体が黒い画面にフェード（終了時は真っ黒）
  // ・その後、「ぼうけんスタート！」の文字が画面中央からフェードイン（0.5秒間でアルファ値1に）
  // ・その後、バトル画面へ遷移
  const handleStartAdventureWithTransition = (isFromGameOver: boolean = false) => {
    if (adventureTransitionPhase !== 'idle') return;

    sound.playClick();
    clearAdventureTimers();
    setAdventureTransitionPhase('fade_to_black');

    // 1. 1秒間の黒画面フェードアニメーション（1000ms後に真っ黒に遷移完了）
    const t1 = setTimeout(() => {
      // 画面が完全に真っ黒になったタイミングで、裏の画面状態を更新
      if (isFromGameOver) {
        resetBattleGameState();
      } else {
        setIsTitleScreen(false);
        resetBattleGameState();
      }

      // 2. 「ぼうけんスタート！」の文字をフェードイン（0.5秒間）
      setAdventureTransitionPhase('text_in');
      sound.playAdventureStart();

      // 3. 文字フェードイン完了（500ms）後、少し読める時間を確保（700ms、合計1200ms後）してバトル画面へフェード遷移
      const t2 = setTimeout(() => {
        setAdventureTransitionPhase('fade_to_battle');

        // 4. バトル画面へのフェード（500ms）完了後にトランジションを終了
        const t3 = setTimeout(() => {
          setAdventureTransitionPhase('idle');
        }, 500);
        adventureTimersRef.current.push(t3);
      }, 1200);

      adventureTimersRef.current.push(t2);
    }, 1000);

    adventureTimersRef.current.push(t1);
  };

  // 互換性ハンドラー
  const handleRestart = () => {
    handleStartAdventureWithTransition(true);
  };

  const handleStartGame = () => {
    handleStartAdventureWithTransition(false);
  };

  // --- 10. タイトル画面へもどる ---
  const handleReturnToTitle = () => {
    clearAdventureTimers();
    setAdventureTransitionPhase('idle');
    if (stageClearTimerRef.current) {
      clearTimeout(stageClearTimerRef.current);
      stageClearTimerRef.current = null;
    }
    isProceedingStageRef.current = false;
    sound.playClick();
    // プレイ中のスコアがあればランキングに記録
    if (score > 0 && !hasRecordedRunRef.current) {
      registerScoreToRanking(score, stage);
    }
    hasRecordedRunRef.current = false;
    setIsTitleScreen(true);
    setShowSettingsModal(false);
    setShowShop(false);
    setShowEquipModal(false);
    setShowBossCutIn(false);
    setShowBossVictory(false);
    setIsGameOver(false);
    setIsStageClearing(false);
    setBrokenItemsNotice([]);
    setBossBrokenItems([]);
    setCoinBurstParticles([]);
    setStage(1);
    setScore(0);
    setDisplayScore(0);
    setIsNewRecord(false);
    setIsBossBattle(false);
    setCurrentBossDef(null);
    setCurrentEnemyDef(getRandomEnemy());
    setPlayerHp(GAME_CONFIG.playerInitialHp);
    setEnemyHp(GAME_CONFIG.calculateEnemyHp(1));
    setQuestionIndex(0);
    if (quizMode === 'auto_stage_math') {
      setDynamicQuestion(generateStageMathQuestion(1));
    }
    setAnswerState('idle');
    setIsCounterattackCause(false);
    setIsProcessing(false);
    setCounterGauge(0);
  };

  // 敵のHP割合計算（通常時 vs ボス戦時）
  const enemyHpPercent = Math.max(0, Math.min(100, (enemyHp / activeEnemyMaxHp) * 100));
  // プレイヤーのHP割合計算
  const playerHpPercent = Math.max(0, Math.min(100, (playerHp / playerMaxHp) * 100));

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-between bg-black text-white relative transition-colors duration-200 ${
        playerHitAnim ? 'bg-red-950/40' : ''
      }`}
    >
      {/* 画面全体のダメージフラッシュ演出 */}
      {playerHitAnim && (
        <div className="absolute inset-0 bg-red-600/30 z-40 pointer-events-none anim-flash-red" />
      )}

      {isTitleScreen ? (
        /* ====================================================================
            🏰 ゲーム タイトル画面
            要件:
            - 中央上部に「ひらめき」「クエスト！」を表示
            - ふわふわ上下に浮かんでいる感じのアニメーション（anim-title-float）
            - ボタン2つ：「はじめる！」と「せってい」
            - 「はじめる！」を選択するとゲーム開始
            - 背景画像: ファンタジーRPG風景
           ==================================================================== */
        <div className="relative w-full min-h-screen flex flex-col justify-between items-center overflow-y-auto select-none safe-top safe-bottom">
          {/* 背景画像（美しいファンタジー王国の風景） */}
          <div className="fixed inset-0 z-0">
            <img
              src={titleBgImg}
              alt="ひらめきクエスト 背景"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
            />
            {/* 上部・下部の柔らかなビネット＆グラデーションオーバーレイで可読性を極大化 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/85 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />
          </div>

          {/* 上部ヘッダー（音声切り替え・PWAボタンなど） */}
          <div className="relative z-10 w-full max-w-md mx-auto flex items-center justify-between px-5 pt-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300 shadow-md">
              <span>✨</span>
              <span>クイズバトルRPG</span>
            </div>

            <div className="flex items-center gap-2">
              <PWAInstallButton />
              <button
                onClick={handleToggleSound}
                className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 active:scale-95 transition shadow-md cursor-pointer"
                aria-label="おんせい切替"
                title={isMuted ? '音声をオンにする' : '音声をオフにする'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* 中央上部: 「ひらめき」「クエスト！」タイトルロゴ（ふわふわ浮遊アニメーション） */}
          <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center justify-center pt-4 sm:pt-6 pb-2 px-4 text-center">
            <div className="anim-title-float flex flex-col items-center">
              {/* サブキャッチコピー */}
              <div className="mb-1.5 px-4 py-1 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-300/60 shadow-[0_0_15px_rgba(251,191,36,0.4)] text-[11px] sm:text-xs font-black text-amber-200 tracking-wider">
                ⚔️ あたまを つかって モンスターを たおせ！ 🛡️
              </div>

              {/* タイトル 1行目: 「ひらめき」 */}
              <div className="relative">
                <span className="block text-4xl sm:text-6xl md:text-7xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-500 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] drop-shadow-[0_0_24px_rgba(250,204,21,0.7)] select-none">
                  ひらめき
                </span>
                {/* きらめきアクセント */}
                <span className="absolute -top-3 -right-4 text-2xl animate-spin-slow pointer-events-none">✨</span>
                <span className="absolute bottom-1 -left-4 text-xl animate-pulse pointer-events-none">✨</span>
              </div>

              {/* タイトル 2行目: 「クエスト！」 */}
              <div className="relative mt-0.5 sm:mt-1">
                <span className="block text-4xl sm:text-6xl md:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-sky-100 via-cyan-300 to-blue-500 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] drop-shadow-[0_0_24px_rgba(56,189,248,0.7)] select-none">
                  クエスト！
                </span>
                <span className="absolute -top-1 -right-5 text-2xl animate-bounce pointer-events-none">👾</span>
              </div>

              {/* 飾りの帯 */}
              <div className="mt-2 flex items-center gap-2 text-zinc-300/90 text-[11px] font-bold drop-shadow">
                <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-300/80" />
                <span className="text-amber-300 font-black">HIRAMEKI QUEST</span>
                <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-amber-300/80" />
              </div>
            </div>
          </div>

          {/* 下部: リーダーボード Top 5 & あつめたお金 & ボタン群 */}
          <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto pb-8 sm:pb-10 px-4 flex flex-col gap-3">
            {/* 🏆 スコアランキング TOP 5 リーダーボード */}
            <div className="w-full bg-black/80 backdrop-blur-md border-2 border-amber-400/60 rounded-2xl p-3 sm:p-3.5 shadow-2xl">
              {/* リーダーボード ヘッダー */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-400/30">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                  <Trophy className="w-4 h-4 text-yellow-400 animate-pulse" />
                  <span className="tracking-wide">スコアランキング TOP 5</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                  <span>📅 ランクイン日</span>
                </div>
              </div>

              {/* Top 5 リスト */}
              <div className="flex flex-col gap-1.5">
                {rankingList.slice(0, 5).map((entry, index) => {
                  const rank = index + 1;
                  const isNew = lastRankIn?.entryId === entry.id;

                  let rankBadge = (
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-zinc-800 text-[10px] font-black text-zinc-400">
                      {rank}
                    </span>
                  );
                  let rowStyle = 'bg-zinc-900/70 border-zinc-800 text-zinc-300';
                  let scoreColor = 'text-white';

                  if (rank === 1) {
                    rankBadge = <span className="text-base filter drop-shadow">🥇</span>;
                    rowStyle =
                      'bg-gradient-to-r from-amber-500/25 via-yellow-500/15 to-transparent border-amber-400/70 shadow-[0_0_12px_rgba(251,191,36,0.2)]';
                    scoreColor = 'text-yellow-300';
                  } else if (rank === 2) {
                    rankBadge = <span className="text-base filter drop-shadow">🥈</span>;
                    rowStyle =
                      'bg-gradient-to-r from-slate-400/20 via-zinc-400/10 to-transparent border-slate-300/60';
                    scoreColor = 'text-slate-100';
                  } else if (rank === 3) {
                    rankBadge = <span className="text-base filter drop-shadow">🥉</span>;
                    rowStyle =
                      'bg-gradient-to-r from-amber-800/25 via-orange-800/15 to-transparent border-amber-600/60';
                    scoreColor = 'text-amber-200';
                  }

                  return (
                    <div
                      key={entry.id || index}
                      className={`relative flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-xs transition-all ${rowStyle} ${
                        isNew ? 'ring-2 ring-yellow-400 animate-pulse' : ''
                      }`}
                    >
                      {/* 順位・メダル */}
                      <div className="flex items-center gap-1.5 min-w-[42px] sm:min-w-[48px] shrink-0">
                        {rankBadge}
                        <span className={`text-[11px] font-black ${rank <= 3 ? 'text-amber-200' : 'text-zinc-400'}`}>
                          {rank}位
                        </span>
                      </div>

                      {/* スコア & 到達ステージ（「ステージXX」表記） */}
                      <div className="flex items-center gap-1.5 flex-1 justify-center px-1">
                        <div className="flex items-baseline gap-0.5">
                          <span className={`font-black text-xs sm:text-sm tracking-tight ${scoreColor}`}>
                            {entry.score.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-bold">てん</span>
                        </div>
                        {entry.stage > 0 && (
                          <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-bold border border-amber-400/30 whitespace-nowrap">
                            ステージ{entry.stage}
                          </span>
                        )}
                      </div>

                      {/* ランクイン日（yyyy年mm月dd日 ゼロ埋め） */}
                      <div className="flex items-center gap-1 text-right shrink-0 justify-end">
                        {isNew && (
                          <span className="px-1 py-0.2 text-[8px] bg-red-600 text-white font-black rounded">
                            NEW
                          </span>
                        )}
                        <span className="text-[10px] sm:text-[11px] font-mono tabular-nums font-bold text-zinc-300 tracking-tight">
                          {entry.dateStr}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* 5件未満の場合の空スロット埋め */}
                {Array.from({ length: Math.max(0, 5 - Math.min(5, rankingList.length)) }).map((_, emptyIdx) => {
                  const rank = rankingList.length + emptyIdx + 1;
                  return (
                    <div
                      key={`empty-${rank}`}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-dashed border-zinc-800 bg-black/30 text-zinc-600 text-xs"
                    >
                      <div className="flex items-center gap-1.5 min-w-[42px] sm:min-w-[48px] shrink-0">
                        <span className="w-5 h-5 flex items-center justify-center text-[10px] text-zinc-600 font-black">
                          {rank}
                        </span>
                        <span className="text-[11px] text-zinc-600 font-bold">{rank}位</span>
                      </div>
                      <div className="flex-1 text-center text-[10px] text-zinc-600 font-mono">- - -</div>
                      <div className="text-right text-[10px] sm:text-[11px] text-zinc-600 font-mono tabular-nums tracking-tight shrink-0">
                        ----年--月--日
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 🪙 あつめたお金（リーダーボードとは完全に分離された別枠カード） */}
            <div className="w-full bg-gradient-to-r from-zinc-950/90 via-zinc-900/90 to-zinc-950/90 backdrop-blur-md border-2 border-amber-500/40 rounded-2xl p-3 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-base shadow-sm border border-yellow-200/50">
                  🪙
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-zinc-400">これまでの ちょきん</span>
                  <span className="text-xs sm:text-sm font-black text-amber-200 tracking-wide">
                    あつめた おかね
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-1 bg-black/60 px-3 py-1.5 rounded-xl border border-amber-400/40 shadow-inner">
                <span className="text-base sm:text-lg font-black text-amber-300 font-mono tabular-nums tracking-tight">
                  {money.toLocaleString()}
                </span>
                <span className="text-xs font-black text-amber-400">円</span>
              </div>
            </div>

            {/* ボタン 1: 「はじめる！」 */}
            <button
              onClick={() => handleStartAdventureWithTransition(false)}
              disabled={adventureTransitionPhase !== 'idle'}
              className="group relative w-full py-4 sm:py-4.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-black text-xl sm:text-2xl shadow-[0_6px_0_#b45309] border-2 border-white/90 active:translate-y-1 active:shadow-[0_1px_0_#b45309] transition-all flex items-center justify-center gap-3 overflow-hidden cursor-pointer disabled:opacity-80"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="text-2xl sm:text-3xl filter drop-shadow">⚔️</span>
              <span className="tracking-widest drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                はじめる！
              </span>
            </button>

            {/* ボタン 2: 「せってい」 */}
            <button
              onClick={() => {
                if (adventureTransitionPhase !== 'idle') return;
                sound.playClick();
                setShowSettingsModal(true);
              }}
              disabled={adventureTransitionPhase !== 'idle'}
              className="w-full py-3 sm:py-3.5 px-6 rounded-2xl bg-zinc-950/85 hover:bg-zinc-900 text-white font-black text-base sm:text-lg shadow-[0_4px_0_#18181b] border-2 border-amber-400/80 active:translate-y-1 active:shadow-[0_1px_0_#18181b] transition-all flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer disabled:opacity-50"
            >
              <Settings className="w-5 h-5 text-amber-400 animate-spin-slow" />
              <span className="tracking-wider">せってい</span>
            </button>

            <div className="text-center text-[10px] font-bold text-zinc-300/80 drop-shadow mt-0.5">
              © 2026 ひらめきクエスト！
            </div>
          </div>
        </div>
      ) : (
        /* ====================================================================
            メインコンテナ（スマホ縦画面に最適化された中央寄せカラム）
           ==================================================================== */
        <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-screen px-4 pt-2.5 pb-5 safe-top safe-bottom">

          {/* --- [上部エリア 1] アプリタイトル補助 & ツールバー --- */}
          <div className="flex items-center justify-between pb-1 border-b border-zinc-900 text-xs shrink-0">
            <div className="flex items-center gap-2 text-zinc-300 font-bold">
              <img src="./icon.png" alt="ひらめきクエスト！" className="w-5 h-5 rounded-full shadow-sm border border-yellow-400/60 object-cover" />
              <span className="tracking-wide">ひらめきクエスト！</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">v3.0</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* PWAインストールボタン */}
              <PWAInstallButton />

              {/* サウンド切り替えボタン */}
              <button
                onClick={handleToggleSound}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white active:scale-95 transition cursor-pointer"
                aria-label="おんせい切替"
                title={isMuted ? '音声をオンにする' : '音声をオフにする'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
              </button>


              {/* 設定 ＆ モード切替ボタン（ギアアイコン） */}
              <button
                onClick={() => setShowSettingsModal(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-yellow-300 hover:bg-zinc-800 hover:text-white active:scale-95 transition text-xs font-bold shadow-sm cursor-pointer"
                title="出題モードやゲーム設定"
              >
                <Settings className="w-3.5 h-3.5 text-yellow-400 animate-spin-slow" />
                <span>設定</span>
              </button>
            </div>
          </div>

        {/* --- [画面上部 2] ステージ & スコア & ハイスコア（ボス戦時は大迫力ボス仕様） --- */}
        <div className="flex items-start justify-between mt-2 px-1">
          {/* 左：ステージ数 & カテゴリ & 敵の力 */}
          <div className="flex flex-col">
            {isBossBattle ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-red-500 flex items-center gap-1 animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                  🔥 BOSS BATTLE!
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-red-950 text-red-300 border border-red-500/80">
                  STAGE {stage}
                </span>
              </div>
            ) : (
              <div className="text-2xl font-black tracking-wider text-white">
                ステージ：{stage}
              </div>
            )}
            {/* 問題の種類を「敵の力」の左横に配置（通常ステージ時のみ表示、ボス戦時は非表示） */}
            {!isBossBattle && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 active:scale-95 transition ${
                    quizMode === 'auto_stage_math'
                      ? 'bg-yellow-950/80 text-yellow-300 border-yellow-500/60 shadow-[0_0_8px_rgba(234,179,8,0.3)]'
                      : 'bg-blue-950 text-blue-300 border-blue-500/50'
                  }`}
                  title="タップして出題形式・ルールを確認"
                >
                  <span>
                    {quizMode === 'auto_stage_math'
                      ? '⚡️さんすう(自動)'
                      : currentQuestion.categoryLabel}
                  </span>
                  <span className="text-[9px] opacity-75">ℹ️確認</span>
                </button>
                <span className="text-[11px] font-bold text-zinc-400">
                  敵の力：{activeEnemyAttack}
                </span>
              </div>
            )}
          </div>

          {/* 右：こんかい & さいこうスコア */}
          <div className="text-right flex flex-col font-bold">
            <div className="text-sm text-zinc-200">
              こんかい：<span className="text-yellow-300 font-black text-base">{displayScore.toLocaleString()}</span> てん
            </div>
            <div className="text-xs text-zinc-400 flex items-center justify-end gap-1">
              {isNewRecord && (
                <span className="px-1.5 py-0.2 bg-red-600 text-white rounded text-[10px] font-black animate-pulse">
                  更新中!
                </span>
              )}
              <span>さいこう：<strong className="text-zinc-200 font-black">{highScore.toLocaleString()}</strong> てん</span>
            </div>
          </div>
        </div>

        {/* --- [画面中央 1] 問題テキスト表示枠（白背景の明快なカード：文字数に応じて最大文字サイズを自動適用） --- */}
        <div className="mt-2 mb-1.5 w-full">
          <div className="bg-white text-black rounded-2xl px-4 py-2.5 shadow-xl border-4 border-zinc-200 text-center relative flex flex-col items-center justify-center min-h-[82px] max-h-[110px] overflow-hidden">
            {/* 問題文（UI枠を崩さず最大の文字サイズで表示） */}
            <h2
              className={`w-full text-center text-zinc-950 break-words line-clamp-2 ${getQuestionFontSize(
                currentQuestion.question,
                Boolean(currentQuestion.subQuestion)
              )}`}
            >
              {currentQuestion.question}
            </h2>

            {currentQuestion.subQuestion && (
              <p className="text-xs sm:text-sm text-zinc-600 font-bold mt-1 line-clamp-1">
                {currentQuestion.subQuestion}
              </p>
            )}
          </div>
        </div>

        {/* --- [画面中央 2] 敵キャラ枠・画像・HPバー（ボス戦時は専用の紅蓮オーラ） ＆ 👾はんげきゲージ --- */}
        <div className="flex-1 flex flex-col items-center justify-center my-0.5 relative min-h-[140px]">
          {/* 敵枠と反撃ゲージの水平エリア */}
          <div className="relative flex items-center justify-center w-full">
            {/* 敵枠（通常時は白系シャープ枠、ボス戦時は深紅の魔力オーラ枠） */}
            <div
              className={`relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 max-h-[25vh] max-w-[25vh] bg-zinc-950/90 rounded-2xl border-2 flex items-center justify-center p-2 shadow-2xl overflow-visible transition-all duration-300 ${
                isBossBattle
                  ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.7)] ring-2 ring-red-500/50'
                  : 'border-zinc-700'
              }`}
            >
              {/* モンスターオンメモリSVGレンダラー（通常敵 or ボスキャラ） */}
              <MonsterRenderer type={displayEnemyDef.svgType} isHit={enemyHitAnim} />

              {/* 敵被ダメージ数値ポップアップ */}
              {enemyDamageNum !== null && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <span className="text-4xl sm:text-5xl font-black text-red-500 drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)] anim-damage-num">
                    -{enemyDamageNum}
                  </span>
                </div>
              )}

              {/* スラッシュ斬撃エフェクト */}
              {enemyHitAnim && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-3/4 h-2 bg-white rounded-full shadow-[0_0_15px_#60a5fa] anim-pop rotate-[-35deg]" />
                </div>
              )}

              {/* 🪙 敵撃破時 コイン飛び散りアニメーション演出（通常敵: 数枚 / ボス: たくさん） */}
              {coinBurstParticles.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 overflow-visible">
                  {coinBurstParticles.map((coin) => (
                    <div
                      key={coin.id}
                      className="absolute anim-coin-scatter select-none pointer-events-none"
                      style={{
                        '--target-x': `${coin.x}px`,
                        '--target-y': `${coin.y}px`,
                        '--target-rot': `${coin.rot}deg`,
                        '--target-scale': coin.scale,
                        animationDelay: `${coin.delay}ms`,
                        fontSize: `${coin.size}px`,
                      } as React.CSSProperties}
                    >
                      <span className="filter drop-shadow-[0_0_8px_rgba(250,204,21,0.95)] inline-block">
                        🪙
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 👾 敵の「はんげき」ゲージ（敵キャラの右横に配置：1秒ごとに下から上昇、10カウントで反撃発動） */}
            <div className="absolute right-1 sm:right-3 md:right-5 top-1/2 -translate-y-1/2 z-10">
              <CounterGauge currentCount={counterGauge} />
            </div>
          </div>

          {/* 敵キャラの名前と紹介テキスト */}
          <div className="mt-2 text-center flex flex-col items-center">
            {isBossBattle && currentBossDef && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-950 border border-red-500/60 text-red-300 text-[10px] font-black uppercase tracking-wider mb-1">
                <span>👑</span>
                <span>{currentBossDef.bossTitle}</span>
              </div>
            )}
            <h3 className={`text-lg font-black tracking-wider ${isBossBattle ? 'text-yellow-300 drop-shadow' : 'text-white'}`}>
              {displayEnemyDef.name}
            </h3>
            <p className="text-[11px] text-zinc-400 font-bold mt-0.5 max-w-[320px] sm:max-w-xs text-center leading-snug line-clamp-2">
              {displayEnemyDef.flavor}
            </p>
          </div>

          {/* 敵キャラのHPバー（ボス戦時は赤〜ローズのグラデーションHP） */}
          <div className="w-48 sm:w-56 mt-1 flex flex-col items-center">
            <div className="w-full h-4 bg-red-950 rounded-sm overflow-hidden border border-zinc-800 relative">
              <div
                className={`h-full transition-all duration-300 ease-out ${
                  isBossBattle
                    ? 'bg-gradient-to-r from-red-600 via-rose-500 to-yellow-400'
                    : 'bg-green-500'
                }`}
                style={{ width: `${enemyHpPercent}%` }}
              />
            </div>
            <div className={`text-[11px] font-bold mt-0.5 ${isBossBattle ? 'text-red-300 font-black' : 'text-zinc-400'}`}>
              {isBossBattle ? '💀 BOSS HP: ' : 'HP: '}{enemyHp} / {activeEnemyMaxHp}
            </div>
          </div>
        </div>

        {/* --- [タメ演出 1秒間オーバーレイ] 「正解！」「不正解！」ポップアップ --- */}
        {answerState !== 'idle' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-[2px]">
            {answerState === 'correct' ? (
              <div className="flex flex-col items-center justify-center px-8 py-6 rounded-3xl bg-zinc-900/95 border-4 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.6)] anim-pop">
                <span className="text-6xl mb-1">⭕️</span>
                <span className="text-4xl font-black text-yellow-300 tracking-widest drop-shadow-md">
                  正解！
                </span>
                <span className="text-sm font-bold text-zinc-300 mt-2">
                  +{GAME_CONFIG.scorePerCorrectAnswer} てん！
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-8 py-6 rounded-3xl bg-zinc-900/95 border-4 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)] anim-shake">
                <span className="text-6xl mb-1">{isCounterattackCause ? '👾' : '❌'}</span>
                <span className="text-4xl font-black text-red-500 tracking-widest drop-shadow-md">
                  {isCounterattackCause ? 'はんげき！' : '不正解！'}
                </span>
                <span className="text-sm font-bold text-zinc-300 mt-2">
                  {isCounterattackCause ? 'てきのはんげき！ ダメージをうけた！' : 'いたたた！ ダメージをうけた！'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* --- [画面下部] 選択肢ボタン ＆ 自分のHPバー・おかね・装備エリア --- */}
        <div className="w-full shrink-0 mt-auto pt-1 flex flex-col">
          {/* 1. 選択肢ボタン（3つ：固定ボタンサイズ維持＆文字列に応じた最大フォントサイズ） */}
          <div className="w-full grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
            {currentQuestion.choices.map((choiceText, idx) => (
              <button
                key={`${currentQuestion.id}-${idx}`}
                onClick={() => handleAnswerClick(idx)}
                disabled={isProcessing || isGameOver || isStageClearing}
                className={`h-20 sm:h-24 min-h-[5rem] max-h-[6rem] rounded-2xl flex items-center justify-center px-1.5 sm:px-2 shadow-[0_4px_0_#1d4ed8] border-2 border-sky-400/40 select-none overflow-hidden transition-all ${
                  isProcessing
                    ? 'opacity-70 cursor-not-allowed bg-blue-700 shadow-none'
                    : 'bg-blue-600 hover:bg-blue-500 active:translate-y-1 active:shadow-none active:bg-blue-700'
                }`}
              >
                <span
                  className={`w-full text-center text-white drop-shadow break-words line-clamp-2 ${getChoiceFontSize(
                    choiceText
                  )}`}
                >
                  {choiceText}
                </span>
              </button>
            ))}
          </div>

          {/* ★★★ 回答ボタンとHPバーの間の明確なクリアランス（文字列1行分＝約36px〜40pxのゆとり余白を絶対に縮まず確保） ★★★ */}
          <div className="w-full h-9 sm:h-10 shrink-0 select-none pointer-events-none" aria-hidden="true" />

          {/* 2. 自分のHPバー & 🪙おかね（回答ボタンから文字列1行分下方にシフト、おかねも同量下方にシフト） */}
          <div className="w-full flex flex-col items-center">
            {/* 自分のHPバー（青の残HP、赤の減HP） */}
            <div className="w-48 sm:w-56 h-4 bg-red-600 rounded-sm overflow-hidden border border-zinc-800 relative shadow-sm">
              <div
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${playerHpPercent}%` }}
              />
            </div>
            <div className="text-[11px] font-bold text-zinc-400 mt-1">
              じぶんの HP: {playerHp} / {playerMaxHp}
            </div>

            {/* 🪙 所持金（おかね）表示（HPバーと同量下方にシフト：文字列1行分相当のmt-7〜mt-8） */}
            <div
              className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full border transition-all duration-300 mt-7 sm:mt-8 select-none ${
                coinBurstParticles.length > 0
                  ? 'bg-amber-400 text-black border-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.9)] scale-105 ring-2 ring-yellow-300'
                  : 'bg-zinc-900/90 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
              }`}
            >
              <span className="text-sm">🪙</span>
              <span className={`text-[11px] font-bold ${coinBurstParticles.length > 0 ? 'text-black' : 'text-zinc-300'}`}>
                おかね：
              </span>
              <span className={`text-xs font-black tracking-wider ${coinBurstParticles.length > 0 ? 'text-black' : 'text-yellow-300'}`}>
                {money.toLocaleString()}
              </span>
              <span className={`text-[11px] font-bold ${coinBurstParticles.length > 0 ? 'text-black' : 'text-zinc-300'}`}>
                円
              </span>
            </div>
          </div>

          {/* 3. 下部左右：武器（左）と防具（右） */}
          <div className="flex items-center justify-between px-2 mt-3.5">
            {/* 左側：武器アイコン（タップで保有武器リストを表示） */}
            <button
              onClick={() => {
                sound.playClick();
                setEquipModalType('weapon');
                setShowEquipModal(true);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-sky-500/40 hover:border-sky-400 active:scale-95 transition text-left group shadow-sm"
              title="タップして持っている武器リストを開く"
            >
              <div className="w-11 h-11 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center p-1 shrink-0 group-hover:border-sky-400/60 transition">
                <WeaponIcon type={equippedWeapon.iconType} className="w-9 h-9" />
              </div>
              <div>
                <div className="text-[10px] text-sky-400 font-bold flex items-center gap-0.5">
                  <Swords className="w-3 h-3" />
                  <span>ぶき</span>
                </div>
                <div className="text-xs font-black text-white leading-tight">
                  {equippedWeapon.name}
                </div>
                <div className="text-[11px] font-bold text-sky-300">
                  {equippedWeapon.id === 'none' ? '攻撃力 0' : `攻撃力 +${equippedWeapon.attackBonus}`}
                </div>
              </div>
            </button>

            {/* プレイヤー被弾数値ポップアップ */}
            {playerDamageNum !== null && (
              <div className="text-sm font-black text-red-400 anim-damage-num px-2">
                -{playerDamageNum} HP!
              </div>
            )}

            {/* 右側：防具アイコン（タップで保有防具リストを表示） */}
            <button
              onClick={() => {
                sound.playClick();
                setEquipModalType('armor');
                setShowEquipModal(true);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-emerald-500/40 hover:border-emerald-400 active:scale-95 transition text-right group shadow-sm"
              title="タップして持っている防具リストを開く"
            >
              <div>
                <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-end gap-0.5">
                  <span>ぼうぐ</span>
                  <Shield className="w-3 h-3" />
                </div>
                <div className="text-xs font-black text-white leading-tight">
                  {equippedArmor.name}
                </div>
                <div className="text-[11px] font-bold text-emerald-300">
                  {equippedArmor.id === 'none' ? '防御力 0' : `防御力 +${equippedArmor.defenseBonus}`}
                </div>
              </div>
              <div className="w-11 h-11 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center p-1 shrink-0 group-hover:border-emerald-400/60 transition">
                <ArmorIcon type={equippedArmor.iconType} className="w-9 h-9" />
              </div>
            </button>
          </div>
        </div>

      </div>
      )}

      {/* ====================================================================
          ステージクリア オーバーレイ（要件：ステージクリアの旨をフロー表示）
         ==================================================================== */}
      {isStageClearing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md anim-pop p-4">
          <div className="flex flex-col items-center justify-center text-center p-6 bg-zinc-950/90 border-2 border-yellow-500/80 rounded-3xl max-w-sm w-full shadow-[0_0_50px_rgba(250,204,21,0.4)]">
            <span className="text-6xl mb-2 animate-bounce">🎉</span>
            <h2 className="text-3xl sm:text-4xl font-black text-yellow-300 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] tracking-wider">
              ステージ {stage} クリア！
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-bold mt-2">
              モンスターを たおしたぞ！ つぎのステージへ すすもう！
            </p>

            {/* 🪙 おかね獲得演出 */}
            {lastEarnedStageMoney > 0 && (
              <div className="mt-3 px-4 py-2 bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 border-2 border-yellow-400/80 rounded-2xl flex items-center gap-2 text-yellow-300 font-black text-base shadow-[0_0_20px_rgba(250,204,21,0.4)] anim-pop">
                <span className="text-xl animate-bounce">🪙</span>
                <span>+{lastEarnedStageMoney.toLocaleString()} 円 ゲット！</span>
              </div>
            )}

            {/* 💥 壊れた装備の通知（耐久力が尽きた場合） */}
            {brokenItemsNotice.length > 0 && (
              <div className="mt-3.5 w-full p-3 bg-red-950/90 border-2 border-red-500 rounded-2xl shadow-[0_0_25px_rgba(239,68,68,0.7)] flex flex-col items-center gap-1.5 anim-shake">
                <div className="flex items-center gap-1.5 text-red-300 font-black text-xs sm:text-sm">
                  <span className="text-lg">💥</span>
                  <span>たいきゅうりょく が つきた！</span>
                </div>
                {brokenItemsNotice.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 text-white font-bold text-xs bg-black/80 px-2.5 py-1.5 rounded-xl border border-red-500/50 w-full justify-center"
                  >
                    <span>{item.type === 'weapon' ? '⚔️' : '🛡️'}</span>
                    <span className="text-yellow-300 font-black">{item.name}</span>
                    <span className="text-red-300 text-[11px]">が壊れて使えなくなりました</span>
                  </div>
                ))}
                <p className="text-[10px] text-zinc-300 font-bold text-center leading-tight">
                  ※もちものから削除されました。お店で再購入できます！
                </p>
              </div>
            )}

            {/* つぎへすすむ ボタン */}
            <button
              onClick={proceedNextStageFromClear}
              className="mt-4 w-full py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 text-zinc-950 font-black text-sm sm:text-base rounded-2xl shadow-[0_4px_0_#b45309] border border-white active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>つぎのステージへ すすむ</span>
              <span>▶</span>
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          ゲームオーバー画面（要件：今回スコア、最高記録の場合は更新、もういちどあそぶ？）
         ==================================================================== */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 anim-pop">
          <div className="w-full max-w-sm bg-zinc-900 border-2 border-red-500/80 rounded-3xl p-6 text-center shadow-2xl relative">
            <span className="text-6xl mb-2 block">💀</span>
            <h2 className="text-3xl font-black text-red-500 tracking-wider">
              ゲームオーバー
            </h2>

            {/* 最高記録更新メッセージ */}
            {score >= highScore && score > 0 && (
              <div className="my-2 py-1.5 px-3 bg-yellow-400 text-black font-black text-sm rounded-full shadow-lg anim-pop flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>きろくこうしん！ おめでとう！</span>
              </div>
            )}

            {/* 🏆 ランキング入賞メッセージ */}
            {lastRankIn && lastRankIn.rank <= 5 && (
              <div className="my-2 py-2 px-3 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-black font-black text-xs sm:text-sm rounded-2xl shadow-xl anim-pop flex items-center justify-center gap-1.5 border-2 border-white">
                <Trophy className="w-4 h-4 text-amber-950 fill-amber-900" />
                <span>🏆 ランキング {lastRankIn.rank}位 に ランクイン！ ({formatRankingDate()})</span>
              </div>
            )}

            <div className="my-5 bg-black/60 rounded-2xl p-4 border border-zinc-800 space-y-2 text-left">
              <div className="flex justify-between items-center text-sm font-bold text-zinc-300">
                <span>とうたつステージ：</span>
                <span className="text-white text-base font-black">ステージ {stage}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-zinc-300">
                <span>こんかいのスコア：</span>
                <span className="text-yellow-300 text-lg font-black">{score.toLocaleString()} てん</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400 pt-1 border-t border-zinc-800">
                <span>さいこうスコア：</span>
                <span className="text-zinc-200 font-bold">{highScore.toLocaleString()} てん</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-amber-300 pt-1 border-t border-zinc-800">
                <span className="flex items-center gap-1">
                  <span>🪙</span>
                  <span>あつめた おかね：</span>
                </span>
                <span className="text-yellow-300 font-black text-sm">{money.toLocaleString()} 円</span>
              </div>
            </div>

            {/* もういちどあそぶ？ ボタン */}
            <button
              onClick={() => handleStartAdventureWithTransition(true)}
              disabled={adventureTransitionPhase !== 'idle'}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl border-2 border-sky-400/50 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-5 h-5" />
              <span>もういちど あそぶ？</span>
            </button>

            {/* タイトルにもどる ボタン */}
            <button
              onClick={() => {
                if (adventureTransitionPhase !== 'idle') return;
                handleReturnToTitle();
              }}
              disabled={adventureTransitionPhase !== 'idle'}
              className="w-full mt-2.5 py-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 hover:text-white font-bold text-sm rounded-2xl border border-zinc-600 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span>タイトルにもどる</span>
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          ⚔️🛡️ そうびモーダル（保有している武器・防具リストから選択＆装備）
         ==================================================================== */}
      {showEquipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col">
            {/* ヘッダー */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                {equipModalType === 'weapon' ? (
                  <>
                    <Swords className="w-5 h-5 text-sky-400" />
                    <span>ぶき の そうび</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <span>ぼうぐ の そうび</span>
                  </>
                )}
              </h3>
              {/* タブ切り替えボタン */}
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => {
                    sound.playClick();
                    setEquipModalType('weapon');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition ${
                    equipModalType === 'weapon'
                      ? 'bg-sky-500 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  ⚔️ ぶき
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setEquipModalType('armor');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition ${
                    equipModalType === 'armor'
                      ? 'bg-emerald-500 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🛡️ ぼうぐ
                </button>
              </div>
            </div>

            {/* 説明文 */}
            <p className="text-[11px] text-zinc-400 mt-2.5 mb-1.5 font-bold">
              {equipModalType === 'weapon'
                ? '持っている武器をタップして装備を切り替えられます'
                : '持っている防具をタップして装備を切り替えられます'}
            </p>

            {/* 保有アイテムリスト（攻撃力・防御力昇順、「なし」が最上部） */}
            <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
              {equipModalType === 'weapon' ? (
                // 武器リスト: 「なし」が最上部、以降は攻撃力昇順
                [
                  ...WEAPON_LIST.filter((w) => w.id === 'none'),
                  ...WEAPON_LIST.filter((w) => w.id !== 'none' && ownedWeaponIds.includes(w.id)).sort(
                    (a, b) => a.attackBonus - b.attackBonus
                  ),
                ].map((w) => {
                  const isEquipped = equippedWeapon.id === w.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => handleEquipWeapon(w)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition active:scale-98 select-none text-left ${
                        isEquipped
                          ? 'bg-sky-950/80 border-2 border-sky-400 ring-2 ring-sky-400/40 shadow-lg'
                          : 'bg-zinc-800/80 border border-zinc-700/80 hover:border-zinc-500'
                      }`}
                    >
                      {/* 1. 左：アイテムのアイコン画像 */}
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center p-1 shrink-0 ${
                        isEquipped ? 'bg-sky-900/40 border-sky-400/60' : 'bg-zinc-950/80 border-zinc-800'
                      }`}>
                        <WeaponIcon type={w.iconType} className="w-10 h-10" />
                      </div>

                      {/* 2. 中央：アイテムの名前 ＆ そうび中バッジ */}
                      <div className="flex-1 px-3 min-w-0">
                        <div className="text-sm font-black text-white flex items-center gap-1.5 flex-wrap">
                          <span className="truncate">{w.name}</span>
                          {isEquipped && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-500 text-white shadow-sm flex items-center gap-0.5 shrink-0 animate-in fade-in duration-200">
                              <Check className="w-3 h-3" />
                              <span>そうび中</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-bold mt-0.5">
                          {w.id === 'none' ? '武器をはずす（ボーナスなし）' : 'タップでこの武器をそうび'}
                        </div>
                      </div>

                      {/* 3. 右：アイテムの強さ（攻撃力） */}
                      <div className="text-right shrink-0">
                        <span className={`text-xs font-black px-2.5 py-1 rounded-xl inline-block ${
                          isEquipped
                            ? 'bg-sky-500/25 text-sky-200 border border-sky-400/60 shadow-sm'
                            : 'bg-zinc-900 text-zinc-300 border border-zinc-700'
                        }`}>
                          {w.id === 'none' ? '攻撃力 0' : `攻撃力 +${w.attackBonus}`}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                // 防具リスト: 「なし」が最上部、以降は防御力昇順
                [
                  ...ARMOR_LIST.filter((a) => a.id === 'none'),
                  ...ARMOR_LIST.filter((a) => a.id !== 'none' && ownedArmorIds.includes(a.id)).sort(
                    (a, b) => a.defenseBonus - b.defenseBonus
                  ),
                ].map((a) => {
                  const isEquipped = equippedArmor.id === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => handleEquipArmor(a)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition active:scale-98 select-none text-left ${
                        isEquipped
                          ? 'bg-emerald-950/80 border-2 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg'
                          : 'bg-zinc-800/80 border border-zinc-700/80 hover:border-zinc-500'
                      }`}
                    >
                      {/* 1. 左：アイテムのアイコン画像 */}
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center p-1 shrink-0 ${
                        isEquipped ? 'bg-emerald-900/40 border-emerald-400/60' : 'bg-zinc-950/80 border-zinc-800'
                      }`}>
                        <ArmorIcon type={a.iconType} className="w-10 h-10" />
                      </div>

                      {/* 2. 中央：アイテムの名前 ＆ そうび中バッジ */}
                      <div className="flex-1 px-3 min-w-0">
                        <div className="text-sm font-black text-white flex items-center gap-1.5 flex-wrap">
                          <span className="truncate">{a.name}</span>
                          {isEquipped && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-sm flex items-center gap-0.5 shrink-0 animate-in fade-in duration-200">
                              <Check className="w-3 h-3" />
                              <span>そうび中</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-bold mt-0.5">
                          {a.id === 'none' ? '防具をはずす（ボーナスなし）' : 'タップでこの防具をそうび'}
                        </div>
                      </div>

                      {/* 3. 右：アイテムの強さ（防御力） */}
                      <div className="text-right shrink-0">
                        <span className={`text-xs font-black px-2.5 py-1 rounded-xl inline-block ${
                          isEquipped
                            ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/60 shadow-sm'
                            : 'bg-zinc-900 text-zinc-300 border border-zinc-700'
                        }`}>
                          {a.id === 'none' ? '防御力 0' : `防御力 +${a.defenseBonus}`}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* 最下部：「もどる」ボタン */}
            <button
              onClick={() => {
                sound.playClick();
                setShowEquipModal(false);
              }}
              className="mt-3.5 w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white font-black text-base rounded-2xl border-2 border-sky-300 shadow-[0_4px_0_#1e3a8a] transition flex items-center justify-center gap-2"
            >
              <span className="text-lg">↩️</span>
              <span>もどる</span>
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          ⚙️ 設定モーダル（出題モード・ルールガイド・ボス召喚テスト・キャッシュ更新）
         ==================================================================== */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-yellow-400" />
                <span>ゲーム せってい</span>
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-xs font-bold px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300"
              >
                とじる
              </button>
            </div>

            {/* バトル画面（!isTitleScreen）とタイトル画面（isTitleScreen）で表示項目を分岐 */}
            {!isTitleScreen ? (
              /* バトル画面：現在選択中の出題形式とタイトルに戻るボタンのみ表示 */
              <div className="space-y-4 mt-4">
                {/* 現在選択中の出題形式 */}
                <div className="p-3.5 rounded-2xl bg-black/60 border border-zinc-800">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-zinc-800/80">
                    <div className="flex items-center gap-1.5 text-xs font-black text-zinc-300">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      <span>現在選択中の出題形式</span>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        quizMode === 'auto_stage_math'
                          ? 'bg-yellow-950/80 text-yellow-300 border-yellow-500/60'
                          : 'bg-blue-950 text-blue-300 border-blue-500/60'
                      }`}
                    >
                      {quizMode === 'auto_stage_math' ? '⚡️ステージ連動' : '📖通常出題'}
                    </span>
                  </div>

                  {quizMode === 'auto_stage_math' ? (
                    <div>
                      <div className="text-[11px] text-zinc-300 font-bold mb-2">
                        現在のステージ：<span className="text-yellow-400 font-black">Stage {stage}</span>
                      </div>
                      {/* ステージ連動 算数ルールガイド */}
                      <div className="p-2 rounded-xl bg-yellow-950/30 border border-yellow-500/30 text-[10px] text-yellow-200/90 space-y-1">
                        <div className="font-bold text-yellow-300">【ステージ連動 算数ルール】</div>
                        {getMathDifficultyRanges().map((r) => {
                          const isCurrent = stage >= r.startStage && stage <= r.endStage;
                          return (
                            <div
                              key={r.level}
                              className={`flex items-center justify-between py-0.5 px-1 rounded ${
                                isCurrent
                                  ? 'font-bold text-yellow-300 bg-yellow-500/20 border border-yellow-500/30'
                                  : 'text-yellow-200/75'
                              }`}
                            >
                              <span className="truncate pr-1">
                                Lv.{r.level} (St.{r.isUnlimited ? `${r.startStage}〜` : `${r.startStage}〜${r.endStage}`})：{r.title}
                              </span>
                              {isCurrent && (
                                <span className="text-[9px] px-1 py-0.2 bg-yellow-400 text-black font-black rounded shrink-0">
                                  現在
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-[11px] text-blue-200/90 space-y-1">
                      <div className="font-bold text-blue-300">
                        ジャンル：
                        <span className="text-yellow-300 font-black ml-1">
                          {selectedCategory === 'all'
                            ? 'ぜんぶ'
                            : selectedCategory === 'math'
                            ? 'さんすう'
                            : selectedCategory === 'words'
                            ? 'ことば'
                            : 'なぞなぞ'}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 leading-snug">
                        固定問題リストから出題されています（出題形式の変更はタイトル画面で行えます）。
                      </div>
                    </div>
                  )}
                </div>

                {/* タイトル画面にもどるボタン */}
                <div className="pt-2">
                  <button
                    onClick={handleReturnToTitle}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-950 to-zinc-900 border border-red-500/60 hover:border-red-400 text-red-200 hover:text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition active:scale-95 shadow-md cursor-pointer"
                  >
                    <Home className="w-4 h-4 text-red-400" />
                    <span>タイトルがめん に もどる</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl cursor-pointer transition active:scale-95"
                >
                  とじる
                </button>
              </div>
            ) : (
              /* タイトル画面：フル設定メニュー */
              <div>
                {/* 1. 出題モード選択（ステージ連動 算数自動生成 vs 通常データベース） */}
                <div className="mt-4 p-3 rounded-2xl bg-black/60 border border-zinc-800">
                  <div className="text-xs font-black text-zinc-300 mb-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      <span>出題モードの選択</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-bold">
                      {quizMode === 'auto_stage_math' ? '⚡️ステージ連動' : '📖通常出題'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* モードA: 通常問題（データベース） */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        setQuizMode('database');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition active:scale-95 ${
                        quizMode === 'database'
                          ? 'bg-blue-900/40 border-blue-400 text-white ring-1 ring-blue-400/40'
                          : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="text-xs font-black flex items-center gap-1">
                        <span>📖 通常問題</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-1 leading-snug">
                        固定リストから出題（ことば・なぞなぞ等）
                      </div>
                    </button>

                    {/* モードB: ステージ連動 算数自動生成 */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        setQuizMode('auto_stage_math');
                        setDynamicQuestion(generateStageMathQuestion(stage));
                      }}
                      className={`p-2.5 rounded-xl border text-left transition active:scale-95 ${
                        quizMode === 'auto_stage_math'
                          ? 'bg-yellow-900/40 border-yellow-400 text-yellow-100 ring-1 ring-yellow-400/60'
                          : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="text-xs font-black text-yellow-300 flex items-center gap-1">
                        <span>⚡️ 算数自動生成</span>
                      </div>
                      <div className="text-[10px] text-zinc-300 mt-1 leading-snug">
                        ステージに合わせて難易度が無限に変化！
                      </div>
                    </button>
                  </div>

                  {/* ステージ連動算数の難易度ガイド */}
                  {quizMode === 'auto_stage_math' ? (
                    <div className="mt-2.5 p-2 rounded-xl bg-yellow-950/30 border border-yellow-500/30 text-[10px] text-yellow-200/90 space-y-1">
                      <div className="font-bold text-yellow-300">【ステージ連動 算数ルール】</div>
                      {getMathDifficultyRanges().map((r) => {
                        const isCurrent = stage >= r.startStage && stage <= r.endStage;
                        return (
                          <div
                            key={r.level}
                            className={`flex items-center justify-between py-0.5 px-1 rounded ${
                              isCurrent
                                ? 'font-bold text-yellow-300 bg-yellow-500/20 border border-yellow-500/30'
                                : 'text-yellow-200/75'
                            }`}
                          >
                            <span className="truncate pr-1">
                              Lv.{r.level} (St.{r.isUnlimited ? `${r.startStage}〜` : `${r.startStage}〜${r.endStage}`})：{r.title}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] px-1 py-0.2 bg-yellow-400 text-black font-black rounded shrink-0">
                                現在
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* 通常モード時のみジャンル選択を表示 */
                    <div className="mt-3 pt-2 border-t border-zinc-800">
                      <div className="text-[11px] font-bold text-zinc-400 mb-1.5 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 text-yellow-400" />
                        <span>出題ジャンルの選択</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-xs font-bold">
                        {[
                          { id: 'all', label: 'ぜんぶ' },
                          { id: 'math', label: 'さんすう' },
                          { id: 'words', label: 'ことば' },
                          { id: 'riddle', label: 'なぞなぞ' },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`py-1.5 px-1 rounded-lg text-center border text-[11px] transition ${
                              selectedCategory === cat.id
                                ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 font-black'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ロック警告メッセージ */}
                {lockMessage && (
                  <div className="mt-3 p-2 rounded-xl bg-amber-950/80 border border-amber-500/60 text-[11px] text-amber-200 font-bold text-center anim-pop flex items-center justify-center gap-1.5 shadow-lg">
                    <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{lockMessage}</span>
                  </div>
                )}

                {/* ボス戦テスト召喚 ＆ おみせテストボタン */}
                <div className="mt-3.5 pt-3 border-t border-zinc-800/80">
                  <div className="text-xs font-black text-amber-300 mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span>👑</span>
                      <span>テスト機能（すぐ確認可能）</span>
                    </div>
                    <button
                      onClick={() => {
                        sound.playClick();
                        const newMoney = money + 500;
                        setMoney(newMoney);
                        try {
                          localStorage.setItem('hirameki_money', newMoney.toString());
                        } catch {}
                        setLockMessage('おかねを 500円 追加しました！');
                        setTimeout(() => setLockMessage(null), 2000);
                      }}
                      className="py-0.5 px-2 rounded-lg bg-yellow-500/20 border border-yellow-400/50 hover:bg-yellow-500/30 text-yellow-300 text-[10px] font-black transition active:scale-95"
                    >
                      🪙 +500円追加
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setShowSettingsModal(false);
                        handleTriggerBoss('boss_metal_caterpillar_bo');
                      }}
                      className="py-2 px-1.5 rounded-xl bg-gradient-to-r from-orange-950 to-zinc-900 border border-orange-500/80 text-orange-200 hover:text-white text-[10px] font-black flex flex-col items-center justify-center gap-0.5 transition active:scale-95 shadow-sm text-center"
                    >
                      <span className="text-base">🐛</span>
                      <span className="truncate">いもむしボー</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setShowSettingsModal(false);
                        handleTriggerBoss();
                      }}
                      className="py-2 px-1.5 rounded-xl bg-zinc-900 border border-red-500/60 text-red-300 hover:text-white text-[10px] font-black flex flex-col items-center justify-center gap-0.5 transition active:scale-95 shadow-sm text-center"
                    >
                      <span className="text-base">🎲</span>
                      <span className="truncate">ランダムボス</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setShowSettingsModal(false);
                        setShowShop(true);
                      }}
                      className="py-2 px-1.5 rounded-xl bg-zinc-900 border border-amber-500/60 text-amber-300 hover:text-white text-[10px] font-black flex flex-col items-center justify-center gap-0.5 transition active:scale-95 shadow-sm text-center"
                    >
                      <span className="text-base">🛒</span>
                      <span className="truncate">おみせテスト</span>
                    </button>
                  </div>
                </div>

                {/* 装備・所持品初期化ボタン */}
                <div className="mt-3.5 pt-3 border-t border-zinc-800/80">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setOwnedWeaponIds(['none']);
                      setOwnedArmorIds(['none']);
                      setEquippedWeapon(WEAPON_LIST[0]);
                      setEquippedArmor(ARMOR_LIST[0]);
                      try {
                        localStorage.removeItem('hirameki_owned_weapons');
                        localStorage.removeItem('hirameki_owned_armors');
                        localStorage.removeItem('hirameki_equipped_weapon_id');
                        localStorage.removeItem('hirameki_equipped_armor_id');
                      } catch {}
                      setLockMessage('装備を「初期状態（なし）」にリセットしました！');
                      setTimeout(() => setLockMessage(null), 2500);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>そうびを「初期状態（なし）」にリセット</span>
                  </button>

                  {/* スコアランキング初期化ボタン */}
                  <button
                    onClick={() => {
                      sound.playClick();
                      setRankingList(DEFAULT_SCORE_RANKINGS);
                      try {
                        localStorage.setItem('hirameki_score_ranking', JSON.stringify(DEFAULT_SCORE_RANKINGS));
                      } catch {}
                      setLockMessage('スコアランキングを初期状態にリセットしました！');
                      setTimeout(() => setLockMessage(null), 2500);
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
                  >
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                    <span>スコアランキングを初期化</span>
                  </button>
                </div>

                {/* キャッシュ更新・最新版強制再読み込みボタン */}
                <div className="mt-3.5 pt-3 border-t border-zinc-800/80">
                  <button
                    onClick={async () => {
                      sound.playClick();
                      if ('caches' in window) {
                        const keys = await caches.keys();
                        await Promise.all(keys.map((k) => caches.delete(k)));
                      }
                      if ('serviceWorker' in navigator) {
                        const regs = await navigator.serviceWorker.getRegistrations();
                        for (const reg of regs) {
                          await reg.unregister();
                        }
                      }
                      window.location.reload();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-sky-400" />
                    <span>最新版に更新（キャッシュ消去）</span>
                  </button>
                  <div className="text-[10px] text-zinc-500 text-center mt-1">
                    ※画面レイアウトやアイコンが反映されない場合にタップしてください（v3.0）
                  </div>
                </div>

                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-xl cursor-pointer"
                >
                  とじる
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          👑 1. スマブラ風 ボス出現カットイン演出（WARNING!! 緊急警報 ＆ キャラ紹介）
         ==================================================================== */}
      {showBossCutIn && currentBossDef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
          {/* 赤と黒のダイナミック警戒ラインストライプ背景 */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[repeating-linear-gradient(45deg,#000,#000_20px,#ef4444_20px,#ef4444_40px)]" />

          {/* 上下を走るWARNINGバナー */}
          <div className="absolute top-4 sm:top-6 left-0 right-0 py-1.5 bg-red-600 text-white font-black tracking-widest text-center text-[10px] sm:text-xs uppercase flex items-center justify-center gap-3 shadow-lg animate-pulse z-10">
            <span>⚠️ WARNING!!</span>
            <span>EMERGENCY BOSS APPROACHING!!</span>
            <span>WARNING!! ⚠️</span>
          </div>

          <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 py-1.5 bg-red-600 text-white font-black tracking-widest text-center text-[10px] sm:text-xs uppercase flex items-center justify-center gap-3 shadow-lg animate-pulse z-10">
            <span>⚠️ WARNING!!</span>
            <span>EMERGENCY BOSS APPROACHING!!</span>
            <span>WARNING!! ⚠️</span>
          </div>

          {/* スマブラ風 巨大スラッシュ背景カードプレート */}
          <div className="relative w-full max-w-sm mx-4 bg-gradient-to-b from-red-950 via-zinc-900 to-black border-4 border-red-500 shadow-[0_0_60px_rgba(239,68,68,0.8)] p-5 rounded-3xl flex flex-col items-center text-center transform hover:scale-[1.01] transition-transform">
            {/* 上部バッジ（子供でも読めるようにふりがな付きでシンプル化） */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-red-600 text-white text-xs sm:text-sm font-black rounded-full uppercase tracking-wider mb-2 shadow-lg animate-bounce">
              <span>⚔️</span>
              <span>ボス降臨（こうりん）</span>
              <span>⚔️</span>
            </div>

            {/* ボス肩書き（称号：ふりがな付き） */}
            <p className="text-sm font-extrabold text-red-300 tracking-wider">
              ー {currentBossDef.bossTitle} ー
            </p>

            {/* ボス名（特大インパクト文字） */}
            <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-400 to-yellow-200 tracking-wide mt-0.5 mb-2 drop-shadow-[0_2px_10px_rgba(239,68,68,0.8)]">
              {currentBossDef.name}
            </h2>

            {/* ボスSVGプレビュー */}
            <div className="w-44 h-44 sm:w-52 sm:h-52 my-1 relative flex items-center justify-center rounded-2xl bg-black/70 border-2 border-red-500/80 p-2 shadow-2xl">
              <div className="absolute inset-0 bg-red-600/15 rounded-2xl animate-pulse" />
              <MonsterRenderer type={currentBossDef.svgType} isHit={false} />
            </div>

            {/* 決め台詞（ふりがな付き） */}
            <p className="text-xs sm:text-sm font-extrabold text-amber-200/95 italic my-2 px-2 leading-snug line-clamp-2">
              {currentBossDef.introQuote}
            </p>

            {/* 出陣ボタン（2行に改行＆ふりがな付き） */}
            <button
              onClick={() => {
                sound.playClick();
                setShowBossCutIn(false);
              }}
              className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 hover:from-red-500 hover:to-orange-400 active:scale-95 text-white font-black rounded-2xl shadow-[0_4px_0_#7f1d1d] border-2 border-yellow-300 tracking-wider transition-all flex flex-col items-center justify-center gap-0.5"
            >
              <span className="text-lg sm:text-xl text-yellow-200 drop-shadow">
                いざ決戦（けっせん）へ
              </span>
              <span className="text-xs sm:text-sm text-white/95 font-bold">
                タップでバトル開始（かいし）
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          👑 2. 超豪華 ボス撃破大勝利モーダル（豪華ファンファーレ ＆ 特大報酬）
         ==================================================================== */}
      {showBossVictory && currentBossDef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-amber-950 via-zinc-900 to-black border-4 border-yellow-400 shadow-[0_0_60px_rgba(250,204,21,0.6)] rounded-3xl p-6 text-center flex flex-col items-center">
            {/* 黄金の王冠アイコン */}
            <div className="text-6xl mb-1 animate-bounce">👑</div>

            <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black text-xs rounded-full uppercase tracking-wider mb-2 shadow">
              GRAND VICTORY!
            </div>

            <h2 className="text-3xl font-black text-yellow-300 tracking-wider drop-shadow-md">
              ボスをたおした！！
            </h2>

            <p className="text-sm sm:text-base font-extrabold text-zinc-200 mt-2 leading-relaxed">
              <span>{currentBossDef.name}を</span><br />
              <span className="text-yellow-300 font-black">みごと とうばつ！</span>
            </p>

            {/* 豪華報酬ボックス */}
            <div className="w-full bg-black/70 border border-yellow-500/40 rounded-2xl p-3.5 my-3.5 flex flex-col gap-2.5 text-left shadow-inner">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-yellow-400 font-bold flex items-center gap-1.5">
                  <span>💎</span> ボーナス
                </span>
                <span className="text-yellow-300 font-black text-base">+2,000 てん！</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <span>🪙</span> おかね
                </span>
                <span className="text-amber-300 font-black text-sm sm:text-base">+{lastEarnedBossMoney.toLocaleString()} 円！</span>
              </div>
              {lastEarnedBossBonus > 0 && (
                <div className="text-[11px] text-amber-200/90 pl-6 -mt-1 font-bold">
                  （ボス討伐 {(lastEarnedBossMoney - lastEarnedBossBonus).toLocaleString()}円 ＋ ステージ{bossStageOrigin}クリアボーナス +{lastEarnedBossBonus.toLocaleString()}円）
                </div>
              )}
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span>💖</span> お祝い（おいわい）
                </span>
                <span className="text-emerald-300 font-black text-sm">HPぜんかいふく！</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm border-t border-zinc-800 pt-2">
                <span className="text-sky-400 font-bold flex items-center gap-1.5">
                  <span>🚩</span> つぎのステージ
                </span>
                <span className="text-sky-300 font-black text-sm">ステージ {bossStageOrigin + 1}</span>
              </div>
            </div>

            {/* 💥 ボス戦で耐久力が尽きて壊れた装備の通知 */}
            {bossBrokenItems.length > 0 && (
              <div className="w-full my-2 p-3 bg-red-950/90 border-2 border-red-500 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.7)] flex flex-col items-center gap-1.5 anim-shake text-center">
                <div className="flex items-center gap-1.5 text-red-300 font-black text-xs sm:text-sm">
                  <span className="text-base">💥</span>
                  <span>激闘により そうび が こわれました！</span>
                </div>
                {bossBrokenItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-1.5 text-white font-bold text-xs bg-black/70 px-2.5 py-1.5 rounded-xl border border-red-500/40 w-full justify-center"
                  >
                    <span>{item.type === 'weapon' ? '⚔️' : '🛡️'}</span>
                    <span className="text-yellow-300 font-black">{item.name}</span>
                    <span className="text-red-300 text-[11px]">が壊れて使えなくなりました</span>
                  </div>
                ))}
                <span className="text-[10px] text-zinc-300 font-bold">
                  （もちものから削除 / お店で再購入できます）
                </span>
              </div>
            )}

            {/* ボス勝利後の選択肢（おみせにいく / つぎにすすむ） */}
            <div className="w-full flex flex-col gap-2.5 mt-2">
              {/* 1. おみせにいく ボタン */}
              <button
                onClick={() => {
                  sound.playClick();
                  setShowShop(true);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white font-black text-base sm:text-lg rounded-2xl shadow-[0_4px_0_#1e3a8a] border-2 border-sky-300 tracking-wide transition-all flex items-center justify-center gap-2.5"
              >
                <span className="text-2xl filter drop-shadow">🛒</span>
                <span className="drop-shadow">おみせにいく</span>
              </button>

              {/* 2. つぎにすすむ！ ▶ ボタン */}
              <button
                onClick={handleProceedFromBossVictory}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 active:scale-95 text-zinc-950 font-black text-base rounded-2xl shadow-[0_4px_0_#b45309] border border-white tracking-wide transition-all flex items-center justify-center gap-1.5"
              >
                <span>つぎにすすむ！</span>
                <span>▶</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          🛒 おみせ画面モーダル（武器・防具の購入画面）
         ==================================================================== */}
      {showShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-2 border-amber-500/80 rounded-3xl p-4 sm:p-5 shadow-[0_0_50px_rgba(245,158,11,0.3)] max-h-[90vh] flex flex-col">
            {/* ヘッダー */}
            <div className="pb-3 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-amber-300 flex items-center gap-1.5">
                  <span>🛒</span>
                  <span>ぼうけんのおみせ</span>
                </h3>
                <p className="text-[10px] text-zinc-400 font-bold mt-0.5">
                  ぶき や ぼうぐ を かって パワーアップ！
                </p>
              </div>

              {/* 所持金表示 */}
              <div className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/60 flex items-center gap-1.5 shadow-sm">
                <span className="text-sm">🪙</span>
                <span className="text-xs font-black text-yellow-300">
                  {money.toLocaleString()} 円
                </span>
              </div>
            </div>

            {/* 商品リスト（武器価格昇順 → 防具価格昇順） */}
            <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1">
              {/* 1. 武器セクション（価格昇順） */}
              <div>
                <div className="text-xs font-black text-sky-400 mb-2 flex items-center gap-1 px-1">
                  <Swords className="w-3.5 h-3.5" />
                  <span>ぶき（武器）</span>
                </div>
                <div className="space-y-2">
                  {WEAPON_LIST.filter((w) => w.id !== 'none')
                    .sort((a, b) => a.price - b.price)
                    .map((w) => {
                      const isOwned = ownedWeaponIds.includes(w.id);
                      const isEquipped = equippedWeapon.id === w.id;
                      return (
                        <button
                          key={w.id}
                          onClick={() => {
                            sound.playClick();
                            if (isOwned) {
                              setLockMessage(`「${w.name}」は すでに持っています！そうび画面から選べるよ！`);
                              setTimeout(() => setLockMessage(null), 2500);
                              return;
                            }
                            setSelectedShopItem({
                              id: w.id,
                              name: w.name,
                              bonus: w.attackBonus,
                              iconType: w.iconType,
                              price: w.price,
                              type: 'weapon',
                            });
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition active:scale-98 text-left ${
                            isOwned
                              ? 'bg-zinc-900/60 border-zinc-800 opacity-80'
                              : 'bg-zinc-800/80 border-sky-500/40 hover:border-sky-400 shadow-sm'
                          }`}
                        >
                          {/* 左：アイコン */}
                          <div className="w-11 h-11 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-1 shrink-0">
                            <WeaponIcon type={w.iconType} className="w-9 h-9" />
                          </div>

                          {/* 中央：名前＆強さ */}
                          <div className="flex-1 px-3">
                            <div className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                              <span>{w.name}</span>
                              {isEquipped && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-sky-500 text-white">
                                  そうび中
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-bold text-sky-400 mt-0.5">
                              攻撃力 +{w.attackBonus}
                            </div>
                          </div>

                          {/* 右：価格 ＆ 購入ずみバッジ */}
                          <div className="text-right shrink-0 flex flex-col items-end gap-1">
                            <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-black shadow flex items-center gap-1 border border-yellow-200">
                              <span>🪙</span>
                              <span>{w.price.toLocaleString()} 円</span>
                            </span>
                            {isOwned && (
                              <span className="px-1.5 py-0.5 rounded-md bg-zinc-900 text-emerald-400 text-[10px] font-black border border-emerald-500/40 flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" />
                                <span>購入ずみ</span>
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* 2. 防具セクション（価格昇順） */}
              <div>
                <div className="text-xs font-black text-emerald-400 mb-2 flex items-center gap-1 px-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>ぼうぐ（防具）</span>
                </div>
                <div className="space-y-2">
                  {ARMOR_LIST.filter((a) => a.id !== 'none')
                    .sort((a, b) => a.price - b.price)
                    .map((a) => {
                      const isOwned = ownedArmorIds.includes(a.id);
                      const isEquipped = equippedArmor.id === a.id;
                      return (
                        <button
                          key={a.id}
                          onClick={() => {
                            sound.playClick();
                            if (isOwned) {
                              setLockMessage(`「${a.name}」は すでに持っています！そうび画面から選べるよ！`);
                              setTimeout(() => setLockMessage(null), 2500);
                              return;
                            }
                            setSelectedShopItem({
                              id: a.id,
                              name: a.name,
                              bonus: a.defenseBonus,
                              iconType: a.iconType,
                              price: a.price,
                              type: 'armor',
                            });
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition active:scale-98 text-left ${
                            isOwned
                              ? 'bg-zinc-900/60 border-zinc-800 opacity-80'
                              : 'bg-zinc-800/80 border-emerald-500/40 hover:border-emerald-400 shadow-sm'
                          }`}
                        >
                          {/* 左：アイコン */}
                          <div className="w-11 h-11 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-1 shrink-0">
                            <ArmorIcon type={a.iconType} className="w-9 h-9" />
                          </div>

                          {/* 中央：名前＆強さ */}
                          <div className="flex-1 px-3">
                            <div className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                              <span>{a.name}</span>
                              {isEquipped && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500 text-white">
                                  そうび中
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-bold text-emerald-400 mt-0.5">
                              防御力 +{a.defenseBonus}
                            </div>
                          </div>

                          {/* 右：価格 ＆ 購入ずみバッジ */}
                          <div className="text-right shrink-0 flex flex-col items-end gap-1">
                            <span className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-black shadow flex items-center gap-1 border border-yellow-200">
                              <span>🪙</span>
                              <span>{a.price.toLocaleString()} 円</span>
                            </span>
                            {isOwned && (
                              <span className="px-1.5 py-0.5 rounded-md bg-zinc-900 text-emerald-400 text-[10px] font-black border border-emerald-500/40 flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" />
                                <span>購入ずみ</span>
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* お店メッセージ表示 */}
            {lockMessage && (
              <div className="my-2 p-2 rounded-xl bg-amber-950/90 border border-amber-500/60 text-[11px] text-amber-200 font-bold text-center anim-pop">
                {lockMessage}
              </div>
            )}

            {/* 最下部：「おみせをでる」ボタン（ボス戦クリア画面に戻る） */}
            <button
              onClick={() => {
                sound.playClick();
                setShowShop(false);
              }}
              className="mt-3.5 w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white font-black text-base rounded-2xl border-2 border-sky-300 shadow-[0_4px_0_#1e3a8a] transition flex items-center justify-center gap-2"
            >
              <span className="text-lg">↩️</span>
              <span>おみせをでる</span>
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          🛍️ おみせ購入確認ウィンドウ（「かいますか？」3択：かう／かって装備する／かわない）
         ==================================================================== */}
      {selectedShopItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xs bg-zinc-900 border-2 border-yellow-400 rounded-3xl p-5 shadow-2xl text-center flex flex-col items-center anim-pop">
            <span className="text-3xl mb-1">🛒</span>
            <h4 className="text-lg font-black text-yellow-300">かいますか？</h4>

            {/* アイテムカード */}
            <div className="w-full bg-black/70 border border-zinc-800 rounded-2xl p-3 my-3 flex items-center gap-3">
              <div className="w-12 h-12 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center p-1 shrink-0">
                {selectedShopItem.type === 'weapon' ? (
                  <WeaponIcon type={selectedShopItem.iconType as any} className="w-10 h-10" />
                ) : (
                  <ArmorIcon type={selectedShopItem.iconType as any} className="w-10 h-10" />
                )}
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="text-sm font-black text-white truncate">
                  {selectedShopItem.name}
                </div>
                <div className="text-xs font-bold text-sky-400">
                  {selectedShopItem.type === 'weapon'
                    ? `攻撃力 +${selectedShopItem.bonus}`
                    : `防御力 +${selectedShopItem.bonus}`}
                </div>
                <div className="text-xs font-black text-amber-300 mt-0.5">
                  価格：🪙 {selectedShopItem.price.toLocaleString()} 円
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 font-bold mb-3">
              あなたのおかね：<strong className="text-yellow-300">{money.toLocaleString()} 円</strong>
            </p>

            {/* 3つの選択肢ボタン（1番目：かって装備する、2番目：かう、3番目：かわない） */}
            <div className="w-full flex flex-col gap-2">
              {/* 1. かって装備する */}
              <button
                onClick={() => handleBuyItem(true)}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-white font-black text-sm rounded-xl border border-emerald-300 shadow transition"
              >
                かって装備（そうび）する
              </button>

              {/* 2. かう */}
              <button
                onClick={() => handleBuyItem(false)}
                className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-zinc-950 font-black text-sm rounded-xl border border-yellow-200 shadow transition"
              >
                かう
              </button>

              {/* 3. かわない */}
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedShopItem(null);
                }}
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 hover:text-white font-bold text-xs rounded-xl border border-zinc-700 transition"
              >
                かわない
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          ⚠️ 「おかねがたりません」アラート（0.5秒間表示）
         ==================================================================== */}
      {showNotEnoughMoney && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-100">
          <div className="bg-zinc-950 border-2 border-red-500 rounded-2xl px-6 py-5 shadow-[0_0_40px_rgba(239,68,68,0.7)] flex flex-col items-center gap-2 anim-shake">
            <span className="text-4xl">❌</span>
            <span className="text-lg font-black text-red-400 tracking-wide">
              おかねがたりません
            </span>
          </div>
        </div>
      )}

      {/* ====================================================================
          ⚔️ 冒険スタート画面遷移オーバーレイ（タイトル画面・ゲームオーバー共通）
          要件:
          ・タイトル画面で「はじめる！」ボタンを押下後、1秒間で画面全体が黒い画面にフェード（終了時は真っ黒）
          ・その後、「ぼうけんスタート！」の文字が画面中央からフェードイン（0.5秒間で段々とアルファ値1に）
          ・その後、バトル画面へ遷移
          ・ゲームオーバー時の「もういちどあそぶ？」ボタン押下時も共通化
         ==================================================================== */}
      {adventureTransitionPhase !== 'idle' && (
        <div
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black select-none pointer-events-auto ${
            adventureTransitionPhase === 'fade_to_black'
              ? 'anim-start-fade-black'
              : adventureTransitionPhase === 'fade_to_battle'
              ? 'anim-start-fade-battle'
              : 'opacity-100'
          }`}
        >
          {adventureTransitionPhase !== 'fade_to_black' && (
            <div
              className={`flex flex-col items-center justify-center text-center px-6 ${
                adventureTransitionPhase === 'text_in' ? 'anim-start-text-in' : 'opacity-100'
              }`}
            >
              {/* きらめき＆アイコン */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl animate-spin-slow">✨</span>
                <span className="text-4xl filter drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]">⚔️</span>
                <span className="text-2xl animate-pulse">✨</span>
              </div>

              {/* メイン文字列: 「ぼうけんスタート！」 */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-500 filter drop-shadow-[0_4px_16px_rgba(245,158,11,0.8)] drop-shadow-[0_0_30px_rgba(250,204,21,0.6)] tracking-widest">
                ぼうけんスタート！
              </h1>

              {/* サブテキスト */}
              <div className="mt-4 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 backdrop-blur-md text-amber-200 text-xs sm:text-sm font-black tracking-widest shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                STAGE 1 - はじまりのバトル
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
