import { NextResponse } from 'next/server';

let weatherResponse: object = {};
export async function POST(request: Request) {   
    const body = await request.json();   
    const { toPlace } = body;
    const { lat, lng } = toPlace.geometry?.location;
    const apiKey = process.env.WEATHER_API_KEY!; 
    const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lng}&cnt=7&appid=${apiKey}&units=metric`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();
    if (weatherData.cod === 404) {
        return NextResponse.json({message: 'Something went wrong in weather response.'}, {status: 404});
    }
    weatherResponse = weatherData;
    return new Response(JSON.stringify({ message: 'Successful response from weather API' }), {status: 200});
}

export async function GET() {     
    if (weatherResponse) {
        return NextResponse.json({props: {weatherResponse}}, {status: 200}); 
    } else {
        return NextResponse.json({message: 'Something went wrong in weather response.'}, {status: 404});
    }   
}
