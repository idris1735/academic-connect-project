'use client'

import { useEffect, useState } from 'react';
import { IndividualProfilePage } from "@/components/IndividualProfile";
import NavComponent from '../../../components/NavComponent';
import { useSearchParams } from 'next/navigation';
import { Check, X, Loader2 } from "lucide-react"

export default function IndividualProfilePreview() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  useEffect(() => {
    const fetchProfile = async () => {
      try {

        const response = await fetch('/api/profile/individual');

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavComponent />
        <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-900" />
          <div className="mt-4 text-lg">Loading</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavComponent />
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <NavComponent />
      <div className="container mx-auto px-4 py-8">
        <IndividualProfilePage data={profileData} />
      </div>
    </div>
  );
}


