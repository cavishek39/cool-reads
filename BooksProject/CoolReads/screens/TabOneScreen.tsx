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
      <FlatList
        data={
          !searchedText
            ? initialBooksData?.googleBooksSearch?.items
            : searchedBooksData?.googleBooksSearch?.items || []
        }
        renderItem={({ item }) => {
          // console.log('Item ', item)
          return (
            <Book
              book={{
                title: item.volumeInfo.title,
                image: item.volumeInfo.imageLinks.thumbnail,
                authors: item.volumeInfo.authors,
              }}
            />
          )
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
