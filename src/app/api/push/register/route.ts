import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { token, platform } = body;

    if (!token || !platform) {
      return NextResponse.json(
        { error: 'token and platform are required' },
        { status: 400 }
      );
    }

    if (!['web', 'android', 'ios'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      );
    }

    // Upsert the token
    const { error: upsertError } = await supabase
      .from('push_tokens')
      .upsert(
        {
          user_id: user.id,
          token,
          platform,
        },
        { onConflict: 'user_id, token' }
      );

    if (upsertError) {
      console.error('Error saving push token:', upsertError);
      return NextResponse.json(
        { error: 'Failed to save token' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Push token registration error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'token is required' }, { status: 400 });
    }

    const { error: deleteError } = await supabase
      .from('push_tokens')
      .delete()
      .eq('user_id', user.id)
      .eq('token', token);

    if (deleteError) {
      console.error('Error deleting push token:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete token' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Push token deletion error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
