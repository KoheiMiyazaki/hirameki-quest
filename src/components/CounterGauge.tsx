import React from 'react';

interface CounterGaugeProps {
  currentCount: number; // 0..10
}

interface GaugeBar {
  level: number;
  width: number;
  color: string;
}

/**
 * 👾 敵の「はんげき」ゲージ（10段階）
 * 要望仕様:
 * 1. 初期状態は真っ黒で上部の「👾はんげき」のみ表示
 * 2. 1秒カウントされるごとに下から1個ずつ可視化
 * 3. 1個目から7個目まではグレーからだんだんと赤に近づくグラデーション
 * 4. 8個目から10個目は真っ赤に同じ色（最後の3つはグラデーションせず3つとも赤）
 * 5. 下が細く上が広い逆台形梯子形状
 */
const GAUGE_BARS: GaugeBar[] = [
  { level: 10, width: 54, color: '#ff1414' }, // 10個目 (最上部: 真っ赤 - 8..10は同一色)
  { level: 9,  width: 50, color: '#ff1414' }, // 9個目  (真っ赤 - 8..10は同一色)
  { level: 8,  width: 46, color: '#ff1414' }, // 8個目  (真っ赤 - 8..10は同一色)
  { level: 7,  width: 42, color: '#f82020' }, // 7個目  (赤寄り)
  { level: 6,  width: 38, color: '#e93638' }, // 6個目
  { level: 5,  width: 34, color: '#d94c50' }, // 5個目
  { level: 4,  width: 30, color: '#ca6268' }, // 4個目
  { level: 3,  width: 26, color: '#bb777f' }, // 3個目
  { level: 2,  width: 22, color: '#ab8d97' }, // 2個目
  { level: 1,  width: 18, color: '#9ca3af' }, // 1個目  (最下部: グレー)
];

export const CounterGauge: React.FC<CounterGaugeProps> = ({ currentCount }) => {
  const isDanger = currentCount >= 8;

  return (
    <div className="flex flex-col items-center select-none pointer-events-none">
      {/* 上部タイトル：👾 はんげき */}
      <div
        className={`flex items-center gap-1 mb-1 transition-all duration-200 ${
          isDanger ? 'animate-pulse scale-105' : ''
        }`}
      >
        <span className="text-xs sm:text-sm">👾</span>
        <span
          className={`text-[11px] sm:text-xs font-black tracking-wider whitespace-nowrap ${
            isDanger ? 'text-red-400 drop-shadow-[0_0_6px_rgba(255,20,20,0.95)]' : 'text-white'
          }`}
        >
          はんげき
        </span>
      </div>

      {/* 10段階ゲージ（上から10個目→1個目、下から上に向かって可視化、初期状態は真っ黒） */}
      <div className="flex flex-col items-center gap-[2.5px] py-1.5 px-1.5 rounded-lg bg-black border border-zinc-900/80 shadow-md">
        {GAUGE_BARS.map((bar) => {
          const isLit = currentCount >= bar.level;
          return (
            <div
              key={bar.level}
              style={{
                width: `${bar.width}px`,
                height: '5.5px',
                backgroundColor: isLit ? bar.color : '#000000',
                boxShadow: isLit
                  ? bar.level >= 8
                    ? '0 0 10px rgba(255, 20, 20, 0.95), 0 0 3px rgba(255, 255, 255, 0.8)'
                    : `0 0 6px ${bar.color}90`
                  : 'none',
                borderColor: isLit ? bar.color : '#000000',
                opacity: isLit ? 1 : 0,
              }}
              className="h-[5.5px] rounded-[2px] border transition-all duration-200"
            />
          );
        })}
      </div>
    </div>
  );
};

