import { NextResponse } from "next/server";

export async function GET(request) {
  const url = process.env.SHEETDB_API_URL;
  const token = process.env.SHEETDB_BEARER_TOKEN;

  if (!url) {
    return NextResponse.json(
      { error: "API URL configuration is missing on the server." },
      { status: 500 }
    );
  }

  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `SheetDB connection error: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const url = process.env.SHEETDB_API_URL;
  const token = process.env.SHEETDB_BEARER_TOKEN;

  if (!url) {
    return NextResponse.json(
      { error: "API URL configuration is missing on the server." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: errorText || res.statusText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
