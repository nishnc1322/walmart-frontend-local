-- Add agent relationships and cluster management
CREATE TABLE IF NOT EXISTS agent_clusters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  cluster_type VARCHAR(50) DEFAULT 'single' CHECK (cluster_type IN ('single', 'multi')),
  is_master BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add cluster relationships
CREATE TABLE IF NOT EXISTS agent_cluster_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cluster_id UUID REFERENCES agent_clusters(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  role VARCHAR(100),
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cluster_id, agent_id)
);

-- Add cluster to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS cluster_id UUID REFERENCES agent_clusters(id);

-- Create the master Knocker cluster
INSERT INTO agent_clusters (name, description, cluster_type, is_master) VALUES
('Knocker', 'Master Multi-Agent Cluster that coordinates and routes requests to all single agent clusters', 'multi', true);

-- Create single agent clusters for existing agents
INSERT INTO agent_clusters (name, description, cluster_type, is_master)
SELECT 
  name || ' Cluster',
  'Single Agent Cluster for ' || name,
  'single',
  false
FROM agents
WHERE is_active = true;

-- Link agents to their clusters
UPDATE agents 
SET cluster_id = (
  SELECT ac.id 
  FROM agent_clusters ac 
  WHERE ac.name = agents.name || ' Cluster'
)
WHERE is_active = true;

-- Add the master cluster relationships
INSERT INTO agent_cluster_members (cluster_id, agent_id, role, priority)
SELECT 
  (SELECT id FROM agent_clusters WHERE is_master = true),
  a.id,
  'coordinator',
  1
FROM agents a
WHERE a.is_active = true;
