import { gql, useLazyQuery, useQuery } from '@apollo/client'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native'
import { Book } from '../components/Book'

import { Text, View } from '../components/Themed'
import Colors from '../constants/Colors'
import { RootTabScreenProps } from '../types'

const query = gql`
  query SearchBooks($q: String) {
    googleBooksSearch(q: $q, country: "US") {
      items {
        id
        volumeInfo {
          authors
          averageRating
          description
          imageLinks {
            thumbnail
          }
          title
          subtitle
          industryIdentifiers {
            identifier
            type
          }
        }
      }
    }
    openLibrarySearch(q: $q) {
      docs {
        author_name
        title
        cover_edition_key
        isbn
      }
    }
  }
`

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const [searchedText, setSearchedText] = useState<string>()
  const [provider, setProvider] = useState<
    'googleBooksSearch' | 'openLibrarySearch'
  >('googleBooksSearch')

  const {
    data: initialBooksData,
    loading,
    error,
  } = useQuery(query, {
    variables: { q: 'React Native' },
    onCompleted: (data) => {
      // console.log('Data after resolved the query ', JSON.stringify(data))
    },
  })

  const [
    getSearchBookDetails,
    { data: searchedBooksData, loading: searchingBookDetails },
  ] = useLazyQuery(query)

  const parseBook = (item) => {
    if (provider === 'googleBooksSearch') {
      return {
        title: item.volumeInfo.title,
        image: item.volumeInfo.imageLinks?.thumbnail,
        authors: item.volumeInfo.authors,
        isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier,
      }
    } else {
      return {
        title: item.title,
        authors: item.author_name,
        image: `https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-M.jpg`,
        isbn: item.isbn?.[0],
      }
    }
  }

  return (
    <View style={styles.container}>
      {(loading || searchingBookDetails) && (
        <ActivityIndicator color={'black'} size={'large'} />
      )}
      <View style={styles.header}>
        <TextInput
          value={searchedText}
          onChangeText={setSearchedText}
          placeholder='Search...'
          style={styles.input}
        />
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 6,
          }}
          onPress={() =>
            getSearchBookDetails({ variables: { q: searchedText } })
          }>
          <Text style={{ color: Colors.light.tint }}>Search</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: 50,
        }}>
        <Text
          style={
            provider === 'googleBooksSearch'
              ? { fontWeight: 'bold', color: 'royalblue' }
              : {}
          }
          onPress={() => setProvider('googleBooksSearch')}>
          Google Books
        </Text>
        <Text
          style={
            provider === 'openLibrarySearch'
              ? { fontWeight: 'bold', color: 'royalblue' }
              : {}
          }
          onPress={() => setProvider('openLibrarySearch')}>
          Open Library
        </Text>
      </View>
      <FlatList
        data={
          !searchedText
            ? initialBooksData?.googleBooksSearch?.items
            : provider === 'googleBooksSearch'
            ? searchedBooksData?.googleBooksSearch?.items || []
            : searchedBooksData?.openLibrarySearch?.docs || []
        }
        renderItem={({ item }) => {
          // console.log('Item ', item)
          return <Book book={parseBook(item)} />
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  header: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    borderColor: 'gainsboro',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 8,
  },
})
