import React from 'react'
import Content from '../src/containers/Read'
import createApp from '../src/createApp'

import book from '../src/models/book'
import reptile from '../src/models/reptile'

export default (props) => {

    const app = createApp({
        models: [book, reptile],
        component: <Content {...props}/>
    });

    const Component = app.start();
    return (
        <Component />
    );
};