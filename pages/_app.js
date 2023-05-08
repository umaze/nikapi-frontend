import {Provider} from 'react-redux';
import {AuthProvider} from '@/context/AuthContext';
import {MantineProvider} from '@mantine/core';
import {wrapper} from "@/store/store";
import '@/styles/globals.scss';
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useEffect, useState} from "react";
import {Router} from "next/router";
import Loader from "@/components/Loader";

export default function App({Component, ...rest}) {
    const [isLoading, setIsLoading] = useState(false);
    const {store, props} = wrapper.useWrappedStore(rest);
    const {pageProps} = props;

    useEffect(() => {
        Router.events.on("routeChangeStart", (url)=>{
            setIsLoading(true)
        });

        Router.events.on("routeChangeComplete", (url)=>{
            setIsLoading(false)
        });

        Router.events.on("routeChangeError", (url) =>{
            setIsLoading(false)
        });

    }, [Router])

    return (
        <Provider store={store}>
            <ToastContainer />
            <AuthProvider>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        /** Put your mantine theme override here */
                        colorScheme: 'light',
                    }}>
                    <DndProvider backend={HTML5Backend}>
                        {isLoading && <Loader/>}
                        <Component {...pageProps} />
                    </DndProvider>
                </MantineProvider>
            </AuthProvider>
        </Provider>
    )
}
