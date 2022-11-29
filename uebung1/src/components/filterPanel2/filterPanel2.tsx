import React from 'react';
import { GlobalContextManager } from '../globalContext/globalContext';
import MyFilterPanel2 from '../multiFilter/myFilterPanel';

export default function filterPanel2() {

    const { columns } = React.useContext(GlobalContextManager);

    return <MyFilterPanel2 columns={columns} />
}