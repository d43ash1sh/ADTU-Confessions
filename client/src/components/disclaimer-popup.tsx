import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function DisclaimerPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDisagreeMessage, setShowDisagreeMessage] = useState(false);

  useEffect(() => {
    // Check if user has already agreed to disclaimer
    const hasAgreed = localStorage.getItem('adtu-disclaimer-agreed');
    if (!hasAgreed) {
      // Show popup after a short delay
      setTimeout(() => {
        setIsVisible(true);
        playPopSound();
      }, 500);
    }
  }, []);

  const playPopSound = () => {
    // Create a simple pop sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleAgree = () => {
    localStorage.setItem('adtu-disclaimer-agreed', 'true');
    setIsVisible(false);
  };

  const handleDisagree = () => {
    setShowDisagreeMessage(true);
    setTimeout(() => {
      window.close();
      // Fallback for browsers that don't allow window.close()
      window.location.href = 'about:blank';
    }, 5000);
  };

  if (!isVisible) return null;

  return (
    <div className="disclaimer-popup fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative max-w-2xl mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-4 border-adtu-blue animate-in zoom-in-95 duration-500">
        {!showDisagreeMessage ? (
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                ⚠️ Disclaimer (Read this or cry later 💀)
              </h2>
            </div>
            
            <div className="text-gray-700 dark:text-gray-300 space-y-4 text-sm leading-relaxed">
              <p>
                Welcome to ADTU Confessions Zone – aka the unofficial therapy corner for your overthinking brain 🧠✨. 
                Before you start typing out your deepest darkest secrets or "POV: life after midsem" stories, remember a few things:
              </p>
              
              <div className="space-y-3">
                <div>
                  <strong>1. Anonymity = Responsibility</strong><br/>
                  Yes, you're anonymous 🕵️ but that doesn't mean you get a free trial of toxicity. 
                  No hate speech, no bullying, no fake rumors. We don't vibe with bad energy 🚫👎.
                </div>
                
                <div>
                  <strong>2. For Entertainment (and tears) Only</strong><br/>
                  This platform is made for fun, laughter, relatability, and maybe a little oversharing at 3 AM 🌙. 
                  Don't take everything here like it's the <em>Bhagavad Gita of campus life</em> 📖.
                </div>
                
                <div>
                  <strong>3. Admin ≠ Therapist</strong><br/>
                  Confess your crush, not your crimes 😭. If you're dealing with serious issues, 
                  seek actual help – not us coding this project with 2% battery 🔋.
                </div>
                
                <div>
                  <strong>4. Stay Real, Stay Chill</strong><br/>
                  We're all students surviving the same exams, assignments, and boring lectures 🗿. 
                  Spread love, not hate 💖. Confess responsibly.
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-400">
                <p className="font-medium">
                  <strong>TL;DR</strong> – Post what you want, but don't be that one toxic kid who makes everyone say 
                  <em>"bro woke up and chose violence"</em> 💀🗿.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAgree}
                className="flex-1 bg-adtu-blue hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Agree ✅
              </button>
              <button
                onClick={handleDisagree}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Disagree ❌
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="text-6xl mb-4">💀</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Bro, you studying at ADTU but can't even agree to confess? 💀
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Campus ke samosa khane aaye ho ya website band karne? 🚪😂
            </p>
            <div className="text-sm text-gray-500">
              Closing in 5 seconds...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}