import Amadeus from 'amadeus-ts';
import { NextResponse } from 'next/server';

const amadeusClient = new Amadeus({
    clientId: process.env.NEXT_PUBLIC_AMADEUS_API_KEY,
    clientSecret: process.env.NEXT_PUBLIC_AMADEUS_API_SECRET
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    
    if (!keyword) {
        return Response.json({ error: 'Missing keyword parameter' }, { status: 400 });
    }

    try {
        const response = await amadeusClient.referenceData.locations.get({
            keyword,
            subType: Amadeus.location.any 
        });
        return NextResponse.json(response.result, { status: 200 });      
    } catch (error) {
        if(error) {
            return NextResponse.json({ error: 'Failed to fetch location codes' }, { status: 500 });
        }; 
    }
}