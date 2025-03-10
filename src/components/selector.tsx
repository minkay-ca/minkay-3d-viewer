import React, { useEffect, useMemo, useState } from "react";
import { useZakeke } from "zakeke-configurator-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronDownIcon } from "./icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const Selector: React.FC = () => {
  const {
    isSceneLoading,
    groups,
    selectOption,
    templates,
    setTemplate,
    setCamera,
  } = useZakeke();

  // Keep saved the ID and not the references, they will change on each update
  const [selectedGroupId, selectGroup] = useState<number | null>(null);
  const [selectedStepId, selectStep] = useState<number | null>(null);
  const [selectedAttributeId, selectAttribute] = useState<number | null>(null);

  const selectedGroup = groups.find((group) => group.id === selectedGroupId);
  const selectedStep = selectedGroup
    ? selectedGroup.steps.find((step) => step.id === selectedStepId)
    : null;

  // Attributes can be in both groups and steps, so show the attributes of step or in a group based on selection
  const attributes = useMemo(
    () => (selectedStep || selectedGroup)?.attributes ?? [],
    [selectedGroup, selectedStep]
  );
  const selectedAttribute = attributes.find(
    (attribute) => attribute.id === selectedAttributeId
  );

  // Open the first group and the first step when loaded
  useEffect(() => {
    if (!selectedGroup && groups.length > 0) {
      selectGroup(groups[0].id);

      if (groups[0].steps.length > 0) selectStep(groups[0].steps[0].id);

      if (templates.length > 0) setTemplate(templates[0].id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup, groups]);

  // Select attribute first time
  useEffect(() => {
    if (!selectedAttribute && attributes.length > 0)
      selectAttribute(attributes[0].id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttribute, attributes]);

  useEffect(() => {
    if (selectedGroup) {
      const camera = selectedGroup.cameraLocationId;
      if (camera) setCamera(camera);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroupId]);

  if (isSceneLoading || !groups || groups.length === 0)
    return (
      <span className="text-sm text-muted-foreground animate-pulse">
        Loading scene...
      </span>
    );

  // Current selected names for dropdown labels
  const selectedGroupName = selectedGroup
    ? selectedGroup.id === -1
      ? "Other"
      : selectedGroup.name
    : "Select a group";
  const selectedAttributeName = selectedAttribute
    ? selectedAttribute.name
    : "Select an attribute";

  return (
    <div className="space-y-6 p-1">
      <div className="text-xl font-semibold border-b pb-2 mb-4">
        Customize Product
      </div>

      {/* Only show groups dropdown if there's more than one group */}
      {groups.length > 1 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Group</h3>
          <Select
            value={selectedGroupId?.toString()}
            onValueChange={(value) => selectGroup(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a group" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.id === -1 ? "Other" : group.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Steps accordion, only show if there are steps available */}
      {selectedGroup && selectedGroup.steps.length > 0 && (
        <Accordion
          type="single"
          collapsible
          defaultValue="steps"
          className="border rounded-md"
        >
          <AccordionItem value="steps">
            <AccordionTrigger className="px-4">Steps</AccordionTrigger>
            <AccordionContent className="px-4 pt-2 pb-3">
              <div className="flex flex-wrap gap-2">
                {selectedGroup.steps.map((step) => (
                  <Badge
                    key={step.id}
                    variant={selectedStep === step ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => selectStep(step.id)}
                  >
                    {step.name}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Attributes dropdown */}
      {attributes.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Attributes</h3>
          <Select
            value={selectedAttributeId?.toString()}
            onValueChange={(value) => selectAttribute(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an attribute" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {attributes.map((attribute) => (
                  <SelectItem
                    key={attribute.id}
                    value={attribute.id.toString()}
                  >
                    {attribute.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Options dropdown */}
      {selectedAttribute && selectedAttribute.options.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">
            Options for {selectedAttribute.name}
          </h3>
          <Select
            value={
              selectedAttribute.options
                .find((opt) => opt.selected)
                ?.id.toString() || ""
            }
            onValueChange={(value) => selectOption(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {selectedAttribute.options.map((option) => (
                  <SelectItem key={option.id} value={option.id.toString()}>
                    <div className="flex items-center">
                      {option.imageUrl && (
                        <div className="w-6 h-6 mr-2 overflow-hidden rounded-sm">
                          <img
                            src={option.imageUrl}
                            alt={option.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <span>{option.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default Selector;
