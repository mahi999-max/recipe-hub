import { redirect } from 'next/navigation';
import React from 'react';

const AdminMainPage = () => {
   redirect('/dashboard/admin/overview')
};

export default AdminMainPage;