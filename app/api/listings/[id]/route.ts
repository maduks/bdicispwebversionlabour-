import { NextResponse } from 'next/server';
import { listings } from '../../../data/listings';

// GET /api/listings/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const listing = listings.find(item => item.id.toString() === params.id);
  
  if (!listing) {
    return NextResponse.json(
      { error: 'Listing not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(listing);
}

// PUT /api/listings/[id]
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const listingIndex = listings.findIndex(item => item.id.toString() === params.id);
    
    if (listingIndex === -1) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    const updatedListing = { ...listings[listingIndex], ...body };
    listings[listingIndex] = updatedListing;
    
    return NextResponse.json(updatedListing);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE /api/listings/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const listingIndex = listings.findIndex(item => item.id.toString() === params.id);
  
  if (listingIndex === -1) {
    return NextResponse.json(
      { error: 'Listing not found' },
      { status: 404 }
    );
  }

  listings.splice(listingIndex, 1);
  
  return new NextResponse(null, { status: 204 });
}