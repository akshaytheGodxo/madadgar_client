"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Button } from "@/components/ui/button";

type Request = {
  uid: string;
  name: string;
  email: string;
};

export default function Pending() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    // orgId = current logged in org
    setOrgId(user.uid);

    const fetchRequests = async () => {
      try {
        const orgRef = doc(db, "users", user.uid);
        const snap = await getDoc(orgRef);

        if (snap.exists()) {
          const data = snap.data();
          setRequests(data.pendingRequests || []);
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (request: Request) => {
    if (!orgId) return;
    try {
      const orgRef = doc(db, "users", orgId);

      await updateDoc(orgRef, {
        pendingRequests: arrayRemove(request),
        currentStudents: arrayUnion(request),
      });

      setRequests((prev) => prev.filter((r) => r.uid !== request.uid));
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const handleReject = async (request: Request) => {
    if (!orgId) return;
    try {
      const orgRef = doc(db, "users", orgId);

      await updateDoc(orgRef, {
        pendingRequests: arrayRemove(request),
      });

      setRequests((prev) => prev.filter((r) => r.uid !== request.uid));
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li
              key={req.uid}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-semibold">{req.name}</p>
                <p className="text-sm text-gray-500">{req.email}</p>
              </div>
              <div className="space-x-2">
                <Button
                  onClick={() => handleAccept(req)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Accept
                </Button>
                <Button
                  onClick={() => handleReject(req)}
                  variant="destructive"
                >
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
