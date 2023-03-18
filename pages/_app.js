import {Provider} from 'react-redux';
import {AuthProvider} from '@/context/AuthContext';
import {wrapper} from "@/store/store";
import '@/styles/globals.scss';
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

export default function App({Component, ...rest}) {
    const {store, props} = wrapper.useWrappedStore(rest);
    const {pageProps} = props;
    return (
        <Provider store={store}>
            <AuthProvider>
                <DndProvider backend={HTML5Backend}>
                    <Component {...pageProps} />
                </DndProvider>
            </AuthProvider>
        </Provider>
    )
}
