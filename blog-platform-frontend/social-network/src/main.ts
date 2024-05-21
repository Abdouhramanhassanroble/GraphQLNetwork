import { createApp, provide, h } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { createApolloProvider } from '@vue/apollo-option';
import App from './App.vue';
import apolloClient from './graphql/apolloClient';
import router from './router';

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});



app.use(router);
app.use(apolloProvider);
app.mount('#app');
