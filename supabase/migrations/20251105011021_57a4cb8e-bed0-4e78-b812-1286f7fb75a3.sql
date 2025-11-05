-- Add missing RLS policies for data management and email protection

-- 1. Protect newsletter subscriber emails (admin-only access)
CREATE POLICY "Only admins can view newsletter subscribers"
ON newsletter_subscribers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Protect ebook download emails (admin-only access)
CREATE POLICY "Only admins can view ebook downloads"
ON ebook_downloads
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Allow users to update their own growth measurements
CREATE POLICY "Users can update measurements for their children"
ON growth_measurements
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM child_profiles
    WHERE child_profiles.id = growth_measurements.child_id
    AND child_profiles.user_id = auth.uid()
  )
);

-- 4. Allow users to delete their own growth measurements
CREATE POLICY "Users can delete measurements for their children"
ON growth_measurements
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM child_profiles
    WHERE child_profiles.id = growth_measurements.child_id
    AND child_profiles.user_id = auth.uid()
  )
);

-- 5. Allow users to delete milestones for their children
CREATE POLICY "Users can delete milestones for their children"
ON milestones
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM child_profiles
    WHERE child_profiles.id = milestones.child_id
    AND child_profiles.user_id = auth.uid()
  )
);

-- 6. Allow users to update their own quiz responses
CREATE POLICY "Users can update their own quiz responses"
ON quiz_responses
FOR UPDATE
USING (auth.uid() = user_id);

-- 7. Allow users to delete their own quiz responses
CREATE POLICY "Users can delete their own quiz responses"
ON quiz_responses
FOR DELETE
USING (auth.uid() = user_id);

-- 8. Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
ON profiles
FOR DELETE
USING (auth.uid() = id);