import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { useStore } from '@nanostores/react';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { currentStep, FlowMapStep } from '~/lib/stores/flowMap';
import ProjectInformation from '~/components/flow-map/ProjectInformation';
import LayoutStructure from '~/components/flow-map/LayoutStructure';
import DesignSystem from '~/components/flow-map/DesignSystem';
import VisualElements from '~/components/flow-map/VisualElements';
import Functionality from '~/components/flow-map/Functionality';
import DesignSummary from '~/components/flow-map/DesignSummary';

export const meta: MetaFunction = () => {
  return [
    { title: 'Flow Map - AppFit' },
    { name: 'description', content: 'Design your project with the Flow Map visual builder' }
  ];
};

export const loader = () => json({});

export default function FlowMap() {
  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      <ClientOnly>
        {() => <FlowMapContent />}
      </ClientOnly>
    </div>
  );
}

function FlowMapContent() {
  const step = useStore(currentStep);
  
  // Render the appropriate component based on the current step
  const renderStep = () => {
    switch (step) {
      case FlowMapStep.ProjectInformation:
        return <ProjectInformation />;
      case FlowMapStep.LayoutStructure:
        return <LayoutStructure />;
      case FlowMapStep.DesignSystem:
        return <DesignSystem />;
      case FlowMapStep.VisualElements:
        return <VisualElements />;
      case FlowMapStep.Functionality:
        return <Functionality />;
      case FlowMapStep.DesignSummary:
        return <DesignSummary />;
      default:
        return <ProjectInformation />;
    }
  };
  
  return (
    <div className="flex-1 overflow-hidden">
      {renderStep()}
    </div>
  );
}
