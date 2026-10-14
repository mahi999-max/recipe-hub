import { redirect } from 'next/navigation';
import React from 'react';

const UserMainPage = () => {
   redirect('/dashboard/user/overview')
};

export default UserMainPage;