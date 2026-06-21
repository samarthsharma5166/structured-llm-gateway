import { NextResponse } from "next/server"

const BACKEND_URL=process.env.NEXT_PUBLIC_BACKEND_URL

export async function POST(req:Request) {
    try {
        const body = await req.json();
        
        const response = await fetch(`${BACKEND_URL}/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("Backend error response status:", response.status, data);
            return NextResponse.json({
                error: data.error || "Backend query failed",
                details: data.details || null,
                status: response.status
            }, { status: response.status });
        }
        return NextResponse.json({
            data,
            status: response.status
        });
    } catch (error: any) {
        console.error("Exception in Next.js API /api/ask route:", error);
        return NextResponse.json({
            error: error.message || "Failed to communicate with API server",
            status: 500
        }, { status: 500 });
    }
}