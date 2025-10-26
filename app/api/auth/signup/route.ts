import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Email and password are required', status_code: 400 },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Password must be at least 8 characters', status_code: 400 },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'Conflict', message: 'User already exists', status_code: 409 },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Bad Request', message: error.message, status_code: 400 },
        { status: 400 }
      );
    }

    if (data.user && full_name) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name,
      });
    }

    return NextResponse.json(
      {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        token_type: 'Bearer',
        expires_in: data.session?.expires_in || 3600,
        user: {
          id: data.user?.id,
          email: data.user?.email,
          created_at: data.user?.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred', status_code: 500 },
      { status: 500 }
    );
  }
}
