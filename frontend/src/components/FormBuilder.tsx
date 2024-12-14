import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Button from './Button/Button'
import FormSection from './FormSection'
import { Plus, Save } from 'lucide-react'

export interface IFormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

export interface IFormSection {
  id: string;
  title: string;
  fields: IFormField[];
}

export interface IForm {
  _id: string;
  title: string;
  description: string;
  sections: IFormSection[];
  createdBy: string;
  shareableLink: string;
}

const FormBuilder: React.FC = () => {
  const [form, setForm] = useState<IForm>({
    _id: '',
    title: '',
    description: '',
    sections: [
      {
        id: 'section-1',
        title: 'Section 1',
        fields: [],
      },
    ],
    createdBy: '123', // Replace with actual user ID
    shareableLink: '',
  })
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      const fetchForm = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/forms/${id}`)
          if (!response.ok) {
            throw new Error('Failed to fetch form')
          }
          const data = await response.json()
          // Ensure sections exist and have at least one section
          const formWithSections = {
            ...data,
            sections: data.sections && data.sections.length > 0 
              ? data.sections 
              : [{ id: 'section-1', title: 'Section 1', fields: [] }]
          }
          setForm(formWithSections)
        } catch (error) {
          console.error('Error fetching form:', error)
          // Optionally show error to user
        }
      }
      fetchForm()
    }
  }, [id])

  const addSection = () => {
    const newSection: IFormSection = {
      id: `section-${(form.sections?.length || 0) + 1}`,
      title: `Section ${(form.sections?.length || 0) + 1}`,
      fields: [],
    }
    setForm({ 
      ...form, 
      sections: [...(form.sections || []), newSection] 
    })
  }

  const updateSection = (sectionIndex: number, updatedSection: Partial<IFormSection>) => {
    if (!form.sections) return

    const newSections = [...form.sections]
    newSections[sectionIndex] = { ...newSections[sectionIndex], ...updatedSection }
    setForm({ ...form, sections: newSections })
  }

  const removeSection = (sectionIndex: number) => {
    if (!form.sections) return

    const newSections = form.sections.filter((_, i) => i !== sectionIndex)
    setForm({ ...form, sections: newSections })
  }

  const onDragEnd = (result: any) => {
    if (!form.sections) return

    const { source, destination, type } = result

    if (!destination) return

    if (type === 'section') {
      const newSections = Array.from(form.sections)
      const [reorderedSection] = newSections.splice(source.index, 1)
      newSections.splice(destination.index, 0, reorderedSection)
      setForm({ ...form, sections: newSections })
    } else if (type === 'field') {
      const sourceSection = form.sections[parseInt(source.droppableId)]
      const destSection = form.sections[parseInt(destination.droppableId)]

      const newSourceFields = Array.from(sourceSection.fields || [])
      const [reorderedField] = newSourceFields.splice(source.index, 1)

      if (source.droppableId !== destination.droppableId) {
        const newDestFields = Array.from(destSection.fields || [])
        newDestFields.splice(destination.index, 0, reorderedField)

        const newSections = form.sections.map((section, index) => {
          if (index === parseInt(source.droppableId)) {
            return { ...section, fields: newSourceFields }
          }
          if (index === parseInt(destination.droppableId)) {
            return { ...section, fields: newDestFields }
          }
          return section
        })

        setForm({ ...form, sections: newSections })
      } else {
        newSourceFields.splice(destination.index, 0, reorderedField)
        const newSections = form.sections.map((section, index) => {
          if (index === parseInt(source.droppableId)) {
            return { ...section, fields: newSourceFields }
          }
          return section
        })

        setForm({ ...form, sections: newSections })
      }
    }
  }

  const handleSave = async () => {
    try {
      const url = id
        ? `http://localhost:5000/api/forms/${id}`
        : 'http://localhost:5000/api/forms'
      const method = id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          sections: form.sections || [] // Ensure sections is an array
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save form')
      }

      navigate('/')
    } catch (error) {
      console.error('Error saving form:', error)
      alert('Error saving form')
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{id ? 'Edit Form' : 'Create New Form'}</h1>
      <div className="mb-6 space-y-4">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Form Title"
          className="w-full p-2 border rounded text-2xl font-semibold"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Form Description"
          className="w-full p-2 border rounded h-24 resize-none"
        />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections" type="section">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
              {(form.sections || []).map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <FormSection
                        key={section.id}
                        section={section}
                        index={index}
                        updateSection={updateSection}
                        removeSection={removeSection}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="mt-6 flex justify-between">
        <Button onClick={addSection} className="flex items-center">
          <Plus size={20} className="mr-2" />
          Add Section
        </Button>
        <Button onClick={handleSave} className="flex items-center">
          <Save size={20} className="mr-2" />
          Save Form
        </Button>
      </div>
    </div>
  )
}

export default FormBuilder