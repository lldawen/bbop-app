import React from 'react';
import { useRouter } from 'next/router';
import ApplicationForm from '@/components/application/ApplicationForm';

const ApplicationDetailsPage = () => {
    
    const router = useRouter();
    const { applId } = router.query;
    
    return <ApplicationForm applId={applId} />;
}

export default ApplicationDetailsPage;