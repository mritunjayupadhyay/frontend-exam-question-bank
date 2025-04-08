// app/redux-provider.js
'use client';

import { Provider } from 'react-redux';
import { store } from '../rtk/store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}