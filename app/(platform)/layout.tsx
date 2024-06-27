import { ClerkProvider } from '@clerk/nextjs';
import * as React from 'react';
const Platformlayout = ({
    children 
} : {
    children: React.ReactNode;
}) => {
    return(
        <ClerkProvider>
            {children}
        </ClerkProvider>
    )
}

export default Platformlayout;