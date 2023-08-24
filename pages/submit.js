// submit.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/submit.module.css';

export default function Submit() {
  const router = useRouter();
  const templateId = router.query.templateId;

  const [templateSource, setTemplateSource] = useState('');
  const [variables, setVariables] = useState([]);
  const [formData, setFormData] = useState({});
  const [generatedTemplate, setGeneratedTemplate] = useState('');
  const [showCreateButton, setShowCreateButton] = useState(false);

  useEffect(() => {
    if (templateId) {
      fetchTemplateSource(templateId);
    }
  }, [templateId]);

  async function fetchTemplateSource(id) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/site/template/${id}/`);
      const data = await response.json();
      setTemplateSource(data.source);
      extractVariablesFromTemplate(data.source);
    } catch (error) {
      console.error('Error fetching template source:', error);
    }
  }

  function extractVariablesFromTemplate(source) {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [...source.matchAll(regex)];
    const variables = matches.map((match) => match[1].trim());
    setVariables(variables);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submitted data:', formData);

    let updatedTemplate = templateSource;
    variables.forEach((variable) => {
      updatedTemplate = updatedTemplate.replace(`{{${variable}}}`, formData[variable] || '');
    });

    setGeneratedTemplate(updatedTemplate);
    setShowCreateButton(true);
  };
  
  const handleCreateSite = () => {
    // Send updatedTemplate to the BE API with the selected template id
    sendTemplateToBackend(generatedTemplate);
  };

  async function sendTemplateToBackend(updatedTemplate) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/site/create/${templateId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updatedTemplate }),
      });
      // Handle the response from the BE API
      console.log('Template updated:', response);
    } catch (error) {
      console.error('Error updating template:', error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        {!showCreateButton && (
          <div>
            <h2>Fill in the Details</h2>
            <form onSubmit={handleSubmit}>
              {variables.map((variable, index) => (
                <div className={styles.inputField} key={index}>
                  <label>
                    {variable}:
                    <input
                      type="text"
                      value={formData[variable] || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, [variable]: e.target.value })
                      }
                    />
                  </label>
                </div>
              ))}
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
      </div>
      <div
        className={`${styles.previewContainer} ${showCreateButton ? styles.centerPreview : ''}`}
        style={{
          width: showCreateButton ? '100%' : '66.66%',
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: showCreateButton ? generatedTemplate : templateSource }} />
        {showCreateButton && (
          <button className={styles.createButton} onClick={handleCreateSite}>
            Create Site
          </button>
        )}
      </div>
    </div>

  );
}
