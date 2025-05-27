import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { flowMapData, flowMapStore } from '~/lib/stores/flowMap';
import { FlowMapLayout } from './FlowMapLayout';
import { classNames } from '~/utils/classNames';

export const DesignSystem: React.FC = () => {
  const data = useStore(flowMapData);
  const [designLanguage, setDesignLanguage] = useState(data.designSystem.designLanguage);
  const [colorTheme, setColorTheme] = useState(data.designSystem.colorTheme);
  const [headingFont, setHeadingFont] = useState(data.designSystem.typography.headingFont);
  const [bodyFont, setBodyFont] = useState(data.designSystem.typography.bodyFont);

  // Update handlers for real-time preview
  const handleDesignLanguageChange = (language: 'material' | 'fluent' | 'apple' | 'tailored' | 'bootstrap' | 'neuromorphism') => {
    setDesignLanguage(language);
    flowMapStore.updateDesignSystem({
      designLanguage: language,
      colorTheme,
      typography: {
        headingFont,
        bodyFont,
      },
    });
  };

  const handleColorThemeChange = (theme: 'light-modern' | 'dark-professional' | 'vibrant-creative' | 'minimalist' | 'organic-natural' | 'tech-digital') => {
    setColorTheme(theme);
    flowMapStore.updateDesignSystem({
      designLanguage,
      colorTheme: theme,
      typography: {
        headingFont,
        bodyFont,
      },
    });
  };

  const handleHeadingFontChange = (font: string) => {
    setHeadingFont(font);
    flowMapStore.updateDesignSystem({
      designLanguage,
      colorTheme,
      typography: {
        headingFont: font,
        bodyFont,
      },
    });
  };

  const handleBodyFontChange = (font: string) => {
    setBodyFont(font);
    flowMapStore.updateDesignSystem({
      designLanguage,
      colorTheme,
      typography: {
        headingFont,
        bodyFont: font,
      },
    });
  };

  // Handle continue button click
  const handleContinue = () => {
    // No need to update the store here since we're already updating in real-time
    flowMapStore.nextStep();
  };

  return (
    <FlowMapLayout
      title="Design System"
      description="Choose the core design elements for your project"
      onContinue={handleContinue}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">1. Design Language</h3>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                designLanguage === 'material'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleDesignLanguageChange('material')}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-full h-12 flex items-center justify-center">
                  <div className="w-32 h-6 bg-blue-500 rounded-md"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Material Design</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Google's design system with tactile surfaces and bold colors
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                designLanguage === 'fluent'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleDesignLanguageChange('fluent')}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-full h-12 flex items-center justify-center">
                  <div className="w-32 h-6 bg-indigo-500 rounded-md"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Fluent Design</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Microsoft's design language focusing on light, depth, and motion
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                designLanguage === 'apple'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleDesignLanguageChange('apple')}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-full h-12 flex items-center justify-center">
                  <div className="w-32 h-6 bg-gray-800 rounded-md"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Apple Human Interface</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Clean, minimal design with careful attention to typography
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                designLanguage === 'tailored'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleDesignLanguageChange('tailored')}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-full h-12 flex items-center justify-center">
                  <div className="w-32 h-6 bg-teal-500 rounded-md"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Tailored Style</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Utility-first approach with modern, clean aesthetics
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                designLanguage === 'bootstrap'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleDesignLanguageChange('bootstrap')}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-full h-12 flex items-center justify-center">
                  <div className="w-32 h-6 bg-purple-600 rounded-md"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Bootstrap Style</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Consistent, responsive design with a familiar look and feel
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                designLanguage === 'neuromorphism'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleDesignLanguageChange('neuromorphism')}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-full h-12 flex items-center justify-center">
                  <div className="w-32 h-6 bg-gray-200 shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] rounded-md"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Neuromorphism</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Soft UI with subtle shadows and clean interfaces
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">2. Color Theme</h3>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                colorTheme === 'light-modern'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleColorThemeChange('light-modern')}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  <div className="w-6 h-6 bg-blue-700 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Light Modern</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Bright design with subtle shadows and bright art/workspace
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                colorTheme === 'dark-professional'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleColorThemeChange('dark-professional')}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
                  <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-800 rounded-full"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Dark Professional</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Sophisticated dark theme with professional color palette
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                colorTheme === 'vibrant-creative'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleColorThemeChange('vibrant-creative')}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-pink-500 rounded-full"></div>
                  <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                  <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Vibrant Creative</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Bold, colorful design with eye-catching elements
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                colorTheme === 'minimalist'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleColorThemeChange('minimalist')}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-gray-900 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Minimalist</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Simple, uncluttered design focusing on essential elements
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                colorTheme === 'organic-natural'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleColorThemeChange('organic-natural')}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                  <div className="w-6 h-6 bg-amber-700 rounded-full"></div>
                  <div className="w-6 h-6 bg-stone-200 rounded-full"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Organic & Natural</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Earth tones and subtle textures with a warm feel
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                colorTheme === 'tech-digital'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleColorThemeChange('tech-digital')}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full"></div>
                  <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-900 rounded-full"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Tech & Digital</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Modern, high-tech aesthetics with digital elements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">3. Typography</h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-bolt-elements-textSecondary mb-2">Heading Font</p>
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={classNames(
                    'p-3 rounded-md border cursor-pointer transition-all',
                    headingFont === 'Inter'
                      ? 'bg-purple-500/10 border-purple-500/20'
                      : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
                  )}
                  onClick={() => handleHeadingFontChange('Inter')}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="inter-heading"
                      checked={headingFont === 'Inter'}
                      onChange={() => {}}
                      className="w-4 h-4 rounded-full border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                    />
                    <label
                      htmlFor="inter-heading"
                      className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Inter/Open Sans
                    </label>
                  </div>
                </div>

                <div
                  className={classNames(
                    'p-3 rounded-md border cursor-pointer transition-all',
                    headingFont === 'Playfair Display'
                      ? 'bg-purple-500/10 border-purple-500/20'
                      : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
                  )}
                  onClick={() => handleHeadingFontChange('Playfair Display')}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="playfair-heading"
                      checked={headingFont === 'Playfair Display'}
                      onChange={() => {}}
                      className="w-4 h-4 rounded-full border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                    />
                    <label
                      htmlFor="playfair-heading"
                      className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                      style={{ fontFamily: 'serif' }}
                    >
                      Playfair Display
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-bolt-elements-textSecondary mb-2">Body Font</p>
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={classNames(
                    'p-3 rounded-md border cursor-pointer transition-all',
                    bodyFont === 'Inter'
                      ? 'bg-purple-500/10 border-purple-500/20'
                      : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
                  )}
                  onClick={() => handleBodyFontChange('Inter')}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="inter-body"
                      checked={bodyFont === 'Inter'}
                      onChange={() => {}}
                      className="w-4 h-4 rounded-full border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                    />
                    <label
                      htmlFor="inter-body"
                      className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Inter
                    </label>
                  </div>
                </div>

                <div
                  className={classNames(
                    'p-3 rounded-md border cursor-pointer transition-all',
                    bodyFont === 'Source Serif Pro'
                      ? 'bg-purple-500/10 border-purple-500/20'
                      : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
                  )}
                  onClick={() => handleBodyFontChange('Source Serif Pro')}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="source-serif-body"
                      checked={bodyFont === 'Source Serif Pro'}
                      onChange={() => {}}
                      className="w-4 h-4 rounded-full border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                    />
                    <label
                      htmlFor="source-serif-body"
                      className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                      style={{ fontFamily: 'serif' }}
                    >
                      Source Serif Pro
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FlowMapLayout>
  );
};

export default DesignSystem;
