import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'

const API_KEY =
  'kingsville::stepzen.net+1000::1e28cca905cf3a9ac715ef85c47d8eda85790ecb8490816ae8e0d6caf75571c7'

const URI = 'https://kingsville.stepzen.net/api/listening-billygoat/__graphql'

// Initialize Apollo Client
const client = new ApolloClient({
  uri: URI,
  headers: {
    Authorization: `Apikey ${API_KEY}`,
  },
  cache: new InMemoryCache(),
})

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <ApolloProvider client={client}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </ApolloProvider>
    )
  }
}
