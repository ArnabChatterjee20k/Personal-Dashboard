import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { PullRequests } from './pages/PullRequests';

type TabType = 'dashboard' | 'pull-requests';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('pull-requests');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'pull-requests' && <PullRequests />}
    </Layout>
  );
}

export default App;