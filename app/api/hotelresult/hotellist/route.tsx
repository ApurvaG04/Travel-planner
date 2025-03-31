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
    const destinationKeyword = searchParams.get('keyword');

    if (!destinationKeyword) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {        
        // 2. Getting Destination Location Code
        const destinationData = await fetch(`${BASE_URL}/api/citycodes?keyword=${destinationKeyword}`);
        const destinationResponse = await destinationData.json();
        if (!destinationResponse.data || destinationResponse.data.length === 0) {
            return NextResponse.json({ error: 'No matching destination found' }, { status: 404 });
        }
        const destinationCode = destinationResponse.data[0].iataCode;
        console.log(destinationCode);
        
        // 3. Fetching hotel List
        const hotelListResponse = await amadeusClient.referenceData.locations.hotels.byCity.get({
            cityCode: destinationCode,
            ratings: '3,4,5',           
        });
        let hotelIdList: string[] = [];
        let hotelNameList: string[] = [];
        if (hotelListResponse.result.data.length > 10) {
            for(let i: number = 0; i < 10; i++) {
                hotelIdList.push(hotelListResponse.result.data[i].hotelId || '');
                hotelNameList.push(hotelListResponse.result.data[i].name || '');
            }
        } else {
            for(let i: number = 0; i < hotelListResponse.result.data.length; i++) {
                hotelIdList.push(hotelListResponse.result.data[i].hotelId || '');
                hotelNameList.push(hotelListResponse.result.data[i].name || '');
            }
        }                
        return NextResponse.json({hotelIdList, hotelNameList}, { status: 200 });        
    } catch (error) {
        if(error) {
            return NextResponse.json({ error: 'Failed to fetch hotel list' }, { status: 500 });
        };
    }
}