CREATE POLICY "Users read own cloud files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'cloud-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users upload own cloud files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cloud-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own cloud files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'cloud-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own cloud files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'cloud-files' AND auth.uid()::text = (storage.foldername(name))[1]);