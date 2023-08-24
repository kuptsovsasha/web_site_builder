// template.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './template.module.css';

export default function Template() {
  const [templates, setTemplates] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const response = await fetch('http://127.0.0.1:8000/site/templates/');
      const data = await response.json();
      setTemplates(data.results);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  }

  const handleTemplateClick = (templateId) => {
    router.push(`/submit?templateId=${templateId}`);
  };

  return (
    <div className={styles.container}>
      {templates.map((template) => (
        <div className={styles.templateContainer} key={template.id}>
          <div dangerouslySetInnerHTML={{ __html: template.source }} />
          <button
            className={styles.chooseButton}
            onClick={() => handleTemplateClick(template.id)}
          >
            Choose
          </button>
        </div>
      ))}
    </div>
  );
}
