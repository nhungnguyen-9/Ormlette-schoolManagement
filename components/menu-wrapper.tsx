import { currentUser } from '@clerk/nextjs/server';
import React from 'react'
import { Menu } from './menu';

export const MenuWrapper = async () => {
    const user = await currentUser();
    const role = user?.publicMetadata.role as string
    return (
        <Menu role={role} />
    )
}
