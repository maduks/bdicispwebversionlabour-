import { NextResponse } from 'next/server';
import { listings as initialListings } from '../../data/listings';

// In-memory store for listings
let listings = [...initialListings];

// GET /api/listings
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  let filteredListings = [...listings];
  
  // Apply filters based on query parameters
  const category = searchParams.get('category');
  const searchTerm = searchParams.get('searchTerm');
  const minRating = searchParams.get('minRating');
  const tags = searchParams.get('tags')?.split(',');
  const sortBy = searchParams.get('sortBy');
  const priceRangeMin = searchParams.get('priceRangeMin');
  const priceRangeMax = searchParams.get('priceRangeMax');

  if (category && category !== 'all') {
    filteredListings = filteredListings.filter(listing => listing.category === category);
  }

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredListings = filteredListings.filter(
      listing =>
        listing.title.toLowerCase().includes(term) ||
        listing.description.toLowerCase().includes(term) ||
        listing.location.toLowerCase().includes(term)
    );
  }

  if (minRating) {
    filteredListings = filteredListings.filter(
      listing => listing.rating >= Number(minRating)
    );
  }

  if (tags && tags.length > 0) {
    filteredListings = filteredListings.filter(
      listing => listing.tags.some(tag => tags.includes(tag))
    );
  }

  if (priceRangeMin && priceRangeMax) {
    filteredListings = filteredListings.filter(listing => {
      const price = Number.parseFloat(listing.price.replace(/[^0-9.]/g, ''));
      return price >= Number(priceRangeMin) && price <= Number(priceRangeMax);
    });
  }

  // Apply sorting
  if (sortBy) {
    switch (sortBy) {
      case 'price-low':
        filteredListings.sort((a, b) => {
          const priceA = Number.parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB = Number.parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filteredListings.sort((a, b) => {
          const priceA = Number.parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB = Number.parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceB - priceA;
        });
        break;
      case 'rating':
        filteredListings.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        filteredListings.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
        break;
    }
  }

  return NextResponse.json(filteredListings);
}

// GET /api/listings/[id]
// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   const listing = listings.find(item => item.id.toString() === params.id);
  
//   if (!listing) {
//     return NextResponse.json(
//       { error: 'Listing not found' },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json(listing);
// }

// POST /api/listings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generate a new ID
    const newId = (Math.max(...listings.map(l => Number(l.id))) + 1).toString();
    
    const newListing = {
      id: newId,
      ...body,
      rating: 0,
      reviews: 0,
      featured: false
    };

    listings.push(newListing);
    
    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// PUT /api/listings/[id]
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const index = listings.findIndex(item => item.id.toString() === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    listings[index] = { ...listings[index], ...body };
    
    return NextResponse.json(listings[index]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE /api/listings/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = listings.findIndex(item => item.id.toString() === params.id);
  
  if (index === -1) {
    return NextResponse.json(
      { error: 'Listing not found' },
      { status: 404 }
    );
  }

  listings.splice(index, 1);
  
  return new NextResponse(null, { status: 204 });
}