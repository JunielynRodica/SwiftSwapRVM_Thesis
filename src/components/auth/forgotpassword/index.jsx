import React, { useEffect, useState } from 'react';
import { Navigate, Link, useSearchParams } from 'react-router-dom';

import { useAuth } from '../../../contexts/authContext';

const ForgotPassword = () => {
    const { userLoggedIn } = useAuth();

    return (
        <div>
            {userLoggedIn && <Navigate to={'/dashboard'} replace={true} />}
            <main>

            </main>
        </div>
    );
};

export default ForgotPassword;
