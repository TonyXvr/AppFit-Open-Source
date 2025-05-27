import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { flowMapData, flowMapStore } from '~/lib/stores/flowMap';
import { FlowMapLayout } from './FlowMapLayout';
import { classNames } from '~/utils/classNames';

export const VisualElements: React.FC = () => {
  const data = useStore(flowMapData);
  const [iconStyle, setIconStyle] = useState(data.visualElements.iconStyle);
  const [illustrationStyle, setIllustrationStyle] = useState(data.visualElements.illustrationStyle);

  // Update handlers for real-time preview
  const handleIconStyleChange = (style: 'line' | 'solid' | 'duotone' | 'gradient') => {
    setIconStyle(style);
    flowMapStore.updateVisualElements({
      iconStyle: style,
      illustrationStyle,
    });
  };

  const handleIllustrationStyleChange = (style: 'flat' | 'isometric' | 'hand-drawn' | 'minimal-line') => {
    setIllustrationStyle(style);
    flowMapStore.updateVisualElements({
      iconStyle,
      illustrationStyle: style,
    });
  };

  // Handle continue button click
  const handleContinue = () => {
    // No need to update the store here since we're already updating in real-time
    flowMapStore.nextStep();
  };

  return (
    <FlowMapLayout
      title="Visual Elements"
      description="Select the visual styles for icons and illustrations"
      onContinue={handleContinue}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Choose Icon Style</h3>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                iconStyle === 'line'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleIconStyleChange('line')}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-3 text-2xl">
                  <div className="i-ph:user"></div>
                  <div className="i-ph:house"></div>
                  <div className="i-ph:gear"></div>
                  <div className="i-ph:bell"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Line Icons</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Clean outline icons with a modern, minimalist look
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                iconStyle === 'solid'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleIconStyleChange('solid')}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-3 text-2xl">
                  <div className="i-ph:user-fill"></div>
                  <div className="i-ph:house-fill"></div>
                  <div className="i-ph:gear-fill"></div>
                  <div className="i-ph:bell-fill"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Solid Icons</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Bold filled icons with strong visual presence
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                iconStyle === 'duotone'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleIconStyleChange('duotone')}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-3 text-2xl">
                  <div className="i-ph:user-duotone"></div>
                  <div className="i-ph:house-duotone"></div>
                  <div className="i-ph:gear-duotone"></div>
                  <div className="i-ph:bell-duotone"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Duotone Icons</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Two-tone icons with depth and visual interest
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                iconStyle === 'gradient'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleIconStyleChange('gradient')}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-3 text-2xl">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 i-ph:user-fill"></div>
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600 i-ph:house-fill"></div>
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 i-ph:gear-fill"></div>
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 i-ph:bell-fill"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Gradient Icons</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Vibrant gradient-filled icons for a modern feel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Choose Illustration Style</h3>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                illustrationStyle === 'flat'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleIllustrationStyleChange('flat')}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-full h-20 flex items-center justify-center">
                  <div className="flex gap-2">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg"></div>
                    <div className="w-8 h-12 bg-green-500 rounded-lg"></div>
                    <div className="w-6 h-12 bg-yellow-500 rounded-lg"></div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Flat Illustrations</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Modern, colorful illustrations with flat design
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                illustrationStyle === 'isometric'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleIllustrationStyleChange('isometric')}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-full h-20 flex items-center justify-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-12 h-12 bg-purple-500 transform rotate-45 skew-x-12 skew-y-12"></div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Isometric</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Three-dimensional illustrations with depth
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                illustrationStyle === 'hand-drawn'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleIllustrationStyleChange('hand-drawn')}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-full h-20 flex items-center justify-center bg-amber-100 rounded-md">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,40 Q30,20 40,40" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <circle cx="30" cy="25" r="8" stroke="#000" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Hand Drawn</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Sketchy illustrations with a human touch
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                illustrationStyle === 'minimal-line'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleIllustrationStyleChange('minimal-line')}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-full h-20 flex items-center justify-center">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="15" stroke="#000" strokeWidth="1" />
                    <line x1="30" y1="15" x2="30" y2="45" stroke="#000" strokeWidth="1" />
                    <line x1="15" y1="30" x2="45" y2="30" stroke="#000" strokeWidth="1" />
                  </svg>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Minimal Line Art</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Simple, elegant illustrations with thin lines
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FlowMapLayout>
  );
};

export default VisualElements;
