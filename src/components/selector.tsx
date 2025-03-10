import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useZakeke } from "zakeke-configurator-react";
import { List, ListItem, ListItemImage } from "./list";
import { ChevronDownIcon } from "./icons";

// Reusable dropdown component
interface DropdownProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Dropdown: FunctionComponent<DropdownProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden mb-3">
      <div
        className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-medium">{title}</div>
        <ChevronDownIcon
          className={`h-5 w-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && <div className="p-2 border-t border-gray-200">{children}</div>}
    </div>
  );
};

const Selector: FunctionComponent<{}> = () => {
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
    return <span>Loading scene...</span>;

  // Current selected names for dropdown titles
  const selectedGroupName = selectedGroup
    ? selectedGroup.id === -1
      ? "Other"
      : selectedGroup.name
    : "Select a group";
  const selectedStepName = selectedStep ? selectedStep.name : "Select a step";
  const selectedAttributeName = selectedAttribute
    ? selectedAttribute.name
    : "Select an attribute";
  const selectedOptionName =
    selectedAttribute?.options.find((o) => o.selected)?.name ||
    "Select an option";

  return (
    <div className="space-y-4">
      <div className="font-medium text-lg border-b pb-2 mb-4">
        Customize Product
      </div>

      {/* Only show groups dropdown if there's more than one group */}
      {groups.length > 1 && (
        <Dropdown title={`Group: ${selectedGroupName}`} defaultOpen={true}>
          <List>
            {groups.map((group) => (
              <ListItem
                key={group.id}
                onClick={() => selectGroup(group.id)}
                selected={selectedGroup === group}
              >
                {group.id === -1 ? "Other" : group.name}
              </ListItem>
            ))}
          </List>
        </Dropdown>
      )}

      {/* Steps dropdown, only show if there are steps available */}
      {selectedGroup && selectedGroup.steps.length > 0 && (
        <Dropdown title={`Step: ${selectedStepName}`} defaultOpen={true}>
          <List>
            {selectedGroup.steps.map((step) => (
              <ListItem
                key={step.id}
                onClick={() => selectStep(step.id)}
                selected={selectedStep === step}
              >
                {step.name}
              </ListItem>
            ))}
          </List>
        </Dropdown>
      )}

      {/* Attributes dropdown */}
      {attributes.length > 0 && (
        <Dropdown
          title={`Attribute: ${selectedAttributeName}`}
          defaultOpen={true}
        >
          <List>
            {attributes.map((attribute) => (
              <ListItem
                key={attribute.id}
                onClick={() => selectAttribute(attribute.id)}
                selected={selectedAttribute === attribute}
              >
                {attribute.name}
              </ListItem>
            ))}
          </List>
        </Dropdown>
      )}

      {/* Options dropdown */}
      {selectedAttribute && selectedAttribute.options.length > 0 && (
        <Dropdown title={`Option: ${selectedOptionName}`} defaultOpen={true}>
          <List>
            {selectedAttribute.options.map((option) => (
              <ListItem
                key={option.id}
                onClick={() => selectOption(option.id)}
                selected={option.selected}
              >
                {option.imageUrl && <ListItemImage src={option.imageUrl} />}
                {option.name}
              </ListItem>
            ))}
          </List>
        </Dropdown>
      )}
    </div>
  );
};

export default Selector;
