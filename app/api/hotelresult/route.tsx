import Amadeus from 'amadeus-ts';
import { NextResponse } from 'next/server';

// Initialize Amadeus client
const amadeusClient = new Amadeus({
    clientId: process.env.NEXT_PUBLIC_AMADEUS_API_KEY,
    clientSecret: process.env.NEXT_PUBLIC_AMADEUS_API_SECRET
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    let checkIn = searchParams.get('checkIn');
    let checkOut = searchParams.get('checkOut');

    if (!hotelId || !checkIn || !checkOut) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {        
        const hotelListResponse = await amadeusClient.shopping.hotelOffersSearch.get({
            hotelIds: hotelId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
        });
        console.log(hotelListResponse);
        return NextResponse.json(hotelListResponse, { status: 200 });        
    } catch (error) {
        if(error) {
            console.log(error);
            return NextResponse.json({ message: 'something went wrong in hotel result backend' }, { status: 404 });
        } else {
            return NextResponse.json({ error: 'failed to fetch hotel offers' }, { status: 500 });
        }
    }
}