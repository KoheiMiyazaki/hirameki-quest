import React, { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // スタンドアロン（インストール済み）の判定
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // iOSデバイス判定
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIOSDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  // すでにアプリとして起動中の場合は非表示
  if (isInstalled) return null;

  return (
    <>
      {deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-full border border-blue-400/40 shadow-sm active:scale-95 transition"
          title="ホーム画面に追加してアプリとして遊ぶ"
        >
          <Download className="w-3.5 h-3.5" />
          <span>アプリ追加</span>
        </button>
      )}

      {isIOS && !deferredPrompt && (
        <button
          onClick={() => setShowIOSModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-full border border-zinc-600 shadow-sm active:scale-95 transition"
          title="iPhone/iPadでの追加方法"
        >
          <Share className="w-3.5 h-3.5" />
          <span>アプリ保存</span>
        </button>
      )}

      {/* iOS インストール手順モーダル */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-xs rounded-2xl bg-zinc-900 border border-zinc-700 p-5 text-white shadow-2xl relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-3 right-3 p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-black text-center mb-3">
              📱 ホーム画面にアプリを追加
            </h3>
            <div className="space-y-3 text-xs text-zinc-300">
              <div className="flex items-start gap-2.5 bg-zinc-800/80 p-2.5 rounded-xl border border-zinc-700">
                <Share className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">1. </span>
                  Safari下部または上部にある「<strong className="text-blue-400">共有ボタン</strong>」をタップします。
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-zinc-800/80 p-2.5 rounded-xl border border-zinc-700">
                <PlusSquare className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">2. </span>
                  メニューから「<strong className="text-green-400">ホーム画面に追加</strong>」を選びます。
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-xs text-white"
            >
              とじる
            </button>
          </div>
        </div>
      )}
    </>
  );
};
