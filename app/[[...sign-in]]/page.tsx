'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { isLoaded, isSignedIn, user } = useUser()

  const router = useRouter()

  useEffect(() => {
    const role = user?.publicMetadata.role
    if (role) {
      router.push(`/${role}`)
    }
  }, [user, router])

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="relative bg-white p-12 rounded-xl shadow-2xl flex flex-col gap-2 z-10"
        >
          <div className="flex justify-center items-center">
            <Image src="/new.png" alt="" width={120} height={120} />
          </div>
          <h2 className="text-gray-400">Sign in to your account</h2>
          <Clerk.GlobalError className="text-sm text-red-400" />
          <Clerk.Field name="identifier" className="flex flex-col gap-2 mt-1">
            <Clerk.Label className="text-xs text-gray-500">Email</Clerk.Label>
            <Clerk.Input
              type="email"
              required
              className="p-2 rounded-xl ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>
          <Clerk.Field name="password" className="flex flex-col gap-2 mt-1">
            <Clerk.Label className="text-xs text-gray-500">Password</Clerk.Label>
            <Clerk.Input
              type="password"
              required
              className="p-2 rounded-xl ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>
          <SignIn.Action
            submit
            className="bg-blue-500 text-white my-2 rounded-xl text-sm p-[10px]"
          >
            Sign In
          </SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>

  )
}