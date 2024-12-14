import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export interface IFormField {
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface IForm {
  _id: string;
  title: string;
  description: string;
  fields: IFormField[];
  createdBy: string;
  shareableLink: string;
}

const FormBuilder: React.FC = () => {
  const [form, setForm] = useState<IForm>({
    _id: '',
    title: '',
    description: '',
    fields: [],
    createdBy: '123', // Replace with actual user ID
    shareableLink: '',
  })
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      const fetchForm = async () => {
        const response = await fetch(`http://localhost:5000/api/forms/${id}`)
        const data = await response.json()
        setForm(data)
      }
      fetchForm()
    }
  }, [id])

  const addField = (type: string) => {
    const newField: IFormField = {
      type,
      label: `New ${type} field`,
      required: false,
    }
    setForm({ ...form, fields: [...form.fields, newField] })
  }

  const updateField = (index: number, updatedField: IFormField) => {
    const newFields = [...form.fields]
    newFields[index] = updatedField
    setForm({ ...form, fields: newFields })
  }

  const removeField = (index: number) => {
    const newFields = form.fields.filter((_, i) => i !== index)
    setForm({ ...form, fields: newFields })
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const newFields = Array.from(form.fields)
    const [reorderedItem] = newFields.splice(result.source.index, 1)
    newFields.splice(result.destination.index, 0, reorderedItem)

    setForm({ ...form, fields: newFields })
  }

  const handleSave = async () => {
    const url = id
      ? `http://localhost:5000/api/forms/${id}`
      : 'http://localhost:5000/api/forms'
    const method = id ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })

    if (response.ok) {
      navigate('/')
    } else {
      alert('Error saving form')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{id ? 'Edit Form' : 'Create New Form'}</h1>
      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Form Title"
        className="w-full p-2 mb-4 border rounded"
      />
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Form Description"
        className="w-full p-2 mb-4 border rounded"
      />
      <div className="mb-4">
        <button onClick={() => addField('text')} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Add Text Field</button>
        <button onClick={() => addField('number')} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Add Number Field</button>
        <button onClick={() => addField('date')} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Add Date Field</button>
        <button onClick={() => addField('checkbox')} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Add Checkbox</button>
        <button onClick={() => addField('select')} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Add Dropdown</button>
        <button onClick={() => addField('radio')} className="bg-blue-500 text-white px-2 py-1 rounded">Add Radio Buttons</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {form.fields.map((field, index) => (
                <Draggable key={index} draggableId={`field-${index}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="border p-4 mb-2 bg-white"
                    >
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(index, { ...field, label: e.target.value })}
                        className="mb-2 w-full p-2 border rounded"
                      />
                      <div className="flex items-center mb-2">
                        <label className="mr-2">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(index, { ...field, required: e.target.checked })}
                          />
                          Required
                        </label>
                        {(field.type === 'select' || field.type === 'radio') && (
                          <input
                            type="text"
                            value={field.options?.join(', ') || ''}
                            onChange={(e) => updateField(index, { ...field, options: e.target.value.split(',').map(s => s.trim()) })}
                            placeholder="Options (comma-separated)"
                            className="ml-2 p-2 border rounded flex-grow"
                          />
                        )}
                      </div>
                      <button onClick={() => removeField(index)} className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={handleSave} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Save Form</button>
    </div>
  )
}

export default FormBuilder;