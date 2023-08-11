import type { PageServerLoad } from "./$types";
import { adminAuth, adminDB } from "$lib/server/admin";
import { error, redirect, type Actions, fail } from "@sveltejs/kit";

export const load = (async ({ locals, params }) => {

    const uid = locals.userID;

    if (!uid) {
      throw redirect(301, "/login");
    }
  
    const userDoc = await adminDB.collection("users").doc(uid).get();
    const { username, bio } = userDoc.data()!;
  
    if (params.username !== username) {
      throw error(401, "Det användarnamnet tillhör inte dig");
    }
  
  
    return {
      bio,
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ locals, request, params }) => {

      const uid = locals.userID;

      const data = await request.formData();
      const bio = data.get('bio');
  
      const userRef = adminDB.collection("users").doc(uid!);
      const { username } = (await userRef.get()).data()!;
  
      if (params.username !== username) {
        throw error(401, "Det användarnamnet tillhör inte dig");
      }
  
      if (bio!.length > 260) {
        return fail(400, { problem: "Din bio får inte vara längre än 260 tecken" });
      }
  
      await userRef.update({
        bio,
      });
    },
  } satisfies Actions;