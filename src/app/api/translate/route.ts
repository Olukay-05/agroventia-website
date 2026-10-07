// src/app/api/translate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { translateText } from '@/lib/translation/translator';

const RequestSchema = z.object({
  text: z.string().min(1, 'Source text cannot be empty'),
  context: z.string().optional(),
  forceFresh: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = RequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request payload',
          details: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { text, context, forceFresh } = parsed.data;

    const result = await translateText({
      text,
      context,
      forceFresh,
    });

    return NextResponse.json({
      success: true,
      provider: result.provider || 'local-dictionary',
      model: result.model || 'deterministic-fallback',
      cached: !!result.cached,
      data: {
        fr: result.fr,
        esp: result.esp,
      },
    });
  } catch (err: any) {
    console.error('[API /api/translate] Unhandled translation error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Translation processing failed',
        message: err.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
