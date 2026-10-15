import { redirect } from 'next/navigation';
import React from 'react';

const UserMainPage = () => {
   redirect('/dashboard/admin/users')
};

export default UserMainPage;