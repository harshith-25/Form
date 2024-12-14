import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Card from './Card/Card'
import FormField from './FormField'
import Button from './Button/Button'
import FieldTypeSelector from './FieldTypeSelector'
import { GripVertical } from 'lucide-react'

interface FormSectionProps {
  section: IFormSection
  index: number
  updateSection: (index: number, updatedSection: Partial<IFormSection>) => void
  removeSection: (index: number) => void
  dragHandleProps: any
}

export interface IFormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

export interface IForm {
  _id?: string;
  title: string;
  description: string;
  fields: IFormField[];
  createdBy?: string;
  shareableLink?: string;
}

export interface IFormSection {
  id: string;
  title: string;
  fields: IFormField[];
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  index,
  updateSection,
  removeSection,
  dragHandleProps,
}) => {
  const addField = (type: string) => {
    const newField: IFormField = {
      id: `field-${section.fields.length + 1}`,
      type,
      label: `New ${type} field`,
      required: false,
    }
    updateSection(index, { fields: [...section.fields, newField] })
  }

  const updateField = (fieldIndex: number, updatedField: Partial<IFormField>) => {
    const newFields = [...section.fields]
    newFields[fieldIndex] = { ...newFields[fieldIndex], ...updatedField }
    updateSection(index, { fields: newFields })
  }

  const removeField = (fieldIndex: number) => {
    const newFields = section.fields.filter((_, i) => i !== fieldIndex)
    updateSection(index, { fields: newFields })
  }

  return (
    <Card className="mb-8 bg-gray-50 border-2 border-gray-200">
      <div className="flex items-center mb-4">
        <div {...dragHandleProps} className="cursor-move mr-2">
          <GripVertical size={24} />
        </div>
        <input
          type="text"
          value={section.title}
          onChange={(e) => updateSection(index, { title: e.target.value })}
          className="flex-grow p-2 border rounded text-xl font-semibold"
          placeholder="Section Title"
        />
        <Button onClick={() => removeSection(index)} variant="danger" className="ml-2">
          Remove Section
        </Button>
      </div>
      <Droppable droppableId={index.toString()} type="field">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
            {section.fields.map((field, fieldIndex) => (
              <Draggable key={field.id} draggableId={field.id} index={fieldIndex}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <FormField
                      field={field}
                      updateField={(updatedField) => updateField(fieldIndex, updatedField)}
                      removeField={() => removeField(fieldIndex)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <FieldTypeSelector onSelectFieldType={addField} variant="secondary" />
    </Card>
  )
}

export default FormSection