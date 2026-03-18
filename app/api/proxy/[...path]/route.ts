import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathStr = path.join('/');
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${pathStr}`;

  const formData = await request.formData();

  const response = await fetch(backendUrl, {
    method: 'POST',
    body: formData,
    headers: {
      'X-API-KEY': process.env.APP_API_KEY as string
    }
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathStr = path.join('/');
  const { searchParams } = new URL(request.url);
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${pathStr}?${searchParams.toString()}`;

  const response = await fetch(backendUrl, {
    method: 'GET',
    headers: {
      'X-API-KEY': process.env.APP_API_KEY as string
    }
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathStr = path.join('/');
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${pathStr}`;

  const response = await fetch(backendUrl, {
    method: 'DELETE',
    headers: {
      'X-API-KEY': process.env.APP_API_KEY as string
    }
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
