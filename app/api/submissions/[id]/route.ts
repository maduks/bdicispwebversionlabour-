import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    // Call your backend API to update the submission
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://ministryoflabourbackend.vercel.app/api/v1'}/submissions/${id}`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
} 