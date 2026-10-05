/**
 * ==========================================================================
 * ひらめきクエスト！ app.js
 * 【共通ハーネスルール 1. データの分離と拡張性の確保（拡張性ハーネス）】
 * すべての可変データをファイルの最上部に一括定義
 * ==========================================================================
 */

// サービスワーカーの登録 (PWA要件 - GitHub Pages対応の相対パス)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((registration) => {
        console.log('ServiceWorker registered successfully with scope:', registration.scope);
      })
      .catch((error) => {
        console.warn('ServiceWorker registration error:', error);
      });
  });
}

const GAME_DATA = {
  // ステージごとの計算式
  rules: {
    // 初期HPは3で、ステージが5つ進むごとにHPを1ずつ加算
    calculateEnemyHp: (stage) => 3 + Math.floor((stage - 1) / 5),
    calculateEnemyAttack: (stage) => Math.floor(1 + (stage - 1) * 0.5),
    playerInitialHp: 5,
    playerBaseAttack: 1,
    scoreMultiplier: 100,
  },

  // 敵キャラデータ（20体の新ユニークモンスター）
  enemies: [
    { id: 'pudding_tyranno', name: 'プリンティラノ', imagePath: null, flavor: 'プルプル ゆれる カラメルソースの きょうりゅう（恐竜）！' },
    { id: 'omurice_lion', name: 'オムライスライオン', imagePath: null, flavor: 'ふわふわ タマゴの たてがみをもつ 百じゅう（ひゃくじゅう）の 王（おう）さま！' },
    { id: 'melon_panda', name: 'メロンパンダ', imagePath: null, flavor: 'サクサク あまい メロンパンの もようをつけた パンダ！' },
    { id: 'fried_shrimp_rhino', name: 'エビフライノセロス', imagePath: null, flavor: 'サクサクの エビのシッポの ツノをもつ つよい サイ！' },
    { id: 'taiyaki_shark', name: 'たいやきシャーク', imagePath: null, flavor: 'あんこが ぎっしり つまった こんがりヤキの サメ（鮫）！' },
    { id: 'dryer_chameleon', name: 'ドライヤーカメレオン', imagePath: null, flavor: 'あったかい ぬくぬくの 風（かぜ）を ふきだす カメレオン！' },
    { id: 'roomba_penguin', name: 'ルンバペンギン', imagePath: null, flavor: 'おそうじしながら スイスイ すべる ロボットペンギン！' },
    { id: 'camera_ladybug', name: 'てんとうむしカメラ', imagePath: null, flavor: 'ピカッと フラッシュをたく てんとう虫（むし）カメラ！' },
    { id: 'toaster_rabbit', name: 'トースターウサギ', imagePath: null, flavor: 'チン！と こんがりトーストが とびだす ウサギ（兎）！' },
    { id: 'tv_wolf', name: 'テレビオオカミ', imagePath: null, flavor: 'がめんに すなあらしを うつしながら ほえる オオカミ（狼）！' },
    { id: 'boxing_koala', name: 'ボクシングコアラ', imagePath: null, flavor: 'まっかな グローブを はめた パワフルな コアラ！' },
    { id: 'tennis_raptor', name: 'テニスラプトル', imagePath: null, flavor: 'はやい サーブを くりだす すばやい きょうりゅう（恐竜）！' },
    { id: 'baseball_horse', name: 'やきゅうウマ', imagePath: null, flavor: 'ホームランを ねらう ユニフォームすがたの 馬（うま）！' },
    { id: 'bowling_gorilla', name: 'ボウリングゴリラ', imagePath: null, flavor: 'ストライクを れんぱつする 力（ちから）もちの ゴリラ！' },
    { id: 'swimming_kappa', name: 'スイミングカッパ', imagePath: null, flavor: 'ゴーグルをつけて プールを スイスイ およぐ カッパ！' },
    { id: 'patrol_fox', name: 'パトカーキツネ', imagePath: null, flavor: 'ウーウー！ サイレンをならして パトロールする キツネ（狐）のおまわりさん！' },
    { id: 'drill_mole', name: 'ドリルモグラ', imagePath: null, flavor: 'おおきな ドリルで じめん（地面）を ほりまくる モグラ！' },
    { id: 'excavator_saurus', name: 'ショベルカーザウルス', imagePath: null, flavor: 'ながい くびをもつ ショベルカーの きょうりゅう（恐竜）！' },
    { id: 'helicopter_hawk', name: 'ヘリコプタカ', imagePath: null, flavor: 'プロペラで 大空（おおぞら）を とぶ タカ（鷹）！' },
    { id: 'bicycle_otter', name: 'チャリンコラッコ', imagePath: null, flavor: 'チリンチリン！ 自転車（じてんしゃ）を こいで はしる ラッコ！' },
    { id: 'car_the_mach', name: 'クルマ・ザ・マッハ', imagePath: null, flavor: 'こうそくで おいかけてくる スピードレーサー！' },
    { id: 'skeleton_zero_broke', name: 'スケルトン・ゼロ・ブローク', imagePath: null, flavor: '弓矢（ゆみや）で きみを ねらいうつぞ！きをつけろ！' },
    { id: 'bed_head', name: 'ベッド・ヘッド', imagePath: null, flavor: 'ぼくで ねると ランダムで どこかに つれていくぞ！' }
  ],

  // 装備アイテム一覧
  weapons: [
    { id: 'none', name: 'なし', attackBonus: 0, isLocked: false, /* TODO: 画像差し替え用パス */ imagePath: null },
    { id: 'wooden_sword', name: '木のけん', attackBonus: 3, isLocked: false, /* TODO: 画像差し替え用パス */ imagePath: null },
    { id: 'diamond_sword', name: 'ダイヤのけん', attackBonus: 10, isLocked: true, /* TODO: 画像差し替え用パス */ imagePath: null }
  ],
  armors: [
    { id: 'none', name: 'なし', defenseBonus: 0, isLocked: false, /* TODO: 画像差し替え用パス */ imagePath: null },
    { id: 'leather_armor', name: '皮のふく', defenseBonus: 2, isLocked: false, /* TODO: 画像差し替え用パス */ imagePath: null },
    { id: 'diamond_armor', name: 'ダイヤのぼうぐ', defenseBonus: 8, isLocked: true, /* TODO: 画像差し替え用パス */ imagePath: null }
  ],

  // クイズ問題データ（幼稚園児・低学年向け）
  questions: [
    {
      id: 'q1',
      question: '1 + 2 は？',
      choices: ['1', '3', '4'],
      answerIndex: 1,
      explanation: '1 + 2 は 3 だよ！'
    },
    {
      id: 'q2',
      question: '2 + 3 は？',
      choices: ['5', '6', '4'],
      answerIndex: 0,
      explanation: '2 + 3 は 5 だよ！'
    }
  ],

  // さんすう問題 難易度レベル設定テーブル（手作業でクリアステージ数を調整可能）
  mathDifficultyRules: [
    { level: 1, title: '1桁の足し算・引き算（答え5以下）', stagesToClear: 5, type: 'single_basic' },
    { level: 2, title: '1桁の足し算・引き算（答え10以下）', stagesToClear: 5, type: 'single_standard' },
    { level: 3, title: '2桁と1桁の足し算・引き算', stagesToClear: 5, type: 'double_and_single' },
    { level: 4, title: '3つの1桁の足し算・引き算', stagesToClear: 5, type: 'three_single' },
    { level: 5, title: '2桁と2桁の足し算・引き算', stagesToClear: 5, type: 'double_and_double' },
    { level: 6, title: '3つの2桁の足し算・引き算', stagesToClear: 9999, type: 'three_double' },
  ],

  // ステージ連動 算数問題自動生成ジェネレーター
  generateStageMathQuestion: function(stage) {
    let accumulatedStages = 0;
    let currentRule = this.mathDifficultyRules[this.mathDifficultyRules.length - 1];
    for (let rule of this.mathDifficultyRules) {
      accumulatedStages += rule.stagesToClear;
      if (stage <= accumulatedStages) {
        currentRule = rule;
        break;
      }
    }

    let question = '';
    let ans = 0;
    let explanation = '';

    switch (currentRule.type) {
      case 'single_basic': {
        const isAdd = Math.random() < 0.5;
        if (isAdd) {
          ans = Math.floor(Math.random() * 4) + 2;
          const a = Math.floor(Math.random() * (ans - 1)) + 1;
          const b = ans - a;
          question = `${a} + ${b} は？`;
          explanation = `${a} + ${b} は ${ans} だね！`;
        } else {
          const a = Math.floor(Math.random() * 4) + 2;
          const b = Math.floor(Math.random() * (a - 1)) + 1;
          ans = a - b;
          question = `${a} − ${b} は？`;
          explanation = `${a} − ${b} は ${ans} だね！`;
        }
        break;
      }
      case 'single_standard': {
        const isAdd = Math.random() < 0.5;
        if (isAdd) {
          ans = Math.floor(Math.random() * 5) + 6;
          const a = Math.floor(Math.random() * (ans - 1)) + 1;
          const b = ans - a;
          question = `${a} + ${b} は？`;
          explanation = `${a} + ${b} は ${ans} だね！`;
        } else {
          const a = Math.floor(Math.random() * 5) + 6;
          const b = Math.floor(Math.random() * (a - 1)) + 1;
          ans = a - b;
          question = `${a} − ${b} は？`;
          explanation = `${a} − ${b} は ${ans} だね！`;
        }
        break;
      }
      case 'double_and_single': {
        const isAdd = Math.random() < 0.5;
        if (isAdd) {
          const a = Math.floor(Math.random() * 80) + 10;
          const b = Math.floor(Math.random() * 9) + 1;
          ans = a + b;
          question = `${a} + ${b} は？`;
          explanation = `${a} + ${b} は ${ans} だね！`;
        } else {
          const a = Math.floor(Math.random() * 89) + 11;
          const b = Math.floor(Math.random() * 9) + 1;
          ans = a - b;
          question = `${a} − ${b} は？`;
          explanation = `${a} − ${b} は ${ans} だね！`;
        }
        break;
      }
      case 'three_single': {
        const pattern = Math.floor(Math.random() * 4);
        if (pattern === 0) {
          const a = Math.floor(Math.random() * 7) + 1;
          const b = Math.floor(Math.random() * 6) + 1;
          const c = Math.floor(Math.random() * 6) + 1;
          ans = a + b + c;
          question = `${a} + ${b} + ${c} は？`;
          explanation = `${a} + ${b} + ${c} は ${ans} だね！`;
        } else if (pattern === 1) {
          const a = Math.floor(Math.random() * 6) + 2;
          const b = Math.floor(Math.random() * 6) + 2;
          const sum = a + b;
          const c = Math.floor(Math.random() * Math.min(sum - 1, 8)) + 1;
          ans = sum - c;
          question = `${a} + ${b} − ${c} は？`;
          explanation = `${a} + ${b} − ${c} は ${ans} だね！`;
        } else if (pattern === 2) {
          const a = Math.floor(Math.random() * 5) + 5;
          const b = Math.floor(Math.random() * (a - 1)) + 1;
          const c = Math.floor(Math.random() * 7) + 1;
          ans = (a - b) + c;
          question = `${a} − ${b} + ${c} は？`;
          explanation = `${a} − ${b} + ${c} は ${ans} だね！`;
        } else {
          const a = Math.floor(Math.random() * 4) + 6;
          const b = Math.floor(Math.random() * (a - 3)) + 1;
          const c = Math.floor(Math.random() * (a - b - 1)) + 1;
          ans = a - b - c;
          question = `${a} − ${b} − ${c} は？`;
          explanation = `${a} − ${b} − ${c} は ${ans} だね！`;
        }
        break;
      }
      case 'double_and_double': {
        const isAdd = Math.random() < 0.5;
        if (isAdd) {
          const a = Math.floor(Math.random() * 40) + 10;
          const b = Math.floor(Math.random() * 40) + 10;
          ans = a + b;
          question = `${a} + ${b} は？`;
          explanation = `${a} + ${b} は ${ans} だね！`;
        } else {
          const a = Math.floor(Math.random() * 60) + 35;
          const b = Math.floor(Math.random() * (a - 20)) + 10;
          ans = a - b;
          question = `${a} − ${b} は？`;
          explanation = `${a} − ${b} は ${ans} だね！`;
        }
        break;
      }
      case 'three_double': {
        const pattern = Math.floor(Math.random() * 4);
        if (pattern === 0) {
          const a = Math.floor(Math.random() * 25) + 10;
          const b = Math.floor(Math.random() * 25) + 10;
          const c = Math.floor(Math.random() * 25) + 10;
          ans = a + b + c;
          question = `${a} + ${b} + ${c} は？`;
          explanation = `${a} + ${b} + ${c} は ${ans} だね！`;
        } else if (pattern === 1) {
          const a = Math.floor(Math.random() * 30) + 15;
          const b = Math.floor(Math.random() * 30) + 15;
          const sum = a + b;
          const c = Math.floor(Math.random() * Math.min(sum - 15, 30)) + 10;
          ans = sum - c;
          question = `${a} + ${b} − ${c} は？`;
          explanation = `${a} + ${b} − ${c} は ${ans} だね！`;
        } else if (pattern === 2) {
          const a = Math.floor(Math.random() * 40) + 40;
          const b = Math.floor(Math.random() * (a - 20)) + 10;
          const c = Math.floor(Math.random() * 30) + 10;
          ans = (a - b) + c;
          question = `${a} − ${b} + ${c} は？`;
          explanation = `${a} − ${b} + ${c} は ${ans} だね！`;
        } else {
          const a = Math.floor(Math.random() * 30) + 65;
          const b = Math.floor(Math.random() * 20) + 10;
          const c = Math.floor(Math.random() * Math.min(a - b - 15, 25)) + 10;
          ans = a - b - c;
          question = `${a} − ${b} − ${c} は？`;
          explanation = `${a} − ${b} − ${c} は ${ans} だね！`;
        }
        break;
      }
    }

    const candidateOffsets = [1, -1, 2, -2, 10, -10, 3, -3, 5, -5];
    const uniqueWrongs = [];
    for (let offset of candidateOffsets.sort(() => Math.random() - 0.5)) {
      const candidate = ans + offset;
      if (candidate >= 0 && candidate !== ans && !uniqueWrongs.includes(candidate)) {
        uniqueWrongs.push(candidate);
        if (uniqueWrongs.length === 2) break;
      }
    }
    if (uniqueWrongs.length < 1) uniqueWrongs.push(ans + 1);
    if (uniqueWrongs.length < 2) uniqueWrongs.push(uniqueWrongs[0] + 1);

    const choices = [ans, uniqueWrongs[0], uniqueWrongs[1]].sort(() => Math.random() - 0.5);
    return {
      question: question,
      choices: choices.map(String),
      answerIndex: choices.indexOf(ans),
      explanation: explanation,
    };
  }
};

console.log('[GAME_DATA loaded]', GAME_DATA);
