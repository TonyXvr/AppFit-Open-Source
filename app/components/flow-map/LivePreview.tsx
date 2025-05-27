import React from 'react';
import { useStore } from '@nanostores/react';
import { flowMapData, flowMapStore } from '~/lib/stores/flowMap';
import { classNames } from '~/utils/classNames';

export const LivePreview: React.FC = () => {
  // Use the store to get the latest data
  const data = useStore(flowMapData);

  // We'll use React's useEffect to log updates for debugging
  React.useEffect(() => {
    console.log('LivePreview updated with new data', data);
  }, [data]);

  // Default values for preview
  const projectName = data.projectInfo.name || 'Todo List Website';
  const projectDescription = data.projectInfo.description || 'It is a todo list website to help users manage tasks';
  const category = data.projectInfo.category || 'website';
  const subcategory = data.projectInfo.subcategory || 'business/corporate';

  const columnLayout = data.layoutStructure.columnLayout || 'two';
  const hasHeader = data.layoutStructure.hasHeader;
  const hasFooter = data.layoutStructure.hasFooter;

  const designLanguage = data.designSystem.designLanguage || 'material';
  const colorTheme = data.designSystem.colorTheme || 'light-modern';
  const headingFont = data.designSystem.typography.headingFont || 'Inter';
  const bodyFont = data.designSystem.typography.bodyFont || 'Inter';

  const iconStyle = data.visualElements.iconStyle || 'line';
  const illustrationStyle = data.visualElements.illustrationStyle || 'flat';

  // Generate color scheme based on selected theme
  const getColorScheme = () => {
    switch (colorTheme) {
      case 'light-modern':
        return {
          primary: '#3b82f6', // blue-500
          secondary: '#6366f1', // indigo-500
          background: '#ffffff',
          text: '#1f2937', // gray-800
          border: '#e5e7eb', // gray-200
        };
      case 'dark-professional':
        return {
          primary: '#60a5fa', // blue-400
          secondary: '#818cf8', // indigo-400
          background: '#1f2937', // gray-800
          text: '#f9fafb', // gray-50
          border: '#374151', // gray-700
        };
      case 'vibrant-creative':
        return {
          primary: '#ec4899', // pink-500
          secondary: '#8b5cf6', // violet-500
          background: '#ffffff',
          text: '#1f2937', // gray-800
          border: '#f3f4f6', // gray-100
        };
      case 'minimalist':
        return {
          primary: '#111827', // gray-900
          secondary: '#6b7280', // gray-500
          background: '#ffffff',
          text: '#111827', // gray-900
          border: '#f3f4f6', // gray-100
        };
      case 'organic-natural':
        return {
          primary: '#15803d', // green-700
          secondary: '#92400e', // amber-800
          background: '#f8fafc', // slate-50
          text: '#1e293b', // slate-800
          border: '#e2e8f0', // slate-200
        };
      case 'tech-digital':
        return {
          primary: '#0891b2', // cyan-600
          secondary: '#1e40af', // blue-800
          background: '#0f172a', // slate-900
          text: '#f1f5f9', // slate-100
          border: '#1e293b', // slate-800
        };
      default:
        return {
          primary: '#3b82f6', // blue-500
          secondary: '#6366f1', // indigo-500
          background: '#ffffff',
          text: '#1f2937', // gray-800
          border: '#e5e7eb', // gray-200
        };
    }
  };

  const colors = getColorScheme();

  // Determine if we should use dark mode styles
  const isDarkMode = colorTheme === 'dark-professional' || colorTheme === 'tech-digital';

  // Generate preview styles based on selections
  const previewStyles = {
    container: {
      backgroundColor: colors.background,
      color: colors.text,
      fontFamily: bodyFont === 'Inter' ? 'Inter, sans-serif' : 'serif',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    header: {
      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)',
      borderBottom: `1px solid ${colors.border}`,
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: '1.25rem',
      fontFamily: headingFont === 'Inter' ? 'Inter, sans-serif' : 'serif',
    },
    nav: {
      display: 'flex',
      gap: '1rem',
    },
    navItem: {
      color: colors.text,
      opacity: 0.8,
      fontSize: '0.875rem',
    },
    main: {
      flex: 1,
      padding: '1.5rem',
      overflowY: 'auto' as const,
    },
    heading: {
      color: colors.primary,
      fontFamily: headingFont === 'Inter' ? 'Inter, sans-serif' : 'serif',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    description: {
      fontSize: '0.875rem',
      marginBottom: '1.5rem',
      opacity: 0.8,
    },
    content: {
      display: 'grid',
      gridTemplateColumns:
        columnLayout === 'single' ? '1fr' :
        columnLayout === 'two' ? '2fr 1fr' :
        columnLayout === 'three' ? '1fr 1fr 1fr' :
        'repeat(2, 1fr)',
      gap: '1rem',
    },
    card: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      borderRadius: '0.375rem',
      padding: '1rem',
      height: '80px',
    },
    footer: {
      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)',
      borderTop: `1px solid ${colors.border}`,
      padding: '1rem',
      fontSize: '0.75rem',
      textAlign: 'center' as const,
      opacity: 0.7,
    },
  };

  // Generate placeholder content based on layout
  const renderContent = () => {
    if (columnLayout === 'single') {
      return (
        <div style={previewStyles.content}>
          <div>
            <div style={previewStyles.card}></div>
            <div style={{ height: '12px', marginTop: '12px', backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', width: '100%', borderRadius: '4px' }}></div>
            <div style={{ height: '12px', marginTop: '8px', backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', width: '80%', borderRadius: '4px' }}></div>
            <div style={{ height: '12px', marginTop: '8px', backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', width: '90%', borderRadius: '4px' }}></div>
          </div>
        </div>
      );
    } else if (columnLayout === 'two') {
      return (
        <div style={previewStyles.content}>
          <div>
            <div style={previewStyles.card}></div>
            <div style={{ height: '12px', marginTop: '12px', backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', width: '100%', borderRadius: '4px' }}></div>
            <div style={{ height: '12px', marginTop: '8px', backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', width: '80%', borderRadius: '4px' }}></div>
          </div>
          <div>
            <div style={{ height: '12px', backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', width: '100%', borderRadius: '4px' }}></div>
            <div style={{ height: '12px', marginTop: '8px', backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', width: '90%', borderRadius: '4px' }}></div>
            <div style={{ height: '12px', marginTop: '8px', backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', width: '70%', borderRadius: '4px' }}></div>
            <div style={{ height: '12px', marginTop: '8px', backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', width: '85%', borderRadius: '4px' }}></div>
          </div>
        </div>
      );
    } else if (columnLayout === 'three') {
      return (
        <div style={previewStyles.content}>
          <div>
            <div style={previewStyles.card}></div>
            <div style={{ height: '10px', marginTop: '10px', backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', width: '100%', borderRadius: '4px' }}></div>
          </div>
          <div>
            <div style={previewStyles.card}></div>
            <div style={{ height: '10px', marginTop: '10px', backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', width: '100%', borderRadius: '4px' }}></div>
          </div>
          <div>
            <div style={previewStyles.card}></div>
            <div style={{ height: '10px', marginTop: '10px', backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', width: '100%', borderRadius: '4px' }}></div>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          <div style={previewStyles.card}></div>
          <div style={previewStyles.card}></div>
          <div style={previewStyles.card}></div>
          <div style={previewStyles.card}></div>
        </div>
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-bolt-elements-background-depth-1 border-b border-bolt-elements-borderColor flex justify-between items-center">
        <h2 className="text-lg font-medium text-bolt-elements-textPrimary">Live Preview</h2>
        <span className="text-xs text-purple-500 px-2 py-0.5 rounded-full bg-purple-500/10">
          {category} - {subcategory}
        </span>
      </div>

      <div className="p-6 flex items-center justify-center h-[calc(100%-57px)]">
        <div style={previewStyles.container} className="w-full max-w-md h-[500px]">
          {/* Header */}
          {hasHeader && (
            <div style={previewStyles.header}>
              <div style={previewStyles.logo}>{projectName}</div>
              <div style={previewStyles.nav}>
                <div style={previewStyles.navItem}>Home</div>
                <div style={previewStyles.navItem}>Features</div>
                <div style={previewStyles.navItem}>About</div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div style={previewStyles.main}>
            <div style={previewStyles.heading}>{projectName}</div>
            <div style={previewStyles.description}>{projectDescription}</div>

            {renderContent()}
          </div>

          {/* Footer */}
          {hasFooter && (
            <div style={previewStyles.footer}>
              © 2023 {projectName}. All rights reserved.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
