import { atom, map } from 'nanostores';

// Define the steps in the Flow Map
export enum FlowMapStep {
  ProjectInformation = 'project-information',
  LayoutStructure = 'layout-structure',
  DesignSystem = 'design-system',
  VisualElements = 'visual-elements',
  Functionality = 'functionality',
  DesignSummary = 'design-summary',
}

// Define the types for the Flow Map data
export interface ProjectInfo {
  name: string;
  description: string;
  category: string;
  subcategory: string;
}

export interface LayoutStructure {
  columnLayout: 'single' | 'two' | 'three' | 'four';
  hasHeader: boolean;
  hasFooter: boolean;
  headerComplexity: 'simple' | 'complex';
  footerComplexity: 'simple' | 'complex';
}

export interface DesignSystem {
  designLanguage: 'material' | 'fluent' | 'apple' | 'tailored' | 'bootstrap' | 'neuromorphism';
  colorTheme: 'light-modern' | 'dark-professional' | 'vibrant-creative' | 'minimalist' | 'organic-natural' | 'tech-digital';
  typography: {
    headingFont: string;
    bodyFont: string;
  };
}

export interface VisualElements {
  iconStyle: 'line' | 'solid' | 'duotone' | 'gradient';
  illustrationStyle: 'flat' | 'isometric' | 'hand-drawn' | 'minimal-line';
}

export interface Functionality {
  level: 'basic' | 'standard' | 'advanced' | 'enterprise';
  technicalRequirements: string[];
  customFeatures: string[];
}

export interface FlowMapData {
  projectInfo: ProjectInfo;
  layoutStructure: LayoutStructure;
  designSystem: DesignSystem;
  visualElements: VisualElements;
  functionality: Functionality;
}

// Default values
const defaultProjectInfo: ProjectInfo = {
  name: '',
  description: '',
  category: 'website',
  subcategory: '',
};

const defaultLayoutStructure: LayoutStructure = {
  columnLayout: 'two',
  hasHeader: true,
  hasFooter: true,
  headerComplexity: 'simple',
  footerComplexity: 'simple',
};

const defaultDesignSystem: DesignSystem = {
  designLanguage: 'material',
  colorTheme: 'light-modern',
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
  },
};

const defaultVisualElements: VisualElements = {
  iconStyle: 'line',
  illustrationStyle: 'flat',
};

const defaultFunctionality: Functionality = {
  level: 'standard',
  technicalRequirements: ['responsive-design'],
  customFeatures: [],
};

// Create atoms for the Flow Map state
export const currentStep = atom<FlowMapStep>(FlowMapStep.ProjectInformation);
export const flowMapData = map<FlowMapData>({
  projectInfo: defaultProjectInfo,
  layoutStructure: defaultLayoutStructure,
  designSystem: defaultDesignSystem,
  visualElements: defaultVisualElements,
  functionality: defaultFunctionality,
});

// Store actions
export const flowMapStore = {
  // Navigation actions
  nextStep: () => {
    const current = currentStep.get();
    switch (current) {
      case FlowMapStep.ProjectInformation:
        currentStep.set(FlowMapStep.LayoutStructure);
        break;
      case FlowMapStep.LayoutStructure:
        currentStep.set(FlowMapStep.DesignSystem);
        break;
      case FlowMapStep.DesignSystem:
        currentStep.set(FlowMapStep.VisualElements);
        break;
      case FlowMapStep.VisualElements:
        currentStep.set(FlowMapStep.Functionality);
        break;
      case FlowMapStep.Functionality:
        currentStep.set(FlowMapStep.DesignSummary);
        break;
      default:
        break;
    }
  },

  previousStep: () => {
    const current = currentStep.get();
    switch (current) {
      case FlowMapStep.LayoutStructure:
        currentStep.set(FlowMapStep.ProjectInformation);
        break;
      case FlowMapStep.DesignSystem:
        currentStep.set(FlowMapStep.LayoutStructure);
        break;
      case FlowMapStep.VisualElements:
        currentStep.set(FlowMapStep.DesignSystem);
        break;
      case FlowMapStep.Functionality:
        currentStep.set(FlowMapStep.VisualElements);
        break;
      case FlowMapStep.DesignSummary:
        currentStep.set(FlowMapStep.Functionality);
        break;
      default:
        break;
    }
  },

  goToStep: (step: FlowMapStep) => {
    currentStep.set(step);
  },

  // Data update actions
  updateProjectInfo: (info: Partial<ProjectInfo>) => {
    const current = flowMapData.get();
    flowMapData.set({
      ...current,
      projectInfo: {
        ...current.projectInfo,
        ...info,
      },
    });
  },

  updateLayoutStructure: (layout: Partial<LayoutStructure>) => {
    const current = flowMapData.get();
    flowMapData.set({
      ...current,
      layoutStructure: {
        ...current.layoutStructure,
        ...layout,
      },
    });
  },

  updateDesignSystem: (design: Partial<DesignSystem>) => {
    const current = flowMapData.get();
    flowMapData.set({
      ...current,
      designSystem: {
        ...current.designSystem,
        ...design,
      },
    });
  },

  updateVisualElements: (visual: Partial<VisualElements>) => {
    const current = flowMapData.get();
    flowMapData.set({
      ...current,
      visualElements: {
        ...current.visualElements,
        ...visual,
      },
    });
  },

  updateFunctionality: (func: Partial<Functionality>) => {
    const current = flowMapData.get();
    flowMapData.set({
      ...current,
      functionality: {
        ...current.functionality,
        ...func,
      },
    });
  },

  // Reset the Flow Map
  reset: () => {
    currentStep.set(FlowMapStep.ProjectInformation);
    flowMapData.set({
      projectInfo: defaultProjectInfo,
      layoutStructure: defaultLayoutStructure,
      designSystem: defaultDesignSystem,
      visualElements: defaultVisualElements,
      functionality: defaultFunctionality,
    });
  },

  // Generate a design prompt based on the Flow Map data
  generateDesignPrompt: (): string => {
    const data = flowMapData.get();
    
    return `Create a ${data.projectInfo.category} for ${data.projectInfo.subcategory || 'general use'} named "${data.projectInfo.name}" with a ${data.layoutStructure.columnLayout} column layout featuring ${data.layoutStructure.hasHeader ? 'a' : 'no'} header and ${data.layoutStructure.hasFooter ? 'a' : 'no'} footer. The tagline/description is: "${data.projectInfo.description}". Implement ${data.designSystem.designLanguage} design principles with ${data.colorTheme} color scheme. For typography, use ${data.designSystem.typography.headingFont} for headings and ${data.designSystem.typography.bodyFont} for body text. Include ${data.visualElements.iconStyle} icons for the icon system and ${data.visualElements.illustrationStyle} illustration style for visual elements. Implement ${data.functionality.level} level functionality with support for ${data.functionality.technicalRequirements.join(', ')}.`;
  }
};
