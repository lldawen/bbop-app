import React, { useState } from 'react';
import UserForm from '@/components/user/userForm';
import { useRouter } from 'next/router';

const UserDetailsPage = () => {
    
    const router = useRouter();
    const { userId } = router.query;
    // const [loading, setLoading] = useState(true);
    // const [userProps, setUserProps] = useState({
    //     id: '',
    //     password: '',
    //     confirmPassword: '',
    //     userDetail: {
    //         firstName: '',
    //         lastName: '',
    //         middleName: '',
    //         gender: '',
    //         birthDate: '',
    //         civilStatus: '',
    //         contactNo1: '',
    //         contactNo2: '',
    //         email: '',
    //         houseBlkNo: '',
    //         district: '',
    //         street: '',
    //     }
    // });

    // React.useEffect(initializeUserDetails, []);

    // function initializeUserDetails() {
    //     fetch(`http://localhost:8081/api/v1/user/get/${userId}`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-type': 'application/json',
    //             // 'Authorization': 'Bearer ' + localStorage.getItem('token')
    //         },
    //     })
    //     .then(response => response.json())
    //     .then(response => updateUserProps(response.data));
    // }

    // function updateUserProps(userData) {
    //     setUserProps((prevState) => {
    //         const userObj = {
    //             ...prevState,
    //             userDetail: prevState.userDetail,
    //         }
    //         userObj.id = userData.id;
    //         userObj.password = 'FFFFF';
    //         userObj.confirmPassword = '';
    //         userObj.userDetail = {
    //             firstName: 'userData.firstName',
    //             lastName: userData.lastName,
    //             middleName: userData.middleName,
    //             gender: userData.gender,
    //             birthDate: userData.birthDate,
    //             civilStatus: userData.civilStatus,
    //             contactNo1: userData.contactNo1,
    //             contactNo2: userData.contactNo2,
    //             email: userData.email,
    //             houseBlkNo: userData.houseBlkNo,
    //             district: userData.district,
    //             street: userData.street,
    //         }
    //         return userObj;
    //     });
    //     console.log('updateUserPropssssss: ', userProps);
    // }

    return (
        <UserForm userId={userId} />
    );
}

export default UserDetailsPage;