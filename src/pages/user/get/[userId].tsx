import React from 'react';
import UserForm from '@/components/user/userForm';
import { useRouter } from 'next/router';

const UserDetailsPage = () => {
    
    const router = useRouter();
    const { userId } = router.query;
    
    return <UserForm userId={userId} />;
}

export default UserDetailsPage;