import React from "react";
import { 
  FileText, 
  BrainCircuit, 
  CheckSquare, 
  Hammer, 
  TrendingUp 
} from "lucide-react";
import { processSteps } from "../data/home.data";

export function ProcessFlow() {
  const getStepIcon = (iconName: string) => {
    const iconProps = { className: "w-5 h-5 text-rose-600 stroke-[1.75]" };
    switch (iconName) {
      case "FileText":
        return <FileText {...iconProps} />;
      case "BrainCircuit":
        return <BrainCircuit {...iconProps} />;
      case "CheckSquare":
        return <CheckSquare {...iconProps} />;
      case "Hammer":
        return <Hammer {...iconProps} />;
      case "TrendingUp":
        return <TrendingUp {...iconProps} />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  return (
    <section className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 bg-neutral-50/50 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center sm:text-left mb-10 sm:mb-16">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-600 uppercase block mb-1.5 sm:mb-2">
            HOW IT WORKS
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
            Simple Process. Smooth Experience.
          </h2>
        </div>

        {/* 1. Desktop & Tablet Mode: 5 Steps in a Connected Horizontal Line */}
        <div className="hidden sm:block relative">
          {/* Horizontal Dashed Connector Line */}
          <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 border-t-2 border-dashed border-rose-200 pointer-events-none z-0" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 relative z-10">
            {processSteps.map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center group">
                {/* Number & Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-rose-100 group-hover:border-rose-500 shadow-md flex items-center justify-center mb-4 sm:mb-5 transition-all duration-300 group-hover:scale-110">
                  {getStepIcon(step.iconName)}
                </div>

                <span className="text-[11px] sm:text-xs font-bold text-rose-600 tracking-wider mb-1 font-mono">
                  {step.step}
                </span>

                <h3 className="text-sm sm:text-base font-bold text-neutral-900 mb-1 sm:mb-2 group-hover:text-rose-600 transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-neutral-500 leading-relaxed max-w-[180px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Mobile Mode: Clean Straight Vertical Line Timeline */}
        <div className="sm:hidden relative pl-4 space-y-6">
          {/* Straight Vertical Connector Line running through all 5 steps */}
          <div className="absolute top-6 bottom-6 left-[38px] w-0.5 border-l-2 border-dashed border-rose-300 pointer-events-none z-0" />

          {processSteps.map((step) => (
            <div
              key={step.step}
              className="relative flex items-start gap-4 z-10"
            >
              {/* Step Icon Badge */}
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-rose-200 shadow-sm flex items-center justify-center shrink-0">
                {getStepIcon(step.iconName)}
              </div>

              {/* Step Card Content */}
              <div className="flex-1 bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-rose-600 font-mono tracking-wider">
                    STEP {step.step}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-neutral-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
