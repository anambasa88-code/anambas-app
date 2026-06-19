// src/app/api/users/petugas/dashboard/route.js
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { analyticsService } from '@/services/analyticsService';

// Memaksa Next.js untuk selalu mengambil data segar langsung dari server (Tanpa Cache)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  // 1. Validasi Keamanan (Hanya user dengan peran PETUGAS yang diizinkan)
  const currentUser = await getCurrentUser(request);

  if (!currentUser || currentUser.peran !== 'PETUGAS') {
    return NextResponse.json({ error: 'Akses ditolak - hanya untuk petugas' }, { status: 403 });
  }

  try {
    // 2. Tangkap query params tanggal dari URL jika frontend melakukan filtering
    const { searchParams } = new URL(request.url);
    const options = {
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
    };

    // 3. Eksekusi Analytics Service dengan parameter options yang sudah diselaraskan
    const data = await analyticsService.getPetugasUnitSummary(currentUser.bank_sampah_id, options);
    
    // 4. Kirim data hasil query ke frontend
    return NextResponse.json(data);
  } catch (error) {
    // Debugging log jika terjadi error di server console
    console.error('--- ERROR DASHBOARD PETUGAS ---');
    console.error('User:', currentUser?.nama);
    console.error('Unit ID:', currentUser?.bank_sampah_id);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('-----------------------------');

    return NextResponse.json({ 
      error: 'Gagal mengambil data dashboard petugas',
      message: error.message 
    }, { status: 500 });
  }
}