"use client";

import { usePlantUML } from "@/contexts/plantuml-context";
import { PlantUMLPreview } from "@/components/plantuml-preview";
import { PlantUMLDefinitionCard } from "@/components/plantuml-definition-card";

export function PlantUMLWorkspace() {
    const { definition, clearDefinition, setDefinition } = usePlantUML();

    return (
        <div className="flex flex-col h-full gap-1">
            <div className="flex-1 min-h-0">
                <PlantUMLPreview definition={definition} onReset={clearDefinition} />
            </div>
            <div className="h-52">
                <PlantUMLDefinitionCard
                    definition={definition}
                    onDefinitionChange={setDefinition}
                />
            </div>
        </div>
    );
}
