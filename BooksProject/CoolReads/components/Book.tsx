import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Book as BookType } from '../types'

type BookItemProps = {
  book: BookType
}
export const Book = ({ book }: BookItemProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: book.image }}
        resizeMode='cover'
        style={styles.image}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text>by {book.authors?.join(', ')}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  image: {
    flex: 1,
    aspectRatio: 2 / 3,
    marginRight: 10,
  },
  contentContainer: {
    flex: 4,
    borderColor: 'lightgray',
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
})
