import {Provider} from 'react-redux';
import {AuthProvider} from '@/context/AuthContext';
import {MantineProvider} from '@mantine/core';
import {wrapper} from "@/store/store";
import '@/styles/globals.scss';
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function App({Component, ...rest}) {
    const {store, props} = wrapper.useWrappedStore(rest);
    const {pageProps} = props;
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
                        <Component {...pageProps} />
                    </DndProvider>
                </MantineProvider>
            </AuthProvider>
        </Provider>
    )
}
