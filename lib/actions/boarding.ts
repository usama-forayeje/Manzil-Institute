'use server';

import { Query } from 'node-appwrite';
import { createAdminClient } from '@/lib/appwrite/admin';
import { DATABASE_ID, COLLECTIONS } from '@/config/appwrite';
import { revalidatePath } from 'next/cache';

/**
 * Update a student's boarding assignment (Room/Hall)
 */
export async function updateRoomAssignment(params: {
  enrollmentId: string;
  hallId: string;
  hallName: string;
}) {
  try {
    const { databases } = await createAdminClient();
    
    // 1. Get current enrollment to see if they already have a room
    const currentEnrollment = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.STUDENT_ENROLLMENTS,
      params.enrollmentId
    );

    const oldHallId = currentEnrollment.hallId;

    // 2. If changing rooms, decrement old room and increment new room
    if (oldHallId !== params.hallId) {
      // Decrement old room (if exists)
      if (oldHallId && COLLECTIONS.BOARDING_ROOMS) {
        try {
          const oldRoomRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BOARDING_ROOMS, [Query.equal('roomNo', oldHallId)]);
          if (oldRoomRes.total > 0) {
            const room = oldRoomRes.documents[0];
            await databases.updateDocument(DATABASE_ID, COLLECTIONS.BOARDING_ROOMS, room.$id, {
              occupiedSeats: Math.max(0, (room.occupiedSeats || 0) - 1)
            });
          }
        } catch (e) {
          console.error('Failed to decrement old room occupancy:', e);
        }
      }

      // Increment new room
      if (params.hallId && COLLECTIONS.BOARDING_ROOMS) {
        try {
          const newRoomRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BOARDING_ROOMS, [Query.equal('roomNo', params.hallId)]);
          if (newRoomRes.total > 0) {
            const room = newRoomRes.documents[0];
            await databases.updateDocument(DATABASE_ID, COLLECTIONS.BOARDING_ROOMS, room.$id, {
              occupiedSeats: (room.occupiedSeats || 0) + 1
            });
          }
        } catch (e) {
          console.error('Failed to increment new room occupancy:', e);
        }
      }
    }

    // 3. Update the enrollment
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.STUDENT_ENROLLMENTS,
      params.enrollmentId,
      {
        hallId: params.hallId,
        hallName: params.hallName,
      }
    );

    revalidatePath('/dashboard/admin/boarding/students');
    revalidatePath('/dashboard/admin/hall/rooms');
    return { success: true };
  } catch (error: any) {
    console.error('[Boarding Action] Room Assignment Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update a student's boarding type and optionally their monthly fee
 */
export async function updateBoardingType(params: {
  enrollmentId: string;
  boardingTypeId: string;
  monthlyFee?: number;
}) {
  try {
    const { databases } = await createAdminClient();
    
    const payload: any = {
      boardingType: params.boardingTypeId,
    };

    if (params.monthlyFee !== undefined) {
      payload.monthlyFee = Number(params.monthlyFee);
    }

    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.STUDENT_ENROLLMENTS,
      params.enrollmentId,
      payload
    );

    revalidatePath('/dashboard/admin/boarding/students');
    return { success: true };
  } catch (error: any) {
    console.error('[Boarding Action] Boarding Type Update Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Recalculate and sync all room occupancy counts from scratch
 */
export async function syncBoardingCounts() {
  try {
    const { databases } = await createAdminClient();
    
    // 1. Fetch all active student enrollments that have a room assigned
    const enrollmentsRes = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.STUDENT_ENROLLMENTS,
      [
        Query.notEqual('hallId', ''),
        Query.limit(1000) // Adjust if many students
      ]
    );

    const enrollments = enrollmentsRes.documents;
    
    // 2. Aggregate counts per roomNo/hallId
    const counts: Record<string, number> = {};
    enrollments.forEach(enr => {
      if (enr.hallId) {
        counts[enr.hallId] = (counts[enr.hallId] || 0) + 1;
      }
    });

    // 3. Fetch all rooms
    const roomsRes = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.BOARDING_ROOMS,
      [Query.limit(100)]
    );

    // 4. Update each room with the correct count
    for (const room of roomsRes.documents) {
      const actualCount = counts[room.roomNo] || 0;
      if (room.occupiedSeats !== actualCount) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.BOARDING_ROOMS,
          room.$id,
          { occupiedSeats: actualCount }
        );
      }
    }

    revalidatePath('/dashboard/admin/boarding');
    revalidatePath('/dashboard/admin/hall/rooms');
    return { success: true, totalBoarders: enrollments.length };
  } catch (error: any) {
    console.error('[Boarding Action] Sync Error:', error);
    return { success: false, error: error.message };
  }
}
