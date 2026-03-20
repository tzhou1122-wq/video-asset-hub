/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layout } from './components/Layout';
import { AssetManagement } from './pages/AssetManagement';
import { DataDashboard } from './pages/DataDashboard';
import { useAppStore } from './store';

export default function App() {
  const { activeTab } = useAppStore();

  return (
    <Layout>
      {activeTab === 'assets' ? <AssetManagement /> : <DataDashboard />}
    </Layout>
  );
}

