import React from 'react'
import { Type, Hash, Calendar, CheckSquare, List, Radio } from 'lucide-react'
import Button from './Button/Button'

interface FieldTypeSelectorProps {
  onSelectFieldType: (type: string) => void
  variant?: 'primary' | 'secondary' | 'danger'
}

const FieldTypeSelector: React.FC<FieldTypeSelectorProps> = ({ onSelectFieldType, variant = 'primary' }) => {
  const fieldTypes = [
    { type: 'text', icon: Type, label: 'Text' },
    { type: 'number', icon: Hash, label: 'Number' },
    { type: 'date', icon: Calendar, label: 'Date' },
    { type: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
    { type: 'select', icon: List, label: 'Dropdown' },
    { type: 'radio', icon: Radio, label: 'Radio' },
  ]

  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
      {fieldTypes.map(({ type, icon: Icon, label }) => (
        <Button
          key={type}
          onClick={() => onSelectFieldType(type)}
          className="flex items-center justify-center py-2 px-3"
          variant={variant}
        >
          <Icon size={20} className="mr-2" />
          {label}
        </Button>
      ))}
    </div>
  )
}

export default FieldTypeSelector