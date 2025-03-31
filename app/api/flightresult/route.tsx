import Amadeus from 'amadeus-ts';
import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXTAUTH_URL;
// Initialize Amadeus client
const amadeusClient = new Amadeus({
    clientId: process.env.NEXT_PUBLIC_AMADEUS_API_KEY,
    clientSecret: process.env.NEXT_PUBLIC_AMADEUS_API_SECRET
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const originKeyword = searchParams.get('originKeyword'); // Location name
    const destinationKeyword = searchParams.get('destinationKeyword');
    let dateOfDeparture = searchParams.get('dateOfDeparture');

    if (!originKeyword || !destinationKeyword || !dateOfDeparture) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
        // 1. Getting Origin Location Code
        const data = await fetch(`${BASE_URL}/api/citycodes?keyword=${originKeyword}`);        
        const originResponse = await data.json();
        if (!originResponse.data || originResponse.data.length === 0) {
            return NextResponse.json({ error: 'No matching origin found' }, { status: 404 });
        }
        const originCode = originResponse.data[0].iataCode;
        
        // 2. Getting Destination Location Code
        const destinationData = await fetch(`${BASE_URL}/api/citycodes?keyword=${destinationKeyword}`);
        const destinationResponse = await destinationData.json();
        if (!destinationResponse.data || destinationResponse.data.length === 0) {
            return NextResponse.json({ error: 'No matching destination found' }, { status: 404 });
        }
        const destinationCode = destinationResponse.data[0].iataCode;

        // 3. Fetching Flight Offers
        const flightResponse = await amadeusClient.shopping.flightOffersSearch.get({
            originLocationCode: originCode,
            destinationLocationCode: destinationCode,
            departureDate: dateOfDeparture,
            adults: 1,
            max: 5 
        });
        return NextResponse.json(flightResponse.result, { status: 200 });
    } catch (error) {
        if(error) {
            return NextResponse.json({ error: 'Failed to fetch flight results' }, { status: 500 });
        };
    }
}