import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { flowMapData, flowMapStore } from '~/lib/stores/flowMap';
import { FlowMapLayout } from './FlowMapLayout';
import { classNames } from '~/utils/classNames';

export const LayoutStructure: React.FC = () => {
  const data = useStore(flowMapData);
  const [columnLayout, setColumnLayout] = useState(data.layoutStructure.columnLayout);
  const [hasHeader, setHasHeader] = useState(data.layoutStructure.hasHeader);
  const [hasFooter, setHasFooter] = useState(data.layoutStructure.hasFooter);
  const [headerComplexity, setHeaderComplexity] = useState(data.layoutStructure.headerComplexity);
  const [footerComplexity, setFooterComplexity] = useState(data.layoutStructure.footerComplexity);

  // Update handlers for real-time preview
  const handleColumnLayoutChange = (layout: 'single' | 'two' | 'three' | 'four') => {
    setColumnLayout(layout);
    flowMapStore.updateLayoutStructure({
      columnLayout: layout,
      hasHeader,
      hasFooter,
      headerComplexity,
      footerComplexity,
    });
  };

  const handleHeaderChange = (value: boolean) => {
    setHasHeader(value);
    flowMapStore.updateLayoutStructure({
      columnLayout,
      hasHeader: value,
      hasFooter,
      headerComplexity,
      footerComplexity,
    });
  };

  const handleHeaderComplexityChange = (complexity: 'simple' | 'complex') => {
    setHeaderComplexity(complexity);
    flowMapStore.updateLayoutStructure({
      columnLayout,
      hasHeader,
      hasFooter,
      headerComplexity: complexity,
      footerComplexity,
    });
  };

  const handleFooterChange = (value: boolean) => {
    setHasFooter(value);
    flowMapStore.updateLayoutStructure({
      columnLayout,
      hasHeader,
      hasFooter: value,
      headerComplexity,
      footerComplexity,
    });
  };

  const handleFooterComplexityChange = (complexity: 'simple' | 'complex') => {
    setFooterComplexity(complexity);
    flowMapStore.updateLayoutStructure({
      columnLayout,
      hasHeader,
      hasFooter,
      headerComplexity,
      footerComplexity: complexity,
    });
  };

  // Handle continue button click
  const handleContinue = () => {
    // No need to update the store here since we're already updating in real-time
    flowMapStore.nextStep();
  };

  return (
    <FlowMapLayout
      title="Layout Structure"
      description="Define the structure and components of your layout"
      onContinue={handleContinue}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Choose Column Layout</h3>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                columnLayout === 'single'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleColumnLayoutChange('single')}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 flex items-center justify-center">
                  <div className="w-12 h-16 border-2 border-current rounded opacity-70"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Single Column</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Classic stacked layout, ideal for articles and content-heavy pages
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                columnLayout === 'two'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleColumnLayoutChange('two')}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-6 h-16 border-2 border-current rounded opacity-70"></div>
                    <div className="w-6 h-16 border-2 border-current rounded opacity-70"></div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Two Column</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Balanced layout with sidebar, great for blogs and dashboards
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                columnLayout === 'three'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleColumnLayoutChange('three')}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-4 h-16 border-2 border-current rounded opacity-70"></div>
                    <div className="w-4 h-16 border-2 border-current rounded opacity-70"></div>
                    <div className="w-4 h-16 border-2 border-current rounded opacity-70"></div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Three Column</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Rich layout with multiple content sections, ideal for news sites
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                columnLayout === 'four'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleColumnLayoutChange('four')}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="w-4 h-8 border-2 border-current rounded opacity-70"></div>
                    <div className="w-4 h-8 border-2 border-current rounded opacity-70"></div>
                    <div className="w-4 h-8 border-2 border-current rounded opacity-70"></div>
                    <div className="w-4 h-8 border-2 border-current rounded opacity-70"></div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-bolt-elements-textPrimary">Four Column</h4>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Grid layout for gallery-style content or product listings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Header Configuration</h3>

          <div className="space-y-3">
            <p className="text-sm text-bolt-elements-textSecondary">Do you want to include a header?</p>

            <div className="flex gap-3">
              <button
                className={classNames(
                  'px-4 py-2 rounded-md border',
                  hasHeader
                    ? 'bg-purple-500 text-white border-purple-600'
                    : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor text-bolt-elements-textPrimary'
                )}
                onClick={() => handleHeaderChange(true)}
              >
                Yes
              </button>
              <button
                className={classNames(
                  'px-4 py-2 rounded-md border',
                  !hasHeader
                    ? 'bg-purple-500 text-white border-purple-600'
                    : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor text-bolt-elements-textPrimary'
                )}
                onClick={() => handleHeaderChange(false)}
              >
                No
              </button>
            </div>

            {hasHeader && (
              <div className="pt-2">
                <p className="text-sm text-bolt-elements-textSecondary mb-2">Header Complexity</p>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={classNames(
                      'p-3 rounded-md border cursor-pointer transition-all',
                      headerComplexity === 'simple'
                        ? 'bg-purple-500/10 border-purple-500/20'
                        : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
                    )}
                    onClick={() => handleHeaderComplexityChange('simple')}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="simple-header"
                        checked={headerComplexity === 'simple'}
                        onChange={() => {}}
                        className="w-4 h-4 rounded-full border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                      />
                      <div>
                        <label
                          htmlFor="simple-header"
                          className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                        >
                          Simple
                        </label>
                        <p className="text-xs text-bolt-elements-textSecondary mt-1">
                          Simple header with logo and minimal navigation
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={classNames(
                      'p-3 rounded-md border cursor-pointer transition-all',
                      headerComplexity === 'complex'
                        ? 'bg-purple-500/10 border-purple-500/20'
                        : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
                    )}
                    onClick={() => handleHeaderComplexityChange('complex')}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="complex-header"
                        checked={headerComplexity === 'complex'}
                        onChange={() => {}}
                        className="w-4 h-4 rounded-full border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                      />
                      <div>
                        <label
                          htmlFor="complex-header"
                          className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                        >
                          Complex
                        </label>
                        <p className="text-xs text-bolt-elements-textSecondary mt-1">
                          Full-featured with dropdown menus, search, and user account
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Footer Configuration</h3>

          <div className="space-y-3">
            <p className="text-sm text-bolt-elements-textSecondary">Do you want to include a footer?</p>

            <div className="flex gap-3">
              <button
                className={classNames(
                  'px-4 py-2 rounded-md border',
                  hasFooter
                    ? 'bg-purple-500 text-white border-purple-600'
                    : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor text-bolt-elements-textPrimary'
                )}
                onClick={() => handleFooterChange(true)}
              >
                Yes
              </button>
              <button
                className={classNames(
                  'px-4 py-2 rounded-md border',
                  !hasFooter
                    ? 'bg-purple-500 text-white border-purple-600'
                    : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor text-bolt-elements-textPrimary'
                )}
                onClick={() => handleFooterChange(false)}
              >
                No
              </button>
            </div>

            {hasFooter && (
              <div className="pt-2">
                <p className="text-sm text-bolt-elements-textSecondary mb-2">Footer Complexity</p>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={classNames(
                      'p-3 rounded-md border cursor-pointer transition-all',
                      footerComplexity === 'simple'
                        ? 'bg-purple-500/10 border-purple-500/20'
                        : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
                    )}
                    onClick={() => handleFooterComplexityChange('simple')}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="simple-footer"
                        checked={footerComplexity === 'simple'}
                        onChange={() => {}}
                        className="w-4 h-4 rounded-full border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                      />
                      <div>
                        <label
                          htmlFor="simple-footer"
                          className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                        >
                          Simple
                        </label>
                        <p className="text-xs text-bolt-elements-textSecondary mt-1">
                          Simple footer with copyright and basic links
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={classNames(
                      'p-3 rounded-md border cursor-pointer transition-all',
                      footerComplexity === 'complex'
                        ? 'bg-purple-500/10 border-purple-500/20'
                        : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
                    )}
                    onClick={() => handleFooterComplexityChange('complex')}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="complex-footer"
                        checked={footerComplexity === 'complex'}
                        onChange={() => {}}
                        className="w-4 h-4 rounded-full border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                      />
                      <div>
                        <label
                          htmlFor="complex-footer"
                          className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                        >
                          Complex
                        </label>
                        <p className="text-xs text-bolt-elements-textSecondary mt-1">
                          Multi-column footer with sitemap, contact info, and newsletter
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FlowMapLayout>
  );
};

export default LayoutStructure;
