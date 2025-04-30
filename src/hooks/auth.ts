import { useEffect, useState } from 'react'
import { type Models } from 'appwrite'
import { account } from '@/services/appwrite-client/config'
// import { clubCollection, db } from "@/name";

// async function saveUserToDB(user: Models.User<Models.Preferences>) {
// 	try {
// 		const existingUser = await database.getDocument(
// 			db,
// 			clubCollection,
// 			user.$id
// 		);
// 		console.log("user already exists");
// 		return { success: true, user: existingUser };
// 	} catch (error: any) {
// 		if (error.code === 404) {
// 			const newUser = await database.createDocument(
// 				db,
// 				clubCollection,
// 				user.$id,
// 				{
// 					email: user.email,
// 					userName: user.name,
// 					name: `${user.name}'s Club`,
// 					id: user.$id,
// 				}
// 			);

// 			console.log("Created new user");
// 			return { success: true, user: newUser };
// 		}

// 		return { success: false, error };
// 	}
// }

export function useAuth() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    account
      .get()
      .then(async (currentUser) => {
        setUser(currentUser)
        console.log(currentUser)
        // Save user database when authenticated
        // await saveUserToDB(currentUser);
      })
      .catch((error: any) => {
        console.log(error.message)
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { user, loading }
}
