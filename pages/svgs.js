import React from 'react'
import dynamic from 'next/dynamic'
import createApp from '../src/createApp'

const DynamicComponentWithNoSSR = dynamic(import('../src/containers/SVGContent'), {
    ssr: false
});

export default (props) => {

    const app = createApp({
        models: [],
        component: <DynamicComponentWithNoSSR {...props}/>
    });

    const Component = app.start();
    return (
        <Component />
    );
};