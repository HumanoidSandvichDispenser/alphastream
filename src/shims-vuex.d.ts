import Vuex from 'vuex';
import { IRootState } from './store/types';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Vuex.Store<IRootState>;
  }
}
