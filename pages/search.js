import React from 'react'
import Content from '../src/containers/Search'
import createApp from '../src/createApp'

import reptile from '../src/models/reptile'

export default (props) => {

    const app = createApp({
        models: [reptile],
        component: <Content {...props}/>
    });

    const Component = app.start();
    return (
        <Component />
    );
};