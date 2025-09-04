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
        minHeight: 'min(700px, 100vh)',
        fontFamily: 'Arial, sans-serif',
        position: 'relative'
      }}
    >
      {/* Top Section - White Background with Golden Confetti */}
      <div className="relative bg-white p-4 sm:p-6 md:p-8 lg:p-12 text-center" style={{ minHeight: 'min(250px, 30vh)' }}>
        {/* Golden Confetti Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-yellow-400 rounded-full opacity-60 confetti"
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
          <img 
            src="/logo2.jpeg" 
            alt="Mawlid Results Logo" 
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl shadow-lg p-1 sm:p-2 bg-white"
          />
          <div className="text-center">
            <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2" style={{ fontFamily: 'serif' }}>
              വസന്തത്തിന്റെ പൊൻപുലരി
            </div>
            <div className="mb-1 sm:mb-2">
              <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-800 mr-1 sm:mr-2">KANZUL</span>
              <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600" style={{ fontFamily: 'cursive' }}>MADEENA</span>
            </div>
            <div className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-1" style={{ fontFamily: 'serif' }}>
              كنز المدينة
            </div>
          </div>
          {/* Colorful Palette Icon */}
          <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-pink-400 transform rotate-45 shadow-lg"></div>
        </div>

        {/* Event Subtitle */}
        <div className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 mb-1 sm:mb-2">
          ..... MEELAD FEST 2k25
        </div>

        {/* Certificate Date - Shows when the result was created */}
        <div className="text-sm sm:text-lg md:text-xl font-bold text-black">
          {new Date(result.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
          }).toUpperCase()}
        </div>
        
        {/* Event Date - Shows when the event took place */}
        {/* <div className="text-xs sm:text-sm text-gray-500 mt-1">
          Event Date: {new Date(result.eventDate).toLocaleDateString('en-US', { 
            year: 'numeric',
            month: 'short', 
            day: 'numeric'
          })}
        </div> */}
      </div>

      {/* Bottom Section - Blue Rectangle */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 sm:p-6 md:p-8 lg:p-12 relative mx-2 sm:mx-4 md:mx-6 lg:mx-8 my-3 sm:my-4 md:my-6 rounded-xl sm:rounded-2xl shadow-xl">
        {/* Category and Event Name Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <img 
              src="/logo2.jpeg" 
              alt="Mawlid Results Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl shadow-lg p-1"
            />
            <div className="text-white text-sm sm:text-lg md:text-xl lg:text-2xl font-bold">
              {result.category?.name?.toUpperCase() || 'CATEGORY'}
            </div>
          </div>
          <div className="bg-white rounded-full px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 shadow-lg">
            <span className="text-blue-600 font-bold text-xs sm:text-sm md:text-base lg:text-lg">
              {result.eventName?.toUpperCase() || 'COMPETITION'}
            </span>
          </div>
        </div>

        {/* Results Display */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* First Place */}
          {result.individual?.first && (
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-2xl shadow-lg medal-shine">
                  🏆
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-yellow-300 rounded-full flex items-center justify-center text-yellow-800 font-bold text-xs sm:text-sm">1</div>
              </div>
              <div className="text-white flex-1 min-w-0">
                <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 truncate">{result.individual.first.name}</div>
                {result.individual.first.details && (
                  <div className="text-xs sm:text-sm opacity-90 truncate">{result.individual.first.details}</div>
                )}
              </div>
              <div className="text-yellow-300 text-lg sm:text-xl md:text-2xl">🏅</div>
            </div>
          )}

          {/* Second Place */}
          {result.individual?.second && (
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-2xl shadow-lg medal-shine">
                  🏆
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-800 font-bold text-xs sm:text-sm">2</div>
              </div>
              <div className="text-white flex-1 min-w-0">
                <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 truncate">{result.individual.second.name}</div>
                {result.individual.second.details && (
                  <div className="text-xs sm:text-sm opacity-90 truncate">{result.individual.second.details}</div>
                )}
              </div>
              <div className="text-gray-300 text-lg sm:text-xl md:text-2xl">🥈</div>
            </div>
          )}

          {/* Third Place */}
          {result.individual?.third && (
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-2xl shadow-lg medal-shine">
                  🏆
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-orange-400 rounded-full flex items-center justify-center text-orange-800 font-bold text-xs sm:text-sm">3</div>
              </div>
              <div className="text-white flex-1 min-w-0">
                <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 truncate">{result.individual.third.name}</div>
                {result.individual.third.details && (
                  <div className="text-xs sm:text-sm opacity-90 truncate">{result.individual.third.details}</div>
                )}
              </div>
              <div className="text-orange-300 text-lg sm:text-xl md:text-2xl">🥉</div>
            </div>
          )}

          {/* Group Results */}
          {result.group && (
            <>
              {result.group.first && (
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm">
                  <div className="relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-2xl shadow-lg medal-shine">
                      🏆
                    </div>
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-yellow-300 rounded-full flex items-center justify-center text-yellow-800 font-bold text-xs sm:text-sm">1</div>
                  </div>
                  <div className="text-white flex-1 min-w-0">
                    <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 truncate">{result.group.first.name}</div>
                    {result.group.first.details && (
                      <div className="text-xs sm:text-sm opacity-90 truncate">{result.group.first.details}</div>
                    )}
                    {result.group.first.points > 0 && (
                      <div className="text-xs sm:text-sm font-bold text-yellow-200 mt-1">{result.group.first.points} points</div>
                    )}
                  </div>
                  <div className="text-yellow-300 text-lg sm:text-xl md:text-2xl">🏅</div>
                </div>
              )}

              {result.group.second && (
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm">
                  <div className="relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-2xl shadow-lg medal-shine">
                      🏆
                    </div>
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-800 font-bold text-xs sm:text-sm">2</div>
                  </div>
                  <div className="text-white flex-1 min-w-0">
                    <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 truncate">{result.group.second.name}</div>
                    {result.group.second.details && (
                      <div className="text-xs sm:text-sm opacity-90 truncate">{result.group.second.details}</div>
                    )}
                    {result.group.second.points > 0 && (
                      <div className="text-xs sm:text-sm font-bold text-gray-200 mt-1">{result.group.second.points} points</div>
                    )}
                  </div>
                  <div className="text-gray-300 text-lg sm:text-xl md:text-2xl">🥈</div>
                </div>
              )}

              {result.group.third && (
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm">
                  <div className="relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-2xl shadow-lg medal-shine">
                      🏆
                    </div>
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-orange-400 rounded-full flex items-center justify-center text-orange-800 font-bold text-xs sm:text-sm">3</div>
                  </div>
                  <div className="text-white flex-1 min-w-0">
                    <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 truncate">{result.group.third.name}</div>
                    {result.group.third.details && (
                      <div className="text-xs sm:text-sm opacity-90 truncate">{result.group.third.details}</div>
                    )}
                    {result.group.third.points > 0 && (
                      <div className="text-xs sm:text-sm font-bold text-orange-200 mt-1">{result.group.third.points} points</div>
                    )}
                  </div>
                  <div className="text-orange-300 text-lg sm:text-xl md:text-2xl">🥉</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Congratulations Text */}
        <div className="text-center mt-6 sm:mt-8 md:mt-10">
          <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-300 mb-1 sm:mb-2" style={{ fontFamily: 'cursive' }}>
            Congratulations
          </div>
          <div className="text-xs sm:text-sm md:text-base lg:text-lg text-blue-100 mb-4">
            🎉 Well Done! 🎉
          </div>
          
          {/* Certificate Generation Info */}
          <div className="bg-white/20 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
            <div className="text-xs sm:text-sm text-blue-100 mb-1">
              Certificate Generated On
            </div>
            <div className="text-sm sm:text-base md:text-lg font-semibold text-white">
              {new Date(result.createdAt).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long', 
                day: 'numeric'
              })}
            </div>
            <div className="text-xs text-blue-100 mt-1">
              at {new Date(result.createdAt).toLocaleTimeString('en-US', { 
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Institution Name */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 text-center border-t border-gray-200 relative">
        <div className="absolute top-1 sm:top-2 right-2 sm:right-4 opacity-20">
          <img 
            src="/logo2.jpeg" 
            alt="Mawlid Results Logo" 
            className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-lg"
          />
        </div>
        <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800">
          IRSHADUSSWIBIYAN MADRASA MALANKARAVAYAL
        </div>
        <div className="text-xs sm:text-sm text-gray-600 mt-1">
          Excellence in Performance
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 border-t border-gray-300">
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src="/logo2.jpeg" 
            alt="Mawlid Results Logo" 
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-lg"
          />
          <span className="font-medium text-center sm:text-left">Generated by Results System - Musjith</span>
        </div>
        <span className="font-medium text-center sm:text-right">
          Generated: {new Date(result.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric',
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
};

export default Certificate;