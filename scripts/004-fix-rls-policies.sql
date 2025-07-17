-- 1) Drop the mutually-recursive policies
DROP POLICY IF EXISTS "Users can view agents they have access to" ON agents;
DROP POLICY IF EXISTS "Agent creators can manage access" ON user_agent_access;

-- 2) Create a non-recursive, safe replacement
--    Every signed-in user can read active agents they created
--    or that are flagged public (is_active = true).
--    (Adjust to your needs later.)
CREATE POLICY "Users can read active or own agents" ON agents
  FOR SELECT USING (
    is_active
    OR created_by = auth.uid()
  );
