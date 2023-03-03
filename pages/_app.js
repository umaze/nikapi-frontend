import { Provider } from 'react-redux';
import { AuthProvider } from '@/context/AuthContext';
import { wrapper } from "@/store/store";
import '@/styles/globals.scss';

export default function App({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  return (
    <Provider store={store}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Provider>
  )
}
