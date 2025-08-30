"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { getAuth } from "firebase/auth"

type Org = {
  id: string
  name: string
  email: string
}

export default function ChooseOrg() {
  const [orgs, setOrgs] = useState<Org[]>([])
  const auth = getAuth()

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const q = query(collection(db, "users"), where("type", "==", "organization"))
        const snapshot = await getDocs(q)

        const data: Org[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as { name: string; email: string }),
        }))
        setOrgs(data)
      } catch (err) {
        console.error("Error fetching orgs:", err)
      }
    }

    fetchOrgs()
  }, [])

  const sendRequest = async (orgId: string) => {
    try {
      const user = auth.currentUser
      if (!user) return alert("You must be logged in.")

      const orgRef = doc(db, "users", orgId)

      await updateDoc(orgRef, {
        pendingRequests: arrayUnion({
          uid: user.uid,
          email: user.email,
          name: user.displayName || "",
        }),
      })

      alert("Request sent successfully!")
    } catch (err) {
      console.error("Error sending request:", err)
    }
  }

  return (
    <div className="p-8  min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 text-green-500">Choose an Organisation</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orgs.map((org) => (
          <div
            key={org.id}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-all"
          >
            <div>
              <h2 className="text-xl font-semibold text-green-600">{org.name}</h2>
              <p className="text-sm text-gray-700 mt-1">{org.email}</p>
            </div>
            <Button
              onClick={() => sendRequest(org.id)}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-xl"
            >
              Request to Join
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
