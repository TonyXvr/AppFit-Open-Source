import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { flowMapData, flowMapStore } from '~/lib/stores/flowMap';
import { FlowMapLayout } from './FlowMapLayout';
import { classNames } from '~/utils/classNames';
import { Input } from '~/components/ui/Input';

export const Functionality: React.FC = () => {
  const data = useStore(flowMapData);
  const [level, setLevel] = useState(data.functionality.level);
  const [technicalRequirements, setTechnicalRequirements] = useState<string[]>(data.functionality.technicalRequirements);
  const [customFeature, setCustomFeature] = useState('');
  const [customFeatures, setCustomFeatures] = useState<string[]>(data.functionality.customFeatures);

  // Update handlers for real-time preview
  const handleLevelChange = (newLevel: 'basic' | 'standard' | 'advanced' | 'enterprise') => {
    setLevel(newLevel);
    flowMapStore.updateFunctionality({
      level: newLevel,
      technicalRequirements,
      customFeatures,
    });
  };

  // Toggle technical requirement
  const toggleRequirement = (requirement: string) => {
    let newRequirements;
    if (technicalRequirements.includes(requirement)) {
      newRequirements = technicalRequirements.filter(req => req !== requirement);
    } else {
      newRequirements = [...technicalRequirements, requirement];
    }
    setTechnicalRequirements(newRequirements);

    // Update store in real-time
    flowMapStore.updateFunctionality({
      level,
      technicalRequirements: newRequirements,
      customFeatures,
    });
  };

  // Add custom feature
  const addCustomFeature = () => {
    if (customFeature.trim() && !customFeatures.includes(customFeature.trim())) {
      const newFeatures = [...customFeatures, customFeature.trim()];
      setCustomFeatures(newFeatures);
      setCustomFeature('');

      // Update store in real-time
      flowMapStore.updateFunctionality({
        level,
        technicalRequirements,
        customFeatures: newFeatures,
      });
    }
  };

  // Remove custom feature
  const removeCustomFeature = (index: number) => {
    const newFeatures = customFeatures.filter((_, i) => i !== index);
    setCustomFeatures(newFeatures);

    // Update store in real-time
    flowMapStore.updateFunctionality({
      level,
      technicalRequirements,
      customFeatures: newFeatures,
    });
  };

  // Handle continue button click
  const handleContinue = () => {
    // No need to update the store here since we're already updating in real-time
    flowMapStore.nextStep();
  };

  return (
    <FlowMapLayout
      title="Functionality"
      description="Define the functionality level and technical requirements"
      onContinue={handleContinue}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Choose Functionality Level</h3>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                level === 'basic'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleLevelChange('basic')}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 pt-0.5">
                  <input
                    type="radio"
                    id="basic"
                    checked={level === 'basic'}
                    onChange={() => {}}
                    className="w-4 h-4 rounded-full border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                  />
                </div>
                <div>
                  <label
                    htmlFor="basic"
                    className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                  >
                    Basic
                  </label>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Essential features for a minimal viable product
                  </p>
                  <p className="text-xs text-bolt-elements-textTertiary mt-2">
                    Examples: Simple forms, static content, basic navigation
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                level === 'standard'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleLevelChange('standard')}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 pt-0.5">
                  <input
                    type="radio"
                    id="standard"
                    checked={level === 'standard'}
                    onChange={() => {}}
                    className="w-4 h-4 rounded-full border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                  />
                </div>
                <div>
                  <label
                    htmlFor="standard"
                    className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                  >
                    Standard
                  </label>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Comprehensive features for typical use cases
                  </p>
                  <p className="text-xs text-bolt-elements-textTertiary mt-2">
                    Examples: User accounts, search functionality, content filtering
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                level === 'advanced'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleLevelChange('advanced')}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 pt-0.5">
                  <input
                    type="radio"
                    id="advanced"
                    checked={level === 'advanced'}
                    onChange={() => {}}
                    className="w-4 h-4 rounded-full border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                  />
                </div>
                <div>
                  <label
                    htmlFor="advanced"
                    className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                  >
                    Advanced
                  </label>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Extensive features for power users and complex scenarios
                  </p>
                  <p className="text-xs text-bolt-elements-textTertiary mt-2">
                    Examples: Advanced filtering, real-time updates, complex interactions
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-4 rounded-md border cursor-pointer transition-all',
                level === 'enterprise'
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => handleLevelChange('enterprise')}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 pt-0.5">
                  <input
                    type="radio"
                    id="enterprise"
                    checked={level === 'enterprise'}
                    onChange={() => {}}
                    className="w-4 h-4 rounded-full border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                  />
                </div>
                <div>
                  <label
                    htmlFor="enterprise"
                    className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                  >
                    Enterprise
                  </label>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Full-featured with security, scalability, and advanced integrations
                  </p>
                  <p className="text-xs text-bolt-elements-textTertiary mt-2">
                    Examples: SSO, role-based access, audit logs, multi-tenant support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Technical Requirements</h3>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={classNames(
                'p-3 rounded-md border cursor-pointer transition-all',
                technicalRequirements.includes('responsive-design')
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => toggleRequirement('responsive-design')}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="responsive-design"
                  checked={technicalRequirements.includes('responsive-design')}
                  onChange={() => {}}
                  className="w-4 h-4 rounded border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                />
                <div>
                  <label
                    htmlFor="responsive-design"
                    className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                  >
                    Responsive Design
                  </label>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Adapts to different screen sizes and devices
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-3 rounded-md border cursor-pointer transition-all',
                technicalRequirements.includes('dark-mode')
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => toggleRequirement('dark-mode')}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="dark-mode"
                  checked={technicalRequirements.includes('dark-mode')}
                  onChange={() => {}}
                  className="w-4 h-4 rounded border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                />
                <div>
                  <label
                    htmlFor="dark-mode"
                    className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                  >
                    Dark Mode
                  </label>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Alternate color scheme for low-light environments
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-3 rounded-md border cursor-pointer transition-all',
                technicalRequirements.includes('accessibility')
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => toggleRequirement('accessibility')}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="accessibility"
                  checked={technicalRequirements.includes('accessibility')}
                  onChange={() => {}}
                  className="w-4 h-4 rounded border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                />
                <div>
                  <label
                    htmlFor="accessibility"
                    className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                  >
                    Accessibility
                  </label>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Compliant with WCAG guidelines for all users
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-3 rounded-md border cursor-pointer transition-all',
                technicalRequirements.includes('api-integration')
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => toggleRequirement('api-integration')}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="api-integration"
                  checked={technicalRequirements.includes('api-integration')}
                  onChange={() => {}}
                  className="w-4 h-4 rounded border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                />
                <div>
                  <label
                    htmlFor="api-integration"
                    className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                  >
                    API Integration
                  </label>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Connect with external services and data sources
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-3 rounded-md border cursor-pointer transition-all',
                technicalRequirements.includes('analytics')
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => toggleRequirement('analytics')}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="analytics"
                  checked={technicalRequirements.includes('analytics')}
                  onChange={() => {}}
                  className="w-4 h-4 rounded border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                />
                <div>
                  <label
                    htmlFor="analytics"
                    className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                  >
                    Analytics
                  </label>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Track user behavior and application performance
                  </p>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'p-3 rounded-md border cursor-pointer transition-all',
                technicalRequirements.includes('seo-optimization')
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
              )}
              onClick={() => toggleRequirement('seo-optimization')}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="seo-optimization"
                  checked={technicalRequirements.includes('seo-optimization')}
                  onChange={() => {}}
                  className="w-4 h-4 rounded border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                />
                <div>
                  <label
                    htmlFor="seo-optimization"
                    className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                  >
                    SEO Optimization
                  </label>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Optimize visibility in search engine results
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Custom Features</h3>
          <p className="text-sm text-bolt-elements-textSecondary">Add any specific features you need</p>

          <div className="flex gap-2">
            <Input
              value={customFeature}
              onChange={(e) => setCustomFeature(e.target.value)}
              placeholder="Enter a custom feature..."
              className="flex-1"
            />
            <button
              onClick={addCustomFeature}
              className="px-4 py-2 bg-bolt-elements-background-depth-2 hover:bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary rounded-md"
            >
              Add
            </button>
          </div>

          {customFeatures.length > 0 && (
            <div className="space-y-2 mt-3">
              {customFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-bolt-elements-background-depth-2 rounded-md"
                >
                  <span className="text-sm text-bolt-elements-textPrimary">{feature}</span>
                  <button
                    onClick={() => removeCustomFeature(index)}
                    className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary"
                  >
                    <div className="i-ph:x text-lg" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FlowMapLayout>
  );
};

export default Functionality;
