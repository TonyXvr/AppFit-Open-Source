import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { flowMapData, flowMapStore } from '~/lib/stores/flowMap';
import { FlowMapLayout } from './FlowMapLayout';
import { Input } from '~/components/ui/Input';
import { classNames } from '~/utils/classNames';

export const ProjectInformation: React.FC = () => {
  const data = useStore(flowMapData);
  const [projectName, setProjectName] = useState(data.projectInfo.name);
  const [projectDescription, setProjectDescription] = useState(data.projectInfo.description);
  const [category, setCategory] = useState(data.projectInfo.category);
  const [subcategory, setSubcategory] = useState(data.projectInfo.subcategory);
  const [isValid, setIsValid] = useState(false);

  // Validate form
  useEffect(() => {
    setIsValid(!!projectName && !!projectDescription);
  }, [projectName, projectDescription]);

  // Handle continue button click
  // Update the store in real-time as the user types
  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProjectName(value);
    flowMapStore.updateProjectInfo({
      name: value,
      description: projectDescription,
      category,
      subcategory,
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setProjectDescription(value);
    flowMapStore.updateProjectInfo({
      name: projectName,
      description: value,
      category,
      subcategory,
    });
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSubcategory(''); // Reset subcategory when category changes
    flowMapStore.updateProjectInfo({
      name: projectName,
      description: projectDescription,
      category: newCategory,
      subcategory: '',
    });
  };

  const handleSubcategoryChange = (newSubcategory: string) => {
    setSubcategory(newSubcategory);
    flowMapStore.updateProjectInfo({
      name: projectName,
      description: projectDescription,
      category,
      subcategory: newSubcategory,
    });
  };

  const handleContinue = () => {
    // No need to update the store here since we're already updating in real-time
    flowMapStore.nextStep();
  };

  // Category options
  const categories = [
    { id: 'website', name: 'Website', description: 'Static pages focused on content presentation' },
    { id: 'web-app', name: 'Web App', description: 'Interactive applications with complex functionality' },
    { id: 'mobile-app', name: 'Mobile App', description: 'Mobile-first experiences with touch interactions' },
    { id: 'dashboard', name: 'Dashboard', description: 'Data visualization and monitoring interfaces' },
  ];

  // Subcategory options based on selected category
  const getSubcategories = () => {
    switch (category) {
      case 'website':
        return [
          { id: 'portfolio', name: 'Portfolio' },
          { id: 'blog', name: 'Blog' },
          { id: 'e-commerce', name: 'E-Commerce' },
          { id: 'business-corporate', name: 'Business/Corporate' },
        ];
      case 'web-app':
        return [
          { id: 'productivity', name: 'Productivity' },
          { id: 'social', name: 'Social' },
          { id: 'education', name: 'Education' },
          { id: 'entertainment', name: 'Entertainment' },
        ];
      case 'mobile-app':
        return [
          { id: 'utility', name: 'Utility' },
          { id: 'lifestyle', name: 'Lifestyle' },
          { id: 'health-fitness', name: 'Health & Fitness' },
          { id: 'games', name: 'Games' },
        ];
      case 'dashboard':
        return [
          { id: 'analytics', name: 'Analytics' },
          { id: 'admin', name: 'Admin' },
          { id: 'monitoring', name: 'Monitoring' },
          { id: 'finance', name: 'Finance' },
        ];
      default:
        return [];
    }
  };

  return (
    <FlowMapLayout
      title="Project Information"
      description="Define your project details and category"
      showBackButton={false}
      onContinue={handleContinue}
      disableContinue={!isValid}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Basic Details</h3>
          <div className="space-y-2">
            <label htmlFor="projectName" className="block text-sm font-medium text-bolt-elements-textSecondary">
              Project/Company Name *
            </label>
            <Input
              id="projectName"
              value={projectName}
              onChange={handleProjectNameChange}
              placeholder="ToDo List Website"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tagline" className="block text-sm font-medium text-bolt-elements-textSecondary">
              Tagline/Description *
            </label>
            <textarea
              id="tagline"
              value={projectDescription}
              onChange={handleDescriptionChange}
              placeholder="It is a todo list website to help users manage tasks"
              className="flex w-full rounded-md border border-bolt-elements-border bg-bolt-elements-background px-3 py-2 text-sm ring-offset-bolt-elements-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-bolt-elements-textSecondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bolt-elements-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Category Selection</h3>
          <p className="text-sm text-bolt-elements-textTertiary">Select the general category for your project</p>

          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={classNames(
                  'p-4 rounded-md border cursor-pointer transition-all',
                  category === cat.id
                    ? 'bg-purple-500/10 border-purple-500/20'
                    : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
                )}
                onClick={() => handleCategoryChange(cat.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 pt-0.5">
                    <input
                      type="radio"
                      id={cat.id}
                      checked={category === cat.id}
                      onChange={() => {}}
                      className="w-4 h-4 rounded-full border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={cat.id}
                      className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                    >
                      {cat.name}
                    </label>
                    <p className="text-xs text-bolt-elements-textSecondary mt-1">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Subcategory</h3>
          <p className="text-sm text-bolt-elements-textTertiary">Choose a more specific type for your {categories.find(c => c.id === category)?.name.toLowerCase()}</p>

          <div className="grid grid-cols-2 gap-2">
            {getSubcategories().map((subcat) => (
              <div
                key={subcat.id}
                className={classNames(
                  'p-3 rounded-md border cursor-pointer transition-all',
                  subcategory === subcat.id
                    ? 'bg-purple-500/10 border-purple-500/20'
                    : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3'
                )}
                onClick={() => handleSubcategoryChange(subcat.id)}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={subcat.id}
                    checked={subcategory === subcat.id}
                    onChange={() => {}}
                    className="w-4 h-4 rounded-full border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                  />
                  <label
                    htmlFor={subcat.id}
                    className="block font-medium text-bolt-elements-textPrimary cursor-pointer"
                  >
                    {subcat.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FlowMapLayout>
  );
};

export default ProjectInformation;
