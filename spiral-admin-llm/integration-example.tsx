// Integration example for adding AdminAbout to SPIRAL platform
// Add this to your main About page component

import React from 'react';
import { AdminAbout } from '../src/components/AdminAbout';

// Option 1: Replace existing about page content
export const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <AdminAbout adminLlmUrl="http://localhost:3000" />
    </div>
  );
};

// Option 2: Add as a section to existing about page
export const ExistingAboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Your existing about content */}
      <section className="mb-12">
        <h1>Welcome to SPIRAL</h1>
        {/* ... other content ... */}
      </section>

      {/* Add Admin LLM powered about section */}
      <section>
        <AdminAbout adminLlmUrl={process.env.REACT_APP_ADMIN_LLM_URL || "http://localhost:3000"} />
      </section>
    </div>
  );
};

// Option 3: Fetch content directly in existing component
export const SimpleIntegration: React.FC = () => {
  const [adminAbout, setAdminAbout] = React.useState('');

  React.useEffect(() => {
    fetch('http://localhost:3000/about')
      .then(res => res.text())
      .then(content => setAdminAbout(content))
      .catch(() => setAdminAbout('SPIRAL: The Local Shopping Platform'));
  }, []);

  return (
    <div className="prose prose-slate max-w-none">
      <div dangerouslySetInnerHTML={{ __html: adminAbout.replace(/\n/g, '<br>') }} />
    </div>
  );
};