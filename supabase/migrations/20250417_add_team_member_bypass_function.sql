
-- Function to add team members while bypassing RLS
CREATE OR REPLACE FUNCTION public.add_team_member_bypass(
  p_team_name TEXT,
  p_role TEXT,
  p_email TEXT,
  p_name TEXT,
  p_avatar_url TEXT DEFAULT NULL
) 
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_member_id uuid;
BEGIN
  INSERT INTO public.team_members (
    team_name,
    role,
    email,
    invited,
    avatar_url
  ) VALUES (
    p_team_name,
    p_role,
    p_email,
    TRUE,
    p_avatar_url
  )
  RETURNING id INTO new_member_id;
  
  RETURN new_member_id;
END;
$$;
