import { useRouter } from 'next/router';
import React from 'react';

const AdminHomePage = () => {
    const router = useRouter();
    React.useEffect(() => { router.push('/admin/login') }, []);
}

export default AdminHomePage;