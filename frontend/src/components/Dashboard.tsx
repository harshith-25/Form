import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

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

const Dashboard: React.FC = () => {
  const [forms, setForms] = useState<IForm[]>([])

  useEffect(() => {
    const fetchForms = async () => {
      const response = await fetch('http://localhost:5000/api/forms/user/123') // Replace 123 with actual user ID
      const data = await response.json()
      setForms(data)
    }
    fetchForms()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Your Forms</h1>
      <Link to="/form/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
        Create New Form
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms.map((form) => (
          <div key={form._id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{form.title}</h2>
            <p className="text-gray-600 mb-4">{form.description}</p>
            <div className="flex space-x-2">
              <Link to={`/form/${form._id}`} className="text-blue-500 hover:text-blue-700">
                Edit
              </Link>
              <Link to={`/form/${form._id}/submissions`} className="text-green-500 hover:text-green-700">
                View Submissions
              </Link>
              <Link to={`/share/${form.shareableLink}`} className="text-purple-500 hover:text-purple-700">
                Share
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard;