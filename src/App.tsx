/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useTransition } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Trophy,
  Shield,
  Swords,
  ChevronRight,
  HelpCircle,
  Settings,
  Lock
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
} from './gameData.ts';
import { sound } from './audio.ts';
import { MonsterRenderer } from './components/MonsterRenderer.tsx';
import { WeaponIcon, ArmorIcon } from './components/ItemIcons.tsx';
import { PWAInstallButton } from './components/PWAInstallButton.tsx';

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

  // プレイヤー装備とステータス
  const [playerHp, setPlayerHp] = useState<number>(GAME_CONFIG.playerInitialHp);
  const [playerMaxHp] = useState<number>(GAME_CONFIG.playerInitialHp);
  const [equippedWeapon, setEquippedWeapon] = useState<WeaponItem>(WEAPON_LIST[0]); // 初期「なし」
  const [equippedArmor, setEquippedArmor] = useState<ArmorItem>(ARMOR_LIST[0]);     // 初期「なし」

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
  const [bossAttack, setBossAttack] = useState<number>(2);
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

  // ステージクリア / ゲームオーバーモーダル
  const [isStageClearing, setIsStageClearing] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // サウンドミュートステート
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  // 装備プレビューモーダル（将来機能の手動テスト用）
  const [showEquipModal, setShowEquipModal] = useState<boolean>(false);

  // カテゴリフィルター（算数、ことば、なぞなぞ、ぜんぶ）
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

    setIsProcessing(true);
    const isCorrect = choiceIndex === currentQuestion.answerIndex;
    // 出題の難易度ステージ（ボス戦時は stage + 1）
    const targetQuestionStage = isBossBattle ? stage + 1 : stage;

    if (isCorrect) {
      // === 正解時 ===
      sound.playCorrect();
      setAnswerState('correct');

      // 今回の攻撃値 = 基礎攻撃力(1) + 武器値
      const attackPower = GAME_CONFIG.playerBaseAttack + equippedWeapon.attackBonus;
      const scoreGain = attackPower * GAME_CONFIG.scoreMultiplierPerAttack;

      // 敵ダメージアニメーション
      setTimeout(() => {
        sound.playHit();
        setEnemyHitAnim(true);
        setEnemyDamageNum(attackPower);
        setScore((prev) => prev + scoreGain);

        setEnemyHp((prev) => {
          const nextHp = Math.max(0, prev - attackPower);

          // 敵のHPがゼロになった場合の分岐
          if (nextHp <= 0) {
            // 🪙 倒した敵キャラのHP × 10円の「おかね」を獲得
            const earnedCoins = activeEnemyMaxHp * 10;
            setLastEarnedStageMoney(earnedCoins);
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
            const isBoss = isBossBattle;
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
                handleBossDefeat(earnedCoins);
              } else if (stage % 3 === 0) {
                // ⚠️ 3ステージ毎の節目敵を倒した！ -> 強大ボス出現イベント発動！
                handleTriggerBoss();
              } else {
                // 通常のステージクリア
                handleStageClear();
              }
            }, 1050);
          }
          return nextHp;
        });

        setTimeout(() => {
          setEnemyHitAnim(false);
          setEnemyDamageNum(null);
        }, 600);
      }, 400);

      // 敵が生き残っている場合のみ1秒後に次の問題へ
      setTimeout(() => {
        setEnemyHp((currentHp) => {
          if (currentHp > 0) {
            setAnswerState('idle');
            setIsProcessing(false);
            if (quizMode === 'auto_stage_math') {
              setDynamicQuestion(generateStageMathQuestion(targetQuestionStage));
            } else {
              setQuestionIndex((prev) => prev + 1);
            }
          }
          return currentHp;
        });
      }, 1000);

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
        if (quizMode === 'auto_stage_math') {
          setDynamicQuestion(generateStageMathQuestion(targetQuestionStage));
        } else {
          setQuestionIndex((prev) => prev + 1);
        }
      }, 1000);
    }
  };

  // --- 👑 ボス出現イベント（3ステージクリア毎に発動） ---
  const handleTriggerBoss = () => {
    // 3種類の強力なボスの中からランダムで1体選定
    const boss = getRandomBoss(currentBossDef?.id);
    const stageEnemyHp = GAME_CONFIG.calculateEnemyHp(stage);
    const stageEnemyAtk = GAME_CONFIG.calculateEnemyAttack(stage);

    // ボスのHPは前回の敵の2倍
    const calculatedBossHp = stageEnemyHp * 2;
    // ボスの攻撃力は前回の敵の1.5倍（小数点切り捨て）
    const calculatedBossAtk = Math.floor(stageEnemyAtk * 1.5);

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

  // --- 👑 ボス撃破処理（豪華な勝利演出） ---
  const handleBossDefeat = (earnedCoins?: number) => {
    sound.playBossClear();
    if (earnedCoins) {
      setLastEarnedBossMoney(earnedCoins);
    }
    // 撃破ボーナス: 2,000点加算 & プレイヤーのHP全回復！
    setScore((prev) => prev + 2000);
    setPlayerHp(playerMaxHp);
    setShowBossVictory(true);
    setAnswerState('idle');
    setIsProcessing(false);
  };

  // --- 👑 ボス撃破後に次のステージへ進む ---
  const handleProceedFromBossVictory = () => {
    sound.playClick();
    setShowBossVictory(false);
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
  };

  // --- 7. 通常ステージクリア処理 ---
  const handleStageClear = () => {
    setIsStageClearing(true);
    sound.playStageClear();

    setTimeout(() => {
      // 次の敵キャラをランダムに選定（直前の敵キャラと被らない）
      setCurrentEnemyDef((prev) => getRandomEnemy(prev.id));

      setStage((prev) => {
        const nextStage = prev + 1;
        // 次ステージの敵HPは100%全快からスタート
        const nextEnemyHp = GAME_CONFIG.calculateEnemyHp(nextStage);
        setEnemyHp(nextEnemyHp);
        // 自動生成モードの場合は新ステージに応じた難易度の問題を生成
        if (quizMode === 'auto_stage_math') {
          setDynamicQuestion(generateStageMathQuestion(nextStage));
        }
        return nextStage;
      });

      // ★要件: 通常ステージクリアではHPは回復しない（ボス撃破時のみ回復）

      setIsStageClearing(false);
      setAnswerState('idle');
      setIsProcessing(false);
    }, 1800);
  };

  // --- 8. ゲームオーバー処理 ---
  const handleGameOver = () => {
    setIsGameOver(true);
    sound.playGameOver();
  };

  // --- 9. もう一度遊ぶ（リセット） ---
  const handleRestart = () => {
    sound.playClick();
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
    setCoinBurstParticles([]);
    setAnswerState('idle');
    setIsProcessing(false);
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

      {/* ====================================================================
          メインコンテナ（スマホ縦画面に最適化された中央寄せカラム）
         ==================================================================== */}
      <div className="w-full max-w-md mx-auto flex flex-col justify-between h-full min-h-screen px-4 pt-3 pb-5 safe-top safe-bottom">

        {/* --- [上部エリア 1] アプリタイトル補助 & ツールバー --- */}
        <div className="flex items-center justify-between pb-1 border-b border-zinc-900 text-xs">
          <div className="flex items-center gap-2 text-zinc-300 font-bold">
            <img src="./icon.png" alt="ひらめきクエスト！" className="w-5 h-5 rounded-full shadow-sm border border-yellow-400/60 object-cover" />
            <span className="tracking-wide">ひらめきクエスト！</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* PWAインストールボタン */}
            <PWAInstallButton />

            {/* サウンド切り替えボタン */}
            <button
              onClick={handleToggleSound}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white active:scale-95 transition"
              aria-label="おんせい切替"
              title={isMuted ? '音声をオンにする' : '音声をオフにする'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
            </button>

            {/* 設定 ＆ モード切替ボタン（ギアアイコン） */}
            <button
              onClick={() => setShowEquipModal(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-yellow-300 hover:bg-zinc-800 hover:text-white active:scale-95 transition text-xs font-bold shadow-sm"
              title="出題モードや装備を設定する"
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
                  onClick={() => setShowEquipModal(true)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 active:scale-95 transition ${
                    quizMode === 'auto_stage_math'
                      ? 'bg-yellow-950/80 text-yellow-300 border-yellow-500/60 shadow-[0_0_8px_rgba(234,179,8,0.3)]'
                      : 'bg-blue-950 text-blue-300 border-blue-500/50'
                  }`}
                  title="タップして出題モードを変更"
                >
                  <span>
                    {quizMode === 'auto_stage_math'
                      ? '⚡️さんすう(自動)'
                      : currentQuestion.categoryLabel}
                  </span>
                  <span className="text-[9px] opacity-75">▼切替</span>
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
        <div className="mt-2.5 mb-2 w-full">
          <div className="bg-white text-black rounded-2xl px-4 py-3 shadow-xl border-4 border-zinc-200 text-center relative flex flex-col items-center justify-center min-h-[92px] max-h-[120px] overflow-hidden">
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

        {/* --- [画面中央 2] 敵キャラ枠・画像・HPバー（ボス戦時は専用の紅蓮オーラ） --- */}
        <div className="flex-1 flex flex-col items-center justify-center my-1 relative">
          {/* 敵枠（通常時は白系シャープ枠、ボス戦時は深紅の魔力オーラ枠） */}
          <div
            className={`relative w-48 h-48 sm:w-56 sm:h-56 bg-zinc-950/90 rounded-2xl border-2 flex items-center justify-center p-2 shadow-2xl overflow-visible transition-all duration-300 ${
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
                  +{ (GAME_CONFIG.playerBaseAttack + equippedWeapon.attackBonus) * GAME_CONFIG.scoreMultiplierPerAttack } てん！
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-8 py-6 rounded-3xl bg-zinc-900/95 border-4 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)] anim-shake">
                <span className="text-6xl mb-1">❌</span>
                <span className="text-4xl font-black text-red-500 tracking-widest drop-shadow-md">
                  不正解！
                </span>
                <span className="text-sm font-bold text-zinc-300 mt-2">
                  いたたた！ ダメージをうけた！
                </span>
              </div>
            )}
          </div>
        )}

        {/* --- [画面下部 1] 選択肢ボタン（3つ：固定ボタンサイズ維持＆文字列に応じた最大フォントサイズ） --- */}
        <div className="w-full grid grid-cols-3 gap-2.5 sm:gap-3 my-2">
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

        {/* --- [画面下部 2] 自分のHPバー & 装備（武器・防具：添付画像準拠） --- */}
        <div className="w-full mt-2 pt-2 border-t border-zinc-900">
          {/* 中央：自分のHPバー（青の残HP、赤の減HP：添付画像準拠） */}
          <div className="w-full flex flex-col items-center mb-1.5">
            <div className="w-48 sm:w-56 h-4 bg-red-600 rounded-sm overflow-hidden border border-zinc-800 relative">
              <div
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${playerHpPercent}%` }}
              />
            </div>
            <div className="text-[11px] font-bold text-zinc-400 mt-0.5">
              じぶんの HP: {playerHp} / {playerMaxHp}
            </div>

            {/* 🪙 所持金（おかね）表示（自分のHPの真下） */}
            <div
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full border transition-all duration-300 mt-1 select-none ${
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

          {/* 下部左右：武器（左）と防具（右） */}
          <div className="flex items-center justify-between px-2">
            {/* 左側：武器 */}
            <button
              onClick={() => setShowEquipModal(true)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 active:scale-95 transition text-left"
              title="タップして武器を変更"
            >
              <div className="w-11 h-11 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center p-1 shrink-0">
                <WeaponIcon type={equippedWeapon.iconType} className="w-9 h-9" />
              </div>
              <div>
                <div className="text-xs font-black text-white">
                  {equippedWeapon.name}
                </div>
                <div className="text-[11px] font-bold text-sky-400">
                  (+{equippedWeapon.attackBonus})
                </div>
              </div>
            </button>

            {/* プレイヤー被弾数値ポップアップ */}
            {playerDamageNum !== null && (
              <div className="text-sm font-black text-red-400 anim-damage-num px-2">
                -{playerDamageNum} HP!
              </div>
            )}

            {/* 右側：防具 */}
            <button
              onClick={() => setShowEquipModal(true)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 active:scale-95 transition text-right"
              title="タップして防具を変更"
            >
              <div>
                <div className="text-xs font-black text-white">
                  {equippedArmor.name}
                </div>
                <div className="text-[11px] font-bold text-emerald-400">
                  (+{equippedArmor.defenseBonus})
                </div>
              </div>
              <div className="w-11 h-11 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center p-1 shrink-0">
                <ArmorIcon type={equippedArmor.iconType} className="w-9 h-9" />
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* ====================================================================
          ステージクリア オーバーレイ（要件：ステージクリアの旨をフロー表示）
         ==================================================================== */}
      {isStageClearing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm anim-pop">
          <div className="flex flex-col items-center justify-center text-center p-8">
            <span className="text-7xl mb-3">🎉</span>
            <h2 className="text-4xl font-black text-yellow-300 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] tracking-wider">
              ステージ {stage} クリア！
            </h2>
            <p className="text-base text-zinc-300 font-bold mt-3">
              モンスターを たおしたぞ！ つぎのステージへ すすもう！
            </p>

            {/* 🪙 おかね獲得演出 */}
            {lastEarnedStageMoney > 0 && (
              <div className="mt-4 px-4 py-2 bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 border-2 border-yellow-400/80 rounded-2xl flex items-center gap-2 text-yellow-300 font-black text-lg shadow-[0_0_20px_rgba(250,204,21,0.4)] anim-pop">
                <span className="text-2xl animate-bounce">🪙</span>
                <span>+{lastEarnedStageMoney.toLocaleString()} 円 ゲット！</span>
              </div>
            )}
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
              <div className="my-3 py-1.5 px-3 bg-yellow-400 text-black font-black text-sm rounded-full shadow-lg anim-pop flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>きろくこうしん！ おめでとう！</span>
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
              onClick={handleRestart}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl border-2 border-sky-400/50 flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-5 h-5" />
              <span>もういちど あそぶ？</span>
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          装備・設定モーダル（武器・防具の手動切り替え＆問題カテゴリ切り替え）
         ==================================================================== */}
      {showEquipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-sky-400" />
                <span>そうび ＆ もんだい せってい</span>
              </h3>
              <button
                onClick={() => setShowEquipModal(false)}
                className="text-xs font-bold px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300"
              >
                とじる
              </button>
            </div>

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

              {/* ステージ連動算数の難易度ガイド（gameDataのMATH_DIFFICULTY_RULESと完全連動） */}
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

            {/* 2. 武器選択 */}
            <div className="mt-4">
              <div className="text-xs font-black text-zinc-400 mb-2 flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-sky-400" />
                <span>ぶきを えらぶ（攻撃力アップ）</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {WEAPON_LIST.map((w) => {
                  const isSelected = equippedWeapon.id === w.id;
                  const isLocked = !!w.isLocked;

                  return (
                    <button
                      key={w.id}
                      onClick={() => {
                        if (isLocked) {
                          sound.playWrong();
                          setLockMessage(`「${w.name}」はロック中！ 今後のぼうけんで手に入れたら使えるよ！`);
                          setTimeout(() => setLockMessage(null), 3000);
                          return;
                        }
                        sound.playClick();
                        setEquippedWeapon(w);
                      }}
                      className={`relative flex items-center gap-2 p-2 rounded-xl border text-left transition select-none ${
                        isLocked
                          ? 'bg-zinc-950/70 border-zinc-800/80 text-zinc-500 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-900/40 border-blue-400 text-white ring-1 ring-blue-400/40 active:scale-95'
                          : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:border-zinc-500 active:scale-95'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <WeaponIcon type={w.iconType} className={`w-7 h-7 ${isLocked ? 'grayscale opacity-50' : ''}`} />
                        {isLocked && (
                          <div className="absolute -top-1.5 -right-1.5 p-0.5 bg-zinc-900 rounded-full border border-zinc-700 shadow">
                            <Lock className="w-2.5 h-2.5 text-zinc-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold leading-tight flex items-center gap-1">
                          <span className="truncate">{w.name}</span>
                          {isLocked && <span className="text-[9px] text-zinc-500 font-normal">🔒未解禁</span>}
                        </div>
                        <div className={`text-[10px] font-bold ${isLocked ? 'text-zinc-600' : 'text-sky-400'}`}>
                          +{w.attackBonus}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. 防具選択 */}
            <div className="mt-4">
              <div className="text-xs font-black text-zinc-400 mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>ぼうぐを えらぶ（受けるダメージ減少）</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ARMOR_LIST.map((a) => {
                  const isSelected = equippedArmor.id === a.id;
                  const isLocked = !!a.isLocked;

                  return (
                    <button
                      key={a.id}
                      onClick={() => {
                        if (isLocked) {
                          sound.playWrong();
                          setLockMessage(`「${a.name}」はロック中！ 今後のぼうけんで手に入れたら使えるよ！`);
                          setTimeout(() => setLockMessage(null), 3000);
                          return;
                        }
                        sound.playClick();
                        setEquippedArmor(a);
                      }}
                      className={`relative flex items-center gap-2 p-2 rounded-xl border text-left transition select-none ${
                        isLocked
                          ? 'bg-zinc-950/70 border-zinc-800/80 text-zinc-500 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-emerald-900/40 border-emerald-400 text-white ring-1 ring-emerald-400/40 active:scale-95'
                          : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:border-zinc-500 active:scale-95'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <ArmorIcon type={a.iconType} className={`w-7 h-7 ${isLocked ? 'grayscale opacity-50' : ''}`} />
                        {isLocked && (
                          <div className="absolute -top-1.5 -right-1.5 p-0.5 bg-zinc-900 rounded-full border border-zinc-700 shadow">
                            <Lock className="w-2.5 h-2.5 text-zinc-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold leading-tight flex items-center gap-1">
                          <span className="truncate">{a.name}</span>
                          {isLocked && <span className="text-[9px] text-zinc-500 font-normal">🔒未解禁</span>}
                        </div>
                        <div className={`text-[10px] font-bold ${isLocked ? 'text-zinc-600' : 'text-emerald-400'}`}>
                          +{a.defenseBonus}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ロック警告メッセージ */}
            {lockMessage && (
              <div className="mt-3 p-2 rounded-xl bg-amber-950/80 border border-amber-500/60 text-[11px] text-amber-200 font-bold text-center anim-pop flex items-center justify-center gap-1.5 shadow-lg">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{lockMessage}</span>
              </div>
            )}

            <button
              onClick={() => setShowEquipModal(false)}
              className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-xl"
            >
              けってい
            </button>
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

            <button
              onClick={handleProceedFromBossVictory}
              className="w-full py-3.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 active:scale-95 text-zinc-950 font-black text-lg rounded-2xl shadow-[0_4px_0_#b45309] border border-white tracking-wide transition-all"
            >
              つぎにすすむ！ ▶
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
