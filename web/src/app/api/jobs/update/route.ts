import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Client } from '@notionhq/client';
import { handleApiError, AppError } from '@/lib/errors';

const UpdateJobSchema = z.object({
  id: z.string().min(1, 'Job ID is required'),
  status: z.string().min(1, 'Status is required')
});

export async function POST(req: Request) {
  try {
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      throw new AppError('Notion API integration is not configured in this environment.', 400, 'NOTION_NOT_CONFIGURED');
    }

    const body = await req.json().catch(() => null);
    const { id, status } = UpdateJobSchema.parse(body);

    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    // Update the Notion page
    await notion.pages.update({
      page_id: id,
      properties: {
        Status: {
          select: {
            name: status
          }
        }
      }
    });

    return NextResponse.json({ success: true, id, status });
  } catch (err) {
    return handleApiError(err);
  }
}
