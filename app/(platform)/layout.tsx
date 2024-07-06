import { ModalProvider } from '@/components/providers/modal-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { ClerkProvider } from '@clerk/nextjs';
import * as React from 'react';
import {Toaster} from "sonner"
const Platformlayout = ({
    children 
} : {
    children: React.ReactNode;
}) => {
    return(
        <ClerkProvider>
            <QueryProvider>
            <Toaster />
            <ModalProvider />
            {children}
            </QueryProvider>
        </ClerkProvider>
    )
}

export default Platformlayout;