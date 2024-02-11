'use client';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import FirebaseCrud from './firebaseCrud';

export default function Home() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });
  return (
    <div className="p-8">
      <div className='text-white'>Email Id : {session?.data?.user?.email}</div> <br></br>
      <FirebaseCrud/><br></br>
      <button className="px-4 py-2 bg-yellow-500 text-white rounded-md" onClick={() => signOut()}>Logout</button>
    </div>
  )
}

Home.requireAuth = true