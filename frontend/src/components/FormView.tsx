import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

const FormView: React.FC = () => {
  const [form, setForm] = useState<IForm | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const { shareableLink } = useParams<{ shareableLink: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchForm = async () => {
      const response = await fetch(`http://localhost:5000/api/forms/share/${shareableLink}`)
      const data = await response.json()
      setForm(data)
    }
    fetchForm()
  }, [shareableLink])

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return

    const response = await fetch('http://localhost:5000/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formId: form._id,
        data: formData,
      }),
    })

    if (response.ok) {
      alert('Form submitted successfully!')
      navigate('/')
    } else {
      alert('Error submitting form')
    }
  }

  if (!form) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{form.title}</h1>
      <p className="mb-4">{form.description}</p>
      <form onSubmit={handleSubmit}>
        {form.fields.map((field: IFormField, index: number) => (
          <div key={index} className="mb-4">
            <label className="block mb-2">{field.label}</label>
            {field.type === 'text' && (
              <input
                type="text"
                required={field.required}
                onChange={(e) => handleInputChange(field.label, e.target.value)}
                className="w-full p-2 border rounded"
              />
            )}
            {field.type === 'number' && (
              <input
                type="number"
                required={field.required}
                onChange={(e) => handleInputChange(field.label, e.target.value)}
                className="w-full p-2 border rounded"
              />
            )}
            {field.type === 'date' && (
              <input
                type="date"
                required={field.required}
                onChange={(e) => handleInputChange(field.label, e.target.value)}
                className="w-full p-2 border rounded"
              />
            )}
            {field.type === 'checkbox' && (
              <input
                type="checkbox"
                required={field.required}
                onChange={(e) => handleInputChange(field.label, e.target.checked)}
              />
            )}
            {field.type === 'select' && (
              <select
                required={field.required}
                onChange={(e) => handleInputChange(field.label, e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select an option</option>
                {field.options?.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {field.type === 'radio' && (
              <div>
                {field.options?.map((option, i) => (
                  <label key={i} className="block">
                    <input
                      type="radio"
                      name={field.label}
                      value={option}
                      required={field.required}
                      onChange={(e) => handleInputChange(field.label, e.target.value)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  )
}

export default FormView;