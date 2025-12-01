import { createClient } from '@/lib/supabase/client';

export async function uploadAvatar(
  file: File,
  userId: string,
): Promise<string> {
  const supabase = createClient();

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    throw new Error('Failed to upload avatar');
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(filePath);

  return publicUrl;
}
