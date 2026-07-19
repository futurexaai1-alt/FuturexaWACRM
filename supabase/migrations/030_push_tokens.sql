-- Create table to store push notification tokens for each user device
CREATE TABLE IF NOT EXISTS public.push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('web', 'android', 'ios')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, token)
);

-- Enable RLS
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;

-- Users can only insert/read/delete their own tokens
CREATE POLICY push_tokens_select ON public.push_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY push_tokens_insert ON public.push_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY push_tokens_delete ON public.push_tokens FOR DELETE USING (auth.uid() = user_id);

-- Update updated_at trigger
CREATE OR REPLACE FUNCTION update_push_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_push_tokens_updated_at
  BEFORE UPDATE ON public.push_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_push_tokens_updated_at();
