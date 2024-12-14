import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IForm } from '../../types/form';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const Dashboard: React.FC = () => {
  const [forms, setForms] = useState<IForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setIsLoading(true);
        // Replace '123' with actual user ID or authentication mechanism
        const response = await fetch('http://localhost:5000/api/forms/user/123');
        if (!response.ok) {
          throw new Error('Failed to fetch forms');
        }
        const data = await response.json();
        setForms(data);
      } catch (err) {
        setError('Error fetching forms. Please try again.');
        console.error('Error fetching forms:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchForms();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Forms</h1>
        <Link to="/form/new">
          <Button>Create New Form</Button>
        </Link>
      </div>
      {forms.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">You haven't created any forms yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{form.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{form.description}</p>
              <div className="flex space-x-4">
                <Link to={`/form/${form._id}`} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Edit
                </Link>
                <Link to={`/form/${form._id}/submissions`} className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                  View Submissions
                </Link>
                <Link to={`/share/${form.shareableLink}`} className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
                  Share
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;