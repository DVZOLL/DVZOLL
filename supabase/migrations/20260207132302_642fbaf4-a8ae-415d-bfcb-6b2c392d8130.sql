
-- Create download_history table
CREATE TABLE public.download_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  platform TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('video', 'audio')),
  quality TEXT NOT NULL,
  is_playlist BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  download_url TEXT,
  track_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.download_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own download history
CREATE POLICY "Users can view their own downloads"
  ON public.download_history FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own downloads
CREATE POLICY "Users can create their own downloads"
  ON public.download_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own downloads
CREATE POLICY "Users can update their own downloads"
  ON public.download_history FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own downloads
CREATE POLICY "Users can delete their own downloads"
  ON public.download_history FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_download_history_updated_at
  BEFORE UPDATE ON public.download_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster user queries
CREATE INDEX idx_download_history_user_id ON public.download_history(user_id);
CREATE INDEX idx_download_history_created_at ON public.download_history(created_at DESC);
