"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"

interface Student {
  uid: string
  name: string
  email: string
  modulesCompleted: number
}

export default function TrackStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const auth = getAuth()
        const currentUser = auth.currentUser
        if (!currentUser) {
          console.error("No logged in org")
          setLoading(false)
          return
        }

        // 1. Fetch organization doc from `users/{orgUid}`
        const orgRef = doc(db, "users", currentUser.uid)
        const orgSnap = await getDoc(orgRef)

        if (orgSnap.exists()) {
          const orgData = orgSnap.data()
          const currentStudents = orgData.currentStudents || []

          // 2. Fetch each student doc
          const fetchedStudents: Student[] = []
          for (const stu of currentStudents) {
            const stuRef = doc(db, "users", stu.uid)
            const stuSnap = await getDoc(stuRef)

            if (stuSnap.exists()) {
              const stuData = stuSnap.data()
              fetchedStudents.push({
                uid: stu.uid,
                name: stuData.name || "Unknown",
                email: stuData.email || "",
                modulesCompleted: stuData.modulesCompleted || 0,
              })
            }
          }

          setStudents(fetchedStudents)
        }
      } catch (err) {
        console.error("Error fetching students:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  if (loading) return <p className="text-gray-500">Loading students...</p>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📚 Current Students</h2>
      {students.length === 0 ? (
        <p className="text-gray-600">No students found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Modules Completed</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => (
                <tr key={stu.uid} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{stu.name}</td>
                  <td className="px-4 py-2 border">{stu.email}</td>
                  <td className="px-4 py-2 border text-center">
                    {stu.modulesCompleted}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
