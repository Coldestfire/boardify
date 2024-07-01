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
            <Toaster />
            {children}
        </ClerkProvider>
    )
}

export default Platformlayout;