import React from 'react';
import { Result } from '../types';

interface CertificateProps {
  result: Result;
  id?: string;
}

const Certificate: React.FC<CertificateProps> = ({ result, id }) => {
  return (
    <div
      id={id}
      className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden certificate-glow mx-auto"
      style={{ 
        minHeight: 700,
        fontFamily: 'Arial, sans-serif',
        position: 'relative'
      }}
    >
      {/* Top Section - White Background with Golden Confetti */}
      <div className="relative bg-white p-12 text-center" style={{ minHeight: 250 }}>
        {/* Golden Confetti Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-60 confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Logo and Title Section */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <img 
            src="/logo2.jpeg" 
            alt="Mawlid Results Logo" 
            className="w-20 h-20 rounded-2xl shadow-lg p-2 bg-white"
          />
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'serif' }}>
              വസന്തത്തിന്റെ പൊൻപുലരി
            </div>
            <div className="mb-2">
              <span className="text-4xl font-bold text-blue-800 mr-2">KANZUL</span>
              <span className="text-4xl font-bold text-blue-600" style={{ fontFamily: 'cursive' }}>MADEENA</span>
            </div>
            <div className="text-2xl text-gray-700 mb-1" style={{ fontFamily: 'serif' }}>
              كنز المدينة
            </div>
          </div>
          {/* Colorful Palette Icon */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-pink-400 transform rotate-45 shadow-lg"></div>
        </div>

        {/* Arabic Script */}
        {/* <div className="text-2xl text-gray-700 mb-2" style={{ fontFamily: 'serif' }}>
          كنز المدينة
        </div> */}

        {/* Event Subtitle */}
        <div className="text-lg text-gray-600 mb-2">
          ..... MEELAD FEST 2k25
        </div>

        {/* Event Date */}
        <div className="text-xl font-bold text-black">
          {new Date(result.eventDate).toLocaleDateString('en-US', { 
            month: 'short', 
            day: '2-digit' 
          }).toUpperCase()}
        </div>
      </div>

      {/* Bottom Section - Blue Rectangle */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-12 relative mx-8 my-6 rounded-2xl shadow-xl">
        {/* Category and Event Name Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <img 
              src="/logo.png" 
              alt="Mawlid Results Logo" 
              className="w-12 h-12 rounded-xl shadow-lg p-1 "
            />
            <div className="text-white text-2xl font-bold">
              {result.category?.name?.toUpperCase() || 'CATEGORY'}
            </div>
          </div>
          <div className="bg-white rounded-full px-8 py-3 shadow-lg">
            <span className="text-blue-600 font-bold text-lg">
              {result.eventName?.toUpperCase() || 'EVENT'}
            </span>
          </div>
        </div>

        {/* Results Display */}
        <div className="space-y-6">
          {/* First Place */}
          {result.individual?.first && (
            <div className="flex items-center gap-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg medal-shine">
                  🏆
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center text-yellow-800 font-bold text-sm">1</div>
              </div>
              <div className="text-white flex-1">
                <div className="text-2xl font-bold mb-1">{result.individual.first.name}</div>
                {result.individual.first.details && (
                  <div className="text-sm opacity-90">{result.individual.first.details}</div>
                )}
              </div>
              <div className="text-yellow-300 text-2xl">🏅</div>
            </div>
          )}

          {/* Second Place */}
          {result.individual?.second && (
            <div className="flex items-center gap-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg medal-shine">
                  🏆
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-800 font-bold text-sm">2</div>
              </div>
              <div className="text-white flex-1">
                <div className="text-2xl font-bold mb-1">{result.individual.second.name}</div>
                {result.individual.second.details && (
                  <div className="text-sm opacity-90">{result.individual.second.details}</div>
                )}
              </div>
              <div className="text-gray-300 text-2xl">🥈</div>
            </div>
          )}

          {/* Third Place */}
          {result.individual?.third && (
            <div className="flex items-center gap-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg medal-shine">
                  🏆
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-orange-800 font-bold text-sm">3</div>
              </div>
              <div className="text-white flex-1">
                <div className="text-2xl font-bold mb-1">{result.individual.third.name}</div>
                {result.individual.third.details && (
                  <div className="text-sm opacity-90">{result.individual.third.details}</div>
                )}
              </div>
              <div className="text-orange-300 text-2xl">🥉</div>
            </div>
          )}

          {/* Group Results */}
          {result.group && (
            <>
              {result.group.first && (
                <div className="flex items-center gap-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg medal-shine">
                      🏆
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center text-yellow-800 font-bold text-sm">1</div>
                  </div>
                  <div className="text-white flex-1">
                    <div className="text-2xl font-bold mb-1">{result.group.first.name}</div>
                    {result.group.first.details && (
                      <div className="text-sm opacity-90">{result.group.first.details}</div>
                    )}
                  </div>
                  <div className="text-yellow-300 text-2xl">🏅</div>
                </div>
              )}

              {result.group.second && (
                <div className="flex items-center gap-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg medal-shine">
                      🏆
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-800 font-bold text-sm">2</div>
                  </div>
                  <div className="text-white flex-1">
                    <div className="text-2xl font-bold mb-1">{result.group.second.name}</div>
                    {result.group.second.details && (
                      <div className="text-sm opacity-90">{result.group.second.details}</div>
                    )}
                  </div>
                  <div className="text-gray-300 text-2xl">🥈</div>
                </div>
              )}

              {result.group.third && (
                <div className="flex items-center gap-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg medal-shine">
                      🏆
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-orange-800 font-bold text-sm">3</div>
                  </div>
                  <div className="text-white flex-1">
                    <div className="text-2xl font-bold mb-1">{result.group.third.name}</div>
                    {result.group.third.details && (
                      <div className="text-sm opacity-90">{result.group.third.details}</div>
                    )}
                  </div>
                  <div className="text-orange-300 text-2xl">🥉</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Congratulations Text */}
        <div className="text-center mt-10">
          <div className="text-4xl font-bold text-yellow-300 mb-2" style={{ fontFamily: 'cursive' }}>
            Congratulations
          </div>
          <div className="text-lg text-blue-100">
            🎉 Well Done! 🎉
          </div>
        </div>
      </div>

      {/* Bottom Institution Name */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 text-center border-t border-gray-200 relative">
        <div className="absolute top-2 right-4 opacity-20">
          <img 
            src="/logo.png" 
            alt="Mawlid Results Logo" 
            className="w-8 h-8 rounded-lg"
          />
        </div>
        <div className="text-xl font-bold text-gray-800">
          IRSHADUSSWIBIYAN MADRASA MALANKARAVAYAL
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Excellence in Performance
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 flex justify-between items-center text-sm text-gray-600 border-t border-gray-300">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Mawlid Results Logo" 
            className="w-6 h-6 rounded-lg"
          />
          <span className="font-medium">Generated by Results System - Musjith</span>
        </div>
        <span className="font-medium">{new Date(result.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default Certificate;