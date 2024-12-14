import React, { useState } from 'react'
import Card from './Card/Card'
import Button from './Button/Button'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

export interface IFormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface FormFieldProps {
  field: IFormField
  updateField: (updatedField: Partial<IFormField>) => void
  removeField: () => void
}

const FormField: React.FC<FormFieldProps> = ({ field, updateField, removeField }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(field.options || [])]
    newOptions[index] = value
    updateField({ options: newOptions })
  }

  const addOption = () => {
    updateField({ options: [...(field.options || []), ''] })
  }

  const removeOption = (index: number) => {
    const newOptions = field.options?.filter((_, i) => i !== index)
    updateField({ options: newOptions })
  }

  return (
    <Card className="mb-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
        <input
          type="text"
          value={field.label}
          onChange={(e) => updateField({ label: e.target.value })}
          className="flex-grow p-2 border rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
          placeholder="Field Label"
        />
        <div className="relative w-full sm:w-auto">
          <button
            onClick={toggleDropdown}
            className="w-full sm:w-auto bg-white border rounded p-2 flex items-center justify-between"
          >
            {field.type}
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {isOpen && (
            <div className="absolute z-10 w-full bg-white border rounded mt-1 shadow-lg">
              {['text', 'number', 'date', 'checkbox', 'select', 'radio'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    updateField({ type })
                    setIsOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => updateField({ required: e.target.checked })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Required</span>
        </label>
      </div>
      {(field.type === 'select' || field.type === 'radio') && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Options</h4>
          {field.options?.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-grow p-2 border rounded mr-2"
                placeholder={`Option ${index + 1}`}
              />
              <Button onClick={() => removeOption(index)} variant="danger" className="p-2">
                <X size={20} />
              </Button>
            </div>
          ))}
          <Button onClick={addOption} variant="secondary" className="mt-2">
            Add Option
          </Button>
        </div>
      )}
      <div className="flex justify-end">
        <Button onClick={removeField} variant="danger">
          Remove Field
        </Button>
      </div>
    </Card>
  )
}

export default FormField