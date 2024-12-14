import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export interface ISubmission {
  _id: string;
  formId: string;
  data: Record<string, any>;
  createdAt: string;
}

const SubmissionsView: React.FC = () => {
  const [submissions, setSubmissions] = useState<ISubmission[]>([])
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    const fetchSubmissions = async () => {
      const response = await fetch(`http://localhost:5000/api/submissions/form/${id}`)
      const data = await response.json()
      setSubmissions(data)
    }
    fetchSubmissions()
  }, [id])

  const handleExport = async () => {
    const response = await fetch(`http://localhost:5000/api/submissions/export/${id}`)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `form_${id}_submissions.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Form Submissions</h1>
      <button onClick={handleExport} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
        Export as CSV
      </button>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Submission ID</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Data</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission._id}>
              <td className="border p-2">{submission._id}</td>
              <td className="border p-2">{new Date(submission.createdAt).toLocaleString()}</td>
              <td className="border p-2">
                <pre>{JSON.stringify(submission.data, null, 2)}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SubmissionsView;